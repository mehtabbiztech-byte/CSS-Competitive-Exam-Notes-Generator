import { SyllabusSubject, StudyNote } from "../types";

export const DAILY_MOTIVATIONS = [
  {
    quote: "The CSS exam is not a test of your memory, but a test of your temperament, critical thinking, and perseverance.",
    author: "Former FPSC Chairman"
  },
  {
    quote: "Do not just read to pass; read to analyze. An examiner is looking for an administrative mindset, not a textbook repeater.",
    author: "CSS Pakistan Affairs Topper"
  },
  {
    quote: "Consistency is the key. 4 hours of focused, daily study beats 12 hours of erratic sessions. Make notes, revise often.",
    author: "FPSC Bureaucrat"
  },
  {
    quote: "In the CSS Essay, clarity of thought and structured arguments will take you across the line when flowery language fails.",
    author: "Senior Examiner"
  }
];

export const SYLLABUS_DATA: SyllabusSubject[] = [
  {
    id: "comp-pak-affairs",
    name: "Pakistan Affairs",
    category: "Compulsory",
    marks: 100,
    topics: [
      {
        id: "ideology-pakistan",
        title: "I. Ideology of Pakistan",
        subtopics: [
          "Definition and Elucidation",
          "Historical Aspects",
          "Muslim Rule in the Subcontinent",
          "Downfall of Muslim Rule",
          "Efforts for Muslim Renaissance",
          "Reform Movements",
          "Shaikh Ahmad Sarhindi",
          "Shah Waliullah",
          "Sayyid Ahmad Shaheed",
          "Aligarh Movement",
          "Deoband Movement",
          "Nadwah Movement",
          "Sindh Madrassah",
          "Islamia College Peshawar",
          "Ideology of Pakistan in light of speeches of Allama Iqbal & Quaid-i-Azam Muhammad Ali Jinnah"
        ]
      },
      {
        id: "land-people",
        title: "II. Land and People of Pakistan",
        subtopics: [
          "Geography",
          "Society",
          "Natural Resources",
          "Agriculture",
          "Industry",
          "Education (Characteristics, Trends, Problems)"
        ]
      },
      {
        id: "changing-regional-apparatus",
        title: "III. Pakistan and Changing Regional Apparatus",
        subtopics: [
          "Regional Geopolitics",
          "Strategic Shifts",
          "Alliances and Balance of Power"
        ]
      },
      {
        id: "nuclear-program",
        title: "IV. Nuclear Program of Pakistan",
        subtopics: [
          "Nuclear Program",
          "Safety",
          "Security",
          "International Concerns"
        ]
      },
      {
        id: "regional-cooperation-orgs",
        title: "V. Regional Cooperation Organizations and the Role of Pakistan",
        subtopics: [
          "SAARC",
          "ECO",
          "SCO",
          "Pakistan's Role"
        ]
      },
      {
        id: "civil-military-relations",
        title: "VI. Civil-Military Relations in Pakistan",
        subtopics: [
          "Civil-Military Relations",
          "Democratic Consolidation",
          "Institutional Balance"
        ]
      },
      {
        id: "economic-challenges",
        title: "VII. Economic Challenges in Pakistan",
        subtopics: [
          "Debt and Deficit",
          "Fiscal policy and tax reforms",
          "Structural changes & IMF"
        ]
      },
      {
        id: "non-traditional-security-threats",
        title: "VIII. Non-Traditional Security Threats in Pakistan",
        subtopics: [
          "Role of Non-State Actors",
          "Climate change, water security & health crises"
        ]
      },
      {
        id: "pakistan-role-region",
        title: "IX. Pakistan's Role in the Region",
        subtopics: [
          "Regional connectivity & trade routes",
          "Peace-building and regional diplomacy"
        ]
      },
      {
        id: "palestine-issue",
        title: "X. The Palestine Issue",
        subtopics: [
          "Historical perspectives & global stances",
          "Two-State solution",
          "Pakistan's official response"
        ]
      },
      {
        id: "changing-security-dynamics",
        title: "XI. Changing Security Dynamics for Pakistan",
        subtopics: [
          "Challenges to National Security",
          "Evolving threats & borders"
        ]
      },
      {
        id: "political-evolution-1971",
        title: "XII. Political Evolution Since 1971",
        subtopics: [
          "Political Evolution Since 1971",
          "Simbia Agreement to democratization"
        ]
      },
      {
        id: "us-war-on-terror",
        title: "XIII. Pakistan and US War on Terror",
        subtopics: [
          "War on Terror strategic impacts",
          "Socio-economic & military costs"
        ]
      },
      {
        id: "foreign-policy-post-911",
        title: "XIV. Foreign Policy of Pakistan Post-9/11",
        subtopics: [
          "Determinants & changes",
          "Post-9/11 alignments"
        ]
      },
      {
        id: "democratic-system-evolution",
        title: "XV. Evolution of Democratic System in Pakistan",
        subtopics: [
          "Evolution of Democratic System",
          "Institutional strengthening & elections"
        ]
      },
      {
        id: "ethnic-issues-national-integration",
        title: "XVI. Ethnic Issues and National Integration",
        subtopics: [
          "Ethnic challenges",
          "National integration & federal harmony"
        ]
      },
      {
        id: "hydro-politics",
        title: "XVII. Hydro Politics",
        subtopics: [
          "Water Issues in Domestic Context",
          "Water Issues in Regional Context"
        ]
      },
      {
        id: "national-interest",
        title: "XVIII. Pakistan's National Interest",
        subtopics: [
          "Core national security goals",
          "Economic and geostrategic interest"
        ]
      },
      {
        id: "challenges-sovereignty",
        title: "XIX. Challenges to Sovereignty",
        subtopics: [
          "External interventions",
          "Sovereignty & financial autonomy"
        ]
      },
      {
        id: "energy-problems",
        title: "XX. Pakistan's Energy Problems and Their Effects",
        subtopics: [
          "Energy Crisis & effects on economy",
          "Circular debt & options for renewable transition"
        ]
      },
      {
        id: "relations-neighbors-no-india",
        title: "XXI. Pakistan's Relations with Neighbors (Excluding India)",
        subtopics: [
          "Relations with China",
          "Relations with Afghanistan",
          "Relations with Iran"
        ]
      },
      {
        id: "relations-india",
        title: "XXII. Pakistan–India Relations Since 1947",
        subtopics: [
          "Bilateral relations since 1947",
          "Kashmir issue, water disputes & peace accords"
        ]
      },
      {
        id: "kashmir-issue",
        title: "XXIII. The Kashmir Issue",
        subtopics: [
          "Kashmir Dispute",
          "UN Resolutions & modern stance"
        ]
      },
      {
        id: "war-afghanistan-1979",
        title: "XXIV. The War in Afghanistan Since 1979",
        subtopics: [
          "Impact on Pakistan",
          "Challenges to Pakistan in the Post-2014 Era"
        ]
      },
      {
        id: "proxy-wars",
        title: "XXV. Proxy Wars",
        subtopics: [
          "Role of External Elements",
          "Threats to internal stability"
        ]
      },
      {
        id: "economic-conditions",
        title: "XXVI. Economic Conditions of Pakistan",
        subtopics: [
          "Most Recent Economic Survey",
          "Previous Budget",
          "Current Budget",
          "Problems of Major Economic Sectors",
          "Performance of Major Economic Sectors"
        ]
      },
      {
        id: "constitutional-legal-developments",
        title: "XXVII. Recent Constitutional and Legal Developments",
        subtopics: [
          "Constitutional Debates",
          "Legal Debates",
          "Latest Constitutional Amendments",
          "Important Legislations",
          "Important Legal Cases",
          "Role of Higher Courts"
        ]
      },
      {
        id: "prevailing-social-problems",
        title: "XXVIII. Prevailing Social Problems of Pakistan",
        subtopics: [
          "Poverty",
          "Education",
          "Health",
          "Sanitation",
          "Strategies to Deal with Social Problems"
        ]
      }
    ]
  },
  {
    id: "comp-islamic-studies",
    name: "Islamic Studies",
    category: "Compulsory",
    marks: 100,
    topics: [
      {
        id: "intro-islam",
        title: "I. Introduction to Islam",
        subtopics: [
          "Concept of Islam",
          "Importance of Din in Human Life",
          "Difference between Din and Religion",
          "Distinctive Aspects of Islam"
        ]
      },
      {
        id: "islamic-beliefs",
        title: "II. Islamic Beliefs & Their Impact",
        subtopics: [
          "Fundamentals of Islam and Their Impact on Individual & Society",
          "Tauheed (Oneness of Allah)",
          "Risalat (Prophethood)",
          "Akhirah (Hereafter)"
        ]
      },
      {
        id: "islamic-worships",
        title: "III. Islamic Worships",
        subtopics: [
          "Salat (Prayer)",
          "Sawm (Fasting)",
          "Zakat (Almsgiving)",
          "Hajj (Pilgrimage)",
          "Spiritual, Moral and Social Impact of Worships"
        ]
      },
      {
        id: "sirah-prophet",
        title: "IV. Sirah of Prophet Muhammad (PBUH) as a Role Model",
        subtopics: [
          "As an Individual",
          "As a Diplomat",
          "As an Educator",
          "As a Military Strategist",
          "As a Peace Maker"
        ]
      },
      {
        id: "human-rights-gender",
        title: "V. Human Rights & Status of Women in Islam",
        subtopics: [
          "Human Rights in Islam",
          "Status and Dignity of Men & Women in Islam",
          "Khutbah Hajjat-ul-Wida (Farewell Sermon)"
        ]
      },
      {
        id: "islamic-civ-culture",
        title: "VI. Islamic Civilization and Culture",
        subtopics: [
          "Meanings and Vital Elements",
          "Role in the Development of Human Personality and Community",
          "Characteristics of Islamic Civilization",
          "Tawhid",
          "Self-Purification",
          "Dignity of Man",
          "Equality",
          "Social Justice",
          "Moral Values",
          "Tolerance",
          "Rule of Law"
        ]
      },
      {
        id: "islam-world-challenges",
        title: "VII. Islam and the World",
        subtopics: [
          "Impact of Islamic Civilization on the West and Vice Versa",
          "Role of Islam in the Modern World",
          "Muslim World and Contemporary Challenges",
          "Rise of Extremism"
        ]
      },
      {
        id: "governance-islam",
        title: "VIII. Public Administration & Governance in Islam",
        subtopics: [
          "Concept of Public Administration",
          "Quranic Guidance on Good Governance",
          "Governance in the Light of Qur'an, Sunnah and Fiqh",
          "Governance Structure in Islam",
          "Shura",
          "Legislation",
          "Sources of Islamic Law",
          "Governance under the Pious Khilafat",
          "Letters of Hazrat Umar (R.A.) and Hazrat Ali (R.A.)",
          "Responsibilities of Civil Servants",
          "System of Accountability (Hisbah)"
        ]
      },
      {
        id: "islamic-code-life",
        title: "IX. Islamic Code of Life",
        subtopics: [
          "Salient Features of the Islamic System",
          "Islamic Social System",
          "Islamic Political System",
          "Islamic Economic System",
          "Islamic Judicial System",
          "Islamic Administrative System",
          "Ijma",
          "Ijtihad"
        ]
      }
    ]
  },
  {
    id: "comp-current-affairs",
    name: "Current Affairs",
    category: "Compulsory",
    marks: 100,
    topics: [
      {
        id: "domestic-affairs",
        title: "Pakistan's Domestic Affairs (20 Marks)",
        subtopics: [
          "Political: System, Institutions, Governance, Constitutional Framework",
          "Economic: Debt, Tax Reforms, IMF, Agriculture, Industrial Output",
          "Social: Literacy, Health, Poverty, Gender Equity, Youth Development"
        ]
      },
      {
        id: "external-neighbors",
        title: "External Affairs: Relations with Neighbors",
        subtopics: [
          "Relations with India (Kashmir issue, Sir Creek, Siachen, Water disputes)",
          "Relations with China (CPEC Phase-II, strategic alignment, defense)",
          "Relations with Afghanistan (Border security, transit trade, repatriation)",
          "Relations with Russia (Gas pipelines, military hardware, regional balance)"
        ]
      },
      {
        id: "external-muslim-world",
        title: "External Affairs: Relations with Muslim World",
        subtopics: [
          "Relations with Iran (Trade, security cooperation, IP gas pipeline)",
          "Relations with Saudi Arabia (Financial deposits, investment, security ties)",
          "Relations with Indonesia and Turkey (D-8, cultural bonds, industrial partnerships)"
        ]
      },
      {
        id: "external-us",
        title: "External Affairs: Relations with United States",
        subtopics: [
          "Strategic balance in the region",
          "Aid vs Trade dynamics, security dialogue",
          "Counter-terrorism partnership & FATF compliance"
        ]
      },
      {
        id: "external-organizations",
        title: "External Affairs: Multilateral & International Orgs",
        subtopics: [
          "United Nations (UN) & general assembly diplomacy",
          "SAARC (South Asian Association for Regional Cooperation) challenges",
          "ECO (Economic Cooperation Organization) and OIC (Organisation of Islamic Cooperation)",
          "WTO (World Trade Organization) and GCC (Gulf Cooperation Council)"
        ]
      },
      {
        id: "global-security-energy",
        title: "Global Issues: Security, Terrorism & Energy",
        subtopics: [
          "International Security: changing power dynamics and alliances",
          "Terrorism and Counter Terrorism: global response and proxy wars",
          "Global Energy Politics: oil pricing, pipelines, transition to renewables",
          "Nuclear Proliferation, Nuclear Security, and Arms Control",
          "Nuclear Politics in South Asia"
        ]
      },
      {
        id: "global-south-asia-trade",
        title: "Global Issues: Trade, IPE & Oceans",
        subtopics: [
          "International Political Economy (IPE): sanctions, currency wars",
          "International Trade: Doha Development Round and Bali Package",
          "Cooperation and Competition in Arabian Sea, Indian and Pacific Oceans"
        ]
      },
      {
        id: "global-humanitarian-env",
        title: "Global Issues: Environment, Population & Rights",
        subtopics: [
          "Environment: Global Warming, Kyoto Protocol, Copenhagen Accord",
          "Population: World population trends, world population policies",
          "Human Rights: global frameworks & active challenges",
          "Millennium Development Goals (MDGs) & SDGs current status",
          "Globalization: cultural and financial dimensions"
        ]
      },
      {
        id: "global-regional-disputes",
        title: "Global Issues: Regional Disputes & Crises",
        subtopics: [
          "Middle East Crisis: Syria, Yemen, and regional alignments",
          "Kashmir Issue: historic and current perspectives, UN resolutions",
          "Palestine Issue: two-state solution, international security implications"
        ]
      }
    ]
  },
  {
    id: "opt-ir",
    name: "International Relations",
    category: "Optional",
    marks: 200,
    topics: [
      {
        id: "ir-theories",
        title: "Theories of International Relations",
        subtopics: ["Realism (Classical & Neo)", "Liberalism & Institutionalism", "Constructivism", "Marxism & Critical Theories"]
      },
      {
        id: "balance-power",
        title: "Balance of Power & Deterrence",
        subtopics: ["Techniques of Balance of Power", "Nuclear deterrence in South Asia", "MAD (Mutually Assured Destruction)"]
      },
      {
        id: "globalization",
        title: "Globalization and Nations",
        subtopics: ["Economic globalization", "Sovereignty of states", "Rise of Non-State Actors"]
      }
    ]
  },
  {
    id: "opt-political-science",
    name: "Political Science",
    category: "Optional",
    marks: 200,
    topics: [
      {
        id: "western-thinkers",
        title: "Western Political Thinkers",
        subtopics: ["Plato (Republic, Justice)", "Aristotle (Politics, Classification of States)", "Machiavelli (The Prince)", "Hobbes, Locke, Rousseau (Social Contract)"]
      },
      {
        id: "muslim-thinkers",
        title: "Muslim Political Thinkers",
        subtopics: ["Al-Farabi (Model State)", "Al-Mawardi (Theory of Imamate)", "Ibn Khaldun (Asabiyyah)", "Allama Iqbal (Reconstruction of Religious Thought)"]
      },
      {
        id: "state-concepts",
        title: "Concepts of State",
        subtopics: ["Sovereignty", "Forms of Government (Parliamentary vs Presidential, Federal vs Unitary)", "Islamic Concept of State"]
      }
    ]
  }
];

export const PREBUILT_NOTES: StudyNote[] = [
  {
    id: "note-indus-valley-civ",
    subjectId: "comp-pak-affairs",
    topicId: "ideology-pakistan",
    title: "Indus Valley Civilization: Grid-System and Decline Theories",
    subjectName: "Pakistan Affairs",
    category: "Compulsory",
    style: "CSS Standard",
    length: "Medium (5-8 pages)",
    language: "English",
    createdAt: "2026-06-30T10:00:00Z",
    bookmarked: true,
    progress: 85,
    sectionsIncluded: ["Introduction", "Historical Perspective", "Town Planning", "Critical Analysis", "CSS Tips", "Exam Questions"],
    content: `# Indus Valley Civilization: Grid-System & Decline Theories

## 1. Introduction
The Indus Valley Civilization (IVC), flourishing from circa 2600 BCE to 1900 BCE, represents one of the three great early civilizations of the Old World, alongside Mesopotamia and Ancient Egypt. Spanning across modern-day Pakistan, northwest India, and northeast Afghanistan, its hallmark was an unprecedented degree of urban sophistication. This CSS study module dissects the architectural engineering (especially the grid system) and the competing theories regarding its sudden decline—both highly recurring themes in the FPSC Pakistan Affairs syllabus.

## 2. Historical Perspective
* **Chronology:** Divided into Early Harappan (3300–2600 BCE), Mature Harappan (2600–1900 BCE), and Late Harappan (1900–1300 BCE) phases.
* **Discovery:** Excavated first in 1921 at Harappa by Rai Bahadur Daya Ram Sahni, and in 1922 at Mohenjo-Daro by R.D. Banerji, under the leadership of Sir John Marshall.
* **Geography:** Tied closely to the Indus River Basin, providing alluvial soil that supported high-yield agricultural surpluses.

## 3. Town Planning & The Grid System
The sheer brilliance of Harappan municipal governance is evident in their structural layout, exhibiting a modern administrative mindset.

\u0060\u0060\u0060
       TYPICAL INDUS VALLEY CITY LAYOUT
┌─────────────────────────┐   ┌───────────────────────────┐
│     THE CITADEL         │   │       LOWER TOWN          │
│ (Religious & Admin Center)│   │ (Residential & Commercial) │
│                         │   │                           │
│  ┌───────────────────┐  │   │   ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
│  │   Great Bath      │  │   │   │ H │ │ H │ │ H │ │ H │   │
│  └───────────────────┘  │   │   └───┘ └───┘ └───┘ └───┘   │
│  ┌───────────────────┐  │   │       Main Street 9m Wide │
│  │   Granary         │  │   │  ───────────────────────  │
│  └───────────────────┘  │   │   ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
└─────────────────────────┘   └───────────────────────────┘
\u0060\u0060\u0060

### A. Gridiron Plan
* Street grids intersected at precise **90-degree right angles**, dividing the residential quarters into rectangular blocks.
* Main thoroughfares measured up to 9 meters wide (30 feet), accommodating heavy cart traffic.
* Street corners were rounded off slightly to facilitate easy movement of ox-drawn transport.

### B. Dual-Division Architecture
1. **The Citadel (Western Mound):** Built on an elevated mud-brick platform. Housed public institutions like the Great Bath, Assembly Hall, and the monumental Granary (Mohenjo-Daro). It served as the religious and administrative nerve center.
2. **The Lower Town (Eastern Mound):** Laid at ground level, hosting residential quarters for common citizens, artisans, and merchants.

### C. Advanced Sanitation & Hydraulic Engineering
* **Baked Bricks:** Standardized ratio of **4:2:1** (Length:Breadth:Thickness) used uniformly across all cities, highlighting central regulatory authority.
* **Covered Drains:** Every house had an individual drain connected to larger, stone-slab-covered street sewers. Brick-lined sumps acted as grease and silt traps to prevent clogging.
* **The Great Bath:** A tank of 12m x 7m x 2.4m, sealed with natural tar (bitumen) to prevent leakage, used for ritual purification.

### D. Architectural Excavation Blueprint
\u0060\u0060\u0060image
Title: Mohenjo-Daro Citadel Dual-Mound Structure
Type: Archaeological excavation layout blueprint
Description: Layout representing the Western Citadel built on elevated mud-brick platform and Eastern Lower Town for residential blocks.
Style: Archeological blueprint schematic
\u0060\u0060\u0060

### E. Socio-Economic Metrics
\u0060\u0060\u0060infographic
Title: Indus Valley Excavation Metrics Dashboard
Population | 50,000+ | Large peak metropolitan population at Mohenjo-Daro.
Brick Ratio | 4:2:1 | Standard structural dimension maintained nationwide.
Sewage | 100% | Full underground covered drainage sanitation system.
Trade Sphere | 1,500m | Trade connection spanning Mesopotamia to Persian Gulf.
\u0060\u0060\u0060

---

## 4. Theories of Decline (Critical Analysis)
Why did a civilization with such remarkable structural uniformity dissolve? CSS examiners expect an analytical comparison of the three primary schools of thought:

### Theory A: Aryan Invasion (The Cataclysmic Theory)
* **Proponents:** Mortimer Wheeler and Stuart Piggott.
* **Argument:** The Rigveda references Indra (the Aryan storm god) as "Purandhara" (destroyer of forts). Skeletons found huddled together in Mohenjo-Daro streets suggest a massacre.
* **Critique (Scholars' Opinion):** Modern archaeologists like George Dales and Kenneth Kennedy debunked this. Skeletons showed signs of healed trauma and were deposited in different stratigraphic layers, indicating deaths occurred at different times, not in a single battle.

### Theory B: Hydrological Changes & River Shifts
* **Proponents:** M.S. Vats, H.T. Lambrick.
* **Argument:** The Indus River shifted its course, flooding some cities repeatedly while starving others of vital navigation and irrigation channels.
* **Sarasvati Drying Theory:** Satellite imagery indicates the Ghaggar-Hakra (historically identified as the Sarasvati River) dried up due to tectonic shifts, leading to mass migration eastward towards the Ganges basin.

### Theory C: Ecological Degradation & Climate Change
* **Proponents:** G.L. Possehl, Madhusudan Sarma.
* **Argument:** Over-exploitation of soil nutrients, massive deforestation to fuel brick-baking kilns, and a weakening Indian summer monsoon led to aridification and collapse of the agricultural surplus that sustained these cities.

---

## 5. Pakistan Perspective
Understanding the Indus Civilization is vital to Pakistan's contemporary heritage. Geographically, Pakistan is the cradle of the Indus Basin. The continuity of crafts—such as the Sindhi Ajrak geometric patterns, clay pottery wheel methods, and bullock cart designs still visible in Sindh and Punjab—shows that while the cities collapsed, the culture survived and deeply shaped modern Pakistani regional aesthetics.

---

## 6. CSS Tips
> 💡 **Examiner's View:** To secure a high score (14+/20) on Pakistan Affairs questions, never rely on a single theory of decline. State clearly that the decline was **multicausal** and gradual. Always draw a neat, simple diagram of the dual-city structure (Citadel vs Lower Town) to gain visual edge points over other candidates.

---

## 7. Past FPSC CSS Exam Questions
1. *"The town planning of the Indus Valley Civilization was far superior to any other contemporary civilization. Elaborate with special reference to Mohenjo-Daro and Harappa."* (CSS 2018)
2. *"Discuss the socio-economic and religious structures of the Indus Valley people. What factors led to the eventual collapse of this glorious civilization?"* (CSS 2021)`
  },
  {
    id: "note-governance-islam",
    subjectId: "comp-islamic-studies",
    topicId: "governance-islam",
    title: "Governance & Administration in Islam: The Riyasat-e-Madina Model",
    subjectName: "Islamic Studies",
    category: "Compulsory",
    style: "Detailed Notes",
    length: "Medium (5-8 pages)",
    language: "English",
    createdAt: "2026-06-29T14:30:00Z",
    bookmarked: false,
    progress: 40,
    sectionsIncluded: ["Introduction", "Definitions", "Detailed Explanation", "Critical Analysis", "CSS Tips", "Exam Questions"],
    content: `# Governance & Administration in Islam: The Riyasat-e-Madina Model

## 1. Introduction
The Islamic concept of governance is fundamentally distinct from Western secular models. In Islam, sovereignty belongs exclusively to Allah SWT (Tawheed), and human authority is a sacred trust (Khilafat). This CSS module covers the constitutional framework of Riyasat-e-Madina, established by the Prophet Muhammad (PBUH) in 622 CE, highlighting how it serves as an administrative blueprint for contemporary governance.

## 2. Fundamental Definitions & Principles
* **Sovereignty (Al-Hakimiyah):** In Islam, Allah is the ultimate sovereign.
  > *"The command is for none but Allah."* (Al-Quran, Surah Yusuf: 40)
* **Trusteeship (Khilafat):** Man is God's vicegerent on earth. Authority must be exercised within the limits set by Shariah.
* **Consultation (Shura):** Decision-making must involve democratic consultation.
  > *"And consult them in the affairs."* (Al-Quran, Surah Ali 'Imran: 159)
* **Justice (Adl):** The cornerstone of Islamic administration.
  > *"Be just; that is nearer to righteousness."* (Al-Quran, Surah Al-Ma'idah: 8)

## 3. The Pillars of Riyasat-e-Madina
The state established in Madina was the world's first formal welfare state, organized on the following principles:

### A. Historic Evolution Chronology
\u0060\u0060\u0060timeline
622 CE | The Hijrah Migration | Foundation of the Sovereign Islamic State of Madina.
622 CE | Charter of Madina | Promulgation of the world's first written federal constitution.
628 CE | Treaty of Hudaybiyyah | Strategic non-aggression pact establishing state legitimacy.
630 CE | Conquest of Mecca | Peaceful transition and global projection of Islamic authority.
\u0060\u0060\u0060

### B. Good Governance Process Loop
\u0060\u0060\u0060flowchart
Stage 1: Divine Legislation | Revelation (Shariah) | Formulation of core eternal moral directives.
Stage 2: Shura Consultation | Majlis-e-Shura | Interactive consensus and community participation.
Stage 3: Executive Action | Administrative Organs | Execution of welfare policies under divine trust.
\u0060\u0060\u0060

### C. Geo-Strategic Islamic Center
\u0060\u0060\u0060map
Madina City Center | Hejaz region landmark | Capital base of operations & early welfare administrative core.
Mecca Sanctuary | Southern commercial node | Strategic pilgrimage focus and focal center of early Islamic history.
\u0060\u0060\u0060

### D. The Charter of Madina (Mithaq-e-Madina)
* Promulgated in 622 CE, it is widely considered the **first written constitution** in human history.
* **Pluralism:** It recognized Jews, Pagans, and Muslims as one political community (Ummah).
* **Religious Freedom:** Each community retained the right to practice their own faith and be judged by their own legal codes.
* **Defense pact:** All citizens were collectively responsible for defending Madina against external aggression.

### B. Mutual Assistance & Brotherhood (Mu'akhat)
* To address the refugee crisis of Muhajireen, the Prophet (PBUH) paired each migrant with an Ansar (helper) in Madina.
* This resolved immediate socio-economic strain without relying on foreign aid, creating an exemplary cooperative economic model.

---

## 4. Western Democracy vs. Islamic Shura Model
FPSC examiners frequently ask candidates to critically compare Western democratic structures with Islamic Shura.

| Attribute | Western Democratic Model | Islamic Shura Model |
| :--- | :--- | :--- |
| **Ultimate Sovereign** | The People / Parliament | Allah Almighty (Divine Law) |
| **Limits of Legislation** | Boundless (can pass any bill by majority) | Bound by Quran & Sunnah (Ijtihad used for new areas) |
| **Moral Anchorage** | Often separated from state law (Secularism) | Inseparable from state law and administrative ethics |
| **Selection Criteria** | Popularity, media campaigning, capital | Integrity, piety (Taqwa), and competence |

---

## 5. Scholars' Opinions
> *"The Riyasat-e-Madina was a revolutionary concept that dismantled the tribal hegemony of Arabia, replacing blood ties with ideological unity and establishing the supremacy of law over arbitrary power."*  
> — **Dr. Muhammad Hamidullah**, Islamic Scholar

---

## 6. CSS Tips
> 💡 **CSS Islamic Studies Tip:** To score high, memorize at least 3-4 Quranic Arabic verses with translation related to justice, Shura, and trust. Also, quote historical instances from the reign of the Rightly Guided Caliphs (Khulafa-e-Rashideen), particularly the judicial directives of Hazrat Umar (RA) to Hazrat Abu Musa al-Ashari.

---

## 7. Past FPSC CSS Exam Questions
1. *"Mithaq-e-Madina (Charter of Madina) is a masterpiece of constitutional drafting and pluralistic governance. Discuss its salient features and its relevance to modern multi-ethnic states."* (CSS 2019)
2. *"Define and explain the concept of sovereignty in Islam and contrast it with Western secular theories of state sovereignty."* (CSS 2022)`
  }
];
