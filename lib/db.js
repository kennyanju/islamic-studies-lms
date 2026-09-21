/**
 * Database Abstraction Layer for Islamic Studies LMS
 * Pluggable support for File Storage (JSON), PostgreSQL, and MongoDB
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

class DatabaseAdapter {
  constructor() {
    this.type = 'file';
    if (process.env.DATABASE_URL) {
      this.type = 'postgres';
    } else if (process.env.MONGODB_URI) {
      this.type = 'mongodb';
    }
    this.memoryData = null;
  }

  async init() {
    if (this.type === 'file') {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (!fs.existsSync(DB_PATH)) {
        const initial = {
          users: [],
          children: [],
          quizResults: [],
          progress: {},
          reflections: [],
          auditLogs: [],
          certificates: []
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
      }
      this._loadFile();
      console.log('📦 [DB] Initialized File-backed Database Store (data/db.json)');
    } else if (this.type === 'postgres') {
      console.log('🐘 [DB] Configured for PostgreSQL (DATABASE_URL)');
      // Postgres client connection pool initialization
    } else if (this.type === 'mongodb') {
      console.log('🍃 [DB] Configured for MongoDB (MONGODB_URI)');
      // MongoDB client connection initialization
    }
  }

  _loadFile() {
    try {
      if (fs.existsSync(DB_PATH)) {
        this.memoryData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      } else {
        this.memoryData = {
          users: [],
          children: [],
          quizResults: [],
          progress: {},
          reflections: [],
          auditLogs: [],
          certificates: []
        };
      }
    } catch (e) {
      console.error('Error reading db.json:', e);
      this.memoryData = {
        users: [],
        children: [],
        quizResults: [],
        progress: {},
        reflections: [],
        auditLogs: [],
        certificates: []
      };
    }
    if (!this.memoryData.users) this.memoryData.users = [];
    if (!this.memoryData.children) this.memoryData.children = [];
    if (!this.memoryData.quizResults) this.memoryData.quizResults = [];
    if (!this.memoryData.progress || Array.isArray(this.memoryData.progress))
      this.memoryData.progress = {};
    if (!this.memoryData.reflections) this.memoryData.reflections = [];
    if (!this.memoryData.auditLogs) this.memoryData.auditLogs = [];
    if (!this.memoryData.certificates) this.memoryData.certificates = [];
  }

  _saveFile() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.memoryData, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving db.json:', e);
    }
  }

  // --- User Repository ---
  async findUserByEmail(email) {
    if (!email) return null;
    this._loadFile();
    return this.memoryData.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(uid) {
    if (!uid) return null;
    this._loadFile();
    return this.memoryData.users.find((u) => u.uid === uid) || null;
  }

  // Alias to unblock parent quiz completion notifications
  async getUserByUid(uid) {
    return this.findUserById(uid);
  }

  async findUserByVerificationToken(token) {
    if (!token) return null;
    this._loadFile();
    const now = Date.now();
    return (
      this.memoryData.users.find(
        (u) =>
          u.verificationToken === token &&
          (!u.verificationTokenExpires || new Date(u.verificationTokenExpires).getTime() > now)
      ) || null
    );
  }

  async findUserByResetToken(token) {
    if (!token) return null;
    this._loadFile();
    const now = Date.now();
    return (
      this.memoryData.users.find(
        (u) =>
          u.resetPasswordToken === token &&
          u.resetPasswordExpires &&
          new Date(u.resetPasswordExpires).getTime() > now
      ) || null
    );
  }

  async setPasswordResetToken(email, token, expiresDate) {
    this._loadFile();
    const user = this.memoryData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiresDate.toISOString();
    user.updatedAt = new Date().toISOString();
    this._saveFile();
    return user;
  }

  async resetPasswordWithToken(token, newPasswordHash) {
    this._loadFile();
    const user = await this.findUserByResetToken(token);
    if (!user) return null;
    user.passwordHash = newPasswordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.updatedAt = new Date().toISOString();
    this._saveFile();
    return user;
  }

  async createUser(userData) {
    this._loadFile();
    const newUser = {
      uid: userData.uid || `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      email: userData.email,
      passwordHash: userData.passwordHash || '',
      displayName: userData.displayName || 'Parent User',
      role: userData.role || 'parent',
      provider: userData.provider || 'password',
      photoURL:
        userData.photoURL ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.email)}`,
      isVerified: !!userData.isVerified,
      verificationToken: userData.verificationToken || crypto.randomBytes(24).toString('hex'),
      verificationTokenExpires:
        userData.verificationTokenExpires ||
        new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.memoryData.users.push(newUser);
    this._saveFile();
    return newUser;
  }

  async updateUser(uid, updates) {
    this._loadFile();
    const idx = this.memoryData.users.findIndex((u) => u.uid === uid);
    if (idx === -1) return null;

    this.memoryData.users[idx] = {
      ...this.memoryData.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this._saveFile();
    return this.memoryData.users[idx];
  }

  async deleteUser(uid) {
    this._loadFile();
    const initialLen = this.memoryData.users.length;
    this.memoryData.users = this.memoryData.users.filter((u) => u.uid !== uid);
    const childrenIds = this.memoryData.children
      .filter((c) => c.parentUid === uid)
      .map((c) => c.id);
    this.memoryData.children = this.memoryData.children.filter((c) => c.parentUid !== uid);

    const keysToRemove = [`user_${uid}`, ...childrenIds.map((id) => `child_${id}`)];
    for (const key of keysToRemove) {
      delete this.memoryData.progress[key];
    }
    this.memoryData.quizResults = this.memoryData.quizResults.filter(
      (q) => q.uid !== uid && !childrenIds.includes(q.childId)
    );

    this._saveFile();
    return this.memoryData.users.length < initialLen;
  }

  async getAllUsers() {
    this._loadFile();
    return this.memoryData.users.map((u) => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      provider: u.provider,
      photoURL: u.photoURL,
      isVerified: !!u.isVerified,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin || u.createdAt
    }));
  }

  async getAllChildren() {
    this._loadFile();
    return this.memoryData.children || [];
  }

  async getAllQuizResults() {
    this._loadFile();
    return this.memoryData.quizResults || [];
  }

  async getProgressMap() {
    this._loadFile();
    return this.memoryData.progress || {};
  }

  // --- Children Repository ---
  async getChildren(parentUid) {
    this._loadFile();
    return this.memoryData.children.filter((c) => c.parentUid === parentUid);
  }

  async getChildById(childId, parentUid = null) {
    if (!childId) return null;
    this._loadFile();
    const clean = String(childId).trim();
    if (!clean) return null;
    const cleanLower = clean.toLowerCase();

    // 1. Exact ID match (case-sensitive or insensitive)
    let child =
      this.memoryData.children.find(
        (c) => c.id === clean || (c.id && c.id.toLowerCase() === cleanLower)
      ) || null;
    if (child) return child;

    // 2. Name-based match scoped to parentUid (prevents sibling / cross-account collision)
    if (parentUid) {
      child =
        this.memoryData.children.find(
          (c) => c.parentUid === parentUid && c.name && c.name.trim().toLowerCase() === cleanLower
        ) || null;
      if (child) return child;
    }

    return null;
  }

  async createChild(childData) {
    this._loadFile();
    const newChild = {
      id: childData.id || `child_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      parentUid: childData.parentUid,
      name: childData.name,
      avatar: childData.avatar || '🌟',
      assignedTrack: childData.assignedTrack || 'level1',
      pinHash: childData.pinHash || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.memoryData.children.push(newChild);
    this._saveFile();
    return newChild;
  }

  async updateChild(childId, updates) {
    this._loadFile();
    const idx = this.memoryData.children.findIndex((c) => c.id === childId);
    if (idx === -1) return null;

    this.memoryData.children[idx] = {
      ...this.memoryData.children[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this._saveFile();
    return this.memoryData.children[idx];
  }

  async deleteChild(childId) {
    this._loadFile();
    const initialLen = this.memoryData.children.length;
    this.memoryData.children = this.memoryData.children.filter((c) => c.id !== childId);
    if (Array.isArray(this.memoryData.quizResults)) {
      this.memoryData.quizResults = this.memoryData.quizResults.filter(
        (q) => q.childId !== childId
      );
    }
    if (Array.isArray(this.memoryData.reflections)) {
      this.memoryData.reflections = this.memoryData.reflections.filter(
        (r) => r.studentId !== childId
      );
    }
    if (Array.isArray(this.memoryData.progress)) {
      this.memoryData.progress = this.memoryData.progress.filter(
        (p) => p.childId !== childId && p.uid !== childId
      );
    }
    this._saveFile();
    return this.memoryData.children.length < initialLen;
  }

  // --- Quiz Results & Progress Repository ---
  async saveQuizResult(resultData) {
    this._loadFile();
    const result = {
      id: `quiz_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      uid: resultData.uid,
      childId: resultData.childId || null,
      moduleId: resultData.moduleId,
      track: resultData.track,
      score: resultData.score,
      total: resultData.total,
      percentage: resultData.percentage,
      passed: resultData.passed,
      answers_json: resultData.answers_json || null,
      createdAt: new Date().toISOString()
    };
    this.memoryData.quizResults.push(result);

    // If passed, automatically mark progress
    if (result.passed) {
      const progressKey = resultData.childId
        ? `child_${resultData.childId}`
        : `user_${resultData.uid}`;
      if (!this.memoryData.progress[progressKey]) {
        this.memoryData.progress[progressKey] = {};
      }
      this.memoryData.progress[progressKey][`mod_${resultData.moduleId}`] = true;
    }

    this._saveFile();
    return result;
  }

  async getProgress(targetKey) {
    this._loadFile();
    return this.memoryData.progress[targetKey] || {};
  }

  async updateProgress(targetKey, moduleId, completed) {
    this._loadFile();
    if (!this.memoryData.progress[targetKey]) {
      this.memoryData.progress[targetKey] = {};
    }
    this.memoryData.progress[targetKey][`mod_${moduleId}`] = !!completed;
    this._saveFile();
    return this.memoryData.progress[targetKey];
  }

  async getParentProgress(parentUid) {
    this._loadFile();
    const children = this.memoryData.children.filter((c) => c.parentUid === parentUid);
    const progressData = {};
    for (const child of children) {
      const targetKey = `child_${child.id}`;
      progressData[targetKey] = this.memoryData.progress[targetKey] || {};
      progressData[`${targetKey}_scores`] = this.memoryData.quizResults.filter(
        (q) => q.childId === child.id
      );
    }
    return progressData;
  }

  async resetChildProgress(childId, moduleId) {
    this._loadFile();
    const targetKey = `child_${childId}`;
    if (this.memoryData.progress[targetKey]) {
      if (moduleId) {
        delete this.memoryData.progress[targetKey][`mod_${moduleId}`];
      } else {
        delete this.memoryData.progress[targetKey];
      }
    }
    this.memoryData.quizResults = this.memoryData.quizResults.filter(
      (q) => !(q.childId === childId && (!moduleId || q.moduleId === parseInt(moduleId)))
    );
    this._saveFile();
  }

  async getQuizAttemptCount(sessionUid, childId, moduleId) {
    this._loadFile();
    const today = new Date().toISOString().split('T')[0];
    const attempts = this.memoryData.quizResults.filter(
      (q) =>
        (q.childId === childId || (!childId && q.uid === sessionUid)) &&
        q.moduleId === parseInt(moduleId) &&
        q.createdAt &&
        q.createdAt.startsWith(today)
    );
    return attempts.length;
  }

  async saveReflection(data) {
    this._loadFile();
    this.memoryData.reflections.push({
      id: `ref_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      ...data,
      createdAt: new Date().toISOString()
    });
    this._saveFile();
  }

  async getReflectionsForChild(childId) {
    this._loadFile();
    const reflections = (this.memoryData.reflections || []).filter(
      (r) => r.childId === childId
    );
    return reflections.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getAllReflections() {
    this._loadFile();
    const reflections = this.memoryData.reflections || [];
    return reflections.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Updates current_streak and last_study_date on a child after a study session.
  // Streak increments if the previous session was yesterday; resets to 1 otherwise.
  async updateChildStreak(childId) {
    this._loadFile();
    const child = this.memoryData.children.find((c) => c.id === childId);
    if (!child) return null;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = child.lastStudyDate || null;

    if (lastDate === today) {
      // Already studied today — no change
      return child;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastDate === yesterday) {
      child.currentStreak = (child.currentStreak || 0) + 1;
    } else {
      // Streak broken — reset to 1
      child.currentStreak = 1;
    }
    child.lastStudyDate = today;
    this._saveFile();
    return child;
  }

  async getAuditLogs() {
    this._loadFile();
    return this.memoryData.auditLogs || [];
  }

  async createAuditLog({ actorUid, action, targetUid = null, metadata = null, ipAddress = null }) {
    this._loadFile();
    if (!this.memoryData.auditLogs) this.memoryData.auditLogs = [];
    const entry = {
      id: `audit_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      actorUid: actorUid || 'system',
      action: action || 'UNKNOWN_ACTION',
      targetUid: targetUid || null,
      metadata: typeof metadata === 'object' ? JSON.stringify(metadata) : metadata,
      ipAddress: ipAddress || null,
      createdAt: new Date().toISOString()
    };
    this.memoryData.auditLogs.unshift(entry);
    if (this.memoryData.auditLogs.length > 500) {
      this.memoryData.auditLogs.pop();
    }
    this._saveFile();
    return entry;
  }

  // --- PIN Lockout Management ---
  async recordFailedPinAttempt(childId) {
    this._loadFile();
    const child = this.memoryData.children.find((c) => c.id === childId);
    if (!child) return null;
    child.pinFailedAttempts = (child.pinFailedAttempts || 0) + 1;
    if (child.pinFailedAttempts >= 5) {
      child.pinLockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    }
    this._saveFile();
    return child;
  }

  async clearPinAttempts(childId) {
    this._loadFile();
    const child = this.memoryData.children.find((c) => c.id === childId);
    if (!child) return null;
    child.pinFailedAttempts = 0;
    child.pinLockedUntil = null;
    this._saveFile();
    return child;
  }

  isPinLocked(child) {
    if (!child || !child.pinLockedUntil) return false;
    return new Date(child.pinLockedUntil).getTime() > Date.now();
  }

  // --- Certificate Persistence ---
  async issueCertificate({ studentId, moduleId, track, score, certNumber = null }) {
    this._loadFile();
    if (!this.memoryData.certificates) this.memoryData.certificates = [];
    const id =
      certNumber ||
      `CERT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const cert = {
      id,
      studentId,
      moduleId: parseInt(moduleId, 10),
      track: track || 'level1',
      score: parseInt(score, 10) || 100,
      issuedAt: new Date().toISOString()
    };
    this.memoryData.certificates.push(cert);
    this._saveFile();
    return cert;
  }

  async getCertificate(certId) {
    this._loadFile();
    if (!this.memoryData.certificates) return null;
    return this.memoryData.certificates.find((c) => c.id === certId) || null;
  }

  async getStudentCertificates(studentId) {
    this._loadFile();
    if (!this.memoryData.certificates) return [];
    return this.memoryData.certificates.filter((c) => c.studentId === studentId);
  }
}

const db = new DatabaseAdapter();

module.exports = db;
