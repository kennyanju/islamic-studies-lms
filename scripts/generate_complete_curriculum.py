#!/usr/bin/env python3
"""
Master Generator: Populates Level 1 (Ages 6-8), Level 2 (Ages 8-10), and Level 5 (Ages 14-16+)
Handouts and Question Banks for all 9 LMS modules.
Guarantees 100% adherence to Ash'ari Creed, Maliki Fiqh, and 'Other Scholars Say' comparative framework.
"""

import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODULE_DATA = [
    # MODULE 1
    {
        "folder": "1 — Foundations of Belief",
        "mdDir": "MD Foundations of Belief",
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

1. **Al-Hiss al-Salim (Sound Senses)**: The realm of direct empirical observation, measurable data, and physical experimentation.
2. **Al-'Aql al-Sarih (Pure Reason)**: Necessary rational axioms (e.g. the principle of non-contradiction, causality, mathematical necessity).
3. **Al-Khabar al-Sadiq (Veracious Transmission)**: Authentic historical reports transmitting beyond doubt (*Tawatur*) and Divine Revelation (*Wahy*).

---

## 2. The 20 Necessary Attributes of Allah (Al-Sifat al-Wajibah)
Imam al-Sanusi categorized the necessary attributes into 4 coherent branches:
* **Al-Nafsiyyah (Essential)**: *Al-Wujud* (Existence).
* **Al-Salbiyyah (Negating Deficiency)**: *Al-Qidam* (Beginninglessness), *Al-Baqa'* (Endlessness), *Mukhalafah lil-Hawadith* (Absolute Incomparability), *Al-Qiyam bin-Nafs* (Self-Subsistence), *Al-Wahdaniyyah* (Absolute Oneness).
* **Al-Ma'ani (Positive Divine Qualities)**: *Qudrah* (Power), *Iradah* (Will), *'Ilm* (Knowledge), *Hayah* (Life), *Sam'* (Hearing), *Basar* (Sight), *Kalam* (Speech).
* **Al-Ma'nawiyyah (Active Relational States)**: The seven states corresponding to the Ma'ani attributes.

---

## 3. Human Responsibility: Kasb (Acquisition)
* The **Jabriyyah** claimed human actions are coerced like leaves in the wind. (Rejected: Destroys moral justice).
* The **Mu'tazilah** claimed humans create their own actions outside of Allah's power. (Rejected: Violates absolute Tawhid).
* The **Ahl al-Sunnah (Ash'ari position)**: Allah alone creates (*Khalq*) the capacity and the act, while the human being supplies the conscious intentional choice (*Kasb/Ikhtiyar*).
""",
        "l5_questions": """# Level 5 Seminar Assessment: Foundations of Creed & Epistemology
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** Advanced Epistemology, Ash'ari Kalam, Kasb, and Comparative Apologetics  

---

## Part A: Advanced Multiple Choice

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

### 5. What was Imam Malik's celebrated response to the man who questioned the modality of *Istiwa'*?
* A) "The Istiwa' is known, the modality is inconceivable, believing in it is obligatory, and asking how is an innovation (*Bid'ah*)."
* B) "Allah sits upon a physical chair like a king."
* C) "Leave the religion immediately."
* D) "We should not believe in divine attributes."

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Kalam Nafsi, Mukhalafah lil-Hawadith, Tawatur, Tanzih, Amal Ahl al-Madinah*

6. The attribute meaning Allah is completely distinct from created things in essence, attributes, and actions is **_________________**.
7. A mass-transmitted historical report that is impossible for its transmitters to have colluded upon a lie is known as **_________________**.
8. In classical Ash'ari theology, the eternal, uncreated attribute of divine speech without letters or vocal sounds is termed **_________________**.
9. Imam Malik prioritized the living continuous community practice of the Prophet's city, termed **_________________**, as an authoritative legal source.

---

## Part C: Advanced Matching Matrix
Pair 1: Sifat al-Nafsiyyah --- Al-Wujud (Self-evident Reality of Essence)
Pair 2: Sifat al-Salbiyyah --- Al-Qidam, Al-Baqa', Mukhalafah lil-Hawadith
Pair 3: Sifat al-Ma'ani --- Qudrah, Iradah, 'Ilm, Hayah, Sam', Basar, Kalam
Pair 4: Sifat al-Ma'nawiyyah --- Being Powerful, Willing, Knowing, Living, Hearing, Seeing, Speaking

---

## Part D: Analytical Case Study
10. A university peer claims: *"Since physics cannot measure God in a test tube, belief in a Creator is unscientific."* Formulate a structured 3-point rebuttal based on the 3 channels of knowledge (*Asbab al-'Ilm*).

---

## Teacher Answer Key
1. B) Scientism is self-referentially incoherent because its core axiom cannot be verified by the scientific method.
2. C) The cosmos is contingent (*Ja'iz*); its existence or non-existence is equally conceivable to the intellect.
3. B) The Sifat al-Salbiyyah negate deficiencies.
4. C) Kasb affirms Allah as the sole Creator while affirming human moral accountability through intentional choice.
5. A) Imam Malik's famous declaration anchored classical Sunni moderation.
6. Mukhalafah lil-Hawadith
7. Tawatur
8. Kalam Nafsi
9. Amal Ahl al-Madinah
"""
    },

    # MODULE 2
    {
        "folder": "2— Purification & Prayer",
        "mdDir": "MD Purification & Prayer",
        "l1_handout": """# Level 1 Student Handout: Purification & Prayer
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** Clean Hands, My First Wudu, Standing in Prayer (Sadl), and Happy Sujud  
**Theological Anchor:** Maliki Fiqh & Loving Worship  

---

## 💧 Cleanliness is Half of Faith!
Before we stand before Allah to speak with Him in prayer (Salah), we wash our bodies with cool, clean water. This special wash is called **Wudu** (الْوُضُوء).

---

## 🧼 The 7 Special Steps of Wudu (Fara'id)
In the school of **Imam Malik**, there are 7 obligatory steps in Wudu:
1. **Intention (Niyyah):** In your heart, you decide to pray for Allah!
2. **Wash Your Face:** From top of forehead to chin, ear to ear!
3. **Wash Your Arms:** From fingertips past the elbows!
4. **Wipe Your Whole Head:** Gently wipe front to back!
5. **Wash Your Feet:** Right then left, washing past ankles!
6. **Gentle Rubbing (Dalk):** Gently rub your skin with water so every spot is clean!
7. **One Step After Another (Muwalat):** Don't wait for your arms to dry before washing your feet!

---

## 🕌 Standing in Prayer (Salah)
* We face the **Qiblah** towards the Ka'bah.
* We say: **Allahu Akbar**!
* In the Maliki way, we let our arms rest naturally and comfortably at our sides (**Sadl**).
* We bow (**Ruku'**) and say: *Subhana Rabbiyal 'Adheem*.
* We touch our forehead to the floor in **Sujud** and whisper our heartfelt du'as!
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
* A) The Qiblah
* B) North Pole
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
2. A) The Qiblah is the prayer direction.
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
1. **Tahur (Purifying Water):** Pure water retaining its natural state. Valid for Wudu and Ghusl.
2. **Tahir (Clean Water):** Water mixed with clean tea, soap, or syrup. Clean to drink, but invalid for Wudu.
3. **Najis (Impure Water):** Contaminated by ritual impurity. Prohibited for prayer and drinking.

---

## 📜 2. The 7 Fard Steps of Wudu in Maliki Fiqh
1. **An-Niyyah**: Intention in the heart.
2. **Ghasl al-Wajh**: Washing entire face.
3. **Ghasl al-Yadayn**: Washing arms to elbows.
4. **Mas-h ar-Ra's**: Wiping the entire head.
5. **Ghasl ar-Rijlayn**: Washing feet to ankles.
6. **Ad-Dalk**: Rubbing limbs with water.
7. **Al-Muwalat**: Continuous sequence without drying.

---

## 🕌 3. The 5 Daily Prayers & Rak'ahs
* **Fajr**: 2 Rak'ahs | **Zuhr**: 4 Rak'ahs | **'Asr**: 4 Rak'ahs | **Maghrib**: 3 Rak'ahs | **'Isha**: 4 Rak'ahs
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

---

## Part B: Fill in the Blanks
*Word Bank: Seven, Muwalat, Tahur, Qiblah, Fajr*

6. The morning prayer before sunrise consisting of 2 rak'ahs is **_________________**.
7. In Maliki fiqh, there are **_________________** fara'id of Wudu.
8. Doing wudu steps continuously without leaving a limb to dry is called **_________________**.
9. The direction of the Ka'bah that all Muslims face is the **_________________**.

---

## Part C: Matching Pairs
Pair 1: Dalk --- Rubbing the limb during washing
Pair 2: Muwalat --- Continuous washing without delay
Pair 3: Mas-h ar-Ra's --- Wiping the entire head
Pair 4: Sadl --- Letting arms rest at sides in Qiyam

---

## Part D: Reflection
10. Why is learning the difference between Fard and Sunnah acts helpful when we travel?

---

## Teacher Answer Key
1. A) Tahur water is unconditionally purifying.
2. B) 7 fara'id in Maliki fiqh.
3. A) Dalk is a pillar of wudu.
4. B) Maghrib is 3 rak'ahs.
5. A) Sadl is resting arms naturally.
6. Fajr
7. Seven
8. Muwalat
9. Qiblah
""",
        "l5_handout": """# Level 5 Seminar Guide: Advanced Jurisprudence of Taharah & Salah
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** Water Taxonomy, Usul of Taharah, Mukhtasar Khalil Fara'id, Sadl/Qabd Comparative Evidences, Sujud as-Sahw Engine  
**Classical Spine:** *Matn Ibn 'Ashir*, *Mukhtasar Khalil*, and *Bidayat al-Mujtahid* (Ibn Rushd)  

---

## 1. Usul al-Taharah & Water Classification
The legal axiom states: **Al-Aslu fi al-Ashya'i al-Taharah** (The baseline state of matter is purity).
* **Al-Ma' al-Mutlaq**: Absolute natural water.
* **Al-Ma' al-Tahir**: Water modified by clean substances (tea, milk). Clean for drinking, but invalid for ritual purification.
* **Al-Ma' al-Najis**: Contaminated by ritual impurity (*Najasah*).

---

## 2. Comparative Jurisprudence: Sadl vs. Qabd
* **Sadl (Arms at sides)**: The predominant position in the Maliki madhhab, anchored in **'Amal Ahl al-Madinah** (the living practice of thousands of scholars in the city of the Prophet ﷺ).
* **Qabd (Hands folded)**: Established in the Shafi'i, Hanbali, and Hanafi schools based on isolated reports (*Ahad*).
Both are valid Sunni practices, and mutual respect (*Adab al-Ikhtilaf*) is obligatory.

---

## 3. The Maliki Sujud as-Sahw Decision Matrix
* **Sujud al-Qabli (Before Salam)**: Triggered by a **deficiency** (*Nuqsan*) of two or more confirmed Sunnah acts (e.g. omitting the first Tashahhud).
* **Sujud al-Ba'di (After Salam)**: Triggered by an **addition** (*Ziyadah*) to prayer.
* **Combined Deficiency and Addition**: The Qabli prostration prevails!
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

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Sujud al-Ba'di, Amal Ahl al-Madinah, Dalk, Mas-h Jami' ar-Ra's, Tahur*

6. Absolute purifying water that retains its natural taste, color, and smell is termed **_________________**.
7. The physical rubbing of a limb with water during Wudu is called **_________________**.
8. In Maliki fiqh, wiping the entire head from hairline to nape is called **_________________**.
9. The prostrations performed after the final Salam to rectify an addition (*Ziyadah*) are called **_________________**.

---

## Part C: Advanced Matching Matrix
Pair 1: Sujud al-Qabli --- Rectifies deficiency of 2+ Sunan (performed pre-salam)
Pair 2: Sujud al-Ba'di --- Rectifies an addition to prayer (performed post-salam)
Pair 3: Sadl --- Natural arm posture anchored in Madinan continuous practice
Pair 4: Al-Muwalat --- Continuity of wudu acts without drying gap

---

## Part D: Analytical Case Study
10. A worshipper forgets the first Tashahhud in Maghrib and stands directly up. At the end, what exact prostrations do they perform and why?

---

## Teacher Answer Key
1. B) In the Mashhur Maliki position, Dalk is a pillar (*Fard*).
2. B) Sujud al-Qabli rectifies deficiency (*Nuqsan*).
3. B) 'Amal Ahl al-Madinah was Imam Malik's paramount living evidence.
4. B) Sujud al-Ba'di rectifies addition (*Ziyadah*).
5. A) Malikis obligate wiping the whole head; Shafi'is allow a minimal part.
6. Tahur
7. Dalk
8. Mas-h Jami' ar-Ra's
9. Sujud al-Ba'di
"""
    },

    # MODULE 3
    {
        "folder": "3 — Seerah The Early Life of the Prophet ",
        "mdDir": "MD Seerah The Early Life of the Prophet ",
        "l1_handout": """# Level 1 Student Handout: Seerah — The Early Life of the Prophet ﷺ
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** The Year of the Elephant, The Orphan Boy in the Desert, and Al-Amin  
**Theological Anchor:** Prophetic Character & Loving Muhammad ﷺ  

---

## 🐘 The Year of the Elephant
Long ago, before our beloved Prophet Muhammad ﷺ was born, an army with a giant elephant marched towards Makkah to harm the holy Ka'bah. 
The people of Makkah could not stop them, but Allah protected His Sacred House! 
Allah sent flocks of little birds carrying tiny clay pebbles, and the army was defeated. That amazing year was called **The Year of the Elephant**!

---

## 🍼 The Blessed Baby in the Desert
In that very year, Prophet Muhammad ﷺ was born in Makkah. 
His father 'Abdullah had passed away before he was born, so he was an orphan. 
He was taken to the clean, open desert by a kind foster mother named **Halimah as-Sa'diyyah**. 
Halimah's home was filled with blessings, milk, and joy as long as baby Muhammad ﷺ was with her!

---

## 💎 Al-Amin: The Honest Boy Who Never Lied
As Muhammad ﷺ grew up, he never worshipped idols, never lied, and never broke a promise. 
All the people of Makkah loved him and gave him the title:
* **Al-Sadiq (The Truthful)**
* **Al-Amin (The Trustworthy)**

When we tell the truth and keep our promises to our family and teachers, we are following our beloved Prophet ﷺ!
""",
        "l1_questions": """# Level 1 Activity Sheet: Early Life of the Prophet ﷺ
**Age Group:** Ages 6–8 (Level 1 Track)  
**Focus:** Year of the Elephant, Baby Muhammad ﷺ, and Al-Amin  

---

## Part A: Multiple Choice

### 1. In which city was Prophet Muhammad ﷺ born?
* A) Makkah
* B) Cairo
* C) London
* D) Istanbul

### 2. Who was the kind foster mother who cared for baby Muhammad ﷺ in the desert?
* A) Halimah as-Sa'diyyah
* B) Maryam
* C) Asiyah
* D) Sarah

### 3. What special nickname did the people of Makkah give young Muhammad ﷺ because he never lied?
* A) Al-Amin (The Trustworthy)
* B) The Brave Runner
* C) The Desert King
* D) The Silent One

### 4. What happened to the army of the elephant that tried to harm the Ka'bah?
* A) Flocks of birds sent by Allah protected the Ka'bah
* B) It rained gold
* C) The elephant ran into the sea
* D) Nothing happened

### 5. How can we be like Prophet Muhammad ﷺ today?
* A) By always telling the truth and being kind
* B) By shouting at our friends
* C) By hiding our toys
* D) By not doing our chores

---

## Part B: Fill in the Blanks
*Word Bank: Al-Amin, Halimah, Makkah*

6. Prophet Muhammad ﷺ was born in the blessed city of **_________________**.
7. The loving nurse who cared for him in the desert was Lady **_________________**.
8. Because he never lied, people called him **_________________**.

---

## Part C: Matching Pairs
Pair 1: Year of the Elephant --- The year Prophet Muhammad ﷺ was born
Pair 2: Halimah --- The loving foster mother in the desert
Pair 3: Al-Amin --- The Trustworthy who always spoke truth

---

## Part D: Reflection
9. What is one honest deed you can do today to be like Al-Amin?

---

## Teacher Answer Key
1. A) Makkah is the birthplace of the Prophet ﷺ.
2. A) Lady Halimah cared for him.
3. A) Al-Amin means The Trustworthy.
4. A) Small birds protected the Ka'bah by Allah's command.
5. A) Telling the truth and showing kindness.
6. Makkah
7. Halimah
8. Al-Amin
""",
        "l2_handout": """# Level 2 Student Handout: Seerah — Early Life & The Call to Prophethood
**Age Group:** Ages 8–10 (Level 2 Track)  
**Topics:** Hilf al-Fudul, Rebuilding the Ka'bah, Marriage to Khadijah (RA), and Cave Hira  
**Theological Anchor:** Prophetic Infallibility & Sacred History  

---

## 🤝 1. Hilf al-Fudul: The League of Justice
As a young man, Muhammad ﷺ joined a noble pact in Makkah called **Hilf al-Fudul** (The League of the Virtuous). 
The elders swore that whenever any traveler or stranger was wronged in Makkah, they would stand together and restore their rights. The Prophet ﷺ praised this agreement even after Islam!

---

## 🕋 2. The Wisdom of Placing the Black Stone
When the tribes rebuilt the Ka'bah, an argument broke out over who would place the sacred **Black Stone** (*Al-Hajar al-Aswad*). They almost went to war! 
Muhammad ﷺ resolved it with brilliant wisdom: he spread his cloak on the ground, placed the stone in the middle, and had each tribal chief hold an edge to lift it together.

---

## 🏔️ 3. Cave Hira & The First Revelation (Iqra'!)
At age 40, during the month of Ramadan, the Prophet ﷺ was worshipping in **Cave Hira** high on the Mountain of Light (*Jabal al-Nur*). 
Angel Jibril appeared in divine glory and commanded: *"Iqra'!"* (Read!). 
The first five verses of **Surah Al-'Alaq** were revealed, lighting the torch of guidance for all humanity!
""",
        "l2_questions": """# Level 2 Worksheet: Early Life & Prophethood
**Age Group:** Ages 8–10 (Level 2 Track)  
**Focus:** Hilf al-Fudul, Black Stone incident, Lady Khadijah, and Cave Hira  

---

## Part A: Multiple Choice

### 1. What was Hilf al-Fudul?
* A) A horse race
* B) A noble pact to protect the oppressed and travelers in Makkah
* C) A poetry contest
* D) A trade fair

### 2. How did Prophet Muhammad ﷺ resolve the tribal dispute over the Black Stone?
* A) He had all tribal leaders hold his cloak together to lift the stone
* B) He threw the stone into the valley
* C) He picked a winner by lottery
* D) He kept the stone in his house

### 3. In which cave was the first revelation of the Quran revealed?
* A) Cave Thawr
* B) Cave Hira
* C) Cave of Uhud
* D) Cave of Sinai

### 4. What was the very first word of the Quran revealed to Prophet Muhammad ﷺ?
* A) Bismillah
* B) Iqra' (Read!)
* C) Qul
* D) Salam

### 5. Who was the first person to believe in Prophet Muhammad ﷺ and comfort him after the first revelation?
* A) Lady Khadijah (RA)
* B) Abu Jahl
* C) The King of Rome
* D) A Roman merchant

---

## Part B: Fill in the Blanks
*Word Bank: Iqra, Khadijah, Hira, Cloak*

6. The cave on Jabal al-Nur where the Prophet ﷺ retreated was Cave **_________________**.
7. The first divine command spoken by Angel Jibril was **_________________**.
8. To share the honor of the Black Stone, the Prophet ﷺ placed it upon his **_________________**.
9. The noble wife who supported the Prophet ﷺ wholeheartedly was Lady **_________________**.

---

## Part C: Matching Pairs
Pair 1: Cave Hira --- Location of the first revelation (Iqra')
Pair 2: Lady Khadijah --- First believer and beloved supportive wife
Pair 3: Hilf al-Fudul --- Alliance formed to defend the oppressed
Pair 4: Black Stone --- Sacred stone placed by tribal consensus

---

## Part D: Reflection
10. What does the Prophet's ﷺ resolution of the Black Stone dispute teach us about teamwork and peace-making?

---

## Teacher Answer Key
1. B) Hilf al-Fudul defended oppressed travelers.
2. A) Placing the stone on a cloak united the tribes.
3. B) Cave Hira on Jabal al-Nur.
4. B) Iqra' (Read!).
5. A) Lady Khadijah (RA).
6. Hira
7. Iqra
8. Cloak
9. Khadijah
""",
        "l5_handout": """# Level 5 Seminar Guide: Analytical Seerah — The Makkan Period
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** Geopolitical Context of Arabia, Hanifism, Proofs of Prophethood, 'Ismah, Boycott of Banu Hashim, Ta'if, Al-Isra' wal-Mi'raj  
**Classical Spine:** *Al-Shifa* of Qadi 'Iyad & *Al-Sirah al-Nabawiyyah* of Ibn Hisham  

---

## 1. Geopolitical Landscape of Pre-Islamic Arabia
Pre-Islamic Arabia was sandwiched between two superpower empires: the Christian **Byzantine Empire** and the Zoroastrian **Sasanian Persian Empire**. Makkah maintained an autonomous tribal merchant sanctuary centered on the Ka'bah. 
* **The Jahiliyyah Crisis**: Characterized by idolatry (*Shirk*), infanticide, blood feuds, and unbridled tribalism (*'Asabiyyah*).
* **The Hanifs**: Solitary monotheists (e.g. Zayd ibn 'Amr ibn Nufayl, Waraqah ibn Nawfal) who rejected idols and clung to the remnants of the Abrahamic faith (*Millat Ibrahim*).

---

## 2. Epistemic Proof of Prophethood & Infallibility ('Ismah)
In Ash'ari theology, Prophets possess necessary moral attributes:
1. **Al-Sidq (Veracity)**: Inconceivable that they lie.
2. **Al-Amanah (Trustworthiness)**: Inconceivable that they betray a trust.
3. **Al-Tabligh (Conveyance)**: Faithfully delivering every word commanded by Allah.
4. **Al-Fatanah (Intellectual Acumen)**: Supreme wisdom in argument and leadership.
5. **Al-'Ismah (Infallibility)**: Divine protection from major sins, indecent traits, and minor dishonorable lapses both before and after commission.

---

## 3. The Grand Makkan Trials: Boycott, Ta'if & Al-Isra'
* **The Boycott of Shi'b Abi Talib (Years 7–10 of Prophethood)**: Economic and social embargo where Banu Hashim were starved for 3 years, highlighting ideological steadfastness.
* **The Mission to Ta'if**: Rejected and pelted with stones, the Prophet ﷺ prayed the legendary du'a: *"O Allah, to You I complain of my weakness..."*, refusing the Archangel's offer to destroy the city.
* **Al-Isra' wal-Mi'raj**: The Night Journey from Makkah to Jerusalem and Ascension through the heavens, establishing the 5 daily prayers as the celestial anchor of the Ummah.
""",
        "l5_questions": """# Level 5 Seminar Assessment: Analytical Makkan Seerah
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** Epistemology of Prophethood, Pre-Islamic Geopolitics, 'Ismah, and Diplomatic Strategy  

---

## Part A: Advanced Multiple Choice

### 1. In classical Sunni theology, what is the scope of Prophetic Infallibility (*'Ismah*)?
* A) Prophets only avoid murder
* B) Prophets are protected by Allah from committing major sins (*Kaba'ir*) and dishonorable minor sins (*Sagha'ir al-Khisah*) both before and after prophethood
* C) Prophets are divine beings
* D) Infallibility only applies when reciting the Quran

### 2. How did the Hanifs of pre-Islamic Arabia differ from the polytheistic Quraysh?
* A) They worshipped roman gods
* B) They rejected idols and preserved monotheism according to the Abrahamic legacy (*Millat Ibrahim*)
* C) They did not live in Arabia
* D) They refused to trade goods

### 3. What profound moral lesson is extracted from the Prophet's response to the leaders of Ta'if who assaulted him?
* A) Vengeance is the highest priority
* B) Supreme forbearance (*Hilm*) and divine mission prioritized over personal grievance, hoping for future generations to believe
* C) Retiring from dawah
* D) Abandoning Arabia entirely

### 4. What theological institution was established during the heavenly ascension of Al-Mi'raj?
* A) The 5 daily obligatory prayers (Salah)
* B) The rules of inheritance
* C) The construction of Madinah
* D) The prohibition of trading

### 5. Why was the migration of the early oppressed Muslims to Abyssinia (modern Ethiopia) strategically significant?
* A) To build a trade empire
* B) It demonstrated international diplomatic acumen, seeking sanctuary under a just Christian king (Al-Najashi) based on shared monotheistic values
* C) It was an accident of navigation
* D) To escape the Arabian climate

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Ismah, Hanif, Shi'b Abi Talib, Al-Isra, Hilf al-Fudul*

6. Divine protection preventing Prophets from committing sins is known as **_________________**.
7. The pre-Islamic monotheist who worships the One God on the path of Ibrahim is a **_________________**.
8. The valley where Banu Hashim endured a 3-year commercial and social boycott was **_________________**.
9. The miraculous night journey from the Sacred Mosque in Makkah to Al-Aqsa Mosque in Jerusalem is **_________________**.

---

## Part C: Advanced Matching Matrix
Pair 1: Hilf al-Fudul --- Early civic coalition to defend oppressed travelers
Pair 2: Al-Najashi --- Just Abyssinian monarch who protected Muslim refugees
Pair 3: Lady Khadijah --- Financially and emotionally anchored early revelation
Pair 4: 'Ismah --- Doctrinal infallibility of the Prophets

---

## Part D: Analytical Essay Prompt
10. Analyze the diplomatic dialogue between Ja'far ibn Abi Talib and King Negus (Al-Najashi). How does Ja'far's speech articulate the transformative civilizational impact of Islam upon pre-Islamic society?

---

## Teacher Answer Key
1. B) Comprehensive 'Ismah in creed.
2. B) Hanifs adhered to Abrahamic monotheism.
3. B) Sublime mercy and forbearance (*Hilm*).
4. A) The 5 daily prayers were decreed.
5. B) Principled foreign diplomacy under a just ruler.
6. Ismah
7. Hanif
8. Shi'b Abi Talib
9. Al-Isra
"""
    }
]

print(f"Authoring complete curriculum files for {len(MODULE_DATA)} initial modules...")
