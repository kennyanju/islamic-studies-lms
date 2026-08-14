/**
 * Islamic Studies LMS - Frontend Utilities Module
 * Modal accessibility, toast notifications with retry, markdown rendering, HTML escaping
 */

export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

export function renderMarkdown(md) {
  if (!md) return '';
  if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
    const rawHtml = marked.parse(md);
    return DOMPurify.sanitize(rawHtml);
  }
  return escapeHtml(md).replace(/\n/g, '<br>');
}

// --------------------------------------------------------------------------
// Accessible Modal & Focus Trap Manager
// --------------------------------------------------------------------------
let currentlyOpenModal = null;

export function openAccessibleModal(modalEl, initialFocusSelector = null) {
  if (!modalEl) return;
  if (currentlyOpenModal && currentlyOpenModal !== modalEl) {
    closeAccessibleModal(currentlyOpenModal, false);
  }

  modalEl._previouslyFocusedElement = document.activeElement;
  modalEl.classList.add('is-open');
  modalEl.setAttribute('aria-hidden', 'false');
  currentlyOpenModal = modalEl;

  setTimeout(() => {
    let focusTarget = null;
    if (initialFocusSelector) {
      focusTarget = modalEl.querySelector(initialFocusSelector);
    }
    if (!focusTarget) {
      focusTarget = modalEl.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
    }
    if (focusTarget) {
      focusTarget.focus();
    } else {
      modalEl.focus();
    }
  }, 60);

  if (!modalEl._trapKeyHandler) {
    modalEl._trapKeyHandler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeAccessibleModal(modalEl);
        return;
      }

      if (e.key === 'Tab') {
        const focusable = Array.from(modalEl.querySelectorAll(
          'button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !modalEl.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !modalEl.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    modalEl.addEventListener('keydown', modalEl._trapKeyHandler);
  }
}

export function closeAccessibleModal(modalEl, restoreFocus = true) {
  if (!modalEl) return;
  modalEl.classList.remove('is-open');
  modalEl.setAttribute('aria-hidden', 'true');
  
  if (modalEl._trapKeyHandler) {
    modalEl.removeEventListener('keydown', modalEl._trapKeyHandler);
    modalEl._trapKeyHandler = null;
  }

  if (currentlyOpenModal === modalEl) {
    currentlyOpenModal = null;
  }

  if (restoreFocus && modalEl._previouslyFocusedElement && typeof modalEl._previouslyFocusedElement.focus === 'function') {
    try {
      modalEl._previouslyFocusedElement.focus();
    } catch (err) {}
  }
}

// --------------------------------------------------------------------------
// Toast Notification System with Optional Interactive Action/Retry Button
// --------------------------------------------------------------------------
const toastContainer = document.getElementById('toastContainer');

export function showToast(title, message, type = 'success', duration = 4500, actionCallback = null, actionLabel = 'Retry') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');

  let iconClass = 'fa-circle-check';
  if (type === 'celebration') iconClass = 'fa-award';
  else if (type === 'info') iconClass = 'fa-circle-info';
  else if (type === 'error') iconClass = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <div class="toast-icon" aria-hidden="true">
      <i class="fa-solid ${iconClass}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
      ${actionCallback ? `<button class="toast-action-btn"><i class="fa-solid fa-rotate-right"></i> ${escapeHtml(actionLabel)}</button>` : ''}
    </div>
    <button class="toast-close-btn" aria-label="Dismiss notification">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>
  `;

  const closeBtn = toast.querySelector('.toast-close-btn');
  const dismiss = () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode === toastContainer) {
        toastContainer.removeChild(toast);
      }
    }, 250);
  };

  closeBtn.addEventListener('click', dismiss);

  if (actionCallback) {
    const actionBtn = toast.querySelector('.toast-action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        dismiss();
        actionCallback();
      });
    }
  }

  toastContainer.appendChild(toast);

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
}
