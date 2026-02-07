import { GoogleGenAI } from "@google/genai";
import { WorksheetRequest, WorksheetResponse } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWorksheet = async (request: WorksheetRequest): Promise<WorksheetResponse> => {
  const ai = getClient();
  
  const prompt = `
    Act as an expert educational content creator. Create a worksheet for students.
    
    Target Audience: ${request.level} students.
    Subject: ${request.subject}.
    Topic: ${request.topic}.
    Number of Exercises: ${request.exerciseCount}.
    Additional Instructions: ${request.instructions || "None"}.

    Output format:
    Please provide the response in valid Markdown format.
    Structure the worksheet clearly with:
    1. A Title (H1)
    2. A brief instruction paragraph (Italic)
    3. The exercises numbered clearly.
    4. Space for answers (use lines or underscores like "__________").
    5. An Answer Key section at the very bottom, separated by a horizontal rule.
    
    Language: Spanish (unless the Subject is English, then use English).
  `;

  try {
    // Using gemini-3-flash-preview as recommended for text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster generation on simple tasks
        temperature: 0.7,
      }
    });

    const text = response.text || "Lo siento, no pude generar la ficha en este momento.";

    return {
      content: text,
      title: `Ficha: ${request.topic} (${request.subject})`
    };

  } catch (error) {
    console.error("Error generating worksheet:", error);
    throw new Error("Failed to generate worksheet via Gemini AI.");
  }
};
