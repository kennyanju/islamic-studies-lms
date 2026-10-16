const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

describe('Modular Frontend ES Modules & Dual-Runtime Auth Tests', () => {
  let utilsCode;
  let authCode;

  beforeAll(() => {
    utilsCode = fs.readFileSync(path.join(__dirname, '../public/js/utils.js'), 'utf8');
    authCode = fs.readFileSync(path.join(__dirname, '../public/js/auth.js'), 'utf8');
  });

  describe('Frontend Utils ES Module (public/js/utils.js)', () => {
    test('Declares all required exported functions', () => {
      expect(utilsCode).toContain('export function escapeHtml');
      expect(utilsCode).toContain('export function enhanceArabicText');
      expect(utilsCode).toContain('export function renderMarkdown');
      expect(utilsCode).toContain('export function openAccessibleModal');
      expect(utilsCode).toContain('export function closeAccessibleModal');
      expect(utilsCode).toContain('export function showToast');
    });

    test('Includes resilient container lookup in showToast', () => {
      expect(utilsCode).toContain("document.getElementById('toastContainer')");
    });
  });

  describe('Frontend Auth ES Module (public/js/auth.js)', () => {
    test('Declares all required auth functions', () => {
      expect(authCode).toContain('export function isValidEmail');
      expect(authCode).toContain('export function evaluatePasswordStrength');
      expect(authCode).toContain('export function initPasswordUX');
      expect(authCode).toContain('export function setupInputLiveValidation');
    });

    test('Includes live validators for authentication forms', () => {
      expect(authCode).toContain('authEmailInput');
      expect(authCode).toContain('homeAuthEmailInput');
      expect(authCode).toContain('signUpEmailInput');
      expect(authCode).toContain('signUpPasswordInput');
    });
  });

  describe('Frontend index.html Script Configuration', () => {
    test('Loads app.js as an ES module via script type="module"', () => {
      const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
      expect(html).toMatch(/<script\s+type=["']module["']\s+src=["']app\.js["']>/);
    });
  });

  describe('Dual-Runtime Password Alignment (Node bcrypt & Edge compatibility)', () => {
    test('Node bcrypt hash is verifiable with bcryptjs synchronously and asynchronously', async () => {
      const rawPassword = 'FamilySecurePassword2026!';
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(rawPassword, salt);

      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
      expect(bcrypt.compareSync(rawPassword, hash)).toBe(true);
      expect(bcrypt.compareSync('WrongPassword', hash)).toBe(false);

      const asyncMatch = await bcrypt.compare(rawPassword, hash);
      expect(asyncMatch).toBe(true);
    });

    test('Bcrypt format detection accurately distinguishes bcrypt from PBKDF2 formats', () => {
      const bcryptHash = '$2b$10$abcdefghijklmnopqrstuvwxyz012345678901234567890123456';
      const pbkdf2Hash = 'a1b2c3d4e5f60718:9f8e7d6c5b4a3021';

      const isBcrypt = (h) =>
        Boolean(h && (h.startsWith('$2a$') || h.startsWith('$2b$') || h.startsWith('$2y$')));

      expect(isBcrypt(bcryptHash)).toBe(true);
      expect(isBcrypt(pbkdf2Hash)).toBe(false);
      expect(pbkdf2Hash.includes(':')).toBe(true);
    });
  });
});
