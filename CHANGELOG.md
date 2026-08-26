# 📋 Changelog

All notable changes to the **Islamic Studies Family LMS** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-08-26

### ♿ Accessibility & Standards (WCAG 2.1 AA)
- **Modal ARIA Dialog & Focus Trapping**: Added `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` across all modal dialogs with keyboard Tab focus trapping and focus restoration on dismissal.
- **High-Contrast Focus Rings**: Added `:focus-visible` high-contrast outline tokens across buttons, inputs, links, and select fields.
- **Accessible Landmarks**: Verified proper ARIA labeling, group roles, and screen-reader status indicators across navigation and dashboard cards.

### 🎮 Gamification & Learning Engagement
- **Daily Learning Streaks**: Added header streak badge (`#headerStreakPill`) with flame animations and per-learner streak persistence in `localStorage`, celebrating consecutive daily lesson completions and quiz submissions.
- **Interactive Quiz Timer**: Introduced optional timed quiz mode (3m, 5m, 10m, 15m) with visual countdown progress bar, amber/red warning animations, and automatic submission upon expiry.
- **Arabic Typography & Unicode Isolation**: Automated bidirectional Arabic text wrapping (`<span class="arabic-term" lang="ar" dir="rtl">`) with Amiri font styling.

### 🖨️ Print & PDF Export
- **Printable Lesson Handouts**: Added "Print Handout" button and clean `@media print` stylesheets formatting curriculum content for paper printing and PDF export without sidebars or headers.
- **Printable Completion Certificates**: Added "Print / Save PDF" button on certificate modal formatted for landscape certificate printing.

### 🛡️ Compliance & Backend Hardening
- **GDPR Learner Deletion Cascade**: Added cascade cleanup in `deleteChild` removing all associated quiz results, student reflections, and progress, with dedicated UI deletion action.
- **Parent Email Alerts on Quiz Completion**: Added `sendQuizCompletionEmail` in `lib/email.js` automatically notifying parents with score breakdown upon quiz completion / pass.
- **Offline-Ready Service Worker**: Upgraded `public/sw.js` with Cache-first caching for course data modules and manifest, Stale-while-revalidate for application shell, and Network-only for API requests.
- **Developer Experience**: Added `nodemon` dev dependency with updated `npm run dev` script.

## [1.1.0] - 2026-08-22

### 🎨 Added
- **Level 1 (~10y) Playful Comic Card Deck**: Transformed dense markdown text into an engaging, illustrated story card deck with topic-based emoji mascots (🌟, 🪽, 📖, 📜, 💧, 🕌, 🌙, 🪙, 🌸), tactile golden Arabic term badges, and "💡 Key Discovery" callout speech bubbles.
- **Child-Friendly Collapsible Details**: Integrated smooth "Explore More Details 👇" expandable accordions on cards to keep text bite-sized and approachable for 10-year-olds without losing any educational depth.
- **Fast Jump Card Navigation**: Added quick-access pill navigation in the quest hero header to let learners jump to any story card instantly.
- **Gamified Interactive Quiz Engine**: Overhauled Level 1 multiple choice options with large tactile buttons, vibrant letter badges (A/B/C/D), interactive word bank token chips for fill-in-the-blanks, and child-friendly reflection prompts.
- **Celebratory Confetti Showers**: Integrated `canvas-confetti` (with offline fallback engine) triggering celebratory confetti showers on passed exams and correct answers.

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
