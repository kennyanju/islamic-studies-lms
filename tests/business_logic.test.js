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
          0: 'A',
          1: 'C',
          2: 'D',
          3: 'C',
          4: 'A',
          5: 'B',
          6: 'D',
          7: 'B'
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
          q1: 'A',
          q2: 'C',
          q3: 'D',
          q4: 'C',
          q5: 'A',
          q6: 'B',
          q7: 'D',
          q8: 'B'
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
          0: 'A',
          1: 'C',
          2: 'D',
          3: 'C',
          4: 'A',
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

  describe('4. Email Notifications & GDPR Deletion Cascading', () => {
    const emailService = require('../lib/email');

    test('sendQuizCompletionEmail triggers preview email delivery', async () => {
      const emailResult = await emailService.sendQuizCompletionEmail({
        parentEmail: 'parent_test@example.com',
        parentName: 'Test Parent',
        childName: 'Zayd',
        moduleId: 1,
        moduleTitle: 'Foundations of Belief',
        score: 8,
        total: 8,
        percentage: 100,
        passed: true
      });
      expect(emailResult.success).toBe(true);
      expect(emailResult.mailId).toBeDefined();

      const lastEmail = emailService.recentEmails[0];
      expect(lastEmail.type).toBe('quiz_completion');
      expect(lastEmail.to).toBe('parent_test@example.com');
      expect(lastEmail.subject).toContain('Foundations of Belief');
    });

    test('GDPR: Parent 1 deletes child profile with cascade data cleanup', async () => {
      // 1. Save dummy quiz result and reflection for child1Id
      await db.saveQuizResult({
        uid: parent1Uid,
        childId: child1Id,
        moduleId: 1,
        track: 'level1',
        score: 8,
        total: 8,
        percentage: 100,
        passed: true
      });
      await db.saveReflection({
        studentId: child1Id,
        moduleId: 1,
        questionId: 'r1',
        responseText: 'Reflection test answer'
      });

      // 2. Perform GDPR Delete
      const delRes = await parent1Agent.delete(`/api/parent/children/${child1Id}`);
      expect(delRes.statusCode).toBe(200);
      expect(delRes.body.success).toBe(true);

      // 3. Verify child is deleted
      const childCheck = await db.getChildById(child1Id);
      expect(childCheck).toBeNull();

      // 4. Verify cascade removed quiz results and reflections
      const memory = db.memoryData;
      const childQuizzes = memory.quizResults.filter((q) => q.childId === child1Id);
      const childReflections = memory.reflections.filter((r) => r.studentId === child1Id);
      expect(childQuizzes.length).toBe(0);
      expect(childReflections.length).toBe(0);
    });
  });
});
