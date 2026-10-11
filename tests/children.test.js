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

    // 4. Public endpoint enforces UUID lookup and rejects name-only lookup (P3-C collision defense)
    const pubResByName = await request(app).get(
      `/api/public/child/${encodeURIComponent(uniqueChildName.toLowerCase())}`
    );
    expect(pubResByName.statusCode).toBe(404);
    expect(pubResByName.body.success).toBe(false);

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

  test('POST & PUT /api/parent/children - Supports Levels 1-5 track assignments', async () => {
    // Log back in as parent 1
    await agent1.post('/api/auth/login').send({
      email: parent1Email,
      password: 'Password123!'
    });

    // Create child with Level 4 track
    const createRes = await agent1.post('/api/parent/children').send({
      name: 'Yusuf',
      avatar: '📖',
      assignedTrack: 'level4',
      pinCode: '7890'
    });
    expect(createRes.statusCode).toBe(200);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.child.assignedTrack).toBe('level4');
    const yusufId = createRes.body.child.id;

    // Update child to Level 5 track
    const updateRes = await agent1.put(`/api/parent/children/${yusufId}`).send({
      assignedTrack: 'level5'
    });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.child.assignedTrack).toBe('level5');

    // Clean up
    await agent1.delete(`/api/parent/children/${yusufId}`);
  });

  test('DELETE /api/parent/progress/reset - Parent can reset child curriculum progress with access control', async () => {
    // Parent 2 cannot reset Parent 1 child progress
    const unauthorizedRes = await agent2.delete('/api/parent/progress/reset').send({
      childId: createdChildId
    });
    expect(unauthorizedRes.statusCode).toBe(403);
    expect(unauthorizedRes.body.success).toBe(false);

    // Missing childId validation
    const badReq = await agent1.delete('/api/parent/progress/reset').send({});
    expect(badReq.statusCode).toBe(400);

    // Parent 1 can reset own child progress
    const resetRes = await agent1.delete('/api/parent/progress/reset').send({
      childId: createdChildId
    });
    expect(resetRes.statusCode).toBe(200);
    expect(resetRes.body.success).toBe(true);
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
