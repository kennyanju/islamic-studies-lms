const request = require('supertest');
const app = require('../server');

describe('Server-Side Quiz Grading & Module Validation Tests', () => {
  const agent = request.agent(app);

  beforeAll(async () => {
    await agent.post('/api/auth/register').send({
      displayName: 'Quiz Student',
      email: `student_${Date.now()}@test.com`,
      password: 'Password123!'
    });
  });

  test('POST /api/quiz/grade - Grade Module 1 quiz with answers', async () => {
    const res = await agent.post('/api/quiz/grade').send({
      moduleId: 1,
      track: 'level1',
      answers: {
        "0": "B",
        "1": "C",
        "2": "B",
        "3": "C",
        "4": "B",
        "5": "B",
        "6": "B",
        "7": "C"
      }
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.moduleId).toBe(1);
    expect(res.body.total).toBe(8);
    expect(res.body.score).toBe(8);
    expect(res.body.percentage).toBe(100);
    expect(res.body.passed).toBe(true);
    expect(Array.isArray(res.body.feedback)).toBe(true);
    expect(res.body.feedback.length).toBe(8);
    expect(res.body.feedback[0].explanation).toBeDefined();
  });

  test('POST /api/quiz/grade - Validate invalid module ID 999', async () => {
    const res = await agent.post('/api/quiz/grade').send({
      moduleId: 999,
      track: 'level1',
      answers: {}
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid moduleId');
  });

  test('POST /api/quiz/grade - Non-numeric moduleId', async () => {
    const res = await agent.post('/api/quiz/grade').send({
      moduleId: 'abc',
      track: 'level1',
      answers: {}
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
