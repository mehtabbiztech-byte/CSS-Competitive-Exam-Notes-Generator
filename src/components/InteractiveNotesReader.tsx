import React, { useMemo, useState, useEffect, useRef } from "react";
import { 
  Sparkles, Bookmark, Share2, Printer, CheckCircle, Info, 
  Search, ChevronLeft, ChevronRight, Book, Minimize2, Maximize2, 
  Settings, Trash2, Edit, Save, Play, Pause, RefreshCw, 
  MessageSquare, Send, BrainCircuit, ListCollapse, ListTodo,
  Star, HelpCircle, Award, Compass, Zap, BookOpen, Layers, 
  Calculator, Check, HelpCircle as HelpIcon, X, Milestone, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InteractiveNotesReaderProps {
  note: {
    id: string;
    title: string;
    subjectName: string;
    category: string;
    style: string;
    length: string;
    language: string;
    content: string;
    createdAt: string;
    bookmarked: boolean;
    model?: string;
  };
  onWordClick: (word: string, context: string) => void;
  onToggleBookmark: () => void;
}

// Entity descriptions for Hover Tooltips
const ENTITY_DESCRIPTIONS: Record<string, string> = {
  "18th Amendment": "Passed in 2010, restored the parliamentary character of the 1973 Constitution and devolved authority to provinces.",
  "Article 58(2)(b)": "A controversial constitutional provision giving the President power to dissolve the National Assembly unilaterally.",
  "Objective Resolution 1949": "Adopted under Liaquat Ali Khan, served as the foundation of Pakistan's constitutionalism, merging Islam and democracy.",
  "1956 Constitution": "The first constitution of Pakistan, framing a federal parliamentary system. Repealed in 1958.",
  "1962 Constitution": "Introduced by Ayub Khan, establishing a presidential form of government and Basic Democracies. Abrogated in 1969.",
  "1973 Constitution": "The current supreme law of Pakistan, defining a federal parliamentary republic with Islam as state religion.",
  "Objective Resolution": "The historic document acting as the preamble of Pakistan's constitutions, affirming sovereignty belongs to Allah.",
  "Mithaq-e-Madina": "The Covenant of Madinah, drafted by Prophet Muhammad (PBUH) in 622 CE; a model for pluralistic state structures.",
  "Charter of Madina": "The historic constitution of Madinah, considered the world's first written constitution defining secular-religious rights.",
  "Quaid-e-Azam": "Muhammad Ali Jinnah (1876-1948), the father of the nation and the first Governor-General of Pakistan.",
  "Muhammad Ali Jinnah": "Leader of the All-India Muslim League and the visionary architect of the state of Pakistan.",
  "Jinnah": "Muhammad Ali Jinnah, revered as Quaid-e-Azam (Great Leader) in Pakistan.",
  "Allama Iqbal": "National poet and philosopher of Pakistan, whose 1930 Allahabad address pioneered the idea of a separate Muslim homeland.",
  "Sir Syed Ahmed Khan": "Founder of the Aligarh Movement, pioneer of modern education for South Asian Muslims, and propounder of the Two-Nation Theory.",
  "Sir Syed": "Sir Syed Ahmad Khan, educationalist and reformer of South Asian Muslims in the 19th century.",
  "Sheikh Ahmad Sirhindi": "Revered as Mujaddid Alif Sani (Reformer of the Second Millennium), opposed Akbar's Din-i-Ilahi and revitalized orthodox Islam.",
  "Shah Waliullah": "18th-century Islamic scholar, translated the Quran into Persian and worked to revive Muslim socio-political power in India.",
  "Muhammad bin Qasim": "Umayyad general who conquered Sindh in 712 CE, initiating Muslim civilization in the Indian subcontinent.",
  "Indus Water Treaty": "Water-sharing treaty signed in 1960 between India and Pakistan, brokered by the World Bank.",
  "Simla Agreement": "Peace treaty signed between India and Pakistan in 1972 following the 1971 war, emphasizing bilateralism.",
  "United Nations": "Global international organization established in 1945, crucial for lobbying Pakistan's Kashmir dispute.",
  "OIC": "Organization of Islamic Cooperation, representing the collective voice of the Muslim world; Pakistan is a founding member.",
  "FPSC": "Federal Public Service Commission of Pakistan, responsible for administering the CSS competitive exams.",
  "Lahore Resolution 1940": "Passed on March 23, 1940, demanding independent sovereign Muslim states in South Asia; genesis of Pakistan.",
  "Lahore Resolution": "The historic 1940 resolution declaring the Muslim demand for a separate homeland.",
  "Aligarh Movement": "Socio-educational reform movement started by Sir Syed Ahmad Khan, aiming to equip Muslims with modern Western education.",
  "Two-Nation Theory": "The ideology that Hindus and Muslims are two distinct nations with separate cultures, histories, and political aspirations.",
  "Riyasat-e-Madina": "The state model of Madinah, symbolizing social justice, accountability, and a true welfare state paradigm.",
  "Sovereignty": "The supreme, absolute power of a state. In Pakistan, constitutional sovereignty belongs to Allah alone."
};

const HIGHLIGHT_CATEGORIES = [
  {
    name: "Constitutional Articles",
    emoji: "📜",
    colorName: "Orange",
    class: "bg-orange-50 text-orange-850 border border-orange-200 hover:bg-orange-100 font-mono font-bold text-xs px-2 py-0.5 rounded-lg inline-flex items-center gap-1",
    terms: [
      "18th Amendment",
      "Article 58(2)(b)",
      "Objective Resolution 1949",
      "1956 Constitution",
      "1962 Constitution",
      "1973 Constitution",
      "Objective Resolution",
      "Mithaq-e-Madina",
      "Charter of Madina"
    ]
  },
  {
    name: "Personalities",
    emoji: "👤",
    colorName: "Blue",
    class: "bg-blue-50 text-blue-850 border border-blue-200 hover:bg-blue-100 font-semibold text-xs px-2 py-0.5 rounded-lg inline-flex items-center gap-1",
    terms: [
      "Quaid-e-Azam",
      "Muhammad Ali Jinnah",
      "Jinnah",
      "Allama Iqbal",
      "Sir Syed Ahmed Khan",
      "Sir Syed",
      "Sheikh Ahmad Sirhindi",
      "Shah Waliullah",
      "Muhammad bin Qasim",
      "Hazrat Umar",
      "Ibn Khaldun",
      "Al-Farabi",
      "Al-Mawardi"
    ]
  },
  {
    name: "Treaties",
    emoji: "🤝",
    colorName: "Red",
    class: "bg-red-50 text-red-850 border border-red-200 hover:bg-red-100 font-semibold text-xs px-2 py-0.5 rounded-lg inline-flex items-center gap-1",
    terms: [
      "Indus Water Treaty",
      "Simla Agreement",
      "NPT",
      "CTBT"
    ]
  },
  {
    name: "Organizations",
    emoji: "🏛️",
    colorName: "Emerald",
    class: "bg-emerald-50 text-emerald-850 border border-emerald-200 hover:bg-emerald-100 font-semibold text-xs px-2 py-0.5 rounded-lg inline-flex items-center gap-1",
    terms: [
      "United Nations",
      "OIC",
      "FPSC",
      "All India Muslim League",
      "Mughal Empire",
      "Mughals",
      "Sultanate Period",
      "Scientific Society",
      "IMF",
      "SCO"
    ]
  },
  {
    name: "Events",
    emoji: "📅",
    colorName: "Purple",
    class: "bg-purple-50 text-purple-850 border border-purple-200 hover:bg-purple-100 font-semibold text-xs px-2 py-0.5 rounded-lg inline-flex items-center gap-1",
    terms: [
      "Partition of Bengal",
      "Lahore Resolution 1940",
      "Lahore Resolution",
      "Cripps Mission",
      "Shimla Conference",
      "Cabinet Mission Plan",
      "Independence Act",
      "Aligarh Movement"
    ]
  },
  {
    name: "Books",
    emoji: "📘",
    colorName: "Slate",
    class: "bg-slate-50 text-slate-850 border border-slate-200 hover:bg-slate-100 font-medium italic text-xs px-2 py-0.5 rounded-lg inline-flex items-center gap-1",
    terms: [
      "The Struggle for Pakistan",
      "The Prince",
      "Republic",
      "Politics",
      "Reconstruction of Religious Thought"
    ]
  },
  {
    name: "Definitions",
    emoji: "🔍",
    colorName: "Teal",
    class: "bg-teal-50 text-teal-850 border border-teal-200 hover:bg-teal-100 font-medium text-xs px-2 py-0.5 rounded-lg inline-flex items-center gap-1",
    terms: [
      "Sovereignty",
      "Federation",
      "Deen",
      "Tawheed",
      "Khilafat",
      "Shura",
      "Adl",
      "Islamic Civilization"
    ]
  },
  {
    name: "CSS Keywords",
    emoji: "💡",
    colorName: "Indigo",
    class: "bg-indigo-50 text-indigo-850 border border-indigo-200 hover:bg-indigo-100 font-bold text-xs px-2 py-0.5 rounded-lg inline-flex items-center gap-1 font-mono",
    terms: [
      "Geo-strategic",
      "Pre-partition",
      "Bipolarity",
      "Rapprochement",
      "Geo-economics",
      "Pluralism",
      "Socio-economic",
      "Strategic balancing",
      "Two-Nation Theory",
      "Circular Debt",
      "Riyasat-e-Madina"
    ]
  }
];

function parseMathStringToReact(mathStr: string): React.ReactNode {
  const clean = mathStr
    .replace(/\\times/g, " × ")
    .replace(/\\approx/g, " ≈ ")
    .replace(/\\cdot/g, " · ")
    .replace(/\\geq/g, " ≥ ")
    .replace(/\\leq/g, " ≤ ")
    .replace(/\\neq/g, " ≠ ")
    .replace(/\\pm/g, " ± ")
    .replace(/\\quad/g, "   ")
    .replace(/\\qquad/g, "     ")
    .replace(/\\approx/g, " ≈ ");

  const tokens = parseMathTokens(clean);

  // Recursively map/flatten and apply absolutely unique keys
  const flattenAndAssignKeys = (nodes: React.ReactNode[], prefix: string = "m"): React.ReactNode[] => {
    let count = 0;
    const result: React.ReactNode[] = [];
    
    const process = (node: React.ReactNode) => {
      if (node === null || node === undefined) return;
      
      if (Array.isArray(node)) {
        node.forEach(process);
      } else if (React.isValidElement(node)) {
        if (node.type === React.Fragment) {
          const children = (node.props as any).children;
          if (Array.isArray(children)) {
            children.forEach(process);
          } else if (children) {
            process(children);
          }
        } else {
          const uniqueKey = `${prefix}-${count++}`;
          let newProps: any = { ...node.props, key: uniqueKey };
          
          if (node.props && (node.props as any).children !== undefined) {
            const children = (node.props as any).children;
            const childNodes = Array.isArray(children) ? children : [children];
            newProps.children = flattenAndAssignKeys(childNodes, `${uniqueKey}-c`);
          }
          result.push(React.cloneElement(node, newProps));
        }
      } else {
        // It's a primitive (string, number, etc.)
        result.push(<span key={`${prefix}-txt-${count++}`}>{String(node)}</span>);
      }
    };

    nodes.forEach(process);
    return result;
  };

  return <>{flattenAndAssignKeys(tokens)}</>;
}

function parseMathTokens(text: string): React.ReactNode[] {
  if (!text) return [];

  // 1. Match \frac{num}{den}
  const fracRegex = /\\frac\{([^{}]+)\}\{([^{}]+)\}/;
  const fracMatch = text.match(fracRegex);
  if (fracMatch) {
    const startIndex = fracMatch.index!;
    const matchLength = fracMatch[0].length;
    const numerator = fracMatch[1];
    const denominator = fracMatch[2];

    const leftNode = parseMathTokens(text.substring(0, startIndex));
    const rightNode = parseMathTokens(text.substring(startIndex + matchLength));

    const fracNode = (
      <span key={`frac-${startIndex}`} className="inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-serif text-sm">
        <span className="border-b border-indigo-200 px-1 pb-0.5 leading-none">{parseMathTokens(numerator)}</span>
        <span className="pt-0.5 leading-none">{parseMathTokens(denominator)}</span>
      </span>
    );

    return [...leftNode, fracNode, ...rightNode];
  }

  // 2. Match \text{text}
  const textRegex = /\\text\{([^{}]+)\}/;
  const textMatch = text.match(textRegex);
  if (textMatch) {
    const startIndex = textMatch.index!;
    const matchLength = textMatch[0].length;
    const content = textMatch[1];

    const leftNode = parseMathTokens(text.substring(0, startIndex));
    const rightNode = parseMathTokens(text.substring(startIndex + matchLength));

    const textNode = (
      <span key={`text-${startIndex}`} className="font-sans font-normal text-slate-800 not-italic select-text">
        {content}
      </span>
    );

    return [...leftNode, textNode, ...rightNode];
  }

  // 3. Match \mathbf{text}
  const boldRegex = /\\mathbf\{([^{}]+)\}/;
  const boldMatch = text.match(boldRegex);
  if (boldMatch) {
    const startIndex = boldMatch.index!;
    const matchLength = boldMatch[0].length;
    const content = boldMatch[1];

    const leftNode = parseMathTokens(text.substring(0, startIndex));
    const rightNode = parseMathTokens(text.substring(startIndex + matchLength));

    const boldNode = (
      <strong key={`bold-${startIndex}`} className="font-sans font-extrabold text-slate-900 select-text">
        {content}
      </strong>
    );

    return [...leftNode, boldNode, ...rightNode];
  }

  // 4. Match ^{exponent}
  const expBraceRegex = /([a-zA-Z0-9.\(\)]+)\^\{([^{}]+)\}/;
  const expBraceMatch = text.match(expBraceRegex);
  if (expBraceMatch) {
    const startIndex = expBraceMatch.index!;
    const matchLength = expBraceMatch[0].length;
    const base = expBraceMatch[1];
    const exponent = expBraceMatch[2];

    const leftNode = parseMathTokens(text.substring(0, startIndex));
    const rightNode = parseMathTokens(text.substring(startIndex + matchLength));

    const expNode = (
      <span key={`exp-${startIndex}`} className="inline-flex items-baseline select-text">
        <span>{parseMathTokens(base)}</span>
        <sup className="text-[10px] text-indigo-600 font-sans font-semibold leading-none -translate-y-1">{parseMathTokens(exponent)}</sup>
      </span>
    );

    return [...leftNode, expNode, ...rightNode];
  }

  // 5. Match ^exponent (single char or digits)
  const expRegex = /([a-zA-Z0-9.\(\)]+)\^([a-zA-Z0-9.]+)/;
  const expMatch = text.match(expRegex);
  if (expMatch) {
    const startIndex = expMatch.index!;
    const matchLength = expMatch[0].length;
    const base = expMatch[1];
    const exponent = expMatch[2];

    const leftNode = parseMathTokens(text.substring(0, startIndex));
    const rightNode = parseMathTokens(text.substring(startIndex + matchLength));

    const expNode = (
      <span key={`exp-${startIndex}`} className="inline-flex items-baseline select-text">
        <span>{parseMathTokens(base)}</span>
        <sup className="text-[10px] text-indigo-600 font-sans font-semibold leading-none -translate-y-1">{exponent}</sup>
      </span>
    );

    return [...leftNode, expNode, ...rightNode];
  }

  // 6. Match _{subscript}
  const subBraceRegex = /([a-zA-Z0-9.\(\)]+)_\{([^{}]+)\}/;
  const subBraceMatch = text.match(subBraceRegex);
  if (subBraceMatch) {
    const startIndex = subBraceMatch.index!;
    const matchLength = subBraceMatch[0].length;
    const base = subBraceMatch[1];
    const subscript = subBraceMatch[2];

    const leftNode = parseMathTokens(text.substring(0, startIndex));
    const rightNode = parseMathTokens(text.substring(startIndex + matchLength));

    const subNode = (
      <span key={`sub-${startIndex}`} className="inline-flex items-baseline select-text">
        <span>{parseMathTokens(base)}</span>
        <sub className="text-[10px] text-indigo-500 font-sans font-semibold leading-none translate-y-0.5">{parseMathTokens(subscript)}</sub>
      </span>
    );

    return [...leftNode, subNode, ...rightNode];
  }

  // 7. Match _subscript
  const subRegex = /([a-zA-Z0-9.\(\)]+)_([a-zA-Z0-9.]+)/;
  const subMatch = text.match(subRegex);
  if (subMatch) {
    const startIndex = subMatch.index!;
    const matchLength = subMatch[0].length;
    const base = subMatch[1];
    const subscript = subMatch[2];

    const leftNode = parseMathTokens(text.substring(0, startIndex));
    const rightNode = parseMathTokens(text.substring(startIndex + matchLength));

    const subNode = (
      <span key={`sub-${startIndex}`} className="inline-flex items-baseline select-text">
        <span>{parseMathTokens(base)}</span>
        <sub className="text-[10px] text-indigo-500 font-sans font-semibold leading-none translate-y-0.5">{subscript}</sub>
      </span>
    );

    return [...leftNode, subNode, ...rightNode];
  }

  const parts = text.split(/([a-zA-Z]+)/);
  return [
    <React.Fragment key={text}>
      {parts.map((part, index) => {
        if (/^[a-zA-Z]+$/.test(part)) {
          return (
            <span key={index} className="font-serif italic text-indigo-900 dark:text-indigo-200 font-semibold mx-0.5 tracking-wide select-all">
              {part}
            </span>
          );
        }
        return <span key={index} className="font-sans text-slate-800 dark:text-slate-200 select-all">{part}</span>;
      })}
    </React.Fragment>
  ];
}

function renderTextWithMath(
  text: string, 
  renderInteractiveTextFn: (t: string, s: string) => React.ReactNode,
  bodyColorClass: string,
  fontSize: number,
  indexKey: number,
  readerTheme: "light" | "sepia" | "dark"
): React.ReactNode {
  if (!text) return null;

  if (text.includes("$$")) {
    const parts = text.split("$$");
    
    // Theme-dependent styles for Math block equations
    const mathBlockBg = {
      light: "bg-gradient-to-r from-indigo-50/60 to-blue-50/50 border-indigo-100/80 text-indigo-950",
      sepia: "bg-gradient-to-r from-[#F0E6D2] to-[#E9DBBF] border-[#DFD1B3] text-[#3D2C1E]",
      dark: "bg-gradient-to-r from-indigo-950/35 to-slate-900/50 border-indigo-900/60 text-indigo-100"
    }[readerTheme];

    const labelText = {
      light: "text-indigo-600/90",
      sepia: "text-amber-800/90",
      dark: "text-indigo-400"
    }[readerTheme];

    return (
      <div key={`math-container-${indexKey}`} className="space-y-4 my-3">
        {parts.map((part, pIdx) => {
          if (pIdx % 2 === 1) {
            return (
              <div key={`math-block-${indexKey}-${pIdx}`} className={`my-6 p-5 border rounded-2xl flex flex-col items-center justify-center shadow-xs font-serif overflow-x-auto ${mathBlockBg}`}>
                <div className={`text-[10px] font-sans font-extrabold uppercase tracking-widest mb-3 select-none flex items-center gap-1.5 font-mono ${labelText}`}>
                  <Calculator className="w-3.5 h-3.5 animate-pulse" /> Syllabus Equation / Formula
                </div>
                <div className="text-base sm:text-lg font-semibold tracking-wide leading-relaxed py-1 px-4 text-center select-text flex items-center justify-center flex-wrap gap-y-1">
                  {parseMathStringToReact(part)}
                </div>
              </div>
            );
          } else {
            return renderTextWithInlineMath(part, renderInteractiveTextFn, bodyColorClass, fontSize, `${indexKey}-${pIdx}`, readerTheme);
          }
        })}
      </div>
    );
  }

  return renderTextWithInlineMath(text, renderInteractiveTextFn, bodyColorClass, fontSize, String(indexKey), readerTheme);
}

function renderTextWithInlineMath(
  text: string,
  renderInteractiveTextFn: (t: string, s: string) => React.ReactNode,
  bodyColorClass: string,
  fontSize: number,
  indexKey: string,
  readerTheme: "light" | "sepia" | "dark"
): React.ReactNode {
  if (!text) return null;

  if (text.includes("$")) {
    const parts = text.split("$");

    // Theme-dependent styles for inline math span
    const inlineMathClass = {
      light: "bg-indigo-50/90 text-indigo-950 border-indigo-100/80 shadow-2xs",
      sepia: "bg-[#F3EADA]/95 text-[#3D2C1E] border-[#DFD1B3]/80 shadow-2xs",
      dark: "bg-indigo-950/50 text-indigo-200 border-indigo-900/50 shadow-xs"
    }[readerTheme];

    return (
      <span key={`inline-math-container-${indexKey}`} className={`${bodyColorClass}`} style={{ fontSize: `${fontSize}px` }}>
        {parts.map((part, pIdx) => {
          if (pIdx % 2 === 1) {
            return (
              <span key={`inline-math-${indexKey}-${pIdx}`} className={`inline-flex items-center px-1.5 py-0.5 rounded border font-serif italic text-sm mx-1 select-text ${inlineMathClass}`}>
                {parseMathStringToReact(part)}
              </span>
            );
          } else {
            return <React.Fragment key={`text-chunk-${indexKey}-${pIdx}`}>{renderInteractiveTextFn(part, text)}</React.Fragment>;
          }
        })}
      </span>
    );
  }

  return <React.Fragment key={`text-chunk-${indexKey}`}>{renderInteractiveTextFn(text, text)}</React.Fragment>;
}

function getCategoryClass(catName: string, readerTheme: "light" | "sepia" | "dark"): string {
  const baseClasses = "px-2 py-0.5 rounded-lg inline-flex items-center gap-1 font-semibold text-xs border transition-all";
  switch (catName) {
    case "Constitutional Articles":
      if (readerTheme === "dark") return `${baseClasses} font-mono font-bold bg-orange-950/45 text-orange-300 border-orange-800/80 hover:bg-orange-900/40`;
      if (readerTheme === "sepia") return `${baseClasses} font-mono font-bold bg-[#FCECD9] text-[#7C2D12] border-orange-300/80 hover:bg-orange-200/40`;
      return `${baseClasses} font-mono font-bold bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100`;
    case "Personalities":
      if (readerTheme === "dark") return `${baseClasses} bg-blue-950/45 text-blue-300 border-blue-800/80 hover:bg-blue-900/40`;
      if (readerTheme === "sepia") return `${baseClasses} bg-[#E0F2FE]/80 text-[#0369A1] border-blue-300/80 hover:bg-blue-200/40`;
      return `${baseClasses} bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100`;
    case "Treaties":
      if (readerTheme === "dark") return `${baseClasses} bg-red-950/45 text-red-300 border-red-800/80 hover:bg-red-900/40`;
      if (readerTheme === "sepia") return `${baseClasses} bg-[#FEE2E2]/80 text-[#B91C1C] border-red-300/80 hover:bg-red-200/40`;
      return `${baseClasses} bg-red-50 text-red-900 border-red-200 hover:bg-red-100`;
    case "Organizations":
      if (readerTheme === "dark") return `${baseClasses} bg-emerald-950/45 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/40`;
      if (readerTheme === "sepia") return `${baseClasses} bg-[#D1FAE5]/80 text-[#047857] border-emerald-300/80 hover:bg-emerald-200/40`;
      return `${baseClasses} bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100`;
    case "Events":
      if (readerTheme === "dark") return `${baseClasses} bg-purple-950/45 text-purple-300 border-purple-800/80 hover:bg-purple-900/40`;
      if (readerTheme === "sepia") return `${baseClasses} bg-[#F3E8FF]/80 text-[#6D28D9] border-purple-300/80 hover:bg-purple-200/40`;
      return `${baseClasses} bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100`;
    case "Books":
      if (readerTheme === "dark") return `${baseClasses} italic bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700/60`;
      if (readerTheme === "sepia") return `${baseClasses} italic bg-slate-200/60 text-slate-800 border-slate-300 hover:bg-slate-300/40`;
      return `${baseClasses} italic bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100`;
    case "Definitions":
      if (readerTheme === "dark") return `${baseClasses} bg-teal-950/45 text-teal-300 border-teal-800/80 hover:bg-teal-900/40`;
      if (readerTheme === "sepia") return `${baseClasses} bg-[#CCFBF1]/80 text-[#0F766E] border-teal-300/80 hover:bg-teal-200/40`;
      return `${baseClasses} bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100`;
    case "CSS Keywords":
    default:
      if (readerTheme === "dark") return `${baseClasses} font-mono bg-indigo-950/45 text-indigo-300 border-indigo-800/80 hover:bg-indigo-900/40`;
      if (readerTheme === "sepia") return `${baseClasses} font-mono bg-[#E0E7FF]/80 text-[#4338CA] border-indigo-300/80 hover:bg-indigo-200/40`;
      return `${baseClasses} font-mono bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100`;
  }
}

export default function InteractiveNotesReader({
  note,
  onWordClick,
  onToggleBookmark
}: InteractiveNotesReaderProps) {
  // Reading modes: reading (Kindle mode), study (standard), revision (summarized high contrast), exam (mock workspace with timer), focus (distraction-free full screen)
  const [readingMode, setReadingMode] = useState<"reading" | "study" | "revision" | "exam" | "focus">("study");
  const [fontSize, setFontSize] = useState<number>(18); // default text size in px for kindle style
  const [fontFamily, setFontFamily] = useState<"serif" | "sans" | "mono">("serif");
  const [readerTheme, setReaderTheme] = useState<"light" | "sepia" | "dark">("light");
  const [wordLookupEnabled, setWordLookupEnabled] = useState<boolean>(false); // default to false to prevent visual clutter of underlines and hover effects on every word
  const [lineHeight, setLineHeight] = useState<number>(1.85); // default comfortable line height
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Escape key listener for exiting fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);

  // Tools drawer state
  const [isToolsDrawerOpen, setIsToolsDrawerOpen] = useState(false);
  const [toolsActiveTab, setToolsActiveTab] = useState<"flashcards" | "scribbles" | "calculator" | "aitutor" | "quiz" | "bookmarks">("flashcards");

  // Local state for Quick Scribble Notes
  const [scribbleText, setScribbleText] = useState(() => {
    return localStorage.getItem(`css_scribbles_${note.id}`) || "";
  });

  // Local state for Calculator
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState("");

  // Local state for AI Tutor chat
  const [aiTutorInput, setAiTutorInput] = useState("");
  const [aiChatLogs, setAiChatLogs] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Assalamu Alaikum! I am your CSS Professor AI Tutor. Ask me any conceptual question about this note module (e.g., scoring trends, linkages to current affairs, or arguments structure)." }
  ]);
  const [isAiTutorLoading, setIsAiTutorLoading] = useState(false);

  // Local state for practice MCQs Quiz
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizExpl, setShowQuizExpl] = useState<Record<number, boolean>>({});

  // Local state for Exam Mode timer
  const [timerSeconds, setTimerSeconds] = useState(10800); // 3 hours (CSS standard exam length)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [examScribbles, setExamScribbles] = useState("");

  // Refs
  const notesContainerRef = useRef<HTMLDivElement>(null);

  // Persist quick scribbles
  useEffect(() => {
    localStorage.setItem(`css_scribbles_${note.id}`, scribbleText);
  }, [scribbleText, note.id]);

  // Exam timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Extract dates and key events dynamically
  const chronologicalEvents = useMemo(() => {
    const list: Array<{ year: number; yearStr: string; text: string; fullLine: string }> = [];
    const lines = note.content.split("\n");
    const yearRegex = /\b(1[789]\d{2}|20\d{2})\b/g;

    lines.forEach((line) => {
      const cleanLine = line.replace(/^[#*>\-\d.\s]+/g, "").trim();
      if (cleanLine.length < 8 || line.startsWith("#")) return;

      let match;
      const matchedYears: string[] = [];
      while ((match = yearRegex.exec(line)) !== null) {
        matchedYears.push(match[1]);
      }

      const uniqueYears = [...new Set(matchedYears)];
      uniqueYears.forEach((yrStr) => {
        const yr = parseInt(yrStr, 10);
        if (yr >= 1700 && yr <= 2030) {
          list.push({
            year: yr,
            yearStr: yrStr,
            text: cleanLine.length > 130 ? cleanLine.substring(0, 127) + "..." : cleanLine,
            fullLine: cleanLine
          });
        }
      });
    });

    const sorted = list.sort((a, b) => a.year - b.year);
    const seen = new Set<number>();
    return sorted.filter((ev) => {
      if (seen.has(ev.year)) return false;
      seen.add(ev.year);
      return true;
    });
  }, [note.content]);

  // Flatten and sort terms by length descending to prevent substring mapping bugs
  const sortedHighlightTerms = useMemo(() => {
    const list: Array<{ term: string; catClass: string; emoji: string; catName: string }> = [];
    HIGHLIGHT_CATEGORIES.forEach((cat) => {
      cat.terms.forEach((term) => {
        list.push({ term, catClass: cat.class, emoji: cat.emoji, catName: cat.name });
      });
    });
    return list.sort((a, b) => b.term.length - a.term.length);
  }, []);

  // Jump to specific term/element
  const jumpToTerm = (term: string) => {
    if (!notesContainerRef.current) return;
    const elements = Array.from(notesContainerRef.current.querySelectorAll("span, p, li, h2, h3")) as HTMLElement[];
    const match = elements.find(el => el.textContent?.toLowerCase().includes(term.toLowerCase()));
    
    if (match) {
      match.scrollIntoView({ behavior: "smooth", block: "center" });
      const originalClass = match.className;
      const originalStyle = (match as HTMLElement).style.cssText;
      
      // Flash highlight
      (match as HTMLElement).style.cssText = "background-color: #fef08a !important; color: #1e293b !important; box-shadow: 0 0 0 4px #facc15 !important; border-radius: 4px; transition: all 0.3s ease;";
      
      setTimeout(() => {
        (match as HTMLElement).style.cssText = originalStyle;
      }, 2000);
    }
  };

  // Search Match Count
  const totalMatches = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) return 0;
    try {
      const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = note.content.match(new RegExp(escaped, "gi"));
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [note.content, searchQuery]);

  const handleNextMatch = () => {
    if (totalMatches === 0) return;
    const nextIdx = (activeMatchIdx + 1) % totalMatches;
    setActiveMatchIdx(nextIdx);
    scrollActiveMatchIntoView(nextIdx);
  };

  const handlePrevMatch = () => {
    if (totalMatches === 0) return;
    const prevIdx = (activeMatchIdx - 1 + totalMatches) % totalMatches;
    setActiveMatchIdx(prevIdx);
    scrollActiveMatchIntoView(prevIdx);
  };

  const scrollActiveMatchIntoView = (index: number) => {
    setTimeout(() => {
      const container = document.getElementById("notes-content-canvas");
      if (!container) return;
      const matches = container.querySelectorAll(".search-highlight-mark");
      if (matches && matches[index]) {
        matches[index].scrollIntoView({ behavior: "smooth", block: "center" });
        matches[index].classList.add("ring-4", "ring-indigo-500", "scale-105");
        setTimeout(() => {
          matches[index].classList.remove("ring-4", "ring-indigo-500", "scale-105");
        }, 1500);
      }
    }, 100);
  };

  // Helper to split a word into clean parts and handle clicks
  const renderClickableWords = (plainChunk: string, contextSentence: string) => {
    const parts = plainChunk.split(/(\s+)/);
    return parts.map((part, index) => {
      if (/^\s+$/.test(part)) {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }
      
      const cleanedWord = part.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
      
      // Word Highlight Match (Always active regardless of wordLookupEnabled)
      if (searchQuery && cleanedWord.toLowerCase() === searchQuery.toLowerCase()) {
        return (
          <span
            key={index}
            className="search-highlight-mark bg-yellow-200 text-slate-900 font-extrabold border-b border-yellow-500 px-0.5 rounded cursor-pointer"
            onClick={() => onWordClick(cleanedWord, contextSentence)}
          >
            {part}
          </span>
        );
      }

      // Check if word contains a 4-digit year falling fallback (Interactive if enabled)
      const isYear = /^\b\d{4}\b$/.test(cleanedWord);
      if (isYear && wordLookupEnabled) {
        return (
          <span
            key={index}
            onClick={() => onWordClick(cleanedWord, contextSentence)}
            className="bg-yellow-50 text-yellow-800 border border-yellow-200 font-mono font-bold text-xs px-1.5 py-0.5 rounded-md cursor-pointer hover:bg-yellow-100 transition-colors inline-block"
            title="Date detected. Click for syllabus events."
          >
            📅 {part}
          </span>
        );
      }

      if (wordLookupEnabled && cleanedWord.length > 2) {
        return (
          <span
            key={index}
            onClick={() => onWordClick(cleanedWord, contextSentence)}
            className="cursor-pointer hover:text-indigo-600 hover:underline decoration-indigo-400 decoration-2 transition-all"
            title="Click word for dictionary popup"
          >
            {part}
          </span>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  /**
   * Recursive parser that splits plain text into clickable words and highlight categories with hover tooltips
   */
  const renderInteractiveText = (text: string, contextSentence: string): React.ReactNode => {
    if (!text) return null;

    // Parse bold markdown ** recursively
    if (text.includes("**")) {
      const parts = text.split("**");
      const boldClass = {
        light: "text-indigo-950 font-black bg-indigo-50/75 border border-indigo-100/60 px-1.5 py-0.5 rounded-md shadow-3xs",
        sepia: "text-[#4D3319] font-black bg-[#ECDDB8]/80 px-1.5 py-0.5 rounded-md",
        dark: "text-amber-400 font-black bg-amber-950/45 px-1.5 py-0.5 rounded-md border border-amber-900/40"
      }[readerTheme] || "font-extrabold text-indigo-950";

      return (
        <>
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              return (
                <strong key={index} className={boldClass}>
                  {renderInteractiveText(part, contextSentence)}
                </strong>
              );
            }
            return <React.Fragment key={index}>{renderInteractiveText(part, contextSentence)}</React.Fragment>;
          })}
        </>
      );
    }

    // Search inside notes highlight helper
    const handleSearchPreHighlight = (txt: string) => {
      if (!searchQuery || searchQuery.trim().length === 0) {
        return renderClickableWords(txt, contextSentence);
      }
      const parts = txt.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi"));
      return parts.map((part, index) => {
        if (part.toLowerCase() === searchQuery.toLowerCase()) {
          return (
            <span
              key={index}
              className="search-highlight-mark bg-yellow-200 text-slate-900 font-extrabold border-b border-yellow-500 px-0.5 rounded"
            >
              {part}
            </span>
          );
        }
        return renderClickableWords(part, contextSentence);
      });
    };

    // Find the first highlight term match
    for (const matchObj of sortedHighlightTerms) {
      const idx = text.toLowerCase().indexOf(matchObj.term.toLowerCase());
      if (idx !== -1) {
        const left = text.substring(0, idx);
        const matchText = text.substring(idx, idx + matchObj.term.length);
        const right = text.substring(idx + matchObj.term.length);

        const description = ENTITY_DESCRIPTIONS[matchText] || `${matchObj.catName} entity. Click to view Urdu meanings, pronunciations, and mnemonics.`;

        return (
          <React.Fragment>
            {renderInteractiveText(left, contextSentence)}
            
            {/* Badge styled smart highlight with hover tooltip */}
            <span className="group relative inline-block mx-0.5 my-0.5">
              <span
                className={`${getCategoryClass(matchObj.catName, readerTheme)} cursor-pointer shadow-sm transform hover:scale-105 active:scale-95 transition-all`}
                onClick={() => onWordClick(matchText, contextSentence)}
              >
                {matchObj.emoji} {matchText}
              </span>

              {/* Tooltip Card */}
              <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-900 text-white p-3 rounded-xl shadow-2xl transition-all opacity-0 group-hover:opacity-100 duration-250 text-xs font-normal text-left z-50 border border-slate-700/80">
                <span className="flex items-center gap-1 font-bold text-[10px] text-indigo-400 uppercase tracking-wider mb-1">
                  {matchObj.emoji} {matchObj.catName} Smart Match
                </span>
                <span className="font-semibold block text-white text-sm mb-1.5">{matchText}</span>
                <span className="text-slate-300 font-sans leading-relaxed block mb-2">{description}</span>
                <span className="text-[10px] text-slate-400 font-semibold border-t border-slate-800 pt-1.5 block">
                  💡 Click to open pronunciation, Urdu/Sindhi & mnemonics
                </span>
              </span>
            </span>

            {renderInteractiveText(right, contextSentence)}
          </React.Fragment>
        );
      }
    }

    return handleSearchPreHighlight(text);
  };

  // Render static past papers questions based on note subject for Exam Mode
  const mockExamQuestions = useMemo(() => {
    if (note.title.toLowerCase().includes("indus") || note.title.toLowerCase().includes("valley")) {
      return [
        "Q1. Evaluate the socio-economic and religious structures of the Indus Valley Civilization. How did their urban city engineering affect subsequent civil structures? (FPSC CSS 2021)",
        "Q2. Critique the various theories on the decline of Harappa and Mohenjo-Daro civilizations. Which argument is supported by modern hydrological findings? (FPSC CSS 2019)"
      ];
    } else if (note.title.toLowerCase().includes("islam") || note.title.toLowerCase().includes("concept")) {
      return [
        "Q1. Elaborate on the concept of State in Islam, keeping in view the administrative reforms introduced by Hazrat Umar (R.A). How does it resemble a modern welfare state? (FPSC CSS 2022)",
        "Q2. Elaborate on the covenant 'Mithaq-e-Madina' as the foundation of a modern pluralistic constitution. Support with historical text. (FPSC CSS 2020)"
      ];
    }
    return [
      `Q1. Analyze the core arguments of this module: "${note.title}". What is its structural relationship to the modern socio-political dynamics of Pakistan? (FPSC Practice)`,
      "Q2. 'Examiners expect candidates to weave in primary constitutional amendments, historical dates, and quotes to secure high scores.' Critically discuss. (CSS Standard)"
    ];
  }, [note.title]);

  // Practice MCQs Quiz generated based on note context
  const mockQuizQuestions = useMemo(() => {
    if (note.title.toLowerCase().includes("indus") || note.title.toLowerCase().includes("valley")) {
      return [
        {
          q: "What is the primary characteristic of Town Planning in Indus Valley Civilization?",
          opts: ["Grid-System & covered drains", "Pyramid tombs", "Huge stone castles", "Walled circles only"],
          correct: 0,
          expl: "Harappa and Mohenjo-Daro were built on a precise grid-system (gridiron plan) with covered baked brick drains."
        },
        {
          q: "Which major river basin nurtured the Indus Valley Civilization?",
          opts: ["Ganges Basin", "Indus Basin", "Nile Basin", "Yangtze Basin"],
          correct: 1,
          expl: "The civilization flourished in the basin of the Indus River and its tributaries."
        },
        {
          q: "Who was the archaeologist who first discovered Mohenjo-Daro in 1922?",
          opts: ["John Marshall", "Mortimer Wheeler", "R.D. Banerji", "Alexander Cunningham"],
          correct: 2,
          expl: "Rakhaldas Bandyopadhyay (R.D. Banerji) discovered the site of Mohenjo-Daro in 1922."
        }
      ];
    }
    return [
      {
        q: `What is the core theme of the module: "${note.title}"?`,
        opts: ["General Knowledge of South Asia", "Structural analysis for FPSC CSS candidates", "Basic memory outlines only", "Historical chronology without commentary"],
        correct: 1,
        expl: "This module provides critical analytic pointers, scoring CSS tips, and multi-lingual word lookup specialized for civil service aspirants."
      },
      {
        q: "Which constitutional amendment devolved power to provinces in Pakistan?",
        opts: ["13th Amendment", "18th Amendment", "21st Amendment", "8th Amendment"],
        correct: 1,
        expl: "The 18th Amendment, passed in 2010, significantly devolved legislative and financial powers to provinces."
      }
    ];
  }, [note.title]);

  // Flashcards for high yield revision
  const mockFlashcards = useMemo(() => {
    if (note.title.toLowerCase().includes("indus") || note.title.toLowerCase().includes("valley")) {
      return [
        { front: "What was the grid layout of Harappa cities?", back: "The Gridiron Plan (Streets crossing at 90-degree angles with covered drainage)." },
        { front: "What are the baked brick ratios in IVC construction?", back: "1:2:4 ratio, showcasing a highly standardized industrial measurement system." },
        { front: "Who championed the 'Aryan Invasion' theory of decline?", back: "Sir Mortimer Wheeler (though highly contested today by hydrological climate change theories)." }
      ];
    }
    return [
      { front: "What is the primary focus of CSS Pakistan Affairs?", back: "Deep analytical arguments on history, economics, constitution, and foreign policy." },
      { front: "How many marks are allocated to Compulsory Subjects?", back: "100 marks each (6 compulsory subjects, totaling 600 marks)." },
      { front: "What is the key to scoring high in CSS papers?", back: "Weaving in authentic quotes, timelines, specific constitutional articles, and clean bento comparison structures." }
    ];
  }, [note.title]);

  const [activeFlashcardIdx, setActiveFlashcardIdx] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);

  // Parse lines into high fidelity HTML nodes
  const parsedElements = useMemo(() => {
    const headingColorClass = {
      light: "text-slate-900 border-slate-200/60",
      sepia: "text-[#2B1B0F] border-[#E8DAB7]/60",
      dark: "text-slate-50 border-slate-800"
    }[readerTheme];

    const subHeadingColorClass = {
      light: "text-slate-800",
      sepia: "text-[#3D2C1E]",
      dark: "text-slate-200"
    }[readerTheme];

    const bodyColorClass = {
      light: "text-slate-900",
      sepia: "text-[#3D2C1E]",
      dark: "text-slate-200"
    }[readerTheme];

    const isRevisionMode = readingMode === "revision";

    // Helper to check if a text contains any terms of a category
    const hasCategoryTerm = (text: string, catName: string) => {
      const cat = HIGHLIGHT_CATEGORIES.find(c => c.name === catName);
      if (!cat) return false;
      const lowerText = text.toLowerCase();
      return cat.terms.some(t => lowerText.includes(t.toLowerCase()));
    };

    const matchesRevision = (lineText: string, isBlockquote: boolean = false) => {
      const lower = lineText.toLowerCase();
      
      // 1. Definitions
      const isDef = lower.startsWith("definition:") || 
                    lower.includes("defined as") || 
                    hasCategoryTerm(lineText, "Definitions");
      
      // 2. Quotations
      const isQuote = isBlockquote || 
                      lower.startsWith("quote:") || 
                      lower.includes("❝") || 
                      lower.includes("”") || 
                      lower.includes("\"") ||
                      lower.includes("quote");

      // 3. Personalities
      const isPers = hasCategoryTerm(lineText, "Personalities");

      // 4. Dates
      const isDate = /\b(1[789]\d{2}|20\d{2})\b/.test(lineText);

      return isDef || isQuote || isPers || isDate;
    };

    const lines = note.content.split("\n");
    const elements: React.ReactNode[] = [];
    
    let insideTable = false;
    let tableRows: string[][] = [];
    let insideCodeBlock = false;
    let codeContent = "";
    let codeBlockType = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith("```")) {
        if (insideCodeBlock) {
          const trimmedCodeType = codeBlockType.trim().toLowerCase();
          if (isRevisionMode && trimmedCodeType !== "timeline") {
            // Skip non-timeline diagrams during Revision Mode to keep it extremely streamlined
            codeContent = "";
            codeBlockType = "";
            insideCodeBlock = false;
            continue;
          }

          if (trimmedCodeType === "timeline") {
            elements.push(
              <TimelineBlock 
                key={`timeline-${i}`} 
                rawContent={codeContent} 
                readerTheme={readerTheme} 
                renderInteractiveText={renderInteractiveText} 
              />
            );
          } else if (trimmedCodeType === "flowchart") {
            elements.push(
              <FlowchartBlock 
                key={`flowchart-${i}`} 
                rawContent={codeContent} 
                readerTheme={readerTheme} 
                renderInteractiveText={renderInteractiveText} 
              />
            );
          } else if (trimmedCodeType === "map") {
            elements.push(
              <MapBlock 
                key={`map-${i}`} 
                rawContent={codeContent} 
                readerTheme={readerTheme} 
                renderInteractiveText={renderInteractiveText} 
              />
            );
          } else if (trimmedCodeType === "image") {
            elements.push(
              <ImageBlock 
                key={`image-${i}`} 
                rawContent={codeContent} 
                readerTheme={readerTheme} 
                renderInteractiveText={renderInteractiveText} 
              />
            );
          } else if (trimmedCodeType === "infographic") {
            elements.push(
              <InfographicBlock 
                key={`infographic-${i}`} 
                rawContent={codeContent} 
                readerTheme={readerTheme} 
                renderInteractiveText={renderInteractiveText} 
              />
            );
          } else {
            elements.push(
              <pre key={`code-${i}`} className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 my-4 shadow-sm select-text">
                <code>{codeContent}</code>
              </pre>
            );
          }
          codeContent = "";
          codeBlockType = "";
          insideCodeBlock = false;
        } else {
          insideCodeBlock = true;
          codeBlockType = line.substring(3).trim();
        }
        continue;
      }

      if (insideCodeBlock) {
        codeContent += line + "\n";
        continue;
      }

      // Tables -> Replaced with interactive responsive comparisons
      if (line.startsWith("|")) {
        insideTable = true;
        const cols = line
          .split("|")
          .map((c) => c.trim())
          .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
        
        if (!cols.every((c) => /^[-:|]+$/.test(c))) {
          tableRows.push(cols);
        }
        continue;
      } else if (insideTable) {
        if (tableRows.length > 0) {
          const headers = tableRows[0];
          const dataRows = tableRows.slice(1);
          
          if (!isRevisionMode || tableRows.some(row => row.some(cell => matchesRevision(cell)))) {
            elements.push(
              <InteractiveComparison 
                key={`table-${i}`}
                headers={headers}
                rows={dataRows}
                renderInteractiveText={renderInteractiveText}
                readerTheme={readerTheme}
              />
            );
          }
        }
        tableRows = [];
        insideTable = false;
      }

      if (!line.trim()) continue;

      // Callout Detection & Render
      const lowerLine = line.trim().toLowerCase();
      const isBlockquote = line.startsWith("> ");
      const rawContent = isBlockquote ? line.substring(2).trim() : line.trim();

      if (
        isBlockquote ||
        rawContent.toLowerCase().startsWith("definition:") ||
        rawContent.toLowerCase().startsWith("important:") ||
        rawContent.toLowerCase().startsWith("warning:") ||
        rawContent.toLowerCase().startsWith("css tip:") ||
        rawContent.toLowerCase().startsWith("exam tip:") ||
        rawContent.toLowerCase().startsWith("example:") ||
        rawContent.toLowerCase().startsWith("quote:")
      ) {
        let type = "quote";
        let title = "Quote / Insight";
        let emoji = "❝";
        let cardClass = "";

        if (rawContent.toLowerCase().startsWith("definition:") || rawContent.toLowerCase().includes("defined as")) {
          type = "definition";
          title = "Core Definition";
          emoji = "💡";
          cardClass = {
            light: "bg-teal-50/75 border-teal-500/80 text-teal-950",
            sepia: "bg-[#ECE2C6]/80 border-teal-700/60 text-[#1E3A3A]",
            dark: "bg-teal-950/40 border-teal-500/80 text-teal-100"
          }[readerTheme];
        } else if (rawContent.toLowerCase().startsWith("important:") || rawContent.toLowerCase().startsWith("warning:") || rawContent.toLowerCase().includes("critical:")) {
          type = "important";
          title = "Exam Critical Information";
          emoji = "⚠";
          cardClass = {
            light: "bg-rose-50/75 border-rose-500/80 text-rose-950 font-medium",
            sepia: "bg-[#EAD6D6]/80 border-rose-700/60 text-[#4C1D1D] font-medium",
            dark: "bg-rose-950/40 border-rose-500/80 text-rose-100 font-medium"
          }[readerTheme];
        } else if (rawContent.toLowerCase().startsWith("css tip:") || rawContent.toLowerCase().startsWith("exam tip:") || rawContent.toLowerCase().startsWith("tip:")) {
          type = "csstip";
          title = "FPSC High-Scoring Tip";
          emoji = "🎯";
          cardClass = {
            light: "bg-amber-50/75 border-amber-500/80 text-amber-950 font-semibold",
            sepia: "bg-[#ECDDB8]/80 border-amber-700/60 text-[#4D3319] font-semibold",
            dark: "bg-amber-950/40 border-amber-500/80 text-amber-100 font-semibold"
          }[readerTheme];
        } else if (rawContent.toLowerCase().startsWith("example:")) {
          type = "example";
          title = "Academic Case Study / Example";
          emoji = "📖";
          cardClass = {
            light: "bg-blue-50/75 border-blue-500/80 text-blue-950",
            sepia: "bg-[#DAE5EC]/80 border-blue-700/60 text-[#1E3A52]",
            dark: "bg-blue-950/40 border-blue-500/80 text-blue-100"
          }[readerTheme];
        } else {
          cardClass = {
            light: "bg-indigo-50/75 border-indigo-500/80 text-indigo-950",
            sepia: "bg-[#DFD4BF]/80 border-indigo-700/60 text-[#2B1B0F]",
            dark: "bg-indigo-950/40 border-indigo-500/80 text-slate-200"
          }[readerTheme];
        }

        const cleanTextContent = rawContent.replace(/^(definition|important|warning|css tip|exam tip|tip|example|quote):\s*/i, "");

        if (isRevisionMode) {
          const isDef = type === "definition";
          const isQt = type === "quote" || isBlockquote;
          const matchesText = matchesRevision(cleanTextContent);
          
          if (!isDef && !isQt && !matchesText) {
            continue; // Skip callout if it doesn't represent revision criteria
          }
        }

        elements.push(
          <div key={`callout-${i}`} className={`border-l-4 p-5 rounded-r-2xl my-5 shadow-sm transition-all hover:shadow-md ${cardClass}`}>
            <div className="flex items-center gap-1.5 font-bold font-display text-[10px] uppercase tracking-wider mb-1.5 opacity-90">
              <span>{emoji}</span> {title}
            </div>
            <div className="text-sm font-sans leading-relaxed">
              {renderTextWithMath(cleanTextContent, renderInteractiveText, "font-sans leading-relaxed", fontSize - 2, i, readerTheme)}
            </div>
          </div>
        );
        continue;
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className={`font-serif font-extrabold text-3xl sm:text-4xl ${headingColorClass} border-b pb-3 mt-8 mb-5 tracking-tight leading-tight select-text`}>
            {renderTextWithMath(line.substring(2), renderInteractiveText, headingColorClass, fontSize + 8, i, readerTheme)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className={`font-serif font-bold text-2xl ${subHeadingColorClass} mt-8 mb-4 tracking-tight border-l-4 border-indigo-600 pl-3 select-text`}>
            {renderTextWithMath(line.substring(3), renderInteractiveText, subHeadingColorClass, fontSize + 4, i, readerTheme)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className={`font-sans font-bold text-lg ${subHeadingColorClass} mt-6 mb-3 select-text`}>
            {renderTextWithMath(line.substring(4), renderInteractiveText, subHeadingColorClass, fontSize + 2, i, readerTheme)}
          </h3>
        );
      } else if (line.startsWith("* ") || line.startsWith("- ")) {
        const itemContent = line.substring(2);
        if (isRevisionMode && !matchesRevision(itemContent)) {
          continue;
        }
        elements.push(
          <li key={i} className={`ml-6 list-disc ${bodyColorClass} font-sans leading-relaxed mb-2 text-base select-text`}>
            {renderTextWithMath(itemContent, renderInteractiveText, bodyColorClass, fontSize, i, readerTheme)}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        const dotIdx = line.indexOf(".");
        const itemContent = line.substring(dotIdx + 2);
        if (isRevisionMode && !matchesRevision(itemContent)) {
          continue;
        }
        elements.push(
          <li key={i} className={`ml-6 list-decimal ${bodyColorClass} font-sans leading-relaxed mb-2 text-base select-text`}>
            {renderTextWithMath(itemContent, renderInteractiveText, bodyColorClass, fontSize, i, readerTheme)}
          </li>
        );
      } else {
        // Standard Paragraph
        if (isRevisionMode && !matchesRevision(line)) {
          continue;
        }
        elements.push(
          <div key={i} className={`${bodyColorClass} mb-5 select-text`} style={{ fontSize: `${fontSize}px` }}>
            {renderTextWithMath(line, renderInteractiveText, bodyColorClass, fontSize, i, readerTheme)}
          </div>
        );
      }
    }

    return elements;
  }, [note.content, searchQuery, fontSize, readerTheme, readingMode]);

  // AI Tutor submit question
  const handleAskAiTutor = async () => {
    if (!aiTutorInput.trim()) return;
    const userQuery = aiTutorInput;
    setAiTutorInput("");
    setAiChatLogs(prev => [...prev, { sender: "user", text: userQuery }]);
    setIsAiTutorLoading(true);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: note.title,
          content: note.content,
          question: userQuery
        })
      });
      const data = await res.json();
      setAiChatLogs(prev => [...prev, { sender: "ai", text: data.answer || "Sorry, I had trouble formulating a response." }]);
    } catch (e: any) {
      setAiChatLogs(prev => [...prev, { sender: "ai", text: `Failed to query AI Tutor: ${e.message || "Unknown error."}` }]);
    } finally {
      setIsAiTutorLoading(false);
    }
  };

  const handleCalculatorPress = (val: string) => {
    if (val === "C") {
      setCalcInput("");
      setCalcResult("");
    } else if (val === "=") {
      try {
        // Safe evaluation pattern
        const sanitized = calcInput.replace(/[^0-9+\-*/().%]/g, "");
        const evalResult = Function(`"use strict"; return (${sanitized})`)();
        setCalcResult(String(evalResult));
      } catch {
        setCalcResult("Math Error");
      }
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  // Quick quiz grading
  const gradeQuiz = () => {
    let score = 0;
    mockQuizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        score += 1;
      }
    });
    setQuizScore(score);
  };

  const themeContainerBg = {
    light: isFullscreen ? "bg-[#F8F9FA]" : "bg-slate-50",
    sepia: "bg-[#FAF6EC]",
    dark: isFullscreen ? "bg-[#090B10]" : "bg-[#0B0D13]"
  }[readerTheme];

  const themeCardBg = {
    light: "bg-white border-slate-200/80 shadow-sm",
    sepia: "bg-[#F5ECD8] border-[#E8DAB7] shadow-sm",
    dark: "bg-[#131722] border-slate-800 shadow-xl"
  }[readerTheme];

  return (
    <div className={`w-full transition-colors duration-300 min-h-screen ${themeContainerBg} ${
      isFullscreen 
        ? "fixed inset-0 z-50 overflow-y-auto px-4 sm:px-8 md:px-16 py-8" 
        : readingMode === "focus" ? "pt-4" : "pt-2 pb-16 px-4"
    }`}>

      {/* Fullscreen Study Mode Top Floating Toolbar */}
      {isFullscreen && (
        <div className="mb-6 bg-slate-900 text-white rounded-2xl shadow-xl p-4 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800/80 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl shrink-0">
              <Book className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Immersive Fullscreen Study Mode</span>
              <h3 className="font-serif font-black text-white text-base sm:text-lg tracking-tight leading-none mt-0.5">{note.title}</h3>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            {/* Font settings in Fullscreen */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 p-1 rounded-xl text-xs shrink-0">
              {/* Font Family selector */}
              <div className="flex items-center gap-1 bg-slate-950/40 rounded-lg p-0.5">
                <button
                  onClick={() => setFontFamily("serif")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${fontFamily === "serif" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Serif
                </button>
                <button
                  onClick={() => setFontFamily("sans")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${fontFamily === "sans" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Sans
                </button>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-1 bg-slate-950/40 rounded-lg p-0.5">
                <button
                  onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                  className="w-5 h-5 rounded flex items-center justify-center font-bold text-slate-400 hover:bg-slate-700 hover:text-white"
                  title="Decrease size"
                >
                  A-
                </button>
                <span className="px-1 font-mono font-bold text-slate-300 text-[10px]">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
                  className="w-5 h-5 rounded flex items-center justify-center font-bold text-slate-400 hover:bg-slate-700 hover:text-white"
                  title="Increase size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Line Height Selector in Fullscreen */}
            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/60 p-1 rounded-xl text-xs shrink-0">
              <button
                onClick={() => setLineHeight(1.55)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${lineHeight === 1.55 ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                title="Tight lines"
              >
                Tight
              </button>
              <button
                onClick={() => setLineHeight(1.85)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${lineHeight === 1.85 ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                title="Comfortable lines"
              >
                Comfort
              </button>
              <button
                onClick={() => setLineHeight(2.15)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${lineHeight === 2.15 ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                title="Spacious lines"
              >
                Spacious
              </button>
            </div>

            {/* Theme Settings in Fullscreen */}
            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/60 p-1 rounded-xl text-xs shrink-0">
              <button
                onClick={() => setReaderTheme("light")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${readerTheme === "light" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Light
              </button>
              <button
                onClick={() => setReaderTheme("sepia")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${readerTheme === "sepia" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Sepia
              </button>
              <button
                onClick={() => setReaderTheme("dark")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${readerTheme === "dark" ? "bg-slate-700 text-white border border-slate-600" : "text-slate-400 hover:text-slate-200"}`}
              >
                Dark
              </button>
            </div>

            {/* Dictionary Lookup Toggle in Fullscreen */}
            <button
              onClick={() => setWordLookupEnabled(prev => !prev)}
              className={`px-2.5 py-1.5 text-[10px] font-bold font-sans border rounded-xl transition-all flex items-center gap-1 bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white ${
                wordLookupEnabled ? "bg-emerald-600 border-emerald-500 text-white!" : ""
              }`}
              title="Toggle dictionary lookup"
            >
              <span>🔍 Dictionary</span>
              <span className={`w-1.5 h-1.5 rounded-full ${wordLookupEnabled ? "bg-white" : "bg-slate-500"}`} />
            </button>

            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors uppercase tracking-wider"
              title="Press Esc to exit"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Fullscreen</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Search Header and Reading Mode Selector Panel (hidden in focus mode or fullscreen) */}
      {readingMode !== "focus" && !isFullscreen && (
        <div className="mb-6 bg-white border border-slate-200/85 rounded-2xl shadow-sm p-4 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <Book className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif font-extrabold text-slate-900 text-sm">{note.subjectName}</h3>
              <p className="text-[11px] text-slate-400 font-sans">{note.category} • {note.length}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Reading Modes Tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 rounded-xl p-1 font-sans">
              <button
                onClick={() => setReadingMode("reading")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${readingMode === "reading" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                title="Clean serif Kindle layout"
              >
                📖 Reading
              </button>
              <button
                onClick={() => setReadingMode("study")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${readingMode === "study" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                title="Standard view with sidebars"
              >
                📚 Study
              </button>
              <button
                onClick={() => setReadingMode("revision")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${readingMode === "revision" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                title="Bright summaries & highlights"
              >
                🎯 Revision
              </button>
              <button
                onClick={() => setReadingMode("exam")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${readingMode === "exam" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                title="Past questions & writing workspace"
              >
                📝 Exam Practice
              </button>
              <button
                onClick={() => setReadingMode("focus")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${readingMode === "focus" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                title="Full screen distraction-free"
              >
                👁 Focus
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md rounded-xl text-xs font-bold font-sans transition-all border border-indigo-600 shadow-sm"
              title="Maximize and read notes in fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Workspace */}
      <div className={`max-w-7xl mx-auto grid grid-cols-1 ${(readingMode === "study" && !isFullscreen) ? "lg:grid-cols-4" : ""} gap-6`}>
        
        {/* Dynamic Left/Centered Content Panel */}
        <div className={`${readingMode === "study" ? "lg:col-span-3" : "w-full"} space-y-6`}>
          
          {/* Main Book Reader Frame */}
          <div 
            ref={notesContainerRef}
            className={`border rounded-3xl overflow-hidden transition-all duration-300 ${themeCardBg} ${
              isFullscreen 
                ? "p-8 md:p-14 max-w-4xl mx-auto shadow-2xl" 
                : readingMode === "focus" ? "border-none shadow-none max-w-[760px] mx-auto bg-transparent" : "p-6 sm:p-8 md:p-10"
            }`}
          >
            {/* Kindle typography container width constraint */}
            <div className={`mx-auto ${(readingMode === "reading" || readingMode === "focus" || isFullscreen) ? "max-w-[760px]" : "w-full"}`}>
              
              {/* Note meta information */}
              {readingMode !== "focus" && (
                <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-50 border border-indigo-100 text-indigo-700">
                        {note.style}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-50 border border-amber-100 text-amber-800">
                        {note.length}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-50 border border-emerald-100 text-emerald-800">
                        FPSC Optimized
                      </span>
                      {note.model && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-50 border border-purple-100 text-purple-800">
                          🤖 {note.model}
                        </span>
                      )}
                    </div>
                    <h1 className={`font-serif font-black text-3xl sm:text-4xl tracking-tight leading-tight transition-colors ${
                      readerTheme === "dark" ? "text-slate-50" : readerTheme === "sepia" ? "text-[#2B1B0F]" : "text-slate-900"
                    }`}>
                      {note.title}
                    </h1>
                  </div>

                  {/* Top settings and visual customization bar */}
                  <div className={`flex flex-wrap items-center gap-2 p-2 rounded-2xl shrink-0 border transition-all duration-300 ${
                    readerTheme === "dark" 
                      ? "bg-[#1E222D] border-slate-800 text-slate-100" 
                      : readerTheme === "sepia"
                      ? "bg-[#EFE5C9] border-[#E8DAB7] text-[#433422]"
                      : "bg-slate-50 border-slate-150 text-slate-700"
                  }`}>
                    {/* Font Family selector */}
                    <div className={`flex items-center gap-1 border rounded-xl p-0.5 ${
                      readerTheme === "dark" ? "bg-[#131722]/80 border-slate-800" : "bg-white border-slate-200/60"
                    }`}>
                      <button
                        onClick={() => setFontFamily("serif")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${
                          fontFamily === "serif" 
                            ? "bg-slate-900 text-white shadow-xs" 
                            : readerTheme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Serif typography"
                      >
                        Serif
                      </button>
                      <button
                        onClick={() => setFontFamily("sans")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${
                          fontFamily === "sans" 
                            ? "bg-slate-900 text-white shadow-xs" 
                            : readerTheme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Sans typography"
                      >
                        Sans
                      </button>
                    </div>

                    {/* Font Size Selector */}
                    <div className={`flex items-center gap-1 border rounded-xl p-0.5 ${
                      readerTheme === "dark" ? "bg-[#131722]/80 border-slate-800" : "bg-white border-slate-200/60"
                    }`}>
                      <button
                        onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          readerTheme === "dark" ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Smaller text"
                      >
                        A-
                      </button>
                      <span className={`px-1 font-mono font-bold text-[10px] ${
                        readerTheme === "dark" ? "text-slate-300" : "text-slate-700"
                      }`}>{fontSize}px</span>
                      <button
                        onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          readerTheme === "dark" ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Larger text"
                      >
                        A+
                      </button>
                    </div>

                    {/* Line Height Selector */}
                    <div className={`flex items-center gap-1 border rounded-xl p-0.5 ${
                      readerTheme === "dark" ? "bg-[#131722]/80 border-slate-800" : "bg-white border-slate-200/60"
                    }`}>
                      <button
                        onClick={() => setLineHeight(1.55)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${
                          lineHeight === 1.55 
                            ? "bg-slate-900 text-white shadow-xs" 
                            : readerTheme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Tight line spacing"
                      >
                        Tight
                      </button>
                      <button
                        onClick={() => setLineHeight(1.85)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${
                          lineHeight === 1.85 
                            ? "bg-slate-900 text-white shadow-xs" 
                            : readerTheme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Comfortable line spacing"
                      >
                        Comfort
                      </button>
                      <button
                        onClick={() => setLineHeight(2.15)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${
                          lineHeight === 2.15 
                            ? "bg-slate-900 text-white shadow-xs" 
                            : readerTheme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Spacious line spacing"
                      >
                        Spacious
                      </button>
                    </div>

                    {/* Theme Controller */}
                    <div className={`flex items-center gap-1 border rounded-xl p-0.5 ${
                      readerTheme === "dark" ? "bg-[#131722]/80 border-slate-800" : "bg-white border-slate-200/60"
                    }`}>
                      <button
                        onClick={() => setReaderTheme("light")}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${
                          readerTheme === "light" 
                            ? "bg-slate-900 text-white shadow-xs" 
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Light Theme"
                      >
                        ☀️ Light
                      </button>
                      <button
                        onClick={() => setReaderTheme("sepia")}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${
                          readerTheme === "sepia" 
                            ? "bg-amber-600 text-white shadow-xs" 
                            : readerTheme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-[#433422]"
                        }`}
                        title="Warm Sepia Theme"
                      >
                        ☕ Sepia
                      </button>
                      <button
                        onClick={() => setReaderTheme("dark")}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold font-sans transition-all ${
                          readerTheme === "dark" 
                            ? "bg-slate-700 text-white border border-slate-600 shadow-xs" 
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Night Dark Theme"
                      >
                        🌙 Dark
                      </button>
                    </div>

                    {/* Dictionary Lookup Toggle */}
                    <button
                      onClick={() => setWordLookupEnabled(prev => !prev)}
                      className={`px-2.5 py-1 text-[10px] font-bold font-sans border rounded-xl transition-all flex items-center gap-1 ${
                        wordLookupEnabled 
                          ? "bg-emerald-600 border-emerald-500 text-white" 
                          : readerTheme === "dark" 
                          ? "bg-[#131722]/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" 
                          : "bg-white border-slate-200/60 text-slate-600 hover:bg-slate-100"
                      }`}
                      title="Toggle interactive dictionary lookup for all words (minimizes hover distractions)"
                    >
                      <span>🔍 Dictionary Lookup</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${wordLookupEnabled ? "bg-white animate-pulse" : "bg-slate-400"}`} />
                    </button>

                    {/* Bookmark action */}
                    <button
                      onClick={onToggleBookmark}
                      className={`p-1.5 border rounded-xl transition-colors ${
                        readerTheme === "dark" 
                          ? "bg-[#131722]/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800" 
                          : "bg-white border-slate-200/60 text-slate-600 hover:bg-slate-100"
                      }`}
                      title="Bookmark this note"
                    >
                      <Bookmark className={`w-4 h-4 ${note.bookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>

                    {/* Fullscreen action */}
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className={`p-1.5 border rounded-xl transition-all flex items-center gap-1.5 ${
                        readerTheme === "dark" 
                          ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700" 
                          : "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
                      }`}
                      title="Read note in fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold font-sans uppercase tracking-wider hidden sm:inline">Fullscreen</span>
                    </button>
                  </div>
                </div>
              )}

              {/* In-Note Interactive Timeline Component */}
              {chronologicalEvents.length >= 2 && readingMode !== "focus" && (
                <DynamicTimeline 
                  noteContent={note.content} 
                  renderInteractiveText={renderInteractiveText} 
                />
              )}

              {/* In-Note Search Bar Component */}
              {readingMode !== "focus" && (
                <div className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search inside active study notes..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setActiveMatchIdx(0);
                      }}
                      className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    />
                  </div>
                  {searchQuery && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {totalMatches > 0 ? `${activeMatchIdx + 1}/${totalMatches}` : "0"} matches
                      </span>
                      <button
                        onClick={handlePrevMatch}
                        className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Prev match"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleNextMatch}
                        className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Next match"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mindmap visual overlay */}
              {readingMode === "study" && (
                <div className="mb-6">
                  <InteractiveMindmap 
                    noteContent={note.content}
                    onHeadingClick={(headingText) => jumpToTerm(headingText)}
                  />
                </div>
              )}

              {/* Canvas of parsed markdown elements */}
              <div 
                className={`notes-rendered-canvas select-text tracking-wide ${
                  fontFamily === "serif" ? "font-serif" : fontFamily === "mono" ? "font-mono" : "font-sans"
                } ${
                  readerTheme === "dark" ? "text-slate-200" : readerTheme === "sepia" ? "text-[#3D2C1E]" : "text-slate-900"
                }`} 
                id="notes-content-canvas"
                style={{ 
                  lineHeight: lineHeight, 
                  fontSize: `${fontSize}px`,
                  color: readerTheme === "dark" ? "#f1f5f9" : readerTheme === "sepia" ? "#3D2C1E" : "#0f172a"
                }}
              >
                {readingMode === "revision" && (
                  <div className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 animate-fade-in ${
                    readerTheme === "dark" 
                      ? "bg-indigo-950/25 border-indigo-900/50 text-indigo-200" 
                      : readerTheme === "sepia"
                      ? "bg-[#ECDDB8]/45 border-[#D6C49E] text-[#5C401F]"
                      : "bg-indigo-50/75 border-indigo-100 text-indigo-950"
                  }`}>
                    <div className="bg-indigo-600 text-white p-2 rounded-xl shrink-0 mt-0.5">
                      <Zap className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs uppercase tracking-wider font-sans">Revision Filter Active</h4>
                      <p className="text-[11px] opacity-90 font-sans leading-relaxed">
                        Showing only critical **Definitions**, **Historical Dates**, **Key Personalities**, and **Expert Quotations** to streamline your CSS exams preparation.
                      </p>
                    </div>
                  </div>
                )}
                {parsedElements}
              </div>

              {/* Focus Mode floating layout toolbar */}
              {readingMode === "focus" && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 border border-slate-700/80">
                  <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
                    <button
                      onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                      title="Decrease text size"
                    >
                      A-
                    </button>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{fontSize}px</span>
                    <button
                      onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                      title="Increase text size"
                    >
                      A+
                    </button>
                  </div>

                  <div className="flex items-center gap-1 border-r border-slate-800 pr-3">
                    <button
                      onClick={() => setFontFamily("serif")}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${fontFamily === "serif" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
                    >
                      Serif
                    </button>
                    <button
                      onClick={() => setFontFamily("sans")}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${fontFamily === "sans" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
                    >
                      Sans
                    </button>
                  </div>

                  <button
                    onClick={() => setReadingMode("study")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 rounded-full text-[10px] font-bold text-white transition-all uppercase tracking-wider shadow-sm"
                  >
                    <Minimize2 className="w-3.5 h-3.5" /> Exit Focus
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Exam Practice Mode Workspace Split Pane */}
          {readingMode === "exam" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Award className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <h3 className="font-serif font-extrabold text-slate-900 text-sm">CSS FPSC Exam Simulator</h3>
                    <p className="text-[10px] text-slate-400 font-sans">Draft answers alongside standard questions and official timer</p>
                  </div>
                </div>

                {/* Exam Timer Controls */}
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl shrink-0">
                  <div className="px-3 py-1 bg-slate-900 text-emerald-400 font-mono font-bold text-xs rounded-lg shadow">
                    {formatTimer(timerSeconds)}
                  </div>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`p-1.5 rounded-lg transition-colors ${isTimerRunning ? "bg-amber-500 text-white" : "bg-emerald-600 text-white"}`}
                    title={isTimerRunning ? "Pause Timer" : "Start Exam Timer"}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(10800);
                    }}
                    className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-150 rounded-lg"
                    title="Reset timer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Past Questions Outline selection */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-display block">Select Practice Essay/Question</span>
                <div className="space-y-1.5">
                  {mockExamQuestions.map((q, idx) => (
                    <div key={idx} className="text-xs text-slate-800 font-serif font-medium leading-relaxed pl-3 border-l-2 border-amber-300">
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active writing canvas textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display block">Candidate Draft Sheet (auto-saved)</label>
                <textarea
                  value={examScribbles}
                  onChange={(e) => setExamScribbles(e.target.value)}
                  placeholder="Analyze the question prompt above. Draft your structure outline (Introduction, Historical Genesis, Arguments, Critique, Recommendation, and Conclusion)..."
                  rows={12}
                  className="w-full border border-slate-200/85 rounded-xl p-4 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner leading-relaxed"
                />
              </div>
            </motion.div>
          )}

        </div>

        {/* Dynamic Left/Study Term Navigation Sidebar Panel */}
        {readingMode === "study" && (
          <div className="space-y-6">
            
            {/* CSS Syllabus Terms Navigator Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="font-serif font-bold text-slate-900 text-sm">Lexicon Entity Map</h4>
                <p className="text-[10px] text-slate-400 font-sans">Active syllabus concepts detected in this note</p>
              </div>

              {/* Entity Categorized Listings */}
              <div className="space-y-3.5">
                {HIGHLIGHT_CATEGORIES.map((cat, idx) => {
                  // Filter categories that actually appear in this note content
                  const appearingTerms = cat.terms.filter(term => 
                    note.content.toLowerCase().includes(term.toLowerCase())
                  );

                  if (appearingTerms.length === 0) return null;

                  return (
                    <div key={idx} className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-display">
                        {cat.emoji} {cat.name}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {appearingTerms.map((term, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={() => jumpToTerm(term)}
                            className="text-[10px] font-semibold bg-slate-50 border border-slate-200/60 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 px-2 py-0.5 rounded-lg transition-colors font-sans"
                            title={`Jump to ${term}`}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Float Action Tools Shortcut */}
            <button
              onClick={() => setIsToolsDrawerOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all"
            >
              <BrainCircuit className="w-4 h-4 animate-pulse" /> Open Study Tools Drawer
            </button>
          </div>
        )}

      </div>

      {/* Floating study tools trigger for other reading modes */}
      {readingMode !== "focus" && (
        <button
          onClick={() => setIsToolsDrawerOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 group flex items-center gap-2"
          title="Open Study Tools Panel"
        >
          <BrainCircuit className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 font-bold text-xs uppercase tracking-wider whitespace-nowrap">
            Study Tools
          </span>
        </button>
      )}

      {/* Sliding study tools drawer from right */}
      <AnimatePresence>
        {isToolsDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end" id="study-tools-drawer-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsToolsDrawerOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Sliding Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
              id="study-tools-drawer"
            >
              {/* Drawer Header */}
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="font-serif font-black text-slate-900 text-sm">CSS Study Utilities</h3>
                    <p className="text-[10px] text-slate-400 font-sans">Multi-module interactive workspace</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsToolsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-150 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Navigator */}
              <div className="flex items-center overflow-x-auto border-b border-slate-100 bg-slate-50/50 p-1 shrink-0 scrollbar-none">
                <button
                  onClick={() => setToolsActiveTab("flashcards")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors ${toolsActiveTab === "flashcards" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setToolsActiveTab("quiz")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors ${toolsActiveTab === "quiz" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Practice Quiz
                </button>
                <button
                  onClick={() => setToolsActiveTab("aitutor")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors ${toolsActiveTab === "aitutor" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-800"}`}
                >
                  AI Professor
                </button>
                <button
                  onClick={() => setToolsActiveTab("scribbles")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors ${toolsActiveTab === "scribbles" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Scratchpad
                </button>
                <button
                  onClick={() => setToolsActiveTab("calculator")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors ${toolsActiveTab === "calculator" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Calc
                </button>
              </div>

              {/* Drawer Content Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {/* 1. Flashcards Content */}
                {toolsActiveTab === "flashcards" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Active Topic Flashcards</span>
                    <div 
                      onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                      className="w-full min-h-[180px] border border-indigo-100 rounded-2xl bg-indigo-50/20 p-6 flex flex-col items-center justify-center text-center cursor-pointer relative shadow-inner hover:border-indigo-200 transition-all select-none"
                    >
                      <div className="absolute top-2.5 right-3 text-[9px] font-mono font-semibold uppercase text-indigo-400">
                        {isFlashcardFlipped ? "Answer Side" : "Question Side"}
                      </div>
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${activeFlashcardIdx}-${isFlashcardFlipped}`}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="space-y-2"
                        >
                          <p className={`text-slate-800 leading-relaxed font-serif ${isFlashcardFlipped ? "text-xs font-semibold" : "text-sm font-extrabold"}`}>
                            {isFlashcardFlipped 
                              ? mockFlashcards[activeFlashcardIdx]?.back 
                              : mockFlashcards[activeFlashcardIdx]?.front}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      <div className="absolute bottom-2.5 text-[9px] text-slate-400 font-sans">
                        Click card to flip / verify answer
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() => {
                          setIsFlashcardFlipped(false);
                          setActiveFlashcardIdx(prev => (prev - 1 + mockFlashcards.length) % mockFlashcards.length);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-250 text-slate-700 rounded-lg text-xs font-bold font-sans"
                      >
                        Previous Card
                      </button>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {activeFlashcardIdx + 1} / {mockFlashcards.length}
                      </span>
                      <button
                        onClick={() => {
                          setIsFlashcardFlipped(false);
                          setActiveFlashcardIdx(prev => (prev + 1) % mockFlashcards.length);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-250 text-slate-700 rounded-lg text-xs font-bold font-sans"
                      >
                        Next Card
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Practice Quiz Content */}
                {toolsActiveTab === "quiz" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">CSS High Yield Revision MCQs</span>
                    
                    <div className="space-y-5">
                      {mockQuizQuestions.map((item, idx) => (
                        <div key={idx} className="border border-slate-100 rounded-xl p-4.5 bg-slate-50/50 space-y-3">
                          <p className="text-xs font-serif font-extrabold text-slate-900">{idx + 1}. {item.q}</p>
                          <div className="space-y-1.5">
                            {item.opts.map((opt, oIdx) => {
                              const isSelected = quizAnswers[idx] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => setQuizAnswers(prev => ({ ...prev, [idx]: oIdx }))}
                                  className={`w-full text-left text-xs p-2 rounded-lg border font-sans transition-all flex items-center justify-between ${
                                    isSelected 
                                      ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-xs" 
                                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  {opt}
                                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation Toggle */}
                          {quizScore !== null && (
                            <div className="pt-2 border-t border-slate-100 space-y-1.5">
                              <button
                                onClick={() => setShowQuizExpl(prev => ({ ...prev, [idx]: !prev[idx] }))}
                                className="text-[10px] font-bold text-indigo-600 hover:underline font-sans flex items-center gap-1"
                              >
                                {showQuizExpl[idx] ? "Hide Answer Rationale" : "Show Answer Rationale"} <ChevronDown className="w-3 h-3" />
                              </button>
                              {showQuizExpl[idx] && (
                                <p className="text-[11px] text-slate-500 font-sans leading-relaxed p-2 bg-slate-100 rounded-lg border border-slate-200">
                                  <strong>Correct: Answer {String.fromCharCode(65 + item.correct)}.</strong> {item.expl}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      {quizScore !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 font-sans">Final Score:</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                            {quizScore} / {mockQuizQuestions.length}
                          </span>
                        </div>
                      ) : <div />}

                      <button
                        onClick={gradeQuiz}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm uppercase tracking-wider"
                      >
                        Grade Quiz Paper
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. AI Tutor Chat Interface */}
                {toolsActiveTab === "aitutor" && (
                  <div className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto space-y-3 p-1.5 border border-slate-150 rounded-xl bg-slate-50/50">
                      {aiChatLogs.map((log, idx) => (
                        <div key={idx} className={`flex ${log.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed font-sans shadow-sm border ${
                            log.sender === "user" 
                              ? "bg-indigo-600 border-indigo-700 text-white" 
                              : "bg-white border-slate-200 text-slate-800"
                          }`}>
                            {log.text}
                          </div>
                        </div>
                      ))}
                      {isAiTutorLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl px-4 py-2 text-xs leading-relaxed font-sans flex items-center gap-2">
                            <div className="w-2.5 h-2.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            Analyzing CSS grading criteria...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Ask me to summarize, expand, etc..."
                        value={aiTutorInput}
                        onChange={(e) => setAiTutorInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAskAiTutor(); }}
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={handleAskAiTutor}
                        className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Scratchpad Notes Content */}
                {toolsActiveTab === "scribbles" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">Syllabus Topic Scratchpad</span>
                    <textarea
                      value={scribbleText}
                      onChange={(e) => setScribbleText(e.target.value)}
                      placeholder="Write your study plans, outline structures, or key notes for this module..."
                      rows={12}
                      className="w-full border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
                    />
                    <p className="text-[10px] text-slate-400 font-sans italic text-right">Saved automatically to localStorage.</p>
                  </div>
                )}

                {/* 5. Economy & Tax Calculator */}
                {toolsActiveTab === "calculator" && (
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 space-y-3">
                    <div className="bg-slate-900 text-white rounded-xl p-3.5 text-right space-y-1 shadow-inner">
                      <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Formula Math</div>
                      <div className="text-sm font-mono text-slate-300 min-h-[16px] truncate">{calcInput || "0"}</div>
                      <div className="text-xl font-mono font-bold text-emerald-400 truncate">{calcResult || "0"}</div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {/* Calculator Buttons */}
                      {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "%", "+", "C", "=", "(", ")"].map((btn) => (
                        <button
                          key={btn}
                          onClick={() => handleCalculatorPress(btn)}
                          className={`p-2 text-xs font-mono font-bold rounded-xl shadow-xs transition-colors ${
                            btn === "=" 
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white col-span-2" 
                              : btn === "C"
                              ? "bg-rose-500 hover:bg-rose-600 text-white"
                              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {btn}
                        </button>
                      ))}
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 space-y-1">
                      <span className="text-[9px] font-bold text-indigo-800 uppercase tracking-wider block">CSS Standard Formulas</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setCalcInput(prev => prev + "*(1-0.15)")}
                          className="text-[9px] bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded"
                          title="15% discount or depreciation factor"
                        >
                          15% Tax Depr
                        </button>
                        <button
                          onClick={() => setCalcInput(prev => prev + "/100")}
                          className="text-[9px] bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded"
                        >
                          Convert %
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Footer */}
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                <button
                  onClick={() => setIsToolsDrawerOpen(false)}
                  className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all uppercase tracking-wider"
                >
                  Close panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

const COMPARISON_THEMES = {
  light: {
    wrapper: "border-slate-200 bg-slate-50/50",
    input: "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-indigo-500",
    pillBg: "bg-white border-slate-200",
    activePill: "bg-indigo-600 text-white",
    inactivePill: "text-slate-500 hover:text-slate-800",
    tableBg: "bg-white border-slate-200",
    tableHeaderBg: "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200",
    tableCell: "text-slate-600 hover:bg-slate-50/50 border-slate-200",
    cardBg: "bg-white border-slate-200 hover:border-indigo-200",
    cardHeading: "text-slate-900 border-slate-100",
    cardLabel: "text-slate-400",
    cardValue: "text-slate-700",
    emptyState: "text-slate-400"
  },
  sepia: {
    wrapper: "border-[#E8DAB7] bg-[#F5ECD8]/50",
    input: "bg-[#FAF6EC] border-[#E8DAB7] text-[#3D2C1E] placeholder-[#8C765C] focus:ring-amber-700",
    pillBg: "bg-[#FAF6EC] border-[#E8DAB7]",
    activePill: "bg-amber-800 text-white",
    inactivePill: "text-amber-700 hover:text-[#2B1B0F]",
    tableBg: "bg-[#FAF6EC] border-[#E8DAB7]",
    tableHeaderBg: "bg-[#F5ECD8] text-amber-950 hover:bg-[#E8DAB7] border-[#E8DAB7]",
    tableCell: "text-[#3D2C1E] hover:bg-[#F5ECD8]/30 border-[#E8DAB7]",
    cardBg: "bg-[#FAF6EC] border-[#E8DAB7] hover:border-amber-700/50",
    cardHeading: "text-amber-950 border-amber-200/50",
    cardLabel: "text-amber-700/80",
    cardValue: "text-[#3D2C1E]",
    emptyState: "text-amber-700/60"
  },
  dark: {
    wrapper: "border-slate-800 bg-[#131722]/50",
    input: "bg-[#131722] border-slate-800 text-slate-200 placeholder-slate-500 focus:ring-indigo-500",
    pillBg: "bg-[#131722] border-slate-800",
    activePill: "bg-indigo-600 text-white",
    inactivePill: "text-slate-400 hover:text-white",
    tableBg: "bg-[#131722] border-slate-800",
    tableHeaderBg: "bg-slate-900/80 text-slate-300 hover:bg-slate-800/80 border-slate-800",
    tableCell: "text-slate-300 hover:bg-[#131722]/30 border-slate-800",
    cardBg: "bg-[#131722] border-slate-800 hover:border-indigo-500/50",
    cardHeading: "text-slate-100 border-slate-800/80",
    cardLabel: "text-slate-400",
    cardValue: "text-slate-300",
    emptyState: "text-slate-500"
  }
};

// 8. Comparison Table Custom Component
function InteractiveComparison({ 
  headers, 
  rows, 
  renderInteractiveText,
  readerTheme = "light"
}: { 
  key?: React.Key;
  headers: string[]; 
  rows: string[][]; 
  renderInteractiveText: (text: string, contextSentence: string) => React.ReactNode;
  readerTheme?: string;
}) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDesc, setSortDesc] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const filteredRows = useMemo(() => {
    let result = rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(search.toLowerCase()))
    );
    if (sortCol !== null) {
      result = [...result].sort((a, b) => {
        const valA = a[sortCol] || "";
        const valB = b[sortCol] || "";
        return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      });
    }
    return result;
  }, [rows, search, sortCol, sortDesc]);

  const handleSort = (colIndex: number) => {
    if (sortCol === colIndex) {
      setSortDesc(!sortDesc);
    } else {
      setSortCol(colIndex);
      setSortDesc(false);
    }
  };

  const themeStyles = COMPARISON_THEMES[readerTheme as "light" | "sepia" | "dark"] || COMPARISON_THEMES.light;

  return (
    <div className={`border rounded-2xl p-4 my-6 shadow-sm transition-all ${themeStyles.wrapper}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search comparative data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-1 font-sans ${themeStyles.input}`}
          />
        </div>
        <div className={`flex items-center gap-1 border rounded-xl p-1 shrink-0 ${themeStyles.pillBg}`}>
          <button
            onClick={() => setViewMode("table")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
              viewMode === "table" ? themeStyles.activePill : themeStyles.inactivePill
            }`}
          >
            Syllabus Matrix
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
              viewMode === "cards" ? themeStyles.activePill : themeStyles.inactivePill
            }`}
          >
            Comparative Cards
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className={`overflow-x-auto border rounded-xl ${themeStyles.tableBg}`}>
          <table className="min-w-full divide-y divide-slate-200/20">
            <thead className={themeStyles.tableHeaderBg}>
              <tr>
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    onClick={() => handleSort(idx)}
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors border-b border-slate-200/20 select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      {h}
                      {sortCol === idx ? (sortDesc ? "↓" : "↑") : "↕"}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/10 text-sm">
              {filteredRows.map((row, rIdx) => (
                <tr key={rIdx} className="transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className={`px-4 py-3 font-sans font-medium border-b border-slate-200/10 ${themeStyles.tableCell}`}>
                      {renderInteractiveText(cell, cell)}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={headers.length} className={`text-center py-6 font-sans text-xs ${themeStyles.emptyState}`}>
                    No matching entities found in matrix.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredRows.map((row, rIdx) => {
            const heading = row[0] || `Comparison ${rIdx + 1}`;
            return (
              <div key={rIdx} className={`border rounded-xl p-4 shadow-sm space-y-3 transition-all ${themeStyles.cardBg}`}>
                <div className={`font-serif font-bold text-sm border-b pb-2 ${themeStyles.cardHeading}`}>
                  {renderInteractiveText(heading, heading)}
                </div>
                <div className="space-y-2.5">
                  {row.slice(1).map((cell, cIdx) => {
                    const label = headers[cIdx + 1] || "Value";
                    return (
                      <div key={cIdx} className="text-xs flex flex-col gap-0.5 font-sans">
                        <span className={`font-bold uppercase text-[9px] tracking-wider ${themeStyles.cardLabel}`}>{label}</span>
                        <div className={`font-medium leading-relaxed ${themeStyles.cardValue}`}>
                          {renderInteractiveText(cell, cell)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {filteredRows.length === 0 && (
            <div className={`col-span-full text-center py-12 border rounded-xl text-sans text-xs ${themeStyles.cardBg} ${themeStyles.emptyState}`}>
              No matching elements found in cards.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 7. Timeline Component custom horizontal scroll component
function DynamicTimeline({ 
  noteContent, 
  renderInteractiveText 
}: { 
  noteContent: string; 
  renderInteractiveText: (t: string, s: string) => React.ReactNode;
}) {
  const events = useMemo(() => {
    const list: Array<{ year: number; yearStr: string; text: string; fullLine: string }> = [];
    const lines = noteContent.split("\n");
    const yearRegex = /\b(1[789]\d{2}|20\d{2})\b/g;

    lines.forEach((line) => {
      const cleanLine = line.replace(/^[#*>\-\d.\s]+/g, "").trim();
      if (cleanLine.length < 10 || line.startsWith("#")) return;

      let match;
      const matchedYearsInLine: string[] = [];
      while ((match = yearRegex.exec(line)) !== null) {
        matchedYearsInLine.push(match[1]);
      }

      const uniqueYears = [...new Set(matchedYearsInLine)];
      uniqueYears.forEach((yrStr) => {
        const yr = parseInt(yrStr, 10);
        list.push({
          year: yr,
          yearStr: yrStr,
          text: cleanLine.length > 110 ? cleanLine.substring(0, 107) + "..." : cleanLine,
          fullLine: cleanLine
        });
      });
    });

    const sorted = list.sort((a, b) => a.year - b.year);
    const seenYears = new Set<number>();
    return sorted.filter((ev) => {
      if (seenYears.has(ev.year)) return false;
      seenYears.add(ev.year);
      return true;
    });
  }, [noteContent]);

  if (events.length < 2) return null;

  return (
    <div className="border border-slate-200 rounded-2xl bg-white p-5 my-6 shadow-xs select-none">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-serif font-extrabold text-slate-900 text-sm">Interactive Syllabus Timeline</h4>
          <p className="text-[10px] text-slate-400 font-sans font-medium">Auto-extracted chronological landmarks. Click terms below for lookup.</p>
        </div>
      </div>

      <div className="relative flex items-stretch gap-6 overflow-x-auto pb-4 pt-2 px-2 scrollbar-thin">
        {/* Horizontal connection rule */}
        <div className="absolute top-[34px] left-0 right-0 h-1 bg-indigo-100 rounded z-0" />

        {events.map((ev, idx) => (
          <div key={idx} className="relative flex flex-col items-center min-w-[200px] max-w-[240px] text-center z-10 group">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border-4 border-white group-hover:border-indigo-100 shadow-md flex items-center justify-center text-xs font-mono font-bold text-indigo-700 group-hover:scale-110 transition-all cursor-pointer">
              {ev.yearStr}
            </div>

            <div className="mt-3 bg-slate-50 border border-slate-100 p-3 rounded-xl shadow-xs text-[11px] text-slate-600 font-sans leading-relaxed group-hover:bg-indigo-50/20 group-hover:border-indigo-100 transition-all text-left">
              <div className="font-bold text-indigo-950 font-sans mb-1 text-[9px] uppercase tracking-wider">Chronology</div>
              {renderInteractiveText(ev.text, ev.fullLine)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 11. Interactive Mindmap/Hierarchical Outline Visualizer
function InteractiveMindmap({ 
  noteContent, 
  onHeadingClick 
}: { 
  noteContent: string; 
  onHeadingClick: (text: string) => void;
}) {
  const nodes = useMemo(() => {
    const list: { id: string; label: string; level: number; parentId: string | null }[] = [];
    const lines = noteContent.split("\n");
    let lastH1Id: string | null = null;
    let lastH2Id: string | null = null;

    lines.forEach((line, idx) => {
      const cleanText = line.replace(/^[#\s]+/g, "").trim();
      if (!cleanText) return;

      const nodeId = `node-${idx}`;
      if (line.startsWith("# ")) {
        list.push({ id: nodeId, label: cleanText, level: 1, parentId: null });
        lastH1Id = nodeId;
        lastH2Id = null;
      } else if (line.startsWith("## ")) {
        list.push({ id: nodeId, label: cleanText, level: 2, parentId: lastH1Id });
        lastH2Id = nodeId;
      } else if (line.startsWith("### ")) {
        list.push({ id: nodeId, label: cleanText, level: 3, parentId: lastH2Id || lastH1Id });
      }
    });

    return list;
  }, [noteContent]);

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  if (nodes.length === 0) return null;

  return (
    <div className="border border-slate-200 rounded-2xl bg-slate-50/50 p-5 my-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
          <BrainCircuit className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-serif font-extrabold text-slate-900 text-sm">Interactive Syllabus Mindmap</h4>
          <p className="text-[10px] text-slate-400 font-sans font-medium">Visual structured outline tree of this note module. Click any node to navigate.</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-xl overflow-hidden min-h-[300px]">
        {/* Render hierarchical branches */}
        <div className="space-y-6 w-full max-w-lg">
          {/* Level 1 Node (Note Root) */}
          {nodes.filter(n => n.level === 1).map((root) => (
            <div key={root.id} className="flex flex-col items-center space-y-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  setActiveNodeId(root.id);
                  onHeadingClick(root.label);
                }}
                className={`px-4 py-2 rounded-xl text-center font-serif font-bold text-sm shadow-md transition-all border ${
                  activeNodeId === root.id 
                    ? "bg-indigo-600 border-indigo-700 text-white" 
                    : "bg-indigo-50 border-indigo-200 text-indigo-950"
                }`}
              >
                🎓 {root.label}
              </motion.button>

              {/* Connections down to level 2 */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nodes.filter(n => n.parentId === root.id && n.level === 2).map((h2) => (
                  <div key={h2.id} className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex flex-col items-center space-y-2 hover:border-indigo-200 transition-all">
                    <button
                      onClick={() => {
                        setActiveNodeId(h2.id);
                        onHeadingClick(h2.label);
                      }}
                      className={`px-3 py-1 bg-white border rounded-lg text-xs font-sans font-bold text-left transition-all ${
                        activeNodeId === h2.id 
                          ? "bg-indigo-600 border-indigo-600 text-white" 
                          : "border-slate-200 text-slate-800 hover:bg-slate-50 shadow-xs"
                      }`}
                    >
                      🔹 {h2.label}
                    </button>

                    {/* Level 3 children */}
                    <div className="w-full space-y-1.5 pl-3 border-l border-indigo-100">
                      {nodes.filter(n => n.parentId === h2.id && n.level === 3).map((h3) => (
                        <button
                          key={h3.id}
                          onClick={() => {
                            setActiveNodeId(h3.id);
                            onHeadingClick(h3.label);
                          }}
                          className={`w-full text-left text-[11px] font-sans font-semibold py-1 px-2 rounded hover:bg-white border border-transparent transition-all truncate block ${
                            activeNodeId === h3.id 
                              ? "bg-indigo-50 text-indigo-800 font-bold border-indigo-100" 
                              : "text-slate-500 hover:text-indigo-600"
                          }`}
                          title={h3.label}
                        >
                          ▪ {h3.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Custom Rich Study Visual Block Components
// --------------------------------------------------------

function TimelineBlock({ 
  rawContent, 
  readerTheme,
  renderInteractiveText 
}: { 
  key?: any;
  rawContent: string; 
  readerTheme: string;
  renderInteractiveText: (t: string, s: string) => React.ReactNode;
}) {
  const items = useMemo(() => {
    return rawContent.split("\n")
      .map(line => line.trim())
      .filter(line => line.includes("|"))
      .map(line => {
        const parts = line.split("|").map(p => p.trim());
        return {
          year: parts[0] || "",
          title: parts[1] || "",
          description: parts[2] || ""
        };
      });
  }, [rawContent]);

  if (items.length === 0) return null;

  const bgClass = {
    light: "bg-slate-50 border-slate-200",
    sepia: "bg-[#F4ECD8] border-[#E8DAB7]",
    dark: "bg-[#131722] border-slate-800"
  }[readerTheme] || "bg-slate-50 border-slate-200";

  return (
    <div className={`border rounded-2xl p-6 my-6 shadow-xs text-left ${bgClass}`}>
      <div className="flex items-center gap-2 mb-5">
        <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Milestone className="w-4 h-4" />
        </span>
        <h4 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">Chronological Historical Timeline</h4>
      </div>
      <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-3.5 pl-6 space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline dot */}
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-400 group-hover:scale-125 transition-transform z-10 shadow-xs" />
            <div className="space-y-1 text-left select-text">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900/80 text-indigo-700 dark:text-indigo-300">
                {item.year}
              </span>
              <h5 className="font-serif font-extrabold text-slate-900 dark:text-slate-50 text-sm leading-snug">
                {renderInteractiveText(item.title, item.title)}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                {renderInteractiveText(item.description, item.description)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowchartBlock({
  rawContent,
  readerTheme,
  renderInteractiveText
}: {
  key?: any;
  rawContent: string;
  readerTheme: string;
  renderInteractiveText: (t: string, s: string) => React.ReactNode;
}) {
  const steps = useMemo(() => {
    return rawContent.split("\n")
      .map(line => line.trim())
      .filter(line => line.includes("|"))
      .map(line => {
        const parts = line.split("|").map(p => p.trim());
        return {
          title: parts[0] || "",
          subtitle: parts[1] || "",
          desc: parts[2] || ""
        };
      });
  }, [rawContent]);

  if (steps.length === 0) return null;

  const arrowColor = {
    light: "text-indigo-300",
    sepia: "text-[#D1BFA0]",
    dark: "text-indigo-900"
  }[readerTheme] || "text-indigo-300";

  return (
    <div className="my-6 space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="p-1 bg-teal-50 dark:bg-teal-950/60 rounded text-teal-600 dark:text-teal-400">
          <Layers className="w-3.5 h-3.5" />
        </span>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display">Process Flow & Cause-Effect Loop</span>
      </div>
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-4">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`flex-1 border rounded-2xl p-4.5 text-left shadow-xs transition-all hover:shadow-md hover:border-indigo-400/50 ${
              readerTheme === "dark" 
                ? "bg-[#131722] border-slate-800 text-slate-200" 
                : readerTheme === "sepia"
                ? "bg-[#F5ECD8] border-[#E8DAB7] text-[#3D2C1E]"
                : "bg-white border-slate-200/80 text-slate-800"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300">
                  Stage {idx + 1}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{step.subtitle}</span>
              </div>
              <h5 className="font-serif font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                {renderInteractiveText(step.title, step.title)}
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                {renderInteractiveText(step.desc, step.desc)}
              </p>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex items-center justify-center py-2 md:py-0 shrink-0">
                <span className={`text-xl font-bold font-mono rotate-90 md:rotate-0 ${arrowColor}`}>➜</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function MapBlock({
  rawContent,
  readerTheme,
  renderInteractiveText
}: {
  key?: any;
  rawContent: string;
  readerTheme: string;
  renderInteractiveText: (t: string, s: string) => React.ReactNode;
}) {
  const places = useMemo(() => {
    return rawContent.split("\n")
      .map(line => line.trim())
      .filter(line => line.includes("|"))
      .map(line => {
        const parts = line.split("|").map(p => p.trim());
        return {
          name: parts[0] || "",
          coords: parts[1] || "",
          dynamics: parts[2] || ""
        };
      });
  }, [rawContent]);

  const [activeIdx, setActiveIdx] = useState(0);

  if (places.length === 0) return null;

  return (
    <div className={`border rounded-2xl p-5 my-6 shadow-xs text-left ${
      readerTheme === "dark" ? "bg-[#131722] border-slate-800" : readerTheme === "sepia" ? "bg-[#FAF6EC] border-[#E8DAB7]" : "bg-white border-slate-200"
    }`}>
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <Compass className="w-4 h-4" />
        </span>
        <div>
          <h4 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">Interactive Geo-Strategic Map Card</h4>
          <p className="text-[10px] text-slate-400 font-sans font-medium">Geographic landmarks & trade corridor analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stylized visual schematic vector map */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 p-4 min-h-[180px] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 z-10">
            Pakistan Regional Geo-Strategic Layout
          </div>

          {/* Styled Pins Canvas */}
          <div className="relative w-full h-28 flex items-center justify-center z-10">
            {places.map((place, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`absolute p-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-md ${
                    isActive 
                      ? "bg-indigo-600 text-white scale-110 z-20" 
                      : "bg-white dark:bg-slate-900 border border-slate-200 text-slate-700 dark:text-slate-300 hover:scale-105 z-10"
                  }`}
                  style={{
                    left: `${20 + (idx * (60 / Math.max(1, places.length - 1)))}%`,
                    top: `${30 + (idx % 2 === 0 ? 15 : -15)}%`
                  }}
                >
                  <span className="text-xs">📍</span>
                  <span className="text-[10px] font-bold font-sans tracking-tight">{place.name}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[9px] font-sans font-semibold text-slate-400 text-center z-10">
            💡 Click location pins above to view strategic analysis
          </div>
        </div>

        {/* Selected Area Insights Panel */}
        <div className="flex flex-col justify-between bg-indigo-50/20 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl p-4 text-left">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Landmark Dynamics
              </span>
            </div>
            <h5 className="font-serif font-black text-sm text-slate-900 dark:text-slate-50">
              {places[activeIdx]?.name}
            </h5>
            <div className="text-[10px] text-slate-400 font-mono font-bold">
              Coordinates/Orientation: {places[activeIdx]?.coords}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              {renderInteractiveText(places[activeIdx]?.dynamics, places[activeIdx]?.dynamics)}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-sans italic">
            * High score tip: Draw stylized regional maps during exams to lock in full marks.
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageBlock({
  rawContent,
  readerTheme,
  renderInteractiveText
}: {
  key?: any;
  rawContent: string;
  readerTheme: string;
  renderInteractiveText: (t: string, s: string) => React.ReactNode;
}) {
  const meta = useMemo(() => {
    const lines = rawContent.split("\n");
    const data: Record<string, string> = {};
    lines.forEach(line => {
      if (line.includes(":")) {
        const colonIdx = line.indexOf(":");
        const key = line.substring(0, colonIdx).trim().toLowerCase();
        const value = line.substring(colonIdx + 1).trim();
        data[key] = value;
      }
    });
    return data;
  }, [rawContent]);

  const bgGradient = {
    light: "from-teal-50 to-emerald-50 border-teal-100 text-teal-950",
    sepia: "from-[#F3EADA] to-[#ECE2C6] border-[#DFD1B3] text-[#3D2C1E]",
    dark: "from-indigo-950/40 to-slate-950 border-indigo-900/40 text-indigo-100"
  }[readerTheme] || "from-teal-50 to-emerald-50 border-teal-100 text-teal-950";

  return (
    <div className={`border rounded-2xl p-5 my-6 shadow-xs text-left bg-gradient-to-br ${bgGradient}`}>
      <div className="flex items-center gap-2 mb-4 border-b border-teal-100/40 dark:border-indigo-900/35 pb-2.5">
        <span className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <BookOpen className="w-4 h-4" />
        </span>
        <div className="text-left">
          <h4 className="font-serif font-black text-xs text-slate-900 dark:text-slate-50 uppercase tracking-tight">Syllabus Architectural Diagram</h4>
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{meta.type || "Analytical Concept illustration"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Render a highly elegant stylized SVG architectural blueprint / schematic */}
        <div className="md:col-span-2 relative h-36 bg-slate-900 rounded-xl overflow-hidden flex flex-col justify-between p-3 border border-slate-800 shadow-inner">
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:10px_10px]" />
          
          <div className="flex justify-between items-center z-10">
            <span className="text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-widest">Blueprint Draft 1.0</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Blueprint vector elements */}
          <div className="relative w-full h-16 flex items-center justify-center z-10">
            <div className="w-14 h-14 rounded-xl border border-indigo-500/50 flex items-center justify-center relative">
              <span className="text-[10px] font-mono text-indigo-300 font-semibold">Core Area</span>
              <div className="absolute -inset-2 border border-dashed border-teal-400/35 rounded-full animate-spin-slow" />
              
              {/* Technical dimension ticks */}
              <div className="absolute -bottom-4 left-0 right-0 h-px bg-indigo-500/30 flex justify-between">
                <span className="text-[7px] font-mono text-indigo-400 leading-none">|</span>
                <span className="text-[6px] font-mono text-indigo-400 leading-none select-none">1:2:4 ratio</span>
                <span className="text-[7px] font-mono text-indigo-400 leading-none">|</span>
              </div>
            </div>
          </div>

          <div className="text-[8px] font-mono text-slate-500 text-center z-10">
            Dimension Scale: Standard Metric Ratio
          </div>
        </div>

        <div className="md:col-span-3 text-left space-y-2">
          <h5 className="font-serif font-black text-sm text-slate-900 dark:text-slate-50 leading-tight">
            {meta.title || "Subject Blueprint Layout"}
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            {renderInteractiveText(meta.description || "Schematic illustration representing complex layouts and structural proportions described in the notes.", meta.description || "")}
          </p>
          {meta.style && (
            <div className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5 mt-2">
              <span>Theme style:</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-[9px] uppercase">
                {meta.style}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfographicBlock({
  rawContent,
  readerTheme,
  renderInteractiveText
}: {
  key?: any;
  rawContent: string;
  readerTheme: string;
  renderInteractiveText: (t: string, s: string) => React.ReactNode;
}) {
  const lines = rawContent.split("\n");
  let title = "Syllabus Infographic Summary";
  const metrics: Array<{ label: string; stat: string; details: string }> = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith("Title:")) {
      title = trimmed.substring(6).trim();
    } else if (trimmed.includes("|")) {
      const parts = trimmed.split("|").map(p => p.trim());
      metrics.push({
        label: parts[0] || "",
        stat: parts[1] || "",
        details: parts[2] || ""
      });
    }
  });

  if (metrics.length === 0) return null;

  return (
    <div className={`border rounded-2xl p-5 my-6 shadow-xs text-left ${
      readerTheme === "dark" ? "bg-[#131722] border-slate-800" : readerTheme === "sepia" ? "bg-[#FAF6EC] border-[#E8DAB7]" : "bg-white border-slate-200"
    }`}>
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </span>
        <div>
          <h4 className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
            {title}
          </h4>
          <p className="text-[10px] text-slate-400 font-sans font-medium">High-impact bento stats & core metrics summary</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => (
          <div key={idx} className={`border rounded-xl p-4 text-left flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all hover:scale-101 ${
            readerTheme === "dark" 
              ? "bg-[#1C2030] border-slate-700/50 text-slate-200 hover:border-indigo-500/50" 
              : readerTheme === "sepia"
              ? "bg-[#F5ECD8] border-[#E8DAB7] text-[#3D2C1E] hover:border-amber-700/50"
              : "bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-400/50"
          }`}>
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">
              {item.label}
            </span>
            <div className="my-2 select-text">
              <span className="text-2xl sm:text-3xl font-serif font-black text-indigo-600 dark:text-indigo-400 tracking-tight leading-none block">
                {item.stat}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed select-text mt-1 border-t border-slate-100 dark:border-slate-800 pt-2">
              {renderInteractiveText(item.details, item.details)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
