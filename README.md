# 🕌 Islamic Studies Family LMS

> **An interactive, pedagogical learning management system designed for families, students, and educators.**  
> Features authentic **Maliki Fiqh**, **Ash'ari Creed**, authentic **Seerah**, multi-child learning profiles, parent progress dashboards, educator teleprompter & slide decks, and offline-installable PWA capabilities.

[![CI & Code Quality](https://github.com/kennyanju/islamic-studies-lms/actions/workflows/ci.yml/badge.svg)](https://github.com/kennyanju/islamic-studies-lms/actions/workflows/ci.yml)
[![OpenAPI 3.0](https://img.shields.io/badge/OpenAPI-3.0-10b981.svg)](/api/docs)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

---

## 🌟 Key Features

- **📖 9 Curated Curriculum Modules**: Covering Foundations of Belief (Aqidah), Purification & Prayer (Fiqh), Early & Madinan Seerah, Fasting & Zakah, Applied Everyday Fiqh, Islamic Character & Family, and Living Faith Today.
- **👶 Multi-Child Learning Profiles**: Parents can add children, assign age-appropriate learning tracks (*Level 1: 10y* vs *Level 2: 13y+*), configure 4-digit security PINs, and track completion progress and reflections.
- **🔗 Direct Learner Access**: Children can access their individual profiles directly via simple URLs (e.g. `/public/child/:id` or `/public/child/:name`) with PIN verification without needing parent session access.
- **🎙️ Educator & Teacher Suite**: Includes synchronised Presentation Teleprompter, Master Answer Keys, and Full Voice Scripts for homeschool instructors and teachers.
- **📱 Zero-Cache PWA**: Installable to Android, iOS, and Desktop Home Screens with automatic client claiming and guaranteed fresh network asset delivery.
- **🛡️ Enterprise Security**: Hardened Content Security Policy (CSP), strict cookie management, rate-limited auth & PIN verification endpoints, and cryptographic session protection.
- **📊 Observability & Telemetry**: Integrated real-time CSP violation ingestion, client-side error telemetry, and deep health check reporting (`/api/health`).
- **📖 Interactive OpenAPI / Swagger Explorer**: Comprehensive REST API documentation available directly at `/api/docs`.

---

## 🏗️ Architecture & Deployment Runtimes

The application is architected for dual-runtime deployment:

1. **Edge-Native (Cloudflare Pages & Workers + D1 SQL Database)**:
   - Zero-cold-start edge execution across 300+ global data centers.
   - High-performance Cloudflare D1 distributed SQLite database.
2. **Node.js / Express Container**:
   - Production-ready Express server with PostgreSQL, SQLite, or file-backed storage adapters (`server.js`).
   - Supports Docker, Render, Heroku, or standard VPS deployments.

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js `20.x` or `22.x`
- npm `10.x` or higher

### 1. Installation
```bash
git clone https://github.com/kennyanju/islamic-studies-lms.git
cd islamic-studies-lms
npm install
```

### 2. Build Curriculum Data Chunks
```bash
npm run build
```

### 3. Start Local Development Server
```bash
npm run dev
# The LMS will be available at http://localhost:3000
# API Explorer available at http://localhost:3000/api/docs
```

---

## 🧪 Testing & Code Quality

| Command | Purpose |
|---------|---------|
| `npm test` | Runs full unit & integration test suites (Supertest & Jest). |
| `npm run test:coverage` | Runs all tests and outputs statement & branch coverage metrics. |
| `npm run smoke` | Compiles course data and verifies all static routes and health endpoints. |
| `npm run lint` | Runs ESLint analysis across server, workers, and client scripts. |
| `npm run lint:fix` | Automatically fixes lint errors and applies Prettier code formatting. |
| `npm run format:check` | Verifies code conforms to Prettier formatting guidelines. |

---

## ⚙️ Environment Variables Reference

Create a `.env` or `.env.production` file to customize your configuration:

| Variable | Default / Description | Required |
|----------|-----------------------|----------|
| `NODE_ENV` | `development` or `production` | No |
| `PORT` | `3000` | No |
| `SESSION_SECRET` | Auto-generated cryptographic random key | Recommended in production |
| `ADMIN_EMAIL` | `admin@islamicstudies.org` | No |
| `ADMIN_PASSWORD` | Super Admin initial password | Recommended in production |
| `DATABASE_URL` | PostgreSQL connection string (if using Postgres adapter) | Optional |
| `SMTP_HOST` | SMTP server host for live emails | Optional |
| `SMTP_PORT` | SMTP port (`587` / `465`) | Optional |
| `SMTP_USER` | SMTP username | Optional |
| `SMTP_PASS` | SMTP password | Optional |
| `RESEND_API_KEY` | Resend REST API key (alternative to SMTP) | Optional |

---

## ☁️ Cloudflare Workers & D1 Deployment

To deploy to Cloudflare:

```bash
# 1. Apply D1 Database Migrations
npm run d1:migrate:remote

# 2. Deploy Cloudflare Pages / Workers
npm run deploy:prod
```

For step-by-step instructions, see [`CLOUDFLARE_DEPLOY.md`](CLOUDFLARE_DEPLOY.md).

---

## 📄 API Documentation

Explore the interactive Swagger UI at `/api/docs` or fetch the raw OpenAPI specification at `/openapi.json`.

---

## 📜 License

This project is licensed under the ISC License.
