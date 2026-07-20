import React, { useState, useEffect } from "react";
import { WordPopupInfo } from "../types";
import { Volume2, X, Sparkles, BookOpen, Layers, Check, Star, HelpCircle, Award, Compass, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Interactive progressive loader for initial fast lookup
export function DynamicDictionaryLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 350);
    const timer2 = setTimeout(() => setStep(2), 700);
    const timer3 = setTimeout(() => setStep(3), 1100);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 gap-5 text-center" id="dict-loading">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="space-y-3 max-w-sm w-full">
        <h4 className="text-sm font-bold text-slate-800 font-sans tracking-tight">CSS Smart Lexicon Search</h4>
        <div className="space-y-2 text-left bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-sans">
          <div className="flex items-center gap-2">
            {step >= 1 ? (
              <span className="text-emerald-600 font-bold">✓</span>
            ) : (
              <span className="inline-block w-2.5 h-2.5 rounded-full border border-indigo-400 border-t-transparent animate-spin"></span>
            )}
            <span className={`${step >= 1 ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}>
              Finding English Meaning...
            </span>
          </div>
          <div className="flex items-center gap-2">
            {step >= 2 ? (
              <span className="text-emerald-600 font-bold">✓</span>
            ) : step >= 1 ? (
              <span className="inline-block w-2.5 h-2.5 rounded-full border border-indigo-400 border-t-transparent animate-spin"></span>
            ) : (
              <span className="text-slate-300">•</span>
            )}
            <span className={`${step >= 2 ? "text-slate-400 line-through" : step >= 1 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
              Translating to Urdu & Sindhi...
            </span>
          </div>
          <div className="flex items-center gap-2">
            {step >= 3 ? (
              <span className="text-emerald-600 font-bold">✓</span>
            ) : step >= 2 ? (
              <span className="inline-block w-2.5 h-2.5 rounded-full border border-indigo-400 border-t-transparent animate-spin"></span>
            ) : (
              <span className="text-slate-300">•</span>
            )}
            <span className={`${step >= 3 ? "text-slate-400 line-through" : step >= 2 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
              Analyzing Part of Speech & Phonetics...
            </span>
          </div>
          <div className="flex items-center gap-2">
            {step >= 3 ? (
              <span className="inline-block w-2.5 h-2.5 rounded-full border border-indigo-400 border-t-transparent animate-spin"></span>
            ) : (
              <span className="text-slate-300">•</span>
            )}
            <span className={`${step >= 3 ? "text-slate-700 font-medium" : "text-slate-400"}`}>
              Preparing background rich modules...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WordDictionaryPopupProps {
  wordInfo: WordPopupInfo | null;
  isLoading: boolean;
  isLoadingRich?: boolean;
  onClose: () => void;
  error: string | null;
}

export default function WordDictionaryPopup({
  wordInfo,
  isLoading,
  isLoadingRich = false,
  onClose,
  error
}: WordDictionaryPopupProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync favorite status from localStorage when wordInfo changes
  useEffect(() => {
    if (wordInfo) {
      try {
        const favs = localStorage.getItem("css_favorite_words");
        const parsed = favs ? JSON.parse(favs) : [];
        setIsFavorite(parsed.includes(wordInfo.word.toLowerCase()));
      } catch {
        setIsFavorite(false);
      }
    }
  }, [wordInfo]);

  const toggleFavorite = () => {
    if (!wordInfo) return;
    try {
      const favs = localStorage.getItem("css_favorite_words");
      let parsed = favs ? JSON.parse(favs) : [];
      const lowerWord = wordInfo.word.toLowerCase();
      if (parsed.includes(lowerWord)) {
        parsed = parsed.filter((w: string) => w !== lowerWord);
        setIsFavorite(false);
      } else {
        parsed.push(lowerWord);
        setIsFavorite(true);
      }
      localStorage.setItem("css_favorite_words", JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    }
  };

  const speakWord = () => {
    if (!wordInfo || !wordInfo.word) return;
    try {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(wordInfo.word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
      setIsPlayingAudio(false);
    }
  };

  return (
    <AnimatePresence>
      {(isLoading || wordInfo || error) && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          id="dictionary-modal-container"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-full max-w-2xl overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-2xl"
            id="dictionary-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span className="font-display font-semibold text-sm text-slate-700 tracking-wide uppercase">
                  CSS Smart Lexicon & Dictionary
                </span>
              </div>
              <div className="flex items-center gap-2">
                {wordInfo && (
                  <button
                    onClick={toggleFavorite}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isFavorite 
                        ? "bg-amber-50 border-amber-200 text-amber-500 scale-105" 
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-transparent"
                    }`}
                    title={isFavorite ? "Remove from Favorite Vocabulary" : "Save to Favorite Vocabulary"}
                  >
                    <Star className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
              {isLoading ? (
                <DynamicDictionaryLoader />
              ) : error ? (
                <div className="py-6 text-center" id="dict-error">
                  <div className="inline-flex p-3 rounded-full bg-red-50 text-red-500 mb-3">
                    <X className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">Lookup Failed</p>
                  <p className="text-xs text-slate-500 mt-1">{error}</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-4 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : wordInfo ? (
                <div className="space-y-5" id="dict-results">
                  
                  {/* Word title, Pronunciation, part of speech */}
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-serif text-3xl font-extrabold text-slate-900 tracking-tight capitalize">
                          {wordInfo.word}
                        </h3>
                        <button
                          onClick={speakWord}
                          className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                            isPlayingAudio
                              ? "bg-indigo-100 text-indigo-700 scale-110 shadow-sm"
                              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                          }`}
                          title="Listen Pronunciation"
                        >
                          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce" : ""}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                          {wordInfo.partOfSpeech}
                        </span>
                        {wordInfo.phonetic && (
                          <span className="text-xs text-slate-500 font-mono italic">
                            {wordInfo.phonetic}
                          </span>
                        )}
                        {wordInfo.difficulty && (
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            wordInfo.difficulty.toLowerCase().includes("easy") 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : wordInfo.difficulty.toLowerCase().includes("medium")
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            {wordInfo.difficulty} Vocabulary
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Translations Group */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-right max-w-[280px] w-full sm:w-auto">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-end gap-1 font-sans">
                        <Sparkles className="w-3 h-3 text-indigo-500" /> CSS Translations
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-400 text-[10px] font-mono">Urdu:</span>
                          <span className="font-semibold text-slate-800 font-serif text-sm">{wordInfo.urduMeaning}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-400 text-[10px] font-mono">Sindhi:</span>
                          <span className="font-semibold text-slate-800 font-serif text-sm">{wordInfo.sindhiMeaning}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-400 text-[10px] font-mono">Roman Urdu:</span>
                          <span className="font-semibold text-slate-600 font-mono text-xs">"{wordInfo.romanUrduMeaning}"</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background Rich Content Loading Banner */}
                  {isLoadingRich && (
                    <div className="bg-indigo-50/60 border border-indigo-100/50 text-indigo-950 px-4 py-2.5 rounded-xl flex items-center gap-2.5 animate-pulse">
                      <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
                      <div className="text-[11px] font-medium font-sans flex-1 flex flex-wrap gap-x-2 gap-y-0.5">
                        <span className="text-emerald-700 font-bold">✓ Essential Meanings Loaded</span>
                        <span className="text-indigo-400">•</span>
                        <span className="text-indigo-600 animate-pulse">Generating rich CSS exam context (mnemonics, examiner tips)...</span>
                      </div>
                    </div>
                  )}

                  {/* Definition / Meaning in English */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50/50 border border-indigo-100/55 rounded-xl p-4">
                      <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1.5 font-display flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" /> Concise English Meaning
                      </h4>
                      <p className="text-sm font-semibold text-slate-800 font-sans leading-relaxed">
                        {wordInfo.englishMeaning}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-display flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Academic Definition
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {wordInfo.definition}
                      </p>
                    </div>
                  </div>

                  {/* Mnemonic and Exam-oriented CSS Usage Advice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoadingRich || wordInfo.mnemonic ? (
                      <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4 min-h-[100px] flex flex-col">
                        <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 font-display flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Memorization Mnemonic
                        </h4>
                        {isLoadingRich && !wordInfo.mnemonic ? (
                          <div className="space-y-2 animate-pulse flex-1 flex flex-col justify-center">
                            <div className="h-3 bg-amber-200/50 rounded w-5/6"></div>
                            <div className="h-3 bg-amber-200/50 rounded w-2/3"></div>
                          </div>
                        ) : (
                          <p className="text-xs text-amber-950 font-sans leading-relaxed flex-1">
                            {wordInfo.mnemonic}
                          </p>
                        )}
                      </div>
                    ) : null}

                    {isLoadingRich || wordInfo.cssUsage ? (
                      <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 min-h-[100px] flex flex-col">
                        <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5 font-display flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-emerald-600" /> Examiner scoring tip
                        </h4>
                        {isLoadingRich && !wordInfo.cssUsage ? (
                          <div className="space-y-2 animate-pulse flex-1 flex flex-col justify-center">
                            <div className="h-3 bg-emerald-200/55 rounded w-5/6"></div>
                            <div className="h-3 bg-emerald-200/55 rounded w-2/3"></div>
                          </div>
                        ) : (
                          <p className="text-xs text-emerald-950 font-sans leading-relaxed font-medium flex-1">
                            {wordInfo.cssUsage}
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Example Sentence Card */}
                  {isLoadingRich || wordInfo.exampleSentence ? (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 min-h-[80px] flex flex-col justify-between">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-display flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                        Standard Usage Sentence (CSS Paper Template)
                      </h4>
                      {isLoadingRich && !wordInfo.exampleSentence ? (
                        <div className="space-y-2 animate-pulse flex-1 flex flex-col justify-center">
                          <div className="h-3 bg-slate-200 rounded w-11/12"></div>
                        </div>
                      ) : (
                        <p className="text-sm italic font-serif text-slate-800 leading-relaxed">
                          "{wordInfo.exampleSentence}"
                        </p>
                      )}
                    </div>
                  ) : null}

                  {/* Synonyms & Antonyms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                        FPSC Synonyms (High Scoring)
                      </span>
                      {isLoadingRich && wordInfo.synonyms.length === 0 ? (
                        <div className="flex gap-1 animate-pulse">
                          <div className="h-6 bg-slate-100 rounded-md w-16"></div>
                          <div className="h-6 bg-slate-100 rounded-md w-20"></div>
                          <div className="h-6 bg-slate-100 rounded-md w-14"></div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {wordInfo.synonyms.map((syn, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md text-xs font-sans transition-colors font-medium"
                            >
                              {syn}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                        FPSC Antonyms
                      </span>
                      {isLoadingRich && wordInfo.antonyms.length === 0 ? (
                        <div className="flex gap-1 animate-pulse">
                          <div className="h-6 bg-slate-100 rounded-md w-16"></div>
                          <div className="h-6 bg-slate-100 rounded-md w-14"></div>
                          <div className="h-6 bg-slate-100 rounded-md w-18"></div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {wordInfo.antonyms.map((ant, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 rounded-md text-xs font-sans transition-colors font-medium"
                            >
                              {ant}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related CSS Topics */}
                  {isLoadingRich || wordInfo.relatedTopics.length > 0 ? (
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-display flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-slate-400" />
                        Interdisciplinary Syllabus Applications
                      </h4>
                      {isLoadingRich && wordInfo.relatedTopics.length === 0 ? (
                        <div className="flex gap-1.5 animate-pulse">
                          <div className="h-6 bg-indigo-50/60 rounded-full w-28"></div>
                          <div className="h-6 bg-indigo-50/60 rounded-full w-24"></div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {wordInfo.relatedTopics.map((topic, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 px-3 py-1 bg-indigo-50/60 text-indigo-700 border border-indigo-100/50 rounded-full text-xs font-semibold font-sans"
                            >
                              <Check className="w-3 h-3 text-indigo-500" />
                              {topic}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all uppercase tracking-wider"
              >
                Done Reading
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
