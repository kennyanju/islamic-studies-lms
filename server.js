const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const db = require('./lib/db');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const isProd = process.env.NODE_ENV === 'production';

// Production & Development SESSION_SECRET configuration
let SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET || SESSION_SECRET.length < 16) {
  if (isProd) {
    console.warn('⚠️ [SECURITY WARNING] SESSION_SECRET not provided in production environment. Auto-generating secure instance secret.');
  }
  SESSION_SECRET = require('crypto').randomBytes(32).toString('hex');
}

const BCRYPT_ROUNDS = 10;
const MAX_FIELD_LENGTH = 500;

// Initialize Database Adapter
db.init();

// Seed default Super Admin if not already present
(async function seedAdmin() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@islamicstudies.org').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Islam2026!';
    const existing = await db.findUserByEmail(adminEmail);
    if (!existing) {
      const passwordHash = await bcrypt.hash(adminPassword, BCRYPT_ROUNDS);
      await db.createUser({
        uid: 'admin_master_1',
        email: adminEmail,
        displayName: 'Portal Administrator',
        role: 'super_admin',
        isVerified: true,
        provider: 'local',
        passwordHash
      });
      console.log(`🛡️ [ADMIN SEED] Super Admin initialized (${adminEmail})`);
    }
  } catch (e) {
    console.error('Error seeding admin account:', e);
  }
})();

/* ==========================================================================
   Request Logging & Security Middleware
   ========================================================================== */

// Morgan HTTP logger
app.use(morgan(isProd ? 'combined' : 'dev'));

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "api.dicebear.com", "https:"],
      connectSrc: ["'self'", "https:", "http:"],
    }
  }
}));

// Gzip compression
app.use(compression());

// General API Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Stricter rate limit on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { success: false, error: 'Too many authentication attempts, please try again later.' }
});
app.use('/api/auth/', authLimiter);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Session management
app.use(session({
  secret: SESSION_SECRET || 'islamic-studies-lms-dev-secret-key-12345',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Static files with Cache-Control headers (sw.js & HTML kept fresh)
app.use(express.static(publicDir, {
  maxAge: isProd ? '7d' : '0',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('sw.js') || filePath.endsWith('manifest.json')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

/* ==========================================================================
   Failed Login Lockout Tracker (5 failed attempts -> 15 min lockout)
   ========================================================================== */

const failedLoginAttempts = new Map();

function checkLoginLockout(key) {
  const record = failedLoginAttempts.get(key);
  if (!record) return false;
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const minutesLeft = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return minutesLeft;
  }
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    failedLoginAttempts.delete(key);
    return false;
  }
  return false;
}

function recordFailedLogin(key) {
  let record = failedLoginAttempts.get(key) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 min lockout
  }
  failedLoginAttempts.set(key, record);
}

function clearFailedLogin(key) {
  failedLoginAttempts.delete(key);
}

/* ==========================================================================
   Input Sanitization & Safe Data Projection
   ========================================================================== */

function sanitizeStr(str, maxLen = MAX_FIELD_LENGTH) {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLen);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

function safeChild(child) {
  if (!child) return null;
  const { pinHash, ...safe } = child;
  safe.hasPin = !!(child.pinHash && child.pinHash.length > 0);
  return safe;
}

/* ==========================================================================
   Module Validation Middleware
   ========================================================================== */

let compiledCourseData = null;
const dataFile = path.join(publicDir, 'course_data.json');

function loadCompiledCourseData() {
  if (fs.existsSync(dataFile)) {
    try {
      compiledCourseData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (e) {
      console.error('Failed to parse course_data.json:', e);
    }
  } else {
    console.log('course_data.json missing. Running compiler...');
    require('./compile.js');
    if (fs.existsSync(dataFile)) {
      compiledCourseData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }
  }
}
loadCompiledCourseData();

function validateModuleId(req, res, next) {
  const modId = parseInt(req.params.moduleId || req.body.moduleId || req.query.moduleId, 10);
  if (isNaN(modId) || modId < 1 || modId > 9) {
    return res.status(400).json({ success: false, error: 'Invalid moduleId. Must be an integer between 1 and 9.' });
  }
  if (compiledCourseData && compiledCourseData.modules) {
    const exists = compiledCourseData.modules.some(m => m.id === modId);
    if (!exists) {
      return res.status(404).json({ success: false, error: `Module ${modId} does not exist in curriculum.` });
    }
  }
  req.validModuleId = modId;
  next();
}

/* ==========================================================================
   Auth & Role Middleware
   ========================================================================== */

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please sign in.' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  if (req.session.user.role !== 'super_admin') {
    return res.status(403).json({ success: false, error: 'Administrator privileges required.' });
  }
  next();
}

function requireParentOwnership(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  if (req.session.user.role === 'super_admin') {
    return next();
  }
  const parentUid = req.query.parentUid || req.body.parentUid;
  if (parentUid && parentUid !== req.session.user.uid) {
    return res.status(403).json({ success: false, error: 'You can only access your own family data.' });
  }
  next();
}

/* ==========================================================================
   Course Data API
   ========================================================================== */

app.get('/api/course-data', (req, res) => {
  if (fs.existsSync(dataFile)) {
    res.sendFile(dataFile);
  } else {
    res.status(404).json({ success: false, error: 'Course data not found. Run npm run build first.' });
  }
});

/* ==========================================================================
   Authentication API
   ========================================================================== */

// Register (Email + Password)
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const email = sanitizeStr(req.body.email, 254).toLowerCase();
    const password = req.body.password;
    const displayName = sanitizeStr(req.body.displayName, 100);

    if (!email || !password || !displayName) {
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }
    if (password.length > 128) {
      return res.status(400).json({ success: false, error: 'Password is too long.' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists. Please sign in instead.' });
    }

    const assignedRole = (req.body.role === 'teacher' || req.body.role === 'educator') ? 'teacher' : 'parent';
    const passwordHash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
    const newUser = await db.createUser({
      email,
      passwordHash,
      displayName,
      role: assignedRole,
      provider: 'password',
      isVerified: false
    });

    req.session.user = safeUser(newUser);
    res.json({ success: true, user: safeUser(newUser) });
  } catch (err) {
    next(err);
  }
});

// Login (Email + Password) with Rate-Limit Lockout
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = sanitizeStr(req.body.email, 254).toLowerCase();
    const password = req.body.password;
    const ip = req.ip || req.connection.remoteAddress;
    const lockoutKey = `${ip}_${email}`;

    // Check lockout
    const minutesLeft = checkLoginLockout(lockoutKey);
    if (minutesLeft) {
      return res.status(429).json({
        success: false,
        error: `Account temporarily locked due to 5 consecutive failed attempts. Please try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`
      });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await db.findUserByEmail(email);
    if (!user || !user.passwordHash || !bcrypt.compareSync(password, user.passwordHash)) {
      recordFailedLogin(lockoutKey);
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Success - clear lockout counter
    clearFailedLogin(lockoutKey);
    await db.updateUser(user.uid, { lastLogin: new Date().toISOString() });

    req.session.user = safeUser(user);
    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
});

// Federated Auth Sync (Google/Apple/Microsoft)
app.post('/api/auth/sync', async (req, res, next) => {
  try {
    const { uid, email, displayName, photoURL, provider } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ success: false, error: 'UID and Email are required.' });
    }

    const cleanEmail = sanitizeStr(email, 254).toLowerCase();
    const cleanName = sanitizeStr(displayName, 100);

    let user = await db.findUserByEmail(cleanEmail);

    if (!user) {
      user = await db.createUser({
        uid,
        email: cleanEmail,
        passwordHash: '',
        displayName: cleanName || cleanEmail.split('@')[0],
        photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        role: 'parent',
        provider: provider || 'google.com',
        isVerified: true
      });
    } else {
      user = await db.updateUser(user.uid, {
        displayName: cleanName || user.displayName,
        photoURL: photoURL || user.photoURL,
        provider: provider || user.provider,
        isVerified: true,
        lastLogin: new Date().toISOString()
      });
    }

    req.session.user = safeUser(user);
    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    next(err);
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to sign out.' });
    }
    res.json({ success: true });
  });
});

// Get current session user
app.get('/api/auth/me', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false, user: null });
  }
});

// Email Verification: Send verification token
app.post('/api/auth/send-verification', requireAuth, async (req, res, next) => {
  try {
    const user = await db.findUserById(req.session.user.uid);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const token = require('crypto').randomBytes(24).toString('hex');
    await db.updateUser(user.uid, { verificationToken: token });

    res.json({
      success: true,
      message: `Verification link generated for ${user.email}`,
      verificationLink: `/api/auth/verify-email?token=${token}`
    });
  } catch (err) {
    next(err);
  }
});

// Email Verification: Verify token endpoint
app.get('/api/auth/verify-email', async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(400).send('<h2>Invalid Verification Link</h2><p>No token provided.</p><a href="/">Return to Home</a>');
    }

    const user = await db.findUserByVerificationToken(token);
    if (!user) {
      return res.status(400).send('<h2>Verification Failed</h2><p>This verification link is invalid or expired.</p><a href="/">Return to Home</a>');
    }

    await db.updateUser(user.uid, { isVerified: true, verificationToken: null });
    if (req.session && req.session.user && req.session.user.uid === user.uid) {
      req.session.user.isVerified = true;
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Email Verified</title><style>body{font-family:sans-serif;background:#090d16;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}.card{background:#131c2e;padding:32px;border-radius:12px;text-align:center;border:1px solid #10b981;max-width:400px;}a{color:#34d399;text-decoration:none;font-weight:bold;margin-top:16px;display:inline-block;}</style></head>
      <body>
        <div class="card">
          <h1>Email Verified! ✓</h1>
          <p>Your email <strong>${user.email}</strong> has been successfully verified.</p>
          <a href="/">Return to Islamic Studies LMS →</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   User Profile API
   ========================================================================== */

app.put('/api/user/profile', requireAuth, async (req, res, next) => {
  try {
    const uid = req.session.user.uid;
    const displayName = sanitizeStr(req.body.displayName, 100);

    if (!displayName) {
      return res.status(400).json({ success: false, error: 'Display name cannot be empty.' });
    }

    const updated = await db.updateUser(uid, { displayName });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    req.session.user = safeUser(updated);
    res.json({ success: true, user: safeUser(updated) });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   Parent Children Management API
   ========================================================================== */

app.get('/api/parent/children', requireAuth, requireParentOwnership, async (req, res, next) => {
  try {
    const parentUid = req.query.parentUid || req.session.user.uid;
    const children = await db.getChildren(parentUid);
    res.json({ success: true, children: children.map(safeChild) });
  } catch (err) {
    next(err);
  }
});

app.post('/api/parent/children', requireAuth, async (req, res, next) => {
  try {
    const parentUid = req.session.user.uid;
    const name = sanitizeStr(req.body.name, 50);
    const avatar = sanitizeStr(req.body.avatar, 10) || '🌟';
    const pinCode = sanitizeStr(req.body.pinCode, 4);
    const assignedTrack = ['level1', 'level2'].includes(req.body.assignedTrack) ? req.body.assignedTrack : 'level1';

    if (!name) {
      return res.status(400).json({ success: false, error: 'Child name is required.' });
    }

    const newChild = await db.createChild({
      parentUid,
      name,
      avatar,
      assignedTrack,
      pinHash: pinCode ? bcrypt.hashSync(pinCode, BCRYPT_ROUNDS) : null
    });

    res.json({ success: true, child: safeChild(newChild) });
  } catch (err) {
    next(err);
  }
});

app.put('/api/parent/children/:id', requireAuth, async (req, res, next) => {
  try {
    const childId = req.params.id;
    const sessionUid = req.session.user.uid;
    const isAdmin = req.session.user.role === 'super_admin';

    const child = await db.getChildById(childId);
    if (!child) {
      return res.status(404).json({ success: false, error: 'Child profile not found.' });
    }
    if (!isAdmin && child.parentUid !== sessionUid) {
      return res.status(403).json({ success: false, error: 'You can only edit your own children\'s profiles.' });
    }

    const name = sanitizeStr(req.body.name, 50);
    const avatar = sanitizeStr(req.body.avatar, 10);
    const pinCode = req.body.pinCode;
    const assignedTrack = req.body.assignedTrack;

    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;
    if (pinCode !== undefined) {
      updates.pinHash = pinCode ? bcrypt.hashSync(sanitizeStr(pinCode, 4), BCRYPT_ROUNDS) : null;
    }
    if (assignedTrack && ['level1', 'level2'].includes(assignedTrack)) {
      updates.assignedTrack = assignedTrack;
    }

    const updated = await db.updateChild(childId, updates);
    res.json({ success: true, child: safeChild(updated) });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/parent/children/:id', requireAuth, async (req, res, next) => {
  try {
    const childId = req.params.id;
    const sessionUid = req.session.user.uid;
    const isAdmin = req.session.user.role === 'super_admin';

    const child = await db.getChildById(childId);
    if (!child) {
      return res.status(404).json({ success: false, error: 'Child profile not found.' });
    }
    if (!isAdmin && child.parentUid !== sessionUid) {
      return res.status(403).json({ success: false, error: 'You can only delete your own children\'s profiles.' });
    }

    await db.deleteChild(childId);
    res.json({ success: true, message: 'Child profile deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

// Server-side PIN verification
app.post('/api/parent/children/:id/verify-pin', requireAuth, async (req, res, next) => {
  try {
    const childId = req.params.id;
    const pin = sanitizeStr(req.body.pin, 4);

    const child = await db.getChildById(childId);
    if (!child) {
      return res.status(404).json({ success: false, error: 'Child profile not found.' });
    }

    if (!child.pinHash) {
      return res.json({ success: true, verified: true });
    }

    if (!pin) {
      return res.status(400).json({ success: false, error: 'PIN is required.' });
    }

    const valid = bcrypt.compareSync(pin, child.pinHash);
    if (valid) {
      res.json({ success: true, verified: true });
    } else {
      res.status(401).json({ success: false, verified: false, error: 'Incorrect PIN. Please try again.' });
    }
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   Server-Side Quiz Grading & Validation API
   ========================================================================== */

app.post('/api/quiz/grade', validateModuleId, async (req, res, next) => {
  try {
    const moduleId = req.validModuleId;
    const track = req.body.track === 'level2' ? 'level2' : 'level1';
    const submittedAnswers = req.body.answers || {};
    const childId = req.body.childId || null;
    const sessionUid = req.session ? req.session.user?.uid : 'guest';

    if (!compiledCourseData || !compiledCourseData.modules) {
      loadCompiledCourseData();
    }

    const moduleData = compiledCourseData.modules.find(m => m.id === moduleId);
    if (!moduleData) {
      return res.status(404).json({ success: false, error: `Module ${moduleId} not found.` });
    }

    const trackData = moduleData.tracks[track] || moduleData.tracks.level1;
    const questions = (trackData.parsedQuestions && trackData.parsedQuestions.multipleChoice) 
      ? trackData.parsedQuestions.multipleChoice 
      : (trackData.parsedQuiz || []);

    if (!questions || questions.length === 0) {
      return res.status(400).json({ success: false, error: `No quiz questions found for Module ${moduleId} ${track}.` });
    }

    let correctCount = 0;
    const total = questions.length;
    const feedbackList = [];

    questions.forEach((q, idx) => {
      const studentAns = (submittedAnswers[idx] || '').toString().trim().toUpperCase();
      const correctAns = (q.correctAnswer || 'A').toString().trim().toUpperCase();
      const isCorrect = studentAns === correctAns;

      if (isCorrect) correctCount++;

      feedbackList.push({
        questionIndex: idx,
        questionText: q.question,
        selectedAnswer: studentAns,
        correctAnswer: correctAns,
        isCorrect,
        explanation: q.explanation || `Correct Answer is (${correctAns}). Refer to student handout and Maliki fiqh key for full breakdown.`
      });
    });

    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 80;

    // Save quiz result & update progress in database
    await db.saveQuizResult({
      uid: sessionUid,
      childId,
      moduleId,
      track,
      score: correctCount,
      total,
      percentage,
      passed
    });

    res.json({
      success: true,
      moduleId,
      track,
      score: correctCount,
      total,
      percentage,
      passed,
      feedback: feedbackList
    });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   Admin Dashboard API (Admin Only)
   ========================================================================== */

app.get('/api/admin/overview', requireAdmin, async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    res.json({
      success: true,
      stats: {
        totalParents: users.length,
        totalKids: db.memoryData.children.length,
        totalQuizSubmissions: db.memoryData.quizResults.length,
        totalCompletedModules: Object.keys(db.memoryData.progress).length,
        avgQuizScore: db.memoryData.quizResults.length > 0
          ? Math.round(db.memoryData.quizResults.reduce((acc, q) => acc + (q.percentage || 0), 0) / db.memoryData.quizResults.length)
          : 0
      }
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/admin/users', requireAdmin, async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    const usersWithMeta = users.map(u => {
      const children = db.memoryData.children.filter(c => c.parentUid === u.uid);
      return {
        ...u,
        childrenCount: children.length,
        children: children.map(c => ({ id: c.id, name: c.name, avatar: c.avatar, assignedTrack: c.assignedTrack }))
      };
    });
    res.json({ success: true, users: usersWithMeta });
  } catch (err) {
    next(err);
  }
});

app.put('/api/admin/users/:uid/role', requireAdmin, async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    if (!['parent', 'super_admin'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Role must be parent or super_admin' });
    }

    const updated = await db.updateUser(uid, { role });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    res.json({ success: true, user: safeUser(updated) });
  } catch (err) {
    next(err);
  }
});

/* ==========================================================================
   Telemetry & Client Error Monitoring API
   ========================================================================== */

app.post('/api/telemetry/errors', (req, res) => {
  const { message, source, lineno, colno, stack, url, timestamp } = req.body;
  console.warn(`⚠️ [Client Telemetry Error] [${timestamp || new Date().toISOString()}] ${message} at ${source || url}:${lineno || ''}`);
  if (stack && !isProd) {
    console.warn(`   Stack: ${stack.split('\n')[0]}`);
  }
  res.json({ success: true, logged: true });
});

/* ==========================================================================
   Centralized Error Handling & SPA Fallback
   ========================================================================== */

// SPA Fallback for static routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: `API endpoint ${req.method} ${req.path} not found.` });
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Centralized 4-argument Express error handler
app.use((err, req, res, next) => {
  console.error('💥 [Server Error]:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: isProd ? 'Internal server error' : (err.message || 'Server error'),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` 🕌 Islamic Studies LMS Server running on port ${PORT}`);
    console.log(` 🌐 Local: http://localhost:${PORT}`);
    console.log(` 🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` 📦 Storage: ${db.type.toUpperCase()}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
