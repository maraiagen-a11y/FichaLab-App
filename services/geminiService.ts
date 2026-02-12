import { GoogleGenerativeAI } from "@google/generative-ai";
import { EducationLevel, Subject, WorksheetResponse } from "../types";

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
  
  if (!API_KEY) throw new Error("Falta la API Key.");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // --- PROMPT ROBÓTICO Y ESTRICTO ---
    const prompt = `
      ERES UN GENERADOR DE CÓDIGO HTML ESTRICTO.
      
      MISIÓN: Generar una ficha educativa.
      ASIGNATURA: ${params.subject}
      NIVEL: ${params.level}
      TEMA: ${params.topic}
      CANTIDAD EXACTA DE EJERCICIOS: ${params.exerciseCount} (¡NI UNO MÁS, NI UNO MENOS!)
      
      INSTRUCCIONES CLAVE DEL USUARIO (PRIORIDAD ABSOLUTA): 
      "${params.instructions || "Ninguna especial"}"
      
      SI EL USUARIO PIDE "SOLO EJERCICIOS" O "SIN TEORÍA":
      - ELIMINA la etiqueta <h1> del título.
      - ELIMINA el <blockquote> del resumen.
      - ELIMINA el <h2> del ejemplo.
      - Solo genera la lista <ol> de ejercicios.

      REGLAS DE FORMATO (HTML):
      1. Usa <ol> para la lista de ejercicios.
      2. Cada ejercicio debe ser un <li>.
      3. IMPORTANTE: NO escribas los números manualmente (no pongas "1. Ejercicio"). Usa solo <li>Ejercicio...</li>, el HTML pondrá los números.
      4. NO incluyas soluciones a menos que se pidan explícitamente.
      5. NO uses markdown (nada de ** negritas ** innecesarias). Texto limpio y profesional.
      
      PLANTILLA BASE (Modifícala según las instrucciones del usuario):
      
      <h1>${params.topic}</h1>
      
      <blockquote>
        <strong>Resumen:</strong> Breve explicación teórica (Bórrala si el usuario no la quiere).
      </blockquote>

      <h2>Ejercicios</h2>
      <ol>
        <li>Pregunta del ejercicio 1...</li>
        <li>Pregunta del ejercicio 2...</li>
        </ol>
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```html/g, '').replace(/```/g, '');

    return {
      content: cleanText,
      metadata: { difficulty: "Adaptable", estimatedTime: "20 min", topics: [params.topic] }
    };

  } catch (error) {
    console.error(error);
    throw new Error("Error al generar.");
  }
};