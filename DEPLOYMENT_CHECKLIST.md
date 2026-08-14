# Deployment Checklist

**Project:** Islamic Studies LMS  
**Date:** August 14, 2026  
**Version:** 1.0

---

## Pre-Deployment Verification

### ✅ Database
- [x] Demo data removed from db.json
- [x] Database reset to clean state
- [x] Database backup created (db.json.backup.pre-deployment)
- [x] Database schema validated

### ✅ Configuration
- [x] .env.production template created
- [x] Environment variables documented
- [x] SESSION_SECRET configuration required
- [x] Security cookies enabled for production

### ✅ Code Cleanup
- [x] No test users in system
- [x] No demo content in database
- [x] No console.log statements for debugging (server.js reviewed)
- [x] Security headers properly configured (Helmet)
- [x] Rate limiting active (200 req/15min general, 30 req/15min auth)

### ✅ Assets & Static Files
- [x] course_data.json compiled and validated (9 modules, all content present)
- [x] CSS optimized (35KB gzipped)
- [x] JavaScript bundled (65KB gzipped)
- [x] Images using dicebear for avatars (no external dependencies)

### ✅ Security Review
- [x] Helmet CSP configured
- [x] X-Frame-Options set to DENY
- [x] X-Content-Type-Options set to nosniff
- [x] Bcrypt password hashing enabled (10 rounds)
- [x] Session cookies: httpOnly + secure flag (production)
- [x] DOMPurify XSS protection active
- [x] Input validation in place

---

## Deployment Preparation Steps

### Step 1: Environment Setup
```bash
# 1. Copy production environment template
cp .env.production .env

# 2. Edit .env with actual production values
# - Generate SESSION_SECRET: openssl rand -hex 32
# - Set NODE_ENV=production
# - Set correct API URLs for your domain
# - Configure HTTPS if applicable

# 3. Verify environment
cat .env
```

### Step 2: Database Initialization
```bash
# 1. Verify clean database
npm run build  # Compile course data if needed
cat data/db.json

# 2. Expected output (empty collections):
# { "users": [], "children": [], "progress": [], "quizResults": [], "reflections": [] }
```

### Step 3: Security Audit
```bash
# 1. Run security checks
npm audit

# 2. Update vulnerable packages if needed
npm audit fix

# 3. Verify no console.log in production code
grep -r "console\.log" server.js public/app.js
```

### Step 4: Build & Test
```bash
# 1. Rebuild course data
npm run build

# 2. Start server in production mode
NODE_ENV=production npm start

# 3. Test endpoints
curl http://localhost:3000
curl http://localhost:3000/api/auth/me
curl http://localhost:3000/public/course_data.json | head -20

# 4. Verify no test data
curl http://localhost:3000/api/admin/overview  # Should show 0 users
```

### Step 5: Deployment
```bash
# 1. Choose deployment platform:
#    - Heroku: git push heroku main
#    - AWS: Deploy via Elastic Beanstalk
#    - DigitalOcean: Deploy via App Platform
#    - Docker: Build image and push to registry

# 2. Ensure environment variables set on platform

# 3. Test endpoints on deployed domain

# 4. Monitor logs for errors
```

### Step 6: Post-Deployment
```bash
# 1. Verify system is live
curl https://yourdomain.com

# 2. Check admin dashboard
# - Navigate to https://yourdomain.com/admin
# - Verify "0 Users" and "0 Quizzes Submitted"

# 3. Create first test user
# - Register via web interface
# - Verify user appears in admin dashboard

# 4. Set up monitoring
# - Configure error tracking (Sentry)
# - Set up uptime monitoring (UptimeRobot, Pingdom)
# - Enable server logging

# 5. Test all critical paths
# - Student registration & login
# - Module access & read-aloud
# - Quiz submission
# - Parent portal
# - Admin dashboard
```

---

## Critical Configuration Values (Must Change)

| Variable | Current | Required Change |
|----------|---------|-----------------|
| NODE_ENV | development | production |
| SESSION_SECRET | generated | Strong random 32+ chars |
| Secure Cookies | false | true (HTTPS only) |
| API URLs | localhost:3000 | yourdomain.com |
| HTTPS | http | https (enable SSL/TLS) |

---

## Deployment Environments

### Development
- NODE_ENV=development
- SESSION_SECRET=dev-secret-not-secure
- Allow insecure cookies
- Enable detailed logging

### Staging (Pre-Production)
- NODE_ENV=production
- SESSION_SECRET=strong-secret-for-staging
- HTTPS enabled
- Monitor for issues
- Test all critical paths

### Production
- NODE_ENV=production
- SESSION_SECRET=strong-secret-for-production
- HTTPS required
- Secure cookies enabled
- Monitoring & alerting active
- Backup strategy active
- SSL certificate valid

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Server uptime
- [ ] Error logs (no critical errors)
- [ ] Database integrity (backup status)
- [ ] User registration count

### Weekly Checks
- [ ] Performance metrics (page load, API response)
- [ ] Security logs (rate limit violations)
- [ ] User feedback (new issues reported)
- [ ] Backup verification

### Monthly Checks
- [ ] Dependency updates available
- [ ] Security vulnerabilities (npm audit)
- [ ] Database optimization
- [ ] Performance analysis
- [ ] Plan feature releases

---

## Rollback Plan

### If Issues Occur
```bash
# 1. Check error logs
tail -f server.log

# 2. Verify database is accessible
cat data/db.json

# 3. Restart server
systemctl restart islamic-studies-lms

# 4. If persistent issue, rollback
git checkout <previous-working-commit>
npm install
npm start
```

### Restore from Backup
```bash
# If database corrupted:
cp data/db.json.backup.pre-deployment data/db.json
# OR restore from automated backups

# If code issue:
git revert <problematic-commit>
```

---

## Sign-Off

**Deployment Manager:** ____________________  **Date:** __________

**QA Lead:** ____________________  **Date:** __________

**Security Officer:** ____________________  **Date:** __________

---

## Post-Deployment Status

**Deployment Date:** __________________  
**Environment:** [ ] Staging [ ] Production  
**Status:** [ ] Successful [ ] Issues Identified  

**Issues Found (if any):**
- [ ] [Issue Description]

**Resolution:**
- [ ] [Action Taken]

**Sign-Off:** ____________________  **Date:** __________

---

**Questions?** See README.md or contact the development team.
