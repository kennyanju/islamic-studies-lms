/**
 * Sprint 2 & 3 Tests: Reflection API routes and streak logic
 */
'use strict';

const request = require('supertest');
const app = require('../server');
const db = require('../lib/db');

// ── Helpers ──────────────────────────────────────────────────────────────────
async function registerAndLogin(email, password = 'TestPass123!') {
  await request(app)
    .post('/api/auth/register')
    .send({ email, password, displayName: 'Test Parent' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return res.headers['set-cookie'];
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Sprint 2: Reflection API', () => {
  let cookies;
  let childId;

  beforeAll(async () => {
    cookies = await registerAndLogin('refltest@example.com');

    // Create a child
    const res = await request(app)
      .post('/api/parent/children')
      .set('Cookie', cookies)
      .send({ name: 'Reflection Child', avatar: '📖' });
    expect(res.body.success).toBe(true);
    childId = res.body.child.id;
  });

  test('GET /api/parent/children/:id/reflections returns empty array before any reflections', async () => {
    const res = await request(app)
      .get(`/api/parent/children/${childId}/reflections`)
      .set('Cookie', cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.reflections)).toBe(true);
    expect(res.body.reflections).toHaveLength(0);
  });

  test('GET /api/parent/children/:id/reflections returns 404 for unknown child', async () => {
    const res = await request(app)
      .get('/api/parent/children/nonexistent-uuid/reflections')
      .set('Cookie', cookies);
    expect(res.statusCode).toBe(404);
  });

  test('GET /api/parent/children/:id/reflections returns 401 without auth', async () => {
    const res = await request(app)
      .get(`/api/parent/children/${childId}/reflections`);
    expect(res.statusCode).toBe(401);
  });

  test('After saving a reflection it appears in the GET response', async () => {
    // Save a reflection directly via the db adapter (as the quiz submit would)
    await db.saveReflection({
      childId,
      studentId: childId,
      moduleId: 1,
      questionId: 'q_reflect_1',
      responseText: 'I learned about the 6 pillars of Iman.'
    });

    const res = await request(app)
      .get(`/api/parent/children/${childId}/reflections`)
      .set('Cookie', cookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.reflections.length).toBeGreaterThanOrEqual(1);
    const r = res.body.reflections[0];
    expect(r.responseText || r.response_text).toBe('I learned about the 6 pillars of Iman.');
  });

  test('Cross-account access to another parent\'s child reflections returns 403', async () => {
    const cookies2 = await registerAndLogin('refltest2@example.com');
    const res = await request(app)
      .get(`/api/parent/children/${childId}/reflections`)
      .set('Cookie', cookies2);
    expect(res.statusCode).toBe(403);
  });
});

describe('Sprint 3: Streak Logic (db.updateChildStreak)', () => {
  let childId;

  beforeAll(async () => {
    // Create a bare child in the db adapter for streak testing
    const child = await db.createChild({
      parentUid: 'streak-test-parent',
      name: 'Streak Tester',
      avatar: '🔥',
      assignedTrack: 'level1'
    });
    childId = child.id;
  });

  test('First streak call sets streak to 1 and records today', async () => {
    const today = new Date().toISOString().split('T')[0];
    const updated = await db.updateChildStreak(childId);
    expect(updated.currentStreak).toBe(1);
    expect(updated.lastStudyDate).toBe(today);
  });

  test('Calling updateChildStreak again on the same day does not change the streak', async () => {
    const before = await db.getChildById(childId);
    const updated = await db.updateChildStreak(childId);
    expect(updated.currentStreak).toBe(before.currentStreak);
  });

  test('Streak increments when previous date was yesterday', async () => {
    // Manually set last_study_date to yesterday
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    await db.updateChild(childId, { lastStudyDate: yesterday, currentStreak: 3 });

    const updated = await db.updateChildStreak(childId);
    expect(updated.currentStreak).toBe(4);
  });

  test('Streak resets to 1 when gap is more than one day', async () => {
    // Set last study date to two days ago
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    await db.updateChild(childId, { lastStudyDate: twoDaysAgo, currentStreak: 10 });

    const updated = await db.updateChildStreak(childId);
    expect(updated.currentStreak).toBe(1);
  });

  test('updateChildStreak returns null for non-existent child', async () => {
    const result = await db.updateChildStreak('non-existent-id');
    expect(result).toBeNull();
  });
});
