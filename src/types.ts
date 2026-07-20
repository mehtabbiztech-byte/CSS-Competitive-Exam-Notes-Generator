export interface StudyNote {
  id: string;
  subjectId: string;
  topicId: string;
  title: string;
  subjectName: string;
  category: "Compulsory" | "Optional";
  style: string;
  length: string;
  language: string;
  content: string; // Markdown text
  createdAt: string;
  bookmarked: boolean;
  progress: number; // 0 to 100
  sectionsIncluded: string[];
  model?: string;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  subtopics: string[];
  uploadedMaterial?: {
    type: "pdf" | "docx" | "txt" | "markdown" | "image" | "text";
    name: string;
    content: string;
    uploadedAt: string;
  };
}

export interface SyllabusSubject {
  id: string;
  name: string;
  category: "Compulsory" | "Optional";
  marks: number;
  topics: SyllabusTopic[];
}

export interface WordPopupInfo {
  word: string;
  englishMeaning: string;
  sindhiMeaning: string;
  urduMeaning: string;
  romanUrduMeaning: string;
  definition: string;
  partOfSpeech: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  audioPronunciationUrl?: string;
  relatedTopics: string[];
  phonetic?: string;
  mnemonic?: string;
  cssUsage?: string;
  difficulty?: string;
}

export interface UserProgress {
  subjectsCompleted: Record<string, number>; // subjectId -> progress percentage
  totalNotesGenerated: number;
  studyTimeTodayMinutes: number;
  dailyGoalMinutes: number;
  streakDays: number;
  recentSearches: string[];
  bookmarkedNoteIds: string[];
  recentlyOpenedNoteIds: string[];
}
