import React, { useState, useEffect } from 'react';
import { User, EducationLevel, Subject } from '../types';
import { ClipboardList, Sparkles, Loader2, AlertCircle, Printer, ArrowLeft, ChevronDown } from 'lucide-react';
import { generateRubric } from '../services/geminiService'; 

interface RubricGeneratorProps {
  user: User;
}

export const RubricGenerator: React.FC<RubricGeneratorProps> = ({ user }) => {
  // 👇 EL USEEFFECT AHORA SÍ ESTÁ DENTRO DEL COMPONENTE
  useEffect(() => {
    document.title = "Generador de Rúbricas de Evaluación LOMLOE | FichaLab";
  }, []);

  const [subject, setSubject] = useState<Subject>('Matemáticas' as Subject);
  const [level, setLevel] = useState<EducationLevel>('1º ESO' as EducationLevel);
  const [topic, setTopic] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Estados para controlar la IA y la pantalla
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedHtml(null);

    try {
      // 🚀 ¡Llamamos a Gemini!
      const response = await generateRubric({
        subject,
        level,
        topic,
        instructions
      });
      
      // Guardamos el HTML que nos devuelve la IA
      setGeneratedHtml(response.content);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al generar la rúbrica. Inténtalo de nuevo.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Función mágica para el PDF
  const handlePrint = () => {
    window.print();
  };

  // ==========================================================================
  // 🟢 VISTA 2: RESULTADO DE LA RÚBRICA (Se muestra si ya hay HTML generado)
  // ==========================================================================
  if (generatedHtml) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        {/* Barra de herramientas superior (No se imprime) */}
        <div className="flex justify-between items-center mb-6 no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          
          {/* BOTÓN VOLVER */}
          <button 
            onClick={() => setGeneratedHtml(null)}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all duration-300 font-bold"
          >
            <ArrowLeft size={20} />
            Nueva Rúbrica
          </button>

          {/* BOTÓN IMPRIMIR */}
          <button 
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg shadow-slate-900/20"
          >
            <Printer size={20} />
            Imprimir / Guardar PDF
          </button>
          
        </div>
        
        {/* Contenedor del documento */}
        <div className="bg-white shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:m-0 print:p-0">
          <div className="p-8 print:p-0">
            {/* Aquí inyectamos el HTML puro que creó Gemini */}
            <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
          </div>
        </div>
        
      </div>
    );
  }

  // ==========================================================================
  // 🔵 VISTA 1: FORMULARIO
  // ==========================================================================
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      
      {/* CABECERA */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <ClipboardList className="text-[#4F75FF] w-8 h-8" />
          Generador de Rúbricas IA
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Evalúa proyectos, redacciones o exposiciones en segundos. La IA creará una tabla perfecta con criterios y niveles de logro.
        </p>
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* FORMULARIO */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SELECTOR ASIGNATURA */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Asignatura</label>
              <div className="relative group">
                <select 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full p-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-slate-700 font-medium hover:bg-slate-100"
                >
                  {['Matemáticas', 'Lengua y Literatura', 'Inglés', 'Conocimiento del Medio', 'Física y Química', 'Biología y Geología', 'Geografía e Historia', 'Educación Física', 'Música', 'Plástica', 'Tecnología', 'Valores Éticos', 'Religión'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-[#4F75FF] transition-colors pointer-events-none" size={20} />
              </div>
            </div>

            {/* SELECTOR NIVEL EDUCATIVO */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nivel Educativo</label>
              <div className="relative group">
                <select 
                  value={level} 
                  onChange={(e) => setLevel(e.target.value as EducationLevel)}
                  className="w-full p-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-slate-700 font-medium hover:bg-slate-100"
                >
                  {['1º Primaria', '2º Primaria', '3º Primaria', '4º Primaria', '5º Primaria', '6º Primaria', '1º ESO', '2º ESO', '3º ESO', '4º ESO', '1º Bachillerato', '2º Bachillerato'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-[#4F75FF] transition-colors pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">¿Qué tarea van a hacer los alumnos?</label>
            <input 
              type="text" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej: Exposición oral sobre la Revolución Francesa, Trabajo de laboratorio..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent outline-none transition-all text-slate-700"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
              <span>Instrucciones Específicas <span className="text-slate-400 font-normal">(Opcional)</span></span>
            </label>
            <textarea 
              value={instructions} 
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ej: Haz mucho hincapié en evaluar la ortografía y el uso de vocabulario técnico..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent outline-none transition-all h-24 resize-none text-slate-700"
            />
          </div>

          <button 
            type="submit" 
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] hover:from-[#3b5bdb] hover:to-[#0284c7] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4F75FF]/40 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Generando Rúbrica...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generar Rúbrica con IA</span>
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};