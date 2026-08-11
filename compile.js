const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const modulesConfig = [
  {
    id: 1,
    folder: '1 — Foundations of Belief',
    mdDir: 'MD Foundations of Belief',
    title: 'Foundations of Belief',
    category: 'Aqidah (Creed)',
    description: 'Explore Tawhid, the Ash\'ari creed, Pillars of Iman vs. Islam, Angels, Divine Books, and the Maliki perspective.',
    icon: 'fa-kaaba'
  },
  {
    id: 2,
    folder: '2— Purification & Prayer',
    mdDir: 'MD Purification & Prayer',
    title: 'Purification & Prayer',
    category: 'Fiqh (Jurisprudence)',
    description: 'Master Taharah, Wudu, Ghusl, Tayammum, Fard and Sunnah elements of Salah according to Maliki fiqh.',
    icon: 'fa-hands-wash'
  },
  {
    id: 3,
    folder: '3 — Seerah The Early Life of the Prophet ',
    mdDir: 'MD Seerah The Early Life of the Prophet ',
    title: 'Seerah: Early Life of the Prophet ﷺ',
    category: 'Seerah (History)',
    description: 'Trace the noble lineage, birth, youth, marriage to Khadijah (RA), and early revelation of Prophet Muhammad ﷺ.',
    icon: 'fa-book-quran'
  },
  {
    id: 4,
    folder: '4— Deepening Belief & the Quran',
    mdDir: 'MD Deepening Belief & the Quran',
    title: 'Deepening Belief & the Quran',
    category: 'Aqidah & Quran',
    description: 'Understand the miracles of the Quran, Divine Attributes, Al-Qadar (Destiny), and strengthening inner conviction.',
    icon: 'fa-scroll'
  },
  {
    id: 5,
    folder: '5— Fiqh of Fasting Zakah & Community',
    mdDir: 'MD Fiqh of Fasting Zakah & Community',
    title: 'Fiqh of Fasting, Zakah & Community',
    category: 'Fiqh (Jurisprudence)',
    description: 'Comprehensive guide to Sawm (Fasting), Zakat calculation, Eid celebrations, and community worship.',
    icon: 'fa-moon'
  },
  {
    id: 6,
    folder: '6— Seerah Madinah & the Building of a Community',
    mdDir: 'MD Seerah Madinah & the Building of a Community',
    title: 'Seerah: Madinah & Building a Community',
    category: 'Seerah (History)',
    description: 'The Hijrah to Madinah, building the Prophet\'s Mosque, the Constitution of Madinah, and key historical battles.',
    icon: 'fa-mosque'
  },
  {
    id: 7,
    folder: '7— Applied Fiqh & Everyday Life',
    mdDir: 'MD Applied Fiqh & Everyday Life',
    title: 'Applied Fiqh & Everyday Life',
    category: 'Fiqh (Jurisprudence)',
    description: 'Practical halal and haram in food, finance, clothing, digital ethics, and everyday decision-making.',
    icon: 'fa-scale-balanced'
  },
  {
    id: 8,
    folder: '8— Character, Society & Family',
    mdDir: 'MD Character, Society & Family',
    title: 'Character, Society & Family',
    category: 'Akhlaq & Adab (Ethics)',
    description: 'Islamic etiquette (Adab), honoring parents, family rights, honesty, humility, and avoiding social vices.',
    icon: 'fa-heart'
  },
  {
    id: 9,
    folder: '9— Seerah, History & Living Faith Today',
    mdDir: 'MD Seerah, History & Living Faith Today',
    title: 'Seerah, History & Living Faith Today',
    category: 'Seerah & Modern Life',
    description: 'The Conquest of Makkah, Farewell Pilgrimage, legacy of the Sahabah, and applying Islam in contemporary society.',
    icon: 'fa-compass'
  }
];

function findMdFile(dir, pattern) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (!f.toLowerCase().endsWith('.md')) continue;
    const fullPath = path.join(dir, f);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isFile() && pattern.test(f)) {
        return fullPath;
      }
    } catch (e) {}
  }
  return null;
}

function parseQuestionsComprehensive(markdownText) {
  if (!markdownText) return { multipleChoice: [], fillBlanks: [], matching: [], reflection: [], answerKeyRaw: '', studentQuestionsMd: '' };

  const lines = markdownText.split(/\r?\n/);
  const mcq = [];
  const fillBlanks = [];
  const matching = [];
  const reflection = [];
  const answerKeyLines = [];
  const studentLines = [];

  let inAnswerKey = false;
  let currentSection = '';
  let currentMcq = null;
  let wordBank = [];
  let currentMatchGroup = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Detect Answer Key section at bottom of file
    if (/^(##|###)\s*.*(Answer\s+Key|Marking\s+Guide|Teacher\s+Answers)/i.test(trimmed)) {
      inAnswerKey = true;
      continue;
    }

    if (inAnswerKey) {
      answerKeyLines.push(line);
      continue;
    }

    studentLines.push(line);

    // Detect Section Headers
    if (/^(##|###|####)\s*(Part\s*(A|1)|Questions)/i.test(trimmed) || /Multiple\s+Choice/i.test(trimmed)) {
      if (currentMcq) { mcq.push(currentMcq); currentMcq = null; }
      currentSection = 'MCQ';
      continue;
    } else if (/^(##|###|####)\s*Part\s*(B|2)/i.test(trimmed) && /True\s+or\s+False/i.test(trimmed)) {
      if (currentMcq) { mcq.push(currentMcq); currentMcq = null; }
      currentSection = 'TF';
      continue;
    } else if (/^(##|###|####)\s*Part\s*(B|2)/i.test(trimmed) && /Fill\s+in/i.test(trimmed)) {
      if (currentMcq) { mcq.push(currentMcq); currentMcq = null; }
      currentSection = 'FIB';
      continue;
    } else if (/^(##|###|####)\s*Part\s*C/i.test(trimmed) || /Matching/i.test(trimmed)) {
      if (currentMcq) { mcq.push(currentMcq); currentMcq = null; }
      currentSection = 'MATCH';
      continue;
    } else if (/^(##|###|####)\s*Part\s*(D|3|4)/i.test(trimmed) || /Short\s+Answer|Reflection|Scenario/i.test(trimmed)) {
      if (currentMcq) { mcq.push(currentMcq); currentMcq = null; }
      currentSection = 'REFLECT';
      continue;
    }

    // MCQ Parsing
    if (currentSection === 'MCQ') {
      const qMatch = trimmed.match(/^(?:####|###|##)?\s*(?:\*\*)?\s*(\d+)\s*[\.\)]\s*(.*?)(?:\*\*)?$/);
      const optMatch = trimmed.match(/^(?:\*\s*)?\(?\s*([a-dA-D])[\.\)]\s*(.*)/);

      if (qMatch && !optMatch) {
        if (currentMcq) mcq.push(currentMcq);
        currentMcq = {
          id: parseInt(qMatch[1], 10),
          question: qMatch[2].replace(/^\*\*|\*\*$/g, '').trim(),
          options: []
        };
      } else if (currentMcq && optMatch) {
        currentMcq.options.push({
          key: optMatch[1].toUpperCase(),
          text: optMatch[2].replace(/^\*\*|\*\*$/g, '').trim()
        });
      }
    }
    // True/False Parsing
    else if (currentSection === 'TF') {
      const tfMatch = trimmed.match(/^(?:####|###|##)?\s*(?:\*\*)?\s*(\d+)\s*[\.\)]\s*(.*?)(?:\*\*)?$/);
      if (tfMatch && !trimmed.toLowerCase().includes('true or false?')) {
        if (currentMcq) mcq.push(currentMcq);
        currentMcq = {
          id: parseInt(tfMatch[1], 10),
          question: tfMatch[2].replace(/^\*\*|\*\*$/g, '').trim(),
          options: [
            { key: 'A', text: 'True' },
            { key: 'B', text: 'False' }
          ]
        };
      }
    }
    // Fill in the Blanks Parsing
    else if (currentSection === 'FIB') {
      if (trimmed.includes('Vocabulary Bank:') || trimmed.includes('Word Bank:')) {
        const wbMatch = trimmed.match(/(Vocabulary|Word) Bank:\s*\*?([^*]+)\*?/i);
        if (wbMatch) {
          wordBank = wbMatch[2].replace(/\*/g, '').split(/,|\n/).map(w => w.trim()).filter(Boolean);
        }
      } else {
        const fibMatch = trimmed.match(/^(?:####|###|##)?\s*(?:\*\*)?\s*(\d+)\s*[\.\)]\s*(.*?)(?:\*\*)?$/);
        if (fibMatch) {
          fillBlanks.push({
            id: parseInt(fibMatch[1], 10),
            text: fibMatch[2].replace(/^\*\*|\*\*$/g, '').trim(),
            wordBank
          });
        }
      }
    }
    // Matching Parsing
    else if (currentSection === 'MATCH') {
      if (trimmed.startsWith('#')) {
        currentMatchGroup = trimmed.replace(/^#+\s*/, '').trim();
      } else if (trimmed.includes('───') || trimmed.includes('->')) {
        const delim = trimmed.includes('───') ? '───' : '->';
        const parts = trimmed.replace(/^\*\s*/, '').split(delim);
        if (parts.length === 2) {
          matching.push({
            group: currentMatchGroup,
            left: parts[0].trim(),
            right: parts[1].trim()
          });
        }
      }
    }
    // Reflection / Short Answer Parsing
    else if (currentSection === 'REFLECT') {
      const refMatch = trimmed.match(/^(?:####|###|##)?\s*(?:\*\*)?\s*(\d+)\s*[\.\)]\s*(.*?)(?:\*\*)?$/);
      if (refMatch) {
        reflection.push({
          id: parseInt(refMatch[1], 10),
          question: refMatch[2].replace(/^\*\*|\*\*$/g, '').trim()
        });
      }
    }
  }

  if (currentMcq) {
    mcq.push(currentMcq);
  }

  const answerKeyRaw = answerKeyLines.join('\n').trim();
  const studentQuestionsMd = studentLines.join('\n').trim();

  // Extract correct answers from answerKeyRaw
  mcq.forEach(q => {
    const keyRegex1 = new RegExp(`(?:^|\\n)\\s*${q.id}\\.\\s*(?:\\*\\*)?\\s*\\(?([a-dA-D])\\)?`, 'i');
    const m1 = answerKeyRaw.match(keyRegex1);
    if (m1) {
      q.correctAnswer = m1[1].toUpperCase();
    } else {
      const tfRegex = new RegExp(`(?:^|\\n)\\s*${q.id}\\.\\s*(?:\\*\\*)?\\s*(True|False)`, 'i');
      const mTF = answerKeyRaw.match(tfRegex);
      if (mTF) {
        q.correctAnswer = mTF[1].toLowerCase() === 'true' ? 'A' : 'B';
      }
    }
  });

  return {
    multipleChoice: mcq,
    fillBlanks,
    matching,
    reflection,
    answerKeyRaw,
    studentQuestionsMd
  };
}

function parseSlidesFast(slidesMd) {
  if (!slidesMd) return [];
  const lines = slidesMd.split(/\r?\n/);
  const slides = [];
  let currentSlide = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('# Slide') || trimmed.startsWith('## Slide') || (trimmed.startsWith('# ') && slides.length > 0 && line.length < 50)) {
      if (currentSlide) {
        currentSlide.content = currentSlide.lines.join('\n');
        delete currentSlide.lines;
        slides.push(currentSlide);
      }
      currentSlide = {
        slideNum: slides.length + 1,
        title: trimmed.replace(/^#+\s*/, ''),
        lines: [line]
      };
    } else {
      if (!currentSlide) {
        currentSlide = {
          slideNum: 1,
          title: 'Slide 1',
          lines: []
        };
      }
      currentSlide.lines.push(line);
    }
  }
  if (currentSlide) {
    currentSlide.content = currentSlide.lines.join('\n');
    delete currentSlide.lines;
    slides.push(currentSlide);
  }
  return slides;
}

console.log('Compiling course modules...');

const courseData = {
  compiledAt: new Date().toISOString(),
  totalModules: modulesConfig.length,
  modules: []
};

modulesConfig.forEach(cfg => {
  const fullMdDir = path.join(rootDir, cfg.folder, cfg.mdDir);
  
  const handout10Path = findMdFile(fullMdDir, /(handout|student_handout)_10/i);
  const questions10Path = findMdFile(fullMdDir, /questions_10/i);
  
  const handout13Path = findMdFile(fullMdDir, /(handout|student_handout)_13/i);
  const questions13Path = findMdFile(fullMdDir, /questions_13/i);
  
  const slidesPath = findMdFile(fullMdDir, /teacher_slides/i);

  const voiceScriptDir = path.join(rootDir, 'Voice Script for teacher');
  const voiceScriptPath = findMdFile(voiceScriptDir, new RegExp(`${cfg.id}\\s*—.*Voice Script`, 'i')) ||
                          findMdFile(voiceScriptDir, new RegExp(`${cfg.id}\\s*—`, 'i'));

  const handout10Raw = handout10Path ? fs.readFileSync(handout10Path, 'utf8') : '';
  const handout13Raw = handout13Path ? fs.readFileSync(handout13Path, 'utf8') : '';
  const questions10Raw = questions10Path ? fs.readFileSync(questions10Path, 'utf8') : '';
  const questions13Raw = questions13Path ? fs.readFileSync(questions13Path, 'utf8') : '';
  const slidesRaw = slidesPath ? fs.readFileSync(slidesPath, 'utf8') : '';
  const voiceScriptRaw = voiceScriptPath ? fs.readFileSync(voiceScriptPath, 'utf8') : '';

  const parsedQ10 = parseQuestionsComprehensive(questions10Raw);
  const parsedQ13 = parseQuestionsComprehensive(questions13Raw);
  const parsedSlides = parseSlidesFast(slidesRaw);

  courseData.modules.push({
    id: cfg.id,
    title: cfg.title,
    category: cfg.category,
    description: cfg.description,
    icon: cfg.icon,
    tracks: {
      level1: {
        targetAge: '10 Years Old (Level 1)',
        handoutMd: handout10Raw,
        questionsMd: questions10Raw,
        parsedQuestions: parsedQ10
      },
      level2: {
        targetAge: '13+ Years Old (Level 2)',
        handoutMd: handout13Raw,
        questionsMd: questions13Raw,
        parsedQuestions: parsedQ13
      }
    },
    teacher: {
      slidesMd: slidesRaw,
      parsedSlides: parsedSlides,
      voiceScriptMd: voiceScriptRaw
    }
  });

  console.log(`✓ Processed Module ${cfg.id}: ${cfg.title}`);
});

const outputPath = path.join(publicDir, 'course_data.json');
fs.writeFileSync(outputPath, JSON.stringify(courseData, null, 2), 'utf8');

console.log(`Successfully compiled course data to ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
