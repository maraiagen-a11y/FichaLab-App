import { GoogleGenerativeAI } from "@google/generative-ai";
import { EducationLevel, Subject, WorksheetResponse } from "../types";

// Asegúrate de que esta variable coincida con la de tu .env (.local) y Vercel
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || "");

interface GenerateParams {
  subject: Subject;
  level: EducationLevel;
  topic: string;
  exerciseCount: number;
  instructions?: string;
}

export const generateWorksheet = async (params: GenerateParams): Promise<WorksheetResponse> => {
  
  if (!API_KEY) {
    console.error("❌ FALTA API KEY: Revisa tu archivo .env");
    throw new Error("Falta la API Key de Gemini. Configúrala para continuar.");
  }

  try {
    // ✅ CAMBIO REALIZADO: Usamos "gemini-2.5-flash" tal como aparece en tu panel
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // --- PROMPT OPTIMIZADO PARA EDITOR HTML (REACT QUILL) ---
    const prompt = `
      Actúa como un profesor experto. Crea una ficha educativa completa sobre:
      - Asignatura: ${params.subject}
      - Nivel: ${params.level}
      - Tema: ${params.topic}
      - Cantidad de ejercicios: ${params.exerciseCount}
      - Instrucciones extra: ${params.instructions || "Ninguna"}

      IMPORTANTE: FORMATO DE SALIDA HTML
      Tu respuesta se usará directamente en un editor de texto enriquecido.
      1. NO uses Markdown (nada de **, ##, \`\`\`).
      2. Usa SOLO estas etiquetas HTML: <h1>, <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <hr>.
      3. NO incluyas las etiquetas <html>, <head> o <body>. Solo el contenido interior.

      ESTRUCTURA OBLIGATORIA (HTML):
      
      <h1>${params.topic}</h1>
      
      <blockquote>
        <strong>💡 Resumen Rápido:</strong><br>
        (Explica el concepto en 2-3 líneas sencillas adaptadas al nivel ${params.level}).
      </blockquote>
      
      <hr>

      <h2>🧠 Ejemplo Resuelto</h2>
      <p>(Pon un ejemplo paso a paso muy claro explicándolo).</p>

      <hr>

      <h2>✍️ Ejercicios Prácticos</h2>
      <ol>
        <li>(Ejercicio 1...)</li>
        <li>(Ejercicio 2...)</li>
        </ol>

      <hr>
      
      <h3>✅ Soluciones (Para el profesor)</h3>
      <p><em>(Pon las respuestas aquí abajo en cursiva).</em></p>
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpieza de seguridad
    const cleanText = text.replace(/```html/g, '').replace(/```/g, '');

    return {
      content: cleanText,
      metadata: {
        difficulty: "Adaptable",
        estimatedTime: "20 min",
        topics: [params.topic]
      }
    };

  } catch (error) {
    console.error("Error conectando con Gemini:", error);
    throw new Error("No se pudo generar la ficha. Verifica tu conexión o API Key.");
  }
};