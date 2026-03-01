import React, { useState, useRef, useEffect } from 'react';
import { User, EducationLevel, Subject } from '../types';
import { FileQuestion, Sparkles, Loader2, AlertCircle, Printer, Copy, ChevronDown, Download } from 'lucide-react';
import { generateExam } from '../services/geminiService';

interface ExamGeneratorProps {
  user: User;
}

// SOLUCIÓN 1: Lo definimos como string[] para evitar los 25 errores de colisión de tipos si no coinciden exactamente con tu types.ts
const SUBJECTS: string[] = ['Matemáticas', 'Lengua y Literatura', 'Inglés', 'Conocimiento del Medio', 'Física y Química', 'Biología y Geología', 'Geografía e Historia', 'Educación Física', 'Música', 'Plástica', 'Tecnología', 'Valores Éticos', 'Religión'];
const LEVELS: string[] = ['1º Primaria', '2º Primaria', '3º Primaria', '4º Primaria', '5º Primaria', '6º Primaria', '1º ESO', '2º ESO', '3º ESO', '4º ESO', '1º Bachillerato', '2º Bachillerato'];

// SOLUCIÓN 2: Quitamos "user" de los parámetros si no se está usando dentro del componente
export const ExamGenerator: React.FC<ExamGeneratorProps> = () => {
  // SOLUCIÓN 3: Forzamos el tipo inicial para que TypeScript no se queje
  const [subject, setSubject] = useState<Subject>('Geografía e Historia' as Subject);
  const [level, setLevel] = useState<EducationLevel>('3º ESO' as EducationLevel);
  const [examType, setExamType] = useState<'test' | 'desarrollo' | 'mixto'>('mixto');
  const [questionCount, setQuestionCount] = useState(10);
  const [notes, setNotes] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (generatedHtml && iframeRef.current) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        
        const responsiveHtml = generatedHtml.replace(
          '</head>',
          `<style>
            body { 
              box-sizing: border-box !important; 
              width: 100% !important; 
              max-width: 100% !important; 
              padding: 2rem !important; 
              margin: 0 !important; 
              overflow-x: hidden !important; 
            }
            table, img, div { max-width: 100% !important; word-wrap: break-word !important; }
          </style></head>`
        );

        doc.write(responsiveHtml);
        doc.close();
      }
    }
  }, [generatedHtml]);

  // SOLUCIÓN 4: Usar SyntheticEvent cubre tanto clics de botón como envíos de formulario
  const handleGenerate = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!notes.trim()) {
      setError("Por favor, pega los apuntes o el temario.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedHtml(null);

    try {
      const response = await generateExam({
        subject,
        level,
        examType,
        questionCount,
        notes,
        instructions
      });
      setGeneratedHtml(response.content);
    } catch (err) { // SOLUCIÓN 5: Quitamos err: any
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al generar el examen.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  const handleCopyHTML = () => {
    if (generatedHtml) {
      navigator.clipboard.writeText(generatedHtml)
        .then(() => alert("Código HTML copiado al portapapeles"));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* === PANEL IZQUIERDO: CONFIGURACIÓN === */}
      <div className="w-[380px] md:w-[400px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl print:hidden shrink-0">
        
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileQuestion className="text-[#4F75FF] w-6 h-6" /> 
            Creador de Exámenes
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Pega los apuntes y la IA redactará un examen perfecto con plantilla de soluciones en segundos.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-24">
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Asignatura</label>
              <div className="relative group">
                <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)} className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#4F75FF] transition-colors pointer-events-none" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nivel Educativo</label>
              <div className="relative group">
                <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100">
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#4F75FF] transition-colors pointer-events-none" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tipo de Examen</label>
              <div className="relative group">
                {/* SOLUCIÓN 6: Reemplazamos "as any" por sus tipos correctos */}
                <select value={examType} onChange={(e) => setExamType(e.target.value as 'test' | 'desarrollo' | 'mixto')} className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <option value="test">Solo Tipo Test</option>
                  <option value="desarrollo">Solo Desarrollo (Abiertas)</option>
                  <option value="mixto">Mixto (Test y Desarrollo)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#4F75FF] transition-colors pointer-events-none" size={18} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase mb-2">
                <span>Cantidad de preguntas</span>
                <span className="bg-blue-100 text-[#4F75FF] px-2 py-0.5 rounded-full">{questionCount}</span>
              </div>
              <input type="range" min="3" max="25" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4F75FF]"/>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 flex justify-between items-center">
                <span>Apuntes / Temario <span className="text-red-500">*</span></span>
              </label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                rows={10} 
                placeholder="Pega aquí el texto del tema..." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent transition-all text-sm text-gray-700 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                Instrucciones IA (Opcional)
              </label>
              <textarea 
                value={instructions} 
                onChange={(e) => setInstructions(e.target.value)} 
                rows={3} 
                placeholder="Ej: Haz hincapié en la Guerra Civil, incluye una pregunta trampa..." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent transition-all text-sm text-gray-700 resize-none"
              />
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={isLoading || !notes.trim()} 
            className="w-full py-4 mt-6 text-white rounded-full font-bold transition-all duration-300 transform flex justify-center items-center gap-2 bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] hover:from-[#3b5bdb] hover:to-[#0284c7] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4F75FF]/40 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
          >
            {isLoading ? (
              <><div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"/> Creando Examen...</>
            ) : (
              <><Sparkles size={20} className="stroke-[2.5]" /> Generar Examen con IA</>
            )}
          </button>
          
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2 mt-4"><AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}</p>}
        </div>
      </div>

      {/* === PANEL DERECHO: VISOR (LA MESA OSCURA) === */}
      <div className="flex-1 flex flex-col h-full bg-slate-900 relative print:bg-white overflow-hidden">
        
        <div className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-20 shrink-0 print:hidden transition-transform duration-300 ${generatedHtml ? 'translate-y-0' : '-translate-y-full absolute w-full'}`}>
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <div className="bg-[#4F75FF]/10 p-1.5 rounded-lg text-[#4F75FF]">
              <FileQuestion size={18} className="stroke-[2.5]" />
            </div>
            Vista Previa del Examen
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={handleCopyHTML} className="hidden md:flex items-center justify-center w-10 h-10 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors" title="Copiar HTML">
              <Copy size={18} />
            </button>
            
            <div className="hidden md:block w-px h-6 bg-gray-200 mx-1"></div>
            
            <button onClick={handlePrint} className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg shadow-slate-900/20">
              <Download size={16} className="stroke-[2.5]" /> <span className="hidden sm:inline">Descargar PDF / Imprimir</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto relative p-4 md:p-8 flex justify-center custom-scrollbar print:p-0 print:overflow-visible">
          
          {!generatedHtml && !isLoading && (
            <div className="m-auto flex flex-col items-center justify-center text-slate-500 max-w-sm text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FileQuestion size={40} className="text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lienzo en blanco</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Pega tus apuntes en el panel de la izquierda y configura el examen. La IA lo redactará al instante.</p>
            </div>
          )}

          {isLoading && (
            <div className="m-auto flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#4F75FF] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={24} className="text-[#4F75FF] animate-pulse" />
                </div>
              </div>
              <p className="text-white font-bold text-lg animate-pulse">Analizando tus apuntes...</p>
              <p className="text-slate-400 text-sm mt-2">Redactando preguntas y respuestas correctas</p>
            </div>
          )}

          <div className={`w-full max-w-[800px] bg-white shadow-2xl transition-all duration-500 origin-top print:shadow-none print:max-w-none ${generatedHtml && !isLoading ? 'opacity-100 scale-100 min-h-[1131px]' : 'opacity-0 scale-95 hidden'}`}>
             <iframe 
               ref={iframeRef}
               className="w-full h-full min-h-[1131px] print:min-h-0"
               title="Examen Generado"
             />
          </div>
        </div>
      </div>
    </div>
  );
};