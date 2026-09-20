/**
 * Script to generate audio for all 23 slides using the Gemini TTS API.
 * Model: gemini-3.1-flash-tts-preview
 * Voice: Achird (Friendly, warm British English male voice)
 * 
 * Usage:
 *   export GEMINI_API_KEY="your-api-key-here"
 *   node generate_audio_gemini.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY or GOOGLE_API_KEY environment variable is not set.");
  console.error("Please run: export GEMINI_API_KEY='your_api_key' before running this script.");
  process.exit(1);
}

const client = new GoogleGenAI({ apiKey });

const outputDir = path.join(__dirname, 'audio_output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function pcmToWav(pcmData, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcmData.copy(buffer, 44);

  return buffer;
}

const slides = [
  {
    slideNumber: 1,
    title: "Islamic Creed (Aqidah) & Law (Fiqh) for Teachers",
    prompt: "Say in a warm, friendly, and welcoming British English male voice, with inspiring and gentle pacing: 'Bismillahir-Rahmanir-Rahim... Assalamu Alaikum wa Rahmatullahi wa Barakatuh... Welcome to our foundational journey through Islamic Creed — Aqeedah — and Islamic Law — Fiqh. In this unit, we will explore the most profound questions of our existence: Who is Allah? How do we understand His Beautiful Names and Necessary Attributes? What are the Six Pillars of Iman? How do Angels, Divine Books, Prophets, and the mystery of Divine Decree — Qadar — shape our worldview? Together, we will examine these sacred truths through the authentic, time-tested scholarship of the Ash'ari school of creed, and the Maliki school of jurisprudence... Let us begin with open minds, and receptive hearts.'"
  },
  {
    slideNumber: 2,
    title: "Introduction to Aqidah & Fiqh",
    prompt: "Say in a cheerful, friendly British English male voice, engaging the audience with warmth and lively contrast: 'Assalamu Alaikum, everyone! Welcome! Today, we begin by looking at the two essential dimensions of our faith: Aqeedah, and Fiqh. Think of Aqeedah as the roots of a mighty tree. You cannot see the roots, but they anchor the tree deep into the earth... Aqeedah is what we believe with certainty in our hearts — our conviction about Allah, His Angels, and the unseen realm. Fiqh, on the other hand, is like the trunk, branches, leaves, and sweet fruit of that tree... It is the practical guide for how we live — how we perform Wudu, how we offer Salah, and how we treat our families and communities. In this series, we learn through the lens of two classical schools of thought: the Ash'ari school of creed, and the Maliki school of law. Why do we follow a systematic school — a Madhhab? Because it builds deep theological literacy, and teaches us to appreciate the rich, brilliant heritage of Islamic scholarship across centuries.'"
  },
  {
    slideNumber: 3,
    title: "Who is Allah? The Core Principle of Tawhid",
    prompt: "Say in a reverent, awe-inspired, and friendly British English male voice, speaking deliberately with quiet wonder: 'Let us ask the most important question in the entire universe... Who is Allah? The answer is captured in one monumental word: Tawheed... Tawheed is the uncompromising, absolute belief that Allah is One... He is Al-Wahid, and Al-Ahad — The Singular, the Unique, the Absolutely Indivisible. He has no partners, no parents, no children, and no equals whatsoever. In the Ash'ari school of theology, scholars emphasize that the very first obligation — the first Wajib — upon any Muslim who reaches maturity, is to know Allah... Not merely by memorizing phrases, but by reflecting deeply upon creation... using our God-given intellect to recognize the magnificent Creator behind it all.'"
  },
  {
    slideNumber: 4,
    title: "Knowing Allah through His Necessary Attributes (Sifat al-Wajibah)",
    prompt: "Say in a clear, methodical, and friendly British English male voice, enunciating each category with calm educational precision: 'To truly know Allah, scholars organized what the Quran and reason teach us into twenty necessary attributes, called Sifaat al-Waajibah. In Ash'ari creed, these twenty attributes are arranged into four clear groups. First: Nafsiyyah — the Personal Attribute, which is Wujud — the eternal Existence of Allah. Second: Salbiyyah — the Negative or Exclusionary attributes, which negate any flaw from Allah. These include His beginninglessness, Qidam; His endlessness, Baqa'; His absolute difference from creation, Mukhalafah; His self-subsistence, Qiyam bi-Nafsih; and His absolute Oneness, Wahdaniyyah. Third: Sifaat al-Ma'ani — the Qualitative attributes. These are Allah's Divine Power, Qudrah; Will, Iradah; Knowledge, 'Ilm; Life, Hayat; Hearing, Sam'; Sight, Basar; and Divine Speech, Kalam. And fourth: Sifaat al-Ma'nawiyyah — the Active State attributes, meaning that Allah is perpetually and actively Powerful, Willful, Knowing, Living, Hearing, Seeing, and Speaking. Remember: Allah's hearing and seeing are not like ours... He does not need ears, eyes, or instruments. His attributes are perfect, eternal, and without limits.'"
  },
  {
    slideNumber: 5,
    title: "Transcending Space and Time (Mukhalafah lil-Hawadith)",
    prompt: "Say in an inspiring, confident, and friendly British English male voice, with expansive warmth and clarity: 'This leads us to one of the most foundational principles in Sunni theology: Mukhaalafah lil-Hawaadith. This means that Allah is completely, utterly different from created things... Allah is not a physical body — He is not a Jirm. He does not occupy physical space, nor is He located in a direction. Why? Because Allah is the Creator of space, and He is the Creator of time! Since He created them, He cannot be bounded or trapped inside them... As Allah states clearly in Surah ash-Shura: Laysa kamithlihi shay'un — 'There is nothing like unto Him.' Our classical Imams left us a golden rule to remember: Whatever image or concept crosses your human mind... Allah is completely different from that.'"
  },
  {
    slideNumber: 6,
    title: "The Names of Allah (Al-Asma' al-Husna)",
    prompt: "Say in a gentle, heartfelt, and friendly British English male voice, speaking with tender warmth and personal resonance: 'Allah has made Himself known to us through His most beautiful names: Al-Asma' al-Husna. The Prophet, sallallahu alayhi wa sallam, taught us in Sahih al-Bukhari: 'Allah has ninety-nine names, one hundred less one. Whoever guards and lives by them will enter Paradise.' Guarding them does not mean merely reciting them like a list... It means understanding how Allah manifests His care and majesty in our lives. When you feel down or make a mistake, you call upon Al-Ghaffar — The Repeatedly Forgiving... When you need sustenance, health, or success in school, you beseech Al-Razzaq — The Supreme Provider... When life feels confusing, you trust in Al-Hakim — The Perfectly Wise... Every name is a doorway to love, awe, and an intimate connection with your Lord.'"
  },
  {
    slideNumber: 7,
    title: "Ash'ari Reading of Sacred Texts: Tafwid and Ta'wil",
    prompt: "Say in a thoughtful, scholarly, and friendly British English male voice, delivering balanced theology with measured calm: 'In the Quran, we sometimes encounter phrases like the 'Hand' — Yad — of Allah, the 'Face' — Wajh — of Allah, or Allah 'establishing' over the Throne — Al-Istiwa'. Since we know beyond doubt that Allah is free from having a physical body or human parts, how do orthodox Sunni scholars read these texts? They follow two valid, noble methodologies. First: Tafweed — the way of the early generations, the Salaf. In Tafweed, we affirm the sacred wording as revealed, we strip away any physical or bodily meaning, and we say: 'Allah knows best the true reality of His words.' Second: Ta'weel — the method formalized by later scholars, the Khalaf. Ta'weel provides a figurative, metaphorical interpretation consistent with classical Arabic language. For example, 'Hand' is understood as Divine Power, Qudrah, or Divine Generosity, Ni'mah. And Istiwa' over the Throne is understood as Supreme Sovereignty and Control, Istila'. Both Tafweed and Ta'weel share the exact same foundation: they completely protect our belief from Tashbeeh — the error of comparing Allah to human beings.'"
  },
  {
    slideNumber: 8,
    title: "The Six Pillars of Iman (Overview)",
    prompt: "Say in an engaging, enthusiastic, and friendly British English male voice, clearly introducing a core roadmap: 'Now let us turn to the structural foundation of our inner religion: the Six Pillars of Iman. In the renowned Hadith of Jibril, the Archangel Jibril came in the form of a traveler in pure white garments to question the Prophet, sallallahu alayhi wa sallam, in front of the Companions. When asked, 'What is Iman?', the Messenger of Allah replied that faith is to firmly believe in six truths: One: Allah. Two: His Angels. Three: His Revealed Scriptures. Four: His Messengers. Five: The Last Day. And six: Divine Decree — Qadar — both its sweet, and its bitter. Notice the crucial distinction: Islam refers to our outer, physical acts of obedience — like praying and fasting. Iman refers to the unshakable conviction anchored deep within our hearts.'"
  },
  {
    slideNumber: 9,
    title: "Iman in Allah and His Attributes of Power, Will, and Knowledge",
    prompt: "Say in a reflective, wonder-filled, and friendly British English male voice, painting a clear picture with gentle pauses: 'In Ash'ari Aqeedah, three central divine attributes help us understand how Allah acts within our universe: Knowledge, Will, and Power. First: Al-'Ilm — Divine Knowledge. Allah knows everything that was, everything that is, and everything that will ever be... eternally, and without learning. Second: Al-Iradah — Divine Will. Allah specifies which possibilities happen, choosing exact timings, forms, and conditions. Third: Al-Qudrah — Divine Power. Allah brings those willed possibilities from non-existence into real existence. Reflect on a single autumn leaf fluttering from an oak tree... Allah's 'Ilm eternally knew that leaf would fall at precisely three seconds past noon. His Iradah specified that it should fall at that exact second rather than any other. And His Qudrah exercised the power that detached the leaf and guided it gracefully to the earth... Nothing in existence escapes this divine harmony.'"
  },
  {
    slideNumber: 10,
    title: "Angels: Creation, Nature, and Characteristics",
    prompt: "Say in a serene, wondrous, and friendly British English male voice, filled with tranquil reverence: 'Now we arrive at the second pillar of faith: Angels — Mala'ikah. Angels are noble, luminous creations of Allah, crafted from pure light — Nur. They are completely different from human beings. They have no physical gender — they are neither male nor female. They do not eat, they do not drink, they do not sleep, and they never grow weary or tired. Crucially, angels do not possess human free will. They cannot choose to rebel or disobey their Lord. As Allah describes them in Surah at-Tahrim: 'They do not disobey Allah in whatever He commands them, and they carry out exactly what they are ordered.' Their entire existence is perpetual praise, service, and flawless execution of the divine decree.'"
  },
  {
    slideNumber: 11,
    title: "The Major Angels and Their Duties",
    prompt: "Say in a deliberate, solemn, yet friendly British English male voice, speaking with clear, majestic pacing: 'While Allah created uncounted legions of angels, revelation introduces us to four supreme Archangels, each entrusted with a vital cosmic mission. First: Jibreel — the Archangel of Revelation, Wahy. Jibreel conveyed the sacred words of Allah to the hearts of all the Prophets. Second: Mika'eel — responsible for the elements: rain, the nourishment of crops, and the distribution of sustenance — Rizq — by Allah's permission. Third: Israfeel — the blower of the mighty Trumpet, As-Soor. Israfeel stands poised, awaiting the divine command to blow the blast that ends this world, and the second blast that initiates the Day of Resurrection. And fourth: Malik al-Mawt — the Angel of Death... entrusted with taking the souls of creation when their appointed lifespan on this earth has reached its final second. They operate with majestic order, carrying out the will of Allah across the cosmos.'"
  },
  {
    slideNumber: 12,
    title: "The Angels Who Accompany Us",
    prompt: "Say in a warm, gentle, and comforting British English male voice, speaking with reassuring intimacy: 'Did you know that you are accompanied by angels this very second? Assigned to each of us are the Kiraaman Kaatibeen — the Honorable Recorders. Two noble angels sit beside our shoulders. The angel on our right immediately records every good deed, every kind word, and every sincere smile... The angel on our left records bad deeds. But observe the breathtaking mercy of our Creator: the left angel pauses, and delays writing for a period of hours. If you feel regret, make Tawbah, and say Astaghfirullah... that angel drops the pen, and nothing is written in your book! Beside them walk Al-Hafadhah — the Guardian Angels. They shield us from unseen hazards, illnesses, and harm throughout our days and nights, stepping aside only when Allah decrees a test for our spiritual growth. A believer is never abandoned... and never alone.'"
  },
  {
    slideNumber: 13,
    title: "The Holy Books (Kutub) and the Divine Speech (Kalam)",
    prompt: "Say in a dignified, profound, and friendly British English male voice, bringing clarity to deep theological concepts: 'The third pillar of Iman is belief in the Holy Books — Al-Kutub. We believe in the original divine revelations bestowed upon the Prophets: the Suhuf granted to Ibrahim; the Tawrah revealed to Musa; the Zabur given to Dawud; the Injil sent to 'Isa; and the final, incorruptible revelation — the Quran — revealed to Muhammad, sallallahu alayhi wa sallam. Ash'ari scholarship draws a profound theological distinction regarding Divine Speech. Allah's eternal attribute of speech is called Kalam Nafsi — His intrinsic, eternal Speech, which exists without sounds, syllables, or letters. The physical Arabic Quran that we recite with our tongues, hear with our ears, and touch on paper consists of Kalam Lafzi — created sounds and letters that signify and point to that uncreated Divine Speech. We revere and sanctify the physical Mushaf because it manifests and conveys the eternal guidance of our Lord.'"
  },
  {
    slideNumber: 14,
    title: "Prophets and Messengers (Anbiya' and Rusul)",
    prompt: "Say in a warm, admiring, and friendly British English male voice, with engaging clarity and storytelling rhythm: 'Our fourth pillar is belief in the Prophets and Messengers — Al-Anbiya' wal-Rusul. Is there a difference between a Nabi and a Rasul? Yes! Classical scholarship explains that a Nabi is an inspired Prophet chosen by Allah to receive divine guidance, and invite people to follow an existing sacred law — Shari'ah. A Rasul is a Messenger who is given a new book or a distinct divine legal code. Therefore... every Rasul is a Nabi, but not every Nabi is a Rasul. Over human history, Allah dispatched over one hundred thousand prophets, and twenty-five of them are named specifically in the Holy Quran. From Adam to Nuh, from Ibrahim to Musa, from 'Isa to Muhammad, sallallahu alayhi wa sallam... they all delivered one unified message: 'Worship Allah alone without partners, and live with righteousness and justice.''"
  },
  {
    slideNumber: 15,
    title: "The Infallibility of the Prophets ('Ismah)",
    prompt: "Say in an upright, authoritative, yet friendly British English male voice, expressing moral conviction and clarity: 'Because the Prophets were sent as humanity's moral exemplars, Allah granted them divine protection called 'Ismah — Infallibility. In Ash'ari theology, Prophets are absolutely protected from committing major sins, protected from minor sins that imply baseness or dishonor, and protected from ever lying or breaking a promise. Scholars identified four necessary attributes that every true Prophet must possess: One: Sidq — unflinching truthfulness. Two: Amanah — absolute trustworthiness and integrity. Three: Tabligh — the faithful conveyance of every single message, without withholding anything. And four: Fatanah — sharp intellect, supreme wisdom, and discernment. If a Prophet could commit sins, then Allah would be commanding us to emulate wrongdoing... which is impossible. The Prophets are pure, spotless mirrors of divine virtue.'"
  },
  {
    slideNumber: 16,
    title: "Believing in Qadar (Divine Decree)",
    prompt: "Say in a calm, comforting, and friendly British English male voice, bringing peace and reassurance: 'Now we arrive at the sixth pillar of faith: belief in Qadar — the Divine Decree. Qadar is the comforting conviction that Allah has measured, planned, and decreed all things with perfect wisdom. Classical theology outlines four essential dimensions of Qadar: First: Al-'Ilm — Divine Knowledge. Allah knew every occurrence before time began. Second: Al-Kitabah — The Writing. Allah commanded the primordial Pen — Al-Qalam — to record all that would happen until eternity in the Preserved Tablet — Al-Lawh al-Mahfuz. Third: Al-Mashi'ah — The Divine Will. Whatever Allah wills comes to pass, and whatever He does not will can never happen. And fourth: Al-Khalq — Creation. Allah is the sole, ultimate Creator of everything in existence, including actions and causes. When a believer absorbs Qadar, anxiety dissolves... You realize that what missed you was never meant to strike you, and what struck you was never meant to miss you.'"
  },
  {
    slideNumber: 17,
    title: "Human Choice and the Ash'ari Concept of Kasb (Acquisition)",
    prompt: "Say in a thoughtful, intellectually engaging, and friendly British English male voice, explaining moral responsibility clearly: 'A crucial question often arises: If Allah creates everything, why are we held accountable for our actions? The Ash'ari tradition provides an elegant, profound answer known as the doctrine of Kasb — Acquisition. We distinguish between two realities: Khalq — Creation. Allah alone creates the physical power, the circumstances, and the bodily movement. And Kasb — Acquisition. The human being exercises their intention, willingness, and moral choice to direct that energy toward good or evil. Think of giving charity: Allah created the money, your arm muscles, and the paper notes... But you directed your heart and intention to give that money to the poor. You 'acquired' that moral deed! This is exactly what Allah declares in Surah al-Baqarah: Laha ma kasabat wa 'alayha maktasabat — 'For every soul is the good it acquired, and against it is the evil it accrued.' We are rewarded, and held accountable, based on the choices of our hearts.'"
  },
  {
    slideNumber: 18,
    title: "Qadar is Not an Excuse for Bad Choices!",
    prompt: "Say in a firm, lively, and friendly British English male voice, with practical warmth and storytelling flair: 'We must establish a vital truth: Qadar can never be used as an excuse for bad behavior or sinful choices! If a student chooses to play video games all night, ignores their homework, fails an exam, and then declares: 'Well, Allah decreed that I would fail' — they are completely abusing theology! They chose not to study! Remember the famous encounter during the Caliphate of 'Umar ibn al-Khattab. A thief was brought before him and pleaded: 'Do not punish me, O Leader of the Believers! I only stole because it was written in my Qadar!' 'Umar famously replied: 'And we are only cutting off your hand by the Qadar of Allah!' Here is the golden rule: We look back at Qadar after hardships strike to find solace, patience, and peace. We never look forward to Qadar before acting as an excuse for laziness or sin.'"
  },
  {
    slideNumber: 19,
    title: "Why We Learn Schools of Thought (Madhhabs)",
    prompt: "Say in an appreciative, respectful, and friendly British English male voice, conveying broad-minded scholarship and unity: 'Why do qualified scholars sometimes hold differing views on small details of practice? This brings us to the beauty of Madhhabs — our legal schools of thought. A Madhhab is not a separate religion; it is a rigorous, systematic methodology for interpreting the Quran and Sunnah. Sunni Islam recognizes four great canonical schools of law: the Hanafi school, the Maliki school, the Shafi'i school, and the Hanbali school. These schools agree on ninety-nine percent of Islamic law! They agree on the Pillars of Islam, the halal, the haram, and the articles of faith. Their minor differences lie in secondary operational details. Their founding Imams loved, studied under, and deeply respected one another... Learning through a recognized school of thought protects us from personal whim, and connects our worship to an unbroken chain of authoritative scholarship.'"
  },
  {
    slideNumber: 20,
    title: "The Maliki Madhhab: The Practice of Madinah and Sadl",
    prompt: "Say in an authentic, grounded, and friendly British English male voice, celebrating the living tradition with warm respect: 'Let us explore the Maliki school, founded by Imam Malik ibn Anas, who lived in Madinah — the blessed city of the Messenger of Allah, sallallahu alayhi wa sallam. Imam Malik utilized a profound legal source: 'Amal Ahl al-Madinah — the living, continuous practice of the people of Madinah. He reasoned that when thousands of children and grandchildren of the Sahabah in Madinah all perform an act of worship in unison, that inherited communal practice is a living, mass-transmitted proof of the Sunnah. A well-known example of this is Sadl in Salah — praying with your arms resting naturally at your sides. In the Maliki school, Sadl is the preferred position in obligatory — Fard — prayers. Why? Because Imam Malik observed the senior scholars and descendants of the Companions in Madinah standing before Allah in that manner. Both Sadl, and Qabd — clasping the hands — are authentic, verified Sunni practices. We respect both without judgment.'"
  },
  {
    slideNumber: 21,
    title: "More Maliki Rulings on Salah",
    prompt: "Say in a clear, practical, and friendly British English male voice, providing helpful step-by-step clarity: 'Let us look at two additional distinctive rulings in Maliki Fiqh that every student should know. First: The Recitation of the Basmalah. In the Maliki school, when praying obligatory prayers, we do not recite Bismillahir-Rahmanir-Rahim aloud or quietly before Surah al-Fatihah. The Imam begins recitation immediately with: Al-Hamdu lillahi Rabbil-'Alamin. This is because in the Maliki tradition, the Basmalah is viewed as a sacred blessing opening the Surah, rather than an integral verse of Al-Fatihah itself. Second: Sujud al-Sahw — the Prostrations of Forgetfulness. Maliki fiqh provides an exceptionally clear rule: If you omitted an emphasized sunnah from your prayer, you perform two prostrations Qabli — before making the final Taslim. But if you added something extra by mistake, you perform two prostrations Ba'di — after completing the Taslim. It is a remarkably logical, elegant system of worship.'"
  },
  {
    slideNumber: 22,
    title: "Summary & Reflection",
    prompt: "Say in a warm, reflective, and friendly British English male voice, summarizing with sincere contemplation: 'SubhanAllah... look at the vast expanse of sacred wisdom we have navigated together today! Let us summarize our key principles: Allah is One, Unique, and beyond space and time — Mukhalafah lil-Hawadith. The Six Pillars of Iman anchor our hearts, and guide our worldview. Angels surround us constantly, guarding us and faithfully recording our deeds. Qadar is Allah's perfect decree, while our moral choices — Kasb — determine our deeds and accountability. And our Madhhabs, such as the Maliki school, are an ocean of mercy connecting us directly to the Prophetic tradition. Now, take a quiet moment to reflect on this question... How does knowing that Allah creates all ability, but you choose how to direct it through Kasb, change the way you approach your daily intentions and choices? Take a minute to ponder this in your heart.'"
  },
  {
    slideNumber: 23,
    title: "Sources & References (For Teachers)",
    prompt: "Say in a professional, scholarly, and warm British English male voice, addressing educators with respectful appreciation: 'To our dedicated teachers and parents: the foundations taught in this lesson are rooted in the classical canons of orthodox Sunni scholarship. For Ash'ari Aqeedah, we rely upon Al-Aqeedah al-Sanusiyyah — known as Umm al-Barahin — by Imam Muhammad ibn Yusuf al-Sanusi, and Jawharat al-Tawhid by Imam Ibrahim al-Laqani. For Maliki Fiqh, our rulings are derived from Al-Muwatta of Imam Malik ibn Anas, Matn al-'Ashmawiyyah by Imam Abd al-Bari al-'Ashmawi, and the celebrated Risalah of Imam Ibn Abi Zayd al-Qayrawani. And for our scriptural bedrock, we reference the authentic traditions recorded in Sahih al-Bukhari and Sahih Muslim, particularly the comprehensive Hadith of Jibril. May Allah bless your efforts in transmitting this sacred knowledge to the next generation... Jazakum Allahu Khayran, wa Assalamu Alaikum wa Rahmatullahi wa Barakatuh.'"
  }
];

async function generateSlideAudio(slide) {
  const padNum = String(slide.slideNumber).padStart(2, '0');
  const outFile = path.join(outputDir, `slide_${padNum}.wav`);

  console.log(`🎙️ Generating Slide ${slide.slideNumber} / ${slides.length}: "${slide.title}"...`);

  const tts = await client.interactions.create({
    model: "gemini-3.1-flash-tts-preview",
    input: slide.prompt,
    response_format: { type: "audio" },
    generation_config: {
      speech_config: [
        { voice: "Achird" } // Warm, friendly British English style male voice
      ]
    }
  });

  if (!tts.output_audio || !tts.output_audio.data) {
    console.warn(`⚠️ Warning: No audio payload returned for Slide ${slide.slideNumber}.`);
    return false;
  }

  const rawPcm = Buffer.from(tts.output_audio.data, 'base64');
  const sampleRate = tts.output_audio.sample_rate || 24000;
  const channels = tts.output_audio.channels || 1;

  const wavBuffer = pcmToWav(rawPcm, sampleRate, channels);
  fs.writeFileSync(outFile, wavBuffer);

  const durationSec = (rawPcm.length / (sampleRate * 2)).toFixed(1);
  console.log(`✅ Saved: slide_${padNum}.wav (${durationSec}s, ${(wavBuffer.length / 1024).toFixed(1)} KB)`);
  return true;
}

async function main() {
  console.log(`🚀 Starting audio generation for ${slides.length} slides with voice "Achird" (British English, Friendly Male)...`);
  let successCount = 0;

  for (const slide of slides) {
    try {
      const ok = await generateSlideAudio(slide);
      if (ok) successCount++;
      // Polite delay between API calls to respect rate limits
      await new Promise(r => setTimeout(r, 1200));
    } catch (err) {
      console.error(`❌ Failed Slide ${slide.slideNumber}:`, err.message);
    }
  }

  console.log(`\n🎉 Completed! Successfully generated ${successCount} of ${slides.length} slide audios in "${outputDir}".`);
}

main();
