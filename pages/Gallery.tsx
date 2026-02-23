import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Search, FileText, Download, X, Globe, Sparkles, BookOpen } from 'lucide-react';
import { marked } from 'marked';
import './Worksheet-preview.css';

export const Gallery = () => {
  const [publicResources, setPublicResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchPublicResources();
  }, []);

  // 1. BUSCAR SOLO LAS FICHAS PÚBLICAS
  const fetchPublicResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('is_public', true) // ¡La magia ocurre aquí!
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPublicResources(data || []);
    } catch (error) {
      console.error('Error cargando la galería:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. ABRIR FICHA (Convierte Markdown a HTML)
  const handleOpenResource = async (res: any) => {
    try {
      const htmlContent = await marked.parse(res.content);
      setSelectedResource({ ...res, htmlContent });
    } catch (e) {
      setSelectedResource({ ...res, htmlContent: res.content });
    }
  };

  // 3. INYECTAR EN EL IFRAME
  useEffect(() => {
    if (selectedResource && iframeRef.current) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) { 
        doc.open(); 
        doc.write(`
          <html>
            <head>
              <style>
                body { font-family: sans-serif; padding: 20mm; line-height: 1.6; color: #333; }
                h1, h2, h3 { color: #1e293b; margin-top: 1.5em; margin-bottom: 0.5em; }
                h1 { border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
                ul, ol { margin-bottom: 1.5em; padding-left: 20px; }
                li { margin-bottom: 0.5em; }
                strong { color: #0f172a; }
                p { margin-bottom: 1em; }
              </style>
            </head>
            <body>${selectedResource.htmlContent}</body>
          </html>
        `); 
        doc.close(); 
      }
    }
  }, [selectedResource]);

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.focus();
    iframeRef.current?.contentWindow?.print();
  };

  const filteredResources = publicResources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (res.subject && res.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      {/* HEADER DE LA COMUNIDAD */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-6">
            <Globe className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Comunidad FichaLab
          </h1>
          <p className="text-xl text-slate-500 mb-10">
            Descubre, usa y comparte recursos creados por otros profesores. Juntos ahorramos más tiempo.
          </p>
          
          {/* BARRA DE BÚSQUEDA */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Buscar por asignatura, tema o curso..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-lg font-medium text-slate-700 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* GRID ESTILO PINTEREST */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="text-center text-slate-400 font-bold animate-pulse text-xl">
            Cargando el talento de los profes...
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-xl font-bold text-slate-700">Aún no hay fichas públicas aquí.</p>
            <p>¡Sé el primero en compartir una desde tu Biblioteca!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((res) => (
              <div 
                key={res.id} 
                onClick={() => handleOpenResource(res)}
                className="bg-white rounded-3xl border border-slate-200 p-6 cursor-pointer hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all group flex flex-col h-64"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
                      {res.subject || 'General'}
                    </span>
                    <Sparkles className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 line-clamp-3">
                    {res.title}
                  </h3>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 font-medium mt-auto">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4"/> PDF Listo</span>
                  <span className="text-blue-600 group-hover:underline">Ver ficha &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL PARA VER LA FICHA (El visor) */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* CABECERA DEL MODAL */}
            <div className="bg-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-200">
              <div className="flex items-center gap-3 truncate">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 truncate">{selectedResource.title}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase">{selectedResource.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-4">
                <button 
                  onClick={handlePrint} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#4F75FF] text-white rounded-xl hover:bg-[#3d5ee6] font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
                >
                  <Download className="w-5 h-5" /> Descargar 
                </button>
                <button 
                  onClick={() => setSelectedResource(null)} 
                  className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* CONTENEDOR DEL FOLIO */}
            <div className="flex-1 overflow-y-auto relative p-0 custom-scrollbar">
              <div className="preview-container">
                <div className="paper-a4">
                   <iframe ref={iframeRef} className="preview-iframe" title="Visor"/>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};