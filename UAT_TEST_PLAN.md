# Islamic Studies LMS - User Acceptance Testing (UAT) Plan
**Date:** August 14, 2026  
**Version:** 1.0  
**Environment:** Local (http://localhost:3000)

---

## 1. EXECUTIVE SUMMARY

This UAT plan defines test scenarios for validating the Islamic Studies LMS against user requirements and business objectives. The system serves multiple user roles:
- **Students (Children):** Age 10-18, multi-level learning tracks
- **Parents:** Monitor children's progress, manage profiles
- **Teachers/Admins:** Manage content, view analytics, generate reports

**UAT Scope:** Core functionality, user workflows, data integrity, accessibility, performance  
**Success Criteria:** All Tier 1 scenarios pass; no critical bugs; system ready for pilot launch

---

## 2. USER PERSONAS & KEY WORKFLOWS

### Persona 1: **Fatimah (Student, Age 12)**
- **Goals:** Complete Islamic studies modules, take quizzes, understand Arabic text, generate certificates
- **Key Workflows:**
  - Login → Select learning track (Level 1/Level 2)
  - Browse modules by category (Aqidah, Fiqh, Seerah, Akhlaq)
  - Read handout content → Use read-aloud feature → Take quiz
  - View quiz score and certificate
  - Track progress across modules

### Persona 2: **Mr. Ahmad (Parent)**
- **Goals:** Monitor children's progress, manage multiple child profiles, ensure PIN security
- **Key Workflows:**
  - Login with email/password
  - View dashboard with children's cards (progress %, completed modules)
  - Add/edit child profile (name, avatar, learning track, PIN)
  - View family activity log
  - Monitor quiz scores and time-on-task
  - Switch between children without re-login

### Persona 3: **Mrs. Aisha (Teacher)**
- **Goals:** Deliver content with visual aids, see student responses, manage class progress
- **Key Workflows:**
  - Login as teacher
  - Access "Teacher Mode" → Teleprompter with speaker script
  - View slide deck alongside script
  - See class-level quiz submissions
  - Export progress reports (CSV)

### Persona 4: **Dr. Yusuf (Admin)**
- **Goals:** System administration, user management, course content updates, analytics
- **Key Workflows:**
  - Login as super_admin
  - View admin dashboard with stats (total users, quizzes taken, modules completed)
  - Manage user roles and permissions
  - View/search all users and children
  - Delete inappropriate accounts
  - Monitor system health (uptime, error logs)

---

## 3. CORE FEATURES TO TEST

### Feature 1: Authentication & Access Control
- [ ] **User Registration** (email, password, display name validation)
- [ ] **User Login** (credential verification, session creation)
- [ ] **Logout** (session termination, redirect to login)
- [ ] **Federated Auth** (Google, Apple, Microsoft OAuth mocked)
- [ ] **Role-Based Access** (students ≠ parents ≠ admins)
- [ ] **Session Persistence** (reload page → still logged in)

### Feature 2: Student Learning Path
- [ ] **Module Navigation** (browse by category, search modules)
- [ ] **Content Viewing** (handout markdown rendering, Arabic text legible)
- [ ] **Read-Aloud Engine** (TTS of sentences, highlighting, playback controls)
- [ ] **Teleprompter Mode** (dual split-screen, auto-scroll, font size control)
- [ ] **Quiz Submission** (MCQ, fill-blank, reflection questions, score calculation)
- [ ] **Certificate Generation** (PDF download, module name + date + score)
- [ ] **Progress Tracking** (modules marked as complete, % visible on dashboard)

### Feature 3: Parent Portal
- [ ] **Child Profile Management** (create, edit, delete child, PIN setup)
- [ ] **Multi-Child Switcher** (quick switch without re-login)
- [ ] **PIN Challenge** (verify parent identity, PIN-based child unlock)
- [ ] **Progress Dashboard** (view each child's completion %, quiz scores, time spent)
- [ ] **Activity Log** (timeline of completed modules, quiz submissions)

### Feature 4: Teacher/Admin Dashboard
- [ ] **Admin Overview** (total users, active sessions, quiz submissions)
- [ ] **User Management** (list all users, view roles, edit roles, delete users)
- [ ] **Role Assignment** (promote to teacher/admin, demote to parent)
- [ ] **Quiz Analytics** (aggregate scores, most attempted modules, average performance)
- [ ] **Content Compilation** (run build process, update course_data.json)

### Feature 5: Data Persistence & Sync
- [ ] **Progress Save** (quiz results persisted to db.json)
- [ ] **Multi-Device Sync** (login on different device → see same progress)
- [ ] **Offline Caching** (localStorage stores local progress, syncs on reconnect)

### Feature 6: Accessibility & Responsiveness
- [ ] **Keyboard Navigation** (tab through form fields, navigate modals)
- [ ] **Screen Reader Support** (ARIA labels, semantic HTML)
- [ ] **Mobile Responsiveness** (sidebar collapse, touch-friendly buttons)
- [ ] **Color Contrast** (WCAG AA compliance on text)
- [ ] **Focus Management** (visible focus indicators, no focus loss)

---

## 4. TEST SCENARIOS (TIER 1 CRITICAL PATHS)

### Scenario T1.1: End-to-End Student Learning
**Actor:** Fatimah (Student)  
**Prerequisites:** Server running, no prior login  
**Steps:**
1. Navigate to http://localhost:3000
2. Click "Sign Up" or "Login" button
3. Enter email (test@student.com), password (Test123), displayName (Fatimah)
4. Click "Register"
5. **Expected:** Redirected to dashboard, child profile created
6. Select "Foundations of Belief" module (Module 1)
7. Click "Handout" tab → Verify markdown renders with Arabic text
8. Click "Read Aloud" tab → Play audio
9. **Expected:** Sentences highlighted, playback controls work
10. Click "Quiz" tab → Select multiple-choice answer
11. Submit quiz
12. **Expected:** Score displayed, quiz marked complete
13. Refresh page
14. **Expected:** Progress persists, module shows as completed

**Pass Criteria:** All steps completed successfully, no errors logged

---

### Scenario T1.2: Parent Multi-Child Management
**Actor:** Mr. Ahmad (Parent)  
**Prerequisites:** Fresh browser, no session  
**Steps:**
1. Register new parent account (ahmed@parent.com, password, "Ahmed")
2. Click "Add Child" → Create child profile (name: Fatimah, avatar, track: Level 1, PIN: 1234)
3. Create second child (name: Ibrahim, avatar, track: Level 2, PIN: 5678)
4. Navigate to Parent Dashboard
5. **Expected:** Both children visible as cards with progress %, avatars, names
6. Click "Switch to Fatimah" (learner pill at top)
7. **Expected:** Dashboard filters to show only Fatimah's modules
8. Click "Switch to Ibrahim"
9. **Expected:** Dashboard updates, Ibrahim's progress shown
10. Navigate to Child Settings → Edit Fatimah's PIN to 9999
11. **Expected:** PIN updated, no error message
12. Logout → Login again
13. **Expected:** Session restores, dashboard shows previous state (both children visible)

**Pass Criteria:** Multi-child switching seamless, PIN persisted, no data loss

---

### Scenario T1.3: Admin Role Management
**Actor:** Dr. Yusuf (Admin)  
**Prerequisites:** Admin account created, logged in  
**Steps:**
1. Login with admin credentials
2. Navigate to Admin Dashboard
3. **Expected:** Overview stats visible (total users, active sessions, quizzes completed)
4. Click "Users" tab
5. **Expected:** List of all registered users shown
6. Search for "Ahmed" (parent from T1.2)
7. **Expected:** Ahmed's account appears with role "parent"
8. Click "Edit" on Ahmed's row → Change role to "super_admin"
9. **Expected:** Role saved, Ahmed now sees admin features on next login
10. Undo change → Change back to "parent"
11. Click "Delete" on a test account
12. **Expected:** Cascading delete: user, all children, progress records removed
13. Verify deletion: search for deleted user → no results

**Pass Criteria:** Role management working, cascade delete functional, data integrity maintained

---

### Scenario T1.4: Quiz Integrity & Grading
**Actor:** Fatimah (Student)  
**Prerequisites:** Logged in, module opened  
**Steps:**
1. Open "Purification & Prayer" module (Module 2)
2. Click "Quiz" tab
3. **Expected:** Quiz questions render (MCQ, fill-blank, reflection)
4. Answer all questions:
   - Select one MCQ option
   - Type fill-blank answer
   - Type reflection response
5. Click "Submit Quiz"
6. **Expected:** Score calculated, quiz marked complete, feedback shown
7. Try to submit again (click "Retake Quiz")
8. **Expected:** New attempt allowed, previous score archived
9. Logout → Login → Navigate to same module
10. **Expected:** Quiz score visible in module card, old attempt(s) preserved

**Pass Criteria:** Quiz grading accurate, multiple attempts allowed, data persisted

---

### Scenario T1.5: Teleprompter for Teacher
**Actor:** Mrs. Aisha (Teacher)  
**Prerequisites:** Teacher account, logged in  
**Steps:**
1. Navigate to any module (e.g., "Seerah: Early Life of Prophet")
2. Click "Teleprompter" tab
3. **Expected:** Split-screen layout: left = slides, right = speaker script
4. Scroll right pane → Slides advance automatically
5. Toggle "Auto-Scroll" → Scroll speed increases
6. Adjust "Font Size" slider → Script text resizes
7. Refresh page
8. **Expected:** Font size persists, position reset to top
9. Click "Show Check-for-Understanding" button
10. **Expected:** Hidden questions reveal

**Pass Criteria:** Teleprompter responsive, font controls work, sync between panes

---

### Scenario T1.6: Search & Content Discovery
**Actor:** Fatimah or Any User  
**Prerequisites:** Logged in, dashboard visible  
**Steps:**
1. Type "Fiqh" in module search box
2. **Expected:** Results appear (Purification & Prayer, Fiqh of Fasting, etc.)
3. Wait 2 seconds, continue typing: "Fasting"
4. **Expected:** Results filter to "Fiqh of Fasting Zakah & Community"
5. Click on module
6. **Expected:** Module opens without errors
7. Search for non-existent term: "XYZ123"
8. **Expected:** No results message shown, no console errors

**Pass Criteria:** Search responsive, debounce working (no lag), filtering accurate

---

### Scenario T1.7: Accessibility Compliance
**Actor:** Accessibility Auditor  
**Prerequisites:** Screen reader enabled (NVDA, JAWS, VoiceOver)  
**Steps:**
1. Tab through page → Focus ring visible on all buttons, form fields
2. Open login form → Tab order: Email → Password → Submit → Link
3. **Expected:** Logical tab order, no focus traps
4. Open modal (e.g., "Add Child") → Tab only within modal
5. **Expected:** Focus trapped in modal
6. Press Escape → Modal closes
7. **Expected:** Focus returns to previous element
8. Screen reader: Navigate to module card
9. **Expected:** Screen reader announces: "Foundations of Belief, Module 1, Aqidah, 45% complete"
10. Inspect modal with Chrome DevTools → Accessibility tree
11. **Expected:** Modal has role="dialog", aria-modal="true", aria-labelledby

**Pass Criteria:** Keyboard navigation fluent, screen reader compatible, WCAG AA compliance

---

### Scenario T1.8: Error Handling & Recovery
**Actor:** Any User  
**Prerequisites:** Server running  
**Steps:**
1. Stop server (Ctrl+C in terminal)
2. Try to login → **Expected:** Error message shown (not blank page)
3. Restart server
4. Try again → **Expected:** Login succeeds
5. While browsing modules, kill server → **Expected:** Graceful error, not frozen UI
6. Restart server
7. Refresh page → **Expected:** Session restored if valid, redirect to login if expired

**Pass Criteria:** Error messages clear and helpful, UI never frozen, graceful degradation

---

### Scenario T1.9: Multi-Device Sync
**Actor:** Mr. Ahmad (Parent)  
**Prerequisites:** Parent account, one child profile  
**Steps:**
1. Open browser on Desktop: Login, view dashboard
2. Child Fatimah shows 20% progress
3. Open browser on Mobile (same account)
4. **Expected:** Child Fatimah shows 20% progress (synced)
5. On mobile: Have Fatimah complete a module quiz (score 95%)
6. Switch back to desktop browser, refresh
7. **Expected:** New quiz result visible, progress updated to ~25%
8. Continue on desktop: Complete another module
9. Switch to mobile, refresh
10. **Expected:** New completion visible on mobile

**Pass Criteria:** Real-time sync across devices, no data loss, consistent state

---

### Scenario T1.10: Certificate Generation
**Actor:** Fatimah (Student)  
**Prerequisites:** Module quiz completed with score  
**Steps:**
1. After quiz submission, click "Generate Certificate" button
2. **Expected:** Modal appears with certificate preview
3. Verify certificate shows:
   - Student name: "Fatimah"
   - Module title: Correct module name
   - Date: Today's date
   - Score: Actual quiz score
4. Click "Download PDF"
5. **Expected:** PDF file downloads (fatimah_module1_certificate.pdf)
6. Open PDF → Verify readable, formatting correct

**Pass Criteria:** Certificate generated with correct data, PDF valid and readable

---

## 5. TEST EXECUTION CHECKLIST

### Pre-Test Setup
- [ ] Server running on http://localhost:3000
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] Test data reset (delete db.json or use backup)
- [ ] Network stable (no VPN/proxy interference)
- [ ] Console open (F12) to catch errors

### Test Execution
- [ ] Execute scenarios T1.1 through T1.10 in order
- [ ] Document any failures with screenshots
- [ ] Note performance (page load time, response time)
- [ ] Check browser console for errors/warnings
- [ ] Verify localhost:3000/api/progress/sync returns correct data

### Post-Test Review
- [ ] All Pass Criteria met for each scenario
- [ ] No critical bugs found
- [ ] Performance acceptable (<2s page load)
- [ ] No data corruption in db.json
- [ ] Accessibility audit passed

---

## 6. KNOWN ISSUES TO TEST AGAINST

### Issue A: Modal ARIA Missing
**Impact:** Screen readers don't identify modals as dialogs  
**Test:** T1.7 (Accessibility) should fail until fixed  
**Workaround:** None; requires code fix

### Issue B: Search Debounce Missing
**Impact:** Search runs on every keystroke, CPU spike  
**Test:** T1.6 (Search) may show lag on large datasets  
**Workaround:** Type slowly; delays are normal for now

### Issue C: Database Scaling Limit
**Impact:** Performance degrades with >1000 users  
**Test:** Not applicable for UAT (local testing); skip  
**Workaround:** Migration to PostgreSQL needed for production

### Issue D: Error Toasts Missing
**Impact:** API errors not visible to user  
**Test:** T1.8 (Error Handling) will show blank page on server error  
**Workaround:** Check console (F12) to see error

### Issue E: Session Secret Not Persisted
**Impact:** Users logged out on server restart  
**Test:** Start/stop server between scenarios  
**Expected:** Session should expire gracefully; user redirected to login

---

## 7. TEST RESULTS TEMPLATE

**Test Scenario:** T1.X - [Scenario Name]  
**Tester:** [Name]  
**Date:** [Date]  
**Result:** ☐ PASS ☐ FAIL ☐ BLOCKED

**Observations:**
- [Note any unexpected behavior]
- [Performance metrics: page load time, response time]
- [Screenshot location if issue found]

**Bugs Found:**
- [ ] Bug #1: [Description] | Severity: [Critical/High/Medium/Low]
- [ ] Bug #2: ...

**Sign-Off:** _______________

---

## 8. SUCCESS CRITERIA FOR UAT SIGN-OFF

✓ **All 10 scenarios executed**  
✓ **95%+ Pass rate** (≤1 scenario can have workaround)  
✓ **No critical bugs** (blockers fixed or deferred with documented workaround)  
✓ **Accessibility audit passed** (WCAG AA compliance)  
✓ **Performance acceptable** (<2s page load on 4G)  
✓ **Data integrity verified** (no corruption, multi-device sync works)  
✓ **Error handling tested** (graceful degradation, clear messages)  

---

## 9. UAT SIGN-OFF

**Tester:** _______________  
**Date:** _______________  
**Overall Result:** ☐ PASS (Ready for Production) ☐ CONDITIONAL (Minor Issues) ☐ FAIL (Critical Issues)  
**Comments:** 

---

**End of UAT Test Plan**
