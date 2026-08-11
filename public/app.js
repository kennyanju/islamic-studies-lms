/* ==========================================================================
   Islamic Studies LMS - Single Page Application Engine with Teacher Portal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // App State
  let courseData = null;
  let activeModuleId = null;
  let activeTrack = localStorage.getItem('lms_track') || 'level1'; // level1 | level2 | teacher
  let activeTab = 'handout'; // handout | readaloud | teleprompter | answerkeys | quiz | slides | voicescript
  let currentSlideIndex = 0;
  let currentTpSlideIndex = 0;
  let tpFontSize = 'normal'; // normal | large | xlarge

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
  
  const trackL1 = document.getElementById('trackL1');
  const trackL2 = document.getElementById('trackL2');
  const trackTeacher = document.getElementById('trackTeacher');

  const sidebar = document.getElementById('sidebar');
  const mobileSidebarOpen = document.getElementById('mobileSidebarOpen');
  const mobileSidebarClose = document.getElementById('mobileSidebarClose');

  const modulesList = document.getElementById('modulesList');
  const modulesGrid = document.getElementById('modulesGrid');
  const progressPercent = document.getElementById('progressPercent');
  const progressBarFill = document.getElementById('progressBarFill');

  const dashboardView = document.getElementById('dashboardView');
  const moduleView = document.getElementById('moduleView');

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const searchResultsList = document.getElementById('searchResultsList');

  const printBtn = document.getElementById('printBtn');

  // Module Header elements
  const moduleCategory = document.getElementById('moduleCategory');
  const moduleTrackBadge = document.getElementById('moduleTrackBadge');
  const moduleTitle = document.getElementById('moduleTitle');
  const moduleDescription = document.getElementById('moduleDescription');
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

  // Slideshow Elements
  const slideContent = document.getElementById('slideContent');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const slideCounter = document.getElementById('slideCounter');
  const fullscreenSlidesBtn = document.getElementById('fullscreenSlidesBtn');
  
  const voiceScriptContent = document.getElementById('voiceScriptContent');

  if (window.marked) {
    marked.setOptions({
      gfm: true,
      breaks: true
    });
  }

  // Fetch Course Data
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
        .catch(e => console.error('Fatal: Could not load course data', e));
    });

  function initApp() {
    setupTheme();
    setupTrackButtons();
    setupVoices();
    renderSidebarModules();
    renderDashboard();
    updateProgressUI();
    setupEventListeners();
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
    courseData.modules.forEach(mod => {
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

    let trackName = 'Level 1 (10 Years Old)';
    if (activeTrack === 'level2') trackName = 'Level 2 (13+ Years Old)';
    if (activeTrack === 'teacher') trackName = 'Teacher Portal & Teleprompter';
    moduleTrackBadge.textContent = trackName;

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
    if (window.marked && md) {
      handoutContent.innerHTML = marked.parse(md);
    } else {
      handoutContent.innerHTML = `<pre>${md || 'No handout content available.'}</pre>`;
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
    const key = `mod_${activeModuleId}`;
    userProgress[key] = !userProgress[key];
    localStorage.setItem('lms_progress', JSON.stringify(userProgress));
    
    renderSidebarModules();
    renderDashboard();
    updateProgressUI();
    renderHandout(courseData.modules.find(m => m.id === activeModuleId));
  });

  // --------------------------------------------------------------------------
  // TEACHER TELEPROMPTER & LIVE PRESENTATION CONTROLLER
  // --------------------------------------------------------------------------

  function renderTeleprompter(mod) {
    const slides = mod.teacher.parsedSlides || [];
    const scriptSlides = mod.teacher.parsedVoiceScript || [];
    const total = Math.max(slides.length, scriptSlides.length);

    if (total === 0) {
      tpSlideContent.innerHTML = '<p>No slides available for teleprompter.</p>';
      return;
    }

    currentTpSlideIndex = 0;
    updateTeleprompterDisplay(mod, slides, scriptSlides);

    tpPrevBtn.onclick = () => {
      if (currentTpSlideIndex > 0) {
        currentTpSlideIndex--;
        updateTeleprompterDisplay(mod, slides, scriptSlides);
      }
    };

    tpNextBtn.onclick = () => {
      const maxLen = Math.max(slides.length, scriptSlides.length);
      if (currentTpSlideIndex < maxLen - 1) {
        currentTpSlideIndex++;
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
    if (slide && window.marked && slide.content) {
      tpSlideContent.innerHTML = marked.parse(slide.content);
    } else {
      tpSlideContent.innerHTML = `<h3>${slide ? slide.title : 'Slide ' + (currentTpSlideIndex + 1)}</h3>`;
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

  // Teleprompter Font Size Controls
  tpFontDecBtn.addEventListener('click', () => {
    tpScriptText.classList.remove('font-xlarge');
    if (tpScriptText.classList.contains('font-large')) {
      tpScriptText.classList.remove('font-large');
    }
  });

  tpFontIncBtn.addEventListener('click', () => {
    if (!tpScriptText.classList.contains('font-large')) {
      tpScriptText.classList.add('font-large');
    } else {
      tpScriptText.classList.add('font-xlarge');
    }
  });

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

    if (window.marked && akRaw) {
      answerKeyContent.innerHTML = marked.parse(akRaw);
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
      block.innerHTML = `<i class="fa-solid fa-volume-low" style="opacity:0.3;margin-right:8px;font-size:0.85rem;"></i> ${sentence}`;
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

  // Render Interactive Quiz Engine
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
      if (window.marked && cleanMd) {
        quizQuestionsArea.innerHTML = `<div class="content-card"><div class="markdown-body">${marked.parse(cleanMd)}</div></div>`;
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
              <span class="opt-key">${opt.key})</span>
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
        wordBankHtml = `<div class="word-bank-box"><strong>Word Bank:</strong> ${pq.fillBlanks[0].wordBank.map(w => `<span>${w}</span>`).join(' ')}</div>`;
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

  // Submit and Grade Quiz
  submitQuizBtn.addEventListener('click', () => {
    const mod = courseData.modules.find(m => m.id === activeModuleId);
    if (!mod) return;

    let trackData = activeTrack === 'level2' ? mod.tracks.level2 : mod.tracks.level1;
    const mcqs = trackData.parsedQuestions.multipleChoice || [];

    let correctCount = 0;
    let totalCount = mcqs.length;

    mcqs.forEach(q => {
      const qBox = quizQuestionsArea.querySelector(`[data-q-num="${q.id}"]`);
      if (!qBox) return;

      const selectedOpt = qBox.querySelector('.opt-btn.selected');
      const optBtns = qBox.querySelectorAll('.opt-btn');

      optBtns.forEach(btn => {
        const key = btn.dataset.opt;
        if (q.correctAnswer && key === q.correctAnswer) {
          btn.classList.add('correct');
        } else if (selectedOpt && btn === selectedOpt && q.correctAnswer && key !== q.correctAnswer) {
          btn.classList.add('incorrect');
        }
      });

      if (selectedOpt && q.correctAnswer && selectedOpt.dataset.opt === q.correctAnswer) {
        correctCount++;
      }
    });

    if (totalCount > 0) {
      const scoreKey = `quiz_${activeModuleId}_${activeTrack}`;
      quizScores[scoreKey] = { score: correctCount, total: totalCount };
      localStorage.setItem('lms_quiz_scores', JSON.stringify(quizScores));
      showQuizScoreBanner(correctCount, totalCount);
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
  }

  // Render Slideshow Presentation Mode
  function renderSlides(mod) {
    const slides = mod.teacher.parsedSlides || [];
    if (slides.length === 0) {
      slideContent.innerHTML = mod.teacher.slidesMd ? marked.parse(mod.teacher.slidesMd) : '<p>No slide presentation deck available.</p>';
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
    if (window.marked && cur.content) {
      slideContent.innerHTML = marked.parse(cur.content);
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

  // Render Teacher Voice Script
  function renderVoiceScript(mod) {
    const scriptMd = mod.teacher.voiceScriptMd;
    if (window.marked && scriptMd) {
      voiceScriptContent.innerHTML = marked.parse(scriptMd);
    } else {
      voiceScriptContent.innerHTML = `<pre>${scriptMd || 'No teacher voice script recorded for this module.'}</pre>`;
    }
  }

  // Calculate Overall Progress
  function updateProgressUI() {
    const completedMods = Object.keys(userProgress).filter(k => userProgress[k]).length;
    const total = 9;
    const pct = Math.round((completedMods / total) * 100);
    progressPercent.textContent = `${pct}%`;
    progressBarFill.style.width = `${pct}%`;
  }

  // Global Search Engine
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      clearSearchBtn.style.display = 'none';
      searchResultsContainer.style.display = 'none';
      return;
    }

    clearSearchBtn.style.display = 'block';
    searchResultsContainer.style.display = 'block';

    const results = [];
    courseData.modules.forEach(mod => {
      const h10 = mod.tracks.level1.handoutMd.toLowerCase();
      const h13 = mod.tracks.level2.handoutMd.toLowerCase();
      
      if (mod.title.toLowerCase().includes(query) || mod.description.toLowerCase().includes(query)) {
        results.push({ module: mod, snippet: mod.description });
      } else if (h10.includes(query) || h13.includes(query)) {
        const snippetIdx = Math.max(0, h10.indexOf(query));
        const snippet = h10.substring(snippetIdx, snippetIdx + 120) + '...';
        results.push({ module: mod, snippet });
      }
    });

    searchResultsList.innerHTML = '';
    if (results.length === 0) {
      searchResultsList.innerHTML = '<p class="text-muted">No matching course lessons found.</p>';
      return;
    }

    results.forEach(res => {
      const item = document.createElement('div');
      item.className = 'search-item';
      item.innerHTML = `
        <div class="search-item-header">
          <span>Module ${res.module.id}: ${res.module.title}</span>
          <span class="category-badge">${res.module.category}</span>
        </div>
        <div class="search-item-snippet">${res.snippet}</div>
      `;
      item.addEventListener('click', () => {
        openModule(res.module.id);
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        searchResultsContainer.style.display = 'none';
      });
      searchResultsList.appendChild(item);
    });
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchResultsContainer.style.display = 'none';
  });

  // Print PDF Handler
  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Setup Event Listeners
  function setupEventListeners() {
    mobileSidebarOpen.addEventListener('click', () => sidebar.classList.add('open'));
    mobileSidebarClose.addEventListener('click', () => sidebar.classList.remove('open'));

    moduleTabNav.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (['TEXTAREA', 'INPUT', 'SELECT'].includes(document.activeElement.tagName)) return;

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
  }

});
