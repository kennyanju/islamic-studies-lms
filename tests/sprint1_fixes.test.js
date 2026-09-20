const request = require('supertest');
const app = require('../server');
const db = require('../lib/db');
const validator = require('../lib/validator');

describe('Sprint 1 Fixes & Security Hardening Test Suite', () => {
  const timestamp = Date.now();
  const testParentEmail = `sprint1_parent_${timestamp}@test.com`;
  const validPassword = 'SecurePassword2026!'; // >= 8 chars
  let testParent;
  let testChild;

  beforeAll(async () => {
    // 1. Create a parent user with 8+ char password
    testParent = await db.createUser({
      email: testParentEmail,
      displayName: 'Sprint 1 Parent',
      role: 'parent',
      passwordHash: await require('bcryptjs').hash(validPassword, 10),
      isVerified: false
    });

    // 2. Create a child profile for testing
    testChild = await db.createChild({
      parentUid: testParent.uid,
      name: 'Sprint1Child',
      avatar: '🌟',
      assignedTrack: 'level1'
    });
  });

  afterAll(async () => {
    if (testParent) {
      await db.deleteUser(testParent.uid);
    }
  });

  describe('1. NIST SP 800-63B Password Minimum (8 Characters)', () => {
    test('validator.isValidPassword enforces 8-character minimum', () => {
      expect(validator.isValidPassword('1234567')).toBe(false); // 7 chars
      expect(validator.isValidPassword('12345678')).toBe(true);  // 8 chars
      expect(validator.isValidPassword('SuperSecure123')).toBe(true);
    });

    test('POST /api/auth/register rejects password with fewer than 8 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: `short_pw_${Date.now()}@test.com`,
          password: 'Pass123', // 7 chars
          displayName: 'Short Password User'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('at least 8 characters');
    });

    test('POST /api/auth/reset-password rejects new password < 8 characters', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'dummy-token',
          password: 'short'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('at least 8 characters');
    });
  });

  describe('2. Verification Token 72-Hour Expiry Defense', () => {
    test('Newly created user has verificationTokenExpires set to ~72 hours in the future', async () => {
      const user = await db.createUser({
        email: `verify_exp_${Date.now()}@test.com`,
        displayName: 'Expiry User'
      });

      expect(user.verificationToken).toBeDefined();
      expect(user.verificationTokenExpires).toBeDefined();

      const expiresTime = new Date(user.verificationTokenExpires).getTime();
      const expectedTime = Date.now() + 72 * 3600 * 1000;
      // Within 10 seconds tolerance
      expect(Math.abs(expiresTime - expectedTime)).toBeLessThan(10000);

      // Clean up
      await db.deleteUser(user.uid);
    });

    test('Expired verification token is rejected by db.findUserByVerificationToken and verify endpoint', async () => {
      const expiredToken = 'expired_token_' + Date.now();
      const pastDate = new Date(Date.now() - 3600 * 1000).toISOString(); // 1 hour ago

      const expiredUser = await db.createUser({
        email: `already_expired_${Date.now()}@test.com`,
        displayName: 'Expired Token User',
        verificationToken: expiredToken,
        verificationTokenExpires: pastDate
      });

      // db lookup should return null because token is expired
      const found = await db.findUserByVerificationToken(expiredToken);
      expect(found).toBeNull();

      // GET /api/auth/verify-email endpoint should reject with 400
      const res = await request(app)
        .get(`/api/auth/verify-email?token=${expiredToken}`)
        .expect(400);

      expect(res.text).toContain('Verification Failed');
      expect(res.text).toContain('invalid or expired');

      // Clean up
      await db.deleteUser(expiredUser.uid);
    });
  });

  describe('3. UUID-Only Child Lookup (No Global Name Collisions)', () => {
    test('getChildById matches by exact ID', async () => {
      const child = await db.getChildById(testChild.id);
      expect(child).not.toBeNull();
      expect(child.id).toBe(testChild.id);
      expect(child.name).toBe('Sprint1Child');
    });

    test('getChildById with parentUid matches name scoped to parent', async () => {
      const child = await db.getChildById('Sprint1Child', testParent.uid);
      expect(child).not.toBeNull();
      expect(child.id).toBe(testChild.id);
    });

    test('getChildById without parentUid returns null for name (global fallback removed)', async () => {
      const child = await db.getChildById('Sprint1Child');
      expect(child).toBeNull();
    });

    test('Public endpoint rejects name-only query for child', async () => {
      const res = await request(app)
        .get('/api/public/child/Sprint1Child')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('not found');
    });
  });

  describe('4. Quiz Results answers_json Persistence', () => {
    test('saveQuizResult persists answers_json properly', async () => {
      const feedback = [
        {
          questionId: 'q1',
          selectedAnswer: 'A',
          correctAnswer: 'A',
          isCorrect: true,
          explanation: 'Correct explanation.'
        },
        {
          questionId: 'q2',
          selectedAnswer: 'B',
          correctAnswer: 'C',
          isCorrect: false,
          explanation: 'Review lesson 2.'
        }
      ];

      const quizResult = await db.saveQuizResult({
        uid: testParent.uid,
        childId: testChild.id,
        moduleId: 1,
        track: 'level1',
        score: 1,
        total: 2,
        percentage: 50,
        passed: false,
        answers_json: JSON.stringify(feedback)
      });

      expect(quizResult.id).toBeDefined();
      expect(quizResult.answers_json).toBeDefined();

      const parsed = JSON.parse(quizResult.answers_json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
      expect(parsed[0].questionId).toBe('q1');
      expect(parsed[0].isCorrect).toBe(true);
      expect(parsed[1].isCorrect).toBe(false);
    });
  });

  describe('5. Cloudflare KV-backed Parent Login Lockout (5 attempts -> 15 min lock)', () => {
    const lockoutEmail = `lockout_test_${Date.now()}@test.com`;

    beforeAll(async () => {
      await db.createUser({
        email: lockoutEmail,
        displayName: 'Lockout Target',
        passwordHash: await require('bcryptjs').hash('RealPassword2026!', 10),
        isVerified: true
      });
    });

    test('5 consecutive wrong passwords trigger 429 lockout on 6th attempt', async () => {
      // 5 wrong attempts
      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/auth/login')
          .send({ email: lockoutEmail, password: 'WrongPassword999!' })
          .expect(401);
        expect(res.body.success).toBe(false);
      }

      // 6th attempt (even with the correct password) should be locked out (429)
      const lockedRes = await request(app)
        .post('/api/auth/login')
        .send({ email: lockoutEmail, password: 'RealPassword2026!' })
        .expect(429);

      expect(lockedRes.body.success).toBe(false);
      expect(lockedRes.body.error).toContain('Account temporarily locked');
      expect(lockedRes.body.error).toContain('5 consecutive failed attempts');
    });
  });
});
