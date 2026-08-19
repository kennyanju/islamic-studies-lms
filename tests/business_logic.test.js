const request = require('supertest');
const app = require('../server');
const db = require('../lib/db');

describe('Business Logic & Domain Rule Verification Tests', () => {
  const parent1Agent = request.agent(app);
  const parent2Agent = request.agent(app);
  let parent1Email = `bl_parent1_${Date.now()}@test.com`;
  let parent2Email = `bl_parent2_${Date.now()}@test.com`;
  let parent1Uid = '';
  let child1Id = '';

  beforeAll(async () => {
    // Register Parent 1
    const reg1 = await parent1Agent.post('/api/auth/register').send({
      displayName: 'Business Logic Parent 1',
      email: parent1Email,
      password: 'Password123!'
    });
    parent1Uid = reg1.body.user.uid;

    // Register Parent 2
    await parent2Agent.post('/api/auth/register').send({
      displayName: 'Business Logic Parent 2',
      email: parent2Email,
      password: 'Password123!'
    });
  });

  describe('1. Quiz Grading & Answer Key Resolution Logic', () => {
    test('POST /api/quiz/grade - Grade with answers keyed by question index (0, 1, ...)', async () => {
      const res = await parent1Agent.post('/api/quiz/grade').send({
        moduleId: 1,
        track: 'level1',
        answers: {
          0: 'B',
          1: 'C',
          2: 'B',
          3: 'C',
          4: 'B',
          5: 'B',
          6: 'B',
          7: 'C'
        }
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.score).toBe(8);
      expect(res.body.percentage).toBe(100);
      expect(res.body.passed).toBe(true);
      expect(res.body.feedback[0].questionId).toBeDefined();
    });

    test('POST /api/quiz/grade - Grade with answers keyed by question ID (e.g. q1, q2)', async () => {
      const res = await parent1Agent.post('/api/quiz/grade').send({
        moduleId: 1,
        track: 'level1',
        answers: {
          q1: 'B',
          q2: 'C',
          q3: 'B',
          q4: 'C',
          q5: 'B',
          q6: 'B',
          q7: 'B',
          q8: 'C'
        }
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.score).toBe(8);
      expect(res.body.percentage).toBe(100);
      expect(res.body.passed).toBe(true);
    });

    test('POST /api/quiz/grade - 80% passing threshold boundary condition', async () => {
      // 6 out of 8 correct = 75% -> Failed
      const failRes = await parent1Agent.post('/api/quiz/grade').send({
        moduleId: 1,
        track: 'level1',
        answers: {
          0: 'B',
          1: 'C',
          2: 'B',
          3: 'C',
          4: 'B',
          5: 'B',
          6: 'WRONG',
          7: 'WRONG'
        }
      });
      expect(failRes.body.score).toBe(6);
      expect(failRes.body.percentage).toBe(75);
      expect(failRes.body.passed).toBe(false);
    });
  });

  describe('2. Parent & Child Access Control Isolation', () => {
    test('Create child under Parent 1', async () => {
      const res = await parent1Agent.post('/api/parent/children').send({
        name: 'Zaayd',
        avatar: '🌙',
        assignedTrack: 'level1',
        pinCode: '1234'
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.child.name).toBe('Zaayd');
      child1Id = res.body.child.id;
    });

    test('Parent 2 cannot update Parent 1 child profile', async () => {
      const res = await parent2Agent.put(`/api/parent/children/${child1Id}`).send({
        name: 'Hacked Name'
      });
      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    test('Parent 2 cannot delete Parent 1 child profile', async () => {
      const res = await parent2Agent.delete(`/api/parent/children/${child1Id}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Public Child Access & PIN Verification', () => {
    test('Public lookup returns safe child payload without PIN hash', async () => {
      const res = await request(app).get(`/api/public/child/${child1Id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.child.name).toBe('Zaayd');
      expect(res.body.child.hasPin).toBe(true);
      expect(res.body.child.pinHash).toBeUndefined();
    });

    test('Verify correct PIN for child', async () => {
      const res = await request(app).post(`/api/public/child/${child1Id}/verify-pin`).send({
        pin: '1234'
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.verified).toBe(true);
    });

    test('Reject incorrect PIN for child', async () => {
      const res = await request(app).post(`/api/public/child/${child1Id}/verify-pin`).send({
        pin: '9999'
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.verified).toBe(false);
    });
  });
});
