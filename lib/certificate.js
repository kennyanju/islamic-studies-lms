/**
 * Islamic Studies Family LMS - Printable HTML Certificate Generator
 * Generates an authentic, high-resolution, print-ready certificate of completion
 * with Islamic geometric borders, calligraphy headers, and verification metadata.
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildCertificateHtml({
  studentName = 'Learner',
  moduleTitle = 'Islamic Studies',
  moduleId = 1,
  track = 'level1',
  score = 100,
  issueDate = null,
  certId = null,
  verifyUrl = null
}) {
  const safeName = escapeHtml(studentName);
  const safeModuleTitle = escapeHtml(moduleTitle);
  const safeTrack = track === 'level2' ? 'Level 2 (Teen Scholar)' : 'Level 1 (Foundations)';
  const formattedDate =
    issueDate ||
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  const safeCertId = escapeHtml(
    certId ||
      `CERT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`
  );
  const safeVerifyUrl = escapeHtml(verifyUrl || `https://islamicstudies.org/verify/${safeCertId}`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of Achievement - ${safeName} - Module ${moduleId}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-green: #064e3b;
      --deep-green: #022c22;
      --gold: #d97706;
      --gold-light: #fbbf24;
      --gold-dark: #b45309;
      --parchment: #fffdf7;
      --dark-text: #1e293b;
      --muted-text: #475569;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0b1120;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      color: var(--dark-text);
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Screen Action Bar */
    .action-bar {
      width: 100%;
      max-width: 1000px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 12px 20px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }

    .action-bar-title {
      color: #f8fafc;
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-group {
      display: flex;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #059669, #047857);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #10b981, #059669);
      transform: translateY(-1px);
    }

    .btn-outline {
      background: transparent;
      color: #cbd5e1;
      border: 1px solid #475569;
    }

    .btn-outline:hover {
      background: #334155;
      color: #ffffff;
    }

    /* Certificate Outer Frame */
    .cert-container {
      width: 100%;
      max-width: 1000px;
      aspect-ratio: 1.414 / 1;
      min-height: 700px;
      background: var(--parchment);
      border: 12px solid #064e3b;
      border-radius: 8px;
      position: relative;
      padding: 16px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      overflow: hidden;
    }

    /* Inner Gold Border */
    .cert-inner-frame {
      width: 100%;
      height: 100%;
      border: 2px solid #d97706;
      padding: 24px 36px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      position: relative;
      background: radial-gradient(circle at center, rgba(254, 243, 199, 0.25) 0%, rgba(255, 253, 247, 0) 70%);
      box-sizing: border-box;
    }

    /* Corner Arabesque Ornaments */
    .corner {
      position: absolute;
      width: 44px;
      height: 44px;
      border: 3px solid #b45309;
    }
    .corner-tl { top: 6px; left: 6px; border-right: none; border-bottom: none; }
    .corner-tr { top: 6px; right: 6px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 6px; left: 6px; border-right: none; border-top: none; }
    .corner-br { bottom: 6px; right: 6px; border-left: none; border-top: none; }

    /* Bismillah Header */
    .bismillah {
      font-family: 'Amiri', serif;
      font-size: 26px;
      color: var(--primary-green);
      letter-spacing: 1px;
      margin-top: 4px;
      margin-bottom: 6px;
    }

    .academy-name {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: var(--gold-dark);
      margin-bottom: 4px;
    }

    .cert-heading {
      font-family: 'Cinzel', serif;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 2px;
      color: var(--primary-green);
      text-transform: uppercase;
      text-shadow: 0 1px 2px rgba(0,0,0,0.05);
      margin-bottom: 12px;
    }

    .divider-gold {
      width: 140px;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      margin-bottom: 16px;
    }

    .cert-lead {
      font-size: 14px;
      font-style: italic;
      color: var(--muted-text);
      margin-bottom: 8px;
    }

    .student-name-box {
      width: 100%;
      text-align: center;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px dashed rgba(217, 119, 6, 0.4);
    }

    .student-name {
      font-family: 'Amiri', serif;
      font-size: 42px;
      font-weight: 700;
      color: #047857;
      line-height: 1.2;
    }

    .cert-body {
      font-size: 14px;
      line-height: 1.6;
      text-align: center;
      max-width: 680px;
      color: #334155;
      margin-bottom: 14px;
    }

    .module-badge {
      display: inline-block;
      font-weight: 700;
      color: var(--primary-green);
      font-size: 16px;
    }

    .track-tag {
      display: inline-block;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      border-radius: 999px;
      padding: 2px 12px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 6px;
    }

    /* Score and Seal Section */
    .cert-stats-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 36px;
      margin-bottom: 18px;
      width: 100%;
    }

    .score-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff;
      border: 1px solid #fde68a;
      border-radius: 10px;
      padding: 8px 18px;
      box-shadow: 0 4px 10px rgba(245, 158, 11, 0.1);
    }

    .score-val {
      font-size: 24px;
      font-weight: 800;
      color: #b45309;
    }

    .score-lbl {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      font-weight: 600;
    }

    /* Khatam Islamic Geometric Seal */
    .cert-seal {
      width: 72px;
      height: 72px;
    }

    /* Signatures and Footer */
    .cert-footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 10px;
      border-top: 1px solid rgba(203, 213, 225, 0.6);
    }

    .sig-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 160px;
    }

    .sig-line {
      width: 100%;
      border-top: 1px solid #94a3b8;
      margin-top: 36px;
      margin-bottom: 6px;
    }

    .sig-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--muted-text);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .sig-digital {
      font-family: 'Amiri', cursive;
      font-size: 20px;
      color: #065f46;
      font-weight: 700;
      margin-bottom: -24px;
    }

    .meta-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      gap: 3px;
    }

    .meta-code {
      font-family: monospace;
      font-size: 12px;
      font-weight: 700;
      color: var(--gold-dark);
      background: #fef3c7;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 1px;
    }

    /* Print Stylesheet */
    @media print {
      @page {
        size: landscape;
        margin: 0;
      }

      body {
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        min-height: 100vh !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .no-print {
        display: none !important;
      }

      .cert-container {
        max-width: 100vw !important;
        width: 100vw !important;
        height: 100vh !important;
        aspect-ratio: auto !important;
        border: 14px solid #064e3b !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Toolbar (Hidden when Printing) -->
  <div class="action-bar no-print">
    <div class="action-bar-title">
      <span>🕌</span>
      <span>Official Islamic Studies Certificate</span>
    </div>
    <div class="btn-group">
      <button class="btn btn-primary" onclick="window.print()" id="printBtn">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
          <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zm7 4V3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v2h8zm-8 7V9h8v3H4z"/>
        </svg>
        Print or Save PDF
      </button>
      <a href="/" class="btn btn-outline">Back to Portal</a>
    </div>
  </div>

  <!-- Printable Certificate Container -->
  <div class="cert-container" id="printableCertificate">
    <div class="cert-inner-frame">
      <!-- Decorative Corners -->
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>

      <!-- Header Section -->
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <div class="academy-name">Islamic Studies Family LMS Academy</div>
        <h1 class="cert-heading">Certificate of Achievement</h1>
        <div class="divider-gold"></div>
        <p class="cert-lead">This is proudly awarded to</p>
      </div>

      <!-- Student Name -->
      <div class="student-name-box">
        <div class="student-name">${safeName}</div>
      </div>

      <!-- Achievement Description -->
      <p class="cert-body">
        In recognition of successfully studying the authentic traditional curriculum and demonstrating thorough mastery in
        <br>
        <span class="module-badge">Module ${moduleId}: ${safeModuleTitle}</span>
        <span class="track-tag">${safeTrack}</span>
      </p>

      <!-- Stats / Seal Row -->
      <div class="cert-stats-row">
        <div class="score-badge">
          <span class="score-val">${score}%</span>
          <span class="score-lbl">Mastery Score</span>
        </div>

        <!-- 8-Point Islamic Star (Khatam) Gold Seal -->
        <svg class="cert-seal" viewBox="0 0 100 100">
          <polygon points="50,0 63,26 92,20 78,45 100,65 71,73 65,100 45,82 20,95 26,67 0,55 24,38 12,12 39,22" fill="#d97706" />
          <circle cx="50" cy="50" r="32" fill="#064e3b" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3,2" />
          <text x="50" y="47" font-family="'Cinzel', serif" font-size="8" font-weight="bold" fill="#fef08a" text-anchor="middle">VERIFIED</text>
          <text x="50" y="58" font-family="'Cinzel', serif" font-size="7" font-weight="bold" fill="#fef08a" text-anchor="middle">EXCELLENCE</text>
        </svg>

        <div class="score-badge">
          <span class="score-val">Passed</span>
          <span class="score-lbl">Academic Status</span>
        </div>
      </div>

      <!-- Footer / Signatures -->
      <div class="cert-footer">
        <!-- Instructor Signature -->
        <div class="sig-col">
          <div class="sig-digital">Ustadh Al-Murrabi</div>
          <div class="sig-line"></div>
          <div class="sig-title">Curriculum Director</div>
        </div>

        <!-- Verification Metadata -->
        <div class="meta-col">
          <span>Date Issued: <strong>${formattedDate}</strong></span>
          <span>Verification Code: <span class="meta-code">${safeCertId}</span></span>
          <span style="font-size: 10px; color: #94a3b8;"><a href="${safeVerifyUrl}" target="_blank" style="color:#059669; text-decoration:none;">Verify Certificate</a> &bull; 100% Authentic Islamic Curriculum</span>
        </div>

        <!-- Family Head Signature -->
        <div class="sig-col">
          <div class="sig-digital">Family Head</div>
          <div class="sig-line"></div>
          <div class="sig-title">Family Head / Guardian</div>
        </div>
      </div>
    </div>
  </div>

</body>
</html>`;
}

module.exports = {
  buildCertificateHtml
};
