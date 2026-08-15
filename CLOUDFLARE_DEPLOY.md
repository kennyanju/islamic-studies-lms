# Cloudflare Workers & Pages Deployment Guide with Cloudflare D1 SQL

This guide provides instructions to deploy the Islamic Studies Family LMS to **Cloudflare Pages / Workers** with **Cloudflare D1 SQL database**.

---

## Architecture

```
                       ┌────────────────────────────────────────────────────────┐
                       │               Cloudflare Global Edge Network           │
                       │                                                        │
  User Requests  ───►  │  1. Static Assets: HTML, CSS, JS, course_data.json     │
                       │  2. Serverless Edge API: functions/api/[[route]].js    │
                       │  3. Database: Cloudflare D1 Serverless SQL Database    │
                       └────────────────────────────────────────────────────────┘
```

---

## Quick CLI Deployment (Wrangler)

### Step 1: Log in to Cloudflare CLI
```bash
npx wrangler login
```
*(Or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in your environment)*

### Step 2: Create D1 Database (if not already created)
```bash
npx wrangler d1 create islamic-studies-db
```
Copy the generated `database_id` and ensure it is in [`wrangler.toml`](./wrangler.toml).

### Step 3: Apply D1 SQL Migrations
```bash
npx wrangler d1 migrations apply islamic-studies-db --remote
```

### Step 4: Build Curriculum & Deploy
```bash
npm run deploy
```
*(Runs `node compile.js && wrangler pages deploy public --project-name=islamic-studies-lms`)*

---

## Web Dashboard Deployment (Git Integration)

1. **Connect to GitHub**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select `kennyanju/islamic-studies-lms`.
2. **Build Settings**:
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `public`
3. **Bind D1 Database**:
   - Go to **Project Settings** > **Functions** > **D1 Database Bindings**:
     - Variable name: `DB`
     - Database: `islamic-studies-db`
4. **Environment Variables (Optional)**:
   - `SESSION_SECRET`: Random 32+ character string
   - `ADMIN_EMAIL`: `admin@islamicstudies.org`
   - `ADMIN_PASSWORD`: `Admin@Islam2026!`

---

## Local Development & Emulation

To emulate Cloudflare Pages Functions and local D1 database locally:
```bash
npm run d1:migrate:local
npx wrangler pages dev public
```
