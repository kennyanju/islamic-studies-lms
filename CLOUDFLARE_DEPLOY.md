# Cloudflare Workers & Pages Deployment Guide with Cloudflare D1 SQL

This guide provides complete instructions to deploy the Islamic Studies Family LMS to **Cloudflare Workers** with **Cloudflare D1 SQL database**, multi-environment configuration, and email deliverability.

---

## Architecture

```
                       ┌────────────────────────────────────────────────────────┐
                       │               Cloudflare Global Edge Network           │
                       │                                                        │
  User Requests  ───►  │  1. Static Assets: HTML, CSS, JS, course_data/ chunks  │
                       │  2. Serverless Edge API: worker.js + Functions Router  │
                       │  3. Database: Cloudflare D1 Serverless SQL Database    │
                       └────────────────────────────────────────────────────────┘
```

---

## 1. Quick CLI Deployment (Wrangler)

### Step 1: Log in to Cloudflare CLI
```bash
npx wrangler login
```
*(Or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in your environment / CI secrets)*

### Step 2: Provision Production D1 Database
```bash
npx wrangler d1 create islamic-studies-db
```
Verify the generated `database_id` is set in [`wrangler.toml`](./wrangler.toml).

### Step 3: Apply Remote SQL Migrations
```bash
npm run d1:migrate:remote
```

### Step 4: Configure Production Secrets (Crucial for Go-Live)
Set your production environment secrets securely via Wrangler:
```bash
# 1. JWT Session Secret (Random 32+ characters)
npx wrangler secret put SESSION_SECRET

# 2. Resend API Key for Transactional Emails
npx wrangler secret put RESEND_API_KEY

# 3. Cloudflare Turnstile Secret Key (for bot defense)
npx wrangler secret put TURNSTILE_SECRET_KEY

# 4. Super Admin Initial Password
npx wrangler secret put ADMIN_PASSWORD
```

### Step 5: Build Curriculum & Deploy
```bash
# Deploy to Production:
npm run deploy:prod

# Deploy to Staging:
npm run deploy:staging
```

---

## 2. Custom Domain & DNS Email Deliverability

To guarantee high deliverability for Welcome and Password Reset emails sent via Resend:

### A. Custom Domain in Cloudflare
1. Go to **Workers & Pages** > **maliki-kids** > **Settings** > **Domains & Routes**.
2. Add your custom domain (e.g. `learn.malikikids.com`).
3. Set SSL/TLS encryption mode to **Full (strict)**.
4. Enable **DNSSEC** under your zone DNS settings.

### B. SPF, DKIM & DMARC DNS Records (Resend Domain Verification)
Add the following DNS records in Cloudflare DNS for your custom domain:

| Type | Name | Content | Proxy status |
|---|---|---|---|
| **TXT** | `@` or `send` | `v=spf1 include:resend.com ~all` | DNS only |
| **CNAME** | `resend._domainkey` | `dkim.resend.com` | DNS only |
| **TXT** | `_dmarc` | `v=DMARC1; p=none; sp=none; pct=100;` | DNS only |

---

## 3. Automated CI/CD (GitHub Actions)

Continuous Integration and Continuous Deployment is automated via `.github/workflows/deploy.yml`:
1. Add the following repository secrets under **GitHub** > **Settings** > **Secrets and variables** > **Actions**:
   - `CLOUDFLARE_API_TOKEN` (Create via Cloudflare Dashboard > My Profile > API Tokens > Edit Cloudflare Workers template)
   - `CLOUDFLARE_ACCOUNT_ID` (Find on Cloudflare Dashboard sidebar)
2. Pushing to the `main` branch runs unit and smoke tests, compiles curriculum chunks, and deploys directly to production.

---

## 4. Local Development & Emulation

To emulate Cloudflare Worker and local D1 database:
```bash
npm run d1:migrate:local
npx wrangler dev
```

To backup the live database:
```bash
npm run d1:backup:remote
```
