/**
 * Migration Script: Migrate db.json records into Cloudflare D1 SQL Schema
 * Cleans out ephemeral test accounts and generates seed migration SQL.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', `db.json.backup-${Date.now()}`);
const SEED_SQL_PATH = path.join(__dirname, '..', 'migrations', '0004_seed_data.sql');

console.log('🚀 Starting db.json to Cloudflare D1 migration...');

if (!fs.existsSync(DB_PATH)) {
  console.error('❌ data/db.json not found!');
  process.exit(1);
}

const raw = fs.readFileSync(DB_PATH, 'utf8');
const data = JSON.parse(raw);

// 1. Create a backup of the current db.json before pruning
fs.writeFileSync(BACKUP_PATH, raw, 'utf8');
console.log(`💾 Saved backup of raw db.json to ${BACKUP_PATH}`);

// 2. Identify legitimate users (exclude test.com and synthetic test run accounts)
const realUsers = (data.users || []).filter((u) => {
  if (!u.email) return false;
  const email = u.email.toLowerCase();
  if (email.endsWith('@test.com') || email.includes('test_') || email.endsWith('@example.com')) {
    return false;
  }
  return true;
});

// Always ensure Super Admin is present
let adminUser = realUsers.find((u) => u.email === 'admin@islamicstudies.org');
if (!adminUser) {
  adminUser = {
    uid: 'admin_master_1',
    email: 'admin@islamicstudies.org',
    passwordHash: '$2b$10$wuVcdExo3ApKH8FGSL0O5OGileAnh3PCDOGldN8E07TytkWura/te', // Admin@Islam2026!
    displayName: 'Portal Administrator',
    role: 'super_admin',
    provider: 'local',
    isVerified: true,
    verificationToken: '9c2586613f0cf379d99049c6e31397adeae7509a7616edb0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  realUsers.unshift(adminUser);
}

const validUserUids = new Set(realUsers.map((u) => u.uid));
console.log(
  `✅ Filtered legitimate users (${realUsers.length} users):`,
  realUsers.map((u) => u.email)
);

// 3. Children profiles
let realChildren = (data.children || []).filter((c) => validUserUids.has(c.parentUid));

// If no children for admin, add authentic standard child profiles (Zayd & Maryam)
if (realChildren.length === 0) {
  realChildren = [
    {
      id: 'child_zayd_1',
      parentUid: adminUser.uid,
      name: 'Zayd',
      avatar: '🌟',
      assignedTrack: 'level1',
      pinHash: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'child_maryam_2',
      parentUid: adminUser.uid,
      name: 'Maryam',
      avatar: '🌸',
      assignedTrack: 'level2',
      pinHash: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
const validChildIds = new Set(realChildren.map((c) => c.id));
console.log(
  `✅ Filtered children (${realChildren.length} children):`,
  realChildren.map((c) => c.name)
);

// 4. Progress records
const sqlStatements = [
  '-- Seed Data Migrated from db.json',
  '-- Idempotent INSERT OR IGNORE statements for Users, Children, Progress, and Quizzes'
];

// Helper to escape SQL single quotes
function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Users SQL
for (const u of realUsers) {
  sqlStatements.push(
    `INSERT OR IGNORE INTO users (uid, email, display_name, role, is_verified, provider, password_hash, created_at, updated_at) VALUES (${esc(u.uid)}, ${esc(u.email)}, ${esc(u.displayName)}, ${esc(u.role || 'parent')}, ${u.isVerified ? 1 : 0}, ${esc(u.provider || 'local')}, ${esc(u.passwordHash || '')}, ${esc(u.createdAt || new Date().toISOString())}, ${esc(u.updatedAt || new Date().toISOString())});`
  );
}

// Children SQL
for (const c of realChildren) {
  sqlStatements.push(
    `INSERT OR IGNORE INTO children (id, parent_uid, name, avatar, assigned_track, pin_hash, created_at, updated_at) VALUES (${esc(c.id)}, ${esc(c.parentUid)}, ${esc(c.name)}, ${esc(c.avatar || '🌟')}, ${esc(c.assignedTrack || 'level1')}, ${esc(c.pinHash)}, ${esc(c.createdAt || new Date().toISOString())}, ${esc(c.updatedAt || new Date().toISOString())});`
  );
}

// Clean progress
const cleanProgress = {};
if (data.progress && typeof data.progress === 'object') {
  for (const [key, val] of Object.entries(data.progress)) {
    let studentId = null;
    let track = 'level1';
    if (key.startsWith('child_')) {
      const cId = key.replace('child_', '');
      if (validChildIds.has(cId)) {
        studentId = cId;
        const child = realChildren.find((c) => c.id === cId);
        track = child?.assignedTrack || 'level1';
      }
    } else if (key.startsWith('user_')) {
      const uId = key.replace('user_', '');
      if (validUserUids.has(uId)) {
        studentId = uId;
      }
    }

    if (studentId && val && typeof val === 'object') {
      cleanProgress[key] = val;
      for (const [modKey, isCompleted] of Object.entries(val)) {
        if (isCompleted) {
          const modId = parseInt(modKey.replace('mod_', ''), 10);
          if (!isNaN(modId)) {
            const progId = `prog_${studentId}_m${modId}`;
            sqlStatements.push(
              `INSERT OR IGNORE INTO module_progress (id, student_id, module_id, level, completed, updated_at) VALUES (${esc(progId)}, ${esc(studentId)}, ${modId}, ${esc(track)}, 1, CURRENT_TIMESTAMP);`
            );
          }
        }
      }
    }
  }
}

// Clean quiz results
const cleanQuizResults = (data.quizResults || []).filter((q) => {
  return (q.uid && validUserUids.has(q.uid)) || (q.childId && validChildIds.has(q.childId));
});

for (const q of cleanQuizResults) {
  const studentId = q.childId || q.uid;
  const qId = q.id || `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  sqlStatements.push(
    `INSERT OR IGNORE INTO quiz_results (id, student_id, module_id, level, score, total, percentage, passed, created_at) VALUES (${esc(qId)}, ${esc(studentId)}, ${q.moduleId || 1}, ${esc(q.track || 'level1')}, ${q.score || 0}, ${q.total || 0}, ${q.percentage || 0}, ${q.passed ? 1 : 0}, ${esc(q.createdAt || new Date().toISOString())});`
  );
}

// 5. Write SQL migration file
fs.writeFileSync(SEED_SQL_PATH, sqlStatements.join('\n') + '\n', 'utf8');
console.log(`📄 Generated D1 Seed Migration SQL: ${SEED_SQL_PATH}`);

// 6. Write pruned data back to data/db.json
const cleanDbJson = {
  users: realUsers,
  children: realChildren,
  quizResults: cleanQuizResults,
  progress: cleanProgress,
  reflections: [],
  auditLogs: []
};
fs.writeFileSync(DB_PATH, JSON.stringify(cleanDbJson, null, 2), 'utf8');
console.log(
  `✨ Pruned data/db.json saved (${realUsers.length} users, ${realChildren.length} children, ${cleanQuizResults.length} quiz results).`
);

// 7. Execute SQL on local D1
try {
  console.log('⚡ Applying seed SQL to local Cloudflare D1 database...');
  execSync(`npx wrangler d1 execute islamic-studies-db --local --file="${SEED_SQL_PATH}"`, {
    stdio: 'inherit'
  });
  console.log('🎉 Local D1 Seed Complete!');
} catch (err) {
  console.error('⚠️ Could not run wrangler local D1 seed automatically:', err.message);
}
