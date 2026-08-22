# 📋 Changelog

All notable changes to the **Islamic Studies Family LMS** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-08-22

### 🐛 Fixed
- **Null Safety on Module Tracks Access**: Fixed `TypeError: Cannot read properties of undefined (reading 'level1')` on direct `?kid=` URLs and search by guarding `mod.tracks` and `courseData` across `renderHandout`, `renderAnswerKeys`, `renderQuiz`, `submitQuizBtn`, `renderSlides`, `renderVoiceScript`, `performSearch`, and `openModule`.
- **Modern CSP Reporting Standards**: Added `Report-To` and `Reporting-Endpoints` headers and `report-to csp-endpoint` directive in `public/_headers` and `server.js` for CSP Level 3 compliance alongside `report-uri`.

## [1.0.0] - 2026-08-22

### 🚀 Added
- **Interactive OpenAPI 3.0 Documentation**: Added `/api/docs` and `/docs` interactive Swagger UI explorer backed by `public/openapi.json`.
- **Public Learner Direct Access & Verification**: Added frictionless child direct profile lookups (supporting both ID and case-insensitive names) with server-side PIN verification.
- **Observability & Health Telemetry**: Enriched `/api/health` and `/healthz` endpoints with memory usage, uptime, database connectivity metrics, and CSP/client-error violation tracking.
- **Zero-Cache PWA**: Added `public/sw.js` and `public/manifest.json` enabling Home Screen installation across Android, iOS, and Desktop with instant client claiming.
- **Input Validation Helper**: Added `lib/validator.js` providing reusable validation for emails, passwords, PIN codes, and quiz submissions.
- **Prettier & Code Formatting**: Integrated Prettier with npm scripts (`npm run format`, `npm run format:check`) and `jsconfig.json`.
- **CI/CD Multi-Node Matrix**: Configured GitHub Actions CI testing matrix across Node 20.x and 22.x.
- **Automated Test Suites**: Added `tests/a11y.test.js`, `tests/validation.test.js`, `tests/docs.test.js`, and Jest coverage reporting.

### 🛡️ Security Hardening
- **Strict Cookies**: Enforced `SameSite=Strict; Secure; HttpOnly; Path=/` on `cf_session` in Cloudflare Workers and Express sessions.
- **Rate Limiting**: Added strict brute-force rate limiter (`pinLimiter`) on PIN verification routes.
- **HTTP Security Headers**: Enforced `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- **JWT Cryptographic Fallback**: Hardened `getJwtSecret` with secure random key generation and production warnings.

### ⚡ Performance & Quality
- **Content Visibility**: Added `content-visibility: auto` to curriculum cards in `public/style.css` for instant DOM layout rendering.
- **ESLint & Code Standards**: Configured flat ESLint configuration (`eslint.config.mjs`) passing with 0 errors across 40+ files.
- **Database Parity**: Synchronized PostgreSQL `data/schema.sql` with Cloudflare D1 migrations.
- **Multi-Provider Email**: Added Resend REST API support in `lib/email.js` alongside SMTP transport and preview mailer.
