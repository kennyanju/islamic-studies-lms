const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const targetPath = path.join(__dirname, '..', 'data', 'db.json');
console.log('Target DB path:', targetPath);

const db = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

const superEmail = 'kennyanju@gmail.com';
const superPassword = '123456';
const passwordHash = bcrypt.hashSync(superPassword, 10);
const superUid = 'super_learner_kennyanju';
const now = new Date().toISOString();

// Check if user already exists
const existingIdx = db.users.findIndex((u) => u.email && u.email.toLowerCase() === superEmail);
const superUser = {
  uid: superUid,
  email: superEmail,
  passwordHash: passwordHash,
  displayName: 'Super Learner',
  role: 'super_admin',
  provider: 'password',
  photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(superEmail)}`,
  isVerified: true,
  createdAt: now,
  updatedAt: now
};

if (existingIdx >= 0) {
  db.users[existingIdx] = {
    ...db.users[existingIdx],
    ...superUser,
    uid: db.users[existingIdx].uid || superUid
  };
  console.log('Updated existing user:', superEmail);
} else {
  db.users.unshift(superUser);
  console.log('Inserted new super learner user:', superEmail);
}

const activeUid = existingIdx >= 0 ? (db.users[existingIdx].uid || superUid) : superUid;

// 5 learner profiles for all 5 tracks
const learnerProfiles = [
  { id: 'child_kenny_level1', name: 'Level 1 Learner (Ages 6–8)', track: 'level1', avatar: '🌱' },
  { id: 'child_kenny_level2', name: 'Level 2 Learner (Ages 8–10)', track: 'level2', avatar: '🌿' },
  { id: 'child_kenny_level3', name: 'Level 3 Learner (Ages 10–12)', track: 'level3', avatar: '📘' },
  { id: 'child_kenny_level4', name: 'Level 4 Learner (Ages 12–14)', track: 'level4', avatar: '📖' },
  { id: 'child_kenny_level5', name: 'Level 5 Learner (Ages 14–16+)', track: 'level5', avatar: '🎓' }
];

if (!db.children) db.children = [];

for (const p of learnerProfiles) {
  const cIdx = db.children.findIndex((c) => c.parentUid === activeUid && (c.id === p.id || c.assignedTrack === p.track));
  const childRecord = {
    id: p.id,
    parentUid: activeUid,
    name: p.name,
    avatar: p.avatar,
    assignedTrack: p.track,
    pinHash: null,
    createdAt: now,
    updatedAt: now
  };
  if (cIdx >= 0) {
    db.children[cIdx] = { ...db.children[cIdx], ...childRecord };
    console.log(`Updated child profile for ${p.track}: ${p.name}`);
  } else {
    db.children.push(childRecord);
    console.log(`Created child profile for ${p.track}: ${p.name}`);
  }
}

fs.writeFileSync(targetPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully saved database with Super Learner profile and 5 track child profiles!');
