/* ==========================================================================
   Islamic Studies LMS - Single Page Application & Pedagogy Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // App State
  let courseData = null;
  let activeModuleId = null;
  let activeCategoryFilter = 'all';
  let activeTrack = localStorage.getItem('lms_track') || 'level1'; // level1 | level2 | teacher
  let activeTab = 'handout'; // handout | readaloud | teleprompter | answerkeys | quiz | slides | voicescript
  let currentSlideIndex = 0;
  let currentTpSlideIndex = 0;
  let isAutoScrolling = false;
  let autoScrollInterval = null;

  let userProgress = JSON.parse(localStorage.getItem('lms_progress') || '{}');
  let quizScores = JSON.parse(localStorage.getItem('lms_quiz_scores') || '{}');
  let userReflections = JSON.parse(localStorage.getItem('lms_reflections') || '{}');

  // Read Aloud State
  let speechSynth = window.speechSynthesis;
  let currentUtterance = null;
  let currentSentences = [];
  let currentSentenceIdx = 0;
  let isSpeaking = false;
  let isPaused = false;
  let availableVoices = [];

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

  const printBtn = document.getElementById('printBtn');

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
  const readaloudTabBtn = document.getElementById('readaloudTabBtn');
  const quizTabBtn = document.getElementById('quizTabBtn');
  const teleprompterTabBtn = document.getElementById('teleprompterTabBtn');
  const answerkeysTabBtn = document.getElementById('answerkeysTabBtn');
  const slidesTabBtn = document.getElementById('slidesTabBtn');
  const scriptTabBtn = document.getElementById('scriptTabBtn');

  // Tab Contents
  const handoutContent = document.getElementById('handoutContent');
  const malikiCitationTag = document.getElementById('malikiCitationTag');
  const markHandoutCompleteBtn = document.getElementById('markHandoutCompleteBtn');
  const listenHandoutBtn = document.getElementById('listenHandoutBtn');
  
  // Read Aloud Tab Elements
  const raPlayBtn = document.getElementById('raPlayBtn');
  const raStopBtn = document.getElementById('raStopBtn');
  const raSpeedSelect = document.getElementById('raSpeedSelect');
  const raVoiceSelect = document.getElementById('raVoiceSelect');
  const raProgressLabel = document.getElementById('raProgressLabel');
  const raProgressFill = document.getElementById('raProgressFill');
  const readAloudBody = document.getElementById('readAloudBody');

  // Teleprompter Elements
  const tpPrevBtn = document.getElementById('tpPrevBtn');
  const tpNextBtn = document.getElementById('tpNextBtn');
  const tpCounter = document.getElementById('tpCounter');
  const tpAutoScrollBtn = document.getElementById('tpAutoScrollBtn');
  const tpScrollSpeed = document.getElementById('tpScrollSpeed');
  const tpFontDecBtn = document.getElementById('tpFontDecBtn');
  const tpFontIncBtn = document.getElementById('tpFontIncBtn');
  const tpSpeakBtn = document.getElementById('tpSpeakBtn');
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

  // Sticky Bottom Audio Bar
  const stickyAudioBar = document.getElementById('stickyAudioBar');
  const stickyAudioTitle = document.getElementById('stickyAudioTitle');
  const stickyAudioText = document.getElementById('stickyAudioText');
  const stickyPlayPauseBtn = document.getElementById('stickyPlayPauseBtn');
  const stickyStopBtn = document.getElementById('stickyStopBtn');

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
  const printCertBtn = document.getElementById('printCertBtn');

  // Slideshow Elements
  const slideContent = document.getElementById('slideContent');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const slideCounter = document.getElementById('slideCounter');
  const fullscreenSlidesBtn = document.getElementById('fullscreenSlidesBtn');
  
  const voiceScriptContent = document.getElementById('voiceScriptContent');

  if (window.marked) {
    const renderer = new marked.Renderer();
    renderer.image = function(href, title, text) {
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
        focusTarget = modalEl.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
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

    if (restoreFocus && modalEl._previouslyFocusedElement && typeof modalEl._previouslyFocusedElement.focus === 'function') {
      try {
        modalEl._previouslyFocusedElement.focus();
      } catch (err) {}
    }
  }

  // --------------------------------------------------------------------------
  // TOAST NOTIFICATION SYSTEM (With Optional Action / Retry Handler)
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');

  function showToast(title, message, type = 'success', duration = 4500, actionCallback = null, actionLabel = 'Retry') {
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

  // Fetch Course Data with Retry Support
  function loadCourseData() {
    fetch('/api/course-data')
      .then(res => res.json())
      .then(data => {
        courseData = data;
        initApp();
      })
      .catch(err => {
        console.warn('API fetch failed, trying local file fallback...', err);
        fetch('/course_data.json')
          .then(r => r.json())
          .then(data => {
            courseData = data;
            initApp();
          })
          .catch(e => {
            console.error('Fatal: Could not load course data', e);
            showToast('Loading Error', 'Failed to load course curriculum data.', 'error', 0, () => loadCourseData(), 'Retry Loading');
          });
      });
  }
  loadCourseData();

  function initApp() {
    setupTheme();
    setupTrackButtons();
    setupCategoryFilters();
    setupVoices();
    renderSidebarModules();
    renderDashboard();
    updateProgressUI();
    setupEventListeners();

    if (!currentUser) {
      switchView('authLanding');
    } else {
      switchView('parent');
    }
  }

  function setupVoices() {
    if (!speechSynth) return;
    function loadVoices() {
      availableVoices = speechSynth.getVoices();
      raVoiceSelect.innerHTML = '<option value="">Default System Voice</option>';
      availableVoices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        if (voice.lang.includes('en') || voice.lang.includes('ar')) {
          raVoiceSelect.appendChild(option);
        }
      });
    }

    loadVoices();
    if (speechSynth.onvoiceschanged !== undefined) {
      speechSynth.onvoiceschanged = loadVoices;
    }
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

  function setupTrackButtons() {
    updateTrackActiveBtn();

    [trackL1, trackL2, trackTeacher].forEach(btn => {
      btn.addEventListener('click', () => {
        activeTrack = btn.dataset.track;
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
      });
    });
  }

  function updateTrackActiveBtn() {
    [trackL1, trackL2, trackTeacher].forEach(btn => {
      btn.classList.toggle('active', btn.dataset.track === activeTrack);
    });
  }

  function setupCategoryFilters() {
    if (!categoryFilters) return;
    const pills = categoryFilters.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategoryFilter = pill.dataset.cat;
        renderDashboard();
      });
    });
  }

  function renderSidebarModules() {
    modulesList.innerHTML = '';
    courseData.modules.forEach(mod => {
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
    modulesGrid.innerHTML = '';
    
    const filteredMods = courseData.modules.filter(mod => {
      if (activeCategoryFilter === 'all') return true;
      const cat = mod.category.toLowerCase();
      if (activeCategoryFilter === 'aqidah') return cat.includes('aqidah');
      if (activeCategoryFilter === 'fiqh') return cat.includes('fiqh');
      if (activeCategoryFilter === 'seerah') return cat.includes('seerah');
      if (activeCategoryFilter === 'akhlaq') return cat.includes('akhlaq') || cat.includes('ethics');
      return true;
    });

    filteredMods.forEach(mod => {
      const isCompleted = userProgress[`mod_${mod.id}`];
      const card = document.createElement('div');
      card.className = 'module-card';
      card.innerHTML = `
        <div>
          <div class="module-card-header">
            <div class="module-card-icon">
              <i class="fa-solid ${mod.icon || 'fa-book'}"></i>
            </div>
            <span class="category-badge">${mod.category}</span>
          </div>
          <h3>Module ${mod.id}: ${mod.title}</h3>
          <p>${mod.description}</p>
          <div class="module-card-meta-row">
            <span><i class="fa-solid fa-clock"></i> ${mod.estTime || '45m'}</span>
            <span>•</span>
            <span><i class="fa-solid fa-brain"></i> ${mod.bloomLevel || 'Understanding'}</span>
          </div>
        </div>
        <div class="module-card-footer">
          <span>${isCompleted ? '✓ Completed' : 'Start Lesson'}</span>
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
    activeModuleId = moduleId;
    const mod = courseData.modules.find(m => m.id === moduleId);
    if (!mod) return;

    dashboardView.style.display = 'none';
    moduleView.style.display = 'block';
    searchResultsContainer.style.display = 'none';

    moduleCategory.textContent = mod.category;
    moduleTitle.textContent = `Module ${mod.id}: ${mod.title}`;
    moduleDescription.textContent = mod.description;
    
    if (moduleEstTime) moduleEstTime.innerHTML = `<i class="fa-solid fa-clock"></i> ${mod.estTime || '45 mins'}`;
    if (moduleBloomLevel) moduleBloomLevel.innerHTML = `<i class="fa-solid fa-brain"></i> ${mod.bloomLevel || 'Understanding'}`;

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
    objs.forEach(obj => {
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
    switchTab(activeTab);
  }

  function switchTab(tabName) {
    activeTab = tabName;
    const tabBtns = moduleTabNav.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(c => c.classList.remove('active'));

    const activeContent = document.getElementById(`${tabName}Tab`);
    if (activeContent) activeContent.classList.add('active');

    const mod = courseData.modules.find(m => m.id === activeModuleId);
    if (!mod) return;

    if (tabName === 'handout') {
      renderHandout(mod);
    } else if (tabName === 'readaloud') {
      renderReadAloudTab(mod);
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
    markHandoutCompleteBtn.querySelector('span').textContent = isComp ? 'Completed ✓' : 'Mark as Completed';
  }

  listenHandoutBtn.addEventListener('click', () => {
    switchTab('readaloud');
    startReadAloud(0);
  });

  markHandoutCompleteBtn.addEventListener('click', () => {
    if (activeModuleId === null) return;
    const mod = courseData.modules.find(m => m.id === activeModuleId);
    const key = `mod_${activeModuleId}`;
    userProgress[key] = !userProgress[key];
    localStorage.setItem('lms_progress', JSON.stringify(userProgress));
    
    renderSidebarModules();
    renderDashboard();
    updateProgressUI();
    if (mod) renderHandout(mod);

    if (userProgress[key]) {
      showToast('Module Completed! 🎉', `Module ${activeModuleId}: ${mod ? mod.title : ''} marked completed. Keep up the great study!`, 'celebration');
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
    currentTpSlideIndex = (!isNaN(savedSlide) && savedSlide >= 0 && savedSlide < total) ? savedSlide : 0;

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

      tpScriptText.textContent = sc.script || sc.summary || 'Follow presentation slides for discussion.';

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

    // Teleprompter Read-Aloud Action Button
    tpSpeakBtn.onclick = () => {
      const textToSpeak = sc ? `${sc.title}. ${sc.script || sc.summary}` : 'Slide presentation.';
      if (speechSynth) {
        speechSynth.cancel();
        const u = new SpeechSynthesisUtterance(textToSpeak);
        if (raVoiceSelect.value !== '' && availableVoices[raVoiceSelect.value]) {
          u.voice = availableVoices[raVoiceSelect.value];
        }
        speechSynth.speak(u);
      }
    };
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
        showToast('Reduced Motion Active', 'Continuous auto-scrolling is paused because reduced motion is enabled in system settings.', 'info');
        return;
      }

      isAutoScrolling = !isAutoScrolling;
      tpAutoScrollBtn.classList.toggle('active', isAutoScrolling);
      tpAutoScrollBtn.innerHTML = isAutoScrolling ? '<i class="fa-solid fa-pause"></i> Auto-Scroll: ON' : '<i class="fa-solid fa-angles-down"></i> Auto-Scroll: OFF';

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
      const mod = courseData.modules.find(m => m.id === activeModuleId);
      const sc = mod && mod.teacher.parsedVoiceScript[currentTpSlideIndex];
      if (sc && sc.checkQuestion) {
        alert(`Question: ${sc.checkQuestion}\n\nAnswer Guidance: Refer to student handout and Maliki fiqh key for full breakdown.`);
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
  // READ ALOUD SPEECH SYNTHESIS ENGINE
  // --------------------------------------------------------------------------

  function renderReadAloudTab(mod) {
    let rawMd = activeTrack === 'level2' ? mod.tracks.level2.handoutMd : mod.tracks.level1.handoutMd;
    if (activeTrack === 'teacher' && mod.teacher.voiceScriptMd) {
      rawMd = mod.teacher.voiceScriptMd;
    }

    const cleanText = rawMd.replace(/#+\s*/g, '').replace(/\*+/g, '').replace(/_+/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
    currentSentences = cleanText.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 3);
    currentSentenceIdx = 0;

    readAloudBody.innerHTML = '';
    currentSentences.forEach((sentence, idx) => {
      const block = document.createElement('div');
      block.className = 'sentence-block';
      block.dataset.idx = idx;
      block.innerHTML = `<i class="fa-solid fa-volume-low" style="opacity:0.4;margin-right:8px;font-size:0.85rem;"></i> ${sentence}`;
      block.addEventListener('click', () => {
        startReadAloud(idx);
      });
      readAloudBody.appendChild(block);
    });

    updateReadAloudProgress();
  }

  function startReadAloud(startIdx = 0) {
    if (!speechSynth) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    speechSynth.cancel();
    currentSentenceIdx = startIdx;

    if (currentSentences.length === 0) return;

    isSpeaking = true;
    isPaused = false;
    updateAudioControlsUI();
    stickyAudioBar.style.display = 'flex';

    speakNextSentence();
  }

  function speakNextSentence() {
    if (currentSentenceIdx >= currentSentences.length || !isSpeaking) {
      stopReadAloud();
      return;
    }

    const text = currentSentences[currentSentenceIdx];
    currentUtterance = new SpeechSynthesisUtterance(text);

    if (raVoiceSelect.value !== '' && availableVoices[raVoiceSelect.value]) {
      currentUtterance.voice = availableVoices[raVoiceSelect.value];
    }

    currentUtterance.rate = parseFloat(raSpeedSelect.value || 1);

    const blocks = readAloudBody.querySelectorAll('.sentence-block');
    blocks.forEach(b => b.classList.remove('speaking'));
    
    const activeBlock = readAloudBody.querySelector(`[data-idx="${currentSentenceIdx}"]`);
    if (activeBlock) {
      activeBlock.classList.add('speaking');
      activeBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const mod = courseData.modules.find(m => m.id === activeModuleId);
    stickyAudioTitle.textContent = mod ? `Module ${mod.id}: ${mod.title}` : 'Reading Lesson Aloud...';
    stickyAudioText.textContent = text;

    updateReadAloudProgress();

    currentUtterance.onend = () => {
      if (isSpeaking && !isPaused) {
        currentSentenceIdx++;
        speakNextSentence();
      }
    };

    currentUtterance.onerror = (e) => {
      console.warn('Speech error:', e);
      currentSentenceIdx++;
      speakNextSentence();
    };

    speechSynth.speak(currentUtterance);
  }

  function togglePlayPause() {
    if (!isSpeaking) {
      startReadAloud(currentSentenceIdx);
    } else if (isPaused) {
      speechSynth.resume();
      isPaused = false;
      updateAudioControlsUI();
    } else {
      speechSynth.pause();
      isPaused = true;
      updateAudioControlsUI();
    }
  }

  function stopReadAloud() {
    if (speechSynth) speechSynth.cancel();
    isSpeaking = false;
    isPaused = false;
    stickyAudioBar.style.display = 'none';
    updateAudioControlsUI();

    const blocks = readAloudBody.querySelectorAll('.sentence-block');
    blocks.forEach(b => b.classList.remove('speaking'));
  }

  function updateAudioControlsUI() {
    const playIconClass = isSpeaking && !isPaused ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    raPlayBtn.querySelector('i').className = playIconClass;
    stickyPlayPauseBtn.querySelector('i').className = playIconClass;
  }

  function updateReadAloudProgress() {
    const total = currentSentences.length;
    const current = total > 0 ? currentSentenceIdx + 1 : 0;
    raProgressLabel.textContent = `Sentence ${current} of ${total}`;
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    raProgressFill.style.width = `${pct}%`;
  }

  raPlayBtn.addEventListener('click', togglePlayPause);
  raStopBtn.addEventListener('click', stopReadAloud);
  stickyPlayPauseBtn.addEventListener('click', togglePlayPause);
  stickyStopBtn.addEventListener('click', stopReadAloud);

  raSpeedSelect.addEventListener('change', () => {
    if (isSpeaking) {
      startReadAloud(currentSentenceIdx);
    }
  });

  raVoiceSelect.addEventListener('change', () => {
    if (isSpeaking) {
      startReadAloud(currentSentenceIdx);
    }
  });

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
      const cleanMd = pq && pq.studentQuestionsMd ? pq.studentQuestionsMd : (trackData.questionsMd || '').replace(/##?\s*.*Answer\s+Key[\s\S]*/i, '');
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
        q.options.forEach(opt => {
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
        btns.forEach(b => {
          b.addEventListener('click', (e) => {
            e.preventDefault();
            btns.forEach(x => x.classList.remove('selected'));
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
        wordBankHtml = `<div style="background:var(--input-bg);padding:12px;border-radius:var(--radius-sm);margin-bottom:16px;"><strong>Word Bank:</strong> ${pq.fillBlanks[0].wordBank.map(w => `<span style="background:var(--card-bg);padding:2px 8px;margin:2px;border-radius:4px;display:inline-block;font-size:0.85rem;">${w}</span>`).join(' ')}</div>`;
      }

      let fibLinesHtml = '';
      pq.fillBlanks.forEach((fib, idx) => {
        fibLinesHtml += `
          <div style="margin-bottom: 14px; font-size: 0.95rem;">
            <strong>${fib.id || (idx + 1)}.</strong> ${fib.text.replace(/__+/g, '<input type="text" class="fib-input" data-fibid="' + fib.id + '">')}
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

      pq.reflection.forEach(ref => {
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
          localStorage.setItem('lms_reflections', JSON.stringify(userReflections));
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
    const mod = courseData.modules.find(m => m.id === activeModuleId);
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

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Server quiz grading encountered an error.');
      }

      // Display option feedback and explanations returned from server
      if (data.feedback && Array.isArray(data.feedback)) {
        data.feedback.forEach(item => {
          const qObj = mcqs[item.questionIndex];
          if (!qObj) return;
          const qBox = quizQuestionsArea.querySelector(`[data-q-num="${qObj.id}"]`);
          if (!qBox) return;

          const optBtns = qBox.querySelectorAll('.opt-btn');
          const expBox = qBox.querySelector(`#exp_${qObj.id}`);

          optBtns.forEach(btn => {
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
      quizScores[scoreKey] = { score: data.score, total: data.total };
      localStorage.setItem('lms_quiz_scores', JSON.stringify(quizScores));
      showQuizScoreBanner(data.score, data.total);

      if (data.passed) {
        userProgress[`mod_${activeModuleId}`] = true;
        localStorage.setItem('lms_progress', JSON.stringify(userProgress));
        renderSidebarModules();
        updateProgressUI();
        showToast('MashaAllah! Exam Passed 🏆', `You scored ${data.percentage}% on Module ${activeModuleId}! Certificate unlocked.`, 'celebration');
      } else {
        showToast('Quiz Completed', `Score: ${data.score}/${data.total} (${data.percentage}%). Review topics and try again!`, 'info');
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      showToast('Grading Error', err.message || 'Unable to grade quiz on server.', 'error');
    } finally {
      submitQuizBtn.disabled = false;
      submitQuizBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit & Check Answers';
    }
  });

  retryQuizBtn.addEventListener('click', () => {
    const mod = courseData.modules.find(m => m.id === activeModuleId);
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
    const mod = courseData.modules.find(m => m.id === activeModuleId);
    certModuleName.textContent = mod ? `Module ${mod.id}: ${mod.title}` : 'Islamic Studies Module';
    certScoreBadge.textContent = `Score Achieved: ${pct}%`;
    certDateText.textContent = `Issue Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
    openAccessibleModal(certModal, '#printCertBtn');
  }

  if (certCloseBtn) certCloseBtn.addEventListener('click', () => closeAccessibleModal(certModal));
  if (printCertBtn) printCertBtn.addEventListener('click', () => window.print());

  // --------------------------------------------------------------------------
  // SLIDESHOW & VOICE SCRIPT RENDERERS
  // --------------------------------------------------------------------------

  function renderSlides(mod) {
    const slides = mod.teacher.parsedSlides || [];
    if (slides.length === 0) {
      slideContent.innerHTML = mod.teacher.slidesMd ? renderMarkdown(mod.teacher.slidesMd) : '<p>No slide presentation deck available.</p>';
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
      frame.requestFullscreen().catch(err => console.error(err));
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
    const completedMods = Object.keys(userProgress).filter(k => userProgress[k]).length;
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
    courseData.modules.forEach(mod => {
      const h10 = (mod.tracks.level1.handoutMd || '').toLowerCase();
      const h13 = (mod.tracks.level2.handoutMd || '').toLowerCase();
      const script = (mod.teacher.voiceScriptMd || '').toLowerCase();

      if (mod.title.toLowerCase().includes(query) || mod.description.toLowerCase().includes(query) || mod.category.toLowerCase().includes(query)) {
        results.push({ module: mod, snippet: mod.description });
      } else if (h10.includes(query) || h13.includes(query) || script.includes(query)) {
        const text = h10 || h13 || script;
        const snippetIdx = Math.max(0, text.indexOf(query));
        const snippet = text.substring(Math.max(0, snippetIdx - 20), snippetIdx + 120) + '...';
        results.push({ module: mod, snippet });
      }
    });

    if (searchResultsCount) searchResultsCount.textContent = `${results.length} result${results.length === 1 ? '' : 's'}`;
    searchResultsList.innerHTML = '';

    if (results.length === 0) {
      searchResultsList.innerHTML = '<p class="text-muted" style="padding: 12px;">No matching course topics found.</p>';
      return;
    }

    results.forEach(res => {
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

  printBtn.addEventListener('click', () => window.print());

  /* ==========================================================================
     Multi-Tenant Auth, Family Learner Switcher, Parent & Admin Controller
     ========================================================================== */

  // State
  let currentUser = JSON.parse(localStorage.getItem('lms_user') || 'null');
  let familyChildren = [];
  let activeChild = JSON.parse(localStorage.getItem('lms_active_child') || 'null');

  // DOM Elements - Navigation & Header
  const learnerSwitcherBtn = document.getElementById('learnerSwitcherBtn');
  const headerLearnerAvatar = document.getElementById('headerLearnerAvatar');
  const headerLearnerName = document.getElementById('headerLearnerName');
  const parentNavBtn = document.getElementById('parentNavBtn');
  const adminNavBtn = document.getElementById('adminNavBtn');
  const authHeaderBtn = document.getElementById('authHeaderBtn');
  const authHeaderIcon = document.getElementById('authHeaderIcon');
  const authHeaderText = document.getElementById('authHeaderText');

  // DOM Elements - Views
  const authLandingView = document.getElementById('authLandingView');
  const parentDashboardView = document.getElementById('parentDashboardView');
  const adminDashboardView = document.getElementById('adminDashboardView');

  // Homepage Auth Landing Elements
  const homeAuthTabSignIn = document.getElementById('homeAuthTabSignIn');
  const homeAuthTabSignUp = document.getElementById('homeAuthTabSignUp');
  const homeAuthAlertMsg = document.getElementById('homeAuthAlertMsg');
  const homeGoogleSignInBtn = document.getElementById('homeGoogleSignInBtn');
  const homeAppleSignInBtn = document.getElementById('homeAppleSignInBtn');
  const homeMicrosoftSignInBtn = document.getElementById('homeMicrosoftSignInBtn');
  const homeEmailAuthForm = document.getElementById('homeEmailAuthForm');
  const homeAuthEmailInput = document.getElementById('homeAuthEmailInput');
  const homeAuthPasswordInput = document.getElementById('homeAuthPasswordInput');
  const homeSignUpForm = document.getElementById('homeSignUpForm');
  const homeSignUpNameInput = document.getElementById('homeSignUpNameInput');
  const homeSignUpEmailInput = document.getElementById('homeSignUpEmailInput');
  const homeSignUpPasswordInput = document.getElementById('homeSignUpPasswordInput');
  const homeSignUpRoleSelect = document.getElementById('homeSignUpRoleSelect');
  const homeDemoParentBtn = document.getElementById('homeDemoParentBtn');
  const homeDemoAdminBtn = document.getElementById('homeDemoAdminBtn');
  const guestBrowseBtn = document.getElementById('guestBrowseBtn');

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

  // Admin Dashboard Elements
  const statAdminTotalParents = document.getElementById('statAdminTotalParents');
  const statAdminTotalKids = document.getElementById('statAdminTotalKids');
  const statAdminTotalCompletions = document.getElementById('statAdminTotalCompletions');
  const statAdminAvgQuiz = document.getElementById('statAdminAvgQuiz');
  const adminUsersTableBody = document.getElementById('adminUsersTableBody');
  const adminRefreshBtn = document.getElementById('adminRefreshBtn');
  const adminUserSearchInput = document.getElementById('adminUserSearchInput');
  const adminRoleFilterSelect = document.getElementById('adminRoleFilterSelect');

  // Modal Elements - Auth & Signup/Signin
  const authModal = document.getElementById('authModal');
  const authModalCloseBtn = document.getElementById('authModalCloseBtn');
  const authTabSignIn = document.getElementById('authTabSignIn');
  const authTabSignUp = document.getElementById('authTabSignUp');
  const authAlertMsg = document.getElementById('authAlertMsg');
  const googleSignInBtn = document.getElementById('googleSignInBtn');
  const appleSignInBtn = document.getElementById('appleSignInBtn');
  const microsoftSignInBtn = document.getElementById('microsoftSignInBtn');
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
      }
    }
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
      if (authHeaderText) authHeaderText.textContent = currentUser.displayName || currentUser.email.split('@')[0];
      if (authHeaderIcon) authHeaderIcon.className = 'fa-solid fa-user-circle';
      if (adminNavBtn) {
        adminNavBtn.style.display = currentUser.role === 'super_admin' ? 'inline-flex' : 'none';
      }
    } else {
      if (authHeaderText) authHeaderText.textContent = 'Sign In';
      if (authHeaderIcon) authHeaderIcon.className = 'fa-solid fa-arrow-right-to-bracket';
      if (adminNavBtn) adminNavBtn.style.display = 'none';
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
      profileUserPhoto.src = currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email || 'user')}`;
    }
    if (profileUserRole) {
      profileUserRole.textContent = currentUser.role === 'super_admin' ? '⚡ Super Admin' : '👨‍👩‍👧 Parent Account';
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
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API error:', e);
    }
    currentUser = null;
    activeChild = null;
    familyChildren = [];
    localStorage.removeItem('lms_user');
    localStorage.removeItem('lms_active_child');
    localStorage.removeItem('lms_children');
    updateAuthUI();
    if (userProfileModal) closeAccessibleModal(userProfileModal);
    switchView('authLanding');
  }

  // Family & Children Management
  async function fetchFamilyChildren() {
    if (!currentUser) {
      familyChildren = [];
      renderChildrenGrid();
      renderLearnerSelector();
      return;
    }

    try {
      const res = await fetch(`/api/parent/children?parentUid=${encodeURIComponent(currentUser.uid)}`);
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
          try { familyChildren = JSON.parse(cached); } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Children sync notice:', err);
      const cached = localStorage.getItem('lms_children');
      if (cached) {
        try { familyChildren = JSON.parse(cached); } catch (e) {}
      }
    }

    renderChildrenGrid();
    renderLearnerSelector();

    // Set default active child if none selected
    if (!activeChild && familyChildren.length > 0) {
      setActiveChild(familyChildren[0]);
    } else if (activeChild) {
      const refreshed = familyChildren.find(c => c.id === activeChild.id);
      if (refreshed) setActiveChild(refreshed);
      else if (familyChildren.length > 0) setActiveChild(familyChildren[0]);
      else activeChild = null;
    }
  }

  function setActiveChild(child) {
    activeChild = child;
    localStorage.setItem('lms_active_child', JSON.stringify(activeChild));
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
      document.getElementById('pinChallengeTitle').textContent = `Unlock ${escapeHtml(child.name)}'s Profile`;
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
      parentWelcomeTitle.textContent = `Welcome, ${currentUser.displayName}!`;
      if (parentAuthBadge) {
        parentAuthBadge.innerHTML = `<i class="fa-solid fa-user-check"></i> ${currentUser.email}`;
      }
    }

    if (statParentKidsCount) statParentKidsCount.textContent = familyChildren.length;
    if (statActiveLearnerName) statActiveLearnerName.textContent = activeChild ? activeChild.name : 'None';

    if (currentUser) {
      try {
        const res = await fetch(`/api/progress/sync?parentUid=${currentUser.uid}`);
        const data = await res.json();
        if (data.success) {
          if (statParentTotalCompleted) statParentTotalCompleted.textContent = data.progress.length;
          
          if (data.quizResults.length > 0) {
            const totalPct = data.quizResults.reduce((acc, q) => acc + (q.maxScore ? (q.score / q.maxScore) * 100 : 0), 0);
            const avg = Math.round(totalPct / data.quizResults.length);
            if (statParentAvgQuiz) statParentAvgQuiz.textContent = `${avg}%`;
          } else {
            if (statParentAvgQuiz) statParentAvgQuiz.textContent = '0%';
          }

          if (familyActivityList) {
            familyActivityList.innerHTML = '';
            const allLogs = [
              ...data.quizResults.map(q => ({ type: 'quiz', item: q, date: new Date(q.timestamp) })),
              ...data.reflections.map(r => ({ type: 'reflection', item: r, date: new Date(r.timestamp) }))
            ].sort((a, b) => b.date - a.date);

            if (allLogs.length === 0) {
              familyActivityList.innerHTML = `<p class="empty-state-text">No family activity logged yet. Start a quiz or reflection!</p>`;
            } else {
              allLogs.forEach(log => {
                const div = document.createElement('div');
                div.className = 'activity-item';
                const childObj = familyChildren.find(c => c.id === log.item.childId) || { name: 'Learner', avatar: '🌟' };
                if (log.type === 'quiz') {
                  div.innerHTML = `
                    <span class="act-icon font-gold"><i class="fa-solid fa-award"></i></span>
                    <div>
                      <strong>${childObj.avatar} ${childObj.name}</strong> completed Quiz Module #${log.item.moduleId} (Score: ${log.item.score}/${log.item.maxScore})<br>
                      <small style="color: var(--text-subtle);">${log.date.toLocaleString()}</small>
                    </div>
                  `;
                } else {
                  div.innerHTML = `
                    <span class="act-icon font-emerald"><i class="fa-solid fa-pen-nib"></i></span>
                    <div>
                      <strong>${childObj.avatar} ${childObj.name}</strong> submitted Reflection: "${log.item.reflectionText}"<br>
                      <small style="color: var(--text-subtle);">${log.date.toLocaleString()}</small>
                    </div>
                  `;
                }
                familyActivityList.appendChild(div);
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching parent activity:', err);
      }
    }

    // Render Children Grid
    if (parentChildrenGrid) {
      parentChildrenGrid.innerHTML = '';

      if (familyChildren.length === 0) {
        parentChildrenGrid.innerHTML = `
          <div class="empty-child-card">
            <i class="fa-solid fa-child-reaching empty-icon"></i>
            <h3>No Child Profiles Yet</h3>
            <p>Click 'Add Child Profile' above to create a profile for your learner.</p>
          </div>
        `;
      } else {
        familyChildren.forEach(child => {
          const isActive = activeChild && activeChild.id === child.id;
          const card = document.createElement('div');
          card.className = `child-profile-card ${isActive ? 'active' : ''}`;
          const isPinProtected = child.hasPin || (child.pinCode && child.pinCode.trim().length > 0);
          card.innerHTML = `
            <div class="child-card-header">
              <span class="child-avatar-big">${escapeHtml(child.avatar || '🌟')}</span>
              <div class="child-meta">
                <h3>${escapeHtml(child.name)}</h3>
                <span class="child-track-pill">${child.assignedTrack === 'level2' ? 'Level 2 (13y+)' : 'Level 1 (~10y)'}</span>
                ${isPinProtected ? '<span class="child-pin-pill" title="Protected by 4-digit PIN"><i class="fa-solid fa-lock"></i> PIN</span>' : ''}
              </div>
            </div>

            <div class="child-card-actions">
              <button class="btn-child-switch" data-id="${escapeHtml(child.id)}">
                <i class="fa-solid fa-user-check"></i> ${isActive ? 'Currently Active' : 'Switch Learner'}
              </button>
              <button class="btn-child-icon edit-child-btn" data-id="${escapeHtml(child.id)}" title="Edit Profile">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-child-icon danger delete-child-btn" data-id="${escapeHtml(child.id)}" title="Delete Profile">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          `;

          card.querySelector('.btn-child-switch').addEventListener('click', () => {
            attemptSelectLearner(child);
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
    familyChildren = familyChildren.filter(c => c.id !== childId);
    localStorage.setItem('lms_children', JSON.stringify(familyChildren));
    await fetchFamilyChildren();
    renderParentDashboard();
  }

  // Render Admin Dashboard
  async function renderAdminDashboard() {
    try {
      const resStats = await fetch('/api/admin/overview');
      const dataStats = await resStats.json();
      if (dataStats.success && dataStats.stats) {
        const s = dataStats.stats;
        if (statAdminTotalParents) statAdminTotalParents.textContent = s.totalParents;
        if (statAdminTotalKids) statAdminTotalKids.textContent = s.totalKids;
        if (statAdminTotalCompletions) statAdminTotalCompletions.textContent = s.totalCompletedModules;
        if (statAdminAvgQuiz) statAdminAvgQuiz.textContent = `${s.avgQuizScore}%`;
      }

      const resUsers = await fetch('/api/admin/users');
      const dataUsers = await resUsers.json();
      if (dataUsers.success && dataUsers.users) {
        adminUsersCache = dataUsers.users;
        filterAndRenderAdminUsers();
      }
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    }
  }

  // Admin User Filtering & Table Render
  function filterAndRenderAdminUsers() {
    if (!adminUsersTableBody) return;
    adminUsersTableBody.innerHTML = '';

    const query = (adminUserSearchInput ? adminUserSearchInput.value : '').toLowerCase().trim();
    const roleFilter = adminRoleFilterSelect ? adminRoleFilterSelect.value : 'all';

    const filtered = adminUsersCache.filter(u => {
      const nameMatch = (u.displayName || '').toLowerCase().includes(query);
      const emailMatch = (u.email || '').toLowerCase().includes(query);
      const kidsMatch = u.children && u.children.some(c => c.name.toLowerCase().includes(query));
      const textMatches = query === '' || nameMatch || emailMatch || kidsMatch;

      const roleMatches = roleFilter === 'all' || u.role === roleFilter;

      return textMatches && roleMatches;
    });

    if (filtered.length === 0) {
      adminUsersTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 20px; color: var(--text-muted);">No users found matching query.</td></tr>`;
      return;
    }

    filtered.forEach(u => {
      const row = document.createElement('tr');
      const kidsListStr = u.children && u.children.length > 0 ? u.children.map(c => `${c.avatar} ${c.name}`).join(', ') : 'None';
      const isSuperAdmin = u.role === 'super_admin';
      let providerIcon = 'fa-google';
      if ((u.provider || '').includes('apple')) providerIcon = 'fa-apple';
      else if ((u.provider || '').includes('microsoft')) providerIcon = 'fa-microsoft';
      else if ((u.provider || '').includes('password')) providerIcon = 'fa-envelope';

      row.innerHTML = `
        <td>
          <strong>${u.displayName || u.email}</strong><br>
          <small style="color: var(--text-subtle);">${u.email}</small>
        </td>
        <td><i class="fa-brands ${providerIcon}"></i> ${u.provider || 'google.com'}</td>
        <td><span class="role-badge ${u.role}">${isSuperAdmin ? '⚡ Super Admin' : '👨‍👩‍👧 Parent'}</span></td>
        <td><strong>${u.childrenCount}</strong> kids</td>
        <td>${kidsListStr}</td>
        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
        <td>
          <button class="btn-action-role" data-uid="${u.uid}" data-current="${u.role}">
            <i class="fa-solid fa-arrows-rotate"></i> ${isSuperAdmin ? 'Make Parent' : 'Make Admin'}
          </button>
          <button class="btn-action-delete" data-uid="${u.uid}" title="Delete User Account">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </td>
      `;

      row.querySelector('.btn-action-role').addEventListener('click', async () => {
        const newRole = u.role === 'super_admin' ? 'parent' : 'super_admin';
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
        if (confirm(`Are you sure you want to delete account ${u.email}? This will remove associated child profiles.`)) {
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
      familyChildren.forEach(child => {
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
    if (childToEdit) {
      document.getElementById('childModalTitle').textContent = 'Edit Child Profile';
      editingChildId.value = childToEdit.id;
      childNameInput.value = childToEdit.name;
      selectedChildAvatar.value = childToEdit.avatar || '🌟';
      childTrackSelect.value = childToEdit.assignedTrack || 'level1';
      childPinInput.value = '';
      childPinInput.placeholder = childToEdit.hasPin ? 'Leave blank to keep existing PIN' : 'e.g. 1234 (Optional)';
    } else {
      document.getElementById('childModalTitle').textContent = 'Create Child Profile';
      editingChildId.value = '';
      childNameInput.value = '';
      selectedChildAvatar.value = '🌟';
      childTrackSelect.value = 'level1';
      childPinInput.value = '';
      childPinInput.placeholder = 'e.g. 1234 (Optional)';
    }

    // Reset avatar active state
    avatarSelectorGrid.querySelectorAll('.avatar-opt').forEach(opt => {
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
  if (homeAuthTabSignIn) homeAuthTabSignIn.addEventListener('click', () => switchHomeAuthTab('signin'));
  if (homeAuthTabSignUp) homeAuthTabSignUp.addEventListener('click', () => switchHomeAuthTab('signup'));

  // Auth Tabs Click Handlers in Modal
  if (authTabSignIn) authTabSignIn.addEventListener('click', () => switchAuthTab('signin'));
  if (authTabSignUp) authTabSignUp.addEventListener('click', () => switchAuthTab('signup'));

  if (authModalCloseBtn) authModalCloseBtn.addEventListener('click', () => closeAccessibleModal(authModal));
  if (userProfileModalCloseBtn) userProfileModalCloseBtn.addEventListener('click', () => closeAccessibleModal(userProfileModal));
  if (childModalCloseBtn) childModalCloseBtn.addEventListener('click', () => closeAccessibleModal(childModal));
  if (cancelChildBtn) cancelChildBtn.addEventListener('click', () => closeAccessibleModal(childModal));
  if (learnerModalCloseBtn) learnerModalCloseBtn.addEventListener('click', () => closeAccessibleModal(learnerModal));
  if (pinChallengeCloseBtn) pinChallengeCloseBtn.addEventListener('click', () => closeAccessibleModal(pinChallengeModal));
  if (pinChallengeCancelBtn) pinChallengeCancelBtn.addEventListener('click', () => closeAccessibleModal(pinChallengeModal));

  if (addChildBtn) addChildBtn.addEventListener('click', () => openChildModal(null));
  if (adminRefreshBtn) adminRefreshBtn.addEventListener('click', renderAdminDashboard);

  if (adminUserSearchInput) adminUserSearchInput.addEventListener('input', filterAndRenderAdminUsers);
  if (adminRoleFilterSelect) adminRoleFilterSelect.addEventListener('change', filterAndRenderAdminUsers);

  // Avatar selector grid handler
  if (avatarSelectorGrid) {
    avatarSelectorGrid.querySelectorAll('.avatar-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        avatarSelectorGrid.querySelectorAll('.avatar-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedChildAvatar.value = btn.dataset.avatar;
      });
    });
  }

  // Save Child Profile Form Submit
  if (childForm) {
    childForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) {
        showToast('Sign In Required', 'Please sign in to add or edit learner profiles.', 'error');
        return;
      }
      const pinVal = childPinInput.value.trim();
      const childData = {
        parentUid: currentUser.uid,
        name: childNameInput.value.trim(),
        avatar: selectedChildAvatar.value,
        assignedTrack: childTrackSelect.value
      };
      if (pinVal.length > 0) {
        childData.pinCode = pinVal;
      }

      const editId = editingChildId.value;
      if (editId) {
        // Edit existing profile
        try {
          await fetch(`/api/parent/children/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(childData)
          });
        } catch (err) { console.error('Error updating child:', err); }
      } else {
        // Create new child profile
        if (!childData.pinCode) childData.pinCode = '';
        try {
          await fetch('/api/parent/children', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(childData)
          });
        } catch (err) { console.error('Error adding child:', err); }
      }

      childModal.style.display = 'none';
      await fetchFamilyChildren();
      if (parentDashboardView && parentDashboardView.style.display !== 'none') {
        renderParentDashboard();
      }
    });
  }

  // Learner PIN Challenge Form Submit (Server-Side Verification)
  if (pinChallengeForm) {
    pinChallengeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const childId = targetChildId.value;
      const child = familyChildren.find(c => c.id === childId);
      const enteredPin = pinChallengeInput.value.trim();

      try {
        const res = await fetch(`/api/parent/children/${childId}/verify-pin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: enteredPin })
        });
        const data = await res.json();
        if (data.success && data.verified) {
          closeAccessibleModal(pinChallengeModal);
          if (child) setActiveChild(child);
          closeAccessibleModal(learnerModal);
          if (parentDashboardView && parentDashboardView.style.display !== 'none') {
            renderParentDashboard();
          }
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

  // Federated Auth Sign In Notice (Google, Apple, Microsoft)
  function handleOAuthNotice(providerName) {
    showToast(`${providerName} Sign-In`, `${providerName} Single Sign-On is being enabled for the upcoming mobile update. Please register or sign in with your Email and Password below.`, 'info', 6000);
  }

  if (googleSignInBtn) googleSignInBtn.addEventListener('click', () => handleOAuthNotice('Google'));
  if (appleSignInBtn) appleSignInBtn.addEventListener('click', () => handleOAuthNotice('Apple'));
  if (microsoftSignInBtn) microsoftSignInBtn.addEventListener('click', () => handleOAuthNotice('Microsoft'));

  if (homeGoogleSignInBtn) homeGoogleSignInBtn.addEventListener('click', () => handleOAuthNotice('Google'));
  if (homeAppleSignInBtn) homeAppleSignInBtn.addEventListener('click', () => handleOAuthNotice('Apple'));
  if (homeMicrosoftSignInBtn) homeMicrosoftSignInBtn.addEventListener('click', () => handleOAuthNotice('Microsoft'));

  // Email Sign In Form Submit (Modal)
  if (emailAuthForm) {
    emailAuthForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthAlert();
      const email = authEmailInput.value.trim();
      const password = authPasswordInput.value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          localStorage.setItem('lms_user', JSON.stringify(currentUser));
          updateAuthUI();
          await fetchFamilyChildren();
          closeAccessibleModal(authModal);
          switchView('parent');
        } else {
          showAuthAlert(data.error || 'Sign in failed.');
        }
      } catch (err) {
        showAuthAlert('Network error attempting sign in.');
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

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          localStorage.setItem('lms_user', JSON.stringify(currentUser));
          updateAuthUI();
          await fetchFamilyChildren();
          showToast('Welcome Back! 👋', `Signed in as ${data.user.displayName}`, 'success');
          switchView('parent');
        } else {
          showAuthAlert(data.error || 'Sign in failed.', 'error', homeAuthAlertMsg);
          showToast('Sign In Failed', data.error || 'Invalid credentials.', 'error');
        }
      } catch (err) {
        showAuthAlert('Network error attempting sign in.', 'error', homeAuthAlertMsg);
        showToast('Network Error', 'Failed to connect to authentication server.', 'error');
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

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName, email, password, role })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          localStorage.setItem('lms_user', JSON.stringify(currentUser));
          updateAuthUI();
          await fetchFamilyChildren();
          showAuthAlert('Account created successfully! Redirecting...', 'success');
          setTimeout(() => {
            closeAccessibleModal(authModal);
            switchView('parent');
          }, 800);
        } else {
          showAuthAlert(data.error || 'Registration failed.');
        }
      } catch (err) {
        showAuthAlert('Network error attempting registration.');
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

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName, email, password, role })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          localStorage.setItem('lms_user', JSON.stringify(currentUser));
          updateAuthUI();
          await fetchFamilyChildren();
          showAuthAlert('Account created successfully! Redirecting...', 'success', homeAuthAlertMsg);
          setTimeout(() => {
            switchView('parent');
          }, 800);
        } else {
          showAuthAlert(data.error || 'Registration failed.', 'error', homeAuthAlertMsg);
        }
      } catch (err) {
        showAuthAlert('Network error attempting registration.', 'error', homeAuthAlertMsg);
      }
    });
  }

  // Initialize Auth & Children State on Load
  (async function initMultiTenant() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
          localStorage.setItem('lms_user', JSON.stringify(currentUser));
        } else {
          currentUser = null;
          localStorage.removeItem('lms_user');
        }
      } else {
        currentUser = null;
        localStorage.removeItem('lms_user');
      }
    } catch (e) {
      console.warn('Session verification notice:', e);
      currentUser = null;
      localStorage.removeItem('lms_user');
    }
    
    updateAuthUI();
    await fetchFamilyChildren();

    // Default homepage view is Parent Sign In / Sign Up Landing View when unauthenticated
    if (!currentUser) {
      switchView('authLanding');
    } else {
      switchView('parent');
    }
  })();

  // --------------------------------------------------------------------------
  // FORM UX: PASSWORD REVEAL & STRENGTH METER ENGINE
  // --------------------------------------------------------------------------
  function initPasswordUX() {
    // 1. Password Reveal Toggles
    document.querySelectorAll('.btn-password-toggle').forEach(btn => {
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
      if (!pass) return { score: 0, label: 'Weak', class: 'weak', hint: 'Enter at least 6 characters' };
      let score = 0;
      if (pass.length >= 8) score += 1;
      if (/[A-Z]/.test(pass)) score += 1;
      if (/[a-z]/.test(pass)) score += 1;
      if (/[0-9]/.test(pass)) score += 1;
      if (/[^A-Za-z0-9]/.test(pass)) score += 1;

      if (score <= 1) return { score: 1, label: 'Weak', class: 'weak', hint: 'Use 8+ chars with letters & numbers' };
      if (score === 2) return { score: 2, label: 'Fair', class: 'fair', hint: 'Good start. Add uppercase or symbols' };
      if (score === 3 || score === 4) return { score: 3, label: 'Good', class: 'good', hint: 'Strong password. Excellent!' };
      return { score: 5, label: 'Excellent', class: 'strong', hint: 'Very strong secure password! 🛡️' };
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

    setupStrengthListener('homeSignUpPasswordInput', 'homePasswordStrengthContainer', 'homeStrengthFill', 'homeStrengthLabel', 'homeStrengthCriteria');
    setupStrengthListener('signUpPasswordInput', 'modalPasswordStrengthContainer', 'modalStrengthFill', 'modalStrengthLabel', 'modalStrengthCriteria');

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
    attachLiveValidator('authEmailInput', v => emailRegex.test(v.trim()));
    attachLiveValidator('homeAuthEmailInput', v => emailRegex.test(v.trim()));
    attachLiveValidator('signUpEmailInput', v => emailRegex.test(v.trim()));
    attachLiveValidator('homeSignUpEmailInput', v => emailRegex.test(v.trim()));
    attachLiveValidator('signUpPasswordInput', v => v.length >= 6);
    attachLiveValidator('homeSignUpPasswordInput', v => v.length >= 6);
  }

  function setupEventListeners() {
    initPasswordUX();

    mobileSidebarOpen.addEventListener('click', () => {
      sidebar.classList.add('open');
      mobileSidebarClose.focus();
    });
    mobileSidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('open');
      mobileSidebarOpen.focus();
    });

    moduleTabNav.querySelectorAll('.tab-btn').forEach(btn => {
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

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
          console.log('✓ Service Worker registered for offline study:', reg.scope);
        }).catch(err => {
          console.warn('Service Worker registration failed:', err);
        });
      });
    }

    // Online / Offline Connectivity Notifications
    window.addEventListener('offline', () => {
      showToast('Offline Mode Active', 'You are currently offline. Full course curriculum & voice scripts remain available from offline cache.', 'info', 5000);
    });
    window.addEventListener('online', () => {
      showToast('Back Online 🌐', 'Internet connection restored. Progress will sync with the server.', 'success', 4000);
    });

    // Client Error Telemetry Logging
    window.addEventListener('error', (e) => {
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
      fetch('/api/telemetry/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: e.reason ? (e.reason.message || String(e.reason)) : 'Unhandled Promise Rejection',
          stack: e.reason ? e.reason.stack : null,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    });
  }

});
