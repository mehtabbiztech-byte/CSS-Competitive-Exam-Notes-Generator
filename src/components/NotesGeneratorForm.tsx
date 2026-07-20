import React, { useState, useEffect } from "react";
import { SyllabusSubject, SyllabusTopic } from "../types";
import { Sparkles, FileText, Settings, BookOpen, ChevronRight, AlertCircle, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotesGeneratorFormProps {
  subjects: SyllabusSubject[];
  onGenerate: (params: {
    subjectName: string;
    topicName: string;
    category: "Compulsory" | "Optional";
    style: string;
    length: string;
    language: string;
    includedSections: string[];
    knowledgeBaseText?: string;
    model: string;
  }) => void;
  isGenerating: boolean;
  preSelectedSubjectId?: string;
  preSelectedTopicId?: string;
}

const GENERATION_STYLES = [
  "CSS Standard",
  "Short Notes",
  "Detailed Notes",
  "One-Page Revision",
  "Examiner Perspective",
  "Beginner Friendly",
  "Advanced Analysis"
];

const NOTE_LENGTHS = [
  "Short (2–3 pages)",
  "Medium (5–8 pages)",
  "Comprehensive (10–15 pages)"
];

const LANGUAGES = [
  "English",
  "Urdu",
  "Sindhi",
  "Roman Urdu"
];

const AI_MODELS = [
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", desc: "Extreme reasoning & deep academic synthesis", badge: "Highly Recommended", badgeBg: "bg-blue-100 text-blue-800" },
  { id: "gpt-5.5", name: "GPT-5.5", desc: "SOTA analytical frameworks & precise categorizations", badge: "Connected", badgeBg: "bg-emerald-100 text-emerald-800" },
  { id: "claude", name: "Claude", desc: "Nuanced critical prose & elegant scholar style", badge: "Connected", badgeBg: "bg-amber-100 text-amber-850" }
];

const SECTIONS_TO_INCLUDE = [
  "Learning Objectives",
  "Introduction",
  "Background",
  "Historical Perspective",
  "Definitions",
  "Detailed Explanation",
  "Causes",
  "Effects",
  "Advantages",
  "Disadvantages",
  "Critical Analysis",
  "Pakistan Perspective",
  "Global Perspective",
  "Current Affairs Link",
  "Case Studies",
  "Examples",
  "Diagrams",
  "Tables",
  "Flowcharts",
  "Timelines",
  "Important Facts",
  "Quotes",
  "Scholars",
  "Constitutional Articles",
  "CSS Tips",
  "MCQs",
  "CSS Past Paper references"
];

const SOURCE_MATERIALS = [
  "Official Syllabus",
  "Uploaded Documents",
  "Previous Notes",
  "AI Knowledge Base",
  "Current Affairs (when applicable)"
];

const LOADING_STEPS = [
  "Mapping the FPSC official CSS syllabus parameters...",
  "Searching AI Knowledge Base for academic sources...",
  "Formulating critical analytical dimensions and Pakistan's perspectives...",
  "Polishing structural flow (timelines, CSS tips, exam questions)...",
  "Weaving high-scoring academic terms and scholars' quotes...",
  "Formatting study content into clean markdown nodes..."
];

export default function NotesGeneratorForm({
  subjects,
  onGenerate,
  isGenerating,
  preSelectedSubjectId,
  preSelectedTopicId
}: NotesGeneratorFormProps) {
  const [category, setCategory] = useState<"Compulsory" | "Optional">("Compulsory");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-pro");
  const [selectedSources, setSelectedSources] = useState<string[]>([
    "Official Syllabus",
    "AI Knowledge Base",
    "Current Affairs (when applicable)"
  ]);
  const [selectedStyle, setSelectedStyle] = useState("CSS Standard");
  const [selectedLength, setSelectedLength] = useState("Medium (5–8 pages)");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "Introduction",
    "Historical Perspective",
    "Definitions",
    "Detailed Explanation",
    "Critical Analysis",
    "Pakistan Perspective",
    "CSS Tips",
    "Scholars",
    "Diagrams",
    "Flowcharts",
    "MCQs",
    "CSS Past Paper references"
  ]);

  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // Filter subjects based on Category
  const filteredSubjects = subjects.filter((s) => s.category === category);

  // Get active subject and topics
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
  const topics = activeSubject ? activeSubject.topics : [];
  const activeTopic = topics.find((t) => t.id === selectedTopicId);

  // Auto-select first subject/topic on category or preselected change
  useEffect(() => {
    if (preSelectedSubjectId && preSelectedTopicId) {
      const sub = subjects.find((s) => s.id === preSelectedSubjectId);
      if (sub) {
        setCategory(sub.category);
        setSelectedSubjectId(preSelectedSubjectId);
        setSelectedTopicId(preSelectedTopicId);
        return;
      }
    }

    if (filteredSubjects.length > 0) {
      const firstSub = filteredSubjects[0];
      setSelectedSubjectId(firstSub.id);
      if (firstSub.topics.length > 0) {
        setSelectedTopicId(firstSub.topics[0].id);
      } else {
        setSelectedTopicId("");
      }
    } else {
      setSelectedSubjectId("");
      setSelectedTopicId("");
    }
  }, [category, preSelectedSubjectId, preSelectedTopicId]);

  // Handle subject change
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const sub = subjects.find((s) => s.id === subjectId);
    if (sub && sub.topics.length > 0) {
      setSelectedTopicId(sub.topics[0].id);
    } else {
      setSelectedTopicId("");
    }
  };

  // Toggle selection lists
  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const toggleSection = (section: string) => {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const toggleAllSections = () => {
    if (selectedSections.length === SECTIONS_TO_INCLUDE.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections([...SECTIONS_TO_INCLUDE]);
    }
  };

  // Rotate loading steps
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject || !selectedTopicId) return;

    const topicItem = activeSubject.topics.find((t) => t.id === selectedTopicId);
    if (!topicItem) return;

    onGenerate({
      subjectName: activeSubject.name,
      topicName: topicItem.title,
      category,
      style: selectedStyle,
      length: selectedLength,
      language: selectedLanguage,
      includedSections: selectedSections,
      knowledgeBaseText: topicItem.uploadedMaterial?.content,
      model: selectedModel
    });
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden p-6 sm:p-8" id="notes-generation-panel">
      {isGenerating ? (
        <div className="py-16 text-center max-w-lg mx-auto flex flex-col items-center justify-center gap-6" id="notes-generating-spinner">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <Sparkles className="w-6 h-6 text-yellow-500 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-gray-900">
              Generating High-Yield Notes
            </h3>
            <p className="text-sm text-gray-500 font-sans h-12 flex items-center justify-center transition-all duration-500 italic">
              "{LOADING_STEPS[loadingStepIndex]}"
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-gray-400 uppercase tracking-widest font-mono">
            Powered by Connected Multi-Model Core • CSS Pakistan FPSC Model
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="border-b border-gray-100 pb-5">
            <h3 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" /> CSS AI Notes Generator
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 font-sans">
              Create highly structured, analytical, examiner-targeted notes. Fine-tune your criteria to focus the outputs perfectly on CSS scoring criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side: Selections */}
            <div className="space-y-6">
              {/* Exam & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    📖 Exam
                  </label>
                  <select 
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-semibold focus:outline-none"
                  >
                    <option>CSS (FPSC Pakistan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    📂 Category
                  </label>
                  <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                    {(["Compulsory", "Optional"] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`flex-1 py-1.5 rounded-md text-xs font-bold text-center transition-all ${
                          category === cat
                            ? "bg-white text-gray-800 shadow-xs"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subject & Topic cascades */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    📚 Subject
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    {filteredSubjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    📑 Topic
                  </label>
                  <select
                    value={selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Connected AI Model Engine */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  🤖 Connected AI Model Engine
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {AI_MODELS.map((model) => {
                    const isSelected = selectedModel === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => setSelectedModel(model.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white shadow-md"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${
                          isSelected ? "bg-white/10 text-white" : "bg-gray-100 text-gray-500"
                        }`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 pr-24">
                          <span className={`block text-xs font-bold font-sans ${isSelected ? "text-white" : "text-gray-950"}`}>
                            {model.name}
                          </span>
                          <span className={`block text-[10px] mt-0.5 leading-relaxed truncate ${isSelected ? "text-slate-300" : "text-gray-400"}`}>
                            {model.desc}
                          </span>
                        </div>
                        <span className={`absolute right-3 top-3 px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase ${model.badgeBg}`}>
                          {model.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Source Material checkboxes */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>📄 Source Material</span>
                  {activeTopic?.uploadedMaterial && (
                    <span className="text-[10px] text-emerald-600 font-bold font-sans">
                      ✓ Custom material loaded
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {SOURCE_MATERIALS.map((source) => {
                    const isChecked = selectedSources.includes(source);
                    const isUploadedDocs = source === "Uploaded Documents";
                    const hasUploaded = !!activeTopic?.uploadedMaterial;

                    return (
                      <label
                        key={source}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                          isUploadedDocs && !hasUploaded
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={isUploadedDocs && !hasUploaded}
                          checked={isUploadedDocs ? (hasUploaded && isChecked) : isChecked}
                          onChange={() => toggleSource(source)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-gray-700 font-sans">{source}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Generation Style Radios */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  🎯 Generation Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENERATION_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        selectedStyle === style
                          ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Length & Output Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    📏 Note Length
                  </label>
                  <div className="space-y-1.5">
                    {NOTE_LENGTHS.map((len) => (
                      <label key={len} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="note-length"
                          checked={selectedLength === len}
                          onChange={() => setSelectedLength(len)}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-xs text-gray-700 font-sans font-medium">{len}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    🌐 Output Language
                  </label>
                  <div className="space-y-1.5">
                    {LANGUAGES.map((lang) => (
                      <label key={lang} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="note-lang"
                          checked={selectedLanguage === lang}
                          onChange={() => setSelectedLanguage(lang)}
                          className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-xs text-gray-700 font-sans font-medium">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Syllabus Sections to include */}
            <div className="bg-gray-50/50 border border-gray-200/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  📚 Syllabus Sections to include
                </label>
                <button
                  type="button"
                  onClick={toggleAllSections}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 tracking-wide font-sans uppercase"
                >
                  {selectedSections.length === SECTIONS_TO_INCLUDE.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
                {SECTIONS_TO_INCLUDE.map((section) => {
                  const isChecked = selectedSections.includes(section);
                  return (
                    <label
                      key={section}
                      className="flex items-center gap-2 px-2 py-1.5 bg-white border border-gray-200/80 rounded-lg text-xs font-medium cursor-pointer hover:border-blue-100 hover:bg-blue-50/10 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSection(section)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="text-gray-600 font-sans select-none">{section}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-400 bg-white p-2.5 rounded-lg border border-gray-200/60">
                <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed">
                  Sections like <strong>Constitutional Articles</strong>, <strong>CSS Tips</strong>, and <strong>Exam Questions</strong> generate precise, past-proven FPSC analytical nodes. We recommend keeping these active!
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <p className="text-xs text-gray-400 font-sans">
                Active Context: {activeTopic?.uploadedMaterial ? "Custom Knowledge Base Loaded" : "FPSC Standard Outline"}
              </p>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-md tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              Generate CSS Exam Notes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
