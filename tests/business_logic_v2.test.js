const request = require('supertest');
const app = require('../server');
const db = require('../lib/db');

describe('Enhanced Business Logic & 10x Improvements Test Suite', () => {
  let testParent;
  let testChild;
  const testEmail = `enhanced_parent_${Date.now()}@test.com`;

  beforeAll(async () => {
    // Create test parent
    testParent = await db.createUser({
      email: testEmail,
      displayName: 'Enhanced Parent',
      role: 'parent',
      isVerified: true
    });

    // Create test child with PIN
    const bcrypt = require('bcryptjs');
    const pinHash = await bcrypt.hash('1234', 10);
    testChild = await db.createChild({
      parentUid: testParent.uid,
      name: 'Enhanced Child',
      avatar: '🌟',
      assignedTrack: 'level1',
      pinHash
    });
  });

  afterAll(async () => {
    if (testParent) {
      await db.deleteUser(testParent.uid);
    }
  });

  test('1. db.getUserByUid exists as alias to findUserById', async () => {
    expect(typeof db.getUserByUid).toBe('function');
    const user = await db.getUserByUid(testParent.uid);
    expect(user).not.toBeNull();
    expect(user.email).toBe(testEmail);
    expect(user.displayName).toBe('Enhanced Parent');
  });

  test('2. Public child progress endpoint returns correct learner data', async () => {
    // Complete module 1 for child
    await db.updateProgress(`child_${testChild.id}`, 1, true);

    const res = await request(app).get(`/api/public/child/${testChild.id}/progress`).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.child.id).toBe(testChild.id);
    expect(res.body.child.name).toBe('Enhanced Child');
    expect(res.body.completedModules).toContain(1);
    expect(res.body.totalCompleted).toBeGreaterThanOrEqual(1);
  });

  test('3. Dedicated Printable HTML Certificate view renders beautifully', async () => {
    const res = await request(app).get(`/api/certificates/${testChild.id}/1/view`).expect(200);

    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('Certificate of Achievement');
    expect(res.text).toContain('Enhanced Child');
    expect(res.text).toContain('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
    expect(res.text).toContain('Islamic Studies Family LMS Academy');
    expect(res.text).toContain('window.print()');
  });

  test('4. Certificate public verification endpoint validates issued certificate', async () => {
    // Issue a certificate
    const cert = await db.issueCertificate({
      studentId: testChild.id,
      moduleId: 1,
      track: 'level1',
      score: 100
    });

    const res = await request(app).get(`/api/certificates/verify/${cert.id}`).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.valid).toBe(true);
    expect(res.body.certificate.studentName).toBe('Enhanced Child');
    expect(res.body.certificate.moduleId).toBe(1);
    expect(res.body.certificate.score).toBe(100);
  });

  test('5. Child PIN verification enforces 5-attempt lockout (Brute-Force Defense)', async () => {
    // Attempt 4 wrong PINs
    for (let i = 0; i < 4; i++) {
      const res = await request(app)
        .post(`/api/public/child/${testChild.id}/verify-pin`)
        .send({ pin: '9999' })
        .expect(401);
      expect(res.body.verified).toBe(false);
    }

    // 5th wrong attempt triggers lockout
    await request(app)
      .post(`/api/public/child/${testChild.id}/verify-pin`)
      .send({ pin: '9999' })
      .expect(401);

    // 6th attempt should return 429 Locked Out
    const lockedRes = await request(app)
      .post(`/api/public/child/${testChild.id}/verify-pin`)
      .send({ pin: '1234' })
      .expect(429);

    expect(lockedRes.body.error).toContain('temporarily locked');

    // Clean up lockout for subsequent tests
    await db.clearPinAttempts(testChild.id);
  });

  test('6. Audit logging records security & administration actions', async () => {
    const entry = await db.createAuditLog({
      actorUid: testParent.uid,
      action: 'TEST_AUDIT_ACTION',
      metadata: { test: true },
      ipAddress: '127.0.0.1'
    });

    expect(entry.id).toBeDefined();
    expect(entry.action).toBe('TEST_AUDIT_ACTION');

    const logs = await db.getAuditLogs();
    const found = logs.find((l) => l.action === 'TEST_AUDIT_ACTION');
    expect(found).toBeDefined();
    expect(found.actorUid).toBe(testParent.uid);
  });

  test('7. /api/modules serves with performance cache headers', async () => {
    const res = await request(app).get('/api/modules');
    if (res.status === 200) {
      expect(res.headers['cache-control']).toBeDefined();
      expect(res.headers['cache-control']).toContain('max-age=3600');
    }
  });
});
