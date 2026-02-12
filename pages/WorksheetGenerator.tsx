import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; 
import { generateWorksheet } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { EducationLevel, Subject, User, UserPlan } from '../types';
import { Button } from '../components/Button';
import { PLAN_LIMITS } from '../constants';
import { Sparkles, Printer, Save, LayoutTemplate, RefreshCw, FileText, Download } from 'lucide-react';

// @ts-ignore
import html2pdf from 'html2pdf.js';

interface WorksheetGeneratorProps { user: User; onWorksheetGenerated: () => void; }

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ user, onWorksheetGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [level, setLevel] = useState<EducationLevel>(EducationLevel.PRIMARY);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [instructions, setInstructions] = useState('');
  const [editableContent, setEditableContent] = useState<string>(''); 

  const limits = PLAN_LIMITS[user.plan];
  const canGenerate = user.plan === UserPlan.PREMIUM || user.generatedCount < limits.maxGenerations;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    if (!topic.trim()) { setError("Introduce un tema."); return; }
    setIsLoading(true); setError(null); setEditableContent(''); 

    try {
      const response = await generateWorksheet({ subject, level, topic, exerciseCount: count, instructions });
      setEditableContent(response.content);
      if (user.id !== 'guest') {
        const { error: err } = await supabase.from('profiles').update({ generated_count: user.generatedCount + 1 }).eq('id', user.id);
        if (!err) onWorksheetGenerated(); 
      }
    } catch (err) { console.error(err); setError("Error con la IA."); } finally { setIsLoading(false); }
  };

  const handleSave = async () => {
    if (!editableContent || user.id === 'guest') return;
    setIsSaving(true);
    try {
      const { error: err } = await supabase.from('resources').insert([{ user_id: user.id, title: `${subject}: ${topic} (${level})`, content: editableContent, type: 'worksheet' }]);
      if (err) throw err;
      alert('¡Guardada en Biblioteca!');
    } catch (err) { alert('Error al guardar.'); } finally { setIsSaving(false); }
  };

  // --- FUNCIÓN DESCARGA PDF (ESTRATEGIA VISIBLE/FANTASMA) ---
  const handleDownloadPDF = () => {
    if (!editableContent) return;
    setIsDownloading(true);

    // 1. Crear contenedor temporal VISIBLE
    const container = document.createElement('div');
    container.id = 'pdf-generator-temp';
    
    // Estilos para superponerlo (Overlay blanco)
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '99999';
    container.style.backgroundColor = 'white';
    container.style.overflowY = 'scroll';
    
    // Contenedor A4 interno
    const a4Page = document.createElement('div');
    a4Page.className = 'ql-editor';
    a4Page.innerHTML = editableContent; // Copiamos el contenido del editor
    
    // Estilos A4
    a4Page.style.width = '210mm';
    a4Page.style.minHeight = '297mm';
    a4Page.style.padding = '20mm';
    a4Page.style.margin = '0 auto';
    a4Page.style.backgroundColor = 'white';

    // Inyectamos estilos
    const style = document.createElement('style');
    style.innerHTML = `
      #pdf-generator-temp .ql-editor h1 { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; font-size: 2em; color: black; }
      #pdf-generator-temp .ql-editor h2 { margin-top: 30px; margin-bottom: 15px; color: #334155; font-size: 1.5em; }
      #pdf-generator-temp .ql-editor li { margin-bottom: 1.5cm; }
      #pdf-generator-temp .ql-editor { font-family: sans-serif; font-size: 16px; line-height: 1.6; }
    `;
    
    container.appendChild(style);
    container.appendChild(a4Page);
    document.body.appendChild(container);

    const opt = {
      margin:       0, 
      filename:     `Ficha_${topic || 'EduGenius'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, scrollY: 0 }, 
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: 'css' }
    };

    setTimeout(() => {
        html2pdf().set(opt).from(a4Page).save().then(() => {
            document.body.removeChild(container);
            setIsDownloading(false);
        });
    }, 500);
  };

  // --- IMPRESIÓN PRO (IFRAME) ---
  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed'; iframe.style.right = '0'; iframe.style.bottom = '0'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${topic || 'Ficha'}</title>
          <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
          <style>
            @page { margin: 20mm; size: auto; }
            body { margin: 0; padding: 20mm; font-family: sans-serif; -webkit-print-color-adjust: exact; }
            .ql-container.ql-snow { border: none !important; }
            .ql-editor { padding: 0 !important; overflow: visible !important; }
            li { margin-bottom: 1.5cm; } 
            h1 { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; } 
            h2 { margin-top: 30px; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="ql-container ql-snow"><div class="ql-editor">${editableContent}</div></div>
          <script>
            window.onload = function() { setTimeout(function() { window.focus(); window.print(); }, 500); };
          </script>
        </body>
      </html>
    `);
    doc.close();
    setTimeout(() => { document.body.removeChild(iframe); }, 2000);
  };

  const modules = {
    toolbar: [ [{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['clean'] ],
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-slate-100 overflow-hidden font-sans print:h-auto print:overflow-visible print:bg-white">
      
      <style>{`
        .ql-container { font-family: inherit; font-size: 16px; border: none !important; }
        .ql-editor { min-height: 250mm; padding: 20mm; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); line-height: 1.6; }
        .ql-editor li { margin-bottom: 1.5cm !important; padding-left: 0.5rem; }
        .ql-editor h1 { font-size: 2em; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .ql-editor h2 { font-size: 1.5em; margin-top: 30px; margin-bottom: 15px; color: #334155; }
        .ql-toolbar { background: #f8fafc; border-bottom: 1px solid #e2e8f0 !important; border-top: none !important; border-radius: 8px 8px 0 0; }
        
        @media print {
          @page { margin: 15mm; size: auto; }
          body { background: white; height: auto; overflow: visible; }
          nav, aside, .no-print, .ql-toolbar { display: none !important; }
          .ql-editor { box-shadow: none; padding: 0; width: 100% !important; }
          .ql-editor li { margin-bottom: 1.5cm !important; }
          .print-container { position: absolute; top: 0; left: 0; width: 100%; margin: 0; padding: 0; }
          .flex-1 { overflow: visible !important; display: block !important; }
        }
      `}</style>

      {/* PANEL IZQUIERDO */}
      <div className="w-full lg:w-[400px] bg-white border-r border-slate-200 flex flex-col h-full z-10 print:hidden no-print">
        <div className="p-6 border-b border-slate-100"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><LayoutTemplate className="w-5 h-5 text-brand-600"/> Configuración</h2></div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500">Asignatura</label><select className="w-full border-slate-200 rounded-lg text-sm py-2" value={subject} onChange={(e) => setSubject(e.target.value as Subject)}>{Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="text-xs font-bold text-slate-500">Nivel</label><select className="w-full border-slate-200 rounded-lg text-sm py-2" value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)}>{Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}</select></div>
          </div>
          <div><label className="text-xs font-bold text-slate-500">Tema</label><input type="text" className="w-full border-slate-200 rounded-lg text-sm py-2" placeholder="Ej: Logaritmos..." value={topic} onChange={(e) => setTopic(e.target.value)}/></div>
          <div><div className="flex justify-between mb-2"><label className="text-xs font-bold text-slate-500">Ejercicios: {count}</label></div><input type="range" min="1" max="20" className="w-full h-2 bg-slate-100 rounded-lg accent-brand-600" value={count} onChange={(e) => setCount(parseInt(e.target.value))}/></div>
          <div><label className="text-xs font-bold text-slate-500">Instrucciones</label><textarea className="w-full border-slate-200 rounded-lg text-sm py-2" rows={3} placeholder="Ej: Solo ejercicios, sin teoría..." value={instructions} onChange={(e) => setInstructions(e.target.value)}/></div>
          <div className="pt-4"><Button onClick={handleGenerate} isLoading={isLoading} disabled={!canGenerate || !topic} className="w-full py-3 bg-brand-600 shadow-lg"><Sparkles className="w-4 h-4 mr-2"/> {editableContent ? 'Regenerar' : 'Generar'}</Button></div>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="flex-1 flex flex-col h-full bg-slate-200 overflow-hidden relative print:bg-white print:overflow-visible print:h-auto print:block">
        {editableContent && (
          <div className="h-16 border-b border-slate-300 bg-white px-6 flex items-center justify-between shrink-0 print:hidden z-20 no-print">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600"><FileText className="w-4 h-4 text-brand-600"/> Editor</div>
            <div className="flex gap-2">
               {/* BOTÓN DESCARGA PDF */}
               <Button size="sm" onClick={handleDownloadPDF} disabled={isDownloading} className="bg-slate-700 text-white">
                  {isDownloading ? '...' : <><Download className="w-4 h-4 mr-2" /> PDF</>}
               </Button>

               <Button variant="outline" size="sm" onClick={handleGenerate}><RefreshCw className="w-4 h-4"/></Button>
               <Button size="sm" onClick={handlePrint} className="bg-slate-800 text-white"><Printer className="w-4 h-4 mr-2"/> Imprimir</Button>
               {user.id !== 'guest' && <Button size="sm" onClick={handleSave} isLoading={isSaving} className="bg-green-600 text-white"><Save className="w-4 h-4 mr-2"/> Guardar</Button>}
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible print:h-auto print-container">
          <div className="max-w-[210mm] mx-auto print:w-full print:max-w-none">
            {!editableContent && !isLoading && <div className="min-h-[297mm] bg-white shadow-xl flex items-center justify-center text-slate-300 rounded-sm print:hidden"><LayoutTemplate className="w-20 h-20 opacity-20"/></div>}
            {isLoading && <div className="min-h-[297mm] bg-white shadow-xl flex items-center justify-center text-slate-300 rounded-sm print:hidden"><div className="animate-spin w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full"></div></div>}
            {editableContent && !isLoading && <div className="bg-white shadow-2xl print:shadow-none"><ReactQuill theme="snow" value={editableContent} onChange={setEditableContent} modules={modules}/></div>}
            <div className="h-20 print:hidden"></div>
          </div>
        </div>
      </div>
    </div>
  );
};