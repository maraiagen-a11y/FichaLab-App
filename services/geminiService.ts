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

    // --- PROMPT PROFESIONAL OPTIMIZADO V2.0 ---
    const prompt = `
ERES UN PEDAGOGO EXPERTO Y DISEÑADOR EDITORIAL DE MATERIALES EDUCATIVOS.

Tu misión: Crear una ficha educativa de CALIDAD PROFESIONAL lista para imprimir en PDF.

═══════════════════════════════════════════════════════════════════════════════
📋 DATOS DEL EJERCICIO
═══════════════════════════════════════════════════════════════════════════════
• Asignatura: ${params.subject}
• Nivel educativo: ${params.level}
• Tema específico: ${params.topic}
• Cantidad de ejercicios: ${params.exerciseCount}
• Instrucciones especiales: ${params.instructions || "Ninguna. Usa tu criterio pedagógico."}

═══════════════════════════════════════════════════════════════════════════════
🎯 PRINCIPIOS PEDAGÓGICOS
═══════════════════════════════════════════════════════════════════════════════

1. PROGRESIÓN DE DIFICULTAD:
   - Empieza con ejercicios sencillos (30%)
   - Continúa con nivel medio (50%)
   - Termina con ejercicios desafiantes (20%)

2. VARIEDAD DE TIPOS (OBLIGATORIO):
   - Opción múltiple (A/B/C/D)
   - Verdadero/Falso con justificación
   - Completar huecos
   - Desarrollo corto
   - Problemas prácticos

3. FORMATO DE RESPUESTA:
   - Checkbox □ para test
   - Líneas punteadas para escribir
   - Cuadros en blanco para problemas

═══════════════════════════════════════════════════════════════════════════════
🎨 FORMATO VISUAL (HTML EXCLUSIVO - NO MARKDOWN)
═══════════════════════════════════════════════════════════════════════════════

ESTRUCTURA OBLIGATORIA (Copia este HTML exacto):

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    @media print {
      body { margin: 0; padding: 2cm; }
      .no-print { display: none; }
      .page-break { page-break-before: always; }
    }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.5;
      color: #111827;
      max-width: 210mm;
      margin: 0 auto;
      padding: 1cm;
      background: white;
    }
    .header { border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 30px; }
    .title { color: #1e3a8a; font-size: 24px; font-weight: bold; margin: 0; }
    .meta { color: #6b7280; font-size: 14px; margin-top: 10px; display: flex; justify-content: space-between; }
    .theory-box { background: #eff6ff; border-left: 5px solid #3b82f6; padding: 15px; margin-bottom: 30px; border-radius: 4px; }
    .exercise { margin-bottom: 40px; page-break-inside: avoid; }
    .exercise-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
    .answer-lines { 
      background: repeating-linear-gradient(transparent, transparent 29px, #e5e7eb 29px, #e5e7eb 30px);
      min-height: 80px; 
      margin-top: 10px;
    }
    .options { margin-left: 20px; }
    .solutions { margin-top: 60px; border-top: 2px dashed #9ca3af; padding-top: 30px; }
  </style>
</head>
<body>

<div class="header">
  <h1 class="title">${params.topic}</h1>
  <div class="meta">
    <span>${params.subject} • ${params.level}</span>
    <span>Nombre: ________________________ Fecha: _________</span>
  </div>
</div>

${!params.instructions?.toLowerCase().includes('sin teoría') ? `
<div class="theory-box">
  <h3 style="margin-top:0; color:#1e40af;">💡 Recordatorio</h3>
  <p style="margin:0;">[RESUMEN TEÓRICO BREVE ADAPTADO AL NIVEL]</p>
</div>
` : ''}

<h2 style="color:#1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Ejercicios</h2>

[AQUÍ TU CONTENIDO GENERADO]

${!params.instructions?.toLowerCase().includes('sin soluciones') ? `
<div class="solutions page-break">
  <h3>🔑 Soluciones (Profesor)</h3>
  <ol>
    </ol>
</div>
` : ''}

</body>
</html>

INSTRUCCIONES FINALES:
1. Solo devuelve HTML puro.
2. Respeta la cantidad: ${params.exerciseCount}.
3. Si es matemáticas usa HTML: x<sup>2</sup>, &radic;.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpieza de seguridad
    const cleanText = text.replace(/```html/g, '').replace(/```/g, '').trim();

    return {
      content: cleanText,
      metadata: {
        difficulty: "Adaptable",
        estimatedTime: "20 min",
        topics: [params.topic]
      }
    };

  } catch (error: any) {
    console.error("🔥 ERROR DETALLADO DE GEMINI:", error);
    
    // Gestión de errores comunes
    if (error.message?.includes("429")) {
      throw new Error("⏳ Has superado el límite diario de Gemini (20/día). Espera a mañana o cambia de cuenta.");
    }
    if (error.message?.includes("API key")) {
      throw new Error("🔑 La API Key no es válida. Revisa tu archivo .env");
    }
    if (error.message?.includes("model")) {
      throw new Error("🤖 El modelo Gemini 2.5 no está disponible. Intenta cambiar a 'gemini-1.5-flash' en el código.");
    }

    throw new Error(`Error de IA: ${error.message || "Inténtalo de nuevo."}`);
  }
};