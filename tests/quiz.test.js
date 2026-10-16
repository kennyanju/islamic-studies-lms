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
      track: 'level3',
      answers: {
        0: 'A',
        1: 'C',
        2: 'B',
        3: 'D',
        4: 'A',
        5: 'C',
        6: 'D',
        7: 'B',
        8: 'A',
        9: 'C'
      }
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.moduleId).toBe(1);
    expect(res.body.total).toBe(10);
    expect(res.body.score).toBe(10);
    expect(res.body.percentage).toBe(100);
    expect(res.body.passed).toBe(true);
    expect(Array.isArray(res.body.feedback)).toBe(true);
    expect(res.body.feedback.length).toBe(10);
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

  test('All 45 interactive quizzes (Modules 1-9 x Levels 1-5) have valid MCQ, FIB, Matching, and Reflection structures', () => {
    const fs = require('fs');
    const path = require('path');

    for (let m = 1; m <= 9; m++) {
      const modPath = path.join(__dirname, '..', 'public', 'course_data', `module_${m}.json`);
      const modData = JSON.parse(fs.readFileSync(modPath, 'utf8'));

      for (let l = 1; l <= 5; l++) {
        const trackKey = `level${l}`;
        const pq = modData.tracks[trackKey].parsedQuestions;
        expect(pq).toBeDefined();

        // 1. Multiple Choice validation
        expect(pq.multipleChoice.length).toBeGreaterThanOrEqual(l <= 2 ? 5 : 10);
        pq.multipleChoice.forEach((q) => {
          expect(q.options.length).toBe(4);
          expect(['A', 'B', 'C', 'D']).toContain(q.correctAnswer);
          expect(q.explanation.length).toBeGreaterThan(5);
        });

        // 2. Fill in the Blanks validation
        expect(pq.fillBlanks.length).toBeGreaterThanOrEqual(3);
        const wb = (pq.fillBlanks[0].wordBank || []).map((w) => w.toLowerCase());
        expect(wb.length).toBeGreaterThanOrEqual(pq.fillBlanks.length);
        pq.fillBlanks.forEach((fb) => {
          expect(fb.text).toContain('______');
          expect(fb.answer.length).toBeGreaterThan(0);
          expect(wb).toContain(fb.answer.toLowerCase());
        });

        // 3. Concept Matching validation (no empty ghost rows or leaked duplicates)
        expect(pq.matching.length).toBeGreaterThanOrEqual(3);
        pq.matching.forEach((pair) => {
          expect(pair.left.length).toBeGreaterThan(0);
          expect(pair.right.length).toBeGreaterThan(0);
        });

        // 4. Reflection & Rubric validation
        expect(pq.reflection.length).toBeGreaterThanOrEqual(1);
        expect((pq.reflectionRubric || '').length).toBeGreaterThan(10);
      }
    }
  });

  test('All 361 MCQs across all 45 quizzes maintain option-length parity and avoid joke distractors', () => {
    const fs = require('fs');
    const path = require('path');
    const bannedPhrases = [
      'play video games',
      'television volume',
      'horse race organized outside makkah',
      'submerged under ocean waterways',
      'camel racing',
      'solar eclipses',
      'solitary solitary'
    ];
    const violations = [];

    for (let m = 1; m <= 9; m++) {
      const modPath = path.join(__dirname, '..', 'public', 'course_data', `module_${m}.json`);
      const mod = JSON.parse(fs.readFileSync(modPath, 'utf8'));
      for (const lvl of ['level1', 'level2', 'level3', 'level4', 'level5']) {
        const mcList = mod.tracks[lvl].parsedQuestions.multipleChoice || [];
        mcList.forEach((mc) => {
          const opts = mc.options || [];
          const correctOpt = opts.find((o) => o.key === mc.correctAnswer);
          const wrongOpts = opts.filter((o) => o.key !== mc.correctAnswer);
          const avgWrong =
            wrongOpts.reduce((s, o) => s + o.text.length, 0) / (wrongOpts.length || 1);
          const ratio = correctOpt.text.length / (avgWrong || 1);
          if (ratio > 2.25 && correctOpt.text.length > 45) {
            violations.push(
              `M${m}_${lvl} Q${mc.id}: length ratio ${ratio.toFixed(2)} (correct: ${correctOpt.text.length}, avgWrong: ${avgWrong.toFixed(1)})`
            );
          }
          opts.forEach((o) => {
            const lower = o.text.toLowerCase();
            for (const phrase of bannedPhrases) {
              if (lower.includes(phrase)) {
                violations.push(`M${m}_${lvl} Q${mc.id} (${o.key}): banned phrase "${phrase}"`);
              }
            }
          });
        });
      }
    }

    expect(violations).toEqual([]);
  });

  test('All 201 slides across Modules 1-9 have matching parsedSlides and parsedVoiceScript with complete fields and clean scripts', () => {
    const fs = require('fs');
    const path = require('path');
    const expectedSlideCounts = {
      1: 23,
      2: 22,
      3: 26,
      4: 21,
      5: 21,
      6: 23,
      7: 22,
      8: 21,
      9: 22
    };

    let totalSlides = 0;

    for (let m = 1; m <= 9; m++) {
      const modPath = path.join(__dirname, '..', 'public', 'course_data', `module_${m}.json`);
      const modData = JSON.parse(fs.readFileSync(modPath, 'utf8'));

      expect(modData.teacher).toBeDefined();
      const ps = modData.teacher.parsedSlides || [];
      const pvs = modData.teacher.parsedVoiceScript || [];

      expect(ps.length).toBe(expectedSlideCounts[m]);
      expect(pvs.length).toBe(expectedSlideCounts[m]);
      totalSlides += ps.length;

      // 1. Verify parsedSlides structure
      ps.forEach((slide, sIdx) => {
        expect(slide.slideNum).toBe(sIdx + 1);
        expect((slide.title || '').length).toBeGreaterThan(0);
        expect((slide.content || '').length).toBeGreaterThan(10);
      });

      // 2. Verify parsedVoiceScript completeness and cleanliness
      pvs.forEach((voice, vIdx) => {
        expect(voice.slideNum).toBe(vIdx + 1);
        expect((voice.title || '').length).toBeGreaterThan(0);
        expect((voice.summary || '').length).toBeGreaterThan(5);
        expect((voice.direction || '').length).toBeGreaterThan(3);
        expect((voice.script || '').length).toBeGreaterThan(15);
        expect((voice.analogy || '').length).toBeGreaterThan(5);
        expect((voice.checkQuestion || '').length).toBeGreaterThan(5);
        expect((voice.checkAnswer || '').length).toBeGreaterThan(3);

        // Ensure raw bracket tags are stripped from teleprompter script
        expect(voice.script).not.toMatch(
          /\[(thoughtful|pause|short pause|warmly|excited|softly|curious|reverent)\]/i
        );

        // Ensure question does not leak the answer
        expect(voice.checkQuestion).not.toContain('(Answer:');
      });
    }

    expect(totalSlides).toBe(201);
  });
});
