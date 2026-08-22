/**
 * Islamic Studies LMS - Auth & Validation Module
 * Live pre-submit input validation, password reveal toggle, password strength meter
 */

import { showToast } from './utils.js';

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function evaluatePasswordStrength(pass) {
  if (!pass) return { score: 0, label: 'Weak', class: 'weak', hint: 'Enter at least 6 characters' };
  let score = 0;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[a-z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1)
    return { score: 1, label: 'Weak', class: 'weak', hint: 'Use 8+ chars with letters & numbers' };
  if (score === 2)
    return { score: 2, label: 'Fair', class: 'fair', hint: 'Good start. Add uppercase or symbols' };
  if (score === 3 || score === 4)
    return { score: 3, label: 'Good', class: 'good', hint: 'Strong password. Excellent!' };
  return { score: 5, label: 'Excellent', class: 'strong', hint: 'Very strong secure password! 🛡️' };
}

export function initPasswordUX() {
  document.querySelectorAll('.btn-password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btn.innerHTML = `<i class="fa-solid fa-eye${isPassword ? '-slash' : ''}" aria-hidden="true"></i>`;
    });
  });

  function setupStrengthListener(inputId, containerId, fillId, labelId, criteriaId) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    const fill = document.getElementById(fillId);
    const label = document.getElementById(labelId);
    const criteria = document.getElementById(criteriaId);

    if (!input || !container || !fill || !label || !criteria) return;

    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (!val) {
        container.style.display = 'none';
        return;
      }
      container.style.display = 'block';
      const res = evaluatePasswordStrength(val);
      fill.className = `strength-bar-fill ${res.class}`;
      label.innerHTML = `Password Strength: <strong>${res.label}</strong>`;
      criteria.textContent = res.hint;
    });
  }

  setupStrengthListener(
    'homeSignUpPasswordInput',
    'homePasswordStrengthContainer',
    'homeStrengthFill',
    'homeStrengthLabel',
    'homeStrengthCriteria'
  );
  setupStrengthListener(
    'signUpPasswordInput',
    'modalPasswordStrengthContainer',
    'modalStrengthFill',
    'modalStrengthLabel',
    'modalStrengthCriteria'
  );
}

/**
 * Real-time pre-submit validation for form inputs
 */
export function setupInputLiveValidation(inputEl, errorEl, validatorFn, errorMsg) {
  if (!inputEl) return;
  const validate = () => {
    const isValid = validatorFn(inputEl.value);
    if (!isValid && inputEl.value.length > 0) {
      inputEl.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add('visible');
      }
    } else {
      inputEl.classList.remove('is-invalid');
      if (errorEl) {
        errorEl.classList.remove('visible');
      }
    }
    return isValid;
  };

  inputEl.addEventListener('input', validate);
  inputEl.addEventListener('blur', validate);
  return validate;
}
