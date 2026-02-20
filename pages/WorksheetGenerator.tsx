import React, { useState, useRef, useEffect } from "react";
import { generateWorksheet } from "../services/geminiService";
import { Subject, EducationLevel, User } from "../types"; 
import { supabase } from "../lib/supabase"; 
import { 
  Download, FileText, Copy, RefreshCw, Settings, Save, Crown, AlertCircle 
} from "lucide-react"; 

interface WorksheetGeneratorProps {
  user: User | null;
  onWorksheetGenerated: () => void;
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ user, onWorksheetGenerated }) => {
  // --- ESTADOS ---
  const [subject, setSubject] = useState<Subject>(Object.values(Subject)[0] as Subject);
  const [level, setLevel] = useState<EducationLevel>(Object.values(EducationLevel)[0] as EducationLevel);
  const [topic, setTopic] = useState("");
  const [exerciseCount, setExerciseCount] = useState(5);
  const [instructions, setInstructions] = useState("");
  
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
  const handleGenerate = async () => {
    if (!topic.trim()) { setError("Por favor, escribe un tema."); return; }
    
    if (isLimitReached && user?.id !== 'guest') {
      alert(`Has alcanzado tu límite gratuito de ${limit} fichas. ¡Pásate a Premium!`);
      return;
    }

    setIsLoading(true); setError(""); setWorksheetContent("");

    try {
      const result = await generateWorksheet({ subject, level, topic, exerciseCount, instructions });
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
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="text-blue-600 w-5 h-5" /> Configuración
          </h2>
          {user && user.id !== 'guest' && (
             <div className={`mt-2 text-xs font-bold px-2 py-1.5 rounded-md inline-flex items-center gap-1.5 ${isLimitReached ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
               {isLimitReached ? <AlertCircle size={14}/> : <Crown size={14}/>}
               Generaciones: {currentCount} / {limit}
             </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Asignatura</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-700">
              {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nivel</label>
            <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-gray-700">
              {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tema Principal</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ej: Ecuaciones de segundo grado" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-700 placeholder:text-gray-400"/>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase mb-2">
              <span>Cantidad de ejercicios</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{exerciseCount}</span>
            </div>
            <input type="range" min="1" max="15" value={exerciseCount} onChange={(e) => setExerciseCount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Instrucciones Extra (Opcional)</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="Ej: Añade un espacio grande para responder..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-700 resize-none placeholder:text-gray-400"/>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={isLoading || !topic || isLimitReached} 
            className={`w-full py-3.5 mt-4 text-white rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 active:scale-[0.98] ${
              isLimitReached 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/40'
            }`}
          >
            {isLoading ? (
              <><div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"/> Diseñando Ficha...</>
            ) : isLimitReached ? (
              <><Crown size={20} /> Límite Alcanzado</>
            ) : (
              <><RefreshCw size={20} className="stroke-[2.5]" /> Generar Ficha</>
            )}
          </button>
          
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2"><AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}</p>}
        </div>
      </div>

      {/* === PANEL DERECHO: VISOR === */}
      <div className="flex-1 flex flex-col h-full bg-slate-900 relative print:bg-white overflow-hidden">
        
        {/* Barra superior (Tools) - Solo visible si hay contenido */}
        <div className={`h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-20 shrink-0 print:hidden transition-transform duration-300 ${worksheetContent ? 'translate-y-0' : '-translate-y-full absolute w-full'}`}>
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
              <FileText size={18} className="stroke-[2.5]" />
            </div>
            Vista Previa
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={handleCopyHTML} className="hidden md:flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Copiar HTML">
              <Copy size={18} />
            </button>
            
            <div className="hidden md:block w-px h-6 bg-gray-200 mx-1"></div>
            
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/50"
            >
              {isSaving ? "Guardando..." : <><Save size={16} className="stroke-[2.5]" /> Guardar</>}
            </button>

            <button onClick={handlePrintOrPDF} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-900 shadow-md transition-all active:scale-95">
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
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={24} className="text-blue-400 animate-pulse" />
                </div>
              </div>
              <p className="text-white font-bold text-lg animate-pulse">La IA está escribiendo...</p>
              <p className="text-slate-400 text-sm mt-2">Adaptando al nivel de {level}</p>
            </div>
          )}

          {/* EL FOLIO A4 (Visible solo cuando hay contenido) */}
          <div className={`w-full max-w-[800px] bg-white shadow-2xl transition-all duration-500 origin-top print:shadow-none print:max-w-none ${worksheetContent && !isLoading ? 'opacity-100 scale-100 min-h-[1131px]' : 'opacity-0 scale-95 hidden'}`}>
             <iframe 
               ref={iframeRef}
               className="w-full h-full min-h-[1131px] print:min-h-0"
               title="Vista Previa Ficha"
               // sandbox="allow-same-origin allow-scripts" // Opcional por seguridad
             />
          </div>

        </div>
      </div>
    </div>
  );
}

// Pequeño componente extra solo visual para la carga
const Sparkles = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v18M3 12h18M18 6l-12 12M6 6l12 12" />
  </svg>
);