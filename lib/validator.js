/**
 * Islamic Studies Family LMS - Input Validation & Sanitization Helper
 */

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 5) return false;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6 && password.length <= 128;
}

function isValidPin(pin) {
  if (!pin || typeof pin !== 'string') return false;
  return /^\d{4}$/.test(pin.trim());
}

function validateRegistration(body) {
  const errors = [];
  const { email, password, displayName } = body || {};

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email address is required.');
  }

  if (!password || !isValidPassword(password)) {
    errors.push('Password must be between 6 and 128 characters.');
  }

  if (displayName && typeof displayName === 'string' && displayName.length > 100) {
    errors.push('Display name cannot exceed 100 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateChildInput(body) {
  const errors = [];
  const { name, avatar, assignedTrack, pinCode } = body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Child name is required.');
  } else if (name.trim().length > 60) {
    errors.push('Child name cannot exceed 60 characters.');
  }

  const validTracks = ['level1', 'level2', 'teacher'];
  if (assignedTrack && !validTracks.includes(assignedTrack)) {
    errors.push(`Invalid track: must be one of ${validTracks.join(', ')}.`);
  }

  if (pinCode) {
    if (!isValidPin(String(pinCode))) {
      errors.push('PIN must be exactly 4 numerical digits.');
    }
  }

  if (avatar && typeof avatar === 'string' && avatar.length > 255) {
    errors.push('Avatar identifier cannot exceed 255 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateQuizSubmission(body) {
  const errors = [];
  const { moduleId, answers } = body || {};

  if (moduleId === undefined || moduleId === null || isNaN(parseInt(moduleId, 10))) {
    errors.push('Valid moduleId is required.');
  }

  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    errors.push('Answers payload must be an object dictionary.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidPin,
  validateRegistration,
  validateChildInput,
  validateQuizSubmission
};
