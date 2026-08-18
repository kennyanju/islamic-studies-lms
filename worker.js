/**
 * Cloudflare Worker Entry Point
 * Dispatches API requests to Edge API router and serves static assets
 */
import { onRequest } from './functions/api/[[route]].js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route /api/* requests to the Cloudflare Functions / Edge API handler
    if (url.pathname.startsWith('/api')) {
      return onRequest({ request, env, ctx });
    }

    // Serve static assets via Cloudflare Workers Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};
