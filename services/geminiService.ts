import { GoogleGenerativeAI } from "@google/generative-ai";
import { EducationLevel, Subject, WorksheetResponse } from "../types";

// Asegúrate de que esta variable coincida con la de tu .env (.local) y Vercel
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || "");

// Interfaz para las Fichas
interface GenerateWorksheetParams {
  subject: Subject;
  level: EducationLevel;
  topic: string;
  exerciseCount: number;
  instructions?: string;
}

// Interfaz para las Rúbricas
interface GenerateRubricParams {
  subject: Subject;
  level: EducationLevel;
  topic: string;
  instructions?: string;
}

// ============================================================================
// 📄 1. GENERADOR DE FICHAS (El que ya tenías)
// ============================================================================
export const generateWorksheet = async (params: GenerateWorksheetParams): Promise<WorksheetResponse> => {
  if (!API_KEY) {
    console.error("❌ FALTA API KEY: Revisa tu archivo .env");
    throw new Error("Falta la API Key de Gemini. Configúrala para continuar.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
ERES UN PEDAGOGO EXPERTO Y DISEÑADOR EDITORIAL DE MATERIALES EDUCATIVOS.

Tu misión: Crear una ficha educativa de CALIDAD PROFESIONAL lista para imprimir en PDF.

═══════════════════════════════════════════════════════════════════════════════
📋 DATOS DEL EJERCICIO
═══════════════════════════════════════════════════════════════════════════════
- Asignatura: ${params.subject}
- Nivel educativo: ${params.level}
- Tema específico: Corrige cualquier falta de ortografía en este texto antes de usarlo: "${params.topic}"
- Cantidad de ejercicios: ${params.exerciseCount}
- Instrucciones especiales: ${params.instructions || "Ninguna. Usa tu criterio pedagógico."}

═══════════════════════════════════════════════════════════════════════════════
🎯 PRINCIPIOS PEDAGÓGICOS
═══════════════════════════════════════════════════════════════════════════════

1. PROGRESIÓN DE DIFICULTAD: Empieza fácil, sube a medio, termina con un desafío.
2. VARIEDAD DE TIPOS: Usa Opción múltiple, Verdadero/Falso, Completar huecos y Desarrollo.

═══════════════════════════════════════════════════════════════════════════════
🎨 FORMATO VISUAL (HTML EXCLUSIVO - NO MARKDOWN)
═══════════════════════════════════════════════════════════════════════════════

ESTRUCTURA OBLIGATORIA (Copia este HTML exacto):

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  
  <script>
    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']] },
      svg: { fontCache: 'global' }
    };
  </script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>

  <style>
    @media print {
      body { margin: 0; padding: 2cm; }
      .no-print { display: none; }
      .page-break { page-break-before: always; }
    }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      color: #111827;
      max-width: 210mm;
      margin: 0 auto;
      padding: 1cm;
      background: white;
    }
    .header { border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 30px; }
    .title { color: #1e3a8a; font-size: 24px; font-weight: bold; margin: 0; text-transform: capitalize; }
    .meta { color: #6b7280; font-size: 14px; margin-top: 10px; display: flex; justify-content: space-between; }
    .theory-box { background: #eff6ff; border-left: 5px solid #3b82f6; padding: 15px; margin-bottom: 30px; border-radius: 4px; }
    .exercise { margin-bottom: 40px; page-break-inside: avoid; }
    .exercise-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
    .options { margin-left: 20px; list-style-type: none; padding-left: 0; }
    .options li { margin-bottom: 8px; }
    .solutions { margin-top: 60px; border-top: 2px dashed #9ca3af; padding-top: 30px; }
    .solutions li { margin-bottom: 10px; }
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

INSTRUCCIONES FINALES ESTRICTAS:
1. Solo devuelve HTML puro. ¡ESTÁ TERMINANTEMENTE PROHIBIDO USAR MARKDOWN! No uses asteriscos (**negrita**) para resaltar texto. Usa SIEMPRE etiquetas HTML como <strong>texto</strong>.
2. Respeta la cantidad de ejercicios solicitados: ${params.exerciseCount}.
3. 🧮 REGLA OBLIGATORIA PARA MATEMÁTICAS/CIENCIAS: Para CUALQUIER fórmula, ecuación, raíz, logaritmo, potencia o fracción, DEBES usar sintaxis LaTeX encerrada entre signos de dólar ($). 
   - MAL: log base 3 de (raiz de 3), x al cuadrado, 3/4.
   - BIEN: $\\log_3(\\sqrt{3})$, $x^2$, $\\frac{3}{4}$.
   ¡Esto es innegociable para niveles de Secundaria y Bachillerato!
4. ✅ FORMATO DE SOLUCIONES: Las soluciones deben ir OBLIGATORIAMENTE dentro de etiquetas <li> separadas dentro de la lista <ol>. NUNCA pongas todas las soluciones en un solo párrafo.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let cleanText = text.replace(/```html/g, '').replace(/```/g, '').trim();
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    cleanText = cleanText.replace(/\*(.*?)\*/g, '<em>$1</em>');

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
    throw new Error(`Error de IA: ${error.message || "Inténtalo de nuevo."}`);
  }
};

// ============================================================================
// 📊 2. NUEVO: GENERADOR DE RÚBRICAS
// ============================================================================
export const generateRubric = async (params: GenerateRubricParams): Promise<WorksheetResponse> => {
  if (!API_KEY) {
    throw new Error("Falta la API Key de Gemini.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
ERES UN EXPERTO EN EVALUACIÓN EDUCATIVA Y EN LA NORMATIVA LOMLOE EN ESPAÑA.

Tu misión: Crear una rúbrica de evaluación detallada y en formato tabla profesional lista para imprimir en PDF.

═══════════════════════════════════════════════════════════════════════════════
📋 DATOS DE LA TAREA A EVALUAR
═══════════════════════════════════════════════════════════════════════════════
- Asignatura: ${params.subject}
- Nivel educativo: ${params.level}
- Tarea o Proyecto a evaluar: ${params.topic}
- Instrucciones especiales: ${params.instructions || "Aplica descriptores claros y medibles basados en competencias."}

═══════════════════════════════════════════════════════════════════════════════
🎯 ESTRUCTURA OBLIGATORIA DE LA RÚBRICA
═══════════════════════════════════════════════════════════════════════════════
- Filas (Criterios): Genera entre 4 y 5 criterios clave para evaluar esta tarea concreta.
- Columnas (Niveles): Sobresaliente (4), Notable (3), Bien/Suficiente (2), Insuficiente (1).

🎨 FORMATO VISUAL (HTML EXCLUSIVO - NO MARKDOWN)
Copia esta estructura exacta de tabla HTML y rellena el cuerpo (<tbody>):

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.5; color: #111827; margin: 0 auto; padding: 1cm; max-width: 297mm; }
    .header { border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 20px; }
    .title { color: #1e3a8a; font-size: 24px; font-weight: bold; margin: 0; text-transform: capitalize; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    th { background-color: #1e3a8a; color: white; padding: 10px; text-align: left; border: 1px solid #d1d5db; }
    td { padding: 10px; border: 1px solid #d1d5db; vertical-align: top; }
    .criterio { font-weight: bold; background-color: #f3f4f6; width: 20%; }
    @media print { body { padding: 1cm; } table { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">Rúbrica de Evaluación: ${params.topic}</h1>
    <p><strong>Asignatura:</strong> ${params.subject} &nbsp;|&nbsp; <strong>Nivel:</strong> ${params.level}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>Criterios a Evaluar</th>
        <th>Sobresaliente (4)</th>
        <th>Notable (3)</th>
        <th>Bien/Suf. (2)</th>
        <th>Insuficiente (1)</th>
      </tr>
    </thead>
    <tbody>
      </tbody>
  </table>
</body>
</html>

INSTRUCCIONES FINALES ESTRICTAS:
1. Solo devuelve HTML puro. ¡ESTÁ TERMINANTEMENTE PROHIBIDO USAR MARKDOWN! No uses asteriscos (**negrita**).
2. Redacta descriptores MUY detallados en cada celda para que el profesor sepa exactamente qué corregir.
3. El primer <td> de cada fila siempre será el nombre del criterio y debe llevar la clase CSS class="criterio".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let cleanText = text.replace(/```html/g, '').replace(/```/g, '').trim();
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    cleanText = cleanText.replace(/\*(.*?)\*/g, '<em>$1</em>');

    return {
      content: cleanText,
      metadata: {
        difficulty: "Evaluación",
        estimatedTime: "N/A",
        topics: [params.topic]
      }
    };

  } catch (error: any) {
    console.error("🔥 ERROR GENERANDO RÚBRICA:", error);
    throw new Error(`Error de IA al generar rúbrica: ${error.message || "Inténtalo de nuevo."}`);
  }
};
// Interfaz para los Exámenes
export interface GenerateExamParams {
  subject: Subject;
  level: EducationLevel;
  notes: string;
  examType: 'test' | 'desarrollo' | 'mixto';
  questionCount: number;
  instructions?: string;
}

// ============================================================================
// 📝 3. NUEVO: GENERADOR DE EXÁMENES DESDE APUNTES
// ============================================================================
export const generateExam = async (params: GenerateExamParams): Promise<WorksheetResponse> => {
  if (!API_KEY) {
    throw new Error("Falta la API Key de Gemini.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
ERES UN CATEDRÁTICO EXPERTO EN DISEÑO DE EXÁMENES Y EVALUACIÓN.

Tu misión: Crear un examen formal de CALIDAD PROFESIONAL listo para imprimir en PDF, basado ESTRICTAMENTE en los apuntes proporcionados. No inventes datos que no estén en el texto.

═══════════════════════════════════════════════════════════════════════════════
📋 CONFIGURACIÓN DEL EXAMEN
═══════════════════════════════════════════════════════════════════════════════
- Asignatura: ${params.subject}
- Nivel educativo: ${params.level}
- Tipo de Examen: ${params.examType.toUpperCase()} (Si es test: 4 opciones por pregunta. Si es desarrollo: deja espacio para responder. Si es mixto: mitad y mitad).
- Número de preguntas: ${params.questionCount}
- Instrucciones del profesor: ${params.instructions || "Ninguna especial. Haz un examen equilibrado."}

═══════════════════════════════════════════════════════════════════════════════
📚 APUNTES / TEXTO BASE (De aquí debes sacar TODAS las preguntas)
═══════════════════════════════════════════════════════════════════════════════
"${params.notes}"

═══════════════════════════════════════════════════════════════════════════════
🎨 FORMATO VISUAL (HTML EXCLUSIVO - NO MARKDOWN)
═══════════════════════════════════════════════════════════════════════════════
Genera el HTML con esta estructura exacta:

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    @media print { body { margin: 0; padding: 2cm; } .no-print { display: none; } .page-break { page-break-before: always; } }
    body { font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.6; color: #111827; max-width: 210mm; margin: 0 auto; padding: 1cm; }
    .header { border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 30px; }
    .title { color: #1e3a8a; font-size: 24px; font-weight: bold; margin: 0; text-transform: capitalize; text-align: center; }
    .meta { color: #6b7280; font-size: 14px; margin-top: 15px; display: flex; justify-content: space-between; font-weight: bold; }
    .question { margin-bottom: 25px; page-break-inside: avoid; }
    .q-text { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
    .options { list-style-type: lower-alpha; margin-left: 20px; padding-left: 0; }
    .options li { margin-bottom: 8px; }
    .development-space { height: 150px; border: 1px dashed #d1d5db; border-radius: 8px; margin-top: 10px; background: #f9fafb; }
    .solutions { margin-top: 40px; border-top: 2px dashed #9ca3af; padding-top: 30px; background: #f0fdf4; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>

<div class="header">
  <h1 class="title">Examen de Evaluación</h1>
  <div class="meta">
    <span>${params.subject} • ${params.level}</span>
    <span>Calificación: _______ / 10</span>
  </div>
  <div class="meta" style="margin-top: 10px; border-top: 1px solid #e5e7eb; padding-top: 10px;">
    <span>Nombre y Apellidos: __________________________________________________</span>
    <span>Fecha: ______________</span>
  </div>
</div>

<div class="instructions" style="margin-bottom: 30px; font-style: italic; color: #4b5563;">
  Lee atentamente cada pregunta antes de responder. Dispones de 50 minutos para completar la prueba.
</div>

<div class="solutions page-break">
  <h2 style="color: #166534; margin-top:0;">🔑 Plantilla de Corrección (Para el profesor)</h2>
  </div>

</body>
</html>

INSTRUCCIONES FINALES ESTRICTAS:
1. Solo devuelve HTML puro. NADA DE MARKDOWN.
2. NUNCA uses asteriscos (**negrita**). Usa <strong> o <b>.
3. Si la pregunta es de desarrollo, pon un <div class="development-space"></div> para que el alumno escriba.
4. Asegúrate de generar EXACTAMENTE ${params.questionCount} preguntas.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    let cleanText = text.replace(/```html/g, '').replace(/```/g, '').trim();
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    cleanText = cleanText.replace(/\*(.*?)\*/g, '<em>$1</em>');

    return {
      content: cleanText,
      metadata: { difficulty: "Examen", estimatedTime: "50 min", topics: ["Examen"] }
    };

  } catch (error: any) {
    console.error("🔥 ERROR GENERANDO EXAMEN:", error);
    throw new Error(`Error de IA al generar examen: ${error.message}`);
  }
};
export const generateLearningSituation = async (params: {
  subject: string;
  level: string;
  topic: string;
  sessions: number;
  instructions?: string;
}) => {
  const prompt = `
    Eres un inspector de educación experto en la nueva ley educativa española (LOMLOE) y un maestro del diseño universal para el aprendizaje (DUA).
    Necesito que diseñes una "Situación de Aprendizaje" completa.
    
    Parámetros:
    - Asignatura: ${params.subject}
    - Nivel: ${params.level}
    - Temática / Reto / Contexto: ${params.topic}
    - Número de sesiones estimadas: ${params.sessions}
    - Instrucciones adicionales: ${params.instructions || 'Ninguna'}

    Devuelve ÚNICAMENTE código HTML válido. Nada de markdown (sin \`\`\`html), nada de texto fuera del HTML.
    El HTML debe tener esta estructura profesional, usando clases de Tailwind CSS para el diseño (usa colores neutros y azules/pizarras como text-slate-800, bg-blue-50, border-blue-200, etc.):
    
    1. Un <header> con el Título de la Situación de Aprendizaje (creativo y motivador), la asignatura, nivel y sesiones.
    2. Una sección de "Justificación y Contexto" (¿Por qué es relevante para los alumnos? ¿Qué problema del mundo real resuelve?).
    3. Una tabla o grid muy visual con la "Concreción Curricular LOMLOE": 
       - Competencias Específicas trabajadas.
       - Criterios de Evaluación.
       - Saberes Básicos.
    4. Una "Secuenciación Didáctica" detallada sesión por sesión (Sesión 1: Motivación, Sesión 2: Desarrollo... hasta la última sesión).
    5. Medidas de Atención a la Diversidad (DUA).
    6. Producto final y Evaluación (¿Cómo se evaluará?).

    Haz que el tono sea profesional, directo y listo para presentar a inspección educativa.
  `;

  try {
    // 👇 ESTA ES LA LÍNEA MÁGICA QUE FALTABA 👇
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    const result = await model.generateContent(prompt);
    let htmlContent = result.response.text();
    
    // Limpieza por si la IA devuelve markdown
    htmlContent = htmlContent.replace(/```html/g, '').replace(/```/g, '').trim();
    return { content: htmlContent };
  } catch (error: any) {
    console.error("Error generating learning situation:", error);
    throw new Error(`Error de Gemini: ${error.message || error}`);
  }
};