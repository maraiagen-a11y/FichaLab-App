import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Estilos del editor
import { generateWorksheet } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { EducationLevel, Subject, User, UserPlan } from '../types';
import { Button } from '../components/Button';
import { PLAN_LIMITS } from '../constants';
import { 
  Sparkles, 
  Printer, 
  Save, 
  LayoutTemplate, 
  RefreshCw,
  FileText
} from 'lucide-react';

interface WorksheetGeneratorProps {
  user: User;
  onWorksheetGenerated: () => void;
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ user, onWorksheetGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados del formulario
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [level, setLevel] = useState<EducationLevel>(EducationLevel.PRIMARY);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [instructions, setInstructions] = useState('');

  // Estado del contenido (HTML editable)
  const [editableContent, setEditableContent] = useState<string>(''); 

  const limits = PLAN_LIMITS[user.plan];
  const canGenerate = user.plan === UserPlan.PREMIUM || user.generatedCount < limits.maxGenerations;

  // --- 1. GENERAR (Llama a la IA y descuenta crédito) ---
  const handleGenerate = async () => {
    if (!canGenerate) return;
    if (!topic.trim()) {
      setError("Por favor, introduce un tema.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditableContent(''); // Limpiamos previo

    try {
      // Pedimos a Gemini el contenido (Ahora devuelve HTML gracias al cambio en el servicio)
      const response = await generateWorksheet({
        subject,
        level,
        topic,
        exerciseCount: count,
        instructions
      });

      setEditableContent(response.content);

      // Descontamos crédito SI NO es invitado
      if (user.id !== 'guest') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ generated_count: user.generatedCount + 1 })
          .eq('id', user.id);

        if (!updateError) {
          onWorksheetGenerated(); // Actualiza el contador visual en la App
        }
      }

    } catch (err) {
      console.error(err);
      setError("Error al conectar con la IA. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. GUARDAR (Guarda TU versión editada) ---
  const handleSave = async () => {
    if (!editableContent || user.id === 'guest') return;

    setIsSaving(true);
    try {
      const { error: insertError } = await supabase
        .from('resources')
        .insert([
          {
            user_id: user.id,
            title: `${subject}: ${topic} (${level})`,
            content: editableContent, // Guardamos lo que hay en el editor
            type: 'worksheet'
          }
        ]);

      if (insertError) throw insertError;
      alert('¡Ficha guardada en tu Biblioteca!');
      
    } catch (err) {
      console.error(err);
      alert('Error al guardar la ficha.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Configuración de la barra de herramientas del editor (Word-like)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-slate-100 overflow-hidden font-sans print:h-auto print:overflow-visible print:bg-white">
      
      {/* Estilos CSS para Impresión y Editor */}
      <style>{`
        /* Personalización del Editor */
        .ql-container { font-family: inherit; font-size: 16px; }
        .ql-editor { min-height: 250mm; padding: 20mm; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .ql-toolbar { background: #f8fafc; border-bottom: 1px solid #e2e8f0 !important; border-top: none !important; border-left: none !important; border-right: none !important; border-radius: 8px 8px 0 0; }
        .ql-container.ql-snow { border: none !important; }
        
        /* Reglas de Impresión */
        @media print {
          @page { margin: 15mm; size: auto; }
          body { background: white; height: auto; overflow: visible; }
          /* Ocultamos todo lo que no sea el contenido de la ficha */
          nav, aside, .no-print, .ql-toolbar { display: none !important; }
          /* Hacemos que el editor ocupe todo */
          .ql-editor { box-shadow: none; padding: 0; min-height: auto; }
          .print-container { position: absolute; top: 0; left: 0; width: 100%; margin: 0; padding: 0; }
        }
      `}</style>

      {/* --- PANEL IZQUIERDO: CONTROLES (Igual que antes) --- */}
      <div className="w-full lg:w-[400px] bg-white border-r border-slate-200 flex flex-col h-full z-10 print:hidden shadow-xl lg:shadow-none no-print">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-brand-600" />
            Configuración
          </h2>
          <p className="text-xs text-slate-500 mt-1">Define los parámetros de tu ficha.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Selectores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asignatura</label>
              <select 
                className="w-full rounded-lg border-slate-200 text-sm focus:border-brand-500 py-2"
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
              >
                {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nivel</label>
              <select 
                className="w-full rounded-lg border-slate-200 text-sm focus:border-brand-500 py-2"
                value={level}
                onChange={(e) => setLevel(e.target.value as EducationLevel)}
              >
                {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tema Principal</label>
            <input
              type="text"
              className="w-full rounded-lg border-slate-200 text-sm focus:border-brand-500 py-2"
              placeholder="Ej: Logaritmos, Verbos..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ejercicios: {count}</label>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Instrucciones</label>
            <textarea
              className="w-full rounded-lg border-slate-200 text-sm focus:border-brand-500 py-2"
              rows={3}
              placeholder="Ej: Formato lista, espacio para escribir..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {/* Botón Generar */}
          <div className="pt-4">
            <Button 
              onClick={handleGenerate} 
              isLoading={isLoading} 
              disabled={!canGenerate || !topic}
              className={`w-full py-3 shadow-lg ${!canGenerate ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand-600 shadow-brand-500/30'}`}
            >
              {isLoading ? 'Generando...' : (
                <span className="flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" /> {editableContent ? 'Regenerar (Borrador)' : 'Generar Ficha'}
                </span>
              )}
            </Button>
            {!canGenerate && <p className="text-xs text-center text-red-500 mt-2">Límite alcanzado.</p>}
            {error && <p className="text-xs text-center text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>

      {/* --- PANEL DERECHO: VISTA PREVIA & EDITOR --- */}
      <div className="flex-1 flex flex-col h-full bg-slate-200 overflow-hidden relative print:bg-white print:overflow-visible print:h-auto print:block">
        
        {/* Barra Superior de Acciones */}
        {editableContent && (
          <div className="h-16 border-b border-slate-300 bg-white px-6 flex items-center justify-between shrink-0 print:hidden z-20 shadow-sm no-print">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
               <FileText className="w-4 h-4 text-brand-600" />
               Editor de Texto
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={handleGenerate} title="Regenerar">
                <RefreshCw className="w-4 h-4 text-slate-600" />
              </Button>
              <Button size="sm" onClick={handlePrint} className="bg-slate-800 text-white hover:bg-slate-700">
                <Printer className="w-4 h-4 mr-2" /> Imprimir
              </Button>
              {user.id !== 'guest' && (
                <Button size="sm" onClick={handleSave} isLoading={isSaving} className="bg-green-600 text-white hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" /> Guardar
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ÁREA DE TRABAJO (EDITOR) */}
        <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible print:h-auto print-container">
          
          <div className="max-w-[210mm] mx-auto print:w-full print:max-w-none">
            
            {/* Estado Vacío */}
            {!editableContent && !isLoading && (
              <div className="min-h-[297mm] bg-white shadow-xl flex flex-col items-center justify-center text-slate-300 border border-slate-200 rounded-sm print:hidden">
                <LayoutTemplate className="w-20 h-20 mb-4 opacity-20" />
                <p>Configura y genera tu primera ficha para empezar a editar.</p>
              </div>
            )}

            {/* Estado Cargando */}
            {isLoading && (
               <div className="min-h-[297mm] bg-white shadow-xl flex flex-col items-center justify-center text-slate-300 border border-slate-200 rounded-sm print:hidden">
                  <div className="flex flex-col items-center animate-pulse">
                      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-brand-600 font-medium">La IA está escribiendo tu ficha...</p>
                  </div>
               </div>
            )}

            {/* EDITOR REACT QUILL */}
            {editableContent && !isLoading && (
              <div className="bg-white shadow-2xl print:shadow-none">
                <ReactQuill 
                  theme="snow"
                  value={editableContent}
                  onChange={setEditableContent}
                  modules={modules}
                  // El editor se expandirá para parecer una hoja A4
                />
              </div>
            )}
            
            <div className="h-20 print:hidden"></div>
          </div>
        </div>
      </div>
    </div>
  );
};