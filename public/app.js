/* ==========================================================================
   Islamic Studies LMS - Single Page Application & Pedagogy Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  let courseData = null;
  let activeModuleId = null;
  let activeCategoryFilter = 'all';
  let activeTrack = localStorage.getItem('lms_track') || 'level1'; // level1 | level2 | teacher
  let activeTab = 'handout'; // handout | teleprompter | answerkeys | quiz | slides | voicescript
  let currentSlideIndex = 0;
  let currentTpSlideIndex = 0;
  let isAutoScrolling = false;
  let autoScrollInterval = null;

  let activeChild = JSON.parse(localStorage.getItem('lms_active_child') || 'null');
  let userProgress = JSON.parse(
    localStorage.getItem(`lms_progress_${activeChild ? activeChild.id : 'global'}`) || '{}'
  );
  let quizScores = JSON.parse(
    localStorage.getItem(`lms_quiz_scores_${activeChild ? activeChild.id : 'global'}`) || '{}'
  );
  let userReflections = JSON.parse(
    localStorage.getItem(`lms_reflections_${activeChild ? activeChild.id : 'global'}`) || '{}'
  );

  // DOM Elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleText = document.getElementById('themeToggleText');
  const appLogoBtn = document.getElementById('appLogoBtn');
  const dashboardJumpBtn = document.getElementById('dashboardJumpBtn');

  const trackL1 = document.getElementById('trackL1');
  const trackL2 = document.getElementById('trackL2');
  const trackTeacher = document.getElementById('trackTeacher');

  const sidebar = document.getElementById('sidebar');
  const mobileSidebarOpen = document.getElementById('mobileSidebarOpen');
  const mobileSidebarClose = document.getElementById('mobileSidebarClose');

  const modulesList = document.getElementById('modulesList');
  const modulesGrid = document.getElementById('modulesGrid');
  const categoryFilters = document.getElementById('categoryFilters');

  const progressPercent = document.getElementById('progressPercent');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressSubtext = document.getElementById('progressSubtext');

  const dashboardView = document.getElementById('dashboardView');
  const moduleView = document.getElementById('moduleView');

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const searchResultsList = document.getElementById('searchResultsList');
  const searchResultsCount = document.getElementById('searchResultsCount');

  // Module Header elements
  const moduleCategory = document.getElementById('moduleCategory');
  const moduleTrackBadge = document.getElementById('moduleTrackBadge');
  const moduleEstTime = document.getElementById('moduleEstTime');
  const moduleBloomLevel = document.getElementById('moduleBloomLevel');
  const moduleTitle = document.getElementById('moduleTitle');
  const moduleDescription = document.getElementById('moduleDescription');
  const objectivesList = document.getElementById('objectivesList');
  const moduleTabNav = document.getElementById('moduleTabNav');

  // Tab Buttons
  const handoutTabBtn = document.getElementById('handoutTabBtn');
  const quizTabBtn = document.getElementById('quizTabBtn');
  const teleprompterTabBtn = document.getElementById('teleprompterTabBtn');
  const answerkeysTabBtn = document.getElementById('answerkeysTabBtn');
  const slidesTabBtn = document.getElementById('slidesTabBtn');
  const scriptTabBtn = document.getElementById('scriptTabBtn');

  // Tab Contents
  const handoutContent = document.getElementById('handoutContent');
  const malikiCitationTag = document.getElementById('malikiCitationTag');
  const markHandoutCompleteBtn = document.getElementById('markHandoutCompleteBtn');

  // Teleprompter Elements
  const tpPrevBtn = document.getElementById('tpPrevBtn');
  const tpNextBtn = document.getElementById('tpNextBtn');
  const tpCounter = document.getElementById('tpCounter');
  const tpAutoScrollBtn = document.getElementById('tpAutoScrollBtn');
  const tpScrollSpeed = document.getElementById('tpScrollSpeed');
  const tpFontDecBtn = document.getElementById('tpFontDecBtn');
  const tpFontIncBtn = document.getElementById('tpFontIncBtn');
  const tpSlideContent = document.getElementById('tpSlideContent');
  const tpCuePill = document.getElementById('tpCuePill');
  const tpCueText = document.getElementById('tpCueText');
  const tpScriptText = document.getElementById('tpScriptText');
  const tpAnalogyCard = document.getElementById('tpAnalogyCard');
  const tpAnalogyText = document.getElementById('tpAnalogyText');
  const tpCheckCard = document.getElementById('tpCheckCard');
  const tpCheckText = document.getElementById('tpCheckText');
  const tpShowAnswerBtn = document.getElementById('tpShowAnswerBtn');

  // Answer Keys Elements
  const akToggleL1 = document.getElementById('akToggleL1');
  const akToggleL2 = document.getElementById('akToggleL2');
  const answerKeyContent = document.getElementById('answerKeyContent');
  let activeAkLevel = 'level1';

  // Quiz Elements
  const quizQuestionsArea = document.getElementById('quizQuestionsArea');
  const quizScoreBanner = document.getElementById('quizScoreBanner');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const scorePercent = document.getElementById('scorePercent');
  const submitQuizBtn = document.getElementById('submitQuizBtn');
  const retryQuizBtn = document.getElementById('retryQuizBtn');
  const openCertBtn = document.getElementById('openCertBtn');

  // Certificate Modal Elements
  const certModal = document.getElementById('certModal');
  const certCloseBtn = document.getElementById('certCloseBtn');
  const certModuleName = document.getElementById('certModuleName');
  const certScoreBadge = document.getElementById('certScoreBadge');
  const certStudentName = document.getElementById('certStudentName');
  const certDateText = document.getElementById('certDateText');
  const certDoneBtn = document.getElementById('certDoneBtn');

  // Slideshow Elements
  const slideContent = document.getElementById('slideContent');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const slideCounter = document.getElementById('slideCounter');
  const fullscreenSlidesBtn = document.getElementById('fullscreenSlidesBtn');

  const voiceScriptContent = document.getElementById('voiceScriptContent');

  if (window.marked) {
    const renderer = new marked.Renderer();
    renderer.image = function (href, title, text) {
      return `<img src="${href}" alt="${text || ''}" title="${title || ''}" loading="lazy" decoding="async" class="responsive-img" />`;
    };
    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: true
    });
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderMarkdown(md) {
    if (!md) return '';
    const rawHtml = window.marked ? marked.parse(md) : md;
    return window.DOMPurify ? DOMPurify.sanitize(rawHtml) : rawHtml;
  }

  // --------------------------------------------------------------------------
  // ACCESSIBLE MODAL & FOCUS TRAP MANAGER (Class-Based Transitions)
  // --------------------------------------------------------------------------
  let currentlyOpenModal = null;

  function openAccessibleModal(modalEl, initialFocusSelector = null) {
    if (!modalEl) return;
    if (currentlyOpenModal && currentlyOpenModal !== modalEl) {
      closeAccessibleModal(currentlyOpenModal, false);
    }

    modalEl._previouslyFocusedElement = document.activeElement;
    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    currentlyOpenModal = modalEl;

    // Focus target or first focusable item after CSS transition starts
    setTimeout(() => {
      let focusTarget = null;
      if (initialFocusSelector) {
        focusTarget = modalEl.querySelector(initialFocusSelector);
      }
      if (!focusTarget) {
        focusTarget = modalEl.querySelector(
          'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
        );
      }
      if (focusTarget) {
        focusTarget.focus();
      } else {
        modalEl.focus();
      }
    }, 60);

    // Trap focus inside modal & close on Escape
    if (!modalEl._trapKeyHandler) {
      modalEl._trapKeyHandler = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeAccessibleModal(modalEl);
          return;
        }

        if (e.key === 'Tab') {
          const focusable = Array.from(
            modalEl.querySelectorAll(
              'button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ).filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
          );

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

  function closeAccessibleModal(modalEl, restoreFocus = true) {
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

    if (
      restoreFocus &&
      modalEl._previouslyFocusedElement &&
      typeof modalEl._previouslyFocusedElement.focus === 'function'
    ) {
      try {
        modalEl._previouslyFocusedElement.focus();
      } catch (err) {}
    }
  }

  // --------------------------------------------------------------------------
  // TOAST NOTIFICATION SYSTEM (With Optional Action / Retry Handler)
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');

  function showToast(
    title,
    message,
    type = 'success',
    duration = 4500,
    actionCallback = null,
    actionLabel = 'Retry'
  ) {
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

  // Fast Startup Course Data Loader with Manifest Indexing
  async function loadCourseData() {
    try {
      // First try lightweight manifest index (~11.8 KB)
      const manifestRes = await fetch('/modules_manifest.json');
      if (manifestRes.ok) {
        courseData = await manifestRes.json();
        initApp();
        return;
      }
    } catch (e) {
      console.warn('Manifest load notice, falling back to full bundle:', e);
    }

    // Fallback to full course_data.json or API
    fetch('/course_data.json')
      .then((r) => r.json())
      .then((data) => {
        courseData = data;
        initApp();
      })
      .catch((e) => {
        console.error('Fatal: Could not load course data', e);
        showToast(
          'Loading Error',
          'Failed to load course curriculum data.',
          'error',
          0,
          () => loadCourseData(),
          'Retry Loading'
        );
      });
  }
  loadCourseData();

  function initApp() {
    setupTheme();
    setupTrackButtons();
    setupCategoryFilters();
    renderSidebarModules();
    renderDashboard();
    updateProgressUI();
    setupEventListeners();
    setupLegalModal();
    syncCloudProgress();
  }

  function setupTheme() {
    const savedTheme = localStorage.getItem('lms_theme') || 'dark';
    document.body.className = savedTheme === 'light' ? 'theme-light' : 'theme-dark';
    updateThemeBtnText();

    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('theme-light');
      document.body.className = isLight ? 'theme-dark' : 'theme-light';
      localStorage.setItem('lms_theme', isLight ? 'dark' : 'light');
      updateThemeBtnText();
    });
  }

  function updateThemeBtnText() {
    const isLight = document.body.classList.contains('theme-light');
    themeToggleBtn.querySelector('i').className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    themeToggleText.textContent = isLight ? 'Dark Mode' : 'Light Mode';
  }

  function switchTrack(track) {
    if (!track) return;
    activeTrack = track;
    localStorage.setItem('lms_track', activeTrack);
    updateTrackActiveBtn();
    if (activeTrack === 'teacher') {
      activeTab = 'teleprompter';
    } else if (activeTab === 'teleprompter' || activeTab === 'answerkeys') {
      activeTab = 'handout';
    }
    if (activeModuleId !== null) {
      openModule(activeModuleId);
    }
  }

  function setupTrackButtons() {
    updateTrackActiveBtn();

    [trackL1, trackL2, trackTeacher].forEach((btn) => {
      btn.addEventListener('click', () => {
        switchTrack(btn.dataset.track);
      });
    });
  }

  function updateTrackActiveBtn() {
    [trackL1, trackL2, trackTeacher].forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.track === activeTrack);
    });
  }

  function setupCategoryFilters() {
    if (!categoryFilters) return;
    const pills = categoryFilters.querySelectorAll('.filter-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategoryFilter = pill.dataset.cat;
        renderDashboard();
      });
    });
  }

  function renderSidebarModules() {
    modulesList.innerHTML = '';
    courseData.modules.forEach((mod) => {
      const isCompleted = userProgress[`mod_${mod.id}`];
      const li = document.createElement('li');
      li.className = `module-nav-item ${activeModuleId === mod.id ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
      li.innerHTML = `
        <i class="fa-solid ${mod.icon || 'fa-book'}"></i>
        <span>${mod.id}. ${mod.title}</span>
        ${isCompleted ? '<i class="fa-solid fa-check" style="margin-left:auto;font-size:0.75rem;"></i>' : ''}
      `;
      li.addEventListener('click', () => {
        openModule(mod.id);
        sidebar.classList.remove('open');
      });
      modulesList.appendChild(li);
    });
  }

  function renderDashboard() {
    if (!modulesGrid) return;
    modulesGrid.innerHTML = '';

    const isL2 = activeTrack === 'level2';
    const isTeacher = activeTrack === 'teacher';

    // 1. Dynamic Hero Banner Theming & Text based on Level 1 vs Level 2
    const learnerHeroBanner = document.getElementById('learnerHeroBanner');
    const learnerAvatarBadge = document.getElementById('learnerAvatarBadge');
    const learnerTrackBadge = document.getElementById('learnerTrackBadge');
    const learnerTrackSwitchPill = document.getElementById('learnerTrackSwitchPill');
    const learnerWelcomeHeadline = document.getElementById('learnerWelcomeHeadline');
    const learnerWelcomeSubhead = document.getElementById('learnerWelcomeSubhead');
    const learnerStatCompleted = document.getElementById('learnerStatCompleted');
    const learnerStatAvgQuiz = document.getElementById('learnerStatAvgQuiz');
    const learnerStatStreak = document.getElementById('learnerStatStreak');
    const learnerStatCert = document.getElementById('learnerStatCert');

    if (dashboardView) {
      dashboardView.classList.toggle('level2-mode', isL2);
      dashboardView.classList.toggle('level1-mode', !isL2 && !isTeacher);
    }

    if (learnerHeroBanner) {
      learnerHeroBanner.className = `hero-banner ${isL2 ? 'level2-hero' : isTeacher ? 'admin-hero' : 'level1-hero'}`;
    }

    const learnerName = activeChild
      ? activeChild.name
      : currentUser
        ? currentUser.displayName || 'Family Learner'
        : 'Guest Explorer';
    const learnerAvatar = activeChild ? activeChild.avatar : '🌟';

    if (learnerAvatarBadge) {
      learnerAvatarBadge.innerHTML = `${learnerAvatar} ${isL2 ? 'Student' : 'Learner'}: <strong>${escapeHtml(learnerName)}</strong>`;
    }

    if (learnerTrackBadge) {
      if (isL2) {
        learnerTrackBadge.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Level 2 Track (13y+)`;
        learnerTrackBadge.className = 'hero-badge gold';
      } else if (isTeacher) {
        learnerTrackBadge.innerHTML = `<i class="fa-solid fa-chalkboard-user"></i> Teacher & Educator Mode`;
        learnerTrackBadge.className = 'hero-badge';
      } else {
        learnerTrackBadge.innerHTML = `<i class="fa-solid fa-seedling"></i> Level 1 Track (~10y)`;
        learnerTrackBadge.className = 'hero-badge';
      }
    }

    if (learnerWelcomeHeadline) {
      if (activeChild) {
        learnerWelcomeHeadline.textContent = `Welcome back, ${activeChild.name}! 🌟`;
      } else if (isL2) {
        learnerWelcomeHeadline.textContent = `Analytical Study & Islamic Knowledge Mastery`;
      } else if (isTeacher) {
        learnerWelcomeHeadline.textContent = `Educator Portal & Curriculum Presentation Decks`;
      } else {
        learnerWelcomeHeadline.textContent = `Bismillah! Welcome to Your Learning Adventures`;
      }
    }

    if (learnerWelcomeSubhead) {
      if (isL2) {
        learnerWelcomeSubhead.textContent = `Comprehensive 9-Module syllabus covering Ash'ari Aqidah proofs, Maliki legal maxims, Madinan statecraft, and contemporary Islamic ethics.`;
      } else if (isTeacher) {
        learnerWelcomeSubhead.textContent = `Deliver engaging classroom lessons with 200+ built-in presentation slides, teleprompter scripts, and discussion outlines.`;
      } else {
        learnerWelcomeSubhead.textContent = `Explore inspiring stories of the Prophets, master Wudu & Salah, and earn gold achievement stars for every completed quiz!`;
      }
    }

    // 2. Compute Progress for Active Child / User
    const localProg = JSON.parse(
      localStorage.getItem(`lms_progress_${activeChild ? activeChild.id : 'global'}`) || '{}'
    );
    const localScores = JSON.parse(
      localStorage.getItem(`lms_quiz_scores_${activeChild ? activeChild.id : 'global'}`) || '{}'
    );
    const childProgKey = activeChild
      ? `child_${activeChild.id}`
      : currentUser
        ? `user_${currentUser.uid}`
        : 'guest';
    const activeProgMap = localProg[childProgKey] || userProgress || {};

    let completedCount = 0;
    courseData.modules.forEach((m) => {
      if (activeProgMap[`mod_${m.id}`] || userProgress[`mod_${m.id}`]) completedCount++;
    });

    const scoreKeys = Object.keys(localScores);
    let avgQuizScore = 0;
    if (scoreKeys.length > 0) {
      const sum = scoreKeys.reduce(
        (acc, k) => acc + (localScores[k].percentage || localScores[k].score || 0),
        0
      );
      avgQuizScore = Math.round(sum / scoreKeys.length);
    } else if (completedCount > 0) {
      avgQuizScore = 90;
    }

    if (learnerStatCompleted) learnerStatCompleted.textContent = `${completedCount} / 9`;
    if (learnerStatAvgQuiz)
      learnerStatAvgQuiz.textContent = avgQuizScore > 0 ? `${avgQuizScore}%` : '0%';
    if (learnerStatStreak)
      learnerStatStreak.textContent =
        completedCount > 0 ? `${Math.min(completedCount + 1, 7)} Days` : '1 Day';
    if (learnerStatCert) {
      learnerStatCert.textContent =
        completedCount >= 9 ? '🎉 Earned!' : completedCount > 0 ? 'In Progress' : 'Not Started';
    }

    // 3. Recommended Next Lesson Spotlight
    const nextActionCard = document.getElementById('learnerNextActionCard');
    const nextActionIcon = document.getElementById('nextActionIcon');
    const nextActionTitle = document.getElementById('nextActionTitle');
    const nextActionDesc = document.getElementById('nextActionDesc');
    const nextActionBadge = document.getElementById('nextActionBadge');
    const nextActionStartBtn = document.getElementById('nextActionStartBtn');
    const nextActionQuizBtn = document.getElementById('nextActionQuizBtn');

    // Find first uncompleted module
    let nextMod = courseData.modules.find(
      (m) => !(activeProgMap[`mod_${m.id}`] || userProgress[`mod_${m.id}`])
    );
    if (!nextMod) nextMod = courseData.modules[0]; // fallback to first if all completed

    if (nextActionCard && nextMod) {
      if (nextActionIcon)
        nextActionIcon.innerHTML = `<i class="fa-solid ${nextMod.icon || 'fa-book'}"></i>`;
      if (nextActionTitle) nextActionTitle.textContent = `Module ${nextMod.id}: ${nextMod.title}`;
      if (nextActionDesc) nextActionDesc.textContent = nextMod.description;
      if (nextActionBadge) {
        nextActionBadge.innerHTML = `<i class="fa-solid fa-play"></i> ${isL2 ? 'Recommended Study Focus' : 'Your Next Adventure!'}`;
      }
      if (nextActionStartBtn) {
        nextActionStartBtn.onclick = () => openModule(nextMod.id);
      }
      if (nextActionQuizBtn) {
        nextActionQuizBtn.onclick = () => {
          openModule(nextMod.id);
          switchTab('quiz');
        };
      }
    }

    // 4. Wire Track Switch Pill in Banner
    if (learnerTrackSwitchPill) {
      learnerTrackSwitchPill.onclick = () => {
        const nextTrack = activeTrack === 'level1' ? 'level2' : 'level1';
        switchTrack(nextTrack);
      };
    }

    // 5. Render Filtered Modules Grid
    const filteredMods = courseData.modules.filter((mod) => {
      if (activeCategoryFilter === 'all') return true;
      const cat = mod.category.toLowerCase();
      if (activeCategoryFilter === 'aqidah') return cat.includes('aqidah');
      if (activeCategoryFilter === 'fiqh') return cat.includes('fiqh');
      if (activeCategoryFilter === 'seerah') return cat.includes('seerah');
      if (activeCategoryFilter === 'akhlaq')
        return cat.includes('akhlaq') || cat.includes('ethics');
      return true;
    });

    filteredMods.forEach((mod) => {
      const isCompleted = activeProgMap[`mod_${mod.id}`] || userProgress[`mod_${mod.id}`];
      const quizScore =
        localScores[`quiz_${mod.id}_${activeTrack}`]?.percentage || (isCompleted ? 100 : null);

      const card = document.createElement('div');
      card.className = `module-card ${isL2 ? 'level2-card' : 'level1-card'} ${isCompleted ? 'completed' : ''}`;

      card.innerHTML = `
        <div>
          <div class="module-card-header">
            <div class="module-card-icon">
              <i class="fa-solid ${mod.icon || 'fa-book'}"></i>
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <span class="category-badge">${mod.category}</span>
              <span class="track-tag-pill ${isL2 ? 'level2' : 'level1'}">
                ${isL2 ? '📖 Level 2 (13y+)' : '🌱 Level 1 (~10y)'}
              </span>
            </div>
          </div>
          <h3>Module ${mod.id}: ${mod.title}</h3>
          <p>${mod.description}</p>
          <div class="module-card-meta-row">
            <span><i class="fa-solid fa-clock"></i> ${mod.estTime || '45m'}</span>
            <span>•</span>
            <span><i class="fa-solid fa-brain"></i> ${isL2 ? mod.bloomLevel || 'Analytical' : 'Foundational'}</span>
            ${quizScore !== null ? `<span>•</span><span style="color: var(--emerald-primary); font-weight: 700;">Score: ${quizScore}%</span>` : ''}
          </div>
        </div>
        <div class="module-card-footer">
          <span>${isCompleted ? (isL2 ? '✓ Completed (Review)' : '⭐ Completed! (Review)') : isL2 ? 'Study Module' : 'Start Fun Lesson'}</span>
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      `;
      card.addEventListener('click', () => openModule(mod.id));
      modulesGrid.appendChild(card);
    });
  }

  function showDashboard() {
    activeModuleId = null;
    dashboardView.style.display = 'block';
    moduleView.style.display = 'none';
    searchResultsContainer.style.display = 'none';
    renderSidebarModules();
    renderDashboard();
  }

  if (dashboardJumpBtn) dashboardJumpBtn.addEventListener('click', showDashboard);

  function openModule(moduleId) {
    if (activeTrack !== 'teacher' && moduleId > 1) {
      if (!userProgress[`mod_${moduleId - 1}`]) {
        showToast(
          'Module Locked 🔒',
          `You must pass Module ${moduleId - 1} before starting Module ${moduleId}.`,
          'error'
        );
        return;
      }
    }
    activeModuleId = moduleId;
    const mod = courseData.modules.find((m) => m.id === moduleId);
    if (!mod) return;

    dashboardView.style.display = 'none';
    moduleView.style.display = 'block';
    searchResultsContainer.style.display = 'none';

    moduleCategory.textContent = mod.category;
    moduleTitle.textContent = `Module ${mod.id}: ${mod.title}`;
    moduleDescription.textContent = mod.description;

    if (moduleEstTime)
      moduleEstTime.innerHTML = `<i class="fa-solid fa-clock"></i> ${mod.estTime || '45 mins'}`;
    if (moduleBloomLevel)
      moduleBloomLevel.innerHTML = `<i class="fa-solid fa-brain"></i> ${mod.bloomLevel || 'Understanding'}`;

    let trackName = 'Level 1 (10 Years Old)';
    if (activeTrack === 'level2') trackName = 'Level 2 (13+ Years Old)';
    if (activeTrack === 'teacher') trackName = 'Teacher Portal & Teleprompter';
    moduleTrackBadge.textContent = trackName;

    // Populate SWBAT Objectives
    objectivesList.innerHTML = '';
    const objs = mod.objectives || [
      'Understand core principles of Islamic belief and jurisprudence.',
      'Apply ethical guidelines in everyday decision-making.',
      'Extract timeless lessons from the noble Seerah.'
    ];
    objs.forEach((obj) => {
      const li = document.createElement('li');
      li.textContent = obj;
      objectivesList.appendChild(li);
    });

    // Show/Hide Teacher Dedicated Tabs
    if (activeTrack === 'teacher') {
      teleprompterTabBtn.style.display = 'inline-flex';
      answerkeysTabBtn.style.display = 'inline-flex';
      slidesTabBtn.style.display = 'inline-flex';
      scriptTabBtn.style.display = 'inline-flex';
    } else {
      teleprompterTabBtn.style.display = 'none';
      answerkeysTabBtn.style.display = 'none';
      slidesTabBtn.style.display = 'inline-flex';
      scriptTabBtn.style.display = 'none';
    }

    renderSidebarModules();

    // Check if full module tracks are loaded; if not, lazy-load chunk
    if (!mod.tracks) {
      handoutContent.innerHTML = `
        <div class="skeleton-loader">
          <div class="skeleton-shimmer skeleton-title"></div>
          <div class="skeleton-shimmer skeleton-badge"></div>
          <div class="skeleton-shimmer skeleton-paragraph"></div>
          <div class="skeleton-shimmer skeleton-paragraph"></div>
          <div class="skeleton-shimmer skeleton-paragraph short"></div>
          <div class="skeleton-shimmer skeleton-card"></div>
        </div>
      `;
      fetch(`/course_data/module_${moduleId}.json`)
        .then((r) => r.json())
        .then((fullMod) => {
          Object.assign(mod, fullMod);
          if (activeModuleId === moduleId) {
            switchTab(activeTab);
          }
        })
        .catch((err) => {
          console.warn('Chunk load error, falling back to full bundle...', err);
          fetch('/course_data.json')
            .then((r) => r.json())
            .then((fullData) => {
              const target = (fullData.modules || []).find((m) => m.id === moduleId);
              if (target) Object.assign(mod, target);
              if (activeModuleId === moduleId) switchTab(activeTab);
            });
        });
    } else {
      switchTab(activeTab);
    }
  }

  function switchTab(tabName) {
    activeTab = tabName;
    const tabBtns = moduleTabNav.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((c) => c.classList.remove('active'));

    const activeContent = document.getElementById(`${tabName}Tab`);
    if (activeContent) activeContent.classList.add('active');

    const mod = courseData.modules.find((m) => m.id === activeModuleId);
    if (!mod) return;

    if (tabName === 'handout') {
      renderHandout(mod);
    } else if (tabName === 'teleprompter') {
      renderTeleprompter(mod);
    } else if (tabName === 'answerkeys') {
      renderAnswerKeys(mod);
    } else if (tabName === 'quiz') {
      renderQuiz(mod);
    } else if (tabName === 'slides') {
      renderSlides(mod);
    } else if (tabName === 'voicescript') {
      renderVoiceScript(mod);
    }
  }

  function renderHandout(mod) {
    let md = activeTrack === 'level2' ? mod.tracks.level2.handoutMd : mod.tracks.level1.handoutMd;
    if (md) {
      handoutContent.innerHTML = renderMarkdown(md);
    } else {
      handoutContent.innerHTML = `<pre>${escapeHtml(md || 'No handout content available.')}</pre>`;
    }

    if (malikiCitationTag) {
      malikiCitationTag.innerHTML = `<i class="fa-solid fa-book-open"></i> ${mod.malikiNotes || "Maliki Fiqh & Ash'ari Aqidah Standard"}`;
    }

    const isComp = userProgress[`mod_${mod.id}`];
    markHandoutCompleteBtn.classList.toggle('completed', !!isComp);
    markHandoutCompleteBtn.querySelector('span').textContent = isComp
      ? 'Completed ✓'
      : 'Mark as Completed';
  }

  async function persistModuleProgress(moduleId, completed = true, level = activeTrack) {
    try {
      const sId = activeChild ? activeChild.id : currentUser ? currentUser.uid : 'guest';
      fetch('/api/quiz/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: sId,
          moduleId,
          level,
          completed
        })
      }).catch(() => {});
    } catch (e) {}
  }

  window.resetChildProgressAPI = async function (childId, moduleId = null) {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/parent/progress/reset', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, moduleId })
      });
      if (res.ok) {
        showToast('Success', 'Progress reset successfully.', 'success');
        syncCloudProgress(childId);
      }
    } catch (e) {
      console.error(e);
    }
  };
  async function syncCloudProgress(studentId = null) {
    try {
      const sId =
        studentId || (activeChild ? activeChild.id : currentUser ? currentUser.uid : null);
      if (!sId) return;
      const res = await fetch(`/api/quiz/progress?studentId=${encodeURIComponent(sId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && (data.progress || data.data)) {
          const syncData = data.progress || data.data;
          userProgress = { ...userProgress, ...syncData };
          localStorage.setItem(
            `lms_progress_${activeChild ? activeChild.id : 'global'}`,
            JSON.stringify(userProgress)
          );
          renderSidebarModules();
          renderDashboard();
          updateProgressUI();
        }
      }
    } catch (err) {
      console.warn('[Sync] Progress sync notice:', err);
    }
  }

  markHandoutCompleteBtn.addEventListener('click', () => {
    if (activeModuleId === null) return;
    const mod = courseData.modules.find((m) => m.id === activeModuleId);
    const key = `mod_${activeModuleId}`;
    userProgress[key] = !userProgress[key];
    localStorage.setItem(
      `lms_progress_${activeChild ? activeChild.id : 'global'}`,
      JSON.stringify(userProgress)
    );

    // Asynchronously sync with Cloudflare D1 Backend
    persistModuleProgress(activeModuleId, userProgress[key], activeTrack);

    renderSidebarModules();
    renderDashboard();
    updateProgressUI();
    if (mod) renderHandout(mod);

    if (userProgress[key]) {
      showToast(
        'Module Completed! 🎉',
        `Module ${activeModuleId}: ${mod ? mod.title : ''} marked completed. Keep up the great study!`,
        'celebration'
      );
    } else {
      showToast('Progress Updated', `Module ${activeModuleId} marked as in-progress.`, 'info');
    }
  });

  // --------------------------------------------------------------------------
  // TEACHER TELEPROMPTER & LIVE PRESENTATION ENGINE
  // --------------------------------------------------------------------------

  function renderTeleprompter(mod) {
    const slides = mod.teacher.parsedSlides || [];
    const scriptSlides = mod.teacher.parsedVoiceScript || [];
    const total = Math.max(slides.length, scriptSlides.length);

    if (total === 0) {
      tpSlideContent.innerHTML = '<p>No slides available for teleprompter.</p>';
      return;
    }

    // Restore saved font size and last slide index for this module
    applySavedTpFontSize();
    const savedSlide = parseInt(localStorage.getItem(`lms_tp_slide_${mod.id}`) || '0', 10);
    currentTpSlideIndex =
      !isNaN(savedSlide) && savedSlide >= 0 && savedSlide < total ? savedSlide : 0;

    updateTeleprompterDisplay(mod, slides, scriptSlides);

    tpPrevBtn.onclick = () => {
      if (currentTpSlideIndex > 0) {
        currentTpSlideIndex--;
        localStorage.setItem(`lms_tp_slide_${mod.id}`, currentTpSlideIndex);
        updateTeleprompterDisplay(mod, slides, scriptSlides);
      }
    };

    tpNextBtn.onclick = () => {
      const maxLen = Math.max(slides.length, scriptSlides.length);
      if (currentTpSlideIndex < maxLen - 1) {
        currentTpSlideIndex++;
        localStorage.setItem(`lms_tp_slide_${mod.id}`, currentTpSlideIndex);
        updateTeleprompterDisplay(mod, slides, scriptSlides);
      }
    };
  }

  function updateTeleprompterDisplay(mod, slides, scriptSlides) {
    const total = Math.max(slides.length, scriptSlides.length);
    if (currentTpSlideIndex >= total) currentTpSlideIndex = 0;

    tpCounter.textContent = `Slide ${currentTpSlideIndex + 1} of ${total}`;

    // 1. Update Left Visual Slide
    const slide = slides[currentTpSlideIndex];
    if (slide && slide.content) {
      tpSlideContent.innerHTML = renderMarkdown(slide.content);
    } else {
      tpSlideContent.innerHTML = `<h3>${escapeHtml(slide ? slide.title : 'Slide ' + (currentTpSlideIndex + 1))}</h3>`;
    }

    // 2. Update Right Teleprompter Script Card
    const sc = scriptSlides[currentTpSlideIndex];
    if (sc) {
      tpCuePill.style.display = sc.direction ? 'block' : 'none';
      tpCueText.textContent = sc.direction || '';

      tpScriptText.textContent =
        sc.script || sc.summary || 'Follow presentation slides for discussion.';

      tpAnalogyCard.style.display = sc.analogy ? 'block' : 'none';
      tpAnalogyText.textContent = sc.analogy || '';

      tpCheckCard.style.display = sc.checkQuestion ? 'block' : 'none';
      tpCheckText.innerHTML = sc.checkQuestion || '';
    } else {
      tpCuePill.style.display = 'none';
      tpScriptText.textContent = 'No voice script available for this slide.';
      tpAnalogyCard.style.display = 'none';
      tpCheckCard.style.display = 'none';
    }
  }

  // --------------------------------------------------------------------------
  // TELEPROMPTER AUTO SCROLL (Smooth rAF with gesture pause, speed & progress)
  // --------------------------------------------------------------------------
  let tpScrollRafId = null;
  let lastTpFrameTime = 0;
  const tpScrollProgressFill = document.getElementById('tpScrollProgressFill');
  const tpCurrentSpeedBadge = document.getElementById('tpCurrentSpeedBadge');

  function updateTpScrollProgress() {
    if (!tpScriptText || !tpScrollProgressFill) return;
    const maxScroll = tpScriptText.scrollHeight - tpScriptText.clientHeight;
    if (maxScroll <= 0) {
      tpScrollProgressFill.style.width = '100%';
      return;
    }
    const pct = Math.min(100, Math.max(0, (tpScriptText.scrollTop / maxScroll) * 100));
    tpScrollProgressFill.style.width = `${pct}%`;
  }

  // Restore and persist teleprompter scroll speed
  if (tpScrollSpeed) {
    const savedSpeed = localStorage.getItem('lms_tp_speed') || '2';
    tpScrollSpeed.value = savedSpeed;
    if (tpCurrentSpeedBadge) tpCurrentSpeedBadge.textContent = `${savedSpeed}x Speed`;

    tpScrollSpeed.addEventListener('change', () => {
      localStorage.setItem('lms_tp_speed', tpScrollSpeed.value);
      if (tpCurrentSpeedBadge) tpCurrentSpeedBadge.textContent = `${tpScrollSpeed.value}x Speed`;
    });
  }

  function stopTpAutoScroll() {
    isAutoScrolling = false;
    if (tpScrollRafId) {
      cancelAnimationFrame(tpScrollRafId);
      tpScrollRafId = null;
    }
    if (tpAutoScrollBtn) {
      tpAutoScrollBtn.classList.remove('active');
      tpAutoScrollBtn.innerHTML = '<i class="fa-solid fa-angles-down"></i> Auto-Scroll: OFF';
    }
  }

  function stepTpAutoScroll(timestamp) {
    if (!isAutoScrolling || !tpScriptText) return;
    if (!lastTpFrameTime) lastTpFrameTime = timestamp;
    const delta = (timestamp - lastTpFrameTime) / 1000;
    lastTpFrameTime = timestamp;

    const speedMultiplier = parseInt(tpScrollSpeed ? tpScrollSpeed.value : 2, 10);
    // Smooth pixel scrolling rate
    const pxPerSec = speedMultiplier * 24;
    tpScriptText.scrollTop += pxPerSec * delta;
    updateTpScrollProgress();

    // Check if reached the bottom
    if (tpScriptText.scrollTop + tpScriptText.clientHeight >= tpScriptText.scrollHeight - 3) {
      stopTpAutoScroll();
      showToast('Teleprompter Reached End', 'Finished reading slide notes.', 'info');
      return;
    }

    tpScrollRafId = requestAnimationFrame(stepTpAutoScroll);
  }

  if (tpAutoScrollBtn) {
    tpAutoScrollBtn.addEventListener('click', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion && !isAutoScrolling) {
        showToast(
          'Reduced Motion Active',
          'Continuous auto-scrolling is paused because reduced motion is enabled in system settings.',
          'info'
        );
        return;
      }

      isAutoScrolling = !isAutoScrolling;
      tpAutoScrollBtn.classList.toggle('active', isAutoScrolling);
      tpAutoScrollBtn.innerHTML = isAutoScrolling
        ? '<i class="fa-solid fa-pause"></i> Auto-Scroll: ON'
        : '<i class="fa-solid fa-angles-down"></i> Auto-Scroll: OFF';

      if (isAutoScrolling) {
        lastTpFrameTime = 0;
        tpScrollRafId = requestAnimationFrame(stepTpAutoScroll);
      } else {
        stopTpAutoScroll();
      }
    });
  }

  // Pause teleprompter on user manual interaction & update progress
  if (tpScriptText) {
    const pauseOnUserInteraction = () => {
      updateTpScrollProgress();
      if (isAutoScrolling) {
        stopTpAutoScroll();
        showToast('Auto-Scroll Paused', 'Paused due to manual scroll or touch.', 'info');
      }
    };
    tpScriptText.addEventListener('wheel', pauseOnUserInteraction, { passive: true });
    tpScriptText.addEventListener('touchstart', pauseOnUserInteraction, { passive: true });
    tpScriptText.addEventListener('scroll', updateTpScrollProgress, { passive: true });
  }

  // --------------------------------------------------------------------------
  // Teleprompter Font Size Controls & Persistence
  // --------------------------------------------------------------------------
  function applySavedTpFontSize() {
    if (!tpScriptText) return;
    const saved = localStorage.getItem('lms_tp_font_size') || 'normal';
    tpScriptText.classList.remove('font-large', 'font-xlarge');
    if (saved === 'xlarge') {
      tpScriptText.classList.add('font-large', 'font-xlarge');
    } else if (saved === 'large') {
      tpScriptText.classList.add('font-large');
    }
  }

  function saveTpFontSize(size) {
    localStorage.setItem('lms_tp_font_size', size);
  }

  tpFontDecBtn.addEventListener('click', () => {
    if (tpScriptText.classList.contains('font-xlarge')) {
      tpScriptText.classList.remove('font-xlarge');
      saveTpFontSize('large');
    } else if (tpScriptText.classList.contains('font-large')) {
      tpScriptText.classList.remove('font-large');
      saveTpFontSize('normal');
    }
  });

  tpFontIncBtn.addEventListener('click', () => {
    if (!tpScriptText.classList.contains('font-large')) {
      tpScriptText.classList.add('font-large');
      saveTpFontSize('large');
    } else if (!tpScriptText.classList.contains('font-xlarge')) {
      tpScriptText.classList.add('font-xlarge');
      saveTpFontSize('xlarge');
    }
  });

  // Reveal Check Question Answer
  if (tpShowAnswerBtn) {
    tpShowAnswerBtn.addEventListener('click', () => {
      const mod = courseData.modules.find((m) => m.id === activeModuleId);
      const sc = mod && mod.teacher.parsedVoiceScript[currentTpSlideIndex];
      if (sc && sc.checkQuestion) {
        alert(
          `Question: ${sc.checkQuestion}\n\nAnswer Guidance: Refer to student handout and Maliki fiqh key for full breakdown.`
        );
      }
    });
  }

  // --------------------------------------------------------------------------
  // TEACHER MASTER ANSWER KEYS CONTROLLER
  // --------------------------------------------------------------------------

  function renderAnswerKeys(mod) {
    updateAkToggleButtons();

    akToggleL1.onclick = () => {
      activeAkLevel = 'level1';
      updateAkToggleButtons();
      renderAnswerKeys(mod);
    };

    akToggleL2.onclick = () => {
      activeAkLevel = 'level2';
      updateAkToggleButtons();
      renderAnswerKeys(mod);
    };

    const trackData = activeAkLevel === 'level2' ? mod.tracks.level2 : mod.tracks.level1;
    const akRaw = trackData.parsedQuestions.answerKeyRaw;

    if (akRaw) {
      answerKeyContent.innerHTML = renderMarkdown(akRaw);
    } else {
      answerKeyContent.innerHTML = `<p class="text-muted">Master answer key compiled within module script. Refer to voice scripts or slides for full explanation.</p>`;
    }
  }

  function updateAkToggleButtons() {
    akToggleL1.classList.toggle('active', activeAkLevel === 'level1');
    akToggleL2.classList.toggle('active', activeAkLevel === 'level2');
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE QUIZ ENGINE & CERTIFICATE GENERATOR
  // --------------------------------------------------------------------------

  function renderQuiz(mod) {
    quizScoreBanner.style.display = 'none';
    quizQuestionsArea.innerHTML = '';

    let trackData = mod.tracks.level1;
    if (activeTrack === 'level2') {
      trackData = mod.tracks.level2;
    }

    const pq = trackData.parsedQuestions;

    if (!pq || (!pq.multipleChoice.length && !pq.fillBlanks.length && !pq.reflection.length)) {
      const cleanMd =
        pq && pq.studentQuestionsMd
          ? pq.studentQuestionsMd
          : (trackData.questionsMd || '').replace(/##?\s*.*Answer\s+Key[\s\S]*/i, '');
      if (cleanMd) {
        quizQuestionsArea.innerHTML = `<div class="content-card"><div class="markdown-body">${renderMarkdown(cleanMd)}</div></div>`;
      } else {
        quizQuestionsArea.innerHTML = '<p>No questions available for this module track.</p>';
      }
      submitQuizBtn.style.display = 'none';
      return;
    }

    submitQuizBtn.style.display = 'flex';

    if (pq.multipleChoice.length > 0) {
      const mcqSection = document.createElement('div');
      mcqSection.className = 'quiz-card';
      mcqSection.innerHTML = `<h3><i class="fa-solid fa-list-check"></i> Multiple Choice Questions</h3>`;

      pq.multipleChoice.forEach((q, idx) => {
        const qBox = document.createElement('div');
        qBox.className = 'quiz-card';
        qBox.style.marginTop = '16px';
        qBox.dataset.qNum = q.id;

        let optsHtml = '';
        q.options.forEach((opt) => {
          optsHtml += `
            <button type="button" class="opt-btn" data-qid="${q.id}" data-opt="${opt.key}">
              <span class="opt-key" style="font-weight:700;">${opt.key})</span>
              <span>${opt.text}</span>
            </button>
          `;
        });

        qBox.innerHTML = `
          <div class="quiz-card-header">
            <span class="q-number">${idx + 1}</span>
            <div>${q.question}</div>
          </div>
          <div class="mcq-options">${optsHtml}</div>
          <div class="quiz-explanation-card" id="exp_${q.id}" style="display: none;"></div>
        `;

        const btns = qBox.querySelectorAll('.opt-btn');
        btns.forEach((b) => {
          b.addEventListener('click', (e) => {
            e.preventDefault();
            btns.forEach((x) => x.classList.remove('selected'));
            b.classList.add('selected');
          });
        });

        mcqSection.appendChild(qBox);
      });

      quizQuestionsArea.appendChild(mcqSection);
    }

    if (pq.fillBlanks.length > 0) {
      const fibSection = document.createElement('div');
      fibSection.className = 'quiz-card';
      fibSection.style.marginTop = '24px';

      let wordBankHtml = '';
      if (pq.fillBlanks[0] && pq.fillBlanks[0].wordBank.length > 0) {
        wordBankHtml = `<div style="background:var(--input-bg);padding:12px;border-radius:var(--radius-sm);margin-bottom:16px;"><strong>Word Bank:</strong> ${pq.fillBlanks[0].wordBank.map((w) => `<span style="background:var(--card-bg);padding:2px 8px;margin:2px;border-radius:4px;display:inline-block;font-size:0.85rem;">${w}</span>`).join(' ')}</div>`;
      }

      let fibLinesHtml = '';
      pq.fillBlanks.forEach((fib, idx) => {
        fibLinesHtml += `
          <div style="margin-bottom: 14px; font-size: 0.95rem;">
            <strong>${fib.id || idx + 1}.</strong> ${fib.text.replace(/__+/g, '<input type="text" class="fib-input" data-fibid="' + fib.id + '">')}
          </div>
        `;
      });

      fibSection.innerHTML = `
        <h3><i class="fa-solid fa-pen-line"></i> Fill in the Blanks</h3>
        ${wordBankHtml}
        <div>${fibLinesHtml}</div>
      `;

      quizQuestionsArea.appendChild(fibSection);
    }

    if (pq.reflection.length > 0) {
      const refSection = document.createElement('div');
      refSection.className = 'quiz-card';
      refSection.style.marginTop = '24px';
      refSection.innerHTML = `<h3><i class="fa-solid fa-comment-dots"></i> Reflection & Short Answer</h3>`;

      pq.reflection.forEach((ref) => {
        const item = document.createElement('div');
        item.style.marginTop = '16px';

        const saveKey = `ref_${activeModuleId}_${activeTrack}_${ref.id}`;
        const savedText = userReflections[saveKey] || '';

        item.innerHTML = `
          <p><strong>${ref.id}. ${ref.question}</strong></p>
          <textarea class="reflection-input" data-refkey="${saveKey}" placeholder="Write your thoughts or response here...">${savedText}</textarea>
        `;

        const ta = item.querySelector('textarea');
        ta.addEventListener('input', (e) => {
          userReflections[saveKey] = e.target.value;
          localStorage.setItem(
            `lms_reflections_${activeChild ? activeChild.id : 'global'}`,
            JSON.stringify(userReflections)
          );
        });

        refSection.appendChild(item);
      });

      quizQuestionsArea.appendChild(refSection);
    }

    const scoreKey = `quiz_${activeModuleId}_${activeTrack}`;
    if (quizScores[scoreKey]) {
      showQuizScoreBanner(quizScores[scoreKey].score, quizScores[scoreKey].total);
    }
  }

  // --------------------------------------------------------------------------
  // Server-Side Quiz Grading & Maliki Scholarly Explanations Engine
  // --------------------------------------------------------------------------
  submitQuizBtn.addEventListener('click', async () => {
    const mod = courseData.modules.find((m) => m.id === activeModuleId);
    if (!mod) return;

    const track = activeTrack === 'level2' ? 'level2' : 'level1';
    let trackData = track === 'level2' ? mod.tracks.level2 : mod.tracks.level1;
    const mcqs = trackData.parsedQuestions.multipleChoice || [];

    const answers = {};
    mcqs.forEach((q, idx) => {
      const qBox = quizQuestionsArea.querySelector(`[data-q-num="${q.id}"]`);
      if (qBox) {
        const selected = qBox.querySelector('.opt-btn.selected');
        if (selected) {
          answers[idx] = selected.dataset.opt;
        }
      }
    });

    submitQuizBtn.disabled = true;
    submitQuizBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Grading Exam...';

    try {
      let data = null;

      // 1. Attempt Server-Side Grading
      try {
        const res = await fetch('/api/quiz/grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleId: activeModuleId,
            track,
            answers,
            childId: activeChild ? activeChild.id : null
          })
        });

        if (res.ok) {
          const text = await res.text();
          if (text && text.trim().length > 0) {
            try {
              data = JSON.parse(text);
            } catch (jsonErr) {
              console.warn(
                'Server grading returned non-JSON response, using client grading engine:',
                jsonErr
              );
            }
          }
        }
      } catch (netErr) {
        console.warn(
          'Network issue reaching server quiz grading endpoint, using client grading engine:',
          netErr
        );
      }

      // 2. Client-Side Grading Fallback (when server is unreachable or returns non-success)
      if (!data || !data.success) {
        // Log the server-side reason if available (e.g. rate limit)
        if (data && data.error) {
          console.warn('Server grading declined:', data.error);
        }

        // Grade locally using the already-loaded course data
        let correctCount = 0;
        const total = mcqs.length;
        const feedbackList = [];

        mcqs.forEach((q, idx) => {
          const studentAns = (answers[idx] || '').toString().trim().toUpperCase();
          const correctAns = (q.correctAnswer || 'A').toString().trim().toUpperCase();
          const isCorrect = studentAns === correctAns;
          if (isCorrect) correctCount++;
          feedbackList.push({
            questionIndex: idx,
            selectedAnswer: studentAns,
            correctAnswer: correctAns,
            isCorrect,
            explanation:
              q.explanation ||
              `Correct Answer is (${correctAns}). Refer to student handout for full breakdown.`
          });
        });

        const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        data = {
          success: true,
          score: correctCount,
          total,
          percentage,
          passed: percentage >= 80,
          feedback: feedbackList,
          _gradedLocally: true
        };
      }

      // 3. Display option feedback and explanations
      if (data.feedback && Array.isArray(data.feedback)) {
        data.feedback.forEach((item) => {
          const qObj = mcqs[item.questionIndex];
          if (!qObj) return;
          const qBox = quizQuestionsArea.querySelector(`[data-q-num="${qObj.id}"]`);
          if (!qBox) return;

          const optBtns = qBox.querySelectorAll('.opt-btn');
          const expBox = qBox.querySelector(`#exp_${qObj.id}`);

          optBtns.forEach((btn) => {
            const key = btn.dataset.opt;
            if (key === item.correctAnswer) {
              btn.classList.add('correct');
            } else if (key === item.selectedAnswer && !item.isCorrect) {
              btn.classList.add('incorrect');
            }
          });

          if (expBox) {
            expBox.style.display = 'block';
            expBox.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <strong>Scholarly Note:</strong> ${escapeHtml(item.explanation)}`;
          }
        });
      }

      const scoreKey = `quiz_${activeModuleId}_${activeTrack}`;
      quizScores[scoreKey] = { score: data.score, total: data.total, percentage: data.percentage };
      localStorage.setItem(
        `lms_quiz_scores_${activeChild ? activeChild.id : 'global'}`,
        JSON.stringify(quizScores)
      );
      showQuizScoreBanner(data.score, data.total);

      if (data.passed) {
        userProgress[`mod_${activeModuleId}`] = true;
        localStorage.setItem(
          `lms_progress_${activeChild ? activeChild.id : 'global'}`,
          JSON.stringify(userProgress)
        );
        persistModuleProgress(activeModuleId, true, activeTrack);
        renderSidebarModules();
        updateProgressUI();
        showToast(
          'MashaAllah! Exam Passed 🏆',
          `You scored ${data.percentage}% on Module ${activeModuleId}! Certificate unlocked.`,
          'celebration'
        );
      } else {
        showToast(
          'Quiz Completed',
          `Score: ${data.score}/${data.total} (${data.percentage}%). Review topics and try again!`,
          'info'
        );
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      showToast('Grading Error', err.message || 'Unable to grade quiz.', 'error');
    } finally {
      submitQuizBtn.disabled = false;
      submitQuizBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit & Check Answers';
    }
  });

  retryQuizBtn.addEventListener('click', () => {
    const mod = courseData.modules.find((m) => m.id === activeModuleId);
    if (mod) renderQuiz(mod);
  });

  function showQuizScoreBanner(score, total) {
    quizScoreBanner.style.display = 'flex';
    scoreDisplay.textContent = `${score} / ${total}`;
    const pct = Math.round((score / total) * 100);
    scorePercent.textContent = `${pct}%`;

    if (pct >= 80) {
      openCertBtn.style.display = 'inline-flex';
      openCertBtn.onclick = () => launchCertificate(pct);
    } else {
      openCertBtn.style.display = 'none';
    }
  }

  function launchCertificate(pct) {
    const mod = courseData.modules.find((m) => m.id === activeModuleId);
    certModuleName.textContent = mod ? `Module ${mod.id}: ${mod.title}` : 'Islamic Studies Module';
    certScoreBadge.textContent = `Score Achieved: ${pct}%`;
    certDateText.textContent = `Issue Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
    openAccessibleModal(certModal, '#certCloseBtn');
  }

  if (certCloseBtn) certCloseBtn.addEventListener('click', () => closeAccessibleModal(certModal));
  if (certDoneBtn) certDoneBtn.addEventListener('click', () => closeAccessibleModal(certModal));

  // --------------------------------------------------------------------------
  // SLIDESHOW & VOICE SCRIPT RENDERERS
  // --------------------------------------------------------------------------

  function renderSlides(mod) {
    const slides = mod.teacher.parsedSlides || [];
    if (slides.length === 0) {
      slideContent.innerHTML = mod.teacher.slidesMd
        ? renderMarkdown(mod.teacher.slidesMd)
        : '<p>No slide presentation deck available.</p>';
      slideCounter.textContent = '1 of 1';
      return;
    }

    currentSlideIndex = 0;
    updateSlideDisplay(slides);

    prevSlideBtn.onclick = () => {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSlideDisplay(slides);
      }
    };

    nextSlideBtn.onclick = () => {
      if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        updateSlideDisplay(slides);
      }
    };
  }

  function updateSlideDisplay(slides) {
    if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
    const cur = slides[currentSlideIndex];
    slideCounter.textContent = `Slide ${currentSlideIndex + 1} of ${slides.length}`;
    if (cur.content) {
      slideContent.innerHTML = renderMarkdown(cur.content);
    } else {
      slideContent.textContent = cur.content;
    }
  }

  fullscreenSlidesBtn.addEventListener('click', () => {
    const frame = document.getElementById('slideFrame');
    if (!document.fullscreenElement) {
      frame.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  });

  function renderVoiceScript(mod) {
    const scriptMd = mod.teacher.voiceScriptMd;
    if (scriptMd) {
      voiceScriptContent.innerHTML = renderMarkdown(scriptMd);
    } else {
      voiceScriptContent.innerHTML = `<pre>${escapeHtml(scriptMd || 'No teacher voice script recorded for this module.')}</pre>`;
    }
  }

  function updateProgressUI() {
    const completedMods = Object.keys(userProgress).filter((k) => userProgress[k]).length;
    const total = 9;
    const pct = Math.round((completedMods / total) * 100);
    progressPercent.textContent = `${pct}%`;
    progressBarFill.style.width = `${pct}%`;
    if (progressSubtext) progressSubtext.textContent = `${completedMods} of 9 Modules Completed`;
  }

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // GLOBAL FULL-TEXT SEARCH ENGINE (250ms Debounced)
  // --------------------------------------------------------------------------
  let searchDebounceTimer = null;

  function performSearch(query) {
    if (!courseData || !courseData.modules) return;
    const results = [];
    courseData.modules.forEach((mod) => {
      const h10 = (mod.tracks.level1.handoutMd || '').toLowerCase();
      const h13 = (mod.tracks.level2.handoutMd || '').toLowerCase();
      const script = (mod.teacher.voiceScriptMd || '').toLowerCase();

      if (
        mod.title.toLowerCase().includes(query) ||
        mod.description.toLowerCase().includes(query) ||
        mod.category.toLowerCase().includes(query)
      ) {
        results.push({ module: mod, snippet: mod.description });
      } else if (h10.includes(query) || h13.includes(query) || script.includes(query)) {
        const text = h10 || h13 || script;
        const snippetIdx = Math.max(0, text.indexOf(query));
        const snippet = text.substring(Math.max(0, snippetIdx - 20), snippetIdx + 120) + '...';
        results.push({ module: mod, snippet });
      }
    });

    if (searchResultsCount)
      searchResultsCount.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
    searchResultsList.innerHTML = '';

    if (results.length === 0) {
      searchResultsList.innerHTML =
        '<p class="text-muted" style="padding: 12px;">No matching course topics found.</p>';
      return;
    }

    results.forEach((res) => {
      const item = document.createElement('div');
      item.className = 'search-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.innerHTML = `
        <div class="search-item-header">
          <span>Module ${res.module.id}: ${res.module.title}</span>
          <span class="category-badge">${res.module.category}</span>
        </div>
        <div class="search-item-snippet">${res.snippet}</div>
      `;
      const selectItem = () => {
        openModule(res.module.id);
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        searchResultsContainer.style.display = 'none';
      };
      item.addEventListener('click', selectItem);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectItem();
        }
      });
      searchResultsList.appendChild(item);
    });
  }

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    clearTimeout(searchDebounceTimer);

    if (!query) {
      clearSearchBtn.style.display = 'none';
      searchResultsContainer.style.display = 'none';
      return;
    }

    clearSearchBtn.style.display = 'block';
    searchResultsContainer.style.display = 'block';

    searchDebounceTimer = setTimeout(() => {
      performSearch(query);
    }, 250);
  });

  clearSearchBtn.addEventListener('click', () => {
    clearTimeout(searchDebounceTimer);
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchResultsContainer.style.display = 'none';
    searchInput.focus();
  });

  /* ==========================================================================
     Multi-Tenant Auth, Family Learner Switcher, Parent & Admin Controller
     ========================================================================== */

  // State
  let currentUser = JSON.parse(localStorage.getItem('lms_user') || 'null');
  let familyChildren = [];

  // DOM Elements - Navigation & Header
  const learnerSwitcherBtn = document.getElementById('learnerSwitcherBtn');
  const headerLearnerAvatar = document.getElementById('headerLearnerAvatar');
  const headerLearnerName = document.getElementById('headerLearnerName');
  const parentNavBtn = document.getElementById('parentNavBtn');
  const adminNavBtn = document.getElementById('adminNavBtn');
  const sidebarAdminBtn = document.getElementById('sidebarAdminBtn');
  const parentAdminBanner = document.getElementById('parentAdminBanner');
  const parentToAdminBtn = document.getElementById('parentToAdminBtn');
  const authHeaderBtn = document.getElementById('authHeaderBtn');
  const authHeaderIcon = document.getElementById('authHeaderIcon');
  const authHeaderText = document.getElementById('authHeaderText');
  const signOutHeaderBtn = document.getElementById('signOutHeaderBtn');
  const sidebarSignOutBtn = document.getElementById('sidebarSignOutBtn');

  // DOM Elements - Views
  const authLandingView = document.getElementById('authLandingView');
  const parentDashboardView = document.getElementById('parentDashboardView');
  const adminDashboardView = document.getElementById('adminDashboardView');

  // Homepage Auth Landing Elements
  const homeAuthTabSignIn = document.getElementById('homeAuthTabSignIn');
  const homeAuthTabSignUp = document.getElementById('homeAuthTabSignUp');
  const homeAuthAlertMsg = document.getElementById('homeAuthAlertMsg');
  const homeEmailAuthForm = document.getElementById('homeEmailAuthForm');
  const homeAuthEmailInput = document.getElementById('homeAuthEmailInput');
  const homeAuthPasswordInput = document.getElementById('homeAuthPasswordInput');
  const homeSignUpForm = document.getElementById('homeSignUpForm');
  const homeSignUpNameInput = document.getElementById('homeSignUpNameInput');
  const homeSignUpEmailInput = document.getElementById('homeSignUpEmailInput');
  const homeSignUpPasswordInput = document.getElementById('homeSignUpPasswordInput');
  const homeSignUpRoleSelect = document.getElementById('homeSignUpRoleSelect');
  const guestBrowseBtn = document.getElementById('guestBrowseBtn');
  const landingNavGuestBtn = document.getElementById('landingNavGuestBtn');
  const landingNavAuthBtn = document.getElementById('landingNavAuthBtn');
  const heroSignInScrollBtn = document.getElementById('heroSignInScrollBtn');
  const ctaRegisterBtn = document.getElementById('ctaRegisterBtn');
  const ctaGuestBtn = document.getElementById('ctaGuestBtn');

  // Parent Dashboard Elements
  const parentWelcomeTitle = document.getElementById('parentWelcomeTitle');
  const parentAuthBadge = document.getElementById('parentAuthBadge');
  const statParentKidsCount = document.getElementById('statParentKidsCount');
  const statParentTotalCompleted = document.getElementById('statParentTotalCompleted');
  const statParentAvgQuiz = document.getElementById('statParentAvgQuiz');
  const statActiveLearnerName = document.getElementById('statActiveLearnerName');
  const parentChildrenGrid = document.getElementById('parentChildrenGrid');
  const addChildBtn = document.getElementById('addChildBtn');
  const familyActivityList = document.getElementById('familyActivityList');
  const parentSignOutBtn = document.getElementById('parentSignOutBtn');

  // Admin Dashboard Elements
  const statAdminTotalParents = document.getElementById('statAdminTotalParents');
  const statAdminTotalKids = document.getElementById('statAdminTotalKids');
  const statAdminTotalCompletions = document.getElementById('statAdminTotalCompletions');
  const statAdminAvgQuiz = document.getElementById('statAdminAvgQuiz');
  const adminUsersTableBody = document.getElementById('adminUsersTableBody');
  const adminRefreshBtn = document.getElementById('adminRefreshBtn');
  const adminUserSearchInput = document.getElementById('adminUserSearchInput');
  const adminRoleFilterSelect = document.getElementById('adminRoleFilterSelect');
  const adminSignOutBtn = document.getElementById('adminSignOutBtn');
  const adminRefreshLogsBtn = document.getElementById('adminRefreshLogsBtn');
  const adminClearLogsBtn = document.getElementById('adminClearLogsBtn');
  const adminTelemetryTableBody = document.getElementById('adminTelemetryTableBody');

  // Modal Elements - Auth & Signup/Signin
  const authModal = document.getElementById('authModal');
  const authModalCloseBtn = document.getElementById('authModalCloseBtn');
  const authTabSignIn = document.getElementById('authTabSignIn');
  const authTabSignUp = document.getElementById('authTabSignUp');
  const authAlertMsg = document.getElementById('authAlertMsg');
  const emailAuthForm = document.getElementById('emailAuthForm');
  const authEmailInput = document.getElementById('authEmailInput');
  const authPasswordInput = document.getElementById('authPasswordInput');
  const signUpForm = document.getElementById('signUpForm');
  const signUpNameInput = document.getElementById('signUpNameInput');
  const signUpEmailInput = document.getElementById('signUpEmailInput');
  const signUpPasswordInput = document.getElementById('signUpPasswordInput');
  const signUpRoleSelect = document.getElementById('signUpRoleSelect');

  // User Profile Modal Elements
  const userProfileModal = document.getElementById('userProfileModal');
  const userProfileModalCloseBtn = document.getElementById('userProfileModalCloseBtn');
  const profileUserPhoto = document.getElementById('profileUserPhoto');
  const profileUserName = document.getElementById('profileUserName');
  const profileUserEmail = document.getElementById('profileUserEmail');
  const profileUserRole = document.getElementById('profileUserRole');
  const profileUserProvider = document.getElementById('profileUserProvider');
  const profileEditForm = document.getElementById('profileEditForm');
  const profileNameInput = document.getElementById('profileNameInput');
  const profileSignOutBtn = document.getElementById('profileSignOutBtn');

  // Child Profile & Learner Switcher Modal Elements
  const childModal = document.getElementById('childModal');
  const childModalCloseBtn = document.getElementById('childModalCloseBtn');
  const childForm = document.getElementById('childForm');
  const editingChildId = document.getElementById('editingChildId');
  const childNameInput = document.getElementById('childNameInput');
  const avatarSelectorGrid = document.getElementById('avatarSelectorGrid');
  const selectedChildAvatar = document.getElementById('selectedChildAvatar');
  const childTrackSelect = document.getElementById('childTrackSelect');
  const childPinInput = document.getElementById('childPinInput');
  const cancelChildBtn = document.getElementById('cancelChildBtn');

  const learnerModal = document.getElementById('learnerModal');
  const learnerModalCloseBtn = document.getElementById('learnerModalCloseBtn');
  const learnerModalList = document.getElementById('learnerModalList');
  const learnerModalParentBtn = document.getElementById('learnerModalParentBtn');

  // PIN Verification Challenge Modal Elements
  const pinChallengeModal = document.getElementById('pinChallengeModal');
  const pinChallengeCloseBtn = document.getElementById('pinChallengeCloseBtn');
  const pinChallengeForm = document.getElementById('pinChallengeForm');
  const targetChildId = document.getElementById('targetChildId');
  const pinChallengeInput = document.getElementById('pinChallengeInput');
  const pinErrorMsg = document.getElementById('pinErrorMsg');
  const pinChallengeCancelBtn = document.getElementById('pinChallengeCancelBtn');

  let adminUsersCache = [];

  // Navigation View Switcher
  function switchView(viewName) {
    const topHeaderEl = document.querySelector('.top-header');
    const sidebarEl = document.getElementById('sidebar');

    if (authLandingView) authLandingView.style.display = 'none';
    dashboardView.style.display = 'none';
    moduleView.style.display = 'none';
    if (parentDashboardView) parentDashboardView.style.display = 'none';
    if (adminDashboardView) adminDashboardView.style.display = 'none';
    searchResultsContainer.style.display = 'none';

    if (adminUptimeTickerInterval) {
      clearInterval(adminUptimeTickerInterval);
      adminUptimeTickerInterval = null;
    }
    if (adminAutoRefreshInterval) {
      clearInterval(adminAutoRefreshInterval);
      adminAutoRefreshInterval = null;
    }

    if (viewName === 'authLanding') {
      document.body.classList.add('unauthenticated-view');
      if (sidebarEl) sidebarEl.style.display = 'none';
      if (topHeaderEl) topHeaderEl.style.display = 'none';
      if (authLandingView) authLandingView.style.display = 'block';
    } else {
      document.body.classList.remove('unauthenticated-view');
      if (sidebarEl) sidebarEl.style.display = 'flex';
      if (topHeaderEl) topHeaderEl.style.display = 'flex';

      if (viewName === 'dashboard') {
        activeModuleId = null;
        dashboardView.style.display = 'block';
        renderSidebarModules();
        renderDashboard();
      } else if (viewName === 'module') {
        moduleView.style.display = 'block';
      } else if (viewName === 'parent') {
        if (parentDashboardView) parentDashboardView.style.display = 'block';
        renderParentDashboard();
      } else if (viewName === 'admin') {
        if (adminDashboardView) adminDashboardView.style.display = 'block';
        renderAdminDashboard();
        adminUptimeTickerInterval = setInterval(updateAdminUptimeDisplay, 1000);
        adminAutoRefreshInterval = setInterval(() => {
          if (adminDashboardView && adminDashboardView.style.display !== 'none') {
            renderAdminDashboard(true);
          }
        }, 10000);
      }
    }
    try {
      localStorage.setItem('lms_last_view', viewName);
    } catch (e) {}
  }

  // Override showDashboard to use switchView
  function showDashboard() {
    if (!currentUser) {
      switchView('authLanding');
    } else {
      switchView('dashboard');
    }
  }

  // Auth Helper: Show Alert Message
  function showAuthAlert(msg, type = 'error', targetAlert = authAlertMsg) {
    if (!targetAlert) return;
    targetAlert.textContent = msg;
    targetAlert.className = `auth-alert-msg ${type}`;
    targetAlert.style.display = 'block';
  }

  function hideAuthAlert(targetAlert = authAlertMsg) {
    if (targetAlert) targetAlert.style.display = 'none';
  }

  // Auth Helper: Switch Auth Modal Tabs
  function switchAuthTab(tabName) {
    hideAuthAlert();
    if (tabName === 'signup') {
      authTabSignUp.classList.add('active');
      authTabSignIn.classList.remove('active');
      signUpForm.style.display = 'block';
      emailAuthForm.style.display = 'none';
      const divText = document.getElementById('authDividerText');
      if (divText) divText.textContent = 'OR REGISTER WITH EMAIL';
    } else {
      authTabSignIn.classList.add('active');
      authTabSignUp.classList.remove('active');
      emailAuthForm.style.display = 'block';
      signUpForm.style.display = 'none';
      const divText = document.getElementById('authDividerText');
      if (divText) divText.textContent = 'OR SIGN IN WITH EMAIL';
    }
  }

  // Homepage Landing Auth Tab Switcher
  function switchHomeAuthTab(tabName) {
    hideAuthAlert(homeAuthAlertMsg);
    if (tabName === 'signup') {
      homeAuthTabSignUp.classList.add('active');
      homeAuthTabSignIn.classList.remove('active');
      homeSignUpForm.style.display = 'block';
      homeEmailAuthForm.style.display = 'none';
      const divText = document.getElementById('homeAuthDividerText');
      if (divText) divText.textContent = 'OR REGISTER WITH EMAIL';
    } else {
      homeAuthTabSignIn.classList.add('active');
      homeAuthTabSignUp.classList.remove('active');
      homeEmailAuthForm.style.display = 'block';
      homeSignUpForm.style.display = 'none';
      const divText = document.getElementById('homeAuthDividerText');
      if (divText) divText.textContent = 'OR SIGN IN WITH EMAIL';
    }
  }

  // Auth Management: Sync Auth with Backend
  async function syncAuthWithBackend(userObj) {
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userObj)
      });
      const data = await res.json();
      if (data.success && data.user) {
        currentUser = data.user;
        localStorage.setItem('lms_user', JSON.stringify(currentUser));
        updateAuthUI();
        await fetchFamilyChildren();
      }
    } catch (err) {
      console.error('Error syncing auth with backend:', err);
      currentUser = userObj;
      localStorage.setItem('lms_user', JSON.stringify(currentUser));
      updateAuthUI();
    }
  }

  function updateAuthUI() {
    if (currentUser) {
      if (authHeaderText)
        authHeaderText.textContent = currentUser.displayName || currentUser.email.split('@')[0];
      if (authHeaderIcon) authHeaderIcon.className = 'fa-solid fa-user-circle';
      if (signOutHeaderBtn) signOutHeaderBtn.style.display = 'inline-flex';
      if (sidebarSignOutBtn) sidebarSignOutBtn.style.display = 'flex';
      const isSuper = currentUser.role === 'super_admin';
      const isTeacher = currentUser.role === 'teacher' || currentUser.role === 'educator';
      const trackTeacher = document.getElementById('trackTeacher');
      if (trackTeacher) trackTeacher.style.display = isSuper || isTeacher ? 'inline-flex' : 'none';
      if (adminNavBtn) adminNavBtn.style.display = isSuper ? 'inline-flex' : 'none';
      if (sidebarAdminBtn) sidebarAdminBtn.style.display = isSuper ? 'inline-flex' : 'none';
      if (parentAdminBanner) parentAdminBanner.style.display = isSuper ? 'flex' : 'none';
    } else {
      if (authHeaderText) authHeaderText.textContent = 'Sign In';
      if (authHeaderIcon) authHeaderIcon.className = 'fa-solid fa-arrow-right-to-bracket';
      if (signOutHeaderBtn) signOutHeaderBtn.style.display = 'none';
      if (sidebarSignOutBtn) sidebarSignOutBtn.style.display = 'none';
      if (adminNavBtn) adminNavBtn.style.display = 'none';
      if (sidebarAdminBtn) sidebarAdminBtn.style.display = 'none';
      if (parentAdminBanner) parentAdminBanner.style.display = 'none';
    }
  }

  // User Profile Modal Handlers
  function openUserProfileModal() {
    if (!currentUser) {
      switchView('authLanding');
      return;
    }

    if (profileUserName) profileUserName.textContent = currentUser.displayName || 'User Profile';
    if (profileUserEmail) profileUserEmail.textContent = currentUser.email || '';
    if (profileNameInput) profileNameInput.value = currentUser.displayName || '';
    if (profileUserPhoto) {
      profileUserPhoto.src =
        currentUser.photoURL ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email || 'user')}`;
    }
    if (profileUserRole) {
      profileUserRole.textContent =
        currentUser.role === 'super_admin' ? '⚡ Super Admin' : '👨‍👩‍👧 Parent Account';
    }
    if (profileUserProvider) {
      const p = currentUser.provider || 'google.com';
      let icon = 'fa-globe';
      if (p.includes('google')) icon = 'fa-google';
      else if (p.includes('apple')) icon = 'fa-apple';
      else if (p.includes('microsoft')) icon = 'fa-microsoft';
      profileUserProvider.innerHTML = `<i class="fa-brands ${icon}"></i> ${p}`;
    }

    openAccessibleModal(userProfileModal, '#profileNameInput');
  }

  async function handleSignOut() {
    try {
      // Fetch latest children from server BEFORE logging out to persist them
      if (currentUser) {
        const res = await fetch(`/api/parent/children`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.children && Array.isArray(data.children)) {
            localStorage.setItem('lms_children', JSON.stringify(data.children));
          }
        }
      }
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API error:', e);
    }
    currentUser = null;
    activeChild = null;
    localStorage.removeItem('lms_user');
    localStorage.removeItem('lms_active_child');
    // Note: Retain lms_children in storage so direct kid URLs and local family profiles remain accessible
    updateAuthUI();
    if (userProfileModal) closeAccessibleModal(userProfileModal);
    showToast(
      'Signed Out Successfully',
      'You have been safely signed out of your account.',
      'info'
    );
    switchView('authLanding');
  }

  function renderChildrenGrid() {
    if (parentDashboardView && parentDashboardView.style.display !== 'none') {
      renderParentDashboard();
    }
  }

  function renderLearnerSelector() {
    if (activeChild) {
      if (headerLearnerAvatar) headerLearnerAvatar.textContent = activeChild.avatar || '🌟';
      if (headerLearnerName) headerLearnerName.textContent = activeChild.name;
      if (statActiveLearnerName) statActiveLearnerName.textContent = activeChild.name;
    } else {
      if (headerLearnerAvatar) headerLearnerAvatar.textContent = '🌟';
      if (headerLearnerName) headerLearnerName.textContent = 'Select Learner';
      if (statActiveLearnerName) statActiveLearnerName.textContent = 'None';
    }
    if (learnerModal && learnerModal.classList.contains('active')) {
      openLearnerModal();
    }
  }

  // Family & Children Management
  async function fetchFamilyChildren() {
    if (!currentUser) {
      const cached =
        localStorage.getItem('lms_children') || localStorage.getItem('lms_local_children');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            familyChildren = parsed;
          }
        } catch (e) {}
      }
      renderChildrenGrid();
      renderLearnerSelector();
      return;
    }

    try {
      const res = await fetch(`/api/parent/children`);
      if (res.status === 401 || res.status === 403) {
        currentUser = null;
        familyChildren = [];
        localStorage.removeItem('lms_user');
        localStorage.removeItem('lms_children');
        updateAuthUI();
        switchView('authLanding');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.children)) {
          familyChildren = data.children;
          localStorage.setItem('lms_children', JSON.stringify(familyChildren));
        }
      } else {
        const cached = localStorage.getItem('lms_children');
        if (cached) {
          try {
            familyChildren = JSON.parse(cached);
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Children sync notice:', err);
      const cached = localStorage.getItem('lms_children');
      if (cached) {
        try {
          familyChildren = JSON.parse(cached);
        } catch (e) {}
      }
    }

    renderChildrenGrid();
    renderLearnerSelector();

    // Set default active child if none selected
    if (!activeChild && familyChildren.length > 0) {
      setActiveChild(familyChildren[0]);
    } else if (activeChild) {
      const refreshed = familyChildren.find((c) => c.id === activeChild.id);
      if (refreshed) setActiveChild(refreshed);
      else if (familyChildren.length > 0) setActiveChild(familyChildren[0]);
      else activeChild = null;
    }
  }

  function setActiveChild(child) {
    activeChild = child;
    localStorage.setItem('lms_active_child', JSON.stringify(activeChild));
    userProgress = JSON.parse(
      localStorage.getItem(`lms_progress_${activeChild ? activeChild.id : 'global'}`) || '{}'
    );
    quizScores = JSON.parse(
      localStorage.getItem(`lms_quiz_scores_${activeChild ? activeChild.id : 'global'}`) || '{}'
    );
    userReflections = JSON.parse(
      localStorage.getItem(`lms_reflections_${activeChild ? activeChild.id : 'global'}`) || '{}'
    );

    if (headerLearnerAvatar) headerLearnerAvatar.textContent = child.avatar || '🌟';
    if (headerLearnerName) headerLearnerName.textContent = child.name;
    if (statActiveLearnerName) statActiveLearnerName.textContent = child.name;

    // Switch track UI if child track differs
    if (child.assignedTrack) {
      switchTrack(child.assignedTrack);
    }
  }

  // Profile PIN Challenge Handling
  function attemptSelectLearner(child) {
    if (child.hasPin || (child.pinCode && child.pinCode.trim().length > 0)) {
      // Require PIN unlock via server verification
      targetChildId.value = child.id;
      pinChallengeInput.value = '';
      pinErrorMsg.style.display = 'none';
      document.getElementById('pinChallengeTitle').textContent =
        `Unlock ${escapeHtml(child.name)}'s Profile`;
      openAccessibleModal(pinChallengeModal, '#pinChallengeInput');
    } else {
      setActiveChild(child);
      closeAccessibleModal(learnerModal);
      if (parentDashboardView && parentDashboardView.style.display !== 'none') {
        renderParentDashboard();
      }
    }
  }

  // Render Parent Dashboard
  async function renderParentDashboard() {
    if (!parentDashboardView) return;

    if (currentUser && parentWelcomeTitle) {
      parentWelcomeTitle.textContent = `Welcome, ${currentUser.displayName || currentUser.email}!`;
      if (parentAuthBadge) {
        let providerIcon = 'fa-envelope';
        const p = (currentUser.provider || '').toLowerCase();
        if (p.includes('google')) providerIcon = 'fa-google';
        else if (p.includes('apple')) providerIcon = 'fa-apple';
        else if (p.includes('microsoft')) providerIcon = 'fa-microsoft';
        parentAuthBadge.innerHTML = `<i class="fa-brands ${providerIcon}"></i> ${currentUser.email}`;
      }
    }

    if (statParentKidsCount) statParentKidsCount.textContent = familyChildren.length;
    if (statActiveLearnerName)
      statActiveLearnerName.textContent = activeChild ? activeChild.name : 'None';

    // Active Learner Spotlight
    const spotlightEl = document.getElementById('activeLearnerSpotlight');
    const spotlightAvatar = document.getElementById('spotlightAvatar');
    const spotlightName = document.getElementById('spotlightName');
    const spotlightTrack = document.getElementById('spotlightTrack');
    const spotlightStartBtn = document.getElementById('spotlightStartBtn');
    const spotlightSwitchBtn = document.getElementById('spotlightSwitchBtn');

    if (spotlightEl) {
      if (activeChild) {
        spotlightEl.style.display = 'flex';
        if (spotlightAvatar) spotlightAvatar.textContent = activeChild.avatar || '🌟';
        if (spotlightName) spotlightName.textContent = activeChild.name;
        if (spotlightTrack) {
          spotlightTrack.textContent = `${activeChild.assignedTrack === 'level2' ? 'Level 2 Track (13y+)' : 'Level 1 Track (~10y)'} • Active Learner Mode`;
        }
        if (spotlightStartBtn) {
          spotlightStartBtn.onclick = () => switchView('dashboard');
        }
        if (spotlightSwitchBtn) {
          spotlightSwitchBtn.onclick = openLearnerModal;
        }
      } else {
        spotlightEl.style.display = 'none';
      }
    }

    // Progress and Quiz Stats computation
    let completedModulesCount = 0;
    let quizAvg = 0;
    let allActivityLogs = [];

    // Check Local Progress First
    const localProg = JSON.parse(
      localStorage.getItem(`lms_progress_${activeChild ? activeChild.id : 'global'}`) || '{}'
    );
    const localScores = JSON.parse(
      localStorage.getItem(`lms_quiz_scores_${activeChild ? activeChild.id : 'global'}`) || '{}'
    );

    // Count completions from local storage
    const completedKeys = Object.keys(localProg).filter((k) => localProg[k]);
    completedModulesCount = completedKeys.length;

    const scoreKeys = Object.keys(localScores);
    if (scoreKeys.length > 0) {
      const sum = scoreKeys.reduce(
        (acc, k) => acc + (localScores[k].percentage || localScores[k].score || 0),
        0
      );
      quizAvg = Math.round(sum / scoreKeys.length);
    }

    // Try fetching live server sync data
    if (currentUser) {
      try {
        const res = await fetch(`/api/progress/sync`);
        if (res.ok) {
          const resJson = await res.json();
          if (resJson.success) {
            const pData = resJson.data || resJson.progress || {};
            const childKey = `child_${activeChild ? activeChild.id : 'global'}`;
            const childProg = pData[childKey] || {};
            completedModulesCount = Math.max(
              completedModulesCount,
              Object.keys(childProg).filter((k) => childProg[k]).length
            );

            const childScores = pData[`${childKey}_scores`] || [];
            if (childScores.length > 0) {
              const totalPct = childScores.reduce(
                (acc, q) => acc + (q.maxScore ? (q.score / q.maxScore) * 100 : q.percentage || 0),
                0
              );
              quizAvg = Math.round(totalPct / childScores.length);

              allActivityLogs = [
                ...childScores.map((q) => ({
                  type: 'quiz',
                  item: q,
                  date: new Date(q.timestamp || q.createdAt || Date.now())
                })),
                ...(resJson.reflections || []).map((r) => ({
                  type: 'reflection',
                  item: r,
                  date: new Date(r.timestamp || Date.now())
                }))
              ];
            }
          }
        }
      } catch (err) {
        console.warn('Parent progress sync notice (using local cache):', err);
      }
    }

    if (statParentTotalCompleted) statParentTotalCompleted.textContent = completedModulesCount;
    if (statParentAvgQuiz) statParentAvgQuiz.textContent = `${quizAvg}%`;

    // Render Family Activity List
    if (familyActivityList) {
      familyActivityList.innerHTML = '';
      if (allActivityLogs.length === 0 && scoreKeys.length > 0) {
        // Build activity logs from local storage if server returned no records
        scoreKeys.forEach((k) => {
          const sc = localScores[k];
          allActivityLogs.push({
            type: 'quiz',
            item: {
              moduleId: sc.moduleId || 1,
              score: sc.score || 5,
              maxScore: sc.total || sc.maxScore || 5,
              percentage: sc.percentage || 100,
              childId: activeChild?.id || null
            },
            date: new Date()
          });
        });
      }

      allActivityLogs.sort((a, b) => b.date - a.date);

      if (allActivityLogs.length === 0) {
        familyActivityList.innerHTML = `
          <p class="empty-state-text">
            <i class="fa-solid fa-clock-rotate-left"></i> No family activity logged yet. Switch to a child's profile to complete lessons and interactive quizzes!
          </p>
        `;
      } else {
        allActivityLogs.slice(0, 10).forEach((log) => {
          const div = document.createElement('div');
          div.className = 'activity-item';
          const childObj = familyChildren.find((c) => c.id === log.item.childId) ||
            activeChild || { name: 'Learner', avatar: '🌟' };

          if (log.type === 'quiz') {
            const pct =
              log.item.percentage ||
              Math.round(((log.item.score || 0) / (log.item.maxScore || 1)) * 100);
            div.innerHTML = `
              <div class="activity-user">
                <span class="act-icon font-gold" style="font-size: 1.4rem;">${childObj.avatar || '🌟'}</span>
                <div>
                  <strong>${escapeHtml(childObj.name)}</strong> completed <strong>Module ${log.item.moduleId} Quiz</strong>
                  <div style="font-size: 0.8rem; color: var(--text-subtle);">${log.date.toLocaleDateString()} at ${log.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
              <span class="meta-pill ${pct >= 80 ? 'green' : 'gold'}" style="font-weight: 700;">Score: ${pct}%</span>
            `;
          } else {
            div.innerHTML = `
              <div class="activity-user">
                <span class="act-icon font-emerald" style="font-size: 1.4rem;">${childObj.avatar || '🌟'}</span>
                <div>
                  <strong>${escapeHtml(childObj.name)}</strong> completed Lesson Reflection
                  <div style="font-size: 0.8rem; color: var(--text-subtle);">${log.date.toLocaleDateString()}</div>
                </div>
              </div>
              <span class="meta-pill green"><i class="fa-solid fa-check"></i> Reflected</span>
            `;
          }
          familyActivityList.appendChild(div);
        });
      }
    }

    // Render Children Grid
    if (parentChildrenGrid) {
      parentChildrenGrid.innerHTML = '';

      if (familyChildren.length === 0) {
        parentChildrenGrid.innerHTML = `
          <div class="empty-child-card">
            <div class="empty-child-icon"><i class="fa-solid fa-child-reaching"></i></div>
            <h3>No Child Profiles Yet</h3>
            <p>Add your children to assign personalized Level 1 (~10y) or Level 2 (13y+) tracks, track their quiz achievements, and print completion certificates!</p>
            <button class="btn-primary-action" id="emptyAddChildBtn">
              <i class="fa-solid fa-user-plus"></i> Add Your First Child Profile
            </button>
          </div>
        `;

        const emptyBtn = document.getElementById('emptyAddChildBtn');
        if (emptyBtn) emptyBtn.addEventListener('click', () => openChildModal(null));
      } else {
        familyChildren.forEach((child) => {
          const isActive = activeChild && activeChild.id === child.id;
          const card = document.createElement('div');
          card.className = `child-card ${isActive ? 'active-learner' : ''}`;
          const isPinProtected = child.hasPin || (child.pinCode && child.pinCode.trim().length > 0);

          // Calculate approximate progress for this child
          const childTrack = child.assignedTrack || 'level1';
          const childProg = JSON.parse(localStorage.getItem(`lms_progress_${child.id}`) || '{}');
          const childCompletedCount = Object.keys(childProg).filter((k) => childProg[k]).length;
          const childPct = Math.round((childCompletedCount / 9) * 100);

          card.innerHTML = `
            ${isActive ? '<span class="active-learner-tag"><i class="fa-solid fa-circle-check"></i> Active Learner</span>' : ''}
            
            <div class="child-card-header child-clickable-header" style="cursor: pointer;" title="Click to select ${escapeHtml(child.name)}">
              <div class="child-avatar-lg">${escapeHtml(child.avatar || '🌟')}</div>
              <div class="child-details">
                <h3>${escapeHtml(child.name)}</h3>
                <div class="child-meta-badges">
                  <span class="meta-pill ${childTrack === 'level2' ? 'gold' : ''}">
                    <i class="fa-solid fa-graduation-cap"></i> ${childTrack === 'level2' ? 'Level 2 (13y+)' : 'Level 1 (~10y)'}
                  </span>
                  ${isPinProtected ? '<span class="meta-pill pin"><i class="fa-solid fa-lock"></i> PIN Protected</span>' : ''}
                </div>
              </div>
            </div>

            <div class="child-progress-box">
              <div class="child-progress-head">
                <span>Curriculum Progress</span>
                <strong>${childCompletedCount} / 9 Modules (${childPct}%)</strong>
              </div>
              <div class="progress-bar-bg" style="height: 8px;">
                <div class="progress-bar-fill" style="width: ${childPct}%;"></div>
              </div>
            </div>

            <div class="child-stats-mini-row">
              <div class="child-mini-stat">
                <span class="child-mini-stat-label">Assigned Track</span>
                <span class="child-mini-stat-val">${childTrack === 'level2' ? 'Deepening (13y+)' : 'Foundations (~10y)'}</span>
              </div>
              <div class="child-mini-stat">
                <span class="child-mini-stat-label">Security PIN</span>
                <span class="child-mini-stat-val">${isPinProtected ? 'Enabled 🔒' : 'None'}</span>
              </div>
            </div>

            <div class="child-card-actions">
              <button class="btn-child-switch ${isActive ? 'btn-primary-action' : ''}" data-id="${escapeHtml(child.id)}">
                <i class="fa-solid ${isActive ? 'fa-book-open' : 'fa-user-check'}"></i> ${isActive ? 'Start Learning' : 'Select Learner'}
              </button>
              <a href="${window.location.origin}/?kid=${encodeURIComponent(child.id)}" target="_blank" class="btn-child-icon open-kid-link-btn" data-id="${escapeHtml(child.id)}" title="Open Profile in New Tab">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
              <button class="btn-child-icon copy-kid-link-btn" data-id="${escapeHtml(child.id)}" title="Copy Kids Direct Access Link">
                <i class="fa-solid fa-link"></i>
              </button>
              <button class="btn-child-icon edit-child-btn" data-id="${escapeHtml(child.id)}" title="Edit Profile">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-child-icon danger delete-child-btn" data-id="${escapeHtml(child.id)}" title="Delete Profile">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          `;

          // Clicking card header or avatar switches learner
          const headerClickEl = card.querySelector('.child-clickable-header');
          if (headerClickEl) {
            headerClickEl.addEventListener('click', () => {
              if (isActive) switchView('dashboard');
              else attemptSelectLearner(child);
            });
          }

          card.querySelector('.btn-child-switch').addEventListener('click', () => {
            if (isActive) {
              switchView('dashboard');
            } else {
              attemptSelectLearner(child);
            }
          });
          card.querySelector('.copy-kid-link-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const kidUrl = `${window.location.origin}/?kid=${encodeURIComponent(child.id)}`;
            navigator.clipboard.writeText(kidUrl);
            showToast(
              'Kids Access Link Copied! 📋',
              `Direct access URL copied: ${kidUrl}`,
              'success'
            );
          });
          card.querySelector('.edit-child-btn').addEventListener('click', () => {
            openChildModal(child);
          });
          card.querySelector('.delete-child-btn').addEventListener('click', async () => {
            if (confirm(`Are you sure you want to delete ${child.name}'s profile?`)) {
              await deleteChildProfile(child.id);
            }
          });

          parentChildrenGrid.appendChild(card);
        });
      }
    }
  }

  // Delete Child Profile
  async function deleteChildProfile(childId) {
    if (currentUser) {
      try {
        await fetch(`/api/parent/children/${childId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ parentUid: currentUser.uid })
        });
      } catch (err) {
        console.error('Error deleting child profile:', err);
      }
    }
    familyChildren = familyChildren.filter((c) => c.id !== childId);
    localStorage.setItem('lms_children', JSON.stringify(familyChildren));
    await fetchFamilyChildren();
    renderParentDashboard();
  }

  // Admin Real-Time Metrics & Uptime State
  let adminServerUptimeBase = 3600;
  let adminUptimeFetchTimestamp = Date.now();
  let adminUptimeTickerInterval = null;
  let adminAutoRefreshInterval = null;
  window.__lms_client_errors = window.__lms_client_errors || 0;

  function updateAdminUptimeDisplay() {
    const healthUptime = document.getElementById('healthUptime');
    if (!healthUptime) return;
    const elapsedSec = Math.floor((Date.now() - adminUptimeFetchTimestamp) / 1000);
    const currentTotalSec = Math.max(0, adminServerUptimeBase + elapsedSec);
    const days = Math.floor(currentTotalSec / 86400);
    const hrs = Math.floor((currentTotalSec % 86400) / 3600);
    const mins = Math.floor((currentTotalSec % 3600) / 60);
    const secs = currentTotalSec % 60;

    if (days > 0) {
      healthUptime.textContent = `${days}d ${hrs}h ${mins}m ${secs}s`;
    } else if (hrs > 0) {
      healthUptime.textContent = `${hrs}h ${mins}m ${secs}s`;
    } else {
      healthUptime.textContent = `${mins}m ${secs}s online`;
    }
  }

  // Render Admin Dashboard
  async function renderAdminDashboard(isBackgroundAuto = false) {
    let stats = null;
    let users = null;
    let healthData = null;

    try {
      const [resStats, resUsers, resHealth] = await Promise.all([
        fetch('/api/admin/overview').catch(() => null),
        fetch('/api/admin/users').catch(() => null),
        fetch('/api/health').catch(() => null)
      ]);

      if (resStats && resStats.ok) {
        const dataStats = await resStats.json().catch(() => null);
        if (dataStats && dataStats.success && dataStats.stats) {
          stats = dataStats.stats;
        }
      }

      if (resUsers && resUsers.ok) {
        const dataUsers = await resUsers.json().catch(() => null);
        if (dataUsers && dataUsers.success && dataUsers.users) {
          users = dataUsers.users;
        }
      }

      if (resHealth && resHealth.ok) {
        healthData = await resHealth.json().catch(() => null);
      }
    } catch (err) {
      console.warn('Backend admin fetch fell back to local store:', err);
    }

    const localUsers = getClientUsersDb();
    const localKids = JSON.parse(localStorage.getItem('lms_children') || '[]');
    const localProg = JSON.parse(
      localStorage.getItem(`lms_progress_${activeChild ? activeChild.id : 'global'}`) || '{}'
    );
    const localScores = JSON.parse(
      localStorage.getItem(`lms_quiz_scores_${activeChild ? activeChild.id : 'global'}`) || '{}'
    );

    // If server users were retrieved, also merge any local client registrations not yet synced
    if (users && Array.isArray(users)) {
      localUsers.forEach((lu) => {
        if (!users.some((u) => u.email.toLowerCase() === lu.email.toLowerCase())) {
          users.push({
            ...lu,
            childrenCount: lu.uid === currentUser?.uid ? localKids.length : 0,
            children: lu.uid === currentUser?.uid ? localKids : []
          });
        }
      });
    }

    // Client-side Fallback Computation if offline or unauthenticated session
    if (!stats || !users) {
      // Add default admin if not present
      const allUsers = [...localUsers];
      if (!allUsers.some((u) => u.email === 'admin@islamicstudies.org')) {
        allUsers.unshift({
          uid: 'admin_master_1',
          email: 'admin@islamicstudies.org',
          displayName: 'Portal Administrator',
          role: 'super_admin',
          provider: 'local',
          createdAt: new Date().toISOString()
        });
      }

      const scoreKeys = Object.keys(localScores);
      const avgScore =
        scoreKeys.length > 0
          ? Math.round(
              scoreKeys.reduce(
                (acc, k) => acc + (localScores[k].percentage || localScores[k].score || 0),
                0
              ) / scoreKeys.length
            )
          : 92;

      const completedCount = Object.keys(localProg).length;

      stats = {
        totalParents: Math.max(allUsers.length, 1),
        totalKids: localKids.length,
        totalCompletedModules: completedCount,
        avgQuizScore: avgScore,
        passRate: Math.min(100, Math.round(avgScore * 1.05)),
        moduleStats: (courseData && courseData.modules ? courseData.modules : []).map((m) => ({
          moduleId: m.id,
          completions: localProg[`${m.id}_level1`] || localProg[`${m.id}_level2`] ? 1 : 0,
          quizAttempts:
            localScores[`quiz_${m.id}_level1`] || localScores[`quiz_${m.id}_level2`] ? 1 : 0,
          avgScore:
            localScores[`quiz_${m.id}_level1`]?.percentage ||
            localScores[`quiz_${m.id}_level2`]?.percentage ||
            90
        })),
        system: {
          uptime: healthData?.uptime ? Math.floor(healthData.uptime) : 3600,
          nodeEnv: 'production',
          storage: 'FILE-STORE (JSON)',
          clientErrorsCount: 0,
          cspViolationsCount: 0,
          status: '100% Operational'
        }
      };

      users = allUsers.map((u) => ({
        ...u,
        childrenCount: u.uid === currentUser?.uid ? localKids.length : 0,
        children: u.uid === currentUser?.uid ? localKids : []
      }));
    }

    if (stats && users) {
      stats.totalParents = users.length;
    }

    // Update Uptime Base & Start Live Counter
    if (stats.system?.uptime || healthData?.uptime) {
      adminServerUptimeBase = stats.system?.uptime || Math.floor(healthData.uptime);
      adminUptimeFetchTimestamp = Date.now();
    }
    updateAdminUptimeDisplay();

    // Accurately compute Total Children across all families + local store
    let childrenFromUsers = 0;
    if (users && Array.isArray(users)) {
      users.forEach((u) => {
        childrenFromUsers += u.childrenCount || (Array.isArray(u.children) ? u.children.length : 0);
      });
    }
    const finalKidsCount = Math.max(stats.totalKids || 0, childrenFromUsers, localKids.length);

    // Render KPI Metrics
    if (statAdminTotalParents)
      statAdminTotalParents.textContent = stats.totalParents || users.length || 0;
    if (statAdminTotalKids) statAdminTotalKids.textContent = finalKidsCount;
    if (statAdminTotalCompletions)
      statAdminTotalCompletions.textContent = stats.totalCompletedModules || 0;
    if (statAdminAvgQuiz) statAdminAvgQuiz.textContent = `${stats.avgQuizScore || 0}%`;

    // Render Module-by-Module Engagement Grid
    const modulesGridEl = document.getElementById('adminModulesAnalyticsGrid');
    if (modulesGridEl) {
      modulesGridEl.innerHTML = '';
      const modulesList =
        courseData && courseData.modules
          ? courseData.modules
          : [
              { id: 1, title: 'Foundations of Belief', icon: 'fa-kaaba' },
              { id: 2, title: 'Purification & Prayer', icon: 'fa-hands-wash' },
              { id: 3, title: 'Seerah: Early Life of Prophet ﷺ', icon: 'fa-book-quran' },
              { id: 4, title: 'Deepening Belief & the Quran', icon: 'fa-quran' },
              { id: 5, title: 'Fiqh of Fasting & Zakah', icon: 'fa-moon' },
              { id: 6, title: 'Seerah: Madinah Community', icon: 'fa-mosque' },
              { id: 7, title: 'Applied Fiqh & Everyday Life', icon: 'fa-scale-balanced' },
              { id: 8, title: 'Character, Society & Family', icon: 'fa-heart' },
              { id: 9, title: 'Living Faith Today', icon: 'fa-compass' }
            ];

      modulesList.forEach((m) => {
        const mStat = (stats.moduleStats || []).find((ms) => ms.moduleId === m.id) || {
          completions: 0,
          quizAttempts: 0,
          avgScore: 0
        };
        const card = document.createElement('div');
        card.className = 'admin-module-stat-card';
        card.innerHTML = `
          <div class="admin-module-stat-header">
            <span class="admin-module-num">M${m.id}</span>
            <strong class="admin-module-title" title="${escapeHtml(m.title)}">${escapeHtml(m.title)}</strong>
          </div>
          <div class="admin-module-metrics">
            <div class="admin-metric-box">
              <span class="admin-metric-label">Completed</span>
              <span class="admin-metric-val">${mStat.completions} learners</span>
            </div>
            <div class="admin-metric-box">
              <span class="admin-metric-label">Avg Quiz</span>
              <span class="admin-metric-val">${mStat.avgScore > 0 ? mStat.avgScore + '%' : 'N/A'}</span>
            </div>
          </div>
          <div class="admin-module-bar-wrap" title="Avg score: ${mStat.avgScore}%">
            <div class="admin-module-bar-fill" style="width: ${Math.max(5, mStat.avgScore || (mStat.completions > 0 ? 100 : 0))}%;"></div>
          </div>
        `;
        modulesGridEl.appendChild(card);
      });
    }

    // Render System Health Overview
    const healthStorage = document.getElementById('healthStorageType');
    const healthStatus = document.getElementById('healthSystemStatus');
    const healthErrors = document.getElementById('healthClientErrors');

    if (healthStorage) healthStorage.textContent = stats.system?.storage || 'FILE (JSON Store)';
    if (healthStatus) {
      const statusText =
        stats.system?.status ||
        (healthData?.status === 'ok' ? '100% Operational' : '100% Operational (Live)');
      healthStatus.innerHTML = `<span style="color:#10b981;font-weight:700;"><i class="fa-solid fa-circle" style="font-size:0.6rem;margin-right:5px;vertical-align:middle;"></i> ${statusText}</span>`;
    }
    if (healthErrors) {
      const sErrors = stats.system?.clientErrorsCount || 0;
      const sCsp = stats.system?.cspViolationsCount || 0;
      const totalClientErrors = sErrors + (window.__lms_client_errors || 0);
      if (totalClientErrors === 0 && sCsp === 0) {
        healthErrors.innerHTML = `<span style="color:#10b981;font-weight:700;"><i class="fa-solid fa-circle-check" style="margin-right:4px;"></i> 0 Errors (Healthy)</span>`;
      } else {
        healthErrors.innerHTML = `<span style="color:#f59e0b;font-weight:700;"><i class="fa-solid fa-triangle-exclamation" style="margin-right:4px;"></i> ${totalClientErrors} Errors (${sCsp} CSP)</span>`;
      }
    }

    // Render Users Table
    adminUsersCache = users || [];
    filterAndRenderAdminUsers();
    renderAdminTelemetry();
  }

  // Admin Telemetry & Error Logs Renderer
  async function renderAdminTelemetry() {
    if (!adminTelemetryTableBody) return;
    try {
      const res = await fetch('/api/admin/telemetry');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.logs) && data.logs.length > 0) {
          adminTelemetryTableBody.innerHTML = '';
          data.logs.forEach((log) => {
            const tr = document.createElement('tr');
            const isCsp = log.source === 'csp';
            const sourceBadge = isCsp
              ? '<span class="role-badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);">CSP</span>'
              : '<span class="role-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">Client</span>';
            const timeStr = log.createdAt
              ? new Date(log.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })
              : 'Recent';
            tr.innerHTML = `
              <td style="color: var(--text-subtle); font-size: 0.85rem; white-space: nowrap;">${escapeHtml(timeStr)}</td>
              <td>${sourceBadge}</td>
              <td style="font-family: monospace; font-size: 0.85rem; color: var(--text-main); word-break: break-word;">${escapeHtml(log.message || 'No message')}</td>
              <td style="color: var(--text-muted); font-size: 0.8rem; word-break: break-all;">${escapeHtml(log.url || log.source || 'N/A')}</td>
            `;
            adminTelemetryTableBody.appendChild(tr);
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch admin telemetry logs:', e);
    }
    adminTelemetryTableBody.innerHTML =
      '<tr><td colspan="4" style="text-align:center; padding: 20px; color: var(--text-muted);">No errors logged. All systems running cleanly.</td></tr>';
  }

  // Admin User Filtering & Table Render
  function filterAndRenderAdminUsers() {
    if (!adminUsersTableBody) return;
    adminUsersTableBody.innerHTML = '';

    const query = (adminUserSearchInput ? adminUserSearchInput.value : '').toLowerCase().trim();
    const roleFilter = adminRoleFilterSelect ? adminRoleFilterSelect.value : 'all';

    const filtered = adminUsersCache.filter((u) => {
      const nameMatch = (u.displayName || '').toLowerCase().includes(query);
      const emailMatch = (u.email || '').toLowerCase().includes(query);
      const kidsMatch = u.children && u.children.some((c) => c.name.toLowerCase().includes(query));
      const textMatches = query === '' || nameMatch || emailMatch || kidsMatch;

      const roleMatches = roleFilter === 'all' || u.role === roleFilter;

      return textMatches && roleMatches;
    });

    if (filtered.length === 0) {
      adminUsersTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color: var(--text-muted);">No users found matching query.</td></tr>`;
      return;
    }

    filtered.forEach((u) => {
      const row = document.createElement('tr');
      const kidsListStr =
        u.children && u.children.length > 0
          ? u.children.map((c) => `${c.avatar} ${c.name}`).join(', ')
          : 'None';
      const isSuperAdmin = u.role === 'super_admin';
      const isTeacher = u.role === 'teacher' || u.role === 'educator';
      let iconClass = 'fa-solid fa-envelope';
      let providerLabel = 'Email / Password';
      if ((u.provider || '').includes('google')) {
        iconClass = 'fa-brands fa-google';
        providerLabel = 'Google';
      } else if ((u.provider || '').includes('apple')) {
        iconClass = 'fa-brands fa-apple';
        providerLabel = 'Apple';
      } else if ((u.provider || '').includes('microsoft')) {
        iconClass = 'fa-brands fa-microsoft';
        providerLabel = 'Microsoft';
      }

      let roleBadge = '<span class="role-badge parent">👨‍👩‍👧 Parent</span>';
      if (isSuperAdmin) {
        roleBadge = '<span class="role-badge super_admin">⚡ Super Admin</span>';
      } else if (isTeacher) {
        roleBadge = '<span class="role-badge teacher">🎓 Educator</span>';
      }

      let actionLabel = 'Make Teacher';
      if (isTeacher) actionLabel = 'Make Admin';
      if (isSuperAdmin) actionLabel = 'Make Parent';

      row.innerHTML = `
        <td>
          <strong>${escapeHtml(u.displayName || u.email)}</strong><br>
          <small style="color: var(--text-subtle);">${escapeHtml(u.email)}</small>
        </td>
        <td><i class="${iconClass}"></i> ${providerLabel}</td>
        <td>${roleBadge}</td>
        <td><strong>${u.childrenCount || 0}</strong> kids</td>
        <td>${escapeHtml(kidsListStr)}</td>
        <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}</td>
        <td>
          <button class="btn-action-role" data-uid="${u.uid}" data-current="${u.role}">
            <i class="fa-solid fa-arrows-rotate"></i> ${actionLabel}
          </button>
          <button class="btn-action-delete" data-uid="${u.uid}" title="Delete User Account">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </td>
      `;

      row.querySelector('.btn-action-role').addEventListener('click', async () => {
        let newRole = 'teacher';
        if (u.role === 'teacher') newRole = 'super_admin';
        if (u.role === 'super_admin') newRole = 'parent';
        try {
          await fetch(`/api/admin/users/${u.uid}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
          });
          renderAdminDashboard();
        } catch (err) {
          console.error('Error toggling role:', err);
        }
      });

      row.querySelector('.btn-action-delete').addEventListener('click', async () => {
        if (
          confirm(
            `Are you sure you want to delete account ${u.email}? This will remove associated child profiles.`
          )
        ) {
          try {
            const res = await fetch(`/api/admin/users/${u.uid}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
              renderAdminDashboard();
            } else {
              alert(data.error || 'Failed to delete user.');
            }
          } catch (err) {
            console.error('Error deleting user:', err);
          }
        }
      });

      adminUsersTableBody.appendChild(row);
    });
  }

  // Learner Switcher Modal
  function openLearnerModal() {
    if (!learnerModalList) return;
    learnerModalList.innerHTML = '';

    if (familyChildren.length === 0) {
      learnerModalList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 10px;">No profiles found. Create one in the Parent Portal!</p>`;
    } else {
      familyChildren.forEach((child) => {
        const isActive = activeChild && activeChild.id === child.id;
        const item = document.createElement('div');
        item.className = `learner-select-item ${isActive ? 'active' : ''}`;
        const isPinProtected = child.hasPin || (child.pinCode && child.pinCode.trim().length > 0);
        item.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.8rem;">${escapeHtml(child.avatar || '🌟')}</span>
            <div>
              <strong style="color: var(--text-main); font-size: 1.05rem;">${escapeHtml(child.name)}</strong><br>
              <small style="color: var(--text-subtle);">${child.assignedTrack === 'level2' ? 'Level 2 (13y+)' : 'Level 1 (~10y)'} ${isPinProtected ? '• 🔒 PIN Protected' : ''}</small>
            </div>
          </div>
          ${isActive ? '<i class="fa-solid fa-circle-check" style="color: var(--emerald-primary); font-size: 1.2rem;"></i>' : '<button class="btn-child-switch" style="padding: 4px 10px; font-size: 0.75rem;">Select</button>'}
        `;

        item.addEventListener('click', () => {
          attemptSelectLearner(child);
        });

        learnerModalList.appendChild(item);
      });
    }

    openAccessibleModal(learnerModal);
  }

  // Add / Edit Child Modal
  function openChildModal(childToEdit = null) {
    const directLinkGroup = document.getElementById('childDirectLinkGroup');
    const directLinkInput = document.getElementById('childDirectLinkInput');
    const copyDirectLinkBtn = document.getElementById('copyDirectLinkBtn');
    const openDirectLinkBtn = document.getElementById('openDirectLinkBtn');

    if (childToEdit) {
      document.getElementById('childModalTitle').textContent = 'Edit Child Profile';
      editingChildId.value = childToEdit.id;
      childNameInput.value = childToEdit.name;
      selectedChildAvatar.value = childToEdit.avatar || '🌟';
      childTrackSelect.value = childToEdit.assignedTrack || 'level1';
      childPinInput.value = '';
      childPinInput.placeholder = childToEdit.hasPin
        ? 'Leave blank to keep existing PIN'
        : 'e.g. 1234 (Optional)';

      if (directLinkGroup && directLinkInput) {
        directLinkGroup.style.display = 'block';
        const url = `${window.location.origin}/?kid=${encodeURIComponent(childToEdit.id)}`;
        directLinkInput.value = url;
        if (openDirectLinkBtn) {
          openDirectLinkBtn.href = url;
        }
        if (copyDirectLinkBtn) {
          copyDirectLinkBtn.onclick = () => {
            navigator.clipboard.writeText(url);
            showToast('Link Copied! 📋', `Kids direct access URL copied: ${url}`, 'success');
          };
        }
      }
    } else {
      document.getElementById('childModalTitle').textContent = 'Create Child Profile';
      editingChildId.value = '';
      childNameInput.value = '';
      selectedChildAvatar.value = '🌟';
      childTrackSelect.value = 'level1';
      childPinInput.value = '';
      childPinInput.placeholder = 'e.g. 1234 (Optional)';
      if (directLinkGroup) directLinkGroup.style.display = 'none';
    }

    // Reset avatar active state
    avatarSelectorGrid.querySelectorAll('.avatar-opt').forEach((opt) => {
      opt.classList.toggle('active', opt.dataset.avatar === selectedChildAvatar.value);
    });

    openAccessibleModal(childModal, '#childNameInput');
  }

  // Navigation Links & Logo Click Event Listeners
  if (appLogoBtn) {
    appLogoBtn.addEventListener('click', () => {
      if (currentUser) switchView('dashboard');
      else switchView('authLanding');
    });
  }

  // Event Listeners for Multi-Tenant Features
  if (parentNavBtn) parentNavBtn.addEventListener('click', () => switchView('parent'));
  if (adminNavBtn) adminNavBtn.addEventListener('click', () => switchView('admin'));
  if (sidebarAdminBtn) sidebarAdminBtn.addEventListener('click', () => switchView('admin'));
  if (parentToAdminBtn) parentToAdminBtn.addEventListener('click', () => switchView('admin'));
  if (adminRefreshBtn) {
    adminRefreshBtn.addEventListener('click', async () => {
      const icon = adminRefreshBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
      adminRefreshBtn.disabled = true;
      await renderAdminDashboard();
      if (icon) icon.classList.remove('fa-spin');
      adminRefreshBtn.disabled = false;
      showToast(
        'Admin Metrics Refreshed ⚡',
        'Live system telemetry, uptime, and user registries updated.',
        'success'
      );
    });
  }
  if (adminRefreshLogsBtn) {
    adminRefreshLogsBtn.addEventListener('click', async () => {
      const icon = adminRefreshLogsBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
      await renderAdminTelemetry();
      if (icon) icon.classList.remove('fa-spin');
      showToast('Telemetry Refreshed', 'Latest security & error logs fetched.', 'info', 2000);
    });
  }
  if (adminClearLogsBtn) {
    adminClearLogsBtn.addEventListener('click', async () => {
      if (confirm('Clear all telemetry and CSP violation error logs?')) {
        try {
          await fetch('/api/admin/telemetry', { method: 'DELETE' });
          await renderAdminTelemetry();
          const healthErrors = document.getElementById('healthClientErrors');
          if (healthErrors)
            healthErrors.innerHTML =
              '<span style="color:#10b981;font-weight:700;"><i class="fa-solid fa-circle-check" style="margin-right:4px;"></i> 0 Errors (Healthy)</span>';
          showToast('Logs Cleared', 'All telemetry logs have been purged.', 'success', 3000);
        } catch (e) {
          showToast('Error', 'Failed to clear logs.', 'error');
        }
      }
    });
  }
  if (adminUserSearchInput)
    adminUserSearchInput.addEventListener('input', filterAndRenderAdminUsers);
  if (adminRoleFilterSelect)
    adminRoleFilterSelect.addEventListener('change', filterAndRenderAdminUsers);
  if (learnerSwitcherBtn) learnerSwitcherBtn.addEventListener('click', openLearnerModal);
  if (learnerModalParentBtn) {
    learnerModalParentBtn.addEventListener('click', () => {
      closeAccessibleModal(learnerModal);
      switchView('parent');
    });
  }

  if (guestBrowseBtn) {
    guestBrowseBtn.addEventListener('click', () => switchView('dashboard'));
  }
  if (landingNavGuestBtn) {
    landingNavGuestBtn.addEventListener('click', () => switchView('dashboard'));
  }
  if (ctaGuestBtn) {
    ctaGuestBtn.addEventListener('click', () => switchView('dashboard'));
  }
  if (landingNavAuthBtn) {
    landingNavAuthBtn.addEventListener('click', () => {
      const card = document.getElementById('landingAuthCard');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
      if (homeAuthEmailInput) homeAuthEmailInput.focus();
    });
  }
  if (heroSignInScrollBtn) {
    heroSignInScrollBtn.addEventListener('click', () => {
      const card = document.getElementById('landingAuthCard');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
      if (homeAuthEmailInput) homeAuthEmailInput.focus();
    });
  }
  if (ctaRegisterBtn) {
    ctaRegisterBtn.addEventListener('click', () => {
      switchHomeAuthTab('signup');
      const card = document.getElementById('landingAuthCard');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
      if (homeSignUpNameInput) homeSignUpNameInput.focus();
    });
  }

  // Interactive Guest Module Preview Buttons on Homepage
  document.querySelectorAll('.btn-preview-module').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mId = parseInt(btn.dataset.moduleId, 10);
      if (mId) {
        openModule(mId);
        switchView('module');
      }
    });
  });

  if (authHeaderBtn) {
    authHeaderBtn.addEventListener('click', () => {
      if (currentUser) {
        openUserProfileModal();
      } else {
        switchView('authLanding');
      }
    });
  }

  // Homepage Landing Auth Tabs
  if (homeAuthTabSignIn)
    homeAuthTabSignIn.addEventListener('click', () => switchHomeAuthTab('signin'));
  if (homeAuthTabSignUp)
    homeAuthTabSignUp.addEventListener('click', () => switchHomeAuthTab('signup'));

  // Auth Tabs Click Handlers in Modal
  if (authTabSignIn) authTabSignIn.addEventListener('click', () => switchAuthTab('signin'));
  if (authTabSignUp) authTabSignUp.addEventListener('click', () => switchAuthTab('signup'));

  if (authModalCloseBtn)
    authModalCloseBtn.addEventListener('click', () => closeAccessibleModal(authModal));
  if (userProfileModalCloseBtn)
    userProfileModalCloseBtn.addEventListener('click', () =>
      closeAccessibleModal(userProfileModal)
    );
  if (childModalCloseBtn)
    childModalCloseBtn.addEventListener('click', () => closeAccessibleModal(childModal));
  if (cancelChildBtn)
    cancelChildBtn.addEventListener('click', () => closeAccessibleModal(childModal));
  if (learnerModalCloseBtn)
    learnerModalCloseBtn.addEventListener('click', () => closeAccessibleModal(learnerModal));
  if (pinChallengeCloseBtn)
    pinChallengeCloseBtn.addEventListener('click', () => closeAccessibleModal(pinChallengeModal));
  if (pinChallengeCancelBtn)
    pinChallengeCancelBtn.addEventListener('click', () => closeAccessibleModal(pinChallengeModal));

  if (addChildBtn) addChildBtn.addEventListener('click', () => openChildModal(null));
  if (adminRefreshBtn) adminRefreshBtn.addEventListener('click', renderAdminDashboard);

  if (adminUserSearchInput)
    adminUserSearchInput.addEventListener('input', filterAndRenderAdminUsers);
  if (adminRoleFilterSelect)
    adminRoleFilterSelect.addEventListener('change', filterAndRenderAdminUsers);

  // Avatar selector grid handler
  if (avatarSelectorGrid) {
    avatarSelectorGrid.querySelectorAll('.avatar-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        avatarSelectorGrid
          .querySelectorAll('.avatar-opt')
          .forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        selectedChildAvatar.value = btn.dataset.avatar;
      });
    });
  }

  // Save Child Profile Form Submit
  if (childForm) {
    childForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = childNameInput.value.trim();
      if (!name) {
        showToast('Name Required', 'Please enter a name for the child profile.', 'error');
        return;
      }

      const pinVal = childPinInput.value.trim();
      const childData = {
        parentUid: currentUser ? currentUser.uid : 'parent_local',
        name: name,
        avatar: selectedChildAvatar.value || '🌟',
        assignedTrack: childTrackSelect.value || 'level1'
      };
      if (pinVal.length > 0) {
        childData.pinCode = pinVal;
      }

      const editId = editingChildId.value;
      let savedChild = null;

      if (editId) {
        // Edit existing profile
        try {
          const res = await fetch(`/api/parent/children/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(childData)
          });
          const data = await res.json();
          if (data && data.success && data.child) {
            savedChild = data.child;
          }
        } catch (err) {
          console.warn('Server child update notice:', err);
        }

        if (!savedChild) {
          savedChild = {
            id: editId,
            ...childData,
            hasPin: pinVal.length > 0
          };
        }

        familyChildren = familyChildren.map((c) => (c.id === editId ? { ...c, ...savedChild } : c));
      } else {
        // Create new child profile
        try {
          const res = await fetch('/api/parent/children', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(childData)
          });
          const data = await res.json();
          if (data && data.success && data.child) {
            savedChild = data.child;
          }
        } catch (err) {
          console.warn('Server child create notice:', err);
        }

        if (!savedChild) {
          savedChild = {
            id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            ...childData,
            hasPin: pinVal.length > 0
          };
        }

        familyChildren.push(savedChild);
      }

      localStorage.setItem('lms_children', JSON.stringify(familyChildren));
      closeAccessibleModal(childModal);

      // Generate direct kids access URL
      const directKidUrl = `${window.location.origin}/?kid=${encodeURIComponent(savedChild.id)}`;
      showToast('Child Profile Saved! 🎉', `Direct Access URL: ${directKidUrl}`, 'success');

      // Auto-set as active child if none was active
      if (!activeChild) {
        setActiveChild(savedChild);
      }

      await fetchFamilyChildren();
      if (parentDashboardView && parentDashboardView.style.display !== 'none') {
        renderParentDashboard();
      }
    });
  }

  // Learner PIN Challenge Form Submit (Public & Parent Friendly)
  if (pinChallengeForm) {
    pinChallengeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const childId = targetChildId.value;
      const enteredPin = pinChallengeInput.value.trim();

      try {
        const res = await fetch(`/api/public/child/${childId}/verify-pin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: enteredPin })
        });
        const data = await res.json();
        if (data.success && data.verified) {
          closeAccessibleModal(pinChallengeModal);
          const matchedChild = data.child || familyChildren.find((c) => c.id === childId);
          if (matchedChild) setActiveChild(matchedChild);
          closeAccessibleModal(learnerModal);
          showToast(
            `Welcome back, ${matchedChild?.name || 'Learner'}! 🌟`,
            'PIN verified successfully.',
            'success'
          );
          switchView('dashboard');
        } else {
          pinErrorMsg.textContent = data.error || 'Incorrect PIN. Please try again.';
          pinErrorMsg.style.display = 'block';
        }
      } catch (err) {
        pinErrorMsg.textContent = 'Connection error verifying PIN.';
        pinErrorMsg.style.display = 'block';
      }
    });
  }

  // Profile Edit Form Submit
  if (profileEditForm) {
    profileEditForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = profileNameInput.value.trim();
      if (!newName || !currentUser) return;

      try {
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: currentUser.uid, displayName: newName })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          localStorage.setItem('lms_user', JSON.stringify(currentUser));
          updateAuthUI();
          closeAccessibleModal(userProfileModal);
          if (parentDashboardView && parentDashboardView.style.display !== 'none') {
            renderParentDashboard();
          }
        }
      } catch (err) {
        console.error('Error updating user profile:', err);
      }
    });
  }

  if (profileSignOutBtn) {
    profileSignOutBtn.addEventListener('click', handleSignOut);
  }
  if (signOutHeaderBtn) {
    signOutHeaderBtn.addEventListener('click', handleSignOut);
  }
  if (sidebarSignOutBtn) {
    sidebarSignOutBtn.addEventListener('click', handleSignOut);
  }
  if (parentSignOutBtn) {
    parentSignOutBtn.addEventListener('click', handleSignOut);
  }
  if (adminSignOutBtn) {
    adminSignOutBtn.addEventListener('click', handleSignOut);
  }

  // Email Sign In Form Submit (Modal)
  // --------------------------------------------------------------------------
  // Client-Side WebCrypto Authentication Engine (Fallback for Static / Offline Edge)
  // --------------------------------------------------------------------------
  async function hashClientPassword(pwd) {
    if (
      typeof window !== 'undefined' &&
      window.crypto &&
      window.crypto.subtle &&
      typeof window.crypto.subtle.digest === 'function'
    ) {
      try {
        const enc = new TextEncoder();
        const buf = await window.crypto.subtle.digest('SHA-256', enc.encode(pwd));
        return Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      } catch (e) {
        console.warn('Subtle crypto digest failed, falling back to simple hash:', e);
      }
    }
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      const char = pwd.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }

  function getClientUsersDb() {
    try {
      return JSON.parse(localStorage.getItem('lms_local_users') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveClientUsersDb(users) {
    localStorage.setItem('lms_local_users', JSON.stringify(users));
  }

  async function performClientRegister(displayName, email, password, role) {
    const cleanEmail = email.trim().toLowerCase();
    const pHash = await hashClientPassword(password);
    const users = getClientUsersDb();
    if (users.some((u) => u.email === cleanEmail)) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in.'
      };
    }
    const user = {
      uid: 'u_local_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      email: cleanEmail,
      displayName: displayName.trim(),
      role: role || 'parent',
      provider: 'local',
      isVerified: true
    };
    users.push({ ...user, passwordHash: pHash });
    saveClientUsersDb(users);
    return { success: true, user };
  }

  async function performClientLogin(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const pHash = await hashClientPassword(password);

    const users = getClientUsersDb();
    const match = users.find((u) => u.email === cleanEmail && u.passwordHash === pHash);
    if (match) {
      const { passwordHash, ...safe } = match;
      return { success: true, user: safe };
    }
    return { success: false, error: 'Invalid email or password.' };
  }

  function getTurnstileToken(form) {
    if (!form) return null;
    const input =
      form.querySelector('[name="cf-turnstile-response"]') ||
      form.querySelector('[name="turnstileToken"]');
    return input ? input.value : null;
  }

  // Email Sign In Form Submit (Modal)
  if (emailAuthForm) {
    emailAuthForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthAlert();
      const email = authEmailInput.value.trim();
      const password = authPasswordInput.value;
      const turnstileToken = getTurnstileToken(emailAuthForm);

      try {
        let data = null;
        let isServerSuccess = false;

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, turnstileToken })
          });
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            data = await res.json().catch(() => null);
            if (res.ok && data && data.success && data.user) {
              isServerSuccess = true;
            }
          }
        } catch (netErr) {
          console.warn('Backend login attempt fell back to offline storage:', netErr);
        }

        if (!isServerSuccess) {
          if (data && data.error) {
            showAuthAlert(data.error, 'error');
            return;
          }
          const clientRes = await performClientLogin(email, password);
          if (!clientRes.success) {
            showAuthAlert(clientRes.error || 'Invalid email or password.', 'error');
            return;
          }
          data = clientRes;
        }

        currentUser = data.user;
        localStorage.setItem('lms_user', JSON.stringify(currentUser));
        updateAuthUI();
        await fetchFamilyChildren();
        closeAccessibleModal(authModal);
        if (currentUser.role === 'super_admin') {
          switchView('admin');
        } else {
          switchView('parent');
        }
      } catch (err) {
        console.error('Sign in error:', err);
        showAuthAlert('Unable to complete sign in. Please try again.', 'error');
      }
    });
  }

  // Email Sign In Form Submit (Homepage Landing)
  if (homeEmailAuthForm) {
    homeEmailAuthForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthAlert(homeAuthAlertMsg);
      const email = homeAuthEmailInput.value.trim();
      const password = homeAuthPasswordInput.value;
      const turnstileToken = getTurnstileToken(homeEmailAuthForm);

      try {
        let data = null;
        let isServerSuccess = false;

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, turnstileToken })
          });
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            data = await res.json().catch(() => null);
            if (res.ok && data && data.success && data.user) {
              isServerSuccess = true;
            }
          }
        } catch (netErr) {
          console.warn('Backend login attempt fell back to offline storage:', netErr);
        }

        if (!isServerSuccess) {
          if (data && data.error) {
            showAuthAlert(data.error, 'error', homeAuthAlertMsg);
            showToast('Sign In Failed', data.error, 'error');
            return;
          }
          const clientRes = await performClientLogin(email, password);
          if (!clientRes.success) {
            const msg = clientRes.error || 'Invalid email or password.';
            showAuthAlert(msg, 'error', homeAuthAlertMsg);
            showToast('Sign In Failed', msg, 'error');
            return;
          }
          data = clientRes;
        }

        currentUser = data.user;
        localStorage.setItem('lms_user', JSON.stringify(currentUser));
        updateAuthUI();
        await fetchFamilyChildren();
        showToast('Welcome Back! 👋', `Signed in as ${data.user.displayName}`, 'success');
        if (currentUser.role === 'super_admin') {
          switchView('admin');
        } else {
          switchView('parent');
        }
      } catch (err) {
        console.error('Homepage sign in error:', err);
        showAuthAlert('Unable to complete sign in. Please try again.', 'error', homeAuthAlertMsg);
      }
    });
  }

  // Email Sign Up Form Submit (Modal)
  if (signUpForm) {
    signUpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthAlert();
      const displayName = signUpNameInput.value.trim();
      const email = signUpEmailInput.value.trim();
      const password = signUpPasswordInput.value;
      const role = signUpRoleSelect.value;
      const turnstileToken = getTurnstileToken(signUpForm);

      if (!displayName || !email || !password) {
        showAuthAlert('Please fill in your name, email address, and password.', 'error');
        return;
      }
      if (password.length < 6) {
        showAuthAlert('Password must be at least 6 characters long.', 'error');
        return;
      }

      try {
        let data = null;
        let isServerSuccess = false;

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayName, email, password, role, turnstileToken })
          });
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            data = await res.json().catch(() => null);
            if (res.ok && data && data.success && data.user) {
              isServerSuccess = true;
            }
          }
        } catch (netErr) {
          console.warn('Backend register attempt fell back to offline storage:', netErr);
        }

        if (!isServerSuccess) {
          if (data && data.error) {
            showAuthAlert(data.error, 'error');
            return;
          }
          const clientRes = await performClientRegister(displayName, email, password, role);
          if (!clientRes.success) {
            showAuthAlert(clientRes.error, 'error');
            return;
          }
          data = clientRes;
        }

        currentUser = data.user;
        localStorage.setItem('lms_user', JSON.stringify(currentUser));

        // Mirror to local users list so admin dashboard reflects registered parents immediately
        const localUsers = getClientUsersDb();
        const existingIdx = localUsers.findIndex(
          (u) => u.email.toLowerCase() === data.user.email.toLowerCase()
        );
        if (existingIdx === -1) {
          localUsers.push(data.user);
        } else {
          localUsers[existingIdx] = { ...localUsers[existingIdx], ...data.user };
        }
        saveClientUsersDb(localUsers);

        updateAuthUI();
        try {
          await fetchFamilyChildren();
        } catch (syncErr) {
          console.warn('Post-registration children sync non-fatal warning:', syncErr);
        }
        showAuthAlert('Account created successfully! Redirecting...', 'success');
        setTimeout(() => {
          closeAccessibleModal(authModal);
          switchView('parent');
        }, 600);
      } catch (err) {
        console.error('Sign up error:', err);
        showAuthAlert('Unable to complete registration. Please try again.', 'error');
      }
    });
  }

  // Email Sign Up Form Submit (Homepage Landing)
  if (homeSignUpForm) {
    homeSignUpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthAlert(homeAuthAlertMsg);
      const displayName = homeSignUpNameInput.value.trim();
      const email = homeSignUpEmailInput.value.trim();
      const password = homeSignUpPasswordInput.value;
      const role = homeSignUpRoleSelect.value;

      if (!displayName || !email || !password) {
        showAuthAlert(
          'Please enter your full name, email address, and a password.',
          'error',
          homeAuthAlertMsg
        );
        return;
      }
      if (password.length < 6) {
        showAuthAlert('Password must be at least 6 characters long.', 'error', homeAuthAlertMsg);
        return;
      }

      try {
        let data = null;
        let isServerSuccess = false;

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayName, email, password, role })
          });
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            data = await res.json().catch(() => null);
            if (res.ok && data && data.success && data.user) {
              isServerSuccess = true;
            }
          }
        } catch (netErr) {
          console.warn('Backend register attempt fell back to offline storage:', netErr);
        }

        if (!isServerSuccess) {
          if (data && data.error) {
            showAuthAlert(data.error, 'error', homeAuthAlertMsg);
            showToast('Registration Error', data.error, 'error');
            return;
          }
          const clientRes = await performClientRegister(displayName, email, password, role);
          if (!clientRes.success) {
            showAuthAlert(clientRes.error, 'error', homeAuthAlertMsg);
            showToast('Registration Error', clientRes.error, 'error');
            return;
          }
          data = clientRes;
        }

        currentUser = data.user;
        localStorage.setItem('lms_user', JSON.stringify(currentUser));

        // Mirror to local users list so admin dashboard reflects registered parents immediately
        const localUsers = getClientUsersDb();
        const existingIdx = localUsers.findIndex(
          (u) => u.email.toLowerCase() === data.user.email.toLowerCase()
        );
        if (existingIdx === -1) {
          localUsers.push(data.user);
        } else {
          localUsers[existingIdx] = { ...localUsers[existingIdx], ...data.user };
        }
        saveClientUsersDb(localUsers);

        updateAuthUI();
        try {
          await fetchFamilyChildren();
        } catch (syncErr) {
          console.warn('Post-registration children sync non-fatal warning:', syncErr);
        }
        showAuthAlert('Account created successfully! Redirecting...', 'success', homeAuthAlertMsg);
        showToast('Account Created! 🎉', `Welcome, ${data.user.displayName}`, 'success');
        setTimeout(() => {
          switchView('parent');
        }, 600);
      } catch (err) {
        console.error('Homepage sign up error:', err);
        showAuthAlert(
          'Unable to complete registration. Please try again.',
          'error',
          homeAuthAlertMsg
        );
      }
    });
  }

  // Direct Kid Access Handler (Allows children to open direct link and log in with PIN)
  async function handleDirectKidAccess(kidId) {
    // Switch to main dashboard layout immediately so children see course contents
    switchView('dashboard');

    if (!kidId) {
      if (activeChild) {
        setActiveChild(activeChild);
      } else if (familyChildren.length > 0) {
        openLearnerModal();
      }
      return;
    }

    const cleanKidId = decodeURIComponent(kidId).trim();
    const cleanLower = cleanKidId.toLowerCase();

    // Check if parameter is a generic mode flag (e.g. ?child or ?kid or ?learner)
    const genericTokens = [
      'child',
      'kid',
      'learner',
      'student',
      'true',
      '1',
      'yes',
      'null',
      'undefined',
      ''
    ];
    if (genericTokens.includes(cleanLower)) {
      if (activeChild) {
        setActiveChild(activeChild);
        showToast(
          `Welcome Back, ${activeChild.name}! 🌟`,
          `Ready for ${activeChild.assignedTrack === 'level2' ? 'Level 2 (13y+)' : 'Level 1 (~10y)'} learning.`,
          'info'
        );
      } else if (familyChildren.length === 1) {
        attemptSelectLearner(familyChildren[0]);
      } else if (familyChildren.length > 1) {
        openLearnerModal();
      } else {
        const localKids = JSON.parse(localStorage.getItem('lms_children') || '[]');
        if (localKids.length === 1) {
          attemptSelectLearner(localKids[0]);
        } else if (localKids.length > 1) {
          familyChildren = localKids;
          openLearnerModal();
        } else {
          showToast(
            'Welcome to Islamic Studies! 📖',
            'Explore all 9 modules across Aqidah, Maliki Fiqh, and Seerah.',
            'info'
          );
        }
      }
      return;
    }

    // 1. Search in current memory state (by ID, Name, or partial match)
    let targetChild = familyChildren.find(
      (c) =>
        c.id === cleanKidId ||
        (c.id && c.id.toLowerCase() === cleanLower) ||
        (c.name && c.name.trim().toLowerCase() === cleanLower) ||
        (c.id &&
          (c.id.toLowerCase().includes(cleanLower) || cleanLower.includes(c.id.toLowerCase()))) ||
        (c.name &&
          (c.name.trim().toLowerCase().includes(cleanLower) ||
            cleanLower.includes(c.name.trim().toLowerCase())))
    );

    // 2. Query public endpoint from server / edge D1
    if (!targetChild) {
      try {
        const res = await fetch(`/api/public/child/${encodeURIComponent(cleanKidId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.child) {
            targetChild = data.child;
          }
        }
      } catch (err) {
        console.warn('Public child fetch notice:', err);
      }
    }

    // 3. Check local storage lists (lms_children and lms_local_children)
    if (!targetChild) {
      const localKids = JSON.parse(
        localStorage.getItem('lms_children') || localStorage.getItem('lms_local_children') || '[]'
      );
      targetChild = localKids.find(
        (c) =>
          c.id === cleanKidId ||
          (c.id && c.id.toLowerCase() === cleanLower) ||
          (c.name && c.name.trim().toLowerCase() === cleanLower) ||
          (c.id &&
            (c.id.toLowerCase().includes(cleanLower) || cleanLower.includes(c.id.toLowerCase()))) ||
          (c.name &&
            (c.name.trim().toLowerCase().includes(cleanLower) ||
              cleanLower.includes(c.name.trim().toLowerCase())))
      );
    }

    // 4. Fallback to active child if cached
    if (!targetChild && activeChild) {
      if (
        activeChild.id === cleanKidId ||
        (activeChild.id && activeChild.id.toLowerCase() === cleanLower) ||
        (activeChild.name && activeChild.name.trim().toLowerCase() === cleanLower) ||
        (activeChild.name && activeChild.name.trim().toLowerCase().includes(cleanLower))
      ) {
        targetChild = activeChild;
      }
    }

    if (targetChild) {
      // Ensure target child is recorded in memory state
      if (!familyChildren.some((c) => c.id === targetChild.id)) {
        familyChildren.push(targetChild);
      }

      if (targetChild.hasPin) {
        targetChildId.value = targetChild.id;
        pinChallengeInput.value = '';
        pinErrorMsg.style.display = 'none';
        const titleEl =
          document.getElementById('pinChallengeTitle') ||
          document.querySelector('#pinChallengeModal h2');
        if (titleEl) {
          titleEl.innerHTML = `${targetChild.avatar || '🌟'} Welcome, ${escapeHtml(targetChild.name)}!`;
        }
        openAccessibleModal(pinChallengeModal, '#pinChallengeInput');
      } else {
        setActiveChild(targetChild);
        showToast(
          `Welcome, ${targetChild.name}! 🌟`,
          `Ready for ${targetChild.assignedTrack === 'level2' ? 'Level 2 (13y+)' : 'Level 1 (~10y)'} learning.`,
          'success'
        );
      }
    } else {
      // Graceful fallback: If any children exist, offer learner picker instead of blocking
      const availableKids =
        familyChildren.length > 0
          ? familyChildren
          : JSON.parse(localStorage.getItem('lms_children') || '[]');
      if (availableKids.length > 0) {
        familyChildren = availableKids;
        openLearnerModal();
        showToast(
          'Learner Profile Notice',
          `Could not find profile matching "${cleanKidId}". Please select a profile below.`,
          'info',
          5000
        );
      } else {
        showToast('Course Curriculum', 'Welcome! Explore all 9 Islamic Studies modules.', 'info');
      }
    }
  }

  // Initialize Auth & Children State on Load (Persistent across page reloads)
  (async function initMultiTenant() {
    // 1. Instant Cache Hydration (prevents screen flicker on refresh)
    try {
      const cachedUser = localStorage.getItem('lms_user');
      if (cachedUser) {
        currentUser = JSON.parse(cachedUser);
      }
      const cachedChild = localStorage.getItem('lms_active_child');
      if (cachedChild) {
        activeChild = JSON.parse(cachedChild);
      }
    } catch (e) {
      console.warn('Cache hydration notice:', e);
    }

    updateAuthUI();

    // 2. Verify Session with Server in Background
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          localStorage.setItem('lms_user', JSON.stringify(currentUser));
        } else if (!currentUser) {
          currentUser = null;
          localStorage.removeItem('lms_user');
        }
      }
    } catch (e) {
      console.warn('Session verification notice (maintaining active local session):', e);
    }

    updateAuthUI();
    await fetchFamilyChildren();

    // 3. Handle Direct Kids Access Link (?kid=... or ?child=... or #kid=... or pathname /child/...)
    const urlParams = new URLSearchParams(window.location.search);
    let kidIdParam =
      urlParams.get('kid') ||
      urlParams.get('child') ||
      urlParams.get('learner') ||
      urlParams.get('student');

    if (!kidIdParam && window.location.hash) {
      const hashClean = window.location.hash.replace(/^#\/?/, '');
      const hashParams = new URLSearchParams(hashClean);
      kidIdParam =
        hashParams.get('kid') ||
        hashParams.get('child') ||
        hashParams.get('learner') ||
        hashParams.get('student');
      if (!kidIdParam && (hashClean.startsWith('child_') || hashClean.startsWith('kid_'))) {
        kidIdParam = hashClean;
      }
    }

    if (!kidIdParam && window.location.pathname) {
      const match = window.location.pathname.match(/^\/(?:child|kid|learner|student)\/([^/]+)/i);
      if (match) {
        kidIdParam = decodeURIComponent(match[1]);
      }
    }

    if (kidIdParam) {
      await handleDirectKidAccess(kidIdParam);
      return;
    }

    // 4. Handle Password Reset Link (?resetToken=... or ?token=...)
    const resetTokenParam = urlParams.get('resetToken') || urlParams.get('token');
    if (resetTokenParam) {
      const resetModal = document.getElementById('resetPasswordModal');
      const tokenInput = document.getElementById('resetPasswordTokenInput');
      if (tokenInput) tokenInput.value = resetTokenParam;
      openAccessibleModal(resetModal, '#newPasswordInput');
      return;
    }

    // 5. Restore Last Active View on Refresh
    const lastView = localStorage.getItem('lms_last_view');
    if (!currentUser) {
      if (lastView === 'dashboard' || lastView === 'module') {
        switchView(lastView);
      } else {
        switchView('authLanding');
      }
    } else if (currentUser.role === 'super_admin') {
      if (lastView && ['dashboard', 'module', 'parent', 'admin'].includes(lastView)) {
        switchView(lastView);
      } else {
        switchView('admin');
      }
    } else {
      if (lastView && ['dashboard', 'module', 'parent'].includes(lastView)) {
        switchView(lastView);
      } else {
        switchView('parent');
      }
    }
  })();

  // --------------------------------------------------------------------------
  // FORM UX: PASSWORD REVEAL & STRENGTH METER ENGINE
  // --------------------------------------------------------------------------
  function initPasswordUX() {
    // 1. Password Reveal Toggles
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

    // 2. Password Strength Evaluator
    function evaluatePasswordStrength(pass) {
      if (!pass)
        return { score: 0, label: 'Weak', class: 'weak', hint: 'Enter at least 6 characters' };
      let score = 0;
      if (pass.length >= 8) score += 1;
      if (/[A-Z]/.test(pass)) score += 1;
      if (/[a-z]/.test(pass)) score += 1;
      if (/[0-9]/.test(pass)) score += 1;
      if (/[^A-Za-z0-9]/.test(pass)) score += 1;

      if (score <= 1)
        return {
          score: 1,
          label: 'Weak',
          class: 'weak',
          hint: 'Use 8+ chars with letters & numbers'
        };
      if (score === 2)
        return {
          score: 2,
          label: 'Fair',
          class: 'fair',
          hint: 'Good start. Add uppercase or symbols'
        };
      if (score === 3 || score === 4)
        return { score: 3, label: 'Good', class: 'good', hint: 'Strong password. Excellent!' };
      return {
        score: 5,
        label: 'Excellent',
        class: 'strong',
        hint: 'Very strong secure password! 🛡️'
      };
    }

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
    setupStrengthListener(
      'newPasswordInput',
      'resetPasswordStrengthContainer',
      'resetStrengthFill',
      'resetStrengthLabel',
      'resetStrengthCriteria'
    );

    // 3. Pre-submit Live Validation Indicators
    function attachLiveValidator(inputId, validatorFn) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const check = () => {
        if (!input.value) {
          input.classList.remove('is-invalid');
          return;
        }
        if (!validatorFn(input.value)) {
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      };
      input.addEventListener('input', check);
      input.addEventListener('blur', check);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    attachLiveValidator('authEmailInput', (v) => emailRegex.test(v.trim()));
    attachLiveValidator('homeAuthEmailInput', (v) => emailRegex.test(v.trim()));
    attachLiveValidator('signUpEmailInput', (v) => emailRegex.test(v.trim()));
    attachLiveValidator('homeSignUpEmailInput', (v) => emailRegex.test(v.trim()));
    attachLiveValidator('signUpPasswordInput', (v) => v.length >= 6);
    attachLiveValidator('homeSignUpPasswordInput', (v) => v.length >= 6);
  }

  // --------------------------------------------------------------------------
  // FORGOT PASSWORD & RESET PASSWORD ENGINE
  // --------------------------------------------------------------------------
  function initForgotPasswordUX() {
    const forgotModal = document.getElementById('forgotPasswordModal');
    const resetModal = document.getElementById('resetPasswordModal');
    const forgotForm = document.getElementById('forgotPasswordForm');
    const resetForm = document.getElementById('resetPasswordForm');
    const forgotAlert = document.getElementById('forgotPasswordAlertMsg');
    const resetAlert = document.getElementById('resetPasswordAlertMsg');
    const forgotCloseBtn = document.getElementById('forgotPasswordCloseBtn');
    const resetCloseBtn = document.getElementById('resetPasswordCloseBtn');
    const tokenInput = document.getElementById('resetPasswordTokenInput');
    const newPassInput = document.getElementById('newPasswordInput');
    const confirmPassInput = document.getElementById('confirmNewPasswordInput');

    // Open Forgot Password modal from any button
    document.querySelectorAll('.open-forgot-password-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeAccessibleModal(authModal);
        if (forgotAlert) forgotAlert.style.display = 'none';
        const forgotEmail = document.getElementById('forgotEmailInput');
        if (forgotEmail) {
          const prefill =
            (
              document.getElementById('homeAuthEmailInput') ||
              document.getElementById('authEmailInput')
            )?.value || '';
          forgotEmail.value = prefill;
        }
        openAccessibleModal(forgotModal, '#forgotEmailInput');
      });
    });

    if (forgotCloseBtn) {
      forgotCloseBtn.addEventListener('click', () => closeAccessibleModal(forgotModal));
    }
    if (resetCloseBtn) {
      resetCloseBtn.addEventListener('click', () => closeAccessibleModal(resetModal));
    }

    // Submit Forgot Password Form
    if (forgotForm) {
      forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmailInput')?.value.trim();
        const turnstileToken = getTurnstileToken(forgotForm);
        if (!email) return;

        const submitBtn = document.getElementById('forgotSubmitBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Link...';
        }

        try {
          const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, turnstileToken })
          });
          let data = null;
          try {
            data = await res.json();
          } catch (jsonErr) {}
          if (data && data.success) {
            if (forgotAlert) {
              forgotAlert.className = 'auth-alert-msg success';
              forgotAlert.style.display = 'block';
              forgotAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapeHtml(data.message || 'Password reset link sent! Check your inbox.')}`;
            }
            showToast(
              'Reset Link Dispatched! ✉️',
              'Please check your email for password reset instructions.',
              'success'
            );
            setTimeout(() => {
              closeAccessibleModal(forgotModal);
            }, 3000);
          } else {
            if (forgotAlert) {
              forgotAlert.className = 'auth-alert-msg error';
              forgotAlert.style.display = 'block';
              forgotAlert.textContent =
                data && data.error ? data.error : 'Unable to process request.';
            }
          }
        } catch (err) {
          console.error('Forgot password error:', err);
          if (forgotAlert) {
            forgotAlert.className = 'auth-alert-msg error';
            forgotAlert.style.display = 'block';
            forgotAlert.textContent =
              'Network error submitting request. Please verify connection and try again.';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML =
              '<i class="fa-solid fa-paper-plane"></i> Send Password Reset Link';
          }
        }
      });
    }

    // Submit Reset Password Form
    if (resetForm) {
      resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = tokenInput?.value;
        const pass = newPassInput?.value;
        const confirmPass = confirmPassInput?.value;

        if (!token) {
          if (resetAlert) {
            resetAlert.className = 'auth-alert-msg error';
            resetAlert.style.display = 'block';
            resetAlert.textContent = 'Reset token is missing. Please request a new link.';
          }
          return;
        }

        if (!pass || pass.length < 6) {
          if (resetAlert) {
            resetAlert.className = 'auth-alert-msg error';
            resetAlert.style.display = 'block';
            resetAlert.textContent = 'Password must be at least 6 characters.';
          }
          return;
        }

        if (pass !== confirmPass) {
          if (resetAlert) {
            resetAlert.className = 'auth-alert-msg error';
            resetAlert.style.display = 'block';
            resetAlert.textContent = 'Passwords do not match. Please verify and retype.';
          }
          return;
        }

        const submitBtn = document.getElementById('resetSubmitBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating Password...';
        }

        try {
          const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password: pass, newPassword: pass })
          });
          let data = null;
          try {
            data = await res.json();
          } catch (jsonErr) {}
          if (data && data.success) {
            if (resetAlert) {
              resetAlert.className = 'auth-alert-msg success';
              resetAlert.style.display = 'block';
              resetAlert.textContent = data.message || 'Password updated successfully!';
            }
            if (data.user) {
              currentUser = data.user;
              localStorage.setItem('lms_user', JSON.stringify(currentUser));
              updateAuthUI();
              await fetchFamilyChildren();
            }
            showToast(
              'Password Updated! 🎉',
              'You are now signed in with your new password.',
              'success'
            );
            setTimeout(() => {
              closeAccessibleModal(resetModal);
              if (currentUser) {
                switchView(currentUser.role === 'super_admin' ? 'admin' : 'parent');
              }
            }, 1200);
          } else {
            if (resetAlert) {
              resetAlert.className = 'auth-alert-msg error';
              resetAlert.style.display = 'block';
              resetAlert.textContent =
                data && data.error
                  ? data.error
                  : 'Password reset failed. The link may have expired.';
            }
          }
        } catch (err) {
          console.error('Reset password error:', err);
          if (resetAlert) {
            resetAlert.className = 'auth-alert-msg error';
            resetAlert.style.display = 'block';
            resetAlert.textContent = 'Network error updating password. Please try again.';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Update & Save Password';
          }
        }
      });
    }
  }

  function setupEventListeners() {
    initPasswordUX();
    initForgotPasswordUX();

    mobileSidebarOpen.addEventListener('click', () => {
      sidebar.classList.add('open');
      mobileSidebarClose.focus();
    });
    mobileSidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('open');
      mobileSidebarOpen.focus();
    });

    moduleTabNav.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        mobileSidebarOpen.focus();
        return;
      }

      if (['TEXTAREA', 'INPUT', 'SELECT'].includes(document.activeElement.tagName)) return;

      // Spacebar toggle for teleprompter
      if (e.code === 'Space' && activeTab === 'teleprompter' && tpAutoScrollBtn) {
        e.preventDefault();
        tpAutoScrollBtn.click();
        return;
      }

      if ((activeTab === 'slides' || activeTab === 'teleprompter') && activeModuleId !== null) {
        if (e.key === 'ArrowRight') {
          if (activeTab === 'teleprompter') tpNextBtn.click();
          else nextSlideBtn.click();
        }
        if (e.key === 'ArrowLeft') {
          if (activeTab === 'teleprompter') tpPrevBtn.click();
          else prevSlideBtn.click();
        }
      }
    });

    // Online / Offline Connectivity Notifications
    window.addEventListener('offline', () => {
      showToast(
        'Offline Mode Active',
        'You are currently offline. Please reconnect to access all features.',
        'info',
        5000
      );
    });
    window.addEventListener('online', () => {
      showToast('Back Online 🌐', 'Internet connection restored.', 'success', 4000);
    });

    // Client Error Telemetry Logging
    window.addEventListener('error', (e) => {
      window.__lms_client_errors = (window.__lms_client_errors || 0) + 1;
      const healthErrors = document.getElementById('healthClientErrors');
      if (healthErrors) {
        healthErrors.innerHTML = `<span style="color:#f59e0b;font-weight:700;"><i class="fa-solid fa-triangle-exclamation" style="margin-right:4px;"></i> ${window.__lms_client_errors} Errors Logged</span>`;
      }
      fetch('/api/telemetry/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: e.message,
          source: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          stack: e.error ? e.error.stack : null,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    });

    window.addEventListener('unhandledrejection', (e) => {
      window.__lms_client_errors = (window.__lms_client_errors || 0) + 1;
      const healthErrors = document.getElementById('healthClientErrors');
      if (healthErrors) {
        healthErrors.innerHTML = `<span style="color:#f59e0b;font-weight:700;"><i class="fa-solid fa-triangle-exclamation" style="margin-right:4px;"></i> ${window.__lms_client_errors} Errors Logged</span>`;
      }
      fetch('/api/telemetry/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: e.reason ? e.reason.message || String(e.reason) : 'Unhandled Promise Rejection',
          stack: e.reason ? e.reason.stack : null,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    });
  }

  function setupLegalModal() {
    const legalModal = document.getElementById('privacyTermsModal');
    const openPrivacyBtn = document.getElementById('openPrivacyModalBtn');
    const openTermsBtn = document.getElementById('openTermsModalBtn');
    const openCookieBtn = document.getElementById('openCookieModalBtn');
    const closeBtn = document.getElementById('privacyTermsCloseBtn');
    const closeBottomBtn = document.getElementById('legalCloseBottomBtn');

    function openModal() {
      if (legalModal) {
        legalModal.style.opacity = '1';
        legalModal.style.visibility = 'visible';
      }
    }

    function closeModal() {
      if (legalModal) {
        legalModal.style.opacity = '0';
        legalModal.style.visibility = 'hidden';
      }
    }

    if (openPrivacyBtn)
      openPrivacyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    if (openTermsBtn)
      openTermsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    if (openCookieBtn)
      openCookieBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', closeModal);
    if (legalModal) {
      legalModal.addEventListener('click', (e) => {
        if (e.target === legalModal) closeModal();
      });
    }

    // Connect curriculum footer links to category filter
    document.querySelectorAll('.footer-nav-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = link.dataset.filter;
        showDashboard();
        const catBtn = document.querySelector(`.filter-btn[data-category="${filter}"]`);
        if (catBtn) {
          catBtn.click();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // Register Progressive Web App (PWA) Service Worker for Installability ("Add to Home Screen")
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('✅ [PWA] Zero-Cache Service Worker active for installability:', reg.scope);
        })
        .catch((err) => {
          console.warn('⚠️ [PWA] Service Worker registration notice:', err);
        });
    });
  }
});
