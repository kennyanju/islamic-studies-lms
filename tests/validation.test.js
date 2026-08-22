const validator = require('../lib/validator');

describe('Input Validation & Sanitization Unit Tests', () => {
  describe('Email validation', () => {
    test('Valid emails return true', () => {
      expect(validator.isValidEmail('parent@example.com')).toBe(true);
      expect(validator.isValidEmail('user.name+tag@sub.domain.org')).toBe(true);
    });

    test('Invalid emails return false', () => {
      expect(validator.isValidEmail('')).toBe(false);
      expect(validator.isValidEmail(null)).toBe(false);
      expect(validator.isValidEmail('not-an-email')).toBe(false);
      expect(validator.isValidEmail('@missinguser.com')).toBe(false);
      expect(validator.isValidEmail('user@missingtld')).toBe(false);
    });
  });

  describe('Password validation', () => {
    test('Valid passwords (6-128 chars) return true', () => {
      expect(validator.isValidPassword('secret123')).toBe(true);
      expect(validator.isValidPassword('123456')).toBe(true);
    });

    test('Invalid passwords return false', () => {
      expect(validator.isValidPassword('')).toBe(false);
      expect(validator.isValidPassword('12345')).toBe(false); // < 6
      expect(validator.isValidPassword(null)).toBe(false);
    });
  });

  describe('PIN validation', () => {
    test('4-digit numeric string returns true', () => {
      expect(validator.isValidPin('1234')).toBe(true);
      expect(validator.isValidPin('0000')).toBe(true);
      expect(validator.isValidPin('9999')).toBe(true);
    });

    test('Non-4-digit strings return false', () => {
      expect(validator.isValidPin('123')).toBe(false);
      expect(validator.isValidPin('12345')).toBe(false);
      expect(validator.isValidPin('abcd')).toBe(false);
      expect(validator.isValidPin('')).toBe(false);
      expect(validator.isValidPin(null)).toBe(false);
    });
  });

  describe('Child Input Validation', () => {
    test('Valid child input returns isValid: true', () => {
      const result = validator.validateChildInput({
        name: 'Zaynab',
        avatar: '🌸',
        assignedTrack: 'level1',
        pinCode: '1234'
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('Missing name returns error', () => {
      const result = validator.validateChildInput({
        name: '',
        assignedTrack: 'level1'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Child name is required.');
    });

    test('Invalid track returns error', () => {
      const result = validator.validateChildInput({
        name: 'Tariq',
        assignedTrack: 'invalid_track'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid track'))).toBe(true);
    });
  });

  describe('Registration Input Validation', () => {
    test('Valid registration payload passes', () => {
      const result = validator.validateRegistration({
        email: 'newparent@test.com',
        password: 'securePassword123',
        displayName: 'Ahmad'
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('Malformed payload returns specific errors', () => {
      const result = validator.validateRegistration({
        email: 'invalid-email',
        password: '123'
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
