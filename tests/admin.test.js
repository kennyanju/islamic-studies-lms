const request = require('supertest');
const app = require('../server');

describe('Super Admin Access & Management Tests', () => {
  const adminAgent = request.agent(app);
  const parentAgent = request.agent(app);

  let targetParentUid = '';

  beforeAll(async () => {
    // Admin login
    await adminAgent.post('/api/auth/login').send({
      email: 'admin@islamicstudies.org',
      password: 'admin123'
    });

    // Parent login
    const reg = await parentAgent.post('/api/auth/register').send({
      displayName: 'Normal Parent',
      email: `parent_admin_test_${Date.now()}@test.com`,
      password: 'Password123!'
    });
    targetParentUid = reg.body.user.uid;
  });

  test('GET /api/admin/overview - Admin access granted', async () => {
    const res = await adminAgent.get('/api/admin/overview');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(typeof res.body.stats.totalParents).toBe('number');
  });

  test('GET /api/admin/overview - Non-admin rejected with 403', async () => {
    const res = await parentAgent.get('/api/admin/overview');
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('PUT /api/admin/users/:uid/role - Admin can promote user', async () => {
    const res = await adminAgent
      .put(`/api/admin/users/${targetParentUid}/role`)
      .send({ role: 'super_admin' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('super_admin');
  });
});
