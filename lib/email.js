/**
 * Email Notification & Password Reset Service
 * Islamic Studies Family LMS
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.recentEmails = [];
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT, 10) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
      console.log(`📧 [Email] Configured SMTP Transport via ${host}:${port}`);
    } else {
      // Local / Test In-Memory & Console Transport
      this.transporter = null;
      console.log('📧 [Email] Using Simulated/Preview Mailer (Set SMTP_HOST, SMTP_USER, SMTP_PASS for live delivery)');
    }
  }

  async sendMail({ to, subject, html, text, type = 'notification' }) {
    const fromAddress = process.env.SMTP_FROM || 'Islamic Studies LMS <no-reply@islamicstudies.local>';
    const mailRecord = {
      id: `mail_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      to,
      from: fromAddress,
      subject,
      type,
      text,
      html,
      sentAt: new Date().toISOString()
    };

    this.recentEmails.unshift(mailRecord);
    if (this.recentEmails.length > 50) this.recentEmails.pop();

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: fromAddress,
          to,
          subject,
          text,
          html
        });
        console.log(`✉️ [Email Sent] ${type} to ${to} (${subject})`);
        return { success: true, mailId: mailRecord.id, live: true };
      } catch (err) {
        console.error(`❌ [Email Error] Failed delivering to ${to}:`, err.message);
        return { success: false, error: err.message, mailId: mailRecord.id, live: false };
      }
    } else {
      console.log(`✉️ [Preview Email Sent] ${type} to ${to}: "${subject}"`);
      return { success: true, mailId: mailRecord.id, live: false };
    }
  }

  /**
   * Welcome Email on Account Registration
   */
  async sendWelcomeEmail({ email, displayName, role, origin = '' }) {
    const appUrl = origin || process.env.APP_URL || 'http://localhost:3000';
    const subject = 'Welcome to Islamic Studies Family LMS 🕌';
    const text = `Assalamu Alaikum ${displayName || 'Family Head'},\n\nWelcome to Islamic Studies Family LMS! Your account has been registered successfully.\n\nYou can now manage child profiles, assign Level 1 (~10y) or Level 2 (13y+) tracks, and monitor quiz progress.\n\nAccess your family dashboard here: ${appUrl}\n\nBarakallahu Feekum,\nIslamic Studies Team`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; }
          .header { background: linear-gradient(135deg, #064e3b, #0f172a); padding: 28px; text-align: center; }
          .header h1 { color: #fbbf24; margin: 0 0 6px 0; font-size: 24px; }
          .header p { color: #94a3b8; margin: 0; font-size: 14px; }
          .content { padding: 28px; line-height: 1.6; }
          .content h2 { color: #f8fafc; font-size: 18px; margin-top: 0; }
          .btn { display: inline-block; background: #059669; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .features-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .features-box li { margin-bottom: 8px; color: #cbd5e1; font-size: 14px; }
          .footer { background: #0f172a; padding: 16px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🕌 Islamic Studies Family LMS</h1>
            <p>Empowering Families with Authentic Islamic Education</p>
          </div>
          <div class="content">
            <h2>Assalamu Alaikum, ${displayName || 'Family Head'}!</h2>
            <p>Welcome to our comprehensive Islamic Studies learning portal. Your account (<strong>${email}</strong>) has been registered successfully with the <strong>${role === 'teacher' ? 'Educator' : 'Parent / Family Head'}</strong> role.</p>
            
            <div class="features-box">
              <strong style="color: #fbbf24;">Getting Started:</strong>
              <ul>
                <li><strong>Add Child Profiles:</strong> Create individual accounts for your learners with custom avatars.</li>
                <li><strong>Assign Tailored Tracks:</strong> Choose between Level 1 (~10y youth) and Level 2 (13y+ teens).</li>
                <li><strong>Track Milestones:</strong> Monitor quiz scores and download verified completion certificates.</li>
                <li><strong>Direct Kids Links:</strong> Share direct URLs with 4-digit PIN access for tablets and phones.</li>
              </ul>
            </div>

            <center>
              <a href="${appUrl}" class="btn">Open Family Portal</a>
            </center>

            <p style="font-size: 13px; color: #94a3b8;">If you did not register for this account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Islamic Studies Family LMS. 100% Private, Secure & Ad-Free.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({ to: email, subject, text, html, type: 'welcome_registration' });
  }

  /**
   * Password Reset Email with Token
   */
  async sendPasswordResetEmail({ email, displayName, resetToken, origin = '' }) {
    const appUrl = origin || process.env.APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/?resetToken=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;
    const subject = 'Password Reset Request - Islamic Studies LMS 🔐';
    const text = `Assalamu Alaikum ${displayName || 'Parent'},\n\nWe received a request to reset your password for your Islamic Studies LMS account.\n\nClick the link below to set a new password (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nIslamic Studies Team`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; }
          .header { background: linear-gradient(135deg, #78350f, #0f172a); padding: 28px; text-align: center; }
          .header h1 { color: #fbbf24; margin: 0 0 6px 0; font-size: 24px; }
          .header p { color: #94a3b8; margin: 0; font-size: 14px; }
          .content { padding: 28px; line-height: 1.6; }
          .content h2 { color: #f8fafc; font-size: 18px; margin-top: 0; }
          .btn { display: inline-block; background: #b45309; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .token-box { background: #0f172a; border: 1px dashed #fbbf24; border-radius: 8px; padding: 12px; margin: 16px 0; font-family: monospace; font-size: 13px; color: #fbbf24; word-break: break-all; text-align: center; }
          .footer { background: #0f172a; padding: 16px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>Islamic Studies Family LMS</p>
          </div>
          <div class="content">
            <h2>Assalamu Alaikum, ${displayName || 'User'}!</h2>
            <p>We received a request to reset the password for your account associated with <strong>${email}</strong>.</p>
            <p>Click the button below to choose a new secure password. This reset link expires in <strong>1 hour</strong>.</p>

            <center>
              <a href="${resetUrl}" class="btn">Reset My Password</a>
            </center>

            <p style="font-size: 13px; color: #94a3b8;">Or copy and paste this link into your browser:</p>
            <div class="token-box">${resetUrl}</div>

            <p style="font-size: 13px; color: #94a3b8; margin-top: 20px;">If you did not request a password reset, no action is needed. Your account remains completely secure.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Islamic Studies Family LMS. 100% Private, Secure & Ad-Free.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({ to: email, subject, text, html, type: 'password_reset' });
  }
}

module.exports = new EmailService();
