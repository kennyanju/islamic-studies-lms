const request = require('supertest');
const app = require('../server');

describe('Child Profiles & Access Control API Tests', () => {
  const agent1 = request.agent(app);
  const agent2 = request.agent(app);

  let user1Uid = '';
  let createdChildId = '';

  beforeAll(async () => {
    // Register Parent 1
    const reg1 = await agent1.post('/api/auth/register').send({
      displayName: 'Parent One',
      email: `parent1_${Date.now()}@test.com`,
      password: 'Password123!'
    });
    user1Uid = reg1.body.user.uid;

    // Register Parent 2
    await agent2.post('/api/auth/register').send({
      displayName: 'Parent Two',
      email: `parent2_${Date.now()}@test.com`,
      password: 'Password123!'
    });
  });

  test('POST /api/parent/children - Create new child profile with PIN', async () => {
    const res = await agent1.post('/api/parent/children').send({
      name: 'Ibrahim',
      avatar: '🌟',
      assignedTrack: 'level1',
      pinCode: '4321'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.child).toBeDefined();
    expect(res.body.child.name).toBe('Ibrahim');
    expect(res.body.child.hasPin).toBe(true);
    expect(res.body.child.pinHash).toBeUndefined(); // Sensitive PIN hash hidden

    createdChildId = res.body.child.id;
  });

  test('GET /api/parent/children - Parent 1 can fetch their child', async () => {
    const res = await agent1.get('/api/parent/children');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.children)).toBe(true);
    expect(res.body.children.some(c => c.id === createdChildId)).toBe(true);
  });

  test('GET /api/parent/children - Parent 2 cannot access Parent 1 children', async () => {
    const res = await agent2.get(`/api/parent/children?parentUid=${user1Uid}`);
    expect(res.statusCode).toBe(403); // Forbidden
    expect(res.body.success).toBe(false);
  });

  test('POST /api/parent/children/:id/verify-pin - Server verification with correct PIN', async () => {
    const res = await agent1.post(`/api/parent/children/${createdChildId}/verify-pin`).send({
      pin: '4321'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.verified).toBe(true);
  });

  test('POST /api/parent/children/:id/verify-pin - Reject wrong PIN', async () => {
    const res = await agent1.post(`/api/parent/children/${createdChildId}/verify-pin`).send({
      pin: '0000'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.verified).toBe(false);
  });

  test('DELETE /api/parent/children/:id - Parent 2 cannot delete Parent 1 child', async () => {
    const res = await agent2.delete(`/api/parent/children/${createdChildId}`);
    expect(res.statusCode).toBe(403);
  });

  test('DELETE /api/parent/children/:id - Parent 1 can delete their child', async () => {
    const res = await agent1.delete(`/api/parent/children/${createdChildId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
