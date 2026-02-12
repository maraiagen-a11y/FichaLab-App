import React, { useEffect, useState } from 'react';
import { User, Resource } from '../types';
import { supabase } from '../services/supabaseClient';
import { Search, Trash2, Eye, FileText, X, Printer, Calendar, Globe, Users, Download } from 'lucide-react';
import { Button } from '../components/Button';
import 'react-quill-new/dist/quill.snow.css'; 

// @ts-ignore
import html2pdf from 'html2pdf.js';

const MOCK_RESOURCES: Resource[] = [{
  id: 'mock-1', user_id: 'guest', title: 'Ejemplo', content: '<p>Ejemplo...</p>', created_at: new Date().toISOString(), type: 'worksheet', is_public: true
}];

interface ResourceLibraryProps { user: User; }

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'private' | 'public'>('private');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const isGuest = user.id === 'guest';

  useEffect(() => { fetchResources(); }, [user.id, activeTab]);

  const fetchResources = async () => {
    if (isGuest && activeTab === 'private') { setResources(MOCK_RESOURCES); setLoading(false); return; }
    try {
      setLoading(true);
      let query = supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (activeTab === 'private') query = query.eq('user_id', user.id);
      else query = query.eq('is_public', true);
      const { data, error } = await query;
      if (error) throw error;
      setResources(data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGuest || !window.confirm('¿Borrar ficha?')) return;
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (!error) {
      setResources(resources.filter(r => r.id !== id));
      if (selectedResource?.id === id) setSelectedResource(null);
    }
  };

  const togglePublic = async (resource: Resource, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGuest) return;
    const newValue = !resource.is_public;
    const { error } = await supabase.from('resources').update({ is_public: newValue }).eq('id', resource.id);
    if (!error) setResources(resources.map(r => r.id === resource.id ? { ...r, is_public: newValue } : r));
  };

  // --- FUNCIÓN DE DESCARGA PDF (ESTRATEGIA VISIBLE) ---
  const handleDownloadPDF = () => {
    if (!selectedResource) return;
    setIsDownloading(true);

    // 1. Crear contenedor temporal VISIBLE (Overlay)
    const container = document.createElement('div');
    container.id = 'pdf-generator-container';
    
    // Estilos para que se vea bien y tape la pantalla momentáneamente
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '99999'; // Encima de todo
    container.style.backgroundColor = 'white'; // Fondo blanco puro
    container.style.overflowY = 'scroll'; // Permite scroll si es largo
    
    // Contenedor interno tipo A4 centrado
    const a4Page = document.createElement('div');
    a4Page.className = 'ql-editor'; // Usamos estilos de Quill
    a4Page.innerHTML = selectedResource.content;
    
    // Estilos exactos de A4
    a4Page.style.width = '210mm';
    a4Page.style.minHeight = '297mm';
    a4Page.style.padding = '20mm';
    a4Page.style.margin = '0 auto'; // Centrado
    a4Page.style.backgroundColor = 'white';
    a4Page.style.color = 'black'; // Aseguramos texto negro

    // Inyectamos estilos específicos para que se vea bien
    const style = document.createElement('style');
    style.innerHTML = `
      #pdf-generator-container .ql-editor h1 { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; font-size: 2em; color: black; }
      #pdf-generator-container .ql-editor h2 { margin-top: 30px; margin-bottom: 15px; color: #334155; font-size: 1.5em; }
      #pdf-generator-container .ql-editor li { margin-bottom: 1.5cm; } /* Espacio para escribir */
      #pdf-generator-container .ql-editor blockquote { border-left: 4px solid #cbd5e1; padding-left: 15px; color: #475569; font-style: italic; }
      #pdf-generator-container .ql-editor { font-family: sans-serif; font-size: 16px; line-height: 1.6; }
    `;
    
    container.appendChild(style);
    container.appendChild(a4Page);
    document.body.appendChild(container);

    const opt = {
      margin:       0, 
      filename:     `${selectedResource.title}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, scrollY: 0 }, 
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: 'css' } 
    };

    // Pequeño retardo para asegurar que el navegador ha "pintado" el elemento
    setTimeout(() => {
        html2pdf().set(opt).from(a4Page).save().then(() => {
            document.body.removeChild(container); // Quitamos el contenedor
            setIsDownloading(false);
        });
    }, 500); // Medio segundo de espera para asegurar renderizado
  };

  // --- IMPRESIÓN PRO ---
  const handlePrint = () => {
    if (!selectedResource) return;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed'; iframe.style.right = '0'; iframe.style.bottom = '0'; iframe.style.width = '0'; iframe.style.height = '0'; iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${selectedResource.title}</title>
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
          <div class="ql-container ql-snow"><div class="ql-editor">${selectedResource.content}</div></div>
          <script>
            window.onload = function() { setTimeout(function() { window.focus(); window.print(); }, 500); };
          </script>
        </body>
      </html>
    `);
    doc.close();
    setTimeout(() => { document.body.removeChild(iframe); }, 2000);
  };

  const filteredResources = resources.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 relative font-sans">
      
      {/* CSS WEB */}
      <style>{`
        .ql-editor { font-family: inherit; font-size: 16px; line-height: 1.6; padding: 0 !important; }
        .ql-editor li { margin-bottom: 1.5cm; padding-left: 0.5rem; }
        .ql-editor h1 { font-size: 2em; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .ql-editor h2 { font-size: 1.5em; margin-top: 30px; margin-bottom: 15px; color: #334155; }
        .ql-editor blockquote { border-left: 4px solid #cbd5e1; padding-left: 15px; color: #475569; font-style: italic; }
      `}</style>

      {/* CABECERA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Biblioteca de Recursos</h1>
        <div className="bg-slate-100 p-1 rounded-xl flex font-medium text-sm">
            <button onClick={() => setActiveTab('private')} className={`px-4 py-2 rounded-lg ${activeTab === 'private' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Mis Fichas</button>
            <button onClick={() => setActiveTab('public')} className={`px-4 py-2 rounded-lg ${activeTab === 'public' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Galería</button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
        {loading ? <div className="p-8 text-center text-slate-400">Cargando...</div> : 
         filteredResources.length === 0 ? <div className="p-8 text-center text-slate-500">No hay fichas.</div> : (
          <div className="divide-y divide-slate-100">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedResource(resource)}>
                <div className="col-span-8 font-medium truncate">{resource.title}</div>
                <div className="col-span-4 flex justify-end gap-2">
                   {!isGuest && resource.user_id === user.id && (
                     <button onClick={(e) => togglePublic(resource, e)} className="p-2 text-slate-400 hover:text-blue-600"><Globe className="w-4 h-4"/></button>
                   )}
                   <button onClick={(e) => handleDelete(resource.id, e)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedResource && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="font-bold text-slate-800 truncate">{selectedResource.title}</h2>
              <div className="flex gap-2">
                <Button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-slate-700 text-white hover:bg-slate-800">
                    {isDownloading ? 'Generando...' : <><Download className="w-4 h-4 mr-2" /> PDF</>}
                </Button>
                <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Imprimir</Button>
                <button onClick={() => setSelectedResource(null)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto flex-1 bg-slate-100">
               <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm] p-[20mm] text-slate-900">
                  <div className="ql-editor" dangerouslySetInnerHTML={{ __html: selectedResource.content }} />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// Forzando actualización de Vercel