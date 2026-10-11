#!/usr/bin/env python3
"""
Appends definitions for Modules 4 through 9 and outputs all markdown files
(handout_level1.md, questions_level1.md, handout_level2.md, questions_level2.md,
 handout_level5.md, questions_level5.md) into their respective module directories.
"""

import os
import sys

# Import the existing MODULE_DATA from scripts/generate_complete_curriculum.py
sys.path.append(os.path.join(os.path.dirname(__file__)))
from generate_complete_curriculum import MODULE_DATA, ROOT_DIR

MODULES_4_TO_9 = [
    # MODULE 4
    {
        "folder": "4— Deepening Belief & the Quran",
        "mdDir": "MD Deepening Belief & the Quran",
        "l1_handout": """# Level 1 Student Handout: Deepening Belief & the Quran
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** The Holy Quran is Allah's Speech, Beautiful Recitation, and Short Surahs  
**Theological Anchor:** Ash'ari Love of the Quran  

---

## 📖 The Most Beautiful Book in the World!
The Noble Quran is the special Book that Allah sent to us. 
It is not like any storybook written by people — the Quran is **Allah's Own Words**!
When we recite the Quran:
* Every single letter gives us **10 good deeds (hasanat)**!
* The angels come close to listen to our recitation.
* Our hearts feel calm, peaceful, and happy.

---

## 🌟 How We Respect the Quran
1. We make sure our hands are clean before touching the Mushaf.
2. We place the Quran on a high, clean table or rehal stand.
3. We listen quietly when someone is reciting the Quran.

---

## 🌺 Three Special Surahs Every Little Believer Loves:
* **Surah Al-Fatihah (The Opening):** The greatest surah that we recite in every prayer!
* **Surah Al-Ikhlas (Sincerity):** *"Say: He is Allah, the One! Allah, the Self-Sufficient!"* (Reciting it equals one-third of the Quran!).
* **Surah Al-Falaq & An-Nas (The Protectors):** We recite them before sleeping so Allah protects us from all harm!
""",
        "l1_questions": """# Level 1 Activity Sheet: Deepening Belief & the Quran
**Age Group:** Ages 6–8 (Level 1 Track)  
**Focus:** Respecting the Quran, Beautiful Words, and Surahs  

---

## Part A: Multiple Choice

### 1. Who revealed the Noble Quran to Prophet Muhammad ﷺ?
* A) Allah through Angel Jibril
* B) A poet in the desert
* C) A king in a palace
* D) No one

### 2. How many good deeds (hasanat) do we earn for reciting just ONE letter of the Quran?
* A) 1 good deed
* B) 5 good deeds
* C) 10 good deeds
* D) None

### 3. Which surah is recited in every single unit (rak'ah) of our daily prayers?
* A) Surah Al-Fatihah
* B) Surah Al-Baqarah
* C) Surah Yasin
* D) Surah Al-Mulk

### 4. What should we do when someone is reciting the Quran aloud?
* A) Run around and shout
* B) Listen quietly and respectfully
* C) Turn up the TV volume
* D) Leave the room

### 5. Which surah teaches us that Allah is One, has no children and no parents?
* A) Surah Al-Ikhlas
* B) Surah Al-Fil
* C) Surah Quraysh
* D) Surah Al-Kawthar

---

## Part B: Fill in the Blanks
*Word Bank: Ten, Fatihah, Words*

6. The Noble Quran is the direct **_________________** of Allah.
7. Surah Al-**_________________** is the opening surah of the Quran.
8. Reciting one letter of the Quran gives us **_________________** good deeds.

---

## Part C: Matching Pairs
Pair 1: Surah Al-Fatihah --- The Mother of the Quran recited in Salah
Pair 2: Surah Al-Ikhlas --- Declares Allah is One and Unique
Pair 3: 10 Hasanat --- Reward for reciting one letter of Quran

---

## Part D: Reflection
9. Recite your favorite short surah to your parent with a soft, beautiful voice!

---

## Teacher Answer Key
1. A) Allah revealed it through Jibril.
2. C) 10 hasanat per letter.
3. A) Surah Al-Fatihah.
4. B) Listen quietly and attentively.
5. A) Surah Al-Ikhlas.
6. Words
7. Fatihah
8. Ten
""",
        "l2_handout": """# Level 2 Student Handout: Deepening Belief & the Quran
**Age Group:** Ages 8–10 (Level 2 Track)  
**Topics:** 23 Years of Revelation, Tajweed Basics, Tafsir of Al-Ikhlas, and Sincerity of Niyyah  
**Theological Anchor:** Ash'ari Creed & Quranic Sciences  

---

## 📜 1. How the Quran Was Revealed
The Quran was not sent down as a pre-bound printed book all at once. 
Instead, it was revealed **gradually over 23 years**:
* **13 Years in Makkah**: Focused on Tawhid, the Hereafter, and building strong hearts of faith.
* **10 Years in Madinah**: Focused on community laws, worship (Salah, Zakah, Sawm), and brotherhood.

---

## 🎵 2. Tajweed Basics: Beautifying the Quran
The Prophet ﷺ said: *"Beautify the Quran with your voices!"*
* **Madd Tabee'ee (Natural Prolongation)**: Stretching letters (Alif, Waw, Yaa) for 2 counts (e.g. *Qaaa-la*).
* **Heavy Letters (Tafkhim)**: Reciting letters with a full, bold mouth (The 7 heavy letters: *Kha, Saad, Daad, Ghayn, Taa, Qaf, Dhaa*).

---

## 💎 3. Tafsir of Surah Al-Ikhlas (Pure Monotheism)
* **Qul Huwallahu Ahad**: Say: He is Allah, the Unique One without any partners or parts.
* **Allahu al-Samad**: Allah is the Absolute Master Whom all creation depends upon, while He depends upon none.
* **Lam yalid wa lam yulad**: He did not beget, nor was He begotten (He has no children and no parents).
* **Wa lam yakul lahu kufuwan ahad**: And there is nothing like unto Him in any way!
""",
        "l2_questions": """# Level 2 Worksheet: Deepening Belief & the Quran
**Age Group:** Ages 8–10 (Level 2 Track)  
**Focus:** 23 Years of Revelation, Tajweed, and Surah Al-Ikhlas  

---

## Part A: Multiple Choice

### 1. Over how many years was the Quran revealed to Prophet Muhammad ﷺ?
* A) 1 year
* B) 10 years
* C) 23 years
* D) 50 years

### 2. What was the main theme of the Makkan revelations (the first 13 years)?
* A) Tawhid, the Hereafter, and building sincere faith
* B) Complex inheritance laws
* C) Building cities
* D) Maritime trade

### 3. What does the divine name *Al-Samad* mean in Surah Al-Ikhlas?
* A) The Rich King
* B) The Eternal, Self-Sufficient Master Whom all creation needs, while He needs nothing
* C) The Hidden Light
* D) The Fast Runner

### 4. What are heavy letters in Tajweed called?
* A) Tarqiq
* B) Tafkhim
* C) Ghunnah
* D) Qalqalah

### 5. Why was the Quran revealed gradually in stages rather than all at once?
* A) To strengthen the Prophet's heart and make it easy for believers to memorize and live by its teachings
* B) Because paper was not available
* C) It was an accident
* D) The angels were too busy

---

## Part B: Fill in the Blanks
*Word Bank: Al-Samad, Twenty-three, Tafkhim, Makkah*

6. The Quran was revealed gradually over a period of **_________________** years.
7. Surahs revealed before the Hijrah are known as **_________________** surahs.
8. Pronouncing a letter with a full, deep mouth in Tajweed is called **_________________**.
9. The Name meaning the Self-Sufficient Master in Surah Al-Ikhlas is **_________________**.

---

## Part C: Matching Pairs
Pair 1: Tafkhim --- Heavy/bold pronunciation of specific letters
Pair 2: Madd Tabee'ee --- Natural 2-count elongation of vowel sounds
Pair 3: 23 Years --- Gradual timeline of Quranic revelation
Pair 4: Al-Samad --- The Master upon Whom all creation depends

---

## Part D: Reflection
10. Why is it easier to build good daily habits when we learn them step-by-step, just as the Quran was revealed gradually?

---

## Teacher Answer Key
1. C) 23 years.
2. A) Tawhid and faith in Makkah.
3. B) The Self-Sufficient Master.
4. B) Tafkhim.
5. A) To strengthen hearts and allow gradual application.
6. Twenty-three
7. Makkah
8. Tafkhim
9. Al-Samad
""",
        "l5_handout": """# Level 5 Seminar Guide: 'Ulum al-Qur'an, Inimitability & Theology of Speech
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** History of Textual Transmission, Uthmanic Codex, The Seven Ahruf, Kalam Nafsi, I'jaz al-Qur'an  
**Classical Spine:** *Al-Itqan fi 'Ulum al-Qur'an* (Al-Suyuti) & *Al-Iqtisad fil-I'tiqad* (Imam al-Ghazali)  

---

## 1. Textual Preservation: From Oral Memorization to Uthmanic Mus-hafs
Unlike other ancient scriptures whose original manuscripts were lost or reconstructed centuries later, the Quran was preserved through dual synchronized channels:
1. **The Oral Channel (Al-Hifz fil-Sudur)**: Mass-transmitted through unbroken chains of recitation (*Tawatur*) from thousands of companions.
2. **The Written Channel (Al-Kitabah fil-Sutur)**: Written under the direct supervision of the Prophet ﷺ by official scribes (e.g. Zayd ibn Thabit).
* **The Compilation under Abu Bakr (RA)**: Gathered following the Battle of Yamamah, requiring two eyewitnesses for every written verse.
* **The Standardization under 'Uthman (RA)**: Distributed official Master Codices (*Al-Masaahif al-A'immah*) to major provincial capitals, uniting the Ummah on the shared consonantal skeleton (*Rasm*).

---

## 2. The Seven Ahruf & The Canonical Qira'at
* **The Seven Ahruf**: Divine accommodations granted to accommodate dialectical variations among Arabian tribes while preserving the exact semantic core.
* **The Ten Canonical Qira'at**: Mutawatir recitation styles transmitting differing vocalizations, vowels, and consonantal markers without contradiction (e.g. *Hafs 'an 'Asim* and *Warsh 'an Nafi'*).
  * Example: In Surah Al-Fatihah, Hafs recites *Māliki* (Owner of the Day of Judgment) while Warsh recites *Maliki* (Sovereign King of the Day of Judgment) — enriching meaning without contradiction!

---

## 3. Ash'ari Theology of Divine Speech: Kalam Nafsi vs. Kalam Lafzi
In classical Ash'ari theology, scholars made a precise distinction to uphold divine transcendence (*Tanzih*):
* **Al-Kalam al-Nafsi (Intrinsic Speech)**: An eternal, uncreated attribute subsisting in Allah's Divine Essence, transcending sound, letters, sequence, and vocal organs.
* **Al-Kalam al-Lafzi (The Recited Text)**: The temporal expressions created in sounds and written in ink that point to and convey the eternal Divine Meaning. The Quran in its meaning is uncreated (*Ghayr Makhluq*).

---

## 4. The Miracle of Linguistic Inimitability (I'jaz al-Qur'an)
The Quran challenged the greatest poets of Arabia to produce a single chapter like it (*Tahaddi*). Classical scholars (e.g. Al-Baqillani and Al-Jurjani) analyzed why the Quran remains unmatched:
* Unique structural register (neither prose nor poetry).
* Sublime aesthetic harmony (*Nazm*).
* Flawless absence of internal contradictions across 23 years of dynamic revelation.
""",
        "l5_questions": """# Level 5 Seminar Assessment: 'Ulum al-Qur'an & Epistemology of Revelation
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** Textual Transmission, Canonical Recitations, Kalam Nafsi, and Refuting Doubts  

---

## Part A: Advanced Multiple Choice

### 1. What rigorous evidential standard did Zayd ibn Thabit enforce when compiling the official Quran under Caliph Abu Bakr?
* A) Accepting any manuscript brought by anyone
* B) Demanding two reliable witnesses who memorized and wrote the verse directly in the presence of the Prophet ﷺ
* C) Relying solely on his own memory
* D) Translating from Greek texts

### 2. In Ash'ari creed, what is meant by *Al-Kalam al-Nafsi*?
* A) Whispering to oneself
* B) The eternal, uncreated attribute of divine speech subsisting in the Divine Essence without physical voice, letters, or temporal succession
* C) Modern written calligraphy
* D) Poetry composed by scholars

### 3. How do variations between the canonical Qira'at (such as *Hafs* and *Warsh*) relate to the meaning of the Quranic text?
* A) They contradict and cancel each other out
* B) They provide complementary, mutually reinforcing shades of meaning that enrich divine wisdom without contradiction
* C) They are translation errors
* D) They were invented in modern times

### 4. What was the central objective of Caliph 'Uthman's standardization of the Qur'anic codices?
* A) To destroy all copies of the Quran
* B) To prevent sectarian conflict over pronunciation and unite the Ummah upon the authoritative consonantal skeleton (*Rasm*)
* C) To invent a new script
* D) To shorten the Quran

### 5. Why is the Quranic challenge (*Tahaddi*) considered an objective rational proof of Prophethood?
* A) Because the Arabs had no interest in poetry
* B) The Arabs were the masters of eloquence and had every incentive to refute the Prophet, yet universally failed to produce even three verses comparable in beauty and wisdom
* C) The challenge was never announced
* D) It was only aimed at Persian scholars

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Kalam Nafsi, I'jaz, Rasm, Tawatur, Zayd ibn Thabit*

6. The miraculous inimitability of the Quran that renders human imitation impossible is termed **_________________**.
7. The chief scribe appointed to lead the Quranic compilation committees was **_________________**.
8. The standardized consonantal skeletal text of the Uthmanic codex is known as the **_________________**.
9. Transmission through so many concurrent independent narrators that collective fabrication is impossible is termed **_________________**.

---

## Part C: Advanced Matching Matrix
Pair 1: Hafs 'an 'Asim --- Primary riwayah practiced across most of the Muslim world
Pair 2: Warsh 'an Nafi' --- Primary riwayah of North & West Africa (Maliki traditional heartland)
Pair 3: Kalam Nafsi --- Eternal divine attribute beyond temporal letters and vocal sounds
Pair 4: Tahaddi --- The divine challenge to produce a surah like it

---

## Part D: Analytical Case Study
10. A secular critic claims: *"The existence of multiple recitations (Qira'at) proves the Quran was altered over time."* Synthesizing your knowledge of the 7 Ahruf, 'Uthman's compilation, and the complementary nature of Hafs and Warsh, write a comprehensive 3-point scholarly refutation.

---

## Teacher Answer Key
1. B) Two eyewitnesses for every inscribed verse.
2. B) The eternal uncreated speech (*Kalam Nafsi*).
3. B) Complementary, mutually enriching nuances.
4. B) Uniting the Ummah upon the authoritative Rasm.
5. B) The masters of eloquence failed the challenge despite maximum incentive.
6. I'jaz
7. Zayd ibn Thabit
8. Rasm
9. Tawatur
"""
    },

    # MODULE 5
    {
        "folder": "5— Fiqh of Fasting Zakah & Community",
        "mdDir": "MD Fiqh of Fasting Zakah & Community",
        "l1_handout": """# Level 1 Student Handout: Fasting, Zakah & Community
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** The Crescent Moon of Ramadan, Practicing Fasting, Sharing Dates, and Eid Joy  
**Theological Anchor:** Maliki Fiqh & Community Joy  

---

## 🌙 Welcome, Ramadan!
When the thin silver crescent moon shines in the night sky, Muslims all around the world say: **Ramadan Mubarak!**
Ramadan is the holiest month of the year. It is a time when we:
* Feel closer to Allah by praying, reading Quran, and making du'a.
* Practice self-control and patience.
* Think about people who are hungry and share delicious food with them!

---

## 🍽️ Practicing Fasting (Sawm)
When grown-ups fast, they do not eat or drink anything from dawn (**Fajr**) until sunset (**Maghrib**). 
If you are 6, 7, or 8 years old, you can practice!
* **Bird Fast (Sawm al-'Asfur):** Fast for 2 hours, or until lunchtime!
* Eat delicious dates and cool water at **Iftar** (sunset meal)!
* Every time your tummy rumbles, say: *"Al-Hamdulillah, thank You Allah for our food!"*

---

## 💰 Zakah: Sharing with Others
Allah gave us toys, clothes, and money, and He asked us to share with those who need help. 
This is called **Zakah** (giving to purify our wealth). 
When we give charity, our hearts grow soft and happy!

---

## 🎉 Eid al-Fitr: The Day of Celebration!
At the end of Ramadan, we celebrate **Eid al-Fitr**!
* We take a morning bath, put on our cleanest clothes, and smell nice.
* We go to the prayer and chant: *"Allahu Akbar, Allahu Akbar, La ilaha illallah!"*
* We hug our friends, visit grandparents, eat sweet cookies, and receive Eid gifts!
""",
        "l1_questions": """# Level 1 Activity Sheet: Fasting, Zakah & Community
**Age Group:** Ages 6–8 (Level 1 Track)  
**Focus:** Ramadan, Iftar, Sharing, and Eid  

---

## Part A: Multiple Choice

### 1. In which special month do Muslims fast from dawn until sunset?
* A) Ramadan
* B) Muharram
* C) Safar
* D) Rajab

### 2. What is the meal we eat at sunset to break our fast called?
* A) Suhoor
* B) Iftar
* C) Lunch
* D) Breakfast

### 3. What sweet fruit is the Sunnah to eat first when breaking the fast?
* A) Dates
* B) Apples
* C) Lemons
* D) Ice cream

### 4. What is the celebration called at the end of Ramadan?
* A) Eid al-Fitr
* B) Eid al-Adha
* C) New Year
* D) Sports Day

### 5. What does giving Zakah and charity do to our hearts and wealth?
* A) Makes us poor
* B) Purifies our hearts and brings blessings (*Barakah*)
* C) Makes us angry
* D) Has no effect

---

## Part B: Fill in the Blanks
*Word Bank: Ramadan, Dates, Iftar*

6. The blessed month of fasting is called **_________________**.
7. The sunset meal when we break our fast is called **_________________**.
8. It is sunnah to break our fast with sweet **_________________** and water.

---

## Part C: Matching Pairs
Pair 1: Suhoor --- Pre-dawn meal eaten before fasting begins
Pair 2: Iftar --- Meal eaten at sunset to break the fast
Pair 3: Eid al-Fitr --- Joyful celebration marking the end of Ramadan

---

## Part D: Reflection
9. What is your favorite treat to share with friends on Eid morning?

---

## Teacher Answer Key
1. A) Ramadan.
2. B) Iftar.
3. A) Dates.
4. A) Eid al-Fitr.
5. B) Purifies hearts and brings barakah.
6. Ramadan
7. Iftar
8. Dates
""",
        "l2_handout": """# Level 2 Student Handout: Fiqh of Fasting, Zakah & Community
**Age Group:** Ages 8–10 (Level 2 Track)  
**Topics:** Rules of Sawm, Exemptions, The Maliki Single Intention, and Zakat al-Fitr  
**Theological Anchor:** Maliki Fiqh (*Matn Ibn 'Ashir*)  

---

## 🌙 1. The Rules of Fasting (Sawm)
Fasting is the 4th pillar of Islam. It is obligatory upon every sane, mature Muslim who is able to fast.
* **Duration**: From the true dawn (**Fajr**) until the complete setting of the sun (**Maghrib**).
* **Two Core Pillars of Fasting**:
  1. **An-Niyyah (The Intention)**: Having the conscious resolve to fast for Allah.
  2. **Al-Imsak (Abstinence)**: Refraining from food, drink, and desires.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        "OTHER SCHOLARS SAY" CORNER                      │
│                                                                        │
│ • The Single Intention in Maliki Fiqh: In the Shafi'i school, a person  │
│   must make a fresh intention every single night before dawn.           │
│   In the Maliki school, a SINGLE intention made on the first night of   │
│   Ramadan suffices for the ENTIRE continuous month!                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🌾 2. Who is Exempt from Fasting?
Allah loves ease for His servants:
* The sick who would be harmed by fasting.
* The traveler on a long journey.
* Elderly individuals who are physically weak.
(They make up missed days later or feed the poor with *Fidyah*).

---

## ⚖️ 3. Zakat al-Fitr: The Charity of Fast-Breaking
Before the Eid prayer, the head of every household pays **Zakat al-Fitr** for every family member:
* **Amount**: One *Sa'* (approximately 4 double-handfuls, or 2.5 kg) of the staple food of the country (rice, wheat, dates).
* **Purpose**: To cleanse the fasting person of small errors and ensure that no poor family is hungry on Eid day!
""",
        "l2_questions": """# Level 2 Worksheet: Fasting, Zakah & Community
**Age Group:** Ages 8–10 (Level 2 Track)  
**Focus:** Conditions of Sawm, Single Niyyah rule, and Zakat al-Fitr  

---

## Part A: Multiple Choice

### 1. What are the two essential pillars (*Arkan*) of fasting in Islamic law?
* A) Running and sleeping
* B) Niyyah (Intention) and Imsak (Abstinence from dawn to sunset)
* C) Cooking and eating
* D) Traveling and spending

### 2. In Maliki fiqh, when does a single intention (*Niyyah*) suffice for the entire month of Ramadan?
* A) It never suffices
* B) On the first night of Ramadan, as long as the fast is not broken by travel or illness
* C) Only on the last night
* D) Only on Fridays

### 3. If a person is sick and their doctor says fasting will harm them, what should they do?
* A) Force themselves to fast anyway
* B) Break the fast as an allowance from Allah, and make up the missed days when healthy
* C) Leave Islam
* D) Never pray again

### 4. What is the required payment of Zakat al-Fitr given before Eid prayer?
* A) One Sa' (approx. 2.5 kg) of staple food per person in the family
* B) A new car
* C) 100 gold coins
* D) One piece of fruit

### 5. What Sunnah prayer is performed in congregation during the nights of Ramadan?
* A) Salat al-Khusuf
* B) Salat al-Taraweeh
* C) Salat al-Istisqa
* D) Salat al-Janazah

---

## Part B: Fill in the Blanks
*Word Bank: Imsak, Taraweeh, Sa', Maghrib*

6. Fasting ends at the call to **_________________** prayer.
7. Refraining from eating and drinking during fasting is called **_________________**.
8. The measure of food given for Zakat al-Fitr is one **_________________**.
9. The special nightly congregational prayers during Ramadan are called **_________________**.

---

## Part C: Matching Pairs
Pair 1: Imsak --- Abstaining from food and drink from Fajr to Maghrib
Pair 2: Zakat al-Fitr --- Staple food charity paid before Eid prayer
Pair 3: Fidyah --- Compensation feeding given by those unable to fast
Pair 4: Taraweeh --- Night prayers performed during Ramadan

---

## Part D: Reflection
10. How does fasting make you feel more empathetic towards children around the world who don't have enough food?

---

## Teacher Answer Key
1. B) Niyyah and Imsak.
2. B) On night 1 for the whole continuous month.
3. B) Concession to break fast and make up later.
4. A) One Sa' of staple food.
5. B) Taraweeh.
6. Maghrib
7. Imsak
8. Sa'
9. Taraweeh
""",
        "l5_handout": """# Level 5 Seminar Guide: Advanced Jurisprudence of Siyam, Zakah & Economics
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** Fiqh of Siyam Nullifiers, Kaffarah, Zakah on Liquid Assets/Equities, Nisab Math, Prohibition of Riba  
**Classical Spine:** *Mukhtasar Khalil*, *Al-Risalah*, and *Bidayat al-Mujtahid* (Ibn Rushd)  

---

## 1. Advanced Fiqh of Fasting (Siyam)
### Nullifiers and Legal Distinctions:
* **Qada' Only (Make-up day)**: Eating or drinking mistakenly, illness, travel, or forced breaking.
* **Qada' + Kaffarah (Major Expiation)**: Deliberate, intentional, and defiant invalidation of a Ramadan fast without any valid excuse.
  * In the **Maliki Madhhab**, Kaffarah is triggered by **either** intentional eating/drinking **OR** sexual intercourse during Ramadan (unlike the Shafi'i school which restricts Kaffarah strictly to sexual intercourse).
  * *Kaffarah order*: Freeing a slave (historical), fasting 60 consecutive days, or feeding 60 destitute persons. (Imam Malik preferred feeding 60 persons because it delivers direct social benefit).

---

## 2. Advanced Fiqh of Zakah: Nisab & Modern Asset Classes
Zakah is a divine right of the poor (*Haqq Ma'lum*) on surplus wealth, purifying the soul from greed.
* **Conditions of Obligation**: Freedom, Islam, Full Ownership (*Milk Tamm*), Reaching the Threshold (*Nisab*), and Passing of One Lunar Year (*Hawl*).
* **Nisab Benchmarks**:
  * Gold: 20 Dinars = **85 grams of pure gold**.
  * Silver: 200 Dirhams = **595 grams of pure silver**.
  * Paper Currency & Liquid Assets: Calculated using the cash value of the gold or silver Nisab.

### Zakah on Contemporary Financial Instruments:
1. **Cash & Savings Accounts**: 2.5% on total balance held for one full lunar year above Nisab.
2. **Trade Merchandise ('Urud al-Tijarah)**: Valued at current market resale price at the end of the Hawl; 2.5% paid on net inventory.
3. **Equities & Stock Portfolios**:
   * *Active Trading (Day trading)*: Full market value is subject to 2.5% Zakah.
   * *Long-term Investment*: Zakah is paid only on the company's underlying liquid and tradeable assets (often estimated at 25–30% of market value, resulting in roughly 0.75% of total value) or 2.5% on distributed net dividends.

---

## 3. The Prohibition of Riba & Islamic Economic Philosophy
Islam strictly prohibits **Riba** (usury and exploitative interest):
* **Riba al-Fadl (Surplus Usury)**: Unequal exchange of commodities of the same genus.
* **Riba al-Nasi'ah (Delay Usury)**: Any interest charged on loans due to time delay.
* *Philosophy*: Wealth must be generated through real productivity, shared risk, and asset-backed enterprise (*Al-Ghurm bil-Ghunm* — Risk is commensurate with reward), not debt exploitation.
""",
        "l5_questions": """# Level 5 Seminar Assessment: Advanced Fiqh of Siyam, Zakah & Islamic Finance
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** Comparative Kaffarah, Modern Zakah Calculation, Equities, and Riba  

---

## Part A: Advanced Multiple Choice

### 1. In Maliki jurisprudence, what is the legal ruling for a person who deliberately drinks a glass of water at noon during Ramadan without any valid excuse?
* A) They only make up one day (Qada' only)
* B) They must make up the day (*Qada'*) AND pay the major expiation (*Kaffarah*) of fasting 60 consecutive days or feeding 60 poor persons
* C) Their fast remains valid
* D) They pay a £5 fine

### 2. How does the Maliki position on Kaffarah for broken fasts differ from the Shafi'i position?
* A) Malikis restrict Kaffarah to intercourse; Shafi'is apply it to eating
* B) Malikis apply Kaffarah to both deliberate eating/drinking and intercourse; Shafi'is restrict Kaffarah strictly to sexual intercourse
* C) Neither school requires Kaffarah
* D) There is no difference

### 3. What is the modern monetary Nisab benchmark for paper currencies in Islamic jurisprudence?
* A) The market value of 85 grams of gold (or 595 grams of silver)
* B) One year's salary
* C) £1,000,000
* D) The price of a camel

### 4. How is Zakah assessed on a portfolio of stocks held as a long-term passive dividend investment?
* A) Zero Zakah is ever due
* B) Zakah is levied on the underlying liquid/working assets and dividends, or an accepted standard proxy (approx 25% of market value at 2.5%)
* C) 50% of the principal is given
* D) Zakah is paid every month

### 5. Why does Islamic commercial law strictly forbid *Riba* (interest)?
* A) To prevent trade
* B) Because it decouples money from real economic risk, incentivizes debt servitude, and shifts all loss onto the borrower while the lender is guaranteed risk-free gain
* C) Islam dislikes banks
* D) Only gold may be traded

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Kaffarah, Nisab, Hawl, Riba, Urud al-Tijarah*

6. The minimum wealth threshold that triggers the obligation of Zakah is the **_________________**.
7. The passage of one full lunar year (approx. 354 days) over wealth is termed the **_________________**.
8. Trade merchandise held for resale in commerce is legally termed **_________________**.
9. The major expiation due for deliberately violating the Ramadan fast is **_________________**.

---

## Part C: Advanced Matching Matrix
Pair 1: Nisab (Gold) --- 85 grams of pure gold
Pair 2: Hawl --- One full lunar year of possession
Pair 3: 2.5% (One-fortieth) --- Standard annual Zakah rate on liquid assets
Pair 4: Riba al-Nasi'ah --- Unlawful interest charged on debt for delayed payment

---

## Part D: Practical Financial Scenario
10. **Zakah Math Workshop**: Maryam has owned the following assets continuously for one full lunar year:
* Personal bank savings: £12,000
* Trade inventory in her retail shop: £8,000
* Gold jewelry worn daily for personal use (under Maliki fiqh): £5,000
* Immediate short-term debts due this week: £2,000
* Current gold Nisab benchmark: £4,500
* Question: Calculate Maryam's net Zakatable wealth under Maliki jurisprudence (noting the Maliki ruling on permissible worn jewelry) and state her total Zakah liability.

---

## Teacher Answer Key
1. B) Qada' and Kaffarah in Maliki fiqh for deliberate eating.
2. B) Malikis include deliberate eating/drinking; Shafi'is restrict to intercourse.
3. A) 85g gold / 595g silver threshold.
4. B) Levied on working capital/liquid assets or proxy.
5. B) Prevents unearned wealth transfer and debt servitude.
6. Nisab
7. Hawl
8. Urud al-Tijarah
9. Kaffarah
"""
    },

    # MODULE 6
    {
        "folder": "6— Seerah Madinah & the Building of a Community",
        "mdDir": "MD Seerah Madinah & the Building of a Community",
        "l1_handout": """# Level 1 Student Handout: Seerah — Madinah & The First Community
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** The Journey of Hijrah, The Camel Qaswa', Building the Mosque, and Tala'a al-Badru  
**Theological Anchor:** Prophetic Leadership & Loving Community  

---

## 🐪 The Wonderful Journey of Hijrah
When the bad leaders of Makkah tried to harm the Muslims, Allah commanded the Prophet Muhammad ﷺ to travel to the beautiful garden city of **Madinah**! 
This historic journey is called the **Hijrah** (الهِجْرَة). 
Prophet Muhammad ﷺ and his best friend **Abu Bakr as-Siddiq** traveled through the secret desert paths guided by Allah!

---

## 🎶 "Tala'a al-Badru 'Alayna!"
When the Prophet ﷺ arrived in Madinah, the children and families came out singing:
> *"The full moon has risen upon us,*  
> *From the valleys of Wada'!*  
> *Gratitude is due upon us,*  
> *As long as anyone calls to Allah!"*

Every family in Madinah wanted the Prophet ﷺ to stay in their home! 
The Prophet ﷺ smiled and said: *"Let my camel Qaswa' walk freely, for she is commanded by Allah."* 
The camel walked and knelt at the place where the Prophet's Mosque would be built!

---

## 🧱 Building the Prophet's Mosque (Al-Masjid an-Nabawi)
The Prophet ﷺ didn't just sit and watch; he picked up heavy clay bricks and carried them with his own hands to build the mosque! 
The mosque had a palm-tree trunk roof and soft sand floors. It was a place for:
* Praying together to Allah.
* Helping the poor and feeding travelers.
* Learning kindness and wisdom!
""",
        "l1_questions": """# Level 1 Activity Sheet: Seerah — Madinah & Community
**Age Group:** Ages 6–8 (Level 1 Track)  
**Focus:** The Hijrah, Qaswa' the Camel, and Building the Mosque  

---

## Part A: Multiple Choice

### 1. What was the journey of the Prophet ﷺ from Makkah to Madinah called?
* A) The Hijrah
* B) The Hajj
* C) The Picnic
* D) The Caravan

### 2. Who was the Prophet's closest friend who traveled with him during the Hijrah?
* A) Abu Bakr as-Siddiq (RA)
* B) Abu Jahl
* C) The Roman Emperor
* D) A caravan guard

### 3. What was the name of the Prophet's gentle camel who chose where to build the mosque?
* A) Qaswa'
* B) Star
* C) Buraq
* D) Sandy

### 4. What did the Prophet ﷺ do while the mosque was being built?
* A) He helped carry the bricks with his own hands
* B) He went to sleep
* C) He stayed in Makkah
* D) He rode away

### 5. What famous welcome song did the people of Madinah sing when the Prophet ﷺ arrived?
* A) Tala'a al-Badru 'Alayna
* B) Happy Birthday
* C) Twinkle Twinkle
* D) Desert Song

---

## Part B: Fill in the Blanks
*Word Bank: Hijrah, Qaswa, Madinah*

6. The Prophet's journey to Madinah is called the **_________________**.
7. The name of the blessed city the Muslims moved to is **_________________**.
8. The camel that stopped at the site of the mosque was **_________________**.

---

## Part C: Matching Pairs
Pair 1: Hijrah --- Migration from Makkah to Madinah
Pair 2: Abu Bakr --- The faithful companion in the Cave
Pair 3: Qaswa' --- The camel who chose the site of the Mosque

---

## Part D: Reflection
9. How can you help clean and look after your local mosque or prayer room at home?

---

## Teacher Answer Key
1. A) The Hijrah.
2. A) Abu Bakr as-Siddiq.
3. A) Qaswa'.
4. A) Carried bricks personally.
5. A) Tala'a al-Badru 'Alayna.
6. Hijrah
7. Madinah
8. Qaswa
""",
        "l2_handout": """# Level 2 Student Handout: Seerah — Madinah Community & The Four Imams
**Age Group:** Ages 8–10 (Level 2 Track)  
**Topics:** The Brotherhood (Mu'akhah), The Charter of Madinah, Key Battles, and Imam Malik's City  
**Theological Anchor:** Prophetic Statecraft & Maliki Heritage  

---

## 🤝 1. Al-Mu'akhah: The Brotherhood of Faith
When the Muslim emigrants (**Al-Muhajirun**) arrived in Madinah from Makkah, they had left all their wealth, houses, and businesses behind. 
The Prophet ﷺ established the bond of **Mu'akhah** (Brotherhood), pairing each Muhajir with a helper from Madinah (**Al-Ansar**). 
The Ansar shared their homes, food, and farms with total love and joy!

---

## 📜 2. The Constitution of Madinah (Sahifat al-Madinah)
The Prophet ﷺ authored the world's first written constitution. It declared:
* Muslims, Jewish tribes, and other residents formed a single civic community (*Ummah Wahidah*).
* Freedom of religion was guaranteed.
* All citizens were required to defend Madinah if attacked.
* Justice was supreme, and crime would not be protected by tribal loyalties.

---

## ⚔️ 3. Defending the Community: Key Milestones
* **Battle of Badr (Year 2 AH)**: 313 Muslims stood bravely against 1,000 oppressors, proving that faith triumphs over numbers.
* **Battle of Uhud (Year 3 AH)**: Taught the critical lesson of always obeying the Prophet's instructions.
* **The Trench (Al-Khandaq, Year 5 AH)**: Salman al-Farsi suggested digging a trench around Madinah, saving the city from a massive coalition!
* **Treaty of Hudaybiyyah (Year 6 AH)**: A 10-year peace treaty that led to thousands entering Islam peacefully!
""",
        "l2_questions": """# Level 2 Worksheet: Seerah — Madinah & Statecraft
**Age Group:** Ages 8–10 (Level 2 Track)  
**Focus:** Mu'akhah, Charter of Madinah, Badr, and Hudaybiyyah  

---

## Part A: Multiple Choice

### 1. What were the Muslim helpers of Madinah called?
* A) Al-Ansar
* B) Al-Muhajirun
* C) The Romans
* D) The Quraysh

### 2. What was the Constitution of Madinah?
* A) A peace treaty and civic charter ensuring freedom of religion and joint defense
* B) A list of taxes
* C) A book of poetry
* D) A building blueprint

### 3. In the Battle of the Trench (Al-Khandaq), who suggested the brilliant defense of digging a trench?
* A) Salman al-Farsi (RA)
* B) Abu Bakr (RA)
* C) Bilal (RA)
* D) Khalid ibn al-Walid

### 4. What was the outcome of the Treaty of Hudaybiyyah?
* A) A 10-year peace treaty that allowed Islam to spread rapidly and peacefully across Arabia
* B) A complete defeat
* C) The cancellation of Hajj forever
* D) An immediate battle

### 5. Why is Madinah especially sacred to the Maliki school of law?
* A) It was the capital where the Prophet ﷺ and Sahabah lived, and their daily practice ('Amal) was preserved
* B) It has the tallest mountains
* C) It is the biggest city in the world
* D) It has the most ships

---

## Part B: Fill in the Blanks
*Word Bank: Salman, Ansar, Muhajirun, Badr*

6. The Muslims who migrated from Makkah to Madinah were the **_________________**.
7. The welcoming helpers who lived in Madinah were the **_________________**.
8. The first major defensive victory in Islam was the Battle of **_________________**.
9. The Persian companion who suggested digging the defensive trench was **_________________**.

---

## Part C: Matching Pairs
Pair 1: Muhajirun --- Emigrants who left Makkah for faith
Pair 2: Ansar --- Helpers of Madinah who shared everything
Pair 3: Salman al-Farsi --- Suggested digging the defensive trench
Pair 4: Hudaybiyyah --- Peaceful treaty opening doors to widespread dawah

---

## Part D: Reflection
10. How did the bond of brotherhood (*Mu'akhah*) between Muhajirun and Ansar prove that faith is stronger than race or nationality?

---

## Teacher Answer Key
1. A) Al-Ansar.
2. A) Civic charter and mutual defense treaty.
3. A) Salman al-Farsi.
4. A) 10-year peace facilitating peaceful dawah.
5. A) Center of living prophetic practice ('Amal).
6. Muhajirun
7. Ansar
8. Badr
9. Salman
""",
        "l5_handout": """# Level 5 Seminar Guide: Constitutional Statecraft, Siyar & Madinan Jurisprudence
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** The Charter of Madinah, Jurisprudence of Siyar (War & Treaties), 'Amal Ahl al-Madinah as Legal Proof  
**Classical Spine:** *Al-Muwatta* (Imam Malik) & *Kitab al-Siyar al-Kabir* (Imam al-Shaybani)  

---

## 1. The Charter of Madinah (*Sahifat al-Madinah*): An Early Social Contract
Authored in 622 CE, the Charter of Madinah established a pluralistic polity unprecedented in the ancient world:
1. **The Concept of Ummah Wahidah**: Muslims formed an ideological brotherhood, while non-Muslim tribes (such as the Jewish tribes of Banu 'Awf) were recognized as an autonomous religious community under shared civil protection.
2. **Freedom of Religion (*Hurriyat al-I'tiqad*)**: *"To the Jews their religion, and to the Muslims their religion."*
3. **Decoupling Justice from Tribal Nepotism**: Prohibited protecting criminals on grounds of family or tribal allegiance.
4. **Collective Security & Defense**: All signatories bore financial and physical responsibility to defend Madinah against external aggression.

---

## 2. Jurisprudence of Peace & Warfare (*Al-Siyar*)
Classical Islamic law developed rigorous rules of engagement centuries before the Geneva Conventions:
* **The Right to Resort to Force (*Jus ad Bellum*)**: Defensive, intended to repel tyranny (*Fitnah*) and protect religious freedom (Surah Al-Hajj 22:39–40).
* **Conduct in Warfare (*Jus in Bello*)**: Abu Bakr's 10 injunctions forbade:
  * Killing non-combatants (women, children, monks, elderly, farmers).
  * Destroying orchards, cutting fruitful trees, or poisoning wells.
  * Mutilating fallen enemies (*Muthlah*).
* **Treaties & Diplomacy (*'Ahd & Sulh*)**: Absolute sanctity of treaties (e.g. Hudaybiyyah), with zero tolerance for treachery (*Ghadr*).

---

## 3. Methodological Significance: 'Amal Ahl al-Madinah in Maliki Usul
For Imam Malik, the continuous, inherited practice of the People of Madinah took precedence over solitary hadith (*Ahad*):
* Madinah was home to the Prophet ﷺ, the Four Caliphs, and 10,000 companions.
* When thousands of scholars practice an act continuously (e.g. Adhan wording, Sadl, measuring the Sa'), it constitutes **living Tawatur** (mass-transmission through action), which provides greater epistemic certainty than an isolated textual chain.
""",
        "l5_questions": """# Level 5 Seminar Assessment: Constitutionalism & Madinan Statecraft
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** The Charter of Madinah, Rules of Engagement, and 'Amal Ahl al-Madinah in Usul  

---

## Part A: Advanced Multiple Choice

### 1. What groundbreaking civil principle was established in the Charter of Madinah regarding non-Muslim residents?
* A) Forced conversion to Islam
* B) Recognition of Jewish and confederate tribes as a distinct religious community with religious freedom and mutual civic obligations
* C) Expulsion of all foreigners
* D) Imposition of tribal feuds

### 2. Under classical Islamic jurisprudence of warfare (*Siyar*), which of the following is strictly prohibited?
* A) Defending the state when attacked
* B) Deliberately targeting non-combatants (children, women, religious monastics, farmers) and destroying crops
* C) Signing peace treaties
* D) Releasing prisoners of war

### 3. Why did Imam Malik prioritize *'Amal Ahl al-Madinah* (Practice of the People of Madinah) over an isolated single-narrator hadith (*Khabar al-Ahad*)?
* A) He did not possess hadith collections
* B) The continuous public practice of thousands of companions in the city of revelation provides living mass-transmission (*Tawatur*), which yields higher epistemic certainty than a solitary chain
* C) He believed only Madinans could be righteous
* D) It was a government regulation

### 4. What diplomatic strategy made the Treaty of Hudaybiyyah a "Manifest Victory" (*Fath Mubin*) according to Surah Al-Fath?
* A) It gained rich treasures immediately
* B) The cessation of hostilities allowed open intellectual and cultural interchange, leading more people to embrace Islam peacefully in two years than in the previous twenty
* C) It eliminated all opponents
* D) It ended all future negotiations

### 5. In modern political philosophy, how does the Charter of Madinah anticipate constitutional federalism?
* A) By establishing a unitary empire with no autonomy
* B) By creating a shared legal framework of mutual defense and civic rights while preserving autonomous religious jurisprudence for distinct communities
* C) By banning private property
* D) By dissolving all laws

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Amal Ahl al-Madinah, Siyar, Hudaybiyyah, Muthlah, Mu'akhah*

6. The Islamic jurisprudence governing international relations, treaties, and warfare is termed **_________________**.
7. The mutilation of fallen enemy corpses, strictly prohibited in Islamic law, is **_________________**.
8. The formal pact of brotherhood instituted between the Muhajirun and the Ansar is called **_________________**.
9. The 10-year armistice treaty that opened Arabia to rapid peaceful Islamization was **_________________**.

---

## Part C: Advanced Matching Matrix
Pair 1: Charter of Madinah --- Foundational pluralistic civic treaty (622 CE)
Pair 2: 'Amal Ahl al-Madinah --- Living communal transmission in Maliki legal methodology
Pair 3: Abu Bakr's 10 Injunctions --- Early Islamic conventions protecting civilian non-combatants
Pair 4: Treaty of Hudaybiyyah --- Diplomatic turning point described as *Fath Mubin*

---

## Part D: Analytical Essay Prompt
10. Compare the ethical constraints of warfare articulated by Caliph Abu Bakr with the modern Fourth Geneva Convention. How does classical Islamic international law (*Siyar*) demonstrate divine moral restraint over realpolitik?

---

## Teacher Answer Key
1. B) Religious freedom and civic mutual defense.
2. B) Targeting non-combatants and destroying nature is forbidden.
3. B) Living Tawatur of the city of revelation overrides isolated reports.
4. B) Peaceful environment enabled exponential voluntary conversion.
5. B) Shared defense with communal legal autonomy.
6. Siyar
7. Muthlah
8. Mu'akhah
9. Hudaybiyyah
"""
    },

    # MODULE 7
    {
        "folder": "7— Applied Fiqh & Everyday Life",
        "mdDir": "MD Applied Fiqh & Everyday Life",
        "l1_handout": """# Level 1 Student Handout: Applied Fiqh & Everyday Life
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** Bismillah, Halal & Yummy Food, Clean Habits, and Truthful Play  
**Theological Anchor:** Maliki Adab & Halal Living  

---

## 🍽️ The Table Manners of a Muslim
Eating is not just about filling our tummies — it is an act of worship when we follow the Sunnah!
* **Say Bismillah**: Before taking our first bite, we say: *"Bismillah!"* (In the Name of Allah).
* **Right Hand**: We always eat and drink using our **right hand**.
* **Eat from What is Near**: Take food from your own side of the plate, and don't be greedy!
* **Say Al-Hamdulillah**: When we are full, we say: *"Al-Hamdulillahi alladhi at'amana wa saqana!"* (Praise be to Allah Who fed us and gave us drink!).

---

## 🥗 Halal & Pure Foods
* **Halal (حَلَال)**: Everything good, healthy, and permitted by Allah (apples, honey, milk, halal chicken).
* **Haram (حَرَام)**: Things that harm us and are forbidden by Allah (pork, bacon, anything with alcohol).
* Allah wants our bodies to be healthy and strong so we can play, learn, and worship Him!

---

## 🧼 Keeping Clean Clothes & Clean Speech
* We keep our clothes clean from dirt and mud.
* We speak sweet, kind words and never use bad language or shout at our friends.
* When we play games, we play honestly and never cheat!
""",
        "l1_questions": """# Level 1 Activity Sheet: Everyday Halal Living
**Age Group:** Ages 6–8 (Level 1 Track)  
**Focus:** Eating with Right Hand, Halal Food, and Good Speech  

---

## Part A: Multiple Choice

### 1. What blessed word do we say before we begin eating our food?
* A) Bismillah
* B) Goodbye
* C) Excuse me
* D) Never

### 2. Which hand did the Prophet Muhammad ﷺ teach us to eat and drink with?
* A) Right hand
* B) Left hand
* C) Both hands behind our back
* D) No hands

### 3. What does the word "Halal" mean?
* A) Permissible, good, and pure for us to eat
* B) Poisonous
* C) Sour
* D) Very expensive

### 4. Which of the following foods is NOT halal for a Muslim to eat?
* A) Pork / Bacon
* B) Fresh apples
* C) Honey
* D) Bread

### 5. What do we say when we finish eating our meal?
* A) Al-Hamdulillah (Praise be to Allah)
* B) I want more toys
* C) Nothing
* D) See you later

---

## Part B: Fill in the Blanks
*Word Bank: Bismillah, Right, Halal*

6. Food that is clean, good, and allowed by Allah is called **_________________**.
7. We say **_________________** before taking our first bite of food.
8. We eat and drink using our **_________________** hand.

---

## Part C: Matching Pairs
Pair 1: Bismillah --- Said before eating
Pair 2: Al-Hamdulillah --- Said after finishing a meal
Pair 3: Right Hand --- Hand used for eating according to the Sunnah

---

## Part D: Reflection
9. What is your favorite healthy, halal snack that Allah made for us?

---

## Teacher Answer Key
1. A) Bismillah.
2. A) Right hand.
3. A) Permissible and pure.
4. A) Pork is strictly haram.
5. A) Al-Hamdulillah.
6. Halal
7. Bismillah
8. Right
""",
        "l2_handout": """# Level 2 Student Handout: Applied Fiqh & Everyday Life
**Age Group:** Ages 8–10 (Level 2 Track)  
**Topics:** Halal vs. Haram Ingredients, Slaughter Conditions, Honest Trade, Modesty & Digital Ethics  
**Theological Anchor:** Maliki Legal Principles (*Al-Qawa'id al-Fiqhiyyah*)  

---

## 🥩 1. Understanding Halal Meat & Slaughter (Dhabihah)
In Islam, taking an animal's life for food is a serious responsibility. For meat to be Halal:
1. The animal must be of a permissible kind (cattle, sheep, goats, poultry, camels).
2. The slaughterer must be a Muslim or from the People of the Book (*Ahl al-Kitab*).
3. The name of Allah must be pronounced (**Bismillah, Allahu Akbar**).
4. The knife must be razor sharp to ensure swift, humane slaughter without causing unnecessary pain.
* **Haram meats**: Pork, animals not slaughtered in Allah's name, animals that died naturally (*Maytah*), and carnivorous beasts with fangs.

---

## 🔍 2. Reading Food Labels: Gelatin & Additives
* **Gelatin**: Gelatin derived from pork is **Haram**. Gelatin from beef is only halal if the animal was slaughtered Islamically, or if it is 100% plant-based (like agar-agar or pectin).
* **Alcohol**: Any food cooked with wine or intoxicating alcohol is prohibited, even in small amounts.

---

## 📱 3. Digital Ethics & Screen Time
A Muslim practices Islamic manners online as well as offline:
* Never look at inappropriate images.
* Do not type mean, mocking, or anonymous comments.
* Balance screen time with family time, exercise, and Quran memorization!
""",
        "l2_questions": """# Level 2 Worksheet: Applied Fiqh & Everyday Life
**Age Group:** Ages 8–10 (Level 2 Track)  
**Focus:** Halal Slaughter, Reading Labels, Honesty, and Digital Manners  

---

## Part A: Multiple Choice

### 1. What must be mentioned at the time of slaughtering a halal animal?
* A) The Name of Allah (Bismillah)
* B) The weather forecast
* C) A poem
* D) Nothing

### 2. Which type of gelatin is forbidden for a Muslim to consume?
* A) Gelatin derived from pork
* B) Plant-based agar-agar
* C) Halal beef gelatin
* D) Apple pectin

### 3. What is an animal called that died on its own without proper Islamic slaughter?
* A) Maytah (Carrion) - which is Haram
* B) Halal
* C) Mustahabb
* D) Makruh

### 4. What is the Islamic rule regarding cheating in board games or video games?
* A) Cheating and lying are forbidden in all games and activities
* B) Cheating is allowed if you don't get caught
* C) It is fine for children
* D) Games don't have rules

### 5. How should a young Muslim behave when chatting or messaging online?
* A) Use polite, truthful language and never bully or tease others
* B) Use fake names to insult people
* C) Share private photos of friends
* D) Spend all day playing games

---

## Part B: Fill in the Blanks
*Word Bank: Bismillah, Maytah, Pork, Right*

6. Meat from an animal that died of illness without slaughter is called **_________________**.
7. Gelatin derived from **_________________** is strictly forbidden.
8. At the time of humane slaughter, the butcher says **_________________**.
9. When eating, a Muslim uses their **_________________** hand.

---

## Part C: Matching Pairs
Pair 1: Dhabihah --- Humane Islamic ritual slaughter in Allah's Name
Pair 2: Maytah --- Carrion / unslaughtered dead animal (forbidden)
Pair 3: Halal --- Permissible and wholesome under Islamic law
Pair 4: Digital Adab --- Practicing honesty, modesty, and kindness online

---

## Part D: Reflection
10. Why did Allah command us to ensure that slaughter knives are extremely sharp? What does this teach us about animal welfare in Islam?

---

## Teacher Answer Key
1. A) Bismillah.
2. A) Pork gelatin is haram.
3. A) Maytah (Carrion).
4. A) Cheating and dishonesty are forbidden everywhere.
5. A) Polite, truthful language online.
6. Maytah
7. Pork
8. Bismillah
9. Right
""",
        "l5_handout": """# Level 5 Seminar Guide: Modern Applied Fiqh, Bioethics & Commercial Contracts
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** Legal Maxims (*Qawa'id Fiqhiyyah*), Islamic Finance (Murabahah, Ijarah, Sukuk), Bioethics (Organ Donation, End-of-Life), Inheritance (*Mirath*) Mathematics  
**Classical Spine:** *Al-Qawa'id* (Al-Qarafi), *Bidayat al-Mujtahid* (Ibn Rushd), and Modern Fiqh Academy Resolutions  

---

## 1. Foundational Legal Maxims (*Al-Qawa'id al-Fiqhiyyah*)
Maliki jurisprudence utilizes overarching legal maxims to adjudicate novel contemporary situations:
1. **Al-Umuru bi-Maqasidiha**: Actions are judged by their intentions and ultimate objectives.
2. **Al-Yaqinu la Yazulu bish-Shakk**: Certainty is not superseded or overturned by doubt.
3. **Al-Mashaqqatu Tajlibu al-Taysir**: Hardship begets legal facility (concessions).
4. **Al-Dararu Yuzal**: Harm must be eliminated (*La Darara wa la Dirar*).
5. **Al-'Adatu Muhakkamah**: Sound cultural custom has the weight of law when it does not contradict revelation.

---

## 2. Contemporary Islamic Commercial Law
Classical jurisprudence categorizes prohibited financial elements into two fatal categories:
* **Gharar Fahish (Excessive Uncertainty/Ambiguity)**: Contracts with unknown deliverables, pricing ambiguity, or pure speculation (e.g. conventional derivatives, futures options, lottery).
* **Riba (Interest/Usury)**: Exploitative capital accretion.
* **Permissible Islamic Banking Structures**:
  * *Murabahah (Cost-Plus Sale)*: The bank buys the physical asset and resells it to the client with an agreed, transparent profit margin paid over time.
  * *Ijarah (Lease-to-Own)*: The financier retains ownership while leasing the usufruct (*Manfa'ah*) to the client.
  * *Musharakah Mutanaqisah (Diminishing Partnership)*: Joint property purchase where the client gradually buys out the bank's equity share.

---

## 3. Contemporary Bioethics in Islamic Law
* **Brain Death & End of Life**: Major international Fiqh academies (OIC Fiqh Academy) rule that irreversible cessation of all brainstem functions constitutes legal death, permitting the withdrawal of artificial life support.
* **Organ Donation**: Permissible as a supreme act of charity (*Ithar*) under strict conditions:
  * Absolute prohibition of commercial sale of organs.
  * Free, informed consent of donor or family.
  * No harm inflicted upon living donors that would threaten their life or vital functions.

---

## 4. Fundamentals of Inheritance (*Mirath*) Mathematics
The Qur'an details the mathematical distribution of estates in Surah An-Nisa' (4:11–12):
* **Fixed Qur'anic Shares (Ashab al-Fara'id)**: 1/2, 1/4, 1/8, 2/3, 1/3, 1/6.
* **Residuary Heirs (Al-'Asabah)**: Inherit the remainder after fixed shares are distributed.
* *Philosophy*: Guarantees widespread intergenerational wealth distribution and prevents the concentration of capital within single oligarchs.
""",
        "l5_questions": """# Level 5 Seminar Assessment: Applied Jurisprudence, Bioethics & Commercial Law
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** Legal Maxims, Islamic Banking Contracts, Bioethics, and Mirath  

---

## Part A: Advanced Multiple Choice

### 1. Which overarching legal maxim applies when a worshipper is certain they performed Wudu, but doubts whether they later passed wind?
* A) Al-Dararu Yuzal (Harm must be eliminated)
* B) Al-Yaqinu la Yazulu bish-Shakk (Certainty is not overturned by doubt) — hence the wudu remains valid
* C) Al-'Adatu Muhakkamah
* D) All prayers must be repeated

### 2. What distinguishes a valid Islamic *Murabahah* financing contract from a conventional interest-bearing loan?
* A) Murabahah is an asset-backed trade transaction where the financier takes ownership of the physical good and sells it at an agreed cost-plus margin, rather than lending money to earn interest on debt
* B) There is no difference
* C) Murabahah does not require contracts
* D) It is only used for food

### 3. What is the consensus position of major contemporary Islamic Fiqh councils regarding post-mortem organ donation?
* A) It is universally forbidden under all conditions
* B) It is permissible and rewarded as a life-saving charity (*Ithar*), provided there is voluntary consent and absolutely no commercial sale or trade
* C) Organs may be sold on the stock market
* D) Only blood may be donated

### 4. What is *Gharar* in Islamic commercial transactions?
* A) Making a profit
* B) Excessive uncertainty, hazard, or ambiguity in the contract regarding price, quantity, or deliverability
* C) Writing receipts in Arabic
* D) Paying cash

### 5. In Islamic inheritance law (*Mirath*), what fraction of an estate does a surviving wife inherit if the deceased husband has surviving children?
* A) 1/2
* B) 1/4
* C) 1/8
* D) 2/3

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Gharar, Murabahah, Mirath, Ijarah, Al-Yaqin*

6. The Islamic jurisprudence governing the mathematical distribution of estate shares is **_________________**.
7. An asset-backed lease contract in Islamic banking is known as **_________________**.
8. Excessive speculation and ambiguous contractual deliverables are termed **_________________**.
9. The cost-plus sale structure widely utilized in Islamic home financing is **_________________**.

---

## Part C: Advanced Matching Matrix
Pair 1: Murabahah --- Cost-plus purchase and resale structure
Pair 2: Ijarah --- Usufruct leasing contract
Pair 3: Gharar Fahish --- Prohibited excessive ambiguity and speculation
Pair 4: Ashab al-Fara'id --- Primary heirs with fixed Qur'anic fractions

---

## Part D: Analytical Case Study
10. **Bioethical Case Study**: A family is faced with a medical dilemma where their elderly father has suffered complete and irreversible brainstem death following a major stroke, confirmed by three independent neurologists. The hospital asks whether artificial mechanical ventilators can be disconnected, and whether his kidneys can be donated to save two young dialysis patients. 
* Evaluate this scenario using the principles of Islamic bioethics, citing relevant legal maxims and contemporary Fiqh academy resolutions.

---

## Teacher Answer Key
1. B) Certainty is not overturned by doubt (*Al-Yaqin*).
2. A) Real asset ownership and trade vs money lending.
3. B) Permissible as non-commercial charity.
4. B) Excessive hazard/uncertainty.
5. C) 1/8 (Surah An-Nisa' 4:12).
6. Mirath
7. Ijarah
8. Gharar
9. Murabahah
"""
    },

    # MODULE 8
    {
        "folder": "8— Character, Society & Family",
        "mdDir": "MD Character, Society & Family",
        "l1_handout": """# Level 1 Student Handout: Character, Society & Family
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** Honoring Mum & Dad, Helping at Home, Smiling is Charity, and Gentle Hands  
**Theological Anchor:** Prophetic Adab & Beautiful Akhlaq  

---

## 💖 Mum and Dad: Our Greatest Blessings!
Allah commanded us in the Noble Quran to be exceptionally kind to our parents. 
* When Mum or Dad calls your name, answer immediately with a sweet smile: *"Yes, Mum!"* or *"Na'am, Dad!"*
* Never say *"Uff"* or roll your eyes.
* Say this special du'a for them every day:
> *"Rabbi-rhamhuma kama rabbayani saghira!"*  
> (My Lord! Have mercy upon my parents, just as they raised me when I was small!).

---

## 😊 Smiling is Charity (Sadaqah)
The Prophet Muhammad ﷺ had the most beautiful, warm smile. 
He said: *"Your smile in the face of your brother is a charity!"*
When you smile at your teacher, your classmates, or a neighbor, you are spreading Allah's joy and earning rewards without spending any money!

---

## 🐱 Being Gentle with Animals & Plants
* Don't pull a cat's tail or hurt small birds! The Prophet ﷺ told us about a woman who entered Paradise because she gave cool water to a thirsty dog.
* Don't break tree branches or waste water.
* Help tidy up your toys and keep your bedroom sparkling clean!
""",
        "l1_questions": """# Level 1 Activity Sheet: Character, Society & Family
**Age Group:** Ages 6–8 (Level 1 Track)  
**Focus:** Kindness to Parents, Smiling, and Being Gentle  

---

## Part A: Multiple Choice

### 1. How should a young Muslim respond when their mother or father calls them?
* A) With a warm smile and say "Yes Mum / Yes Dad!"
* B) Shout back and complain
* C) Ignore them and keep playing
* D) Roll our eyes

### 2. What did the Prophet Muhammad ﷺ say about smiling at someone?
* A) It is a waste of time
* B) It is an act of charity (Sadaqah)
* C) It makes you sleepy
* D) It is only for holidays

### 3. How should we treat animals and pets?
* A) Gently and kindly with food and water
* B) Throw rocks at them
* C) Scare them
* D) Lock them away without water

### 4. What is the special du'a we recite for our parents?
* A) "My Lord, have mercy upon them as they raised me when I was small"
* B) "Buy me more toys"
* C) "Let tomorrow be Saturday"
* D) "I don't know"

### 5. How can we make our home happy today?
* A) Tidying up our toys and helping Mum and Dad
* B) Leaving clothes on the floor
* C) Screaming loudly
* D) Eating in bed

---

## Part B: Fill in the Blanks
*Word Bank: Charity, Mercy, Parents*

6. Smiling at your brother or sister is an act of **_________________**.
7. We must always be kind, loving, and obedient to our **_________________**.
8. We pray that Allah showers His **_________________** upon our mothers and fathers.

---

## Part C: Matching Pairs
Pair 1: Smiling --- An act of Sadaqah (charity)
Pair 2: Parents --- Blessed souls we must honor and obey
Pair 3: Gentle Hands --- Being kind to animals and nature

---

## Part D: Reflection
9. What is one sweet deed you will do today to make your mother or father smile?

---

## Teacher Answer Key
1. A) With a warm smile and prompt obedience.
2. B) It is Sadaqah (charity).
3. A) Gently and kindly.
4. A) "My Lord, have mercy upon them..."
5. A) Helping at home and tidying up.
6. Charity
7. Parents
8. Mercy
""",
        "l2_handout": """# Level 2 Student Handout: Character, Society & Family
**Age Group:** Ages 8–10 (Level 2 Track)  
**Topics:** Birr al-Walidayn, Silat al-Rahim (Family Ties), Controlling Anger, and Avoiding Backbiting  
**Theological Anchor:** Maliki Adab & Prophetic Morality  

---

## 🏡 1. Birr al-Walidayn: Excellence to Parents
In the Quran, Allah mentions worshipping Him and showing excellence to parents in the exact same verse:
> *"And your Lord has decreed that you worship none but Him, and show excellence to parents."* (Surah Al-Isra' 17:23)
* **What does Birr mean?** It is higher than simple obedience; it means anticipating what your parents need with love and honor!
* When a man asked the Prophet ﷺ: *"Who deserves my best companionship?"* The Prophet ﷺ answered: *"Your mother, then your mother, then your mother, then your father."*

---

## 🌳 2. Silat al-Rahim: Keeping Family Ties
* Visiting grandparents, uncles, aunts, and cousins.
* Sharing food and checking up on family members who are unwell.
* The Prophet ﷺ taught that maintaining family ties increases one's lifespan and brings blessings to one's wealth!

---

## 🛡️ 3. Controlling Anger & Guarding the Tongue
* **"Do Not Become Angry"**: When a companion asked the Prophet ﷺ for advice, he repeated three times: *"La Taghdab"* (Do not become angry).
* **Guarding Against Ghibah (Backbiting)**: Speaking about someone behind their back in a way they would dislike is strictly forbidden. A true believer speaks good or remains silent!
""",
        "l2_questions": """# Level 2 Worksheet: Character, Society & Family
**Age Group:** Ages 8–10 (Level 2 Track)  
**Focus:** Birr al-Walidayn, Silat al-Rahim, Controlling Anger, and Tongue Stewardship  

---

## Part A: Multiple Choice

### 1. How many times did the Prophet Muhammad ﷺ repeat "Your mother" when asked who deserves the best companionship?
* A) 1 time
* B) 2 times
* C) 3 times
* D) 5 times

### 2. What does the term *Birr al-Walidayn* mean in Islamic ethics?
* A) Deep excellence, devotion, and honor shown to parents
* B) Arguing with parents
* C) Moving far away
* D) Writing names on a tree

### 3. What golden advice did the Prophet ﷺ repeat three times to the man who asked for counsel?
* A) "Do not become angry" (*La Taghdab*)
* B) "Sleep all day"
* C) "Eat lots of sweets"
* D) "Run as fast as you can"

### 4. What is *Ghibah* (backbiting)?
* A) Speaking about someone in their absence in a manner they would dislike
* B) Greeting someone with Salam
* C) Helping a neighbor carry groceries
* D) Reciting Quran aloud

### 5. What are the rewards promised for keeping close family ties (*Silat al-Rahim*)?
* A) Allah increases blessings in wealth and grants a long, meaningful life
* B) You get free video games
* C) Nothing happens
* D) It is only for adults

---

## Part B: Fill in the Blanks
*Word Bank: Ghibah, Mother, Three, Silat al-Rahim*

6. The Prophet ﷺ emphasized honoring the **_________________** three times before mentioning the father.
7. Maintaining close bonds with relatives is called **_________________**.
8. The Prophet ﷺ repeated his advice against anger **_________________** times.
9. Talking badly about someone behind their back is known as **_________________**.

---

## Part C: Matching Pairs
Pair 1: Birr al-Walidayn --- Highest devotion and honor to parents
Pair 2: Silat al-Rahim --- Upholding loving ties of kinship
Pair 3: La Taghdab --- Prophetic injunction: "Do not become angry"
Pair 4: Ghibah --- Backbiting and character assassination (forbidden)

---

## Part D: Reflection
10. Think of a time when you were angry. What is a Sunnah step you can take next time (e.g. sitting down, making wudu, saying *A'udhu billah*)?

---

## Teacher Answer Key
1. C) 3 times.
2. A) Deep excellence and devotion to parents.
3. A) "Do not become angry" (*La Taghdab*).
4. A) Speaking about someone behind their back uncharitably.
5. A) Increased barakah in life and provision.
6. Mother
7. Silat al-Rahim
8. Three
9. Ghibah
""",
        "l5_handout": """# Level 5 Seminar Guide: Tazkiyat al-Nafs, Virtue Ethics & Social Dynamics
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** The Architecture of Spiritual Purification, Heart Diseases (Hasad, Kibr, Riya'), Spousal & Family Rights, Digital Discourse Ethics  
**Classical Spine:** *Ihya' 'Ulum al-Din* (Imam al-Ghazali) & *Matn Ibn 'Ashir* (Tazkiyah Chapter)  

---

## 1. Tazkiyat al-Nafs: The Spiritual Journey in Maliki Scholarship
Imam Ibn 'Ashir concluded his famous didactic poem *Al-Murshid al-Mu'in* with a vital section on **Tazkiyah** (purification of the soul), based on the teachings of Imam al-Junayd. 
* Knowledge without spiritual character produces arrogance.
* Fiqh governs outward limbs, while Tazkiyah purifies inward intentions.

---

## 2. Diagnosing and Curing the Diseases of the Heart (*Amrad al-Qulub*)
Classical scholars classified the destructive spiritual vices (*Al-Muhlikat*) and their remedies:
1. **Hasad (Destructive Envy)**: Resenting Allah's blessings upon another and wishing for their deprivation.
   * *Remedy*: Recognizing that envying someone is objecting to Allah's divine wisdom and distribution of provision (*Qismah*). Pray for their increase!
2. **Kibr (Arrogance)**: Rejecting truth and looking down upon people (*Batar al-Haqq wa Ghamt al-Nas*).
   * *Remedy*: Remembering one's humble origin (from dust and fluid) and ultimate return to a dirt grave.
3. **Riya' (Ostentation/Showing Off)**: Performing acts of worship for human praise rather than Allah's pleasure.
   * *Remedy*: Concealing voluntary good deeds and reflecting on the worthlessness of transient human applause.
4. **Hubb al-Jah (Love of Prominence & Fame)**: An acute challenge in the modern social media landscape.

---

## 3. Family Rights & Mutual Obligations in Contemporary Society
* **The Rights of Parents**: Spiritual and financial care in old age; complete prohibition of disrespect.
* **The Rights of Spouses**: Based on **Mawaddah** (deep reciprocal love), **Rahmah** (compassion), and **Ma'ruf** (gentle honor).
* **The Rights of Children**: Nurturing education, emotional security, and teaching them proud, grounded Islamic identity.

---

## 4. Digital Ethics & Speech Stewardship
In the era of algorithmic outrage, cancel culture, and anonymous cyber-tribalism:
* The Islamic principle of **Hifz al-Lisan** (Guarding the Tongue) extends to guarding the keyboard.
* Prohibitions against *Namimah* (carrying tales to provoke enmity), *Buhtan* (defamation/slander), and sharing unverified information (Surah Al-Hujurat 49:6).
""",
        "l5_questions": """# Level 5 Seminar Assessment: Tazkiyah, Social Ethics & Contemporary Adab
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** Classical Heart Diseases, Ghazalian Remedies, Family Fiqh, and Digital Ethics  

---

## Part A: Advanced Multiple Choice

### 1. In the celebrated hadith found in Sahih Muslim, how did the Prophet Muhammad ﷺ define *Kibr* (Arrogance)?
* A) Wearing nice shoes and clean clothes
* B) Rejecting the truth (*Batar al-Haqq*) and looking down upon people (*Ghamt al-Nas*)
* C) Speaking in a loud voice
* D) Possessing wealth

### 2. In classical Tazkiyah, what is the fundamental spiritual danger of *Riya'* (Ostentation)?
* A) It consumes too much energy
* B) It is minor polytheism (*Al-Shirk al-Asghar*) which nullifies the spiritual reward of worship by directing intention to human praise
* C) It is only disliked for teachers
* D) It causes physical illness

### 3. What is the spiritual remedy prescribed by Imam al-Ghazali for someone afflicted with *Hasad* (destructive envy)?
* A) Compete aggressively to defeat the other person
* B) Realize that envy is an objection to Allah's sovereign wisdom, and actively make du'a for the blessing of the envied person to increase
* C) Complain to friends
* D) Avoid social contact forever

### 4. How does the Quran describe the foundational pillars of the marital relationship in Surah Ar-Rum (30:21)?
* A) Contracts and commerce
* B) Mawaddah (Tranquil Love) and Rahmah (Compassionate Mercy)
* C) Strict hierarchy and distance
* D) Separation of properties only

### 5. Under Islamic digital ethics, what is the legal ruling regarding reposting an unverified rumor or accusation about someone on social media?
* A) Permissible if everyone is talking about it
* B) Forbidden under the prohibition of *Namimah* and *Isha'at al-Fahishah*, violating the directive of Surah Al-Hujurat to investigate before repeating
* C) Recommended for awareness
* D) Neutral

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Riya', Kibr, Hasad, Tazkiyah, Mawaddah*

6. The spiritual science of internal purification and moral elevation is termed **_________________**.
7. Rejecting the truth and looking down upon fellow human beings is defined as **_________________**.
8. Wishing for the removal of a blessing from another person is called **_________________**.
9. The minor polytheism of performing worship to gain human praise and approval is **_________________**.

---

## Part C: Advanced Matching Matrix
Pair 1: Kibr --- Rejecting truth and disdaining others
Pair 2: Hasad --- Resenting divine distribution of blessings upon others
Pair 3: Riya' --- Hidden ostentation corrupting sincere intention
Pair 4: Mawaddah wa Rahmah --- Divine emotional bedrock of Islamic marital life

---

## Part D: Analytical Case Study
10. **Contemporary Ethical Dilemma**: A popular social media influencer who identifies as Muslim gains millions of followers by filming public confrontations, mocking classmates, and exposing private family arguments for engagement metrics. 
* Using the ethical framework of *Ihya' 'Ulum al-Din* and the classical concept of *Hifz al-Lisan* (guarding the tongue), write an incisive critique of how modern algorithmic incentives weaponize spiritual heart diseases (*Hubb al-Jah*, *Riya'*).

---

## Teacher Answer Key
1. B) Rejecting truth and belittling people.
2. B) Minor shirk that invalidates the reward of deeds.
3. B) Acknowledging divine wisdom and praying for the person.
4. B) Mawaddah and Rahmah.
5. B) Strictly forbidden without verification.
6. Tazkiyah
7. Kibr
8. Hasad
9. Riya'
"""
    },

    # MODULE 9
    {
        "folder": "9— Seerah, History & Living Faith Today",
        "mdDir": "MD Seerah, History & Living Faith Today",
        "l1_handout": """# Level 1 Student Handout: Seerah, History & Living Faith Today
**Age Group:** Ages 6–8 (Level 1 Track)  
**Topics:** The Farewell Message of Mercy, Our Global Muslim Family, and Shining Bright Today  
**Theological Anchor:** Universal Prophetic Mercy & Confident Muslim Identity  

---

## 🕊️ The Prophet's Beautiful Farewell Message
Before the Prophet Muhammad ﷺ completed his noble mission on earth, he gathered over 100,000 Muslims on the plains of 'Arafat for the **Farewell Pilgrimage** (*Hajjat al-Wada'*). 
He stood on his camel and delivered a message filled with light:
* **All people are equal**: No person is better than another because of their skin color or language. Only goodness and faith in the heart make someone noble!
* **Be kind to women and families**.
* **Do not hurt anyone's feelings, property, or body**.

---

## 🌍 Our Global Muslim Family (The Ummah)
Did you know that there are nearly **2 billion Muslims** around the world today?
* In Africa, Asia, Europe, America, and Australia!
* We speak hundreds of different languages, eat different foods, and wear colorful clothes.
* But when the call to prayer (**Adhan**) sounds, we all face the same holy Ka'bah and bow to the same One Creator!

---

## ⭐ How to Be a Shining Little Star Today
1. Be proud of being a Muslim who loves Allah and His Prophet ﷺ!
2. Be honest at school and help your classmates when they drop their books.
3. Say your morning and evening du'as to keep your heart bright with light!
""",
        "l1_questions": """# Level 1 Activity Sheet: Seerah, History & Living Faith
**Age Group:** Ages 6–8 (Level 1 Track)  
**Focus:** The Farewell Message, Equality, and Global Ummah  

---

## Part A: Multiple Choice

### 1. In the Farewell Sermon, what did the Prophet ﷺ say makes one person better than another?
* A) Their skin color
* B) How much money they have
* C) Faith and good character in the heart (Taqwa)
* D) How fast they run

### 2. How many Muslims are there in our global family (the Ummah) around the world today?
* A) 10 people
* B) About 2 billion people!
* C) Only 100 people
* D) None

### 3. Which holy city do all Muslims around the globe face when they pray?
* A) Makkah
* B) New York
* C) Tokyo
* D) Paris

### 4. What was the name of the final pilgrimage performed by Prophet Muhammad ﷺ?
* A) Hajjat al-Wada' (The Farewell Hajj)
* B) The Winter Hajj
* C) The First Hajj
* D) The Fast Hajj

### 5. How can we shine brightly as young Muslims today?
* A) By being kind, telling the truth, and loving Allah
* B) By hiding in our room
* C) By not sharing our toys
* D) By arguing with teachers

---

## Part B: Fill in the Blanks
*Word Bank: Makkah, Equal, Ummah*

6. In Islam, all people are **_________________** like the teeth of a comb.
7. The worldwide family of Muslims is called the **_________________**.
8. All Muslims face the Holy Ka'bah in the city of **_________________**.

---

## Part C: Matching Pairs
Pair 1: Farewell Sermon --- Declared universal human equality and kindness
Pair 2: The Ummah --- Our worldwide family of believers
Pair 3: Taqwa --- Good character and reverence in the heart

---

## Part D: Reflection
9. Draw a picture of the earth with a big heart, showing love for all Muslims around the world!

---

## Teacher Answer Key
1. C) Faith and good deeds (Taqwa).
2. B) Nearly 2 billion people.
3. A) Makkah.
4. A) Hajjat al-Wada'.
5. A) Kindness, truthfulness, and faith.
6. Equal
7. Ummah
8. Makkah
""",
        "l2_handout": """# Level 2 Student Handout: Seerah, History & Living Faith Today
**Age Group:** Ages 8–10 (Level 2 Track)  
**Topics:** The Conquest of Makkah (Fath Makkah), The Four Caliphs, and Our Maliki Scholarly Heritage  
**Theological Anchor:** Historical Continuity & Sunni Heritage  

---

## 🏰 1. The Conquest of Makkah: Supreme Forgiveness
In Year 8 AH, the Prophet ﷺ entered Makkah with 10,000 believers without bloodshed. 
The very people who had persecuted him, boycotted his family, and driven him out stood trembling before him. 
The Prophet ﷺ looked at them with boundless mercy and said:
> *"No blame will there be upon you today. Go, for you are all free!"*  
> (Just as Prophet Yusuf had said to his brothers).
Makkah was liberated, idols were cleansed from the Ka'bah, and truth triumphed!

---

## 👑 2. The Four Rightly Guided Caliphs (Al-Khulafa' al-Rashidun)
After the Prophet's passing, four noble companions led the Ummah with supreme justice:
1. **Abu Bakr as-Siddiq (RA)**: The man of truth who united the community and compiled the Quran.
2. **'Umar ibn al-Khattab (RA)**: The champion of justice under whose leadership hospitals and public treasuries were established.
3. **'Uthman ibn 'Affan (RA)**: The generous leader who standardized the official written Quran.
4. **'Ali ibn Abi Talib (RA)**: The courageous cousin and son-in-law known for his deep wisdom and eloquence.

---

## 🕌 3. Our Scholarly Heritage: Imam Malik of Madinah
Imam Malik ibn Anas (d. 179 AH) lived in Madinah. 
* He sat in the Prophet's Mosque teaching hadith and fiqh.
* He authored **Al-Muwatta'**, the earliest comprehensive book of hadith and law.
* His school spread across North Africa, West Africa, and Andalusia (Spain), inspiring generations of great scholars!
""",
        "l2_questions": """# Level 2 Worksheet: Seerah, History & Living Faith
**Age Group:** Ages 8–10 (Level 2 Track)  
**Focus:** Fath Makkah, The Four Caliphs, and Imam Malik  

---

## Part A: Multiple Choice

### 1. How did Prophet Muhammad ﷺ treat his former enemies when he liberated Makkah (Fath Makkah)?
* A) He punished all of them
* B) He forgave them with magnanimity and declared them all free
* C) He exiled them to Rome
* D) He locked them in towers

### 2. Who was the first Rightly Guided Caliph after the Prophet's ﷺ passing?
* A) Sayyiduna Abu Bakr as-Siddiq (RA)
* B) Sayyiduna 'Umar (RA)
* C) Sayyiduna 'Uthman (RA)
* D) Sayyiduna 'Ali (RA)

### 3. Which Caliph standardized the official written copies of the Quran sent to all major cities?
* A) Sayyiduna 'Uthman ibn 'Affan (RA)
* B) Abu Bakr (RA)
* C) 'Umar (RA)
* D) 'Ali (RA)

### 4. What was the name of the famous book authored by Imam Malik compiling the hadiths and practice of Madinah?
* A) Al-Muwatta'
* B) The Atlas
* C) The History Book
* D) The Math Book

### 5. In which historical regions did the Maliki school of law become the predominant heritage?
* A) North Africa, West Africa, and Andalusia (Spain)
* B) South America only
* C) The North Pole
* D) China only

---

## Part B: Fill in the Blanks
*Word Bank: Muwatta, Uthman, Abu Bakr, Forgave*

6. The first Caliph of Islam was **_________________** as-Siddiq.
7. Upon entering Makkah, the Prophet ﷺ graciously **_________________** all who had opposed him.
8. The official master codices of the Quran were standardized under Caliph **_________________**.
9. The celebrated hadith book written by Imam Malik is **_________________**.

---

## Part C: Matching Pairs
Pair 1: Abu Bakr as-Siddiq --- The First Caliph who united the Ummah
Pair 2: 'Umar ibn al-Khattab --- Known as Al-Faruq (the distinguisher between truth and falsehood)
Pair 3: 'Uthman ibn 'Affan --- Standardized the Uthmanic codex of the Quran
Pair 4: 'Ali ibn Abi Talib --- Gate of knowledge and fourth Caliph

---

## Part D: Reflection
10. How does the Prophet's ﷺ forgiveness during the Conquest of Makkah teach us how to handle conflicts with classmates or siblings?

---

## Teacher Answer Key
1. B) Forgave them with sublime mercy.
2. A) Abu Bakr as-Siddiq.
3. A) 'Uthman ibn 'Affan.
4. A) Al-Muwatta'.
5. A) North Africa, West Africa, Andalusia.
6. Abu Bakr
7. Forgave
8. Uthman
9. Muwatta
""",
        "l5_handout": """# Level 5 Seminar Guide: Civilizational Historiography & Western Muslim Identity
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Topics:** Grand Narrative of Islamic Civilization, Golden Ages of Cordoba, Fez & Timbuktu, Navigating Modern Secularism, Confident Civic Leadership  
**Classical Spine:** *Al-Muqaddimah* (Ibn Khaldun) & *Tartib al-Madarik* (Qadi 'Iyad)  

---

## 1. Historiography of Islamic Civilization
The expansion of Islamic civilization was not merely an imperial movement; it was an epistemological revolution that transformed philosophy, medicine, mathematics, and law:
* **The Rashidun Era (11–40 AH)**: The pristine application of prophetic values to governance.
* **The Umayyad & Abbasid Dynasties**: Institutionalization of administrative statecraft, translation movements (Bayt al-Hikmah), and codification of the four Sunni schools of law (*Al-Madhahib al-Arba'ah*).
* **The Western Islamic Sphere (Al-Gharb al-Islami)**:
  * **Andalusia (Cordoba, Granada)**: A beacon of scientific and philosophical illumination while medieval Europe was in the Dark Ages.
  * **The Maghrib & West Africa (Fez, Qarawiyyin, Timbuktu, Sankore)**: Centuries of unbroken scholarship in Maliki fiqh, Ash'ari kalam, and spiritual Tazkiyah.
* **Imam Malik's Celebrated Maxim**:
  > *"Nothing will rectify the later generations of this Ummah except that which rectified its first generation."*

---

## 2. Navigating Contemporary Secular Ideologies
Modern Muslim adolescents face profound intellectual pressures from dominant Western philosophical currents:
* **Secular Materialism**: The dogma that physical matter is the only reality.
  * *Sunni Response*: Demonstrating the philosophical bankruptcy of materialism through the reality of human consciousness, moral objectivity, and cosmic contingency (*Imkan*).
* **Moral Relativism**: The claim that objective right and wrong do not exist.
  * *Sunni Response*: Establishing that moral values are anchored in Divine Revelation (*Shar'*), not shifting societal consensus.
* **Existential Nihilism**: The loss of purpose.
  * *Sunni Response*: The Quranic worldview establishing that every human soul is created with intentional purpose (*Khalifah*) in a purposeful testing realm (*Dar al-Imtihan*).

---

## 3. Principles of Western Muslim Civic Engagement
Living as a committed Muslim in the modern West requires moving beyond a "minority victim" mindset into proactive, principled contribution:
1. **Uncompromising Faith & Rooted Literacy**: Confident grounding in Sunni creed and practice without theological compromise.
2. **Exemplary Adab & Character**: Being the most reliable, honest, and compassionate professional, neighbor, and citizen.
3. **Intellectual & Societal Contribution**: Excelling in STEM, humanities, law, and civil society to address pressing global crises (climate justice, poverty, systemic inequality).
""",
        "l5_questions": """# Level 5 Seminar Assessment: Islamic Civilization & Modern Identity
**Age Group:** Ages 14–16+ (Senior High / Level 5 Capstone Track)  
**Focus:** Civilizational History, Refuting Modern Philosophies, and Civic Leadership  

---

## Part A: Advanced Multiple Choice

### 1. What did Imam Malik mean by his celebrated maxim: *"Nothing will rectify the later generations of this Ummah except that which rectified its first generation"*?
* A) We should avoid modern technology
* B) Renewal and civilizational flourishing require returning to the unshakeable foundations of Tawhid, authentic Prophetic Sunnah, and sincere Adab
* C) Historical books should not be read
* D) Everyone must move to the desert

### 2. How does classical Islamic theology refute philosophical "Moral Relativism" (the claim that morality is purely subjective)?
* A) By asserting that objective moral truths are grounded in Divine Revelation (*Wahy*) and the wisdom of the Transcendent Creator, rather than cultural trends
* B) By agreeing with relativism
* C) By ignoring moral questions
* D) Through military force

### 3. What historic educational institution in Fez, Morocco was recognized as the oldest continuously operating university in the world, founded by Fatima al-Fihri?
* A) University of al-Qarawiyyin
* B) Oxford University
* C) Sankore University
* D) House of Wisdom

### 4. How did Islamic scholarship in medieval Andalusia (Spain) transform European intellectual history?
* A) It kept Europe isolated
* B) It translated, preserved, and expanded upon Greek and Arab philosophy, medicine, and mathematics, acting as the primary catalyst for the European Renaissance
* C) It destroyed European libraries
* D) It only traded in fabrics

### 5. What is the defining characteristic of principled Muslim civic engagement in contemporary Western societies?
* A) Complete assimilation that erases religious identity
* B) Proactive, ethically grounded contribution in professions and civil society while maintaining uncompromising adherence to Islamic creed and values
* C) Absolute total isolation from all civic life
* D) Ignoring all laws

---

## Part B: Terminology & Fill-in-the-Blanks
*Word Bank: Al-Qarawiyyin, Timbuktu, Andalus, Nihilism, Khalifah*

6. The historic university established in Fez by Fatima al-Fihri is **_________________**.
7. The philosophical despair claiming that life is devoid of objective meaning is **_________________**.
8. The Muslim civilization in the Iberian peninsula celebrated for interfaith coexistence and science was **_________________**.
9. The Quranic concept of humanity as vicegerents and responsible stewards of the earth is **_________________**.

---

## Part C: Advanced Matching Matrix
Pair 1: Fatima al-Fihri --- Founder of the University of al-Qarawiyyin in Fez (859 CE)
Pair 2: Ibn Khaldun --- Father of sociology and historiography (*Al-Muqaddimah*)
Pair 3: Sankore University --- World-renowned center of Maliki scholarship in Timbuktu
Pair 4: Khalifah --- Human mandate as moral stewards on earth

---

## Part D: Capstone Analytical Essay Prompt
10. **Capstone Synthesis Prompt**: Reflecting on the entire 5-Level curriculum journey—from the simple wonder of creation in Level 1 to the sophisticated epistemology of Level 5: 
* Synthesize how the combination of **Ash'ari Creed** (rational clarity and transcendence), **Maliki Fiqh** (practical, lived communal worship), and **Prophetic Character** equips a young Muslim to thrive as an intellectual and moral beacon in the 21st century.

---

## Teacher Answer Key
1. B) Return to authentic foundations of Tawhid and Sunnah.
2. A) Objective morals anchored in divine revelation.
3. A) University of al-Qarawiyyin.
4. B) Primary bridge and catalyst of European intellectual revival.
5. B) Proactive contribution with uncompromising faith.
6. Al-Qarawiyyin
7. Nihilism
8. Andalus
9. Khalifah
"""
    }
]

# Combine all modules
ALL_MODULES = MODULE_DATA + MODULES_4_TO_9

print(f"🚀 Writing curriculum files for all {len(ALL_MODULES)} modules...")

for mod in ALL_MODULES:
    target_dir = os.path.join(ROOT_DIR, mod["folder"], mod["mdDir"])
    if not os.path.exists(target_dir):
        print(f"❌ Target dir not found: {target_dir}")
        continue

    # Level 1 files
    f_l1_handout = os.path.join(target_dir, "handout_level1.md")
    f_l1_questions = os.path.join(target_dir, "questions_level1.md")
    with open(f_l1_handout, "w", encoding="utf-8") as f:
        f.write(mod["l1_handout"].strip() + "\n")
    with open(f_l1_questions, "w", encoding="utf-8") as f:
        f.write(mod["l1_questions"].strip() + "\n")

    # Level 2 files
    f_l2_handout = os.path.join(target_dir, "handout_level2.md")
    f_l2_questions = os.path.join(target_dir, "questions_level2.md")
    with open(f_l2_handout, "w", encoding="utf-8") as f:
        f.write(mod["l2_handout"].strip() + "\n")
    with open(f_l2_questions, "w", encoding="utf-8") as f:
        f.write(mod["l2_questions"].strip() + "\n")

    # Level 5 files
    f_l5_handout = os.path.join(target_dir, "handout_level5.md")
    f_l5_questions = os.path.join(target_dir, "questions_level5.md")
    with open(f_l5_handout, "w", encoding="utf-8") as f:
        f.write(mod["l5_handout"].strip() + "\n")
    with open(f_l5_questions, "w", encoding="utf-8") as f:
        f.write(mod["l5_questions"].strip() + "\n")

    print(f"✅ Generated Level 1, 2, and 5 files for: {mod['folder']}")

print("\n🎉 ALL 9 MODULES NOW HAVE FULL CONTENT FOR ALL 5 LEVELS!")
