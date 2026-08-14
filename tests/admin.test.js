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
      password: 'Admin@Islam2026!'
    });

    // Parent register
    const reg = await parentAgent.post('/api/auth/register').send({
      displayName: 'Normal Parent',
      email: `parent_admin_test_${Date.now()}@test.com`,
      password: 'Password123!'
    });
    targetParentUid = reg.body.user.uid;
  });

  test('GET /api/admin/overview - Admin access granted with complete analytics', async () => {
    const res = await adminAgent.get('/api/admin/overview');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(typeof res.body.stats.totalParents).toBe('number');
    expect(typeof res.body.stats.totalKids).toBe('number');
    expect(typeof res.body.stats.totalCompletedModules).toBe('number');
    expect(typeof res.body.stats.avgQuizScore).toBe('number');
    expect(typeof res.body.stats.passRate).toBe('number');
    expect(Array.isArray(res.body.stats.moduleStats)).toBe(true);
    expect(res.body.stats.moduleStats.length).toBe(9);
    expect(res.body.stats.system).toBeDefined();
    expect(res.body.stats.system.storage).toBeDefined();
  });

  test('GET /api/admin/overview - Non-admin rejected with 403', async () => {
    const res = await parentAgent.get('/api/admin/overview');
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/admin/users - Admin can retrieve all users with children metadata', async () => {
    const res = await adminAgent.get('/api/admin/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.users)).toBe(true);
    const target = res.body.users.find(u => u.uid === targetParentUid);
    expect(target).toBeDefined();
    expect(target.email).toContain('parent_admin_test_');
  });

  test('PUT /api/admin/users/:uid/role - Admin can promote user', async () => {
    const res = await adminAgent
      .put(`/api/admin/users/${targetParentUid}/role`)
      .send({ role: 'super_admin' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('super_admin');
  });

  test('DELETE /api/admin/users/:uid - Admin can delete user account', async () => {
    const res = await adminAgent.delete(`/api/admin/users/${targetParentUid}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const checkRes = await adminAgent.get('/api/admin/users');
    const target = checkRes.body.users.find(u => u.uid === targetParentUid);
    expect(target).toBeUndefined();
  });
});

