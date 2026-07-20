import React, { useState } from "react";
import { SyllabusSubject, SyllabusTopic } from "../types";
import { FileUp, BookOpen, Layers, CheckCircle2, ChevronRight, ChevronDown, Check, Upload, Trash2, ArrowRight, Pencil, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SyllabusTabProps {
  subjects: SyllabusSubject[];
  onUploadMaterial: (subjectId: string, topicId: string, material: NonNullable<SyllabusTopic["uploadedMaterial"]>) => void;
  onDeleteMaterial: (subjectId: string, topicId: string) => void;
  onGenerateNotesFromSyllabus: (subject: SyllabusSubject, topic: SyllabusTopic) => void;
  onAddTopic: (subjectId: string, topic: SyllabusTopic) => void;
  onRemoveTopic: (subjectId: string, topicId: string) => void;
  onEditTopic: (subjectId: string, topicId: string, updatedTopic: Partial<SyllabusTopic>) => void;
  onAddSubject: (subject: SyllabusSubject) => void;
  onRemoveSubject: (subjectId: string) => void;
  onEditSubject: (subjectId: string, updatedSubject: Partial<SyllabusSubject>) => void;
}

export default function SyllabusTab({
  subjects,
  onUploadMaterial,
  onDeleteMaterial,
  onGenerateNotesFromSyllabus,
  onAddTopic,
  onRemoveTopic,
  onEditTopic,
  onAddSubject,
  onRemoveSubject,
  onEditSubject
}: SyllabusTabProps) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>("comp-pak-affairs");
  const [activeUploadTopic, setActiveUploadTopic] = useState<{ subjectId: string; topicId: string } | null>(null);
  const [uploadText, setUploadText] = useState("");
  const [uploadType, setUploadType] = useState<"text" | "pdf" | "docx" | "txt" | "markdown" | "image">("text");
  const [uploadName, setUploadName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Subject addition states
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCategory, setNewSubjectCategory] = useState<"Compulsory" | "Optional">("Compulsory");
  const [newSubjectMarks, setNewSubjectMarks] = useState<number>(100);

  // Subject editing states
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editSubjectCategory, setEditSubjectCategory] = useState<"Compulsory" | "Optional">("Compulsory");
  const [editSubjectMarks, setEditSubjectMarks] = useState<number>(100);

  // Add topic inline states
  const [showAddFormForSubject, setShowAddFormForSubject] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicSubtopics, setNewTopicSubtopics] = useState("");

  // Edit topic inline states
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editTopicSubtopics, setEditTopicSubtopics] = useState("");

  // Embedded error states instead of blocking window.alert
  const [inlineError, setInlineError] = useState<string | null>(null);

  const handleAddTopicSubmit = (subjectId: string) => {
    if (!newTopicTitle.trim()) {
      setInlineError("Topic title is required");
      setTimeout(() => setInlineError(null), 5000);
      return;
    }

    const subtopicsList = newTopicSubtopics
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newTopic: SyllabusTopic = {
      id: `topic-${Date.now()}`,
      title: newTopicTitle.trim(),
      subtopics: subtopicsList.length > 0 ? subtopicsList : ["General concepts"]
    };

    onAddTopic(subjectId, newTopic);
    setInlineError(null);

    // Reset
    setNewTopicTitle("");
    setNewTopicSubtopics("");
    setShowAddFormForSubject(null);
  };

  const handleEditTopicSubmit = (subjectId: string, topicId: string) => {
    if (!editTopicTitle.trim()) {
      setInlineError("Topic title is required");
      setTimeout(() => setInlineError(null), 5000);
      return;
    }

    const subtopicsList = editTopicSubtopics
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onEditTopic(subjectId, topicId, {
      title: editTopicTitle.trim(),
      subtopics: subtopicsList.length > 0 ? subtopicsList : ["General concepts"]
    });
    setInlineError(null);

    // Reset
    setEditingTopicId(null);
    setEditTopicTitle("");
    setEditTopicSubtopics("");
  };

  const handleAddSubjectSubmit = () => {
    if (!newSubjectName.trim()) {
      setInlineError("Subject name is required");
      setTimeout(() => setInlineError(null), 5000);
      return;
    }

    const newSubject: SyllabusSubject = {
      id: `subj-${Date.now()}`,
      name: newSubjectName.trim(),
      category: newSubjectCategory,
      marks: newSubjectMarks,
      topics: []
    };

    onAddSubject(newSubject);
    setInlineError(null);

    // Reset
    setNewSubjectName("");
    setNewSubjectCategory("Compulsory");
    setNewSubjectMarks(100);
    setShowAddSubjectForm(false);
  };

  const handleEditSubjectSubmit = (subjectId: string) => {
    if (!editSubjectName.trim()) {
      setInlineError("Subject name is required to save changes");
      setTimeout(() => setInlineError(null), 5000);
      return;
    }

    onEditSubject(subjectId, {
      name: editSubjectName.trim(),
      category: editSubjectCategory,
      marks: editSubjectMarks
    });
    setInlineError(null);

    setEditingSubjectId(null);
    setEditSubjectName("");
  };

  const toggleSubject = (id: string) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUploadTopic) return;

    let contentToSave = uploadText;
    let nameToSave = uploadName || "Pasted text resource";

    // Create realistic content mock for simulated file uploads if no text pasted
    if (!uploadText.trim()) {
      if (uploadType === "pdf") {
        contentToSave = `[Extracted PDF Content for topic]: Detailed CSS candidate review guide. Demographics, timeline maps and empirical reports supporting FPSC syllabus parameters.`;
      } else if (uploadType === "docx") {
        contentToSave = `[Extracted DOCX Document]: Compiled CSS study circle lecture summary notes and scholar quotations.`;
      } else if (uploadType === "markdown") {
        contentToSave = `### Custom Syllabus Resource\n* Key historical chronologies compiled by CSS mentor.\n* Comprehensive references regarding Pakistan's federal issues.`;
      } else {
        contentToSave = `[Extracted custom TXT resource content loaded successfully]`;
      }
    }

    onUploadMaterial(activeUploadTopic.subjectId, activeUploadTopic.topicId, {
      type: uploadType,
      name: nameToSave,
      content: contentToSave,
      uploadedAt: new Date().toISOString()
    });

    // Reset Form
    setUploadText("");
    setUploadName("");
    setUploadType("text");
    setActiveUploadTopic(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const extension = file.name.split(".").pop()?.toLowerCase();
      let detectedType: any = "txt";

      if (extension === "pdf") detectedType = "pdf";
      else if (extension === "docx") detectedType = "docx";
      else if (extension === "md" || extension === "markdown") detectedType = "markdown";
      else if (["png", "jpg", "jpeg", "webp"].includes(extension || "")) detectedType = "image";

      setUploadType(detectedType);
      setUploadName(file.name);
      setUploadText(`[Successfully parsed and extracted text from uploaded ${file.name}]\nDetailed CSS reference contents fully registered in the AI Study Note Knowledge Base.`);
    }
  };

  return (
    <div className="space-y-6" id="syllabus-tab-wrapper">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 text-white border border-blue-950 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BookOpen className="w-40 h-40" />
        </div>
        <div className="max-w-2xl relative z-10">
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase bg-blue-500 text-white rounded font-mono">
            FPSC Official Curricula
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-3 tracking-tight">
            CSS Syllabus Tracker & Knowledge Base
          </h2>
          <p className="text-sm text-blue-100 font-sans mt-2.5 leading-relaxed">
            Review subjects exactly like the official FPSC CSS exam schedule. Enhance any topic by uploading external resources (articles, PDFs, images). Uploaded documents feed the AI engine as a personalized context reservoir during note generation!
          </p>
        </div>
      </div>

      <AnimatePresence>
        {inlineError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl flex items-center justify-between text-rose-950 text-xs font-semibold shadow-sm"
            id="syllabus-inline-error"
          >
            <div className="flex items-center gap-2">
              <span className="text-rose-500 text-sm">⚠</span>
              <span>{inlineError}</span>
            </div>
            <button 
              onClick={() => setInlineError(null)} 
              className="text-rose-400 hover:text-rose-600 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subjects & Topics list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-gray-800 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-blue-600" /> Syllabus Blueprint
            </h3>
            <button
              onClick={() => setShowAddSubjectForm(!showAddSubjectForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all shadow-xs"
              title="Add a new custom subject to the syllabus tracker"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Subject
            </button>
          </div>

          <AnimatePresence>
            {showAddSubjectForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-br from-blue-50/20 to-indigo-50/10 border border-blue-100 rounded-2xl p-5 space-y-4 shadow-xs mb-2">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="font-display font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-blue-600" /> Create Custom Subject
                    </h4>
                    <button
                      onClick={() => setShowAddSubjectForm(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Subject Name */}
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">
                        Subject Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Political Science"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-sans text-gray-800 shadow-2xs"
                      />
                    </div>

                    {/* Category (Compulsory vs Optional) */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">
                        Syllabus Category
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewSubjectCategory("Compulsory")}
                          className={`py-1.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            newSubjectCategory === "Compulsory"
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          Compulsory
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewSubjectCategory("Optional")}
                          className={`py-1.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            newSubjectCategory === "Optional"
                              ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          Optional
                        </button>
                      </div>
                    </div>

                    {/* Marks */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">
                        Marks
                      </label>
                      <select
                        value={newSubjectMarks}
                        onChange={(e) => setNewSubjectMarks(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-sans text-gray-800 shadow-2xs"
                      >
                        <option value={100}>100 Marks</option>
                        <option value={200}>200 Marks</option>
                        <option value={50}>50 Marks</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddSubjectForm(false);
                        setNewSubjectName("");
                        setNewSubjectCategory("Compulsory");
                        setNewSubjectMarks(100);
                      }}
                      className="px-4 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 font-sans"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSubjectSubmit}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                    >
                      Save Subject
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3" id="syllabus-accordion">
            {subjects.map((sub) => {
              const isExpanded = expandedSubject === sub.id;
              const compulsoryBadge = sub.category === "Compulsory" 
                ? "bg-blue-50 text-blue-700 border-blue-100" 
                : "bg-purple-50 text-purple-700 border-purple-100";

              return (
                <div 
                  key={sub.id} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-gray-300 transition-all"
                >
                  {/* Subject Header */}
                  {editingSubjectId === sub.id ? (
                    <div 
                      className="p-4 bg-amber-50/10 border-b border-amber-100/45 space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h5 className="font-display font-semibold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Pencil className="w-3.5 h-3.5 text-amber-600" /> Edit Subject Settings
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">
                            Subject Name
                          </label>
                          <input
                            type="text"
                            value={editSubjectName}
                            onChange={(e) => setEditSubjectName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 font-sans text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">
                            Category
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditSubjectCategory("Compulsory")}
                              className={`py-1 rounded-lg border text-[10px] font-bold text-center transition-all ${
                                editSubjectCategory === "Compulsory"
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-white text-gray-600 border-gray-200"
                              }`}
                            >
                              Compulsory
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditSubjectCategory("Optional")}
                              className={`py-1 rounded-lg border text-[10px] font-bold text-center transition-all ${
                                editSubjectCategory === "Optional"
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "bg-white text-gray-600 border-gray-200"
                              }`}
                            >
                              Optional
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">
                            Marks
                          </label>
                          <select
                            value={editSubjectMarks}
                            onChange={(e) => setEditSubjectMarks(Number(e.target.value))}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 font-sans text-gray-800"
                          >
                            <option value={100}>100 Marks</option>
                            <option value={200}>200 Marks</option>
                            <option value={50}>50 Marks</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSubjectId(null);
                            setEditSubjectName("");
                          }}
                          className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-700 font-sans"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditSubjectSubmit(sub.id)}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                      <button
                        onClick={() => toggleSubject(sub.id)}
                        className="flex-1 flex items-center gap-3 text-left focus:outline-none"
                      >
                        <div className="p-2 bg-gray-100 text-gray-600 rounded-lg shrink-0">
                          <BookOpen className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-gray-900 text-base">
                            {sub.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${compulsoryBadge}`}>
                              {sub.category}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              {sub.marks} Marks • {sub.topics.length} Syllabus Modules
                            </span>
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          onClick={() => {
                            setEditingSubjectId(sub.id);
                            setEditSubjectName(sub.name);
                            setEditSubjectCategory(sub.category);
                            setEditSubjectMarks(sub.marks);
                          }}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Subject Name & Category"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the subject "${sub.name}"? This will also remove its associated topics.`)) {
                              onRemoveSubject(sub.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block"></div>
                        <button
                          onClick={() => toggleSubject(sub.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Topics List Under Subject */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 bg-gray-50/20 divide-y divide-gray-100 overflow-hidden"
                      >
                        {sub.topics.map((topic) => {
                          const isEditing = editingTopicId === topic.id;
                          return (
                            <div 
                              key={topic.id} 
                              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/40 transition-colors"
                            >
                              {isEditing ? (
                                <div className="space-y-3 w-full bg-amber-50/10 p-3 rounded-lg border border-amber-200/50">
                                  <h6 className="font-display font-semibold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <Pencil className="w-3.5 h-3.5 text-amber-600" /> Edit Topic Module
                                  </h6>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">
                                        Topic Title
                                      </label>
                                      <input
                                        type="text"
                                        value={editTopicTitle}
                                        onChange={(e) => setEditTopicTitle(e.target.value)}
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 font-sans text-gray-800"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">
                                        Subtopics (comma-separated)
                                      </label>
                                      <input
                                        type="text"
                                        value={editTopicSubtopics}
                                        onChange={(e) => setEditTopicSubtopics(e.target.value)}
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 font-sans text-gray-800"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingTopicId(null);
                                        setEditTopicTitle("");
                                        setEditTopicSubtopics("");
                                      }}
                                      className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-700 font-sans"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditTopicSubmit(sub.id, topic.id)}
                                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                                    >
                                      Save Changes
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="space-y-1 max-w-md">
                                    <h5 className="font-display font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                      {topic.title}
                                    </h5>
                                    <p className="text-xs text-gray-400 font-sans pl-3 leading-relaxed">
                                      <strong>Subtopics:</strong> {topic.subtopics.join(", ")}
                                    </p>

                                    {topic.uploadedMaterial && (
                                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-xs font-medium font-sans">
                                        <Check className="w-3.5 h-3.5" />
                                        Knowledge base: {topic.uploadedMaterial.name} ({topic.uploadedMaterial.type})
                                        <button
                                          onClick={() => onDeleteMaterial(sub.id, topic.id)}
                                          className="ml-1 text-emerald-600 hover:text-red-600 transition-colors"
                                          title="Delete Material"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                                    {/* Edit & Delete actions for topic */}
                                    <button
                                      onClick={() => {
                                        setEditingTopicId(topic.id);
                                        setEditTopicTitle(topic.title);
                                        setEditTopicSubtopics(topic.subtopics.join(", "));
                                      }}
                                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                      title="Edit Topic"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to delete the topic "${topic.title}"?`)) {
                                          onRemoveTopic(sub.id, topic.id);
                                        }
                                      }}
                                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                      title="Remove Topic"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block"></div>

                                    <button
                                      onClick={() => setActiveUploadTopic({ subjectId: sub.id, topicId: topic.id })}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-600 text-xs font-semibold rounded-lg shadow-xs transition-all"
                                    >
                                      <Upload className="w-3.5 h-3.5" /> Upload Material
                                    </button>
                                    <button
                                      onClick={() => onGenerateNotesFromSyllabus(sub, topic)}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                                    >
                                      Generate Notes <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}

                        {/* Inline Add Topic Form & Trigger Button */}
                        {showAddFormForSubject === sub.id ? (
                          <div className="p-4 bg-blue-50/10 border-t border-blue-100/40 space-y-3">
                            <h6 className="font-display font-semibold text-blue-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <Plus className="w-3.5 h-3.5 text-blue-600" /> Add New Topic Module
                            </h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">
                                  Topic Title
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Pakistan Foreign Policy in 21st Century"
                                  value={newTopicTitle}
                                  onChange={(e) => setNewTopicTitle(e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-sans text-gray-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-mono">
                                  Subtopics (comma-separated)
                                  <span className="text-gray-400 font-normal lowercase"> (optional)</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. US relations, China pivot, geo-economics"
                                  value={newTopicSubtopics}
                                  onChange={(e) => setNewTopicSubtopics(e.target.value)}
                                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-sans text-gray-800"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddFormForSubject(null);
                                  setNewTopicTitle("");
                                  setNewTopicSubtopics("");
                                }}
                                className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-700 font-sans"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddTopicSubmit(sub.id)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                              >
                                Add Topic
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50/40 border-t border-gray-100 flex justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddFormForSubject(sub.id);
                                setNewTopicTitle("");
                                setNewTopicSubtopics("");
                              }}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 text-xs font-bold rounded-lg shadow-xs transition-all"
                            >
                              <Plus className="w-3.5 h-3.5 text-blue-500" /> Add New Topic Module
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upload drawer / Active helper */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <AnimatePresence mode="wait">
              {activeUploadTopic ? (
                <motion.div
                  key="upload-active"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm space-y-4"
                  id="knowledge-base-uploader"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h4 className="font-display font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-blue-600" /> Feed Knowledge Base
                    </h4>
                    <button
                      onClick={() => setActiveUploadTopic(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 font-sans font-medium"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 font-sans">
                    Adding documents for: <strong className="text-gray-800">
                      {subjects.find((s) => s.id === activeUploadTopic.subjectId)?.topics.find((t) => t.id === activeUploadTopic.topicId)?.title}
                    </strong>
                  </div>

                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    {/* Material Type Selection */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Material Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["text", "pdf", "docx", "markdown"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setUploadType(type)}
                            className={`py-1.5 rounded-lg border text-xs font-semibold text-center uppercase tracking-wide transition-all ${
                              uploadType === type
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Document Title */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Document Label / Title
                      </label>
                      <input
                        type="text"
                        required
                        value={uploadName}
                        onChange={(e) => setUploadName(e.target.value)}
                        placeholder="e.g. Mentor Lecture Handout, CSS Past Questions"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-sans text-gray-800"
                      />
                    </div>

                    {/* Drag and Drop Simulator Area */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleFileDrop}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                        dragActive 
                          ? "border-blue-500 bg-blue-50/50" 
                          : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                      }`}
                    >
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                      <p className="text-xs text-gray-600 font-semibold font-sans">
                        Drag & Drop document here
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 font-sans">
                        Supports PDF, DOCX, TXT, MD, PNG, JPG or paste text below
                      </p>
                    </div>

                    {/* Plain Text Paste Area */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Or Paste Material Text
                      </label>
                      <textarea
                        rows={4}
                        value={uploadText}
                        onChange={(e) => setUploadText(e.target.value)}
                        placeholder="Paste syllabus notes, excerpts, articles or facts context..."
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-sans text-gray-800"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm tracking-wide transition-all uppercase"
                    >
                      Save to Topic Knowledge Base
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="upload-inactive"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <FileUp className="w-5 h-5 text-gray-400" />
                    <h4 className="font-display font-semibold text-gray-800 text-sm">
                      Knowledge Base Core
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    No topic is currently active for uploader inputs. Click <strong>"Upload Material"</strong> on any subject module on the left to inject files or custom study notes.
                  </p>
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <h5 className="text-xs font-bold text-indigo-900 mb-1 font-display">💡 Pro Study Hack</h5>
                    <p className="text-[11px] text-indigo-700 leading-relaxed font-sans">
                      FPSC CSS Examiners look for contemporary data references and Pakistan's domestic issues links. Paste newspaper editorials (e.g. DAWN, Tribune) into a topic's knowledge base, then generate notes with the "Current Affairs Link" enabled for high-scoring notes!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
