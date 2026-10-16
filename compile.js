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
    description:
      "Explore Tawhid, Ash'ari creed, Pillars of Iman vs. Islam, Angels, Divine Books, and Maliki theological principles.",
    icon: 'fa-kaaba',
    estTime: '45 mins',
    bloomLevel: 'Understanding & Applying',
    objectives: [
      'Articulate the difference between Iman (faith) and Islam (practice) according to the Hadith of Jibril.',
      "Explain the 20 necessary attributes of Allah (Sifat Wajibah) in Ash'ari theological tradition.",
      "Identify foundational classical texts of Maliki Aqidah such as Al-Risala of Ibn Abi Zayd al-Qayrawani and Matn Ibn 'Ashir."
    ],
    malikiNotes:
      "Rooted in Al-'Aqidah al-Sanusiyyah and Al-Risala of Ibn Abi Zayd al-Qayrawani. Emphasizes Tanzih (divine transcendence without anthropomorphism)."
  },
  {
    id: 2,
    folder: '2— Purification & Prayer',
    mdDir: 'MD Purification & Prayer',
    title: 'Purification & Prayer',
    category: 'Fiqh (Jurisprudence)',
    description:
      'Master Taharah, Wudu, Ghusl, Tayammum, and Fard/Sunnah elements of Salah according to Maliki fiqh.',
    icon: 'fa-hands-wash',
    estTime: '60 mins',
    bloomLevel: 'Applying & Executing',
    objectives: [
      "List the 7 Obligatory Acts (Farad'i) of Wudu in Maliki fiqh, including Dalk (rubbing) and Muwalat (continuity).",
      'Distinguish between Fard (obligatory), Sunnah, and Mustahabb elements of ritual Salah.',
      'Demonstrate the prevalent Maliki position of Sadl (letting arms rest naturally) and Sujud as-Sahw (pre vs post salam).'
    ],
    malikiNotes:
      "Based on Al-Muwatta of Imam Malik and Matn Ibn 'Ashir. Notes 7 Fard of Wudu (Niyyah, Face, Arms, Head, Feet, Dalk, Muwalat) and Sadl during Qiyam."
  },
  {
    id: 3,
    folder: '3 — Seerah The Early Life of the Prophet ',
    mdDir: 'MD Seerah The Early Life of the Prophet ',
    title: 'Seerah: Early Life of the Prophet ﷺ',
    category: 'Seerah (History)',
    description:
      'Trace the noble lineage, birth, youth, marriage to Khadijah (RA), and early revelation of Prophet Muhammad ﷺ.',
    icon: 'fa-feather-pointed',
    estTime: '50 mins',
    bloomLevel: 'Analyzing & Synthesizing',
    objectives: [
      'Trace key biographical events from the Year of the Elephant to the first revelation in Cave Hira.',
      'Analyze the noble character (Al-Amin) of Prophet Muhammad ﷺ prior to prophethood.',
      'Extract practical leadership and moral lessons for contemporary Muslim youth.'
    ],
    malikiNotes:
      "Historical narrative drawn from Ibn Hisham and Al-Qadi 'Iyad's Al-Shifa, highlighting love for the Prophet ﷺ as an essential foundation of faith."
  },
  {
    id: 4,
    folder: '4— Deepening Belief & the Quran',
    mdDir: 'MD Deepening Belief & the Quran',
    title: 'Deepening Belief & the Quran',
    category: 'Aqidah & Quran',
    description:
      'Understand the miracles of the Quran, Divine Attributes, Al-Qadar (Destiny), and strengthening inner conviction.',
    icon: 'fa-scroll',
    estTime: '55 mins',
    bloomLevel: 'Evaluating & Reasoning',
    objectives: [
      "Explain the linguistic and spiritual inimitability (I'jaz) of the Noble Quran.",
      'Describe the correct understanding of Al-Qadar (Divine Decree) balancing divine will and human responsibility.',
      "Identify key Quranic preservation milestones during the era of Abu Bakr and 'Uthman (RA)."
    ],
    malikiNotes:
      "In accordance with classical Sunni creed (Ash'ari/Maturidi), affirming divine decree without fatalism or coercion."
  },
  {
    id: 5,
    folder: '5— Fiqh of Fasting Zakah & Community',
    mdDir: 'MD Fiqh of Fasting Zakah & Community',
    title: 'Fiqh of Fasting, Zakah & Community',
    category: 'Fiqh (Jurisprudence)',
    description:
      'Comprehensive guide to Sawm (Fasting), Zakat calculation, Eid celebrations, and community worship.',
    icon: 'fa-moon',
    estTime: '60 mins',
    bloomLevel: 'Applying & Analyzing',
    objectives: [
      'Detail the rules of Sawm (Fasting) in Ramadan including the validity of a single monthly Niyyah in Maliki fiqh.',
      'Calculate Zakah across gold, currency, and trade goods using Nisab benchmarks.',
      'Explain the community responsibilities associated with Zakat al-Fitr and Eid congregational prayers.'
    ],
    malikiNotes:
      'Reflects Mukhtasar Khalil and Al-Risala rulings on Sawm (single Niyyah on night 1 of Ramadan suffices) and Zakah thresholds.'
  },
  {
    id: 6,
    folder: '6— Seerah Madinah & the Building of a Community',
    mdDir: 'MD Seerah Madinah & the Building of a Community',
    title: 'Seerah: Madinah & Building a Community',
    category: 'Seerah (History)',
    description:
      "The Hijrah to Madinah, building the Prophet's Mosque, the Constitution of Madinah, and key historical battles.",
    icon: 'fa-mosque',
    estTime: '55 mins',
    bloomLevel: 'Analyzing & Reflecting',
    objectives: [
      "Examine the strategic significance of the Hijrah and the brotherhood (Mu'akhah) established in Madinah.",
      "Analyze the Covenant of Madinah (Sahifat al-Madinah) and how it established mutual rights, security, and justice across Madinah's tribes and religious communities.",
      'Understand the defensive context of key historical encounters (Badr, Uhud, Al-Khandaq).'
    ],
    malikiNotes:
      "Highlights the practice of the people of Madinah ('Amal Ahl al-Madinah') as a fundamental source of law in Maliki methodology."
  },
  {
    id: 7,
    folder: '7— Applied Fiqh & Everyday Life',
    mdDir: 'MD Applied Fiqh & Everyday Life',
    title: 'Applied Fiqh & Everyday Life',
    category: 'Fiqh (Jurisprudence)',
    description:
      'Practical halal and haram in food, finance, clothing, digital ethics, and everyday decision-making.',
    icon: 'fa-scale-balanced',
    estTime: '50 mins',
    bloomLevel: 'Applying & Decision Making',
    objectives: [
      'Apply Islamic ethical guidelines to modern financial transactions and consumer choices.',
      'Identify halal vs. haram principles in dietary laws, slaughter conditions, and digital ethics.',
      'Formulate principled decision-making frameworks for navigating complex contemporary social situations.'
    ],
    malikiNotes:
      'Applies Maliki legal maxims (Al-Qawa\'id al-Fiqhiyyah) such as "Al-Aslu fi al-Ashya\'i al-Ibahah" (permissibility is the baseline).'
  },
  {
    id: 8,
    folder: '8— Character, Society & Family',
    mdDir: 'MD Character, Society & Family',
    title: 'Character, Society & Family',
    category: 'Akhlaq & Adab (Ethics)',
    description:
      'Islamic etiquette (Adab), honoring parents, family rights, honesty, humility, and avoiding social vices.',
    icon: 'fa-heart',
    estTime: '45 mins',
    bloomLevel: 'Evaluating & Internalizing',
    objectives: [
      'Demonstrate high standards of Islamic interpersonal etiquette (Adab) with parents, elders, and neighbors.',
      'Evaluate spiritual diseases of the heart (pride, envy, ostentation) and their remedies.',
      'Implement strategies for conflict resolution and speech preservation in family life.'
    ],
    malikiNotes:
      "Draws from Imam Malik's teaching in Al-Muwatta' (Book of Good Character) that manners (Adab) precede knowledge, alongside Imam al-Bukhari's Al-Adab al-Mufrad."
  },
  {
    id: 9,
    folder: '9— Seerah, History & Living Faith Today',
    mdDir: 'MD Seerah, History & Living Faith Today',
    title: 'Seerah, History & Living Faith Today',
    category: 'Seerah & Modern Life',
    description:
      'The Conquest of Makkah, Farewell Pilgrimage, legacy of the Sahabah, and applying Islam in contemporary society.',
    icon: 'fa-compass',
    estTime: '50 mins',
    bloomLevel: 'Creating & Living Faith',
    objectives: [
      'Summarize the lessons of magnanimity and mercy demonstrated during Fath Makkah.',
      "Analyze the key human rights and equality proclamations in the Farewell Sermon (Khutbat al-Wada').",
      'Formulate a personal action plan for living an authentic, active Muslim life in contemporary global society.'
    ],
    malikiNotes:
      'Synthesizes Seerah with living faith, reflecting Imam Malik\'s principle: "Nothing will rectify the end of this nation except what rectified its beginning."'
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
    } catch (_e) {}
  }
  return null;
}

function parseQuestionsComprehensive(markdownText) {
  if (!markdownText)
    return {
      multipleChoice: [],
      fillBlanks: [],
      matching: [],
      reflection: [],
      answerKeyRaw: '',
      studentQuestionsMd: ''
    };

  const lines = markdownText.split(/\r?\n/);
  const mcq = [];
  const fillBlanks = [];
  const matching = [];
  const reflection = [];
  const answerKeyLines = [];
  const studentLines = [];

  let inAnswerKey = false;
  let inInlineKey = false;
  let currentSection = '';
  let currentMcq = null;
  let wordBank = [];
  let currentMatchGroup = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^#{1,4}\s*.*(Answer\s+Key|Marking\s+Guide|Teacher\s+Answers)/i.test(trimmed)) {
      inAnswerKey = true;
      inInlineKey = false;
      continue;
    }

    if (
      !inAnswerKey &&
      /^#{2,4}\s*(Fill\s+in\s+the\s+Blanks\s+Key|Matching\s+Key|Reflection\s+(?:Marking\s+)?Rubric)/i.test(
        trimmed
      )
    ) {
      inInlineKey = true;
      answerKeyLines.push(line);
      continue;
    }

    if (inInlineKey && /^#{2,4}\s*Part\s+[A-D1-4]/i.test(trimmed)) {
      inInlineKey = false;
    }

    if (inAnswerKey || inInlineKey) {
      if (!/^-{3,}$/.test(trimmed)) {
        answerKeyLines.push(line);
      }
      continue;
    }

    studentLines.push(line);

    if (
      /^(##|###|####)\s*(Part\s*(A|1)|Questions)/i.test(trimmed) ||
      (/^(##|###|####)/.test(trimmed) && /Multiple\s+Choice/i.test(trimmed))
    ) {
      if (currentMcq) {
        mcq.push(currentMcq);
        currentMcq = null;
      }
      currentSection = 'MCQ';
      continue;
    } else if (
      /^(##|###|####)\s*Part\s*(B|2)/i.test(trimmed) &&
      /True\s+or\s+False/i.test(trimmed)
    ) {
      if (currentMcq) {
        mcq.push(currentMcq);
        currentMcq = null;
      }
      currentSection = 'TF';
      continue;
    } else if (/^(##|###|####)\s*Part\s*(B|2)/i.test(trimmed) && /Fill\s+in/i.test(trimmed)) {
      if (currentMcq) {
        mcq.push(currentMcq);
        currentMcq = null;
      }
      currentSection = 'FIB';
      continue;
    } else if (
      /^(##|###|####)\s*Part\s*C/i.test(trimmed) ||
      (/^(##|###|####)/.test(trimmed) && /Matching/i.test(trimmed))
    ) {
      if (currentMcq) {
        mcq.push(currentMcq);
        currentMcq = null;
      }
      currentSection = 'MATCH';
      continue;
    } else if (
      /^(##|###|####)\s*(Part\s*(B|C|D|3|4)|.*?(Short\s+Answer|Reflection|Scenario|Essay))/i.test(
        trimmed
      )
    ) {
      if (currentMcq) {
        mcq.push(currentMcq);
        currentMcq = null;
      }
      currentSection = 'REFLECT';
      continue;
    }

    if (currentSection === 'MCQ') {
      const qMatch = trimmed.match(
        /^(?:####|###|##)?\s*(?:\*\*)?\s*(\d+)\s*[\.\)]\s*(.*?)(?:\*\*)?$/
      );
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
    } else if (currentSection === 'TF') {
      const tfMatch = trimmed.match(
        /^(?:####|###|##)?\s*(?:\*\*)?\s*(\d+)\s*[\.\)]\s*(.*?)(?:\*\*)?$/
      );
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
    } else if (currentSection === 'FIB') {
      if (trimmed.includes('Vocabulary Bank:') || trimmed.includes('Word Bank:')) {
        const wbMatch = trimmed.match(/(Vocabulary|Word) Bank:\s*\*?([^*]+)\*?/i);
        if (wbMatch) {
          wordBank = wbMatch[2]
            .replace(/\*/g, '')
            .split(/,|\n/)
            .map((w) => w.trim())
            .filter(Boolean);
        }
      } else {
        const fibMatch = trimmed.match(
          /^(?:####|###|##)?\s*(?:\*\*)?\s*(\d+)\s*[\.\)]\s*(.*?)(?:\*\*)?$/
        );
        if (fibMatch) {
          fillBlanks.push({
            id: parseInt(fibMatch[1], 10),
            text: fibMatch[2].replace(/^\*\*|\*\*$/g, '').trim(),
            wordBank
          });
        }
      }
    } else if (currentSection === 'MATCH') {
      if (trimmed.startsWith('#')) {
        currentMatchGroup = trimmed.replace(/^#+\s*/, '').trim();
      } else if (
        !/^-{3,}$/.test(trimmed) &&
        (trimmed.includes('───') || trimmed.includes('---') || trimmed.includes('->'))
      ) {
        const parts = trimmed
          .replace(/^\*\s*/, '')
          .replace(/^Pair\s+\d+:\s*/i, '')
          .split(/\s*(?:───|---|->)\s*/);
        if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
          matching.push({
            group: currentMatchGroup,
            left: parts[0].trim(),
            right: parts[1].trim()
          });
        }
      }
    } else if (currentSection === 'REFLECT') {
      const refMatch = trimmed.match(
        /^(?:####|###|##)?\s*(?:\*\*)?\s*(\d+)\s*[\.\)]\s*(.*?)(?:\*\*)?$/
      );
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

  // Parse correct answers and extract explanations from answerKeyRaw
  mcq.forEach((q) => {
    const keyRegex1 = new RegExp(
      `(?:^|\\n)\\s*${q.id}\\.\\s*(?:\\*\\*)?\\s*\\(?([a-dA-D])\\)?(?:[\\:\\-\\s]+(.*))?`,
      'i'
    );
    const m1 = answerKeyRaw.match(keyRegex1);
    if (m1) {
      q.correctAnswer = m1[1].toUpperCase();
      if (m1[2]) {
        q.explanation = m1[2].replace(/^\*\*|\*\*$/g, '').trim();
      }
    } else {
      const tfRegex = new RegExp(
        `(?:^|\\n)\\s*${q.id}\\.\\s*(?:\\*\\*)?\\s*(True|False)(?:[\\:\\-\\s]+(.*))?`,
        'i'
      );
      const mTF = answerKeyRaw.match(tfRegex);
      if (mTF) {
        q.correctAnswer = mTF[1].toLowerCase() === 'true' ? 'A' : 'B';
        if (mTF[2]) {
          q.explanation = mTF[2].replace(/^\*\*|\*\*$/g, '').trim();
        }
      }
    }
  });

  // Extract Fill in the Blanks answers and optional explanations from answerKeyRaw
  const fibKeyMatch = answerKeyRaw.match(
    /###?\s*(?:Fill in the Blanks Key|Part B[^\n]*)\s*([\s\S]*?)(?:###?|$)/i
  );
  if (fibKeyMatch) {
    const fibLines = fibKeyMatch[1].split(/\r?\n/);
    const fibKeyMap = {};
    const fibKeyArr = [];
    fibLines.forEach((l) => {
      const m = l.trim().match(/^(\d+)[\.\)]\s*(.*)/);
      if (m) {
        const [ansPart, ...expParts] = m[2].trim().split(/\s+[-—–]\s+/);
        const entry = {
          answer: ansPart
            .replace(/^\*\*|\*\*$/g, '')
            .replace(/\*/g, '')
            .trim(),
          explanation: expParts
            .join(' - ')
            .replace(/^\*\*|\*\*$/g, '')
            .trim()
        };
        fibKeyMap[parseInt(m[1], 10)] = entry;
        fibKeyArr.push(entry);
      }
    });
    fillBlanks.forEach((fb, idx) => {
      const entry = fibKeyMap[fb.id] || fibKeyMap[idx + 1] || fibKeyArr[idx];
      fb.answer = entry ? entry.answer : '';
      if (entry && entry.explanation) {
        fb.explanation = entry.explanation;
      }
    });
  }

  // Extract Reflection Rubric from answerKeyRaw if present
  let reflectionRubric = '';
  const rubricMatch = answerKeyRaw.match(
    /###?\s*(?:Part D:\s*)?Reflection\s+(?:Marking\s+)?Rubric\s*([\s\S]*?)(?:###?|$)/i
  );
  if (rubricMatch) {
    reflectionRubric = rubricMatch[1].trim();
  }

  return {
    multipleChoice: mcq,
    fillBlanks,
    matching,
    reflection,
    reflectionRubric,
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

    if (
      trimmed.startsWith('# Slide') ||
      trimmed.startsWith('## Slide') ||
      (trimmed.startsWith('# ') && slides.length > 0 && line.length < 50)
    ) {
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
      if (currentSlide) currentSlide.lines.push(line);
    }
  }
  if (currentSlide) {
    currentSlide.content = currentSlide.lines.join('\n');
    delete currentSlide.lines;
    slides.push(currentSlide);
  }
  return slides;
}

function parseVoiceScript(voiceScriptMd) {
  if (!voiceScriptMd) return [];
  const slides = [];
  const sections = voiceScriptMd.split(/\n(?=##\s+Slide\s+\d+)/i);
  sections.forEach((sec, idx) => {
    const trimmed = sec.trim();
    if (!trimmed || !trimmed.toLowerCase().includes('slide')) return;

    const titleMatch = trimmed.match(/##\s+Slide\s+\d+:?\s*(.*)/i);
    const summaryMatch = trimmed.match(/\*\s*\*\*Slide Summary:\*\*\s*(.*)/i);
    const directionMatch = trimmed.match(/\*\s*\*\*Delivery Direction:\*\*\s*(.*)/i);
    const scriptMatch = trimmed.match(
      /\*\s*\*\*Narrative Script(?:\s*\([^)]*\))?:\*\*\s*([\s\S]*?)(?=\n\*\s*\*\*|\n---|$)/i
    );
    const analogyMatch = trimmed.match(/\*\s*\*\*Concept Analogy:\*\*\s*(.*)/i);
    const checkMatch = trimmed.match(/\*\s*\*\*Check-for-Understanding Question:\*\*\s*(.*)/i);

    let rawScript = scriptMatch ? scriptMatch[1].trim().replace(/^"|"$/g, '') : '';
    // Clean script for human reading / browser teleprompter (strip inline ElevenLabs tags)
    const cleanScript = rawScript
      .replace(
        /\[(?:thoughtful|pause|short pause|warmly|excited|softly|curious|reverent)\]\s*/gi,
        ''
      )
      .replace(/\s+/g, ' ')
      .trim();

    let direction = directionMatch ? directionMatch[1].trim() : '';
    // Strip surrounding brackets and backticks from direction
    direction = direction.replace(/^[`\[]+|[`\]]+$/g, '').trim();

    let checkQuestion = checkMatch ? checkMatch[1].trim().replace(/^"|"$/g, '') : '';
    let checkAnswer = '';
    const answerMatch = checkQuestion.match(/\(Answer:\s*([\s\S]*?)\)\.?$/i);
    if (answerMatch) {
      checkAnswer = answerMatch[1].trim();
      checkQuestion = checkQuestion.replace(/\s*\(Answer:\s*[\s\S]*?\)\.?$/i, '').trim();
    }

    const directionText = direction.toLowerCase();
    const toneTag =
      idx === 0 || /welcome|excited|enthusiasm/.test(directionText)
        ? '[excited]'
        : /awe|wonder|slow|soft/.test(directionText)
          ? '[softly]'
          : /question|curious|discussion/.test(directionText)
            ? '[curious]'
            : '[warmly]';

    slides.push({
      slideNum: slides.length + 1,
      title: titleMatch ? titleMatch[1].trim() : `Slide ${idx + 1}`,
      summary: summaryMatch ? summaryMatch[1].trim() : '',
      direction,
      rawScript: rawScript ? `${toneTag} ${rawScript} [pause]` : '',
      script: cleanScript,
      analogy: analogyMatch ? analogyMatch[1].trim() : '',
      checkQuestion,
      checkAnswer,
      rawSection: trimmed
    });
  });
  return slides;
}

console.log('Compiling Islamic Studies course modules...');

const courseData = {
  compiledAt: new Date().toISOString(),
  totalModules: modulesConfig.length,
  curriculumStandard: "Maliki Fiqh & Ash'ari Creed Standard",
  modules: []
};

modulesConfig.forEach((cfg) => {
  const fullMdDir = path.join(rootDir, cfg.folder, cfg.mdDir);

  // Level 1 (Ages 6-8)
  const handout1Path = findMdFile(fullMdDir, /handout.*(level1|l1|age_?6|year_?1)/i);
  const questions1Path = findMdFile(fullMdDir, /questions.*(level1|l1|age_?6|year_?1)/i);

  // Level 2 (Ages 8-10)
  const handout2Path = findMdFile(fullMdDir, /handout.*(level2|l2|age_?8|year_?2)/i);
  const questions2Path = findMdFile(fullMdDir, /questions.*(level2|l2|age_?8|year_?2)/i);

  // Level 3 (Ages 10-12)
  const handout3Path =
    findMdFile(fullMdDir, /handout.*(level3|l3)/i) ||
    findMdFile(fullMdDir, /(handout|student_handout).*(10|year_?3)/i);
  const questions3Path =
    findMdFile(fullMdDir, /questions.*(level3|l3)/i) ||
    findMdFile(fullMdDir, /questions.*(10|year_?3)/i);

  // Level 4 (Ages 12-14)
  const handout4Path =
    findMdFile(fullMdDir, /handout.*(level4|l4)/i) ||
    findMdFile(fullMdDir, /(handout|student_handout).*(13|year_?4)/i);
  const questions4Path =
    findMdFile(fullMdDir, /questions.*(level4|l4)/i) ||
    findMdFile(fullMdDir, /questions.*(13|year_?4)/i);

  // Level 5 (Ages 14-16+)
  const handout5Path = findMdFile(fullMdDir, /handout.*(level5|l5|age_?15|senior|year_?5)/i);
  const questions5Path = findMdFile(fullMdDir, /questions.*(level5|l5|age_?15|senior|year_?5)/i);

  const slidesPath = findMdFile(fullMdDir, /teacher_slides/i);

  const voiceScriptDir = path.join(rootDir, 'Voice Script for teacher');
  const voiceScriptNestedDir = path.join(voiceScriptDir, 'Voice scripts');
  const voiceScriptPath =
    findMdFile(voiceScriptNestedDir, new RegExp(`${cfg.id}\\s*—.*Voice Script`, 'i')) ||
    findMdFile(voiceScriptNestedDir, new RegExp(`${cfg.id}\\s*—`, 'i')) ||
    findMdFile(voiceScriptDir, new RegExp(`${cfg.id}\\s*—.*Voice Script`, 'i')) ||
    findMdFile(voiceScriptDir, new RegExp(`${cfg.id}\\s*—`, 'i'));

  const handout1Raw = handout1Path ? fs.readFileSync(handout1Path, 'utf8') : '';
  const questions1Raw = questions1Path ? fs.readFileSync(questions1Path, 'utf8') : '';
  const handout2Raw = handout2Path ? fs.readFileSync(handout2Path, 'utf8') : '';
  const questions2Raw = questions2Path ? fs.readFileSync(questions2Path, 'utf8') : '';
  const handout3Raw = handout3Path ? fs.readFileSync(handout3Path, 'utf8') : '';
  const questions3Raw = questions3Path ? fs.readFileSync(questions3Path, 'utf8') : '';
  const handout4Raw = handout4Path ? fs.readFileSync(handout4Path, 'utf8') : '';
  const questions4Raw = questions4Path ? fs.readFileSync(questions4Path, 'utf8') : '';
  const handout5Raw = handout5Path ? fs.readFileSync(handout5Path, 'utf8') : '';
  const questions5Raw = questions5Path ? fs.readFileSync(questions5Path, 'utf8') : '';
  const slidesRaw = slidesPath ? fs.readFileSync(slidesPath, 'utf8') : '';
  const voiceScriptRaw = voiceScriptPath ? fs.readFileSync(voiceScriptPath, 'utf8') : '';

  const parsedQ1 = parseQuestionsComprehensive(questions1Raw);
  const parsedQ2 = parseQuestionsComprehensive(questions2Raw);
  const parsedQ3 = parseQuestionsComprehensive(questions3Raw);
  const parsedQ4 = parseQuestionsComprehensive(questions4Raw);
  const parsedQ5 = parseQuestionsComprehensive(questions5Raw);
  const parsedSlides = parseSlidesFast(slidesRaw);
  const parsedVoiceScript = parseVoiceScript(voiceScriptRaw);

  courseData.modules.push({
    id: cfg.id,
    title: cfg.title,
    category: cfg.category,
    description: cfg.description,
    icon: cfg.icon,
    estTime: cfg.estTime,
    bloomLevel: cfg.bloomLevel,
    objectives: cfg.objectives,
    malikiNotes: cfg.malikiNotes,
    tracks: {
      level1: {
        targetAge: 'Ages 6–8 (Level 1: Foundations of Wonder & Practice)',
        handoutMd: handout1Raw,
        questionsMd: questions1Raw,
        parsedQuestions: parsedQ1
      },
      level2: {
        targetAge: 'Ages 8–10 (Level 2: Habits of Devotion & Character)',
        handoutMd: handout2Raw,
        questionsMd: questions2Raw,
        parsedQuestions: parsedQ2
      },
      level3: {
        targetAge: 'Ages 10–12 (Level 3: Systematic Practice & Understanding)',
        handoutMd: handout3Raw,
        questionsMd: questions3Raw,
        parsedQuestions: parsedQ3
      },
      level4: {
        targetAge: 'Ages 12–14 (Level 4: Evidence, Law & Prophetic Mission)',
        handoutMd: handout4Raw,
        questionsMd: questions4Raw,
        parsedQuestions: parsedQ4
      },
      level5: {
        targetAge: 'Ages 14–16+ (Level 5: Advanced Analysis, Usul & Contemporary Living)',
        handoutMd: handout5Raw,
        questionsMd: questions5Raw,
        parsedQuestions: parsedQ5
      }
    },
    teacher: {
      slidesMd: slidesRaw,
      parsedSlides: parsedSlides,
      voiceScriptMd: voiceScriptRaw,
      parsedVoiceScript: parsedVoiceScript
    }
  });

  console.log(`✓ Processed Module ${cfg.id}: ${cfg.title}`);
});

// 1. Write full monolithic course_data.json
const outputPath = path.join(publicDir, 'course_data.json');
fs.writeFileSync(outputPath, JSON.stringify(courseData, null, 2), 'utf8');

// 2. Write individual module JSON files in public/course_data/
const courseDataDir = path.join(publicDir, 'course_data');
if (!fs.existsSync(courseDataDir)) {
  fs.mkdirSync(courseDataDir, { recursive: true });
}

courseData.modules.forEach((mod) => {
  const modPath = path.join(courseDataDir, `module_${mod.id}.json`);
  fs.writeFileSync(modPath, JSON.stringify(mod, null, 2), 'utf8');
});

// 3. Write lightweight modules_manifest.json (~15 KB)
const manifestData = {
  version: courseData.version,
  compiledAt: courseData.compiledAt,
  totalModules: courseData.totalModules,
  modules: courseData.modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    category: mod.category,
    description: mod.description,
    icon: mod.icon,
    estTime: mod.estTime,
    bloomLevel: mod.bloomLevel,
    objectives: mod.objectives,
    malikiNotes: mod.malikiNotes,
    tracksSummary: {
      level1: {
        targetAge: mod.tracks?.level1?.targetAge || 'Level 1 (6–8y)',
        hasHandout: Boolean(mod.tracks?.level1?.handoutMd),
        hasQuestions: Boolean(mod.tracks?.level1?.questionsMd),
        questionCount: (mod.tracks?.level1?.parsedQuestions?.multipleChoice || []).length
      },
      level2: {
        targetAge: mod.tracks?.level2?.targetAge || 'Level 2 (8–10y)',
        hasHandout: Boolean(mod.tracks?.level2?.handoutMd),
        hasQuestions: Boolean(mod.tracks?.level2?.questionsMd),
        questionCount: (mod.tracks?.level2?.parsedQuestions?.multipleChoice || []).length
      },
      level3: {
        targetAge: mod.tracks?.level3?.targetAge || 'Level 3 (10–12y)',
        hasHandout: Boolean(mod.tracks?.level3?.handoutMd),
        hasQuestions: Boolean(mod.tracks?.level3?.questionsMd),
        questionCount: (mod.tracks?.level3?.parsedQuestions?.multipleChoice || []).length
      },
      level4: {
        targetAge: mod.tracks?.level4?.targetAge || 'Level 4 (12–14y)',
        hasHandout: Boolean(mod.tracks?.level4?.handoutMd),
        hasQuestions: Boolean(mod.tracks?.level4?.questionsMd),
        questionCount: (mod.tracks?.level4?.parsedQuestions?.multipleChoice || []).length
      },
      level5: {
        targetAge: mod.tracks?.level5?.targetAge || 'Level 5 (14–16+y)',
        hasHandout: Boolean(mod.tracks?.level5?.handoutMd),
        hasQuestions: Boolean(mod.tracks?.level5?.questionsMd),
        questionCount: (mod.tracks?.level5?.parsedQuestions?.multipleChoice || []).length
      },
      teacher: {
        slideCount: (mod.teacher?.parsedSlides || []).length,
        hasVoiceScript: Boolean(mod.teacher?.voiceScriptMd)
      }
    }
  }))
};

const manifestPath = path.join(publicDir, 'modules_manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');

const manifestJsPath = path.join(publicDir, 'modules_manifest.js');
fs.writeFileSync(
  manifestJsPath,
  `window.__MODULES_MANIFEST__ = ${JSON.stringify(manifestData)};\n`,
  'utf8'
);

// 4. Update sw.js with build timestamp
const swPath = path.join(publicDir, 'sw.js');
if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  const buildTag = `islamic-studies-v${Date.now().toString(36)}`;
  swContent = swContent.replace(
    /const CACHE_NAME = 'islamic-studies-[^']+';/,
    `const CACHE_NAME = '${buildTag}';`
  );
  fs.writeFileSync(swPath, swContent, 'utf8');
}

console.log(`Successfully compiled course data:`);
console.log(
  `  - Monolithic: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`
);
console.log(
  `  - Manifest:   ${manifestPath} (${(fs.statSync(manifestPath).size / 1024).toFixed(1)} KB)`
);
console.log(`  - Modular:    ${courseDataDir}/ (${courseData.modules.length} module files)`);
