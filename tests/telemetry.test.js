const request = require('supertest');
const app = require('../server');

describe('Error Telemetry & Monitoring API Tests', () => {
  test('POST /api/telemetry/errors - Log client runtime error payload', async () => {
    const res = await request(app).post('/api/telemetry/errors').send({
      message: 'Uncaught TypeError: Cannot read properties of undefined',
      source: 'http://localhost:3000/app.js',
      lineno: 42,
      colno: 12,
      stack: 'TypeError: Cannot read properties of undefined\n at test (app.js:42:12)',
      url: 'http://localhost:3000/modules/1',
      timestamp: new Date().toISOString()
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.logged).toBe(true);
  });
});
