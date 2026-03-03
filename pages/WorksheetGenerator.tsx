import React, { useState, useRef, useEffect } from "react";
import { generateWorksheet } from "../services/geminiService";
import { Subject, EducationLevel, User } from "../types"; 
import { supabase } from "../lib/supabase"; 
import { 
  Download, FileText, Copy, RefreshCw, Settings, Save, Crown, AlertCircle, Sparkles, BookOpen, Eye, Table, ChevronDown 
} from "lucide-react"; 

interface WorksheetGeneratorProps {
  user: User | null;
  onWorksheetGenerated: () => void;
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ user, onWorksheetGenerated }) => {
  // --- ESTADOS BÁSICOS ---
  const [subject, setSubject] = useState<Subject>(Object.values(Subject)[0] as Subject);
  const [level, setLevel] = useState<EducationLevel>(Object.values(EducationLevel)[0] as EducationLevel);
  const [topic, setTopic] = useState("");
  const [exerciseCount, setExerciseCount] = useState(5);
  const [instructions, setInstructions] = useState("");
  
  // --- ESTADOS PREMIUM (Los Superpoderes) ---
  const [lomloe, setLomloe] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);
  const [rubric, setRubric] = useState(false);

  const [worksheetContent, setWorksheetContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");

  // REFERENCIA AL IFRAME
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // --- CALCULAMOS LÍMITES ---
  const isPremium = user?.plan === 'premium';
  const limit = isPremium ? 1000 : 3; 
  const currentCount = user?.generatedCount || 0;
  const isLimitReached = !isPremium && currentCount >= limit;

  // --- EFECTO: INYECTAR HTML ---
  useEffect(() => {
    if (worksheetContent && iframeRef.current) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(worksheetContent);
        doc.close();
      }
    }
  }, [worksheetContent]);

  // --- 1. GENERAR ---
  const handleGenerate = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // <-- PROTECCIÓN EXTRA: Evita recargas si está en un form implícito
    if (!topic.trim()) { setError("Por favor, escribe un tema."); return; }
    
    if (isLimitReached && user?.id !== 'guest') {
      alert(`Has alcanzado tu límite gratuito de ${limit} fichas. ¡Pásate a Premium!`);
      return;
    }

    setIsLoading(true); setError(""); setWorksheetContent("");

    let finalInstructions = instructions;
    
    if (isPremium) {
      if (lomloe) {
        finalInstructions += "\n\n[INSTRUCCIÓN OBLIGATORIA DEL SISTEMA]: Al final del documento, incluye una sección titulada 'Justificación Curricular (LOMLOE)' con una tabla profesional que detalle los Saberes Básicos, Competencias Específicas y Criterios de Evaluación trabajados en esta ficha.";
      }
      if (dyslexia) {
        finalInstructions += "\n\n[INSTRUCCIÓN OBLIGATORIA DEL SISTEMA]: Adapta estrictamente TODO el texto y ejercicios usando Diseño Universal para el Aprendizaje (DUA) para alumnos con dislexia. Usa frases muy cortas, vocabulario transparente, resalta en negrita las palabras clave y da las instrucciones paso a paso de forma muy clara.";
      }
      if (rubric) {
        finalInstructions += "\n\n[INSTRUCCIÓN OBLIGATORIA DEL SISTEMA]: Al final de la hoja de soluciones, añade una 'Rúbrica de Evaluación' en formato tabla detallando exactamente cómo debe puntuar el profesor cada ejercicio del 0 al 10.";
      }
    }

    try {
      const result = await generateWorksheet({ 
        subject, 
        level, 
        topic, 
        exerciseCount, 
        instructions: finalInstructions
      });
      
      setWorksheetContent(result.content);

      if (user && user.id !== 'guest') {
        const newCount = currentCount + 1;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ generated_count: newCount })
          .eq('id', user.id);

        if (updateError) console.error("Error actualizando contador:", updateError);
        onWorksheetGenerated();
      }

    } catch (err: any) {
      setError(err.message || "Error al generar.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. GUARDAR ---
  const handleSave = async () => {
    if (!worksheetContent) return;
    if (!user || user.id === 'guest') {
      alert("Debes iniciar sesión para guardar.");
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase.from('resources').insert([
        {
          title: topic,
          subject: subject,
          level: level,
          content: worksheetContent,
          type: 'worksheet',
          user_id: user.id 
        }
      ]);

      if (error) throw error;
      
      alert("✅ ¡Ficha guardada correctamente en tu biblioteca!");
      onWorksheetGenerated(); 
      
    } catch (err: any) {
      console.error("Error al guardar:", err);
      alert("❌ Error al guardar: " + (err.message || "Revisa la consola"));
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. IMPRIMIR ---
  const handlePrintOrPDF = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  // --- 4. COPIAR ---
  const handleCopyHTML = () => {
    navigator.clipboard.writeText(worksheetContent)
      .then(() => alert("Código HTML copiado al portapapeles"));
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* === PANEL IZQUIERDO: CONFIGURACIÓN === */}
      <div className="w-[380px] md:w-[400px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl print:hidden shrink-0">
        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="text-[#4F75FF] w-5 h-5" /> Configuración
          </h2>
          {user && user.id !== 'guest' && (
             <div className={`mt-2 text-xs font-bold px-2 py-1.5 rounded-md inline-flex items-center gap-1.5 ${isLimitReached ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-[#4F75FF] border border-blue-100'}`}>
               {isLimitReached ? <AlertCircle size={14}/> : <Crown size={14}/>}
               Generaciones: {currentCount} / {limit}
             </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-24">
          
          {/* BLOQUE BÁSICO */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Asignatura</label>
              <div className="relative group">
                <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)} className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100">
                  {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#4F75FF] transition-colors pointer-events-none" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nivel</label>
              <div className="relative group">
                <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="w-full p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100">
                  {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#4F75FF] transition-colors pointer-events-none" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tema Principal</label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ej: Ecuaciones de segundo grado" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent transition-all text-sm text-gray-700 placeholder:text-gray-400"/>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase mb-2">
                <span>Cantidad de ejercicios</span>
                <span className="bg-blue-100 text-[#4F75FF] px-2 py-0.5 rounded-full">{exerciseCount}</span>
              </div>
              <input type="range" min="1" max="15" value={exerciseCount} onChange={(e) => setExerciseCount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4F75FF]"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Instrucciones Extra (Opcional)</label>
              <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="Ej: Añade un espacio grande para responder, o haz que la temática sea Harry Potter..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4F75FF] focus:border-transparent transition-all text-sm text-gray-700 resize-none placeholder:text-gray-400"/>
            </div>
          </div>

          {/* BLOQUE PREMIUM (SUPERPODERES) */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5 tracking-wider">
                <Sparkles size={16} className="text-[#4F75FF]" /> Superpoderes IA
              </h3>
              {!isPremium && <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Premium</span>}
            </div>

            <div className={`space-y-3 ${!isPremium ? 'opacity-70 grayscale-[30%] pointer-events-none' : ''}`}>
              <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${lomloe ? 'border-[#4F75FF] bg-blue-50/50 ring-1 ring-[#4F75FF]/20' : 'border-gray-200 hover:border-blue-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${lomloe ? 'bg-[#4F75FF] text-white' : 'bg-slate-100 text-slate-500'}`}><BookOpen size={18}/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Justificación LOMLOE</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Añade tabla de saberes y competencias</p>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors relative ${lomloe ? 'bg-[#4F75FF]' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${lomloe ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <input type="checkbox" checked={lomloe} onChange={(e) => setLomloe(e.target.checked)} className="hidden" />
              </label>

              <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${dyslexia ? 'border-[#4F75FF] bg-blue-50/50 ring-1 ring-[#4F75FF]/20' : 'border-gray-200 hover:border-blue-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${dyslexia ? 'bg-[#4F75FF] text-white' : 'bg-slate-100 text-slate-500'}`}><Eye size={18}/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Adaptar a Dislexia</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Formato DUA claro y paso a paso</p>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors relative ${dyslexia ? 'bg-[#4F75FF]' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${dyslexia ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <input type="checkbox" checked={dyslexia} onChange={(e) => setDyslexia(e.target.checked)} className="hidden" />
              </label>

              <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${rubric ? 'border-[#4F75FF] bg-blue-50/50 ring-1 ring-[#4F75FF]/20' : 'border-gray-200 hover:border-blue-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${rubric ? 'bg-[#4F75FF] text-white' : 'bg-slate-100 text-slate-500'}`}><Table size={18}/></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Rúbrica de Evaluación</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Genera tabla de puntuaciones</p>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-colors relative ${rubric ? 'bg-[#4F75FF]' : 'bg-slate-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute ${rubric ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <input type="checkbox" checked={rubric} onChange={(e) => setRubric(e.target.checked)} className="hidden" />
              </label>
            </div>

            {/* BOTÓN GENERAR AHORA BIEN ESTRUCTURADO DENTRO DEL CONTENEDOR */}
            <button 
              type="button"
              onClick={handleGenerate} 
              disabled={isLoading || !topic || isLimitReached} 
              className={`w-full py-4 mt-8 text-white rounded-full font-bold transition-all duration-300 flex justify-center items-center gap-2 ${
                isLimitReached 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] hover:shadow-lg disabled:opacity-50'
              }`}
            >
              {isLoading ? (
                <><div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"/> Creando Magia...</>
              ) : isLimitReached ? (
                <><Crown size={20} /> Límite Alcanzado</>
              ) : (
                <><Sparkles size={20} className="stroke-[2.5]" /> Generar Ficha</>
              )}
            </button>
            
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2 mt-4"><AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}</p>}
          </div>

        </div>
      </div>

      {/* === PANEL DERECHO: VISOR === */}
      <div className="flex-1 flex flex-col h-full bg-slate-900 relative print:bg-white overflow-hidden">
        
        {/* Barra superior (Tools) */}
        <div className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-20 shrink-0 print:hidden transition-all duration-300 ${worksheetContent ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 absolute w-full'}`}>
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <div className="bg-[#4F75FF]/10 p-1.5 rounded-lg text-[#4F75FF]">
              <FileText size={18} className="stroke-[2.5]" />
            </div>
            Vista Previa
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={handleCopyHTML} className="hidden md:flex items-center justify-center w-10 h-10 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors" title="Copiar HTML">
              <Copy size={18} />
            </button>
            <div className="hidden md:block w-px h-6 bg-gray-200 mx-1"></div>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-all">
              {isSaving ? "Guardando..." : <><Save size={16} className="stroke-[2.5]" /> Guardar</>}
            </button>
            <button onClick={handlePrintOrPDF} className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all">
              <Download size={16} className="stroke-[2.5]" /> <span className="hidden sm:inline">Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* CONTENEDOR DE LA MESA GRIS Y EL FOLIO */}
        <div className="flex-1 overflow-y-auto relative p-4 md:p-8 flex justify-center custom-scrollbar print:p-0 print:overflow-visible">
          
          {/* Estado Inicial */}
          {!worksheetContent && !isLoading && (
            <div className="m-auto flex flex-col items-center justify-center text-slate-500 max-w-sm text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FileText size={40} className="text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lienzo en blanco</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Configura las opciones en el panel izquierdo y haz clic en "Generar" para ver la magia.</p>
            </div>
          )}

          {/* Estado de Carga */}
          {isLoading && (
            <div className="m-auto flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#4F75FF] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={24} className="text-[#4F75FF] animate-pulse" />
                </div>
              </div>
              <p className="text-white font-bold text-lg animate-pulse">La IA está escribiendo...</p>
              <p className="text-slate-400 text-sm mt-2">Adaptando al nivel de {level}</p>
            </div>
          )}

          {/* EL FOLIO A4 */}
          {worksheetContent && !isLoading && (
            <div className="w-full max-w-[800px] bg-white shadow-2xl min-h-[1131px] print:shadow-none print:max-w-none print:min-h-0 animate-fade-in-up">
               <iframe 
                 ref={iframeRef}
                 className="w-full h-full min-h-[1131px] print:min-h-0"
                 title="Vista Previa Ficha"
               />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}