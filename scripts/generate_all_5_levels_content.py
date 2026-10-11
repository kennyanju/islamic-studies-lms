#!/usr/bin/env python3
"""
Generate comprehensive, age-appropriate content for:
- Level 1 (Ages 6-8): handout_level1.md, questions_level1.md
- Level 2 (Ages 8-10): handout_level2.md, questions_level2.md
- Level 5 (Ages 14-16+): handout_level5.md, questions_level5.md
Across all 9 modules of the Islamic Studies LMS.
Conforms strictly to Ash'ari Creed and Maliki Fiqh with the 'Other Scholars Say' comparative framework.
"""

import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODULES = [
    {
        "id": 1,
        "folder": "1 — Foundations of Belief",
        "mdDir": "MD Foundations of Belief",
        "title": "Foundations of Belief",
        # Level 1 Content
        "l1_handout": """# Level 1 Student Handout: Foundations of Belief
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** Who Made Us?, Loving Allah, The Beautiful Creation, and the Shahaadah  
**Theological Anchor:** Ash'ari Creed & Loving Tawhid  

---

## 🌟 Welcome, Little Believer!

Have you ever looked at a little green leaf, a shiny butterfly, or the bright shining stars at night? 
When you look at something beautiful, you know that someone created it. 

Allah is **Al-Khaliq** (The Creator). He made the sun to give us warmth, the rain to help flowers grow, and He gave us our loving families and beating hearts!

```
     ☀️ 🌴 🌊 🌸
     Allah made everything in the heavens and the earth!
     Whatever we see, Allah is its Maker!
```

---

## 🤲 Page 1: Allah is One (Tawhid)

* The most important word we know is **Tawhid** (تَوْحِيد). It means **Allah is One!**
* Allah has no partners, no parents, and no children. 
* He is completely unique! He doesn't need to eat, sleep, or rest.
* We say: **La ilaha illallah** (There is no god except Allah).

### The Golden Rule of Our Creed:
> *"Whatever pops into your head or imagination, Allah is not like that!"*  
> Allah is far greater and more wonderful than anything we can draw or imagine!

---

## 🕊️ Page 2: Allah's Good Helpers — The Angels

Allah made the **Angels** from pure light! They love Allah, they always obey Him, and they never get tired or do bad things.

* **Angel Jibril (Gabriel):** The leader of the angels who brought Allah's words to the Prophets!
* **Angel Mika'il:** Brings the gentle rain to water the earth!
* **Guardian Angels:** They stay near us and protect us by Allah's permission!

---

## 📜 Page 3: Our Daily Kindness Rhyme

Let's recite together:

*Allah is the One Who made the skies,*  
*He gave me hands, and ears, and eyes!*  
*He loves the kind, the truthful and polite,*  
*I'll do my best from morning until night!*  

---

## 🎨 My Daily Sunnah Challenge:
1. Look out the window and say **SubhanAllah** (Glory be to Allah) 3 times!
2. Smile at your mother or father — smiling is a charity!
3. Say **Al-Hamdulillah** (Praise be to Allah) for a delicious fruit today!
""",
        "l1_questions": """# Level 1 Activity Sheet: Foundations of Belief
**Age Group:** Ages 6–8 (Level 1 Track)  
**Focus:** Tawhid, Loving Allah, and Good Manners  

---

## Part A: Multiple Choice (Choose the best answer)

### 1. Who created the sun, the moon, and all the animals?
* A) Allah (Al-Khaliq)
* B) The clouds
* C) The trees
* D) The birds

### 2. What does Tawhid mean?
* A) Allah has three partners
* B) Allah is One and has no partners
* C) Drawing pictures of the sky
* D) Sleeping after prayer

### 3. What were the noble Angels created from?
* A) Clay
* B) Fire
* C) Pure Light (Nur)
* D) Water

### 4. Which great angel brought Allah's words to the Prophets?
* A) Angel Jibril
* B) Angel Mika'il
* C) Angel Israfil
* D) Angel Ridwan

### 5. If you see something beautiful in nature, what beautiful word should you say?
* A) SubhanAllah
* B) Goodbye
* C) Never mind
* D) Oops

---

## Part B: Fill in the Blanks (Use the word bank)
*Word Bank: One, Light, Creator*

6. Allah is Al-Khaliq, which means the **_________________**.
7. In Islam, we believe that Allah is **_________________** and unique.
8. The angels are made from pure **_________________**.

---

## Part C: Matching (Draw a line to connect)
Pair 1: Al-Khaliq --- The Creator of all things
Pair 2: Angel Jibril --- Brought revelation to the Prophets
Pair 3: SubhanAllah --- Glory be to Allah

---

## Part D: Reflection
9. Draw or tell your parent one thing Allah made that you love the most (like your kitten, a rainbow, or mangoes)!

---

## Teacher Answer Key
1. A) Allah (Al-Khaliq) is the sole Creator.
2. B) Tawhid affirms Allah's absolute Oneness.
3. C) Angels are created from pure light (*Nur*).
4. A) Jibril is the archangel of revelation.
5. A) SubhanAllah expresses wonder at Allah's creation.
6. Creator
7. One
8. Light
""",
        # Level 2 Content
        "l2_handout": """# Level 2 Student Handout: Foundations of Belief
**Age Group:** Ages 8–10 (Level 2 Track)  
**Topics:** The 6 Pillars of Iman, The 20 Attributes, Angels, Divine Books, and Maliki Adab  
**Theological Anchor:** Ash'ari Creed & Maliki Methodology  

---

## 🌟 The Pillars of Our Faith (Iman)

Welcome to Level 2! As we grow older, our understanding of Islam becomes deeper and brighter. 
In the famous **Hadith of Jibril**, the Angel Jibril visited the Prophet Muhammad ﷺ and asked: *"What is Iman?"*

The Prophet ﷺ replied that Iman has **Six Pillars**:
1. **Belief in Allah**: His Oneness, Perfection, and Transcendence.
2. **Belief in His Angels**: Pure beings created from light who carry out divine orders.
3. **Belief in His Books**: The original scriptures revealed to the Messengers.
4. **Belief in His Messengers**: The noble teachers chosen to guide humanity.
5. **Belief in the Last Day**: The Day of Resurrection and perfect divine justice.
6. **Belief in Divine Destiny (Al-Qadar)**: That everything happens by Allah's knowledge and will.

---

## 🛡️ Understanding Allah's Attributes (Tanzih)

In the **Ash'ari** theological school, we learn to describe Allah only as He has described Himself, while maintaining **Tanzih** (keeping Allah exalted above any human or physical flaws).

* **Al-Wujud (Existence)**: Allah exists without beginning and without end.
* **Al-Wahdaniyyah (Oneness)**: He has no partners, parts, or equals.
* **Mukhalafah lil-Hawadith (Difference from Created Things)**: Allah is not a body, does not take space, and is not bound by time or place!
* **Al-Qiyam bin-Nafs (Self-Sufficiency)**: Allah needs nothing, but everything needs Him.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        "OTHER SCHOLARS SAY" CORNER                      │
│                                                                        │
│ All four Sunni Imams (Abu Hanifah, Malik, Al-Shafi'i, Ahmad ibn Hanbal) │
│ agree: Allah is the Creator of space and time, and He existed before   │
│ creating places. We worship Allah with love, reverence, and certainty! │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📖 The Four Famous Heavenly Books
1. **The Tawrah**: Given to Prophet Musa (Moses) peace be upon him.
2. **The Zabur**: Given to Prophet Dawud (David) peace be upon him.
3. **The Injil**: Given to Prophet 'Isa (Jesus) peace be upon him.
4. **The Noble Quran**: The final, complete, and perfectly preserved speech of Allah revealed to Prophet Muhammad ﷺ.

---

## 📝 Level 2 Habit Tracker:
- [ ] Recite Ayat al-Kursi after each of the 5 prayers.
- [ ] Memorize the first 5 lines of *'Aqidat al-'Awamm*.
- [ ] Practice saying *Al-Hamdulillah 'ala kulli hal* in every situation.
""",
        "l2_questions": """# Level 2 Worksheet: Foundations of Belief
**Age Group:** Ages 8–10 (Level 2 Track)  
**Focus:** 6 Pillars of Iman, Divine Transcendence, and Heavenly Scriptures  

---

## Part A: Multiple Choice (Circle the correct answer)

### 1. How many Pillars of Iman (Faith) were defined in the Hadith of Jibril?
* A) 5 Pillars
* B) 6 Pillars
* C) 7 Pillars
* D) 4 Pillars

### 2. Which concept means that Allah is completely different from all created things?
* A) Mukhalafah lil-Hawadith
* B) Wudu
* C) Qiblah
* D) Taraweeh

### 3. Which Holy Scripture was revealed to Prophet Dawud (David)?
* A) The Quran
* B) The Injil
* C) The Zabur
* D) The Tawrah

### 4. Who is the angel responsible for blowing the Trumpet on the Day of Resurrection?
* A) Jibril
* B) Mika'il
* C) Israfil
* D) Malik

### 5. Why is the Quran unique among all previous scriptures?
* A) It was only written on stones
* B) It is the final, fully preserved Word of Allah protected from all alteration
* C) It was revealed in one single day
* D) It was written by human poets

### 6. What did Imam Malik emphasize when asked about the sacred knowledge?
* A) Rush into arguments and debate everyone
* B) Learn Adab (manners and reverence) before learning information
* C) Memorize words without understanding
* D) Ignore the practice of Madinah

---

## Part B: Fill in the Blanks
*Word Bank: Tanzih, Tawrah, Six, Light, Al-Amin*

7. The number of pillars of faith (Iman) is **_________________**.
8. Keeping Allah exalted above any human-like physical traits is called **_________________**.
9. The scripture given to Prophet Musa (peace be upon him) is the **_________________**.
10. Before prophethood, the people of Makkah called Prophet Muhammad ﷺ **_________________** (The Trustworthy).

---

## Part C: Matching Pairs
Pair 1: Jibril --- Archangel of Divine Revelation
Pair 2: Mika'il --- Angel of Rain and Sustenance
Pair 3: Israfil --- Angel of the Trumpet (*Sur*)
Pair 4: Malik al-Mawt --- Angel of taking the souls

---

## Part D: Reflection & Application
11. Why is it comforting to know that Allah knows everything you do and sees your good deeds even when no one else is looking?
12. How does learning about the Angels help you remember to do good deeds every day?

---

## Teacher Answer Key
1. B) 6 Pillars of Iman.
2. A) Mukhalafah lil-Hawadith signifies complete difference from created things.
3. C) The Zabur (Psalms) was given to Dawud.
4. C) Israfil is tasked with blowing the Horn.
5. B) The Quran is universally protected by Allah from alteration.
6. B) Imam Malik taught: "Learn Adab before knowledge."
7. Six
8. Tanzih
9. Tawrah
10. Al-Amin
""",
        # Level 5 Content
        "l5_handout": """# Level 5 Seminar Guide: Foundations of Epistemology, Kalam & Ash'ari Creed
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** Epistemology, The Sanusi 20 Attributes, Kalam Proofs, Refuting Materialism & Scientism, Kasb vs Fatalism  
**Classical Spine:** *Jawharat al-Tawhid* (Imam al-Laqani) & *Umm al-Barahin* (Imam al-Sanusi)  

---

## 1. Epistemology: The Architecture of Human Knowledge

In contemporary intellectual discourse, Muslim youth frequently encounter epistemological challenges—from radical skepticism to dogmatic scientism. Classical Sunni kalam provides an unshakeable framework establishing the three legitimate channels of sound human knowledge (*Asbab al-'Ilm*):

```
                       ┌───────────────────────────────┐
                       │  THE THREE SOURCES OF TRUTH   │
                       └──────────────┬────────────────┘
             ┌────────────────────────┼────────────────────────┐
             ▼                        ▼                        ▼
    ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
    │ 1. Al-Hawas     │      │ 2. Al-'Aql      │      │ 3. Al-Khabar    │
    │    al-Salimah   │      │    al-Sarih     │      │    al-Sadiq     │
    │ (Sound Senses)  │      │ (Sound Reason)  │      │ (True Report)   │
    │ Empirical       │      │ Logical axioms, │      │ Mutawatir facts │
    │ observation &   │      │ non-contradic-  │      │ & authentic     │
    │ science         │      │ tion, math      │      │ Divine Wahy     │
    └─────────────────┘      └─────────────────┘      └─────────────────┘
```

### The Rational Classification of Judgments (Ahkam 'Aqliyyah)
Every proposition examined by the intellect falls strictly into one of three categories:
1. **Al-Wajib (The Necessary)**: That which reason cannot conceive to be non-existent (e.g. Allah's eternal existence and perfection).
2. **Al-Mustahil (The Impossible)**: That which reason cannot conceive to exist (e.g. a partner or peer to Allah, a square circle).
3. **Al-Ja'iz (The Possible/Contingent)**: That which reason conceives can either exist or not exist (e.g. the created universe, human beings, physical laws).

---

## 2. The 20 Necessary Attributes of Allah (Al-Sifat al-Wajibah)

Imam Muhammad ibn Yusuf al-Sanusi organized the essential attributes revealed in the Quran into four systematic categories to safeguard true monotheism:

| Category | Attributes Included | Theological Significance |
|---|---|---|
| **Nafsiyyah (Essential)** | 1. *Al-Wujud* (Existence) | Indicates the Reality of the Divine Essence without addition. |
| **Salbiyyah (Negating Imperfection)** | 2. *Al-Qidam* (Beginninglessness)<br/>3. *Al-Baqa'* (Endlessness)<br/>4. *Mukhalafah lil-Hawadith* (Absolute Distinction from creation)<br/>5. *Al-Qiyam bin-Nafs* (Self-Subsistence)<br/>6. *Al-Wahdaniyyah* (Absolute Oneness) | Strips away all created limitations (spatial bounds, bodily form, temporal succession, composition). |
| **Al-Ma'ani (Qualities of Power & Life)** | 7. *Al-Qudrah* (Omnipotence)<br/>8. *Al-Iradah* (Divine Will)<br/>9. *Al-'Ilm* (All-Encompassing Knowledge)<br/>10. *Al-Hayah* (Life)<br/>11. *Al-Sam'* (Hearing)<br/>12. *Al-Basar* (Sight)<br/>13. *Al-Kalam* (Speech / Kalam Nafsi) | Positive ontological attributes eternally subsisting in the Divine Essence. |
| **Al-Ma'nawiyyah (Relational States)** | 14–20. Being All-Powerful, Willing, Knowing, Living, Hearing, Seeing, and Speaking. | Active manifestation corresponding to the Sifat al-Ma'ani. |

---

## 3. Human Responsibility: The Ash'ari Doctrine of Kasb (Acquisition)

One of the great historical dilemmas of philosophy is the apparent conflict between Divine Omnipotence and Human Free Will:
* **The Jabriyyah (Fatalists)**: Claimed humans have no will whatsoever; we are passive leaves in the wind. (Rejected: Destroys moral accountability).
* **The Mu'tazilah (Rationalists)**: Claimed humans independently create their own actions outside of Allah's power. (Rejected: Violates Tawhid by creating multiple independent creators).
* **The Ahl al-Sunnah (Ash'ari Formulation)**: **Kasb (Acquisition)**. Allah alone creates the physical act and the capacity (*Khalq*), while the human being exercises intentional choice (*Qasd wa Ikhtiyar*). Because we choose freely, we are justly responsible for our moral deeds.

---

## 4. 🌍 Comparative Legal & Creed Notes: "Other Scholars Say"
* **Tanzih vs. Anthropomorphism**: All four Sunni madhhabs (Hanafi, Maliki, Shafi'i, Hanbali) firmly reject *Tajsim* (attributing physical limbs, organs, or physical containment to Allah).
* **Approach to Ambiguous Texts (Mutashabihat)**:
  * *Method of the Salaf (Tafwid al-Ma'na)*: We consign the specific reality to Allah while declaring Him free from physical meaning (*Bila Kayf*).
  * *Method of the Khalaf (Ta'wil Ijmali/Tafsili)*: Interpreting linguistic figures according to classical Arabic idiom (e.g. *Yad* meaning Divine Favor/Power; *Wajh* meaning the Divine Essence) to protect untrained minds from anthropomorphism.

---

## 5. Seminar Discussion Prompts for High-School Learners:
1. How does the epistemic distinction between empirical science (*Hawas*) and pure reason (*'Aql*) dismantle the claims of modern Scientism?
2. Why is divine transcendence (*Tanzih*) the only coherent shield against mythological paganism and modern existential nihilism?
""",
        "l5_questions": """# Level 5 Seminar Assessment: Foundations of Creed & Epistemology
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** Advanced Epistemology, Ash'ari Kalam, Kasb, and Comparative Apologetics  

---

## Part A: Advanced Multiple Choice (Select the most accurate scholarly response)

### 1. In Ash'ari epistemology, what is the fatal philosophical flaw of "Scientism" (the claim that only empirical science provides truth)?
* A) It does not use telescopes
* B) The claim itself cannot be empirically verified, making Scientism self-refuting
* C) Science was not invented by Muslims
* D) Empirical observation is always evil

### 2. Under the rational categorization of judgments (*Ahkam 'Aqliyyah*), how is the created universe classified?
* A) Wajib 'Aqli (Rationally Necessary)
* B) Mustahil 'Aqli (Rationally Impossible)
* C) Ja'iz 'Aqli (Rationally Contingent/Possible)
* D) Mutawatir (Mass-transmitted)

### 3. Which group of the 20 Attributes functions by negating (*Salb*) any notion of deficiency or createdness from Allah?
* A) Sifat al-Ma'ani
* B) Sifat al-Salbiyyah
* C) Sifat al-Nafsiyyah
* D) Sifat al-Ma'nawiyyah

### 4. How does the Ash'ari doctrine of *Kasb* (Acquisition) reconcile Divine Sovereignty with human moral agency?
* A) Humans create their own actions independently of Allah's will
* B) Humans have no choice and are entirely coerced
* C) Allah creates the capacity and the act, while human consciousness provides the intentional choice (*Qasd*), establishing accountability
* D) Kasb means actions are determined by biological determinism alone

### 5. What is the fundamental difference between the Salaf's approach of *Tafwid* and the Khalaf's approach of *Ta'wil* regarding ambiguous texts?
* A) The Salaf believed in anthropomorphism while the Khalaf did not
* B) The Salaf consigned the modality to Allah with absolute Tanzih, while the Khalaf provided linguistically sound Arabic allegorical interpretations to safeguard faith
* C) The Khalaf rejected the Quran while the Salaf accepted it
* D) There is no difference whatsoever

### 6. What was Imam Malik's celebrated response to the man who questioned the modality of *Istiwa'*?
* A) "The Istiwa' is known, the modality is inconceivable, believing in it is obligatory, and asking how is an innovation (*Bid'ah*)."
* B) "Allah sits upon a physical chair like a king."
* C) "Leave the religion immediately."
* D) "We should not believe in divine attributes."

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Kalam Nafsi, Mukhalafah lil-Hawadith, Tawatur, Tanzih, Amal Ahl al-Madinah*

7. The attribute meaning Allah is completely distinct from created things in essence, attributes, and actions is **_________________**.
8. A mass-transmitted historical report that is impossible for its transmitters to have colluded upon a lie is known as **_________________**.
9. In classical Ash'ari theology, the eternal, uncreated attribute of divine speech without letters or vocal sounds is termed **_________________**.
10. Imam Malik prioritized the living continuous community practice of the Prophet's city, termed **_________________**, as an authoritative legal source.

---

## Part C: Advanced Matching Matrix
Pair 1: Sifat al-Nafsiyyah --- Al-Wujud (Self-evident Reality of Essence)
Pair 2: Sifat al-Salbiyyah --- Al-Qidam, Al-Baqa', Mukhalafah lil-Hawadith
Pair 3: Sifat al-Ma'ani --- Qudrah, Iradah, 'Ilm, Hayah, Sam', Basar, Kalam
Pair 4: Sifat al-Ma'nawiyyah --- Being Powerful, Willing, Knowing, Living, Hearing, Seeing, Speaking

---

## Part D: Analytical Case Study & Critical Reflection
11. **Analytical Scenario**: A classmate at university argues: *"Since physics cannot measure Allah in a laboratory, it is irrational to believe in Him."* Using your knowledge of the 3 Asbab al-'Ilm, formulate a concise, structured 3-point rebuttal demonstrating the limits of empiricism and the rational necessity of a Transcendent Cause.
12. **Theological Synthesis**: How does the Ash'ari affirmation of both Divine Transcendence (*Tanzih*) and Divine Omnipotence (*Qudrah*) protect believers from falling into either despair (fatalism) or arrogance (self-deification)?

---

## Teacher Answer Key
1. B) Scientism is self-referentially incoherent because its core axiom cannot be verified by the scientific method.
2. C) The cosmos is contingent (*Ja'iz*); its existence or non-existence is equally conceivable to the intellect.
3. B) The Sifat al-Salbiyyah negate deficiencies (e.g. mortality, beginning, physical limits).
4. C) Kasb affirms Allah as the sole Creator (*Khaliq*) while affirming human moral accountability through intentional choice.
5. B) Both schools uphold strict Tanzih; the Salaf consigned meaning without anthropomorphism, while the Khalaf utilized Arabic lexical figures.
6. A) Imam Malik's famous declaration anchored classical Sunni moderation.
7. Mukhalafah lil-Hawadith
8. Tawatur
9. Kalam Nafsi
10. Amal Ahl al-Madinah
"""
    }
]

print("Script template ready. Now expanding for all 9 modules...")
