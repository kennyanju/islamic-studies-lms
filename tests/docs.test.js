const request = require('supertest');
const app = require('../server');

describe('OpenAPI Documentation & Health API Tests', () => {
  test('GET /api/docs and /docs return 200 OK and HTML documentation', async () => {
    const res1 = await request(app).get('/api/docs');
    expect(res1.statusCode).toBe(200);
    expect(res1.headers['content-type']).toContain('text/html');

    const res2 = await request(app).get('/docs');
    expect(res2.statusCode).toBe(200);
    expect(res2.headers['content-type']).toContain('text/html');
  });

  test('GET /openapi.json returns valid OpenAPI 3.0 specification', async () => {
    const res = await request(app).get('/openapi.json');
    expect(res.statusCode).toBe(200);
    expect(res.body.openapi).toBe('3.0.3');
    expect(res.body.info.title).toContain('Islamic Studies Family LMS API');
    expect(res.body.paths).toHaveProperty('/api/health');
    expect(res.body.paths).toHaveProperty('/api/auth/login');
  });

  test('GET /api/health returns enriched health information and security headers', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBeTruthy();
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    expect(res.body.memoryRssMb).toBeGreaterThan(0);
    expect(res.body.storageHealthy).toBe(true);

    // Verify security headers
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['permissions-policy']).toBeTruthy();
    expect(res.headers['report-to']).toBeTruthy();
    expect(res.headers['reporting-endpoints']).toContain('csp-endpoint');
  });
});
