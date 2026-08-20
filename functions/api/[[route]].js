/**
 * Cloudflare Pages Functions - Full-Stack Edge API Router & Workers Backend
 * Enterprise-Hardened Architecture with Cloudflare D1 SQL & WebCrypto
 */

// Global Worker Deployment / Startup Timestamp
if (!globalThis._WORKER_START_TIME) {
  globalThis._WORKER_START_TIME = Date.now();
}

// --------------------------------------------------------------------------
// WebCrypto Password & JWT Helper Functions
// --------------------------------------------------------------------------
async function hashPassword(password, saltHex = null) {
  const enc = new TextEncoder();
  const salt = saltHex ? hexToBuf(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  return `${bufToHex(salt)}:${bufToHex(new Uint8Array(derivedBits))}`;
}

// Constant-time XOR comparison to prevent timing attacks
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  if (bufA.byteLength !== bufB.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < bufA.byteLength; i++) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0;
}

async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [saltHex, originalHashHex] = storedHash.split(':');
  const computed = await hashPassword(password, saltHex);
  const [, computedHashHex] = computed.split(':');
  return timingSafeEqual(originalHashHex, computedHashHex);
}

function bufToHex(buf) {
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// --------------------------------------------------------------------------
// Ephemeral / Runtime Secret Key Generator (Lazy, No hardcoded fallback strings)
// --------------------------------------------------------------------------
function getJwtSecret(env) {
  if (env && env.SESSION_SECRET && env.SESSION_SECRET.length >= 16) {
    return env.SESSION_SECRET;
  }
  if (!globalThis._EPHEMERAL_JWT_SECRET) {
    const randBytes = crypto.getRandomValues(new Uint8Array(32));
    globalThis._EPHEMERAL_JWT_SECRET = bufToHex(randBytes);
  }
  return globalThis._EPHEMERAL_JWT_SECRET;
}

// --------------------------------------------------------------------------
// JWT Session Token Engine (HMAC-SHA256)
// --------------------------------------------------------------------------
async function signJwt(payload, secret) {
  const enc = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  const b64Header = btoa(JSON.stringify(header)).replace(/=/g, '');
  const b64Payload = btoa(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + (7 * 86400) })).replace(/=/g, '');
  const dataToSign = `${b64Header}.${b64Payload}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  const b64Sig = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '');
  return `${dataToSign}.${b64Sig}`;
}

async function verifyJwt(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [b64Header, b64Payload, b64Sig] = parts;
  const dataToSign = `${b64Header}.${b64Payload}`;
  const enc = new TextEncoder();

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const sigBytes = Uint8Array.from(atob(b64Sig), c => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(dataToSign));
    if (!isValid) return null;
    
    const payload = JSON.parse(atob(b64Payload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

function resolveCorsOrigin(request, env) {
  if (!request) return '*';
  const reqOrigin = request.headers.get('Origin');
  if (!reqOrigin) return '*';

  // If ALLOWED_ORIGINS configured (e.g. "https://malikikids.com,https://learn.malikikids.com")
  if (env && env.ALLOWED_ORIGINS) {
    const allowedList = env.ALLOWED_ORIGINS.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const originLower = reqOrigin.toLowerCase();
    if (allowedList.includes(originLower)) {
      return reqOrigin;
    }
    return allowedList[0] || '*';
  }

  return reqOrigin;
}

function jsonResponse(data, status = 200, headers = {}, request = null, env = null) {
  const origin = request ? request.headers.get('Origin') : null;
  const corsOrigin = resolveCorsOrigin(request, env);
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Credentials': (origin && corsOrigin !== '*') ? 'true' : 'false',
    'Vary': 'Origin',
    ...headers
  };
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders
  });
}

// --------------------------------------------------------------------------
// Cloudflare Turnstile Bot Defense Verification Helper
// --------------------------------------------------------------------------
async function verifyTurnstileToken(token, secret, clientIp) {
  if (!secret) return { success: true }; // Passed when Turnstile is not configured
  if (!token) return { success: false, error: 'Turnstile verification token missing' };

  try {
    const formData = new FormData();
    formData.append('secret', secret);
    formData.append('response', token);
    if (clientIp) formData.append('remoteip', clientIp);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    const outcome = await res.json();
    return { success: Boolean(outcome.success), data: outcome };
  } catch (e) {
    console.warn('Turnstile verification network error:', e.message);
    return { success: false, error: 'Turnstile service unavailable' };
  }
}

// --------------------------------------------------------------------------
// Cloudflare Edge Email Dispatch Engine (Resend REST API / Web Standards)
// --------------------------------------------------------------------------
async function sendEdgeEmail({ to, subject, html, text, env }) {
  const from = (env && (env.EMAIL_FROM || env.FROM_EMAIL)) || 'Islamic Studies LMS <onboarding@resend.dev>';
  const apiKey = env && env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          text: text || ''
        })
      });
      const data = await res.json().catch(() => ({}));
      return { success: res.ok, data };
    } catch (e) {
      console.warn('Resend Edge email dispatch exception:', e.message);
      return { success: false, error: e.message };
    }
  }

  console.log(`✉️ [Edge Simulated Email] To: ${to} | Subject: "${subject}" (Set RESEND_API_KEY in Cloudflare Worker secrets for live email delivery)`);
  return { success: true, simulated: true };
}

function buildPasswordResetHtml({ resetUrl, email, displayName }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 560px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; }
    .hdr { background: linear-gradient(135deg, #064e3b, #090d16); padding: 32px; text-align: center; }
    .hdr h1 { color: #fbbf24; margin: 0 0 6px 0; font-size: 22px; }
    .content { padding: 28px; line-height: 1.6; }
    .btn { display: inline-block; background: #059669; color: #ffffff !important; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; margin: 20px 0; }
    .token-box { background: #090d16; border: 1px dashed #fbbf24; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; color: #fbbf24; word-break: break-all; margin: 16px 0; }
    .ftr { padding: 16px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1f2937; }
  </style>
</head>
<body>
  <div class="card">
    <div class="hdr">
      <h1>🕌 Islamic Studies Family LMS</h1>
      <p style="color: #94a3b8; margin: 0; font-size: 14px;">Password Reset Request</p>
    </div>
    <div class="content">
      <h2 style="font-size: 18px; margin-top: 0;">Assalamu Alaikum ${displayName || 'Parent'},</h2>
      <p>We received a request to reset the password for your Islamic Studies LMS account (<strong>${email}</strong>).</p>
      <p>Click the button below to choose a secure new password. This reset link expires in <strong>1 hour</strong>.</p>
      <center><a href="${resetUrl}" class="btn">Reset Password</a></center>
      <p style="font-size: 13px; color: #94a3b8;">Or copy and paste this link in your browser:</p>
      <div class="token-box">${resetUrl}</div>
      <p style="font-size: 13px; color: #94a3b8;">If you did not request a password reset, you can safely ignore this email.</p>
    </div>
    <div class="ftr">
      <p>&copy; ${new Date().getFullYear()} Islamic Studies Family LMS. 100% Private, Secure & Ad-Free.</p>
    </div>
  </div>
</body>
</html>`;
}

function buildWelcomeHtml({ appUrl, email, displayName, role }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 560px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; }
    .hdr { background: linear-gradient(135deg, #064e3b, #090d16); padding: 32px; text-align: center; }
    .hdr h1 { color: #fbbf24; margin: 0 0 6px 0; font-size: 22px; }
    .content { padding: 28px; line-height: 1.6; }
    .btn { display: inline-block; background: #059669; color: #ffffff !important; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; margin: 20px 0; }
    .box { background: #090d16; border: 1px solid #1f2937; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .ftr { padding: 16px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1f2937; }
  </style>
</head>
<body>
  <div class="card">
    <div class="hdr">
      <h1>🕌 Welcome to Islamic Studies LMS</h1>
      <p style="color: #94a3b8; margin: 0; font-size: 14px;">Authentic Maliki Fiqh & Ash'ari Creed Curriculum</p>
    </div>
    <div class="content">
      <h2 style="font-size: 18px; margin-top: 0;">Assalamu Alaikum, ${displayName || 'Family Head'}!</h2>
      <p>Welcome to our family Islamic education portal. Your account (<strong>${email}</strong>) has been registered successfully with the <strong>${role === 'teacher' ? 'Educator' : 'Parent / Family Head'}</strong> role.</p>
      <div class="box">
        <strong style="color: #fbbf24;">Getting Started:</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #cbd5e1; font-size: 14px;">
          <li>Add child profiles with personalized avatars and optional 4-digit PINs.</li>
          <li>Choose between Level 1 (~10y) and Level 2 (13y+ teens) curriculum tracks.</li>
          <li>Monitor quiz mastery and generate printable completion certificates.</li>
        </ul>
      </div>
      <center><a href="${appUrl}" class="btn">Open Family Portal</a></center>
    </div>
    <div class="ftr">
      <p>&copy; ${new Date().getFullYear()} Islamic Studies Family LMS. 100% Private, Secure & Ad-Free.</p>
    </div>
  </div>
</body>
</html>`;
}

// --------------------------------------------------------------------------
// Super Admin First-Run Bootstrap Helper & D1 Schema Assurance
// --------------------------------------------------------------------------
let _d1SchemaInitialized = false;
async function ensureD1Schema(env) {
  if (!env || !env.DB || _d1SchemaInitialized) return;
  try {
    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        display_name TEXT,
        role TEXT DEFAULT 'parent',
        is_verified INTEGER DEFAULT 1,
        provider TEXT DEFAULT 'local',
        password_hash TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS children (
        id TEXT PRIMARY KEY,
        parent_uid TEXT NOT NULL,
        name TEXT NOT NULL,
        avatar TEXT DEFAULT '🌟',
        assigned_track TEXT DEFAULT 'level1',
        pin_hash TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS module_progress (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        module_id INTEGER NOT NULL,
        level TEXT NOT NULL,
        completed INTEGER DEFAULT 1,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS quiz_results (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        module_id INTEGER NOT NULL,
        level TEXT NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        percentage REAL NOT NULL,
        passed INTEGER DEFAULT 0,
        answers_json TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS reset_tokens (
        token TEXT PRIMARY KEY,
        uid TEXT NOT NULL,
        email TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        used INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS reflections (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        module_id INTEGER NOT NULL,
        reflection_text TEXT,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS certificates (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        track TEXT NOT NULL,
        cert_number TEXT UNIQUE NOT NULL,
        issued_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS telemetry_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        source TEXT,
        stack TEXT,
        url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    _d1SchemaInitialized = true;
  } catch (e) {
    // Non-fatal if exec is not supported or already created
  }
}

async function ensureSuperAdminBootstrap(env) {
  if (!env || !env.DB) return;
  try {
    await ensureD1Schema(env);
    const countRow = await env.DB.prepare('SELECT COUNT(*) as c FROM users').first();
    if (countRow && countRow.c === 0) {
      const adminEmail = (env.ADMIN_EMAIL || 'admin@islamicstudies.org').trim().toLowerCase();
      const adminPass = env.ADMIN_PASSWORD || 'Admin@Islam2026!';
      const pHash = await hashPassword(adminPass);
      const uid = 'admin_root_' + Date.now().toString(36);
      await env.DB.prepare(
        'INSERT INTO users (uid, email, display_name, role, is_verified, provider, password_hash) VALUES (?, ?, ?, ?, 1, ?, ?)'
      ).bind(uid, adminEmail, 'Super Administrator', 'super_admin', 'local', pHash).run();
      console.log(`👑 [Bootstrap] Initial Super Admin account created for ${adminEmail}`);
    }
  } catch (err) {
    // Ignore if table not yet initialized
  }
}

// Simple IP-based Rate Limiter (Workers In-Memory Window)
const RATE_LIMIT_MAP = new Map();
function checkRateLimit(ip, path, max = 60, windowSec = 60) {
  const key = `${ip}:${path}`;
  const now = Math.floor(Date.now() / 1000);
  const record = RATE_LIMIT_MAP.get(key) || { count: 0, reset: now + windowSec };

  if (now > record.reset) {
    record.count = 1;
    record.reset = now + windowSec;
    RATE_LIMIT_MAP.set(key, record);
    return true;
  }

  record.count++;
  RATE_LIMIT_MAP.set(key, record);
  return record.count <= max;
}

// --------------------------------------------------------------------------
// Cloudflare Pages Functions Request Handler
// --------------------------------------------------------------------------
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '');
  const method = request.method;
  const jwtSecret = getJwtSecret(env);
  const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1';

  // Ensure first-run Super Admin is initialized if users table is empty
  await ensureSuperAdminBootstrap(env);

  // Handle CORS preflight OPTIONS request
  if (method === 'OPTIONS') {
    const corsOrigin = resolveCorsOrigin(request, env);
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
        'Access-Control-Allow-Credentials': corsOrigin !== '*' ? 'true' : 'false',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin'
      }
    });
  }

  // Tiered Rate Limiting on Auth & Sensitive Endpoints
  if (path === '/auth/login') {
    if (!checkRateLimit(clientIp, 'auth_login', 10, 60)) {
      return jsonResponse({ success: false, error: 'Too many login attempts. Please wait 1 minute before retrying.' }, 429, {}, request, env);
    }
  } else if (path === '/auth/register') {
    if (!checkRateLimit(clientIp, 'auth_register', 5, 60)) {
      return jsonResponse({ success: false, error: 'Too many account registration requests. Please wait a moment and try again.' }, 429, {}, request, env);
    }
  } else if (path === '/auth/forgot-password' || path === '/auth/reset-password') {
    if (!checkRateLimit(clientIp, 'auth_reset', 5, 60)) {
      return jsonResponse({ success: false, error: 'Too many password reset requests. Please wait a moment.' }, 429, {}, request, env);
    }
  } else if (path.startsWith('/auth/')) {
    if (!checkRateLimit(clientIp, 'auth_general', 30, 60)) {
      return jsonResponse({ success: false, error: 'Too many authentication attempts. Please wait a moment and try again.' }, 429, {}, request, env);
    }
  }

  // Extract authenticated user from signed JWT cookie or Authorization header
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const token = cookies['cf_session'] || (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const authUser = await verifyJwt(token, jwtSecret);

  // 1. Deep Health Endpoint
  if (path === '/health' && method === 'GET') {
    const uptime = Math.floor((Date.now() - globalThis._WORKER_START_TIME) / 1000);
    let dbStatus = 'disconnected';
    let dbLatencyMs = null;

    if (env.DB) {
      const start = Date.now();
      try {
        await env.DB.prepare('SELECT 1 as ping').first();
        dbStatus = 'healthy';
        dbLatencyMs = Date.now() - start;
      } catch (dbErr) {
        dbStatus = 'error: ' + dbErr.message;
      }
    } else {
      dbStatus = 'unbound (edge memory mode)';
    }

    const isHealthy = dbStatus === 'healthy' || dbStatus === 'unbound (edge memory mode)';
    return jsonResponse({
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      storage: env.DB ? 'Cloudflare D1 SQL' : 'Edge Memory',
      databaseStatus: dbStatus,
      databaseLatencyMs: dbLatencyMs,
      uptime,
      edge: 'Cloudflare Global Network',
      storageHealthy: isHealthy
    }, isHealthy ? 200 : 503, {}, request, env);
  }

  // 2. Auth: Session Verification (Me)
  if (path === '/auth/me' && method === 'GET') {
    if (!authUser) {
      return jsonResponse({ success: false, user: null }, 200, {}, request, env);
    }
    return jsonResponse({ success: true, user: authUser }, 200, {}, request, env);
  }

  // 3. Auth: Register
  if (path === '/auth/register' && method === 'POST') {
    try {
      const body = await request.json();
      const { email, password, displayName, role, turnstileToken } = body;

      // Turnstile Bot Defense
      if (env.TURNSTILE_SECRET_KEY) {
        const turnstile = await verifyTurnstileToken(turnstileToken, env.TURNSTILE_SECRET_KEY, clientIp);
        if (!turnstile.success) {
          return jsonResponse({ success: false, error: 'Security verification failed. Please complete the captcha check and try again.' }, 400, {}, request, env);
        }
      }

      if (!email || !password || typeof password !== 'string' || password.length < 6) {
        return jsonResponse({ success: false, error: 'Valid email and secure password (min 6 characters) are required.' }, 400, {}, request, env);
      }
      if (email.length > 254 || (displayName && displayName.length > 100)) {
        return jsonResponse({ success: false, error: 'Input exceeds maximum allowed length.' }, 400, {}, request, env);
      }

      const cleanEmail = email.trim().toLowerCase();
      const userRole = (role === 'teacher' || role === 'educator') ? 'teacher' : 'parent';
      const name = (displayName || cleanEmail.split('@')[0]).trim().slice(0, 100);
      const uid = 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);

      if (env.DB) {
        try {
          const existing = await env.DB.prepare('SELECT uid FROM users WHERE email = ?').bind(cleanEmail).first();
          if (existing) {
            return jsonResponse({ success: false, error: 'An account with this email already exists.' }, 400, {}, request, env);
          }
          const pHash = await hashPassword(password);

          await env.DB.prepare(
            'INSERT INTO users (uid, email, display_name, role, is_verified, provider, password_hash) VALUES (?, ?, ?, ?, 1, ?, ?)'
          ).bind(uid, cleanEmail, name, userRole, 'local', pHash).run();

          // Dispatch Welcome Email in the background
          sendEdgeEmail({
            to: cleanEmail,
            subject: 'Welcome to Islamic Studies Family LMS 🕌',
            html: buildWelcomeHtml({ appUrl: url.origin, email: cleanEmail, displayName: name, role: userRole }),
            env
          }).catch(e => console.warn('Welcome email notice:', e.message));
        } catch (dbErr) {
          console.warn('D1 insert warning:', dbErr.message);
        }
      }

      const user = { uid, email: cleanEmail, displayName: name, role: userRole, isVerified: true, provider: 'local' };
      const sessionToken = await signJwt(user, jwtSecret);
      return jsonResponse({ success: true, user }, 200, {
        'Set-Cookie': `cf_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=604800`
      }, request, env);
    } catch (err) {
      return jsonResponse({ success: false, error: 'Registration error: ' + err.message }, 500, {}, request, env);
    }
  }

  // 4. Auth: Login
  if (path === '/auth/login' && method === 'POST') {
    try {
      const body = await request.json();
      const { email, password, turnstileToken } = body;

      // Turnstile Bot Defense
      if (env.TURNSTILE_SECRET_KEY) {
        const turnstile = await verifyTurnstileToken(turnstileToken, env.TURNSTILE_SECRET_KEY, clientIp);
        if (!turnstile.success) {
          return jsonResponse({ success: false, error: 'Security verification failed. Please complete the captcha check and try again.' }, 400, {}, request, env);
        }
      }

      if (!email || !password || typeof password !== 'string') {
        return jsonResponse({ success: false, error: 'Email and password are required.' }, 400, {}, request, env);
      }
      const cleanEmail = email.trim().toLowerCase();

      // Check Cloudflare D1 Database
      if (env.DB) {
        try {
          const row = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(cleanEmail).first();
          if (row) {
            const isMatch = await verifyPassword(password, row.password_hash);
            if (isMatch) {
              const user = {
                uid: row.uid,
                email: row.email,
                displayName: row.display_name,
                role: row.role,
                isVerified: Boolean(row.is_verified),
                provider: row.provider
              };
              const sessionToken = await signJwt(user, jwtSecret);
              return jsonResponse({ success: true, user }, 200, {
                'Set-Cookie': `cf_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=604800`
              }, request, env);
            }
          }
        } catch (dbErr) {
          console.warn('D1 lookup notice:', dbErr.message);
        }
      }

      return jsonResponse({ success: false, error: 'Invalid email or password.' }, 401, {}, request, env);
    } catch (err) {
      return jsonResponse({ success: false, error: 'Login error: ' + err.message }, 500, {}, request, env);
    }
  }

  // 5. Auth: Logout
  if (path === '/auth/logout' && method === 'POST') {
    return jsonResponse({ success: true }, 200, {
      'Set-Cookie': `cf_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`
    }, request, env);
  }

  // 6. Auth: Forgot Password & Reset Password
  if (path === '/auth/forgot-password' && method === 'POST') {
    try {
      const body = await request.json();
      const { email, turnstileToken } = body;

      // Turnstile Bot Defense
      if (env.TURNSTILE_SECRET_KEY) {
        const turnstile = await verifyTurnstileToken(turnstileToken, env.TURNSTILE_SECRET_KEY, clientIp);
        if (!turnstile.success) {
          return jsonResponse({ success: false, error: 'Security verification failed. Please complete the captcha check.' }, 400, {}, request, env);
        }
      }

      if (!email) return jsonResponse({ success: false, error: 'Email is required' }, 400, {}, request, env);

      const cleanEmail = email.trim().toLowerCase();
      const resetToken = 'rst_' + crypto.randomUUID().replace(/-/g, '');
      const expiresAt = Date.now() + 3600000; // 1 hour

      if (env.DB) {
        const user = await env.DB.prepare('SELECT uid, display_name FROM users WHERE email = ?').bind(cleanEmail).first();
        if (user) {
          await env.DB.prepare(
            'INSERT INTO reset_tokens (token, uid, email, expires_at, used) VALUES (?, ?, ?, ?, 0)'
          ).bind(resetToken, user.uid, cleanEmail, expiresAt).run();

          const resetUrl = `${url.origin}/?resetToken=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(cleanEmail)}`;
          sendEdgeEmail({
            to: cleanEmail,
            subject: 'Password Reset Request - Islamic Studies LMS 🔐',
            html: buildPasswordResetHtml({ resetUrl, email: cleanEmail, displayName: user.display_name }),
            env
          }).catch(e => console.warn('Password reset email dispatch notice:', e.message));
        }
      }

      // Security: Do NOT leak reset token in public JSON payload
      return jsonResponse({
        success: true,
        message: 'If an account matches that email address, password reset instructions have been dispatched.'
      }, 200, {}, request, env);
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500, {}, request, env);
    }
  }

  if (path === '/auth/reset-password' && method === 'POST') {
    try {
      const body = await request.json().catch(() => ({}));
      const token = body.token;
      const targetPass = body.newPassword || body.password;
      if (!token || !targetPass || typeof targetPass !== 'string' || targetPass.length < 8) {
        return jsonResponse({ success: false, error: 'Valid token and secure new password (min 8 characters) are required.' }, 400, {}, request);
      }

      let updatedUser = null;
      if (env.DB) {
        const record = await env.DB.prepare(
          'SELECT * FROM reset_tokens WHERE token = ? AND used = 0'
        ).bind(token).first();

        if (!record || record.expires_at < Date.now()) {
          return jsonResponse({ success: false, error: 'Invalid or expired password reset token. Please request a new one.' }, 400, {}, request);
        }

        const pHash = await hashPassword(targetPass);
        await env.DB.prepare('UPDATE users SET password_hash = ? WHERE uid = ?').bind(pHash, record.uid).run();
        await env.DB.prepare('UPDATE reset_tokens SET used = 1 WHERE token = ?').bind(token).run();

        const userRow = await env.DB.prepare('SELECT * FROM users WHERE uid = ?').bind(record.uid).first();
        if (userRow) {
          updatedUser = {
            uid: userRow.uid,
            email: userRow.email,
            displayName: userRow.display_name,
            role: userRow.role,
            isVerified: Boolean(userRow.is_verified),
            provider: userRow.provider
          };
        }

        // Audit Log
        await env.DB.prepare(
          'INSERT INTO audit_log (actor_uid, action, target_uid, ip_address) VALUES (?, ?, ?, ?)'
        ).bind(record.uid, 'PASSWORD_RESET', record.uid, clientIp).run().catch(() => {});
      }

      let cookieHeader = {};
      if (updatedUser) {
        const sessionToken = await signJwt(updatedUser, jwtSecret);
        cookieHeader['Set-Cookie'] = `cf_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=604800`;
      }

      return jsonResponse({
        success: true,
        message: 'Password has been successfully reset. You are now signed in.',
        user: updatedUser
      }, 200, cookieHeader, request);
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500, {}, request);
    }
  }

  // 7. User Profile Update
  if (path === '/user/profile' && method === 'PUT') {
    if (!authUser) return jsonResponse({ success: false, error: 'Authentication required' }, 401, {}, request);
    try {
      const body = await request.json();
      const { displayName } = body;
      const cleanName = (displayName || '').trim().slice(0, 100);

      if (env.DB && cleanName) {
        await env.DB.prepare('UPDATE users SET display_name = ? WHERE uid = ?').bind(cleanName, authUser.uid).run();
      }

      const updatedUser = { ...authUser, displayName: cleanName };
      const sessionToken = await signJwt(updatedUser, jwtSecret);
      return jsonResponse({ success: true, user: updatedUser }, 200, {
        'Set-Cookie': `cf_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=604800`
      }, request);
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500, {}, request);
    }
  }

  // 8. Parent Children CRUD
  if (path === '/parent/children' && method === 'GET') {
    const parentUid = authUser ? authUser.uid : null;
    if (!parentUid || !env.DB) return jsonResponse({ success: true, children: [] }, 200, {}, request);

    try {
      const { results } = await env.DB.prepare(
        'SELECT id, name, avatar, assigned_track as assignedTrack, CASE WHEN pin_hash IS NOT NULL AND pin_hash != "" THEN 1 ELSE 0 END as hasPin FROM children WHERE parent_uid = ?'
      ).bind(parentUid).all();

      return jsonResponse({ success: true, children: results || [] }, 200, {}, request);
    } catch (err) {
      return jsonResponse({ success: true, children: [] }, 200, {}, request);
    }
  }

  if (path === '/parent/children' && method === 'POST') {
    if (!authUser) return jsonResponse({ success: false, error: 'Authentication required' }, 401, {}, request);
    const body = await request.json();
    const { name, avatar, assignedTrack, pin } = body;
    if (!name || typeof name !== 'string') return jsonResponse({ success: false, error: 'Name is required' }, 400, {}, request);

    const childId = 'child_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const pinHash = pin ? await hashPassword(pin) : null;
    const cleanName = name.trim().slice(0, 100);
    const cleanAvatar = (avatar || '🌟').slice(0, 10);
    const cleanTrack = (assignedTrack === 'level2' || assignedTrack === 'teacher') ? assignedTrack : 'level1';

    if (env.DB) {
      await env.DB.prepare(
        'INSERT INTO children (id, parent_uid, name, avatar, assigned_track, pin_hash) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(childId, authUser.uid, cleanName, cleanAvatar, cleanTrack, pinHash).run();
    }

    return jsonResponse({
      success: true,
      child: { id: childId, name: cleanName, avatar: cleanAvatar, assignedTrack: cleanTrack, hasPin: Boolean(pin) }
    }, 200, {}, request);
  }

  if (path.match(/^\/parent\/children\/[^/]+$/) && method === 'PUT') {
    if (!authUser) return jsonResponse({ success: false, error: 'Authentication required' }, 401, {}, request);
    const childId = path.split('/')[3];
    const body = await request.json();
    const { name, avatar, assignedTrack, pin } = body;
    const cleanName = (name || '').trim().slice(0, 100);
    const cleanAvatar = (avatar || '🌟').slice(0, 10);
    const cleanTrack = (assignedTrack === 'level2' || assignedTrack === 'teacher') ? assignedTrack : 'level1';

    if (env.DB) {
      const pinHash = pin ? await hashPassword(pin) : null;
      if (pin) {
        await env.DB.prepare(
          'UPDATE children SET name = ?, avatar = ?, assigned_track = ?, pin_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND parent_uid = ?'
        ).bind(cleanName, cleanAvatar, cleanTrack, pinHash, childId, authUser.uid).run();
      } else {
        await env.DB.prepare(
          'UPDATE children SET name = ?, avatar = ?, assigned_track = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND parent_uid = ?'
        ).bind(cleanName, cleanAvatar, cleanTrack, childId, authUser.uid).run();
      }
    }

    return jsonResponse({
      success: true,
      child: { id: childId, name: cleanName, avatar: cleanAvatar, assignedTrack: cleanTrack, hasPin: Boolean(pin) }
    }, 200, {}, request);
  }

  if (path.match(/^\/parent\/children\/[^/]+$/) && method === 'DELETE') {
    if (!authUser) return jsonResponse({ success: false, error: 'Authentication required' }, 401, {}, request);
    const childId = path.split('/')[3];

    if (env.DB) {
      await env.DB.prepare('DELETE FROM children WHERE id = ? AND parent_uid = ?').bind(childId, authUser.uid).run();
      await env.DB.prepare('DELETE FROM module_progress WHERE student_id = ?').bind(childId).run();
      await env.DB.prepare('DELETE FROM quiz_results WHERE student_id = ?').bind(childId).run();
    }

    return jsonResponse({ success: true, message: 'Child profile deleted successfully' }, 200, {}, request);
  }

  // 8.5 Parent Progress Sync & Reset
  if (path === '/progress/sync' && method === 'GET') {
    if (!authUser) return jsonResponse({ success: false, error: 'Authentication required' }, 401, {}, request);
    
    if (env.DB) {
      try {
        const { results: children } = await env.DB.prepare('SELECT id FROM children WHERE parent_uid = ?').bind(authUser.uid).all();
        const progressData = {};
        for (const child of children || []) {
          const targetKey = `child_${child.id}`;
          const pRows = await env.DB.prepare('SELECT module_id as moduleId, level, completed FROM module_progress WHERE student_id = ?').bind(child.id).all();
          progressData[targetKey] = {};
          (pRows.results || []).forEach(r => {
            if (r.completed) progressData[targetKey][`mod_${r.moduleId}`] = true;
          });
          const qRows = await env.DB.prepare('SELECT * FROM quiz_results WHERE student_id = ?').bind(child.id).all();
          progressData[`${targetKey}_scores`] = qRows.results || [];
        }
        return jsonResponse({ success: true, data: progressData }, 200, {}, request);
      } catch (err) {
        return jsonResponse({ success: false, error: err.message }, 500, {}, request);
      }
    }
    return jsonResponse({ success: true, data: {} }, 200, {}, request);
  }

  if (path === '/parent/progress/reset' && method === 'DELETE') {
    if (!authUser) return jsonResponse({ success: false, error: 'Authentication required' }, 401, {}, request);
    try {
      const body = await request.json();
      const { childId, moduleId } = body;
      if (!childId) return jsonResponse({ success: false, error: 'childId required' }, 400, {}, request);
      
      if (env.DB) {
        const child = await env.DB.prepare('SELECT parent_uid FROM children WHERE id = ?').bind(childId).first();
        if (!child || child.parent_uid !== authUser.uid) {
          return jsonResponse({ success: false, error: 'Unauthorized' }, 403, {}, request);
        }
        
        if (moduleId) {
          await env.DB.prepare('DELETE FROM module_progress WHERE student_id = ? AND module_id = ?').bind(childId, moduleId).run();
          await env.DB.prepare('DELETE FROM quiz_results WHERE student_id = ? AND module_id = ?').bind(childId, moduleId).run();
        } else {
          await env.DB.prepare('DELETE FROM module_progress WHERE student_id = ?').bind(childId).run();
          await env.DB.prepare('DELETE FROM quiz_results WHERE student_id = ?').bind(childId).run();
        }
      }
      return jsonResponse({ success: true }, 200, {}, request);
    } catch (err) {
      return jsonResponse({ success: false, error: err.message }, 500, {}, request);
    }
  }

  // 9. Public Direct Child Access (Match by Exact UUID or Profile Name)
  if (path.match(/^\/public\/child\/[^/]+$/) && method === 'GET') {
    const rawChildId = path.split('/')[3] || '';
    const childId = decodeURIComponent(rawChildId).trim();
    if (!env.DB) return jsonResponse({ success: false, error: 'Database not initialized' }, 404, {}, request);

    try {
      const row = await env.DB.prepare(
        'SELECT id, name, avatar, assigned_track as assignedTrack, CASE WHEN pin_hash IS NOT NULL AND pin_hash != "" THEN 1 ELSE 0 END as hasPin FROM children WHERE id = ? OR LOWER(id) = LOWER(?) OR LOWER(name) = LOWER(?)'
      ).bind(childId, childId, childId).first();

      if (!row) {
        return jsonResponse({ success: false, error: 'Learner profile not found.' }, 404, {}, request);
      }

      return jsonResponse({
        success: true,
        child: {
          id: row.id,
          name: row.name,
          avatar: row.avatar || '🌟',
          assignedTrack: row.assignedTrack || 'level1',
          hasPin: Boolean(row.hasPin)
        }
      }, 200, {}, request);
    } catch (err) {
      return jsonResponse({ success: false, error: 'Error fetching learner: ' + err.message }, 500, {}, request);
    }
  }

  if (path.match(/^\/public\/child\/[^/]+\/verify-pin$/) && method === 'POST') {
    const rawChildId = path.split('/')[3] || '';
    const childId = decodeURIComponent(rawChildId).trim();
    const body = await request.json();
    const { pin } = body;

    if (!env.DB) return jsonResponse({ success: true, verified: true }, 200, {}, request);
    try {
      const row = await env.DB.prepare(
        'SELECT id, name, avatar, assigned_track as assignedTrack, pin_hash, CASE WHEN pin_hash IS NOT NULL AND pin_hash != "" THEN 1 ELSE 0 END as hasPin FROM children WHERE id = ? OR LOWER(id) = LOWER(?) OR LOWER(name) = LOWER(?)'
      ).bind(childId, childId, childId).first();

      if (!row) {
        return jsonResponse({ success: false, error: 'Learner profile not found.' }, 404, {}, request);
      }

      if (!row.pin_hash) {
        return jsonResponse({
          success: true,
          verified: true,
          child: {
            id: row.id,
            name: row.name,
            avatar: row.avatar || '🌟',
            assignedTrack: row.assignedTrack || 'level1',
            hasPin: false
          }
        }, 200, {}, request);
      }

      const isMatch = await verifyPassword(pin, row.pin_hash);
      if (!isMatch) {
        return jsonResponse({ success: false, verified: false, error: 'Incorrect PIN. Please try again.' }, 401, {}, request);
      }

      return jsonResponse({
        success: true,
        verified: true,
        child: {
          id: row.id,
          name: row.name,
          avatar: row.avatar || '🌟',
          assignedTrack: row.assignedTrack || 'level1',
          hasPin: true
        }
      }, 200, {}, request);
    } catch (err) {
      return jsonResponse({ success: false, error: 'Error verifying PIN: ' + err.message }, 500, {}, request);
    }
  }

  // 10. Authoritative Quiz Grading & Progress Tracking
  if (path === '/quiz/grade' && method === 'POST') {
    if (!checkRateLimit(clientIp, 'quiz_grade', 10, 60)) {
      return jsonResponse({ success: false, error: 'Too many quiz submissions. Please wait.' }, 429, {}, request, env);
    }
    try {
      const body = await request.json();
      const { moduleId, track, answers, reflections, childId, guestId } = body;
      const mId = parseInt(moduleId, 10);
      const studentTrack = track === 'level2' ? 'level2' : 'level1';
      let studentId = childId || (authUser ? authUser.uid : null);
      if (!studentId) studentId = guestId || crypto.randomUUID();

      const submittedAnswers = answers || {};
      const submittedReflections = reflections || {};
      let score = 0;
      const feedback = [];
      
      if (env.DB) {
        const attemptsCount = await env.DB.prepare(`
          SELECT COUNT(*) as count 
          FROM quiz_results 
          WHERE student_id = ? AND module_id = ? AND DATE(created_at) = DATE('now')
        `).bind(studentId, mId).first();
        if (attemptsCount && attemptsCount.count >= 3) {
          return jsonResponse({ success: false, error: 'Daily attempt limit (3) reached for this module. Try again tomorrow.' }, 429, {}, request, env);
        }
      }

      // Fetch compiled curriculum data for authoritative grading
      let moduleQuestions = [];
      try {
        // Try modular chunk first, then full course data
        const chunkRes = await fetch(`${url.origin}/course_data/module_${mId}.json`);
        if (chunkRes.ok) {
          const mod = await chunkRes.json();
          if (mod.tracks && mod.tracks[studentTrack] && mod.tracks[studentTrack].parsedQuestions) {
            moduleQuestions = mod.tracks[studentTrack].parsedQuestions.multipleChoice || [];
          }
        } else {
          const courseDataRes = await fetch(`${url.origin}/course_data.json`);
          if (courseDataRes.ok) {
            const courseData = await courseDataRes.json();
            const targetModule = (courseData.modules || []).find(m => m.id === mId);
            if (targetModule && targetModule.tracks && targetModule.tracks[studentTrack]) {
              moduleQuestions = targetModule.tracks[studentTrack].parsedQuestions?.multipleChoice || [];
            }
          }
        }
      } catch (e) {
        console.warn('Could not fetch authoritative course data for grading:', e.message);
      }

      if (!moduleQuestions || moduleQuestions.length === 0) {
        return jsonResponse({
          success: false,
          error: 'Authoritative quiz curriculum is temporarily unavailable for grading. Please retry in a moment.'
        }, 503, {}, request);
      }

      const keys = Object.keys(submittedAnswers || {});
      const hasZeroKey = keys.includes('0') || keys.includes(0);

      moduleQuestions.forEach((q, idx) => {
        let rawAns;
        if (hasZeroKey) {
          rawAns = submittedAnswers[idx] !== undefined ? submittedAnswers[idx] : submittedAnswers[String(idx)];
        } else {
          const qId = q.id !== undefined ? q.id : (idx + 1);
          rawAns = submittedAnswers[qId] !== undefined ? submittedAnswers[qId] :
                   submittedAnswers[String(qId)] !== undefined ? submittedAnswers[String(qId)] :
                   submittedAnswers[`q${qId}`] !== undefined ? submittedAnswers[`q${qId}`] :
                   submittedAnswers[`q_${qId}`] !== undefined ? submittedAnswers[`q_${qId}`] :
                   submittedAnswers[idx + 1] !== undefined ? submittedAnswers[idx + 1] :
                   submittedAnswers[String(idx + 1)];
        }

        const selected = (rawAns || '').toString().trim().toUpperCase();
        const isCorrect = q.correctAnswer ? (selected === q.correctAnswer.toUpperCase()) : false;
        if (isCorrect) score++;

        feedback.push({
          questionId: q.id || `q_${idx}`,
          questionIndex: idx,
          selectedAnswer: selected,
          correctAnswer: q.correctAnswer || 'A',
          isCorrect,
          explanation: q.explanation || 'Refer to student lesson handout and classical Maliki fiqh text.'
        });
      });

      const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
      const passed = percentage >= 80;

      if (env.DB) {
        const quizId = 'quiz_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
        await env.DB.prepare(
          'INSERT INTO quiz_results (id, student_id, module_id, level, score, total, percentage, passed, answers_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(quizId, studentId, mId, studentTrack, score, total, percentage, passed ? 1 : 0, JSON.stringify(submittedAnswers)).run();

        if (Object.keys(submittedReflections).length > 0) {
          for (const qId of Object.keys(submittedReflections)) {
             const refId = 'ref_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
             await env.DB.prepare(
               'INSERT INTO reflections (id, student_id, module_id, question_id, response_text) VALUES (?, ?, ?, ?, ?)'
             ).bind(refId, studentId, mId, qId, submittedReflections[qId]).run().catch(() => {});
          }
        }

        if (passed) {
          const progId = `prog_${studentId}_${mId}`;
          await env.DB.prepare(
            'INSERT OR REPLACE INTO module_progress (id, student_id, module_id, level, completed, updated_at) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)'
          ).bind(progId, studentId, mId, studentTrack).run();
          
          if (childId && authUser && authUser.email) {
             const childRow = await env.DB.prepare('SELECT name FROM children WHERE id = ?').bind(childId).first();
             sendEdgeEmail({
               to: authUser.email,
               subject: `🎉 ${childRow?.name || 'Your child'} just passed Module ${mId}!`,
               text: `Great news! They scored ${percentage}% on the quiz. Log in to view their certificate.`,
               html: `<p>Great news! They scored <strong>${percentage}%</strong> on the quiz.</p><p>Log in to view their certificate.</p>`,
               env
             }).catch(err => console.warn('Notification email failed:', err.message));
          }
        }
      }

      return jsonResponse({
        success: true,
        moduleId: mId,
        track: studentTrack,
        score,
        total,
        percentage,
        passed,
        feedback
      }, 200, {}, request);
    } catch (e) {
      return jsonResponse({ success: false, error: 'Grading error: ' + e.message }, 500, {}, request);
    }
  }

  // 11. Module Progress Endpoints
  if (path === '/quiz/progress' && method === 'GET') {
    const studentId = url.searchParams.get('studentId') || (authUser ? authUser.uid : null);
    if (!studentId || !env.DB) return jsonResponse({ success: true, progress: {} }, 200, {}, request);

    try {
      const { results } = await env.DB.prepare(
        'SELECT module_id as moduleId, level, completed FROM module_progress WHERE student_id = ?'
      ).bind(studentId).all();

      const progressMap = {};
      (results || []).forEach(r => {
        if (r.completed) progressMap[`mod_${r.moduleId}`] = true;
      });
      return jsonResponse({ success: true, progress: progressMap }, 200, {}, request);
    } catch (e) {
      return jsonResponse({ success: true, progress: {} }, 200, {}, request);
    }
  }

  if (path === '/quiz/progress' && method === 'POST') {
    try {
      const body = await request.json();
      const { studentId, moduleId, level, completed } = body;
      const sId = studentId || (authUser ? authUser.uid : 'guest');
      const mId = parseInt(moduleId, 10);
      const lvl = level || 'level1';

      if (env.DB && sId && mId) {
        const progId = `prog_${sId}_${mId}`;
        await env.DB.prepare(
          'INSERT OR REPLACE INTO module_progress (id, student_id, module_id, level, completed, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
        ).bind(progId, sId, mId, lvl, completed ? 1 : 0).run();
      }

      return jsonResponse({ success: true, moduleId: mId, completed: Boolean(completed) }, 200, {}, request);
    } catch (e) {
      return jsonResponse({ success: false, error: e.message }, 500, {}, request);
    }
  }

  // 12. Telemetry & CSP Logs
  if (path === '/telemetry/errors' && method === 'POST') {
    try {
      const body = await request.json();
      if (env.DB) {
        await env.DB.prepare(
          'INSERT INTO telemetry_logs (message, source, stack, url) VALUES (?, ?, ?, ?)'
        ).bind((body.message || '').slice(0, 500), (body.source || '').slice(0, 200), (body.stack || '').slice(0, 1000), (body.url || '').slice(0, 300)).run();
      }
      return jsonResponse({ success: true, logged: true }, 200, {}, request);
    } catch (e) {
      return jsonResponse({ success: true, logged: false }, 200, {}, request);
    }
  }

  if (path === '/telemetry/csp' && method === 'POST') {
    try {
      const body = await request.json();
      if (env.DB) {
        await env.DB.prepare(
          'INSERT INTO telemetry_logs (message, source, stack, url) VALUES (?, ?, ?, ?)'
        ).bind('CSP Violation: ' + JSON.stringify(body).slice(0, 500), 'csp', '', url.href).run();
      }
      return new Response(null, { status: 204 });
    } catch (e) {
      return new Response(null, { status: 204 });
    }
  }

  // 13. Admin Overview Dashboard
  if (path === '/admin/overview' && method === 'GET') {
    if (!authUser || authUser.role !== 'super_admin') {
      return jsonResponse({ success: false, error: 'Forbidden: Super Admin only' }, 403, {}, request);
    }
    let totalParents = 1, totalKids = 0, totalQuizSubmissions = 0, totalCompletedModules = 0, avgQuizScore = 90, clientErrorsCount = 0, cspViolationsCount = 0;
    const uptime = Math.floor((Date.now() - globalThis._WORKER_START_TIME) / 1000);

    if (env.DB) {
      try {
        const uCount = await env.DB.prepare('SELECT COUNT(*) as c FROM users').first();
        const cCount = await env.DB.prepare('SELECT COUNT(*) as c FROM children').first();
        const qCount = await env.DB.prepare('SELECT COUNT(*) as c FROM quiz_results').first();
        const pCount = await env.DB.prepare('SELECT COUNT(*) as c FROM module_progress WHERE completed = 1').first();
        const qAvg = await env.DB.prepare('SELECT AVG(score) as avg FROM quiz_results').first();
        const eCount = await env.DB.prepare("SELECT COUNT(*) as c FROM telemetry_logs WHERE source != 'csp'").first().catch(() => ({ c: 0 }));
        const cspCount = await env.DB.prepare("SELECT COUNT(*) as c FROM telemetry_logs WHERE source = 'csp'").first().catch(() => ({ c: 0 }));

        totalParents = uCount ? uCount.c : 0;
        totalKids = cCount ? cCount.c : 0;
        totalQuizSubmissions = qCount ? qCount.c : 0;
        totalCompletedModules = pCount ? pCount.c : 0;
        avgQuizScore = qAvg && qAvg.avg ? Math.round(qAvg.avg) : 0;
        clientErrorsCount = eCount ? eCount.c : 0;
        cspViolationsCount = cspCount ? cspCount.c : 0;
        
        const passedRow = await env.DB.prepare('SELECT COUNT(*) as c FROM quiz_results WHERE percentage >= 80 OR passed = 1').first();
        const passRate = totalQuizSubmissions > 0 ? Math.round(((passedRow ? passedRow.c : 0) / totalQuizSubmissions) * 100) : 0;

        // Periodic maintenance cleanup (prune logs older than 30 days & expired tokens)
        await env.DB.prepare("DELETE FROM telemetry_logs WHERE created_at < datetime('now', '-30 days')").run().catch(() => {});
        await env.DB.prepare('DELETE FROM reset_tokens WHERE used = 1 OR expires_at < ?').bind(Date.now()).run().catch(() => {});
      } catch (err) {
        console.warn('D1 admin overview error:', err.message);
      }
    }
    
    // Default passRate logic if DB not active or error
    const finalPassRate = (env.DB && typeof passRate !== 'undefined') ? passRate : (totalQuizSubmissions > 0 ? 0 : 0);

    return jsonResponse({
      success: true,
      stats: {
        totalParents,
        totalKids,
        totalQuizSubmissions,
        totalCompletedModules,
        avgQuizScore,
        passRate: finalPassRate,
        system: {
          uptime,
          nodeEnv: 'production',
          storage: 'Cloudflare D1 SQL',
          clientErrorsCount,
          cspViolationsCount,
          status: '100% Operational (Cloudflare Global Edge)'
        }
      }
    }, 200, {}, request);
  }

  // 14. Admin Users List & Role Management
  if (path === '/admin/users' && method === 'GET') {
    if (!authUser || authUser.role !== 'super_admin') {
      return jsonResponse({ success: false, error: 'Forbidden: Super Admin only' }, 403, {}, request);
    }
    let usersList = [];
    if (env.DB) {
      try {
        const { results } = await env.DB.prepare(
          'SELECT uid, email, display_name as displayName, role, provider, is_verified as isVerified, created_at as createdAt FROM users ORDER BY created_at DESC LIMIT 100'
        ).all();
        const childrenRows = await env.DB.prepare(
          'SELECT id, parent_uid as parentUid, name, avatar, assigned_track as assignedTrack FROM children'
        ).all();
        const allKids = childrenRows?.results || [];
        usersList = (results || []).map(u => {
          const userKids = allKids.filter(k => k.parentUid === u.uid);
          return {
            ...u,
            childrenCount: userKids.length,
            children: userKids
          };
        });
      } catch (err) {
        console.warn('D1 admin users error:', err.message);
      }
    }
    return jsonResponse({ success: true, users: usersList }, 200, {}, request);
  }

  if (path.match(/^\/admin\/users\/[^/]+\/role$/) && method === 'PUT') {
    if (!authUser || authUser.role !== 'super_admin') {
      return jsonResponse({ success: false, error: 'Forbidden: Super Admin only' }, 403, {}, request);
    }
    const targetUid = path.split('/')[3];
    const body = await request.json();
    const { role } = body;

    if (!['parent', 'super_admin', 'teacher'].includes(role)) {
      return jsonResponse({ success: false, error: 'Invalid role' }, 400, {}, request);
    }

    if (env.DB) {
      await env.DB.prepare('UPDATE users SET role = ? WHERE uid = ?').bind(role, targetUid).run();
      await env.DB.prepare(
        'INSERT INTO audit_log (actor_uid, action, target_uid, metadata, ip_address) VALUES (?, ?, ?, ?, ?)'
      ).bind(authUser.uid, 'CHANGE_ROLE', targetUid, JSON.stringify({ newRole: role }), clientIp).run().catch(() => {});
    }
    return jsonResponse({ success: true, uid: targetUid, role }, 200, {}, request);
  }

  if (path.match(/^\/admin\/users\/[^/]+$/) && method === 'DELETE') {
    if (!authUser || authUser.role !== 'super_admin') {
      return jsonResponse({ success: false, error: 'Forbidden: Super Admin only' }, 403, {}, request);
    }
    const targetUid = path.split('/')[3];
    if (authUser.uid === targetUid) {
      return jsonResponse({ success: false, error: 'Cannot delete active super admin account' }, 400, {}, request);
    }

    if (env.DB) {
      await env.DB.prepare('DELETE FROM users WHERE uid = ?').bind(targetUid).run();
      await env.DB.prepare('DELETE FROM children WHERE parent_uid = ?').bind(targetUid).run();
      await env.DB.prepare(
        'INSERT INTO audit_log (actor_uid, action, target_uid, ip_address) VALUES (?, ?, ?, ?)'
      ).bind(authUser.uid, 'DELETE_USER', targetUid, clientIp).run().catch(() => {});
    }
    return jsonResponse({ success: true, message: 'User deleted successfully' }, 200, {}, request);
  }

  // 15. Admin Audit Logs
  if (path === '/admin/audit' && method === 'GET') {
    if (!authUser || authUser.role !== 'super_admin') {
      return jsonResponse({ success: false, error: 'Forbidden: Super Admin only' }, 403, {}, request);
    }
    if (env.DB) {
      try {
        const { results } = await env.DB.prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200').all();
        return jsonResponse({ success: true, logs: results || [] }, 200, {}, request);
      } catch (e) {
        return jsonResponse({ success: false, error: e.message }, 500, {}, request);
      }
    }
    return jsonResponse({ success: true, logs: [] }, 200, {}, request);
  }

  // Fallback for unmatched API routes
  return jsonResponse({ success: false, error: `Cloudflare Edge API route not found: ${method} ${path}` }, 404, {}, request);
}
