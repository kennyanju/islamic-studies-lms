/**
 * Cloudflare Worker Entry Point
 * Dispatches API requests to Edge API router and serves static assets
 */
import { onRequest } from './functions/api/[[route]].js';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // Route /api/* requests to the Cloudflare Functions / Edge API handler
      if (url.pathname.startsWith('/api')) {
        return await onRequest({ request, env, ctx });
      }

      // Serve static assets via Cloudflare Workers Assets
      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }

      return new Response('Not Found', { status: 404 });
    } catch (err) {
      console.error('Unhandled Worker Edge Exception:', err);
      const isApi = new URL(request.url).pathname.startsWith('/api');
      if (isApi) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Internal Server Error. The request could not be processed.',
            details: err.message
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Service Unavailable - Islamic Studies LMS</title>
  <style>
    body { font-family: sans-serif; background: #090d16; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 40px; max-width: 480px; }
    h1 { color: #fbbf24; font-size: 24px; margin-bottom: 12px; }
    p { color: #94a3b8; line-height: 1.5; font-size: 15px; }
    a { display: inline-block; margin-top: 16px; background: #059669; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🕌 Islamic Studies LMS</h1>
    <p>A temporary edge error occurred. Please refresh or try again in a few moments.</p>
    <a href="/">Reload Application</a>
  </div>
</body>
</html>`,
        {
          status: 500,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }
  }
};
