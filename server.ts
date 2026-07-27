import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" })); // support large document content uploads

const PORT = 3000;

// Lazy initialization of GoogleGenAI client to prevent startup crash if GEMINI_API_KEY is missing
let aiClient: any = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
    throw new Error("GEMINI_API_KEY environment variable is missing on Vercel. Please go to Vercel Dashboard -> Project Settings -> Environment Variables, add GEMINI_API_KEY, and Redeploy.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper function to call Gemini API with exponential backoff retry and model fallback
async function generateContentWithRetryAndFallback(params: {
  model: string;
  contents: any;
  config?: any;
}) {
  const ai = getGeminiClient();
  let lastError: any = null;
  const modelsToTry = [params.model];
  
  // If primary model is gemini-3.5-flash, add fallback models to ensure robust recovery
  if (params.model === "gemini-3.5-flash") {
    modelsToTry.push("gemini-3.1-flash-lite");
    modelsToTry.push("gemini-flash-latest");
  }

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    const hasFallback = i < modelsToTry.length - 1;
    let attempt = 0;
    const maxRetries = 3;
    const initialDelay = 1000;

    while (attempt <= maxRetries) {
      try {
        console.log(`[Gemini API] Requesting ${currentModel} (attempt ${attempt + 1}/${maxRetries + 1})...`);
        const response = await ai.models.generateContent({
          ...params,
          model: currentModel,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        attempt++;
        
        console.error(`[Gemini API Error] Model: ${currentModel}, Attempt: ${attempt}, Error:`, error?.message || error);
        
        const isRateLimit = 
          error?.status === 429 || 
          error?.statusCode === 429 ||
          String(error?.message || "").includes("429");

        const isUnavailable = 
          error?.status === 503 || 
          error?.statusCode === 503 || 
          String(error?.message || "").includes("503") ||
          String(error?.message || "").toLowerCase().includes("temporary") ||
          String(error?.message || "").toLowerCase().includes("high demand") ||
          String(error?.message || "").toLowerCase().includes("unavailable") ||
          String(error?.message || "").toLowerCase().includes("service_unavailable");

        const isHardFailure = 
          error?.status === 404 || 
          error?.statusCode === 404 ||
          error?.status === 403 ||
          error?.statusCode === 403 ||
          error?.status === 400 ||
          error?.statusCode === 400 ||
          String(error?.message || "").toLowerCase().includes("not found") ||
          String(error?.message || "").toLowerCase().includes("not enabled") ||
          String(error?.message || "").toLowerCase().includes("permission") ||
          String(error?.message || "").toLowerCase().includes("forbidden") ||
          String(error?.message || "").toLowerCase().includes("bad request") ||
          String(error?.message || "").toLowerCase().includes("not supported") ||
          String(error?.message || "").toLowerCase().includes("unsupported");

        const isQuotaExceeded = 
          String(error?.message || "").toLowerCase().includes("quota") ||
          String(error?.message || "").toLowerCase().includes("exhausted") ||
          String(error?.message || "").toLowerCase().includes("limit");

        // If it's any rate limit, quota, unavailable, or hard failure, and we have a fallback model,
        // switch immediately to avoid long waiting delays on exhausted quotas.
        if ((isRateLimit || isUnavailable || isHardFailure || isQuotaExceeded) && hasFallback) {
          console.warn(`[Gemini API] Switchable error encountered on ${currentModel}: ${error?.message || error}. Switching IMMEDIATELY to fallback model ${modelsToTry[i + 1]}...`);
          break; // break the retry loop, moving to next currentModel in outer loop
        }

        // If no fallback models remain, handle rate limit or unavailable with exponential backoff
        if ((isRateLimit || isUnavailable) && attempt <= maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt - 1);
          console.warn(`[Gemini API] ${isRateLimit ? "429 Rate Limit" : "503 Unavailable"} encountered on final fallback model ${currentModel}. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // For any other non-retryable error, throw immediately
        throw error;
      }
    }
  }
  throw lastError || new Error("Failed after trying fallback models");
}

// --------------------------------------------------------
// API ENDPOINTS
// --------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// Dictionary/Vocabulary popup lookup for clicked words
app.post("/api/dictionary", async (req, res) => {
  try {
    const { word, context, subject, mode = "all" } = req.body;
    if (!word) {
      return res.status(400).json({ error: "Word parameter is required." });
    }

    const ai = getGeminiClient();
    let prompt = "";
    let responseSchema: any = {};

    if (mode === "essential") {
      prompt = `Provide a fast, concise dictionary translation, definition, and grammatical analysis of the following word in the context of CSS (Central Superior Services) competitive exam preparation in Pakistan.
Word: "${word}"
Sentence context: "${context || 'General CSS preparation usage'}"
Subject matter: "${subject || 'Pakistan Affairs / Islamic Studies'}"`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          englishMeaning: { type: Type.STRING, description: "A concise English meaning or explanation of the word." },
          sindhiMeaning: { type: Type.STRING, description: "Sindhi translation/meaning in Sindhi script." },
          urduMeaning: { type: Type.STRING, description: "Urdu translation/meaning in Nastaliq/Urdu script." },
          romanUrduMeaning: { type: Type.STRING, description: "Urdu meaning transliterated into English letters (Roman Urdu)." },
          definition: { type: Type.STRING, description: "A detailed academic definition of the word in a scholastic context." },
          partOfSpeech: { type: Type.STRING, description: "The part of speech (e.g., Noun, Verb, Adjective, Adverb)." },
          phonetic: { type: Type.STRING, description: "Phonetic spelling/pronunciation guide, e.g. /sɒv.rən.ti/ or IPA equivalent." },
          difficulty: { type: Type.STRING, description: "Word difficulty level for high-school or post-grad CSS candidates: 'Easy', 'Medium', or 'Hard'." }
        },
        required: [
          "word",
          "englishMeaning",
          "sindhiMeaning",
          "urduMeaning",
          "romanUrduMeaning",
          "definition",
          "partOfSpeech",
          "phonetic",
          "difficulty"
        ]
      };
    } else if (mode === "rich") {
      prompt = `Provide advanced, high-yield learning contexts for the following word, including standard CSS usage sentence, synonyms, antonyms, related topics, mnemonic, and examiner scoring tips.
Word: "${word}"
Sentence context: "${context || 'General CSS preparation usage'}"
Subject matter: "${subject || 'Pakistan Affairs / Islamic Studies'}"`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          exampleSentence: { type: Type.STRING, description: "An elegant, exam-oriented example sentence using this word in CSS context." },
          synonyms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "High-yield vocabulary synonyms relevant for CSS English Precis exam."
          },
          antonyms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "High-yield antonyms."
          },
          relatedTopics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-3 related topics in the CSS Syllabus."
          },
          mnemonic: { type: Type.STRING, description: "A highly memorable, creative memory association trick or anchor word to help CSS aspirants retain this vocabulary." },
          cssUsage: { type: Type.STRING, description: "Exam-oriented advice on how this word scores marks in FPSC essays, précis, or general papers." }
        },
        required: [
          "word",
          "exampleSentence",
          "synonyms",
          "antonyms",
          "relatedTopics",
          "mnemonic",
          "cssUsage"
        ]
      };
    } else {
      prompt = `Provide the translation, definition, meanings, and grammatical analysis of the following word in the context of CSS (Central Superior Services) competitive exam preparation in Pakistan.
Word: "${word}"
Sentence context: "${context || 'General CSS preparation usage'}"
Subject matter: "${subject || 'Pakistan Affairs / Islamic Studies'}"`;

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          englishMeaning: { type: Type.STRING, description: "A concise English meaning or explanation of the word." },
          sindhiMeaning: { type: Type.STRING, description: "Sindhi translation/meaning in Sindhi script." },
          urduMeaning: { type: Type.STRING, description: "Urdu translation/meaning in Nastaliq/Urdu script." },
          romanUrduMeaning: { type: Type.STRING, description: "Urdu meaning transliterated into English letters (Roman Urdu)." },
          definition: { type: Type.STRING, description: "A detailed academic definition of the word in a scholastic context." },
          partOfSpeech: { type: Type.STRING, description: "The part of speech (e.g., Noun, Verb, Adjective, Adverb)." },
          exampleSentence: { type: Type.STRING, description: "An elegant, exam-oriented example sentence using this word in CSS context." },
          synonyms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "High-yield vocabulary synonyms relevant for CSS English Precis exam."
          },
          antonyms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "High-yield antonyms."
          },
          relatedTopics: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-3 related topics in the CSS Syllabus."
          },
          phonetic: { type: Type.STRING, description: "Phonetic spelling/pronunciation guide, e.g. /sɒv.rən.ti/ or IPA equivalent." },
          mnemonic: { type: Type.STRING, description: "A highly memorable, creative memory association trick or anchor word to help CSS aspirants retain this vocabulary." },
          cssUsage: { type: Type.STRING, description: "Exam-oriented advice on how this word scores marks in FPSC essays, précis, or general papers." },
          difficulty: { type: Type.STRING, description: "Word difficulty level for high-school or post-grad CSS candidates: 'Easy', 'Medium', or 'Hard'." }
        },
        required: [
          "word",
          "englishMeaning",
          "sindhiMeaning",
          "urduMeaning",
          "romanUrduMeaning",
          "definition",
          "partOfSpeech",
          "exampleSentence",
          "synonyms",
          "antonyms",
          "relatedTopics",
          "phonetic",
          "mnemonic",
          "cssUsage",
          "difficulty"
        ]
      };
    }

    const response = await generateContentWithRetryAndFallback({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert multilingual academic dictionary specialized in English, Urdu, Sindhi, and Roman Urdu. Provide accurate meanings, translations, definitions, parts of speech, synonyms, antonyms, and related CSS study topics. Also provide pronunciation/phonetics, mnemonics, CSS-specific exam usage advice, and a difficulty rating (Easy, Medium, Hard) relative to CSS candidates.",
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    const data = JSON.parse(response.text?.trim() || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Dictionary API error:", error);
    res.status(500).json({ error: error.message || "Failed to resolve word analysis." });
  }
});

// AI Tutor chat proxy endpoint
app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { topic, content, question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question parameter is required." });
    }

    const ai = getGeminiClient();
    const prompt = `You are an elite academic tutor for the CSS (Central Superior Services) competitive exam in Pakistan.
The student is currently reading study notes on the topic: "${topic || "CSS Preparation Topic"}".

Notes Content context (first 5000 characters):
"""
${content ? content.substring(0, 5000) : "No specific notes content loaded."}
"""

Student's question: "${question}"

Please answer in a highly professional, academic, exam-oriented manner. Provide precise explanations, structure points logically, and offer specific advice on how to present this argument in FPSC CSS answers (e.g., Essay, Pakistan Affairs, or Islamic Studies). Use clear paragraphs or bullet points.`;

    const response = await generateContentWithRetryAndFallback({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite CSS exam tutor from the Pakistan Civil Academy. Be precise, academic, encouraging, and authoritative. Answer concisely but deeply.",
      }
    });

    res.json({ answer: response.text || "Sorry, I am unable to analyze this question right now." });
  } catch (error: any) {
    console.error("AI Tutor error:", error);
    res.status(500).json({ error: error.message || "Failed to query AI Tutor." });
  }
});

// Generate CSS Exam Notes based on user selections
app.post("/api/generate-notes", async (req, res) => {
  try {
    const {
      subjectName,
      topicName,
      category,
      style,
      length,
      language,
      includedSections,
      knowledgeBaseText,
      model // "gemini-2.5-pro" | "gpt-5.5" | "claude"
    } = req.body;

    if (!subjectName || !topicName) {
      return res.status(400).json({ error: "subjectName and topicName are required." });
    }

    const ai = getGeminiClient();
    let knowledgeBaseContextPrompt = "";
    if (knowledgeBaseText && knowledgeBaseText.trim().length > 0) {
      knowledgeBaseContextPrompt = `\nCRITICAL CONTEXT: The candidate has uploaded a custom resource or knowledge base. Please integrate and prioritize this material for details, figures, and facts:\n"""\n${knowledgeBaseText.substring(0, 8000)}\n"""`;
    }

    let modelPersonaInstruction = "";
    if (model === "gpt-5.5") {
      modelPersonaInstruction = `\nSTYLE PERSONA: You are operating as the "GPT-5.5" high-reasoning engine. Structure your response with flawless analytical frameworks, clear hierarchical categorizations, step-by-step logic, and bulletproof strategic exam tips. Break down complex policies into structured tables or detailed bento-like comparison lists. Make it extremely precise and organized.`;
    } else if (model === "claude") {
      modelPersonaInstruction = `\nSTYLE PERSONA: You are operating as the "Claude" academic prose engine. Use highly elegant, articulate, and fluid essayistic prose. Embed nuanced academic criticisms, deep historical context, and rich humanistic/philosophical insights into each section. Focus on sophisticated vocabulary and analytical flow.`;
    } else {
      modelPersonaInstruction = `\nSTYLE PERSONA: You are operating as the "Gemini 2.5 Pro" extreme reasoning engine. Use outstanding deep analytical reasoning, complete academic citations, long-context synthesis of contrasting arguments, and anchor your conclusions in solid empirical and statistical datasets.`;
    }

    let sectionInstructions = "";
    if (includedSections && includedSections.length > 0) {
      sectionInstructions = "\n\nCRITICAL MANDATE: Since the candidate has specifically requested the following sections, you MUST generate and include them in your output:\n";
      if (includedSections.includes("Definitions")) {
        sectionInstructions += `- **Definitions**: Include a section "## Definitions & Conceptual Grounding" defining the core terms/concepts with absolute clarity, citing authoritative dictionaries, treaties, or theorists. Use distinct highlighting or block styling.\n`;
      }
      if (includedSections.includes("Critical Analysis")) {
        sectionInstructions += `- **Critical Analysis**: Include a dedicated section "## Critical Analysis & Policy Debates" outlining the contrasting scholarly debates, SWOT analysis, structural bottlenecks, and critical evaluation of mainstream policies.\n`;
      }
      if (includedSections.includes("Scholars")) {
        sectionInstructions += `- **Scholars**: Include a section "## Academic Scholars & Intellectual Opinions" listing names, books, or publication years of at least 3 prominent scholars/experts with their exact arguments (e.g., John Mearsheimer, Sir Syed Ahmad, etc.).\n`;
      }
      if (includedSections.includes("Diagrams")) {
        sectionInstructions += `- **Diagrams**: Include a section "## Structural Diagrams" containing clean, elegant, readable text-based/ASCII block diagrams or a Mermaid.js diagram representing the central entities or variables.\n`;
      }
      if (includedSections.includes("Flowcharts")) {
        sectionInstructions += `- **Flowcharts**: Include a section "## Process Flowcharts" containing a step-by-step ASCII flowchart or a Mermaid.js flowchart showing cause-and-effect loops or policy stages.\n`;
      }
      if (includedSections.includes("MCQs")) {
        sectionInstructions += `- **MCQs**: Include a section "## High-Yield MCQs Diagnostic" containing 5 Multiple Choice Questions. Each MCQ must have options A, B, C, and D. Follow them with a hidden/clear answer key and a thorough explanation of the concept.\n`;
      }
      if (includedSections.includes("CSS Past Paper references")) {
        sectionInstructions += `- **CSS Past Paper references**: Include a section "## CSS Past Paper References & Answer Blueprint" citing actual FPSC CSS paper years (e.g., 2018, 2021) and past questions. Provide a clear, bulleted blueprint of how to structure a top-scoring response for those questions.\n`;
      }
    }

    const prompt = `Generate a set of premium, high-yield CSS Competitive Exam Study Notes with deep subtopic analysis.
Subject: ${subjectName} (${category || "Compulsory"} Subject)
Topic: ${topicName}
Style requested: ${style || "CSS Standard"}
Length requested: ${length || "Medium (5-8 pages equivalent)"}
Output Language: ${language || "English"}
Sections that MUST be covered (if applicable to this topic): ${includedSections ? includedSections.join(", ") : "All key sections"}
${knowledgeBaseContextPrompt}

INSTRUCTIONS FOR BEST RESULTS & DYNAMIC SUB-TOPIC ANALYSIS:
1. First, analyze the topic "${topicName}" and identify its 5 to 7 essential academic sub-topics, dimensions, or critical debates required by the FPSC CSS syllabus and past papers.
2. For EACH identified sub-topic, generate detailed, comprehensive, high-quality notes containing rigorous analysis, historical contexts, theoretical perspectives, and empirical evidence.
3. Dedicate robust, fully written paragraphs to each subtopic instead of brief bullet summaries. Explore core debates, challenges, reform ideas, and policy options in depth.
4. Follow the CSS FPSC exam pattern closely. Present a highly academic, analytical, and structured text that mimics a Pakistan Civil Services Academy lecture note and top-tier textbook resource.
${modelPersonaInstruction}
${sectionInstructions}`;

    const systemInstruction = `You are an elite professor of CSS (Central Superior Services) academy in Pakistan and an experienced FPSC examiner.
Your goal is to write authoritative, comprehensive, beautifully structured, and incredibly deep exam study notes in standard Markdown.
Depending on the requested language (English, Urdu, Sindhi, or Roman Urdu), write the main text body in that language but keep technical terms clear. If English, use advanced high-yield academic vocabulary suitable for high scores.

     Formatting rules for elite performance:
1. Structure notes using clear, logical Markdown headings (##, ###) for each analyzed subtopic/dimension.
2. Weave in authentic quotes from notable scholars, historians, constitutional articles, and exact dates, years, and statistics.
3. Provide rigorous arguments and theoretical frameworks instead of superficial facts.
4. Give specific "CSS Examiner Tips" highlighting what examiners look for, common pitfalls of candidates, and high-scoring angles.
5. Integrate high-scoring, incredibly rich dynamic visual content blocks. Inject at least 2 or 3 of the following formats straight into the notes depending on applicability (ensure you use exact pipe-separated variables inside the blocks):
   - Chronological Timeline:
     \u0060\u0060\u0060timeline
     Year | Title | Description
     1940 | Lahore Resolution | Genesis of separate statehood demands.
     1947 | Independence Day | Freedom from colonial British rule.
     \u0060\u0060\u0060
   - Step Flowchart:
     \u0060\u0060\u0060flowchart
     Title | Subtitle | Description
     Stage 1: Constitutional Draft | 1973 Parliament | Cross-party agreement reached.
     Stage 2: Bicameral Vote | Senate & Assembly | Passed with two-thirds majority.
     \u0060\u0060\u0060
   - Strategic Geopolitical Map Layout:
     \u0060\u0060\u0060map
     Name | Coordinates/Details | Geo-strategic Importance
     Gwadar Coast | Arabian Sea shoreline | Focal node of trans-shipment corridors & CPEC.
     Khyber Pass | Northern Borderlands | Landmark gateway connecting Central Asia.
     \u0060\u0060\u0060
   - Structural Layout Schematic Image:
     \u0060\u0060\u0060image
     Title: Mohenjo-Daro Town Grid Blueprint
     Type: Archaeological Town Planning Layout
     Description: The linear schematic of standardized baked brick structures and covered drainage channels.
     Style: Architectural blueprint with grid indicators
     \u0060\u0060\u0060
   - Bento-style Stats Infographic:
     \u0060\u0060\u0060infographic
     Title: Socio-Economic Core Metric Dashboard
     Demographic | 64% | Youth bulge under the age of 30.
     Fiscal Debt | 78% | High sovereign leverage constraints.
     \u0060\u0060\u0060
6. List 2-3 sample CSS Past Exam questions at the bottom of the notes with a bulleted guidance on how to structure their answers.
7. Integrate the provided custom knowledge base fully if present.`;

    const response = await generateContentWithRetryAndFallback({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const generatedMarkdown = response.text || "";
    res.json({
      content: generatedMarkdown,
      title: `${topicName} (${style})`,
      subjectName,
      category,
      style,
      length,
      language,
      createdAt: new Date().toISOString(),
      sectionsIncluded: includedSections || []
    });
  } catch (error: any) {
    console.error("Notes generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate study notes." });
  }
});

// --------------------------------------------------------
// VITE OR STATIC FILE MIDDLEWARE
// --------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
