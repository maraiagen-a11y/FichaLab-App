import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
// Importamos los iconos nuevos: Edit3 (lápiz), Save (guardar), RotateCcw (cancelar)
import { Trash2, Download, Eye, X, FileText, Search, Edit3, Save, RotateCcw } from 'lucide-react';

// Importamos el editor
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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

  // 3. SELECCIONAR FICHA (Prepara el modo edición por si acaso)
  const handleSelectResource = (res: any) => {
    setSelectedResource(res);
    setIsEditing(false); // Al cambiar de ficha, siempre empezamos en modo lectura
    setEditedContent(res.content); // Cargamos el contenido en el estado del editor
  };

  // 4. GUARDAR CAMBIOS (UPDATE EN SUPABASE)
  const handleSaveChanges = async () => {
    if (!selectedResource) return;
    setIsSaving(true);
    try {
      // Actualizamos en la base de datos
      const { error } = await supabase
        .from('resources')
        .update({ content: editedContent })
        .eq('id', selectedResource.id);

      if (error) throw error;

      // Actualizamos el estado local para que se vea reflejado sin recargar
      const updatedResource = { ...selectedResource, content: editedContent };
      setSelectedResource(updatedResource);
      setResources(resources.map(r => r.id === selectedResource.id ? updatedResource : r));
      
      setIsEditing(false); // Volvemos al modo lectura
      alert("✅ Cambios guardados correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar cambios");
    } finally {
      setIsSaving(false);
    }
  };

  // 5. IFRAME MAGICO (Solo se activa si NO estamos editando)
  useEffect(() => {
    if (selectedResource && !isEditing && iframeRef.current) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) { doc.open(); doc.write(selectedResource.content); doc.close(); }
    }
  }, [selectedResource, isEditing]); // Dependencia clave: isEditing

  // 6. IMPRIMIR
  const handlePrint = () => {
    // Si estamos editando, no dejamos imprimir (primero guarda)
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
      <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FileText className="text-blue-600"/> Biblioteca</h2>
          <p className="text-sm text-gray-500 mt-1">{resources.length} fichas</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? <div className="p-4 text-center">Cargando...</div> : 
           resources.map((res) => (
            <div key={res.id} onClick={() => handleSelectResource(res)}
              className={`p-4 rounded-lg border cursor-pointer hover:shadow-md ${selectedResource?.id === res.id ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
              <h3 className="font-bold text-gray-800 truncate text-sm">{res.title}</h3>
              <div className="flex justify-between mt-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{res.subject || 'General'}</span>
                <button onClick={(e) => handleDelete(res.id, e)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === VISOR / EDITOR DERECHA === */}
      <div className="flex-1 flex flex-col h-full bg-gray-800 relative min-w-0">
        {selectedResource ? (
          <>
            {/* BARRA SUPERIOR DINÁMICA */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20">
              <div className="flex items-center gap-2 overflow-hidden">
                {/* Cambiamos el icono según el modo */}
                {isEditing ? <Edit3 className="text-orange-500" size={20}/> : <Eye className="text-blue-600" size={20}/>}
                <span className="text-gray-500 text-sm hidden sm:inline">{isEditing ? "Editando:" : "Viendo:"}</span>
                <h3 className="font-bold text-gray-800 truncate max-w-md">{selectedResource.title}</h3>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  /* --- BOTONES MODO EDICIÓN --- */
                  <>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                      <RotateCcw size={16}/> Cancelar
                    </button>
                    <button 
                      onClick={handleSaveChanges} 
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md text-sm font-medium"
                    >
                      {isSaving ? "..." : <><Save size={16}/> Guardar</>}
                    </button>
                  </>
                ) : (
                  /* --- BOTONES MODO VISOR --- */
                  <>
                    <button 
                      onClick={() => { setEditedContent(selectedResource.content); setIsEditing(true); }}
                      className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium"
                    >
                      <Edit3 size={16}/> Editar
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-2 self-center"></div>
                    <button onClick={handlePrint} className="flex gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 shadow-md text-sm font-medium">
                      <Download size={16}/> PDF
                    </button>
                    <button onClick={() => setSelectedResource(null)} className="p-2 text-gray-400 hover:text-gray-600"><X size={20}/></button>
                  </>
                )}
              </div>
            </div>
            
            {/* CONTENEDOR PRINCIPAL */}
            <div className="preview-container w-full flex-1">
              <div className="paper-a4">
                 {isEditing ? (
                   /* MODO EDITOR: React Quill */
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
                         ['clean'] // Botón para limpiar formato
                       ],
                     }}
                   />
                 ) : (
                   /* MODO VISOR: Iframe */
                   <iframe ref={iframeRef} className="preview-iframe" title="Visor"/>
                 )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Search size={64} className="opacity-20 mb-4"/>
            <p>Selecciona una ficha</p>
          </div>
        )}
      </div>
    </div>
  );
};