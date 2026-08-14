/**
 * Cloudflare Pages Functions - Unified Edge API Router
 * Full-Stack serverless backend for Islamic Studies LMS on Cloudflare Edge + D1
 */

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

async function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [saltHex, originalHashHex] = storedHash.split(':');
  const computed = await hashPassword(password, saltHex);
  const [, computedHashHex] = computed.split(':');
  return originalHashHex === computedHashHex;
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
    enc.encode(secret || 'default-cf-edge-secret-key-12345'),
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
      enc.encode(secret || 'default-cf-edge-secret-key-12345'),
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

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      ...headers
    }
  });
}

// --------------------------------------------------------------------------
// Cloudflare Pages Functions Request Handler
// --------------------------------------------------------------------------
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '');
  const method = request.method;
  const jwtSecret = env.SESSION_SECRET || 'cf-islamic-studies-edge-secret-key-2026';

  // Extract authenticated user from signed JWT cookie
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const token = cookies['cf_session'] || (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const authUser = await verifyJwt(token, jwtSecret);

  // Auto-seed default admin if database is connected
  if (env.DB) {
    try {
      const adminEmail = (env.ADMIN_EMAIL || 'admin@islamicstudies.org').toLowerCase().trim();
      const existing = await env.DB.prepare('SELECT uid FROM users WHERE email = ?').bind(adminEmail).first();
      if (!existing) {
        const adminPass = env.ADMIN_PASSWORD || 'Admin@Islam2026!';
        const pHash = await hashPassword(adminPass);
        await env.DB.prepare(
          'INSERT INTO users (uid, email, display_name, role, is_verified, provider, password_hash) VALUES (?, ?, ?, ?, 1, ?, ?)'
        ).bind('admin_cf_1', adminEmail, 'Portal Administrator', 'super_admin', 'local', pHash).run();
      }
    } catch (e) {
      console.warn('D1 auto-seed check warning:', e.message);
    }
  }

  // 1. Health & Me
  if (path === '/auth/me' && method === 'GET') {
    if (!authUser) {
      return jsonResponse({ success: false, user: null });
    }
    return jsonResponse({ success: true, user: authUser });
  }

  // 2. Auth: Register
  if (path === '/auth/register' && method === 'POST') {
    try {
      const body = await request.json();
      const { email, password, displayName } = body;
      if (!email || !password || password.length < 6) {
        return jsonResponse({ success: false, error: 'Valid email and password (min 6 chars) are required.' }, 400);
      }
      const cleanEmail = email.trim().toLowerCase();

      if (env.DB) {
        const existing = await env.DB.prepare('SELECT uid FROM users WHERE email = ?').bind(cleanEmail).first();
        if (existing) {
          return jsonResponse({ success: false, error: 'An account with this email already exists.' }, 400);
        }
        const pHash = await hashPassword(password);
        const uid = 'user_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
        const name = (displayName || cleanEmail.split('@')[0]).trim();

        await env.DB.prepare(
          'INSERT INTO users (uid, email, display_name, role, is_verified, provider, password_hash) VALUES (?, ?, ?, ?, 1, ?, ?)'
        ).bind(uid, cleanEmail, name, 'parent', 'local', pHash).run();

        const user = { uid, email: cleanEmail, displayName: name, role: 'parent', isVerified: true, provider: 'local' };
        const sessionToken = await signJwt(user, jwtSecret);
        return jsonResponse({ success: true, user }, 200, {
          'Set-Cookie': `cf_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
        });
      }

      // Memory fallback for preview
      const user = { uid: 'u_' + Date.now(), email: cleanEmail, displayName: displayName || cleanEmail.split('@')[0], role: 'parent' };
      const sessionToken = await signJwt(user, jwtSecret);
      return jsonResponse({ success: true, user }, 200, {
        'Set-Cookie': `cf_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
      });
    } catch (err) {
      return jsonResponse({ success: false, error: 'Registration failed: ' + err.message }, 500);
    }
  }

  // 3. Auth: Login
  if (path === '/auth/login' && method === 'POST') {
    try {
      const body = await request.json();
      const { email, password } = body;
      if (!email || !password) {
        return jsonResponse({ success: false, error: 'Email and password are required.' }, 400);
      }
      const cleanEmail = email.trim().toLowerCase();

      // 1. Check Cloudflare D1 Database if bound
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
                'Set-Cookie': `cf_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
              });
            }
          }
        } catch (dbErr) {
          console.warn('D1 lookup warning:', dbErr.message);
        }
      }

      // 2. Default Built-in Admin Credential Verification
      const defaultAdminEmail = (env.ADMIN_EMAIL || 'admin@islamicstudies.org').toLowerCase().trim();
      const defaultAdminPass = env.ADMIN_PASSWORD || 'Admin@Islam2026!';
      if (cleanEmail === defaultAdminEmail && password === defaultAdminPass) {
        const user = {
          uid: 'admin_cf_1',
          email: defaultAdminEmail,
          displayName: 'Portal Administrator',
          role: 'super_admin',
          isVerified: true,
          provider: 'local'
        };
        const sessionToken = await signJwt(user, jwtSecret);
        return jsonResponse({ success: true, user }, 200, {
          'Set-Cookie': `cf_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
        });
      }

      return jsonResponse({ success: false, error: 'Invalid email or password.' }, 401);
    } catch (err) {
      return jsonResponse({ success: false, error: 'Login error: ' + err.message }, 500);
    }
  }

  // 4. Auth: Logout
  if (path === '/auth/logout' && method === 'POST') {
    return jsonResponse({ success: true }, 200, {
      'Set-Cookie': `cf_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
    });
  }

  // 5. Parent Children CRUD
  if (path === '/parent/children' && method === 'GET') {
    const parentUid = authUser ? authUser.uid : url.searchParams.get('parentUid');
    if (!parentUid) return jsonResponse({ success: true, children: [] });
    if (!env.DB) return jsonResponse({ success: true, children: [] });

    try {
      const { results } = await env.DB.prepare(
        'SELECT id, name, avatar, assigned_track as assignedTrack, CASE WHEN pin_hash IS NOT NULL AND pin_hash != "" THEN 1 ELSE 0 END as hasPin FROM children WHERE parent_uid = ?'
      ).bind(parentUid).all();

      return jsonResponse({ success: true, children: results || [] });
    } catch (err) {
      return jsonResponse({ success: true, children: [] });
    }
  }

  if (path === '/parent/children' && method === 'POST') {
    if (!authUser) return jsonResponse({ success: false, error: 'Authentication required' }, 401);
    const body = await request.json();
    const { name, avatar, assignedTrack, pin } = body;
    if (!name) return jsonResponse({ success: false, error: 'Name is required' }, 400);

    const childId = 'child_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10);
    const pinHash = pin ? await hashPassword(pin) : null;

    if (env.DB) {
      await env.DB.prepare(
        'INSERT INTO children (id, parent_uid, name, avatar, assigned_track, pin_hash) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(childId, authUser.uid, name.trim(), avatar || '🌟', assignedTrack || 'level1', pinHash).run();
    }

    return jsonResponse({
      success: true,
      child: { id: childId, name: name.trim(), avatar: avatar || '🌟', assignedTrack: assignedTrack || 'level1', hasPin: Boolean(pin) }
    });
  }

  // 6. Child PIN Verification
  if (path.match(/^\/parent\/children\/[^/]+\/verify-pin$/) && method === 'POST') {
    const childId = path.split('/')[3];
    const body = await request.json();
    const { pin } = body;

    if (!env.DB) return jsonResponse({ success: true, verified: true });
    const row = await env.DB.prepare('SELECT pin_hash FROM children WHERE id = ?').bind(childId).first();
    if (!row || !row.pin_hash) return jsonResponse({ success: true, verified: true });

    const isMatch = await verifyPassword(pin, row.pin_hash);
    if (!isMatch) return jsonResponse({ success: false, error: 'Incorrect PIN' }, 401);
    return jsonResponse({ success: true, verified: true });
  }

  // 7. Telemetry & Errors
  if (path === '/telemetry/errors' && method === 'POST') {
    try {
      const body = await request.json();
      if (env.DB) {
        await env.DB.prepare(
          'INSERT INTO telemetry_logs (message, source, stack, url) VALUES (?, ?, ?, ?)'
        ).bind(body.message || '', body.source || '', body.stack || '', body.url || '').run();
      }
      return jsonResponse({ success: true, logged: true });
    } catch (e) {
      return jsonResponse({ success: true, logged: false });
    }
  }

  // 8. Admin Overview
  if (path === '/admin/overview' && method === 'GET') {
    if (!authUser || authUser.role !== 'super_admin') {
      return jsonResponse({ success: false, error: 'Forbidden: Super Admin only' }, 403);
    }
    let totalUsers = 1, totalChildren = 0, totalQuizzes = 0;
    if (env.DB) {
      const uCount = await env.DB.prepare('SELECT COUNT(*) as c FROM users').first();
      const cCount = await env.DB.prepare('SELECT COUNT(*) as c FROM children').first();
      const qCount = await env.DB.prepare('SELECT COUNT(*) as c FROM quiz_results').first();
      totalUsers = uCount ? uCount.c : 0;
      totalChildren = cCount ? cCount.c : 0;
      totalQuizzes = qCount ? qCount.c : 0;
    }
    return jsonResponse({
      success: true,
      stats: { totalUsers, totalChildren, totalQuizzes, systemStatus: 'Optimal (Cloudflare Edge)' }
    });
  }

  // Fallback for unmatched API routes
  return jsonResponse({ success: false, error: `Cloudflare Edge API route not found: ${method} ${path}` }, 404);
}
