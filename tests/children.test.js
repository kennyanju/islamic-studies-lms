const request = require('supertest');
const app = require('../server');
const db = require('../lib/db');

describe('Child Profiles & Access Control API Tests', () => {
  const agent1 = request.agent(app);
  const agent2 = request.agent(app);

  let user1Uid = '';
  let parent1Email = `parent1_${Date.now()}@test.com`;
  let createdChildId = '';

  beforeAll(async () => {
    // Register Parent 1
    const reg1 = await agent1.post('/api/auth/register').send({
      displayName: 'Parent One',
      email: parent1Email,
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
    expect(res.body.children.some((c) => c.id === createdChildId)).toBe(true);
  });

  test('GET /api/parent/children - Parent 2 cannot access Parent 1 children (returns own children)', async () => {
    const res = await agent2.get(`/api/parent/children?parentUid=${user1Uid}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.children.length).toBe(0); // agent2 has no children yet
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

  test('GET /api/public/child/:id - Public learner access works without parent session', async () => {
    const uniqueChildName = `Maryam_${Date.now()}`;
    // 1. Create a child
    const res = await agent1.post('/api/parent/children').send({
      name: uniqueChildName,
      avatar: '🌸',
      assignedTrack: 'level2',
      pinCode: '5555'
    });
    expect(res.statusCode).toBe(200);
    const maryamId = res.body.child.id;

    // 2. Parent signs out
    await agent1.post('/api/auth/logout');

    // 3. Child profile remains accessible via public URL endpoint (by ID)
    const pubRes = await request(app).get(`/api/public/child/${maryamId}`);
    expect(pubRes.statusCode).toBe(200);
    expect(pubRes.body.success).toBe(true);
    expect(pubRes.body.child.name).toBe(uniqueChildName);
    expect(pubRes.body.child.assignedTrack).toBe('level2');
    expect(pubRes.body.child.hasPin).toBe(true);

    // 4. Child profile accessible via public URL endpoint (by name case-insensitively)
    const pubResByName = await request(app).get(
      `/api/public/child/${encodeURIComponent(uniqueChildName.toLowerCase())}`
    );
    expect(pubResByName.statusCode).toBe(200);
    expect(pubResByName.body.success).toBe(true);
    expect(pubResByName.body.child.id).toBe(maryamId);

    // 5. Verify PIN via public endpoint
    const wrongPin = await request(app)
      .post(`/api/public/child/${maryamId}/verify-pin`)
      .send({ pin: '0000' });
    expect(wrongPin.statusCode).toBe(401);
    expect(wrongPin.body.verified).toBe(false);

    const correctPin = await request(app)
      .post(`/api/public/child/${maryamId}/verify-pin`)
      .send({ pin: '5555' });
    expect(correctPin.statusCode).toBe(200);
    expect(correctPin.body.verified).toBe(true);

    // 6. Clean up
    await db.deleteChild(maryamId);
  });

  test('DELETE /api/parent/children/:id - Parent 1 can delete their child', async () => {
    // Log back in
    await agent1.post('/api/auth/login').send({
      email: parent1Email,
      password: 'Password123!'
    });
    const res = await agent1.delete(`/api/parent/children/${createdChildId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
