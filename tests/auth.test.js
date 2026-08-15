const request = require('supertest');
const app = require('../server');

describe('Authentication & Session API Tests', () => {
  const testEmail = `parent_${Date.now()}@test.com`;
  const testPassword = 'Password123!';

  test('POST /api/auth/register - Successfully register new parent', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
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
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        displayName: 'Duplicate Parent',
        email: testEmail,
        password: testPassword
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('already exists');
  });

  test('POST /api/auth/login - Fail on wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login - Success on correct password and acquire cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
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
    const wrongPinRes = await request(app).post(`/api/public/child/${childId}/verify-pin`).send({ pin: '9999' });
    expect(wrongPinRes.statusCode).toBe(401);
    expect(wrongPinRes.body.verified).toBe(false);

    const correctPinRes = await request(app).post(`/api/public/child/${childId}/verify-pin`).send({ pin: '4321' });
    expect(correctPinRes.statusCode).toBe(200);
    expect(correctPinRes.body.verified).toBe(true);
    expect(correctPinRes.body.child.name).toBe('Ibrahim Test');
  });
});
