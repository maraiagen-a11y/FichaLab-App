import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Download, Eye, X, FileText, Search, Edit3, Save, RotateCcw } from 'lucide-react';

// Importamos el editor
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// ¡ESTA LÍNEA ES VITAL PARA QUE NO SE ROMPA EL FOLIO!
import './worksheet-preview.css';

export const ResourceLibrary = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  
  // --- NUEVOS ESTADOS PARA EDICIÓN ---
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. CARGAR FICHAS
  useEffect(() => { fetchResources(); }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setResources(data || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  // 2. BORRAR
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Borrar esta ficha?')) return;
    try {
      await supabase.from('resources').delete().eq('id', id);
      setResources(resources.filter(r => r.id !== id));
      if (selectedResource?.id === id) setSelectedResource(null);
    } catch (error) { alert('Error al borrar'); }
  };

  // 3. SELECCIONAR FICHA
  const handleSelectResource = (res: any) => {
    setSelectedResource(res);
    setIsEditing(false); 
    setEditedContent(res.content); 
  };

  // 4. GUARDAR CAMBIOS
  const handleSaveChanges = async () => {
    if (!selectedResource) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('resources')
        .update({ content: editedContent })
        .eq('id', selectedResource.id);

      if (error) throw error;

      const updatedResource = { ...selectedResource, content: editedContent };
      setSelectedResource(updatedResource);
      setResources(resources.map(r => r.id === selectedResource.id ? updatedResource : r));
      
      setIsEditing(false); 
      alert("✅ Cambios guardados correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar cambios");
    } finally {
      setIsSaving(false);
    }
  };

  // 5. IFRAME MAGICO 
  useEffect(() => {
    if (selectedResource && !isEditing && iframeRef.current) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) { 
        doc.open(); 
        doc.write(selectedResource.content); 
        doc.close(); 
      }
    }
  }, [selectedResource, isEditing]); 

  // 6. IMPRIMIR
  const handlePrint = () => {
    if (isEditing) {
        alert("Por favor, guarda los cambios o cancela la edición antes de imprimir.");
        return;
    }
    iframeRef.current?.contentWindow?.focus();
    iframeRef.current?.contentWindow?.print();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* === LISTA IZQUIERDA === */}
      <div className="w-[380px] md:w-[400px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl shrink-0 print:hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FileText className="text-blue-600"/> Biblioteca</h2>
          <p className="text-sm text-gray-500 mt-1">{resources.length} fichas guardadas</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="p-4 text-center text-slate-400 animate-pulse">Cargando biblioteca...</div> 
          ) : resources.length === 0 ? (
            <div className="text-center text-slate-500 mt-10 p-4">
              <p>Tu biblioteca está vacía.</p>
              <p className="text-sm mt-2">¡Ve al Generador y crea tu primera ficha!</p>
            </div>
          ) : (
           resources.map((res) => (
            <div key={res.id} onClick={() => handleSelectResource(res)}
              className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedResource?.id === res.id ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
              <h3 className="font-bold text-gray-800 truncate text-sm mb-2">{res.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                  {res.subject || 'General'}
                </span>
                <button 
                  onClick={(e) => handleDelete(res.id, e)} 
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Eliminar ficha"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* === VISOR / EDITOR DERECHA === */}
      <div className="flex-1 flex flex-col h-full bg-slate-900 relative min-w-0 print:bg-white overflow-hidden">
        {selectedResource ? (
          <>
            {/* BARRA SUPERIOR DINÁMICA */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-20 print:hidden">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-1.5 rounded-lg ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                  {isEditing ? <Edit3 size={18} className="stroke-[2.5]"/> : <Eye size={18} className="stroke-[2.5]"/>}
                </div>
                <span className="text-slate-500 text-sm font-medium hidden sm:inline">
                  {isEditing ? "Modo Edición:" : "Viendo:"}
                </span>
                <h3 className="font-bold text-gray-800 truncate max-w-[200px] md:max-w-md">{selectedResource.title}</h3>
              </div>
              
              <div className="flex items-center gap-2 md:gap-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="flex items-center gap-2 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-bold transition-colors"
                    >
                      <RotateCcw size={16} className="stroke-[2.5]"/> <span className="hidden sm:inline">Cancelar</span>
                    </button>
                    <button 
                      onClick={handleSaveChanges} 
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md text-sm font-bold transition-colors active:scale-95"
                    >
                      {isSaving ? "Guardando..." : <><Save size={16} className="stroke-[2.5]"/> Guardar</>}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { setEditedContent(selectedResource.content); setIsEditing(true); }}
                      className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"
                    >
                      <Edit3 size={16} className="stroke-[2.5]"/> Editar
                    </button>
                    
                    <div className="hidden md:block w-px h-6 bg-slate-200 mx-1"></div>
                    
                    <button 
                      onClick={handlePrint} 
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 shadow-md text-sm font-bold transition-all active:scale-95"
                    >
                      <Download size={16} className="stroke-[2.5]"/> <span className="hidden sm:inline">Descargar PDF</span>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedResource(null)} 
                      className="ml-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                      title="Cerrar vista previa"
                    >
                      <X size={20} className="stroke-[2.5]"/>
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* CONTENEDOR PRINCIPAL (Usa las clases del worksheet-preview.css) */}
            <div className="flex-1 overflow-y-auto relative p-0 print:p-0 print:overflow-visible custom-scrollbar bg-[#0f172a]">
              <div className="preview-container">
                <div className="paper-a4">
                   {isEditing ? (
                     <ReactQuill 
                       theme="snow"
                       value={editedContent} 
                       onChange={setEditedContent}
                       className="h-full"
                       modules={{
                         toolbar: [
                           [{ 'header': [1, 2, 3, false] }],
                           ['bold', 'italic', 'underline'],
                           [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                           ['clean']
                         ],
                       }}
                     />
                   ) : (
                     <iframe ref={iframeRef} className="preview-iframe" title="Visor"/>
                   )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Search size={40} className="text-slate-600"/>
            </div>
            <p className="text-xl font-bold text-white mb-2">Ninguna ficha seleccionada</p>
            <p className="text-slate-400 text-sm">Haz clic en una ficha de la izquierda para verla o editarla.</p>
          </div>
        )}
      </div>
    </div>
  );
};