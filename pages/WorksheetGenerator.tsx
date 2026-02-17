import React, { useState, useRef, useEffect } from "react";
import { generateWorksheet } from "../services/geminiService";
import { Subject, EducationLevel, User } from "../types"; // Importamos User
import { supabase } from "../lib/supabase"; 
import { 
  Download, FileText, Copy, RefreshCw, Settings, Save, Crown, AlertCircle 
} from "lucide-react"; 

// DEFINIMOS LAS PROPS QUE VIENEN DE APP.TSX
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
  const limit = isPremium ? 1000 : 3; // Límite de 3 para cuentas gratuitas
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

  // --- 1. GENERAR (CON LÓGICA DE CONTADOR) ---
  const handleGenerate = async () => {
    // 1.1 Verificaciones previas
    if (!topic.trim()) { setError("Por favor, escribe un tema."); return; }
    
    // 1.2 Bloqueo por límite
    if (isLimitReached && user?.id !== 'guest') {
      alert(`Has alcanzado tu límite gratuito de ${limit} fichas. ¡Pásate a Premium!`);
      return;
    }

    setIsLoading(true); setError(""); setWorksheetContent("");

    try {
      // 2. Llamada a la IA
      const result = await generateWorksheet({ subject, level, topic, exerciseCount, instructions });
      setWorksheetContent(result.content);

      // 3. ACTUALIZAR CONTADOR (Solo si no es invitado)
      if (user && user.id !== 'guest') {
        const newCount = currentCount + 1;
        
        // A) Actualizamos en Supabase
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ generated_count: newCount })
          .eq('id', user.id);

        if (updateError) console.error("Error actualizando contador:", updateError);

        // B) Avisamos a App.tsx para que refresque el Dashboard
        onWorksheetGenerated();
      }

    } catch (err: any) {
      setError(err.message || "Error al generar.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. GUARDAR EN BIBLIOTECA ---
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
      // Refrescamos también por si quieres que aparezca en "Actividad reciente"
      onWorksheetGenerated(); 
      
    } catch (err: any) {
      console.error("Error al guardar:", err);
      alert("❌ Error al guardar: " + (err.message || "Revisa la consola"));
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. IMPRIMIR / PDF ---
  const handlePrintOrPDF = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  // --- 4. COPIAR HTML ---
  const handleCopyHTML = () => {
    navigator.clipboard.writeText(worksheetContent)
      .then(() => alert("Código HTML copiado al portapapeles"));
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* === PANEL IZQUIERDO: CONFIGURACIÓN === */}
      <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl print:hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="text-blue-600" /> Configuración
          </h2>
          {/* Muestra de Créditos */}
          {user && user.id !== 'guest' && (
             <div className={`mt-2 text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1 ${isLimitReached ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
               {isLimitReached ? <AlertCircle size={12}/> : <Crown size={12}/>}
               Generaciones: {currentCount} / {limit}
             </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Asignatura */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Asignatura</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)} className="w-full p-2 border border-gray-300 rounded-lg outline-none">
              {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Nivel */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nivel</label>
            <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="w-full p-2 border border-gray-300 rounded-lg outline-none">
              {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Tema */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tema Principal</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ej: Ecuaciones de segundo grado" className="w-full p-2 border border-gray-300 rounded-lg outline-none"/>
          </div>

          {/* Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-1">
              <span>Cantidad: {exerciseCount}</span>
            </div>
            <input type="range" min="1" max="15" value={exerciseCount} onChange={(e) => setExerciseCount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"/>
          </div>

          {/* Instrucciones */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Instrucciones Extra</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} placeholder="Ej: Sin soluciones..." className="w-full p-2 border border-gray-300 rounded-lg outline-none resize-none"/>
          </div>

          {/* Botón Generar */}
          <button 
            onClick={handleGenerate} 
            disabled={isLoading || !topic || isLimitReached} 
            className={`w-full py-3 text-white rounded-lg font-bold shadow-lg transition-all flex justify-center items-center gap-2 ${
              isLimitReached 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> Creando...</>
            ) : isLimitReached ? (
              <><Crown size={20} /> Límite Alcanzado</>
            ) : (
              <><RefreshCw size={20} /> Generar Ficha</>
            )}
          </button>
          
          {error && <p className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-100">{error}</p>}
        </div>
      </div>

      {/* === PANEL DERECHO: VISOR === */}
      <div className="flex-1 flex flex-col h-full relative bg-gray-800">
        
        {/* Barra superior */}
        {worksheetContent && (
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 print:hidden shrink-0">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <FileText className="text-blue-600" size={20} /> Vista Previa
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopyHTML} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Copiar HTML"><Copy size={20} /></button>
              
              <div className="w-px h-6 bg-gray-300 mx-2 self-center"></div>
              
              {/* BOTÓN GUARDAR */}
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors"
              >
                {isSaving ? "Guardando..." : <><Save size={18} /> Guardar</>}
              </button>

              {/* BOTÓN IMPRIMIR */}
              <button onClick={handlePrintOrPDF} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium shadow-md transition-colors">
                <Download size={18} /> Descargar PDF
              </button>
            </div>
          </div>
        )}

        {/* Contenedor Mesa */}
        <div className="preview-container">
          {!worksheetContent && !isLoading && (
            <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
              <FileText size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-medium">Tu ficha aparecerá aquí</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center mt-32">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-6"></div>
              <p className="text-white font-medium animate-pulse">Diseñando...</p>
            </div>
          )}

          {/* FOLIO A4 */}
          <div className={`paper-a4 ${!worksheetContent && !isLoading ? 'hidden' : ''}`}>
             <iframe 
               ref={iframeRef}
               className="preview-iframe"
               title="Vista Previa Ficha"
             />
          </div>
        </div>
      </div>
    </div>
  );
}