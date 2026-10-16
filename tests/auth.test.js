const request = require('supertest');
const app = require('../server');

describe('Authentication & Session API Tests', () => {
  const testEmail = `parent_${Date.now()}@test.com`;
  const testPassword = 'Password123!';

  test('POST /api/auth/register - Successfully register new parent', async () => {
    const res = await request(app).post('/api/auth/register').send({
      displayName: 'Test Parent',
      email: testEmail,
      password: testPassword
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.role).toBe('parent');
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.passwordHash).toBeUndefined(); // Sensitive data stripped
  });

  test('POST /api/auth/register - Reject duplicate registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      displayName: 'Duplicate Parent',
      email: testEmail,
      password: testPassword
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('already exists');
  });

  test('POST /api/auth/login - Fail on wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'wrongpassword'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login - Success on correct password and acquire cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('GET /api/auth/me - Return authenticated user session', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: testEmail, password: testPassword });

    const res = await agent.get('/api/auth/me');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testEmail);
  });

  test('POST /api/auth/logout - Terminate session', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: testEmail, password: testPassword });

    const logoutRes = await agent.post('/api/auth/logout');
    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    const meRes = await agent.get('/api/auth/me');
    expect(meRes.body.user).toBeNull();
  });

  test('POST /api/parent/children & GET /api/public/child/:id - Create child and access via direct URL with PIN', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: testEmail, password: testPassword });

    const createRes = await agent.post('/api/parent/children').send({
      name: 'Ibrahim Test',
      avatar: '🌟',
      assignedTrack: 'level1',
      pinCode: '4321'
    });

    expect(createRes.statusCode).toBe(200);
    expect(createRes.body.success).toBe(true);
    const childId = createRes.body.child.id;
    expect(childId).toBeDefined();

    // Access child via public direct kid access endpoint without parent login
    const pubRes = await request(app).get(`/api/public/child/${childId}`);
    expect(pubRes.statusCode).toBe(200);
    expect(pubRes.body.success).toBe(true);
    expect(pubRes.body.child.name).toBe('Ibrahim Test');
    expect(pubRes.body.child.hasPin).toBe(true);

    // Verify PIN via public endpoint
    const wrongPinRes = await request(app)
      .post(`/api/public/child/${childId}/verify-pin`)
      .send({ pin: '9999' });
    expect(wrongPinRes.statusCode).toBe(401);
    expect(wrongPinRes.body.verified).toBe(false);

    const correctPinRes = await request(app)
      .post(`/api/public/child/${childId}/verify-pin`)
      .send({ pin: '4321' });
    expect(correctPinRes.statusCode).toBe(200);
    expect(correctPinRes.body.verified).toBe(true);
    expect(correctPinRes.body.child.name).toBe('Ibrahim Test');
  });

  test('POST /api/auth/forgot-password & POST /api/auth/reset-password - Complete password reset lifecycle', async () => {
    // 1. Request forgot password for existing user
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: testEmail });

    expect(forgotRes.statusCode).toBe(200);
    expect(forgotRes.body.success).toBe(true);
    const resetToken = forgotRes.body.debugToken;
    expect(resetToken).toBeDefined();

    // 2. Reject invalid reset token
    const badTokenRes = await request(app).post('/api/auth/reset-password').send({
      token: 'invalid_token_12345',
      password: 'NewPassword2026!'
    });

    expect(badTokenRes.statusCode).toBe(400);
    expect(badTokenRes.body.success).toBe(false);

    // 3. Reject short password
    const shortPassRes = await request(app).post('/api/auth/reset-password').send({
      token: resetToken,
      password: '123'
    });

    expect(shortPassRes.statusCode).toBe(400);

    // 4. Successfully reset password with valid token
    const newPassword = 'NewPassword2026!';
    const resetRes = await request(app).post('/api/auth/reset-password').send({
      token: resetToken,
      password: newPassword
    });

    expect(resetRes.statusCode).toBe(200);
    expect(resetRes.body.success).toBe(true);
    expect(resetRes.body.user.email).toBe(testEmail);

    // 5. Verify user can now log in with the new password
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: newPassword
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.user.email).toBe(testEmail);

    // 6. Test second reset with newPassword payload alias
    const forgot2 = await request(app).post('/api/auth/forgot-password').send({ email: testEmail });
    expect(forgot2.body.debugToken).toBeDefined();

    const reset2 = await request(app).post('/api/auth/reset-password').send({
      token: forgot2.body.debugToken,
      newPassword: 'AnotherPassword2026!'
    });

    expect(reset2.statusCode).toBe(200);
    expect(reset2.body.success).toBe(true);
  });

  describe('Super Learner Profile Tests (kennyanju@gmail.com)', () => {
    const superAgent = request.agent(app);

    test('POST /api/auth/login - Super Learner logs in with password 123456', async () => {
      const res = await superAgent.post('/api/auth/login').send({
        email: 'kennyanju@gmail.com',
        password: '123456'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('kennyanju@gmail.com');
      expect(res.body.user.role).toBe('super_admin');
      expect(res.body.user.isVerified).toBe(true);
    });

    test('GET /api/parent/children - Super Learner has access to all 5 level learner profiles', async () => {
      const res = await superAgent.get('/api/parent/children');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.children)).toBe(true);
      expect(res.body.children.length).toBe(5);

      const tracks = res.body.children.map((c) => c.assignedTrack);
      expect(tracks).toContain('level1');
      expect(tracks).toContain('level2');
      expect(tracks).toContain('level3');
      expect(tracks).toContain('level4');
      expect(tracks).toContain('level5');
    });

    test('POST /api/quiz/grade - Super Learner can test quizzes across levels without lockout', async () => {
      // Test quiz submission across level1, level3, level5
      for (const track of ['level1', 'level3', 'level5']) {
        const res = await superAgent.post('/api/quiz/grade').send({
          moduleId: 1,
          track,
          answers: { 0: 'A', 1: 'B', 2: 'C' }
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(typeof res.body.score).toBe('number');
        expect(typeof res.body.percentage).toBe('number');
      }
    });

    test('GET /api/admin/overview - Super Learner has full admin and course testing privileges', async () => {
      const res = await superAgent.get('/api/admin/overview');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toBeDefined();
    });
  });
});
