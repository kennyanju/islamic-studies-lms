const request = require('supertest');
const app = require('../server');

describe('Application Smoke Tests & Path Verification', () => {
  test('GET / - Returns 200 OK and serves index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('Islamic Studies Family LMS');
    expect(res.text).toContain('app-layout');
  });

  test('GET /api/health - Returns 200 OK and health status payload', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('storage');
    expect(res.body).toHaveProperty('storageHealthy', true);
  });

  test('GET /healthz - Health check alias returns 200 OK', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('GET /api/course-data & /api/modules - Serves compiled curriculum payload', async () => {
    const res1 = await request(app).get('/api/course-data');
    expect(res1.statusCode).toBe(200);
    expect(res1.body).toHaveProperty('modules');
    expect(Array.isArray(res1.body.modules)).toBe(true);
    expect(res1.body.modules.length).toBeGreaterThan(0);

    const res2 = await request(app).get('/api/modules');
    expect(res2.statusCode).toBe(200);
    expect(res2.body).toHaveProperty('modules');
    expect(Array.isArray(res2.body.modules)).toBe(true);
    expect(res2.body.modules.length).toBeGreaterThan(0);
  });

  test('GET /style.css - Static CSS assets load properly', async () => {
    const res = await request(app).get('/style.css');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/css/);
  });

  test('GET /app.js - Frontend JavaScript bundle loads properly', async () => {
    const res = await request(app).get('/app.js');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/javascript/);
  });

  test('POST /api/telemetry/csp - Successfully accepts CSP violation report', async () => {
    const res = await request(app)
      .post('/api/telemetry/csp')
      .send({
        'csp-report': {
          'document-uri': 'http://localhost:3000/',
          'violated-directive': 'script-src',
          'blocked-uri': 'http://malicious.example.com/bad.js'
        }
      });
    expect(res.statusCode).toBe(204);
  });
});
