#!/usr/bin/env python3
"""
Comprehensive script to generate all missing level files:
- Level 1 (Ages 6-8): handout_level1.md, questions_level1.md
- Level 2 (Ages 8-10): handout_level2.md, questions_level2.md
- Level 5 (Ages 14-16+): handout_level5.md, questions_level5.md
for all 9 modules in the Islamic Studies LMS.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODULE_CONFIGS = [
    {
        "id": 1,
        "folder": "1 — Foundations of Belief",
        "mdDir": "MD Foundations of Belief",
        "title": "Foundations of Belief",
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
    },
    {
        "id": 2,
        "folder": "2— Purification & Prayer",
        "mdDir": "MD Purification & Prayer",
        "title": "Purification & Prayer",
        "l1_handout": """# Level 1 Student Handout: Purification & Prayer
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** Clean Hands, My First Wudu, Standing in Prayer (Sadl), and Happy Sujud  
**Theological Anchor:** Maliki Fiqh & Loving Worship  

---

## 💧 Cleanliness is Half of Faith!

Did you know that Allah loves cleanliness? The Prophet Muhammad ﷺ said: *"Cleanliness is half of faith!"*
Before we stand before Allah to speak with Him in prayer (Salah), we wash our bodies with cool, clean water. This special wash is called **Wudu** (الْوُضُوء).

---

## 🧼 The 7 Special Steps of Wudu (Fara'id)

In the school of **Imam Malik**, there are 7 obligatory steps in Wudu. Let's learn them together!

1. **Intention (Niyyah):** In your heart, you decide: *"I am doing Wudu to pray for Allah!"*
2. **Wash Your Face:** From the top of your forehead down to your chin, and ear to ear!
3. **Wash Your Arms:** From your fingertips all the way past your elbows!
4. **Wipe Your Whole Head:** Wet your hands and gently wipe from the front of your hair to the back!
5. **Wash Your Feet:** Right foot then left foot, washing past the ankles!
6. **Gentle Rubbing (Dalk):** Gently rub your skin with water so every spot gets clean!
7. **One Step After Another (Muwalat):** Don't wait for your arms to dry before washing your feet!

```
     💧 ➡️ 🖐️ ➡️ 👤 ➡️ 🦶
     Bismillah! We wash gently and save water!
```

---

## 🕌 Standing in Prayer (Salah)

When we stand to pray:
* We face towards the Holy Ka'bah in Makkah (the **Qiblah**).
* We say: **Allahu Akbar** (Allah is Greater than everything!).
* In the Maliki way, we let our arms rest naturally and comfortably at our sides (**Sadl**).
* We bow (**Ruku'**) and say: *Subhana Rabbiyal 'Adheem* (Glory to my Lord the Magnificent).
* We touch our forehead to the floor in **Sujud** and whisper our heartfelt du'as!

---

## 🌟 Daily Star Goal:
- [ ] Practice doing wudu slowly with your parent, remembering to gently rub your arms!
- [ ] Pray two rak'ahs with a big smile!
""",
        "l1_questions": """# Level 1 Activity Sheet: Purification & Prayer
**Age Group:** Ages 6–8 (Level 1 Track)  
**Focus:** Wudu steps, Cleanliness, and Standing in Prayer  

---

## Part A: Multiple Choice

### 1. What do we call the special wash we do before praying Salah?
* A) Wudu
* B) Suhoor
* C) Hajj
* D) Zakah

### 2. What is the direction we face when we pray towards the Ka'bah?
* A) North Pole
* B) The Qiblah
* C) The Sun
* D) The Sea

### 3. In the Maliki school, how do we wipe our head during Wudu?
* A) Only touch one hair
* B) Wipe gently over the whole head from front to back
* C) Pour a whole bucket on the head
* D) We skip the head

### 4. What is the special Maliki wudu act where we gently rub our skin with water?
* A) Dalk (rubbing)
* B) Running
* C) Clapping
* D) Jumping

### 5. What do we say when we touch our forehead to the floor in Sujud?
* A) Subhana Rabbiyal A'la
* B) Thank you teacher
* C) Good night
* D) Hello

---

## Part B: Fill in the Blanks
*Word Bank: Wudu, Qiblah, Sadl*

6. The direction we face in prayer is the **_________________**.
7. Before we pray, we perform **_________________** to become clean.
8. Letting our arms rest naturally at our sides during prayer is called **_________________**.

---

## Part C: Matching Pairs
Pair 1: Dalk --- Gently rubbing skin during wudu
Pair 2: Qiblah --- Facing Makkah in prayer
Pair 3: Sujud --- Touching forehead to the ground for Allah

---

## Part D: Reflection
9. How do you feel in your heart after making a fresh, cool wudu?

---

## Teacher Answer Key
1. A) Wudu is the ritual washing.
2. B) The Qiblah is the prayer direction.
3. B) In Maliki fiqh, wiping the entire head is fard.
4. A) Dalk is the obligatory rubbing.
5. A) In Sujud we say Subhana Rabbiyal A'la.
6. Qiblah
7. Wudu
8. Sadl
""",
        "l2_handout": """# Level 2 Student Handout: Purification & Prayer
**Age Group:** Ages 8–10 (Level 2 Track)  
**Topics:** Taharah, Conditions of Salah, 7 Fard of Wudu, Rak'ah Breakdown, and Adab al-Masjid  
**Theological Anchor:** Maliki Fiqh (*Matn Ibn 'Ashir* & *Al-Akhdari*)  

---

## 🌊 1. Taharah: The Foundation of Worship

In Islam, worship requires both **inner purity** (cleanliness of the heart from jealousy and pride) and **outer purity** (cleanliness of the body, clothing, and place from ritual impurities called *Najasah*).

### The Three Water Classifications:
1. **Tahur (Purifying Water):** Pure rainwater, spring water, tap water, or sea water that hasn't changed in color, taste, or smell. (Valid for Wudu and Ghusl).
2. **Tahir (Clean Water):** Water mixed with clean tea, soap, or fruit juice. It is clean to drink, but **cannot** be used for Wudu.
3. **Najis (Impure Water):** Water contaminated by urine, blood, or waste. It cannot be used for prayer or drinking.

---

## 📜 2. The 7 Fard Steps of Wudu in Maliki Fiqh (*Ibn 'Ashir*)

Imam Ibn 'Ashir summarized the obligatory (*Fard*) acts of Wudu in his classical poem:
1. **An-Niyyah:** Sincere intention in the heart before washing.
2. **Ghasl al-Wajh:** Washing the entire face from hairline to chin and ear to ear.
3. **Ghasl al-Yadayn:** Washing both arms including the elbows.
4. **Mas-h ar-Ra's:** Wiping the entire head from hairline to nape and back.
5. **Ghasl ar-Rijlayn:** Washing both feet including the ankle bones (*Ka'bayn*).
6. **Ad-Dalk:** Gently rubbing the wet hand across the limb with water.
7. **Al-Muwalat:** Performing the acts continuously without long pauses.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        "OTHER SCHOLARS SAY" CORNER                      │
│                                                                        │
│ • Arm Position in Prayer: The Shafi'i and Hanbali schools place their  │
│   hands on their chest (*Qabd*). In the Maliki school, the established │
│   practice based on 'Amal Ahl al-Madinah is to let the arms rest       │
│   naturally at the sides (*Sadl*). Both are valid Sunni sunnahs!       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🕌 3. The 5 Daily Prayers & Rak'ah Count
* **Fajr**: 2 Rak'ahs (recited aloud)
* **Zuhr**: 4 Rak'ahs (recited silently)
* **'Asr**: 4 Rak'ahs (recited silently)
* **Maghrib**: 3 Rak'ahs (first 2 aloud, 3rd silent)
* **'Isha**: 4 Rak'ahs (first 2 aloud, last 2 silent)

---

## 📝 Level 2 Practice Goals:
- [ ] Practice wiping your entire head from front to back in Wudu.
- [ ] Learn the words of the Tashahhud according to Sayyiduna 'Umar (as taught in Maliki fiqh).
- [ ] Keep your prayer area clean and tidy.
""",
        "l2_questions": """# Level 2 Worksheet: Purification & Prayer
**Age Group:** Ages 8–10 (Level 2 Track)  
**Focus:** Water purity, Wudu Fard, Conditions of Salah, and Rak'ah Structure  

---

## Part A: Multiple Choice

### 1. Which type of water is valid for performing Wudu and Ghusl?
* A) Pure water whose taste, color, and smell are natural (Tahur)
* B) Orange juice
* C) Water mixed with milk
* D) Dishwater

### 2. How many obligatory (Fard) acts of Wudu are there in the Maliki school?
* A) 4
* B) 7
* C) 10
* D) 12

### 3. Which of the following is an obligatory act of Wudu according to Maliki fiqh?
* A) Dalk (rubbing the limb with the hand)
* B) Brushing your teeth with toothpaste
* C) Washing each limb 10 times
* D) Singing while washing

### 4. How many rak'ahs are prayed for Maghrib prayer?
* A) 2
* B) 3
* C) 4
* D) 5

### 5. What is the Maliki term for standing in prayer with the arms resting naturally at the sides?
* A) Sadl
* B) Qabd
* C) Ruku
* D) Sujud

### 6. If a person drops pure rosewater into a glass of water so its smell completely changes, can it be used for Wudu?
* A) Yes, it smells nice
* B) No, it is Tahir (clean) but not Tahur (purifying for ritual worship)
* C) Yes, without any problem
* D) Only on Fridays

---

## Part B: Fill in the Blanks
*Word Bank: Seven, Muwalat, Tahur, Qiblah, Fajr*

7. The morning prayer before sunrise consisting of 2 rak'ahs is **_________________**.
8. In Maliki fiqh, there are **_________________** fara'id of Wudu.
9. Doing wudu steps continuously without leaving a limb to dry is called **_________________**.
10. The direction of the Ka'bah that all Muslims face is the **_________________**.

---

## Part C: Matching Pairs
Pair 1: Dalk --- Rubbing the limb during washing
Pair 2: Muwalat --- Continuous washing without delay
Pair 3: Mas-h ar-Ra's --- Wiping the entire head
Pair 4: Sadl --- Letting arms rest at sides in Qiyam

---

## Part D: Reflection & Scenario
11. Ali is about to pray Zuhr, but he remembers he didn't wash his feet during wudu. What should he do?
12. Why is learning the difference between Fard (obligatory) and Sunnah (recommended) acts helpful when we travel or have little water?

---

## Teacher Answer Key
1. A) Tahur water is unconditionally purifying.
2. B) 7 fara'id (Niyyah, Face, Arms, Head, Feet, Dalk, Muwalat).
3. A) Dalk is a pillar of wudu in Maliki jurisprudence.
4. B) Maghrib is 3 rak'ahs.
5. A) Sadl is resting arms naturally.
6. B) Mixed clean liquids become Tahir ghayr Mutahhir.
7. Fajr
8. Seven
9. Muwalat
10. Qiblah
""",
        "l5_handout": """# Level 5 Seminar Guide: Advanced Jurisprudence of Taharah & Salah
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** Water Taxonomy, Usul of Taharah, Mukhtasar Khalil Fara'id, Sadl/Qabd Comparative Evidences, Sujud as-Sahw Engine  
**Classical Spine:** *Matn Ibn 'Ashir*, *Mukhtasar Khalil*, and *Bidayat al-Mujtahid* (Ibn Rushd)  

---

## 1. Usul al-Taharah: Taxonomy of Water and Impurities

In classical jurisprudence, the means of ritual purification (*Wasail al-Taharah*) are governed by precise legal axioms. The baseline principle in physical entities is **Al-Aslu fi al-Ashya'i al-Taharah** (The default state of things is purity):

```
                                  ┌─────────────────────────────┐
                                  │      AQSAM AL-MIYAH         │
                                  └──────────────┬──────────────┘
                    ┌────────────────────────────┼────────────────────────────┐
                    ▼                            ▼                            ▼
           ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
           │ 1. Al-Ma'       │          │ 2. Al-Ma'       │          │ 3. Al-Ma'       │
           │    al-Mutlaq    │          │    al-Tahir     │          │    al-Najis     │
           │ (Absolute Water)│          │ (Clean Water)   │          │ (Impure Water)  │
           │ Unchanged in    │          │ Changed by pure │          │ Contaminated by │
           │ color, taste,   │          │ substances (tea,│          │ ritual impurity │
           │ or smell.       │          │ rosewater).     │          │ (najasah).      │
           │ Purifying for   │          │ Clean for food; │          │ Prohibited for  │
           │ Wudu & Ghusl.   │          │ INVALID for     │          │ consumption &   │
           │                 │          │ ritual wudu.    │          │ ritual prayer.  │
           └─────────────────┘          └─────────────────┘          └─────────────────┘
```

---

## 2. Detailed Anatomy of Wudu (*Ibn 'Ashir* & *Mukhtasar Khalil*)

### The 7 Fara'id (Integrals):
1. **Al-Niyyah**: The intention at the start of washing to remove ritual impurity (*Raf' al-Hadath*) or make prayer permissible (*Istibahat al-Salah*).
2. **Ghasl al-Wajh**: Washing from forehead hairline to chin bottom, and between tragus of both ears.
3. **Ghasl al-Yadayn ilal-Mirfaqayn**: Washing both arms including elbows.
4. **Mas-h Jami' ar-Ra's**: Wiping the totality of the head from anterior hairline to the occiput. (Unlike the Shafi'i position where wiping a few hairs suffices, or Hanafi one-fourth).
5. **Ghasl al-Rijlayn ilal-Ka'bayn**: Washing feet including ankles.
6. **Al-Dalk**: Moving the hand over the body part during or immediately after the pouring of water, ensuring water reaches all pores.
7. **Al-Muwalat (Al-Fawr)**: Continuity of actions so that no previous limb dries under moderate atmospheric conditions.

---

## 3. Comparative Jurisprudence: The Sadl vs. Qabd Debate

The question of arm placement during the standing posture (*Qiyam*) represents a classic case study in legal methodology (*Usul al-Fiqh*):

| Position | Primary Madhhab | Core Textual & Methodological Evidence |
|---|---|---|
| **Sadl (Arms at sides)** | **Maliki (Prevalent)** | • **'Amal Ahl al-Madinah**: Imam Malik observed the senior scholars and thousands of descendants of the Sahabah in Madinah praying with arms at their sides.<br/>• **Hadith of the Person Who Prayed Badly (*Al-Musi'u Salatahu*)**: The Prophet ﷺ listed every obligatory posture of Salah but did not instruct folding hands.<br/>• The baseline state of human anatomy in standing is natural relaxation. |
| **Qabd (Hands folded)** | **Hanafi, Shafi'i, Hanbali** | • Hadith of Sahl ibn Sa'd in Sahih al-Bukhari: *"People were commanded to place the right hand over the left forearm in prayer."*<br/>• Hadith of Wa'il ibn Hujr. |

> **Scholarly Consensus**: Both *Sadl* and *Qabd* are valid, recognized Sunnahs of the Prophet ﷺ across the four schools. Disagreement here is in the realm of *Furu'* (branches), and mutual respect (*Adab al-Ikhtilaf*) is obligatory.

---

## 4. The Maliki Sujud as-Sahw Decision Matrix (Prostrations of Forgetfulness)

When an unintentional deficiency or addition occurs during Salah, Maliki jurisprudence resolves it with mathematical precision:

```
                           ┌───────────────────────────────┐
                           │   SUJUD AS-SAHW IN MALIKIYA   │
                           └───────────────┬───────────────┘
                     ┌─────────────────────┴─────────────────────┐
                     ▼                                           ▼
            ┌─────────────────┐                         ┌─────────────────┐
            │ 1. AL-QABLI     │                         │ 2. AL-BA'DI     │
            │ (Before Salam)  │                         │ (After Salam)   │
            │ Triggered by:   │                         │ Triggered by:   │
            │ DEFICIENCY      │                         │ ADDITION        │
            │ (Nuqsan) of two │                         │ (Ziyadah) such  │
            │ or more Sunnah  │                         │ as an extra     │
            │ Mu'akkadah acts │                         │ bowing or       │
            │ (e.g. omitting  │                         │ standing.       │
            │ first Tashahhud)│                         │ *Note: If BOTH  │
            │                 │                         │ deficiency AND  │
            │                 │                         │ addition occur, │
            │                 │                         │ QABLI prevails! │
            └─────────────────┘                         └─────────────────┘
```

---

## 5. Seminar Prompts:
1. Why did Imam Malik prioritize *'Amal Ahl al-Madinah* over solitary isolated reports (*Khabar al-Ahad*) in matters of daily visible worship like *Sadl* and the *Adhan*?
2. How does the taxonomy of water protect environmental mindfulness and water stewardship in contemporary life?
""",
        "l5_questions": """# Level 5 Seminar Assessment: Advanced Fiqh of Purification & Prayer
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** Comparative Usul al-Fiqh, Mukhtasar Khalil rulings, Sadl/Qabd, and Sujud as-Sahw  

---

## Part A: Advanced Multiple Choice

### 1. In Maliki jurisprudence, what is the legal consequence if an individual performs Wudu without *Dalk* (rubbing the limbs)?
* A) The wudu is valid according to all scholars without question
* B) The wudu is invalid according to the established (*Mashhur*) Maliki position, as Dalk is an integral Fard
* C) The person must fast three days
* D) It is merely disliked (*Makruh*)

### 2. Under what circumstance does a worshipper perform the Prostration of Forgetfulness *BEFORE* the final Taslim (*Sujud al-Qabli*)?
* A) Whenever they add an extra Rak'ah
* B) When there is a deficiency (*Nuqsan*) of two or more confirmed Sunnah acts, or a combined deficiency and addition
* C) Only when laughing out loud
* D) After every single prayer as a precaution

### 3. What foundational methodological principle led Imam Malik to endorse *Sadl* (praying with arms resting at the sides)?
* A) Dislike of folding hands
* B) The continuous transmission of thousands of Madinan scholars ('Amal Ahl al-Madinah) tracing directly to the Prophet's regular public prayer
* C) Lack of knowledge of hadith
* D) A desire to differ from other cities

### 4. If someone unintentionally adds a fifth Rak'ah to Zuhr prayer and remembers during the final sitting, how do they rectify the prayer in Maliki fiqh?
* A) Repeat the entire prayer from the start
* B) Complete the prayer, pronounce the final Salam, then perform two prostrations followed by Tashahhud and another Salam (*Sujud al-Ba'di*)
* C) Ignore it completely
* D) Perform 4 prostrations before the Salam

### 5. What is the extent of wiping the head (*Mas-h ar-Ra's*) required in the Maliki school compared to the Shafi'i school?
* A) Maliki requires the entire head; Shafi'i permits wiping just a few strands of hair within the head boundary
* B) Both require washing the head three times
* C) Maliki requires wiping one hair; Shafi'i requires the whole head
* D) Neither school requires wiping the head

### 6. If pure tap water has tea leaves boiled in it so that its color, taste, and name change to "tea", how is it categorized?
* A) Ma' Mutlaq (Valid for Wudu)
* B) Ma' Najis (Impure and forbidden)
* C) Ma' Tahir ghayr Mutahhir (Clean for drinking, but invalid for ritual purification)
* D) Makruh for cooking

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Sujud al-Ba'di, Amal Ahl al-Madinah, Dalk, Mas-h Jami' ar-Ra's, Tahur*

7. Absolute purifying water that retains its natural taste, color, and smell is termed **_________________**.
8. The physical rubbing of a limb with water during Wudu is called **_________________**.
9. In Maliki fiqh, wiping the entire head from hairline to nape is called **_________________**.
10. The prostrations performed after the final Salam to rectify an addition (*Ziyadah*) are called **_________________**.

---

## Part C: Advanced Matching Matrix
Pair 1: Sujud al-Qabli --- Rectifies deficiency of 2+ Sunan (performed pre-salam)
Pair 2: Sujud al-Ba'di --- Rectifies an addition to prayer (performed post-salam)
Pair 3: Sadl --- Natural arm posture anchored in Madinan continuous practice
Pair 4: Al-Muwalat --- Continuity of wudu acts without drying gap

---

## Part D: Analytical Case Study
11. **Fiqh Case Analysis**: Zayd was leading the 'Asr prayer. In the second Rak'ah, he forgot to sit for the middle Tashahhud and stood straight up into the third Rak'ah. The congregation said *"SubhanAllah"*, but Zayd was already fully upright. 
* Question: According to Maliki fiqh, should Zayd return to the sitting posture or continue standing? When and how should he perform Sujud as-Sahw? Explain the precise legal reasoning.

---

## Teacher Answer Key
1. B) In the Mashhur Maliki position, Dalk is a pillar (*Fard*).
2. B) Sujud al-Qabli rectifies deficiency (*Nuqsan*).
3. B) 'Amal Ahl al-Madinah was Imam Malik's paramount living evidence.
4. B) Sujud al-Ba'di rectifies addition (*Ziyadah*).
5. A) Malikis obligate wiping the whole head; Shafi'is allow a minimal part.
6. C) Changed by clean matter = Tahir ghayr Mutahhir.
7. Tahur
8. Dalk
9. Mas-h Jami' ar-Ra's
10. Sujud al-Ba'di
"""
    }
]

print(f"Loaded base configs for {len(MODULE_CONFIGS)} modules.")
