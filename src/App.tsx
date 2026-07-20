import React, { useState, useEffect, useRef, useMemo } from "react";
import { StudyNote, SyllabusSubject, SyllabusTopic, UserProgress, WordPopupInfo } from "./types";
import { SYLLABUS_DATA, PREBUILT_NOTES, DAILY_MOTIVATIONS } from "./data/syllabus";
import SyllabusTab from "./components/SyllabusTab";
import NotesGeneratorForm from "./components/NotesGeneratorForm";
import InteractiveNotesReader from "./components/InteractiveNotesReader";
import WordDictionaryPopup from "./components/WordDictionaryPopup";
import commonVocabulary from "./data/commonVocabulary.json";
import { 
  Home, 
  BookOpen, 
  Bookmark, 
  Sparkles, 
  Layers, 
  Clock, 
  Flame, 
  Search, 
  ArrowRight, 
  PlusCircle, 
  Calendar, 
  Award, 
  Compass, 
  BookMarked,
  CheckCircle,
  HelpCircle,
  Info,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Premium Animated SVG Progress Ring
function ProgressRing({ 
  percent, 
  size = 75, 
  strokeWidth = 6, 
  colorClass = "text-indigo-500",
  trailColorClass = "text-slate-100 dark:text-slate-800"
}: { 
  percent: number; 
  size?: number; 
  strokeWidth?: number; 
  colorClass?: string;
  trailColorClass?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className={`${trailColorClass} transition-colors`}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClass} transition-all duration-700 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-xs font-extrabold font-mono text-slate-800 dark:text-slate-100">
        {Math.round(percent)}%
      </span>
    </div>
  );
}

export default function App() {
  // --------------------------------------------------------
  // STATE DEFINITIONS & PERSISTENCE
  // --------------------------------------------------------
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("css_dark_mode");
    return saved ? JSON.parse(saved) : true; // Default to dark mode for premium look
  });

  useEffect(() => {
    localStorage.setItem("css_dark_mode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [subjects, setSubjects] = useState<SyllabusSubject[]>(() => {
    try {
      const saved = localStorage.getItem("css_syllabus_subjects");
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasIdeologyPakistan = parsed.some((s: any) => 
          s.id === "comp-pak-affairs" && s.topics.some((t: any) => t.id === "ideology-pakistan")
        );
        if (hasIdeologyPakistan) {
          return parsed;
        }
      }
      return SYLLABUS_DATA;
    } catch {
      return SYLLABUS_DATA;
    }
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    try {
      const saved = localStorage.getItem("css_study_notes");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure note-indus-valley-civ is updated with the correct topicId as well if loaded from storage
        return parsed.map((n: any) => n.id === "note-indus-valley-civ" && n.topicId === "indus-valley" ? { ...n, topicId: "ideology-pakistan" } : n);
      }
      return PREBUILT_NOTES;
    } catch {
      return PREBUILT_NOTES;
    }
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    const defaultProgress: UserProgress = {
      subjectsCompleted: {},
      totalNotesGenerated: PREBUILT_NOTES.length,
      studyTimeTodayMinutes: 24,
      dailyGoalMinutes: 90,
      streakDays: 8,
      recentSearches: ["Ideology of Pakistan", "Riyasat-e-Madina", "Foreign Policy"],
      bookmarkedNoteIds: ["note-indus-valley-civ"],
      recentlyOpenedNoteIds: ["note-indus-valley-civ", "note-governance-islam"]
    };
    try {
      const saved = localStorage.getItem("css_user_progress");
      return saved ? JSON.parse(saved) : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  const [currentTab, setCurrentTab] = useState<"home" | "notes" | "syllabus" | "generator">("home");
  const [activeNoteId, setActiveNoteId] = useState<string>("note-indus-valley-civ");
  
  // Sidebar states for Study Notes browser
  const [notesCategory, setNotesCategory] = useState<"Compulsory" | "Optional">("Compulsory");
  const [notesSelectedSubjectId, setNotesSelectedSubjectId] = useState<string>("comp-pak-affairs");
  const [notesSelectedTopicId, setNotesSelectedTopicId] = useState<string>("ideology-pakistan");

  // Word dictionary states
  const [clickedWordInfo, setClickedWordInfo] = useState<WordPopupInfo | null>(null);
  const [isLoadingWord, setIsLoadingWord] = useState(false);
  const [isLoadingRich, setIsLoadingRich] = useState(false);
  const [wordError, setWordError] = useState<string | null>(null);

  // Generator pre-fill links
  const [preSelectedSubId, setPreSelectedSubId] = useState<string | undefined>(undefined);
  const [preSelectedTopicId, setPreSelectedTopicId] = useState<string | undefined>(undefined);

  // Note generation states
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  // Global notes search
  const [searchQuery, setSearchQuery] = useState("");
  const [motivationIndex] = useState(() => Math.floor(Math.random() * DAILY_MOTIVATIONS.length));

  // Timer states for real-time study session
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const timerRef = useRef<any>(null);

  // --------------------------------------------------------
  // SIDE EFFECTS (PERSISTENCE & SYNCHRONIZATION)
  // --------------------------------------------------------
  useEffect(() => {
    localStorage.setItem("css_syllabus_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("css_study_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("css_user_progress", JSON.stringify(progress));
  }, [progress]);

  // Timer runner
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSessionSeconds((prev) => {
          const nextSec = prev + 1;
          if (nextSec % 60 === 0) {
            setProgress((curr) => ({
              ...curr,
              studyTimeTodayMinutes: curr.studyTimeTodayMinutes + 1
            }));
          }
          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Format dynamic timer display (MM:SS)
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --------------------------------------------------------
  // BUSINESS HANDLERS
  // --------------------------------------------------------

  // Toggle bookmarked status on note
  const handleToggleBookmark = (noteId: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) => {
        if (n.id === noteId) {
          const nextBookmark = !n.bookmarked;
          // Sync with progress lists
          setProgress((curr) => {
            const nextBookmarks = nextBookmark
              ? [...new Set([...curr.bookmarkedNoteIds, noteId])]
              : curr.bookmarkedNoteIds.filter((id) => id !== noteId);
            return { ...curr, bookmarkedNoteIds: nextBookmarks };
          });
          return { ...n, bookmarked: nextBookmark };
        }
        return n;
      })
    );
  };

  // Click on a word inside study notes triggers dictionary lookup
  const handleWordClick = async (word: string, sentenceContext: string) => {
    if (!word || word.trim().length === 0) return;

    // Normalize word: lowercase and strip punctuation from start/end
    const cleanWord = word.toLowerCase().trim().replace(/^[.,\/#!$%\^&\*;:{}=\-_`~()?"'’“”]+|[.,\/#!$%\^&\*;:{}=\-_`~()?"'’“”]+$/g, "");
    if (!cleanWord) return;

    setWordError(null);

    // 1. Check localStorage first (Instant response)
    const cached = localStorage.getItem(`css_vocab_${cleanWord}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setClickedWordInfo(parsed);
        setIsLoadingWord(false);
        setIsLoadingRich(false);
        return;
      } catch (e) {
        console.error("Failed to parse cached word info", e);
      }
    }

    // 2. Check bundled local vocabulary dataset (Instant response)
    const preloadedMatch = (commonVocabulary as Record<string, WordPopupInfo>)[cleanWord];
    if (preloadedMatch) {
      setClickedWordInfo(preloadedMatch);
      setIsLoadingWord(false);
      setIsLoadingRich(false);
      // Cache it locally so it remains consistent
      localStorage.setItem(`css_vocab_${cleanWord}`, JSON.stringify(preloadedMatch));
      return;
    }

    // 3. Fallback: Query Gemini API in two non-blocking progressive stages
    setIsLoadingWord(true);
    setIsLoadingRich(false);
    setClickedWordInfo(null);

    const activeNote = notes.find((n) => n.id === activeNoteId);
    const subjectContext = activeNote ? activeNote.subjectName : "";

    try {
      // Stage A: Fetch essential fields (takes 1-2 seconds)
      const res = await fetch("/api/dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: cleanWord,
          context: sentenceContext,
          subject: subjectContext,
          mode: "essential"
        })
      });

      if (!res.ok) {
        throw new Error("Failed to fetch essential dictionary analysis.");
      }

      const essentialData = await res.json();
      
      // Construct starting WordPopupInfo with essential data and empty rich fields
      const initialWordInfo: WordPopupInfo = {
        ...essentialData,
        exampleSentence: "",
        synonyms: [],
        antonyms: [],
        relatedTopics: [],
        mnemonic: "",
        cssUsage: ""
      };

      setClickedWordInfo(initialWordInfo);
      setIsLoadingWord(false); // Hide full-screen/modal spinner, reveal popup instantly!
      
      // Stage B: Fetch rich details in background
      setIsLoadingRich(true);

      const richRes = await fetch("/api/dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: cleanWord,
          context: sentenceContext,
          subject: subjectContext,
          mode: "rich"
        })
      });

      if (richRes.ok) {
        const richData = await richRes.json();
        
        // Merge the rich fields back into our word info state
        setClickedWordInfo((prev) => {
          if (!prev || prev.word.toLowerCase() !== cleanWord) return prev;
          
          const merged: WordPopupInfo = {
            ...prev,
            exampleSentence: richData.exampleSentence || "",
            synonyms: richData.synonyms || [],
            antonyms: richData.antonyms || [],
            relatedTopics: richData.relatedTopics || [],
            mnemonic: richData.mnemonic || "",
            cssUsage: richData.cssUsage || ""
          };

          // Cache completed merged result to localStorage for subsequent instant retrieval
          localStorage.setItem(`css_vocab_${cleanWord}`, JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err: any) {
      console.error(err);
      setWordError(err.message || "Failed to resolve dictionary. Check internet or key setup.");
    } finally {
      setIsLoadingWord(false);
      setIsLoadingRich(false);
    }
  };

  // Upload custom text/file context onto syllabus topic
  const handleUploadSyllabusMaterial = (
    subjectId: string,
    topicId: string,
    material: NonNullable<SyllabusTopic["uploadedMaterial"]>
  ) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((top) => {
              if (top.id === topicId) {
                return { ...top, uploadedMaterial: material };
              }
              return top;
            })
          };
        }
        return sub;
      })
    );
  };

  // Delete uploaded syllabus material
  const handleDeleteSyllabusMaterial = (subjectId: string, topicId: string) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((top) => {
              if (top.id === topicId) {
                const { uploadedMaterial, ...rest } = top;
                return rest;
              }
              return top;
            })
          };
        }
        return sub;
      })
    );
  };

  // Add new syllabus topic module to a subject
  const handleAddSyllabusTopic = (subjectId: string, topic: SyllabusTopic) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: [...sub.topics, topic]
          };
        }
        return sub;
      })
    );
  };

  // Remove a syllabus topic module from a subject
  const handleRemoveSyllabusTopic = (subjectId: string, topicId: string) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.filter((top) => top.id !== topicId)
          };
        }
        return sub;
      })
    );
  };

  // Edit an existing syllabus topic module under a subject
  const handleEditSyllabusTopic = (
    subjectId: string,
    topicId: string,
    updatedTopic: Partial<SyllabusTopic>
  ) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((top) => {
              if (top.id === topicId) {
                return { ...top, ...updatedTopic };
              }
              return top;
            })
          };
        }
        return sub;
      })
    );
  };

  // Add new syllabus subject
  const handleAddSyllabusSubject = (subject: SyllabusSubject) => {
    setSubjects((prevSubjects) => [...prevSubjects, subject]);
  };

  // Remove syllabus subject
  const handleRemoveSyllabusSubject = (subjectId: string) => {
    setSubjects((prevSubjects) => prevSubjects.filter((sub) => sub.id !== subjectId));
  };

  // Edit existing syllabus subject settings
  const handleEditSyllabusSubject = (subjectId: string, updatedSubject: Partial<SyllabusSubject>) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => {
        if (sub.id === subjectId) {
          return { ...sub, ...updatedSubject };
        }
        return sub;
      })
    );
  };

  // Trigger Notes Generation (called from Generator form)
  const handleGenerateNotes = async (params: {
    subjectName: string;
    topicName: string;
    category: "Compulsory" | "Optional";
    style: string;
    length: string;
    language: string;
    includedSections: string[];
    knowledgeBaseText?: string;
    model: string;
  }) => {
    setIsGeneratingNote(true);

    try {
      const res = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      });

      if (!res.ok) {
        throw new Error("Failed to generate CSS study notes.");
      }

      const noteData = await res.json();
      const newNoteId = `note-${Date.now()}`;

      // Convert model id to human friendly label
      const modelLabels: Record<string, string> = {
        "gemini-2.5-pro": "Gemini 2.5 Pro",
        "gpt-5.5": "GPT-5.5",
        "claude": "Claude"
      };

      const generatedNote: StudyNote = {
        id: newNoteId,
        subjectId: subjects.find((s) => s.name === params.subjectName)?.id || "custom-subject",
        topicId: subjects.find((s) => s.name === params.subjectName)?.topics.find((t) => t.title === params.topicName)?.id || "custom-topic",
        title: noteData.title || `${params.topicName} Notes`,
        subjectName: params.subjectName,
        category: params.category,
        style: params.style,
        length: params.length,
        language: params.language,
        content: noteData.content,
        createdAt: noteData.createdAt || new Date().toISOString(),
        bookmarked: false,
        progress: 10,
        sectionsIncluded: params.includedSections,
        model: modelLabels[params.model] || params.model
      };

      // Append note to list
      setNotes((prev) => [generatedNote, ...prev]);

      // Update user statistics
      setProgress((curr) => ({
        ...curr,
        totalNotesGenerated: curr.totalNotesGenerated + 1,
        recentlyOpenedNoteIds: [newNoteId, ...curr.recentlyOpenedNoteIds.filter((id) => id !== newNoteId)]
      }));

      // Focus on the newly generated note instantly
      setActiveNoteId(newNoteId);
      
      // Select corresponding navigation coordinates
      setNotesCategory(params.category);
      setNotesSelectedSubjectId(generatedNote.subjectId);
      setNotesSelectedTopicId(generatedNote.topicId);

      // Route user to Notes reader tab
      setCurrentTab("notes");

    } catch (err: any) {
      alert(err.message || "Notes generation failed. Please verify your GEMINI_API_KEY.");
    } finally {
      setIsGeneratingNote(false);
      // Clean up pre-selections
      setPreSelectedSubId(undefined);
      setPreSelectedTopicId(undefined);
    }
  };

  // Quick navigation link from Syllabus directly into Generator Form prefilled
  const handleGenerateNotesFromSyllabus = (subject: SyllabusSubject, topic: SyllabusTopic) => {
    setPreSelectedSubId(subject.id);
    setPreSelectedTopicId(topic.id);
    setCurrentTab("generator");
  };

  // Open note reader
  const handleOpenNote = (noteId: string) => {
    setActiveNoteId(noteId);
    setProgress((curr) => ({
      ...curr,
      recentlyOpenedNoteIds: [
        noteId,
        ...curr.recentlyOpenedNoteIds.filter((id) => id !== noteId)
      ]
    }));
    
    // Set Sidebar coordinates for study note browsing
    const targetNote = notes.find((n) => n.id === noteId);
    if (targetNote) {
      setNotesCategory(targetNote.category);
      setNotesSelectedSubjectId(targetNote.subjectId);
      setNotesSelectedTopicId(targetNote.topicId);
    }
    
    setCurrentTab("notes");
  };

  // Global search filtering
  const filteredNotesBySearch = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    return notes.filter((n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  // Coordinate-based notes filtering for the Study Notes tab
  const activeSubjectNotesList = useMemo(() => {
    return notes.filter(
      (n) => n.subjectId === notesSelectedSubjectId && n.category === notesCategory
    );
  }, [notes, notesSelectedSubjectId, notesCategory]);

  const activeTopicNote = useMemo(() => {
    // Attempt to match exact subject & topic note
    return notes.find(
      (n) => n.subjectId === notesSelectedSubjectId && n.topicId === notesSelectedTopicId
    );
  }, [notes, notesSelectedSubjectId, notesSelectedTopicId]);

  // --------------------------------------------------------
  // SUB-RENDERERS (DASHBOARD PANELS)
  // --------------------------------------------------------

  // Helper for subject icons
  const getSubjectIcon = (subjectId: string) => {
    const lowercaseId = subjectId.toLowerCase();
    if (lowercaseId.includes("affairs") || lowercaseId.includes("pak")) return "🏛️";
    if (lowercaseId.includes("studies") || lowercaseId.includes("islam") || lowercaseId.includes("relig")) return "🕌";
    if (lowercaseId.includes("science") || lowercaseId.includes("pol")) return "⚖️";
    if (lowercaseId.includes("criminology") || lowercaseId.includes("crime")) return "🔍";
    if (lowercaseId.includes("essay") || lowercaseId.includes("write")) return "🖋️";
    return "📚";
  };

  // Render Home Dashboard tab
  const renderHomeTab = () => {
    const continueReadingNote = notes.find((n) => n.id === progress.recentlyOpenedNoteIds[0]) || notes[0];
    const bookmarkedNotes = notes.filter((n) => progress.bookmarkedNoteIds.includes(n.id));
    const recentNotes = notes.filter((n) => progress.recentlyOpenedNoteIds.includes(n.id)).slice(0, 4);

    return (
      <div className="space-y-10 animate-fade-in" id="home-tab-container">
        {/* Banner with CSS countdown & Motivational quote */}
        <div className={`transition-all duration-300 rounded-3xl p-6 sm:p-10 shadow-xl border relative overflow-hidden ${
          isDarkMode 
            ? "bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border-slate-800" 
            : "bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 border-slate-200"
        } text-white`}>
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Award className="w-56 h-56" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-500/35 text-indigo-200 border border-indigo-400/30 font-mono">
                  Daily CSS Dose
                </span>
                <span className="text-xs text-slate-300">• Pakistan FPSC Bureaucracy Syllabus</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-4xl tracking-tight leading-tight">
                "We cultivate administrators, not memory-repeaters."
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic font-sans max-w-xl">
                "{DAILY_MOTIVATIONS[motivationIndex].quote}" — <span className="font-semibold text-white">{DAILY_MOTIVATIONS[motivationIndex].author}</span>
              </p>
            </div>

            {/* Daily Streak & study goal wheel */}
            <div className={`border rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-colors ${
              isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-slate-900/60 border-slate-800"
            }`}>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                <span className="font-display font-bold text-lg">{progress.streakDays} Day Streak</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">Keep generating notes to sustain consistency</p>
              
              <div className="w-full mt-1.5 flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                <div>
                  <div className="text-slate-400 text-left">Time Logged</div>
                  <div className="font-bold font-mono text-white mt-0.5">{progress.studyTimeTodayMinutes} / {progress.dailyGoalMinutes} min</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400">Goal Progress</div>
                  <div className="font-bold text-emerald-400 mt-0.5">
                    {Math.round((progress.studyTimeTodayMinutes / progress.dailyGoalMinutes) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Session timer bar */}
        <div className={`border rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-6 transition-colors ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200/80"
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${isDarkMode ? "bg-indigo-950 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className={`font-display font-bold text-base ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
                Real-Time Study Session
              </h4>
              <p className={`text-xs font-sans mt-0.5 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                Toggle the clock to track active reading and automatically earn study minutes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className={`font-mono text-2xl font-bold px-5 py-2 rounded-xl border transition-colors ${
              isDarkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-gray-100 border-gray-200 text-gray-800"
            }`}>
              {formatTimer(sessionSeconds)}
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
                isTimerRunning
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-950/20"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-950/20"
              }`}
            >
              {isTimerRunning ? "Pause Session" : "Start Study Clock"}
            </button>
          </div>
        </div>

        {/* Bento Grid: Progress + Searches + Continue reading */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Reading (Left Column) */}
          {continueReadingNote && (
            <div className={`lg:col-span-2 border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-md ${
              isDarkMode ? "bg-slate-900 border-slate-800 hover:border-slate-700" : "bg-white border-gray-200"
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                  <span className={`text-xs font-bold uppercase tracking-wider font-mono ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
                    Continue Reading
                  </span>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border flex items-center gap-1 ${
                    isDarkMode ? "bg-indigo-950 border-indigo-900 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-700"
                  }`}>
                    {getSubjectIcon(continueReadingNote.subjectId)} {continueReadingNote.subjectName}
                  </span>
                </div>
                <h3 className={`font-display font-bold text-2xl mt-4 tracking-tight leading-snug ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
                  {continueReadingNote.title}
                </h3>
                <p className={`text-sm font-sans line-clamp-3 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-gray-500"}`}>
                  {continueReadingNote.content.replace(/[#*`_>]/g, "").substring(0, 320)}...
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-xs font-sans">
                    <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>Note Progress</span>
                    <span className={`font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>{continueReadingNote.progress}% Complete</span>
                  </div>
                  <div className={`w-full rounded-full h-2 overflow-hidden ${isDarkMode ? "bg-slate-950" : "bg-gray-100"}`}>
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${continueReadingNote.progress}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenNote(continueReadingNote.id)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  Open Study Notes <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats Block */}
          <div className="lg:col-span-1 space-y-8">
            <div className={`border rounded-3xl p-6 shadow-sm space-y-6 transition-all duration-300 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
            }`}>
              <h4 className={`font-display font-bold text-base flex items-center gap-2 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
                <Compass className="w-5 h-5 text-indigo-500" /> Administrative Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 border rounded-xl transition-colors ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-gray-50 border-gray-100"
                }`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Notes Sourced</div>
                  <div className={`text-2xl font-bold font-display mt-1.5 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{progress.totalNotesGenerated}</div>
                </div>
                <div className={`p-4 border rounded-xl transition-colors ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-gray-50 border-gray-100"
                }`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Streak Days</div>
                  <div className={`text-2xl font-bold font-display mt-1.5 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{progress.streakDays}</div>
                </div>
              </div>

              {/* Progress per subject represented as premium Progress Rings */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <h5 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Syllabus Completion</h5>
                <div className="flex justify-around items-center gap-4 pt-1">
                  <div className="flex flex-col items-center gap-2">
                    <ProgressRing percent={66} size={70} strokeWidth={6} colorClass="text-emerald-500" />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest font-mono text-slate-500">Compulsory</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ProgressRing percent={15} size={70} strokeWidth={6} colorClass="text-indigo-500" />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest font-mono text-slate-500">Optional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Searches Block */}
            <div className={`border rounded-3xl p-5 shadow-sm space-y-4 transition-all duration-300 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
            }`}>
              <h4 className={`font-display font-bold text-sm flex items-center gap-2 ${isDarkMode ? "text-slate-200" : "text-gray-800"}`}>
                <Search className="w-4 h-4 text-slate-400" /> Recent Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {progress.recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSearchQuery(search); setCurrentTab("notes"); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all border ${
                      isDarkMode 
                        ? "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200/60 hover:border-gray-300"
                    }`}
                  >
                    "{search}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recently Opened & Bookmarked Notes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent reads */}
          <div className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
          }`}>
            <h3 className={`font-display font-bold text-base flex items-center gap-1.5 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
              <BookOpen className="w-4.5 h-4.5 text-indigo-500" /> Recently Opened Notes
            </h3>
            {recentNotes.length === 0 ? (
              <p className="text-xs text-slate-400 font-sans italic">No recently viewed study notes.</p>
            ) : (
              <div className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-gray-100"}`}>
                {recentNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleOpenNote(n.id)}
                    className={`w-full py-3.5 flex items-center justify-between text-left group px-2 rounded-xl transition-all ${
                      isDarkMode ? "hover:bg-slate-950/40" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className={`text-[10px] font-semibold uppercase tracking-wider font-mono ${
                        isDarkMode ? "text-slate-400" : "text-gray-500"
                      }`}>
                        {getSubjectIcon(n.subjectId)} {n.subjectName}
                      </div>
                      <div className={`text-sm font-semibold transition-colors ${
                        isDarkMode ? "text-slate-200 group-hover:text-indigo-400" : "text-gray-800 group-hover:text-indigo-600"
                      }`}>
                        {n.title}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-all group-hover:translate-x-0.5 ${
                      isDarkMode ? "text-slate-700 group-hover:text-indigo-400" : "text-gray-300 group-hover:text-indigo-600"
                    }`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bookmark stack */}
          <div className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
          }`}>
            <h3 className={`font-display font-bold text-base flex items-center gap-1.5 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
              <BookMarked className="w-4.5 h-4.5 text-amber-500" /> Bookmarked Notes
            </h3>
            {bookmarkedNotes.length === 0 ? (
              <p className="text-xs text-slate-400 font-sans italic">No bookmarked notes. Bookmark critical study modules for quick revision.</p>
            ) : (
              <div className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-gray-100"}`}>
                {bookmarkedNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleOpenNote(n.id)}
                    className={`w-full py-3.5 flex items-center justify-between text-left group px-2 rounded-xl transition-all ${
                      isDarkMode ? "hover:bg-slate-950/40" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className={`text-[10px] font-semibold uppercase tracking-wider font-mono ${
                        isDarkMode ? "text-slate-400" : "text-gray-500"
                      }`}>
                        {getSubjectIcon(n.subjectId)} {n.subjectName}
                      </div>
                      <div className={`text-sm font-semibold transition-colors ${
                        isDarkMode ? "text-slate-200 group-hover:text-indigo-400" : "text-gray-800 group-hover:text-indigo-600"
                      }`}>
                        {n.title}
                      </div>
                    </div>
                    <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Study Notes Browser with Sidebar
  const renderStudyNotesTab = () => {
    // Current subject list
    const currentCategorySubjects = subjects.filter((s) => s.category === notesCategory);
    
    // Select default coordinate if not populated
    const currentSubjectObj = subjects.find((s) => s.id === notesSelectedSubjectId && s.category === notesCategory) 
      || currentCategorySubjects[0];

    const currentTopicObj = currentSubjectObj?.topics.find((t) => t.id === notesSelectedTopicId)
      || currentSubjectObj?.topics[0];

    // Read details
    const activeNoteToDisplay = notes.find(
      (n) => n.subjectId === currentSubjectObj?.id && n.topicId === currentTopicObj?.id
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start animate-fade-in" id="notes-tab-wrapper">
        {/* Left Side: Subject hierarchy browser - STICKY Left Navigation */}
        <div className={`lg:col-span-1 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 space-y-5 border p-5 rounded-3xl shadow-sm transition-colors duration-300 ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
        }`}>
          <h3 className={`font-display font-bold text-base tracking-tight pb-2 border-b ${
            isDarkMode ? "text-slate-100 border-slate-800/80" : "text-gray-900 border-gray-100"
          }`}>
            Syllabus Explorer
          </h3>

          {/* Category Toggle */}
          <div className={`flex p-1 rounded-xl border text-xs font-semibold ${
            isDarkMode ? "bg-slate-950 border-slate-800/80 text-slate-300" : "bg-gray-100 border-gray-200 text-gray-700"
          }`}>
            {(["Compulsory", "Optional"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setNotesCategory(cat);
                  const firstSub = subjects.find((s) => s.category === cat);
                  if (firstSub) {
                    setNotesSelectedSubjectId(firstSub.id);
                    if (firstSub.topics.length > 0) {
                      setNotesSelectedTopicId(firstSub.topics[0].id);
                    }
                  }
                }}
                className={`flex-1 py-1.5 text-center rounded-lg font-bold transition-all ${
                  notesCategory === cat
                    ? isDarkMode
                      ? "bg-slate-800 text-indigo-400 shadow-sm"
                      : "bg-white text-gray-800 shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Subject Selectors */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Select Subject
              </label>
              <select
                value={notesSelectedSubjectId}
                onChange={(e) => {
                  const subId = e.target.value;
                  setNotesSelectedSubjectId(subId);
                  const sub = subjects.find((s) => s.id === subId);
                  if (sub && sub.topics.length > 0) {
                    setNotesSelectedTopicId(sub.topics[0].id);
                  }
                }}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-bold focus:outline-none transition-colors ${
                  isDarkMode 
                    ? "bg-slate-950 border-slate-800 text-slate-100 focus:border-indigo-500" 
                    : "bg-white border-gray-200 text-slate-800 focus:border-indigo-500"
                }`}
              >
                {currentCategorySubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {getSubjectIcon(s.id)} {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Select Topic Module
              </label>
              <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                {currentSubjectObj?.topics.map((t) => {
                  const isSelected = notesSelectedTopicId === t.id;
                  const hasNote = notes.some((n) => n.subjectId === currentSubjectObj.id && n.topicId === t.id);

                  return (
                    <button
                      key={t.id}
                      onClick={() => setNotesSelectedTopicId(t.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-2 border ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                          : isDarkMode
                          ? "bg-slate-950 border-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                          : "bg-white border-transparent text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate pr-1">{t.title}</span>
                      {hasNote ? (
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase shrink-0 ${
                          isSelected 
                            ? "bg-white/20 text-white" 
                            : isDarkMode
                            ? "bg-emerald-950/50 border border-emerald-900/50 text-emerald-400"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          Ready
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase shrink-0 ${
                          isSelected 
                            ? "bg-white/10 text-white" 
                            : isDarkMode
                            ? "bg-slate-800 text-slate-500 border border-slate-700/50"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          Empty
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Interactive Reader Canvas */}
        <div className="lg:col-span-3">
          {activeNoteToDisplay ? (
            <InteractiveNotesReader
              note={activeNoteToDisplay}
              onWordClick={handleWordClick}
              onToggleBookmark={() => handleToggleBookmark(activeNoteToDisplay.id)}
            />
          ) : (
            <div className={`border rounded-3xl p-12 text-center max-w-xl mx-auto space-y-5 transition-colors duration-300 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
            }`} id="no-notes-placeholder">
              <div className="inline-flex p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className={`font-display font-bold text-lg ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>
                  No notes found for this topic module
                </h4>
                <p className={`text-sm font-sans leading-relaxed ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                  Every CSS syllabus topic can be compiled into premium study material with a single click. Generate standardized FPSC-oriented lecture notes with quotes, timelines, definitions, and maps!
                </p>
              </div>

              <button
                onClick={() => {
                  setPreSelectedSubId(currentSubjectObj?.id);
                  setPreSelectedTopicId(currentTopicObj?.id);
                  setCurrentTab("generator");
                }}
                className="inline-flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
              >
                Generate notes for this topic <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --------------------------------------------------------
  // MAIN DRAW (RENDER SHELL)
  // --------------------------------------------------------
  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans flex flex-col ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-[#F8F9FA] text-[#1A1A1A]"}`} id="app-layout">
      {/* Premium Navbar Header */}
      <header className={`sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm border-b transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900/90 backdrop-blur-md border-slate-800 text-white" : "bg-white/95 backdrop-blur-md border-slate-200 text-slate-900"
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/20">
            C
          </div>
          <div>
            <h1 className={`font-display font-extrabold text-base sm:text-lg tracking-tight leading-none ${isDarkMode ? "text-slate-50" : "text-slate-950"}`}>
              CSS FPSC Pakistan
            </h1>
            <p className="text-[10px] text-indigo-500 font-mono font-bold uppercase tracking-wider mt-1 underline decoration-indigo-300/65 decoration-1 underline-offset-2">
              AI-Powered Study Notes & Dictionary
            </p>
          </div>
        </div>

        {/* Search bar inside header */}
        <div className="relative w-full max-w-xs sm:max-w-md order-3 sm:order-none">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study notes, subjects, years, keywords..."
            className={`w-full pl-10 pr-4 py-2 text-xs border rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans transition-all ${
              isDarkMode 
                ? "bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-500 focus:bg-slate-800" 
                : "bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white"
            }`}
          />
        </div>

        {/* Main Tab Controller navigation & Dark Mode toggle */}
        <div className="flex items-center gap-3 order-2 sm:order-none">
          <nav className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setCurrentTab("home")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                currentTab === "home"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : isDarkMode
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </button>
            <button
              onClick={() => setCurrentTab("notes")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                currentTab === "notes"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : isDarkMode
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Study Notes
            </button>
            <button
              onClick={() => setCurrentTab("syllabus")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                currentTab === "syllabus"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : isDarkMode
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Syllabus
            </button>
            <button
              onClick={() => setCurrentTab("generator")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                currentTab === "generator"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : isDarkMode
                  ? "text-slate-300 hover:text-white hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Generator
            </button>
          </nav>

          {/* Theme Switcher Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition-all ${
              isDarkMode 
                ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300" 
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            }`}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <AnimatePresence mode="wait">
          {currentTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {renderHomeTab()}
            </motion.div>
          )}

          {currentTab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {renderStudyNotesTab()}
            </motion.div>
          )}

          {currentTab === "syllabus" && (
            <motion.div
              key="syllabus"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <SyllabusTab
                subjects={subjects}
                onUploadMaterial={handleUploadSyllabusMaterial}
                onDeleteMaterial={handleDeleteSyllabusMaterial}
                onGenerateNotesFromSyllabus={handleGenerateNotesFromSyllabus}
                onAddTopic={handleAddSyllabusTopic}
                onRemoveTopic={handleRemoveSyllabusTopic}
                onEditTopic={handleEditSyllabusTopic}
                onAddSubject={handleAddSyllabusSubject}
                onRemoveSubject={handleRemoveSyllabusSubject}
                onEditSubject={handleEditSyllabusSubject}
              />
            </motion.div>
          )}

          {currentTab === "generator" && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <NotesGeneratorForm
                subjects={subjects}
                onGenerate={handleGenerateNotes}
                isGenerating={isGeneratingNote}
                preSelectedSubjectId={preSelectedSubId}
                preSelectedTopicId={preSelectedTopicId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-400 font-sans">
        <div>
          CSS FPSC Pakistan competitive study generator • Crafted for Civil Service Academy excellence
        </div>
        <div className="mt-1">
          Copyright © {new Date().getFullYear()} CSS study systems. Powered by Gemini. All rights reserved.
        </div>
      </footer>

      {/* Dynamic Popups & Modals */}
      <WordDictionaryPopup
        wordInfo={clickedWordInfo}
        isLoading={isLoadingWord}
        isLoadingRich={isLoadingRich}
        onClose={() => setClickedWordInfo(null)}
        error={wordError}
      />
    </div>
  );
}
