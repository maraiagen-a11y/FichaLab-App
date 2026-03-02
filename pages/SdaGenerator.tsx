import React, { useState, useEffect } from 'react';
import { User, EducationLevel, Subject } from '../types';
import { Target, Sparkles, Loader2, AlertCircle, Printer, ArrowLeft, ChevronDown } from 'lucide-react';
import { generateLearningSituation } from '../services/geminiService';

interface SdaGeneratorProps {
  user: User;
}

export const SdaGenerator: React.FC<SdaGeneratorProps> = ({ user }) => {
  useEffect(() => {
    document.title = "Generador de Situaciones de Aprendizaje LOMLOE | FichaLab";
  }, []);

  const [subject, setSubject] = useState<Subject>('Conocimiento del Medio' as Subject);
  const [level, setLevel] = useState<EducationLevel>('4º Primaria' as EducationLevel);
  const [topic, setTopic] = useState('');
  const [sessions, setSessions] = useState(6);
  const [instructions, setInstructions] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedHtml(null);

    try {
      const response = await generateLearningSituation({ subject, level, topic, sessions, instructions });
      setGeneratedHtml(response.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (generatedHtml) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6 no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setGeneratedHtml(null)}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold"
          >
            <ArrowLeft size={20} /> Nueva Situación
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-3 rounded-full font-bold flex items-center gap-2"
          >
            <Printer size={20} /> Guardar PDF
          </button>
        </div>
        <div className="bg-white shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
          <div className="p-8 print:p-0" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Target className="text-[#4F75FF] w-8 h-8" />
          Situaciones de Aprendizaje (SdA)
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Justifica saberes básicos, competencias y secuencia las sesiones de tu proyecto LOMLOE en segundos.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle size={20} className="mt-0.5" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Asignatura</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)} className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#4F75FF]">
                {['Matemáticas', 'Lengua y Literatura', 'Inglés', 'Conocimiento del Medio', 'Física y Química', 'Biología y Geología', 'Geografía e Historia', 'Educación Física', 'Plástica', 'Música'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nivel</label>
              <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)} className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#4F75FF]">
                {['1º Primaria', '2º Primaria', '3º Primaria', '4º Primaria', '5º Primaria', '6º Primaria', '1º ESO', '2º ESO', '3º ESO', '4º ESO', '1º Bachillerato', '2º Bachillerato'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nº Sesiones</label>
              <input type="number" min="1" max="15" value={sessions} onChange={(e) => setSessions(Number(e.target.value))} className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#4F75FF]" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">¿De qué va el proyecto o reto?</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ej: Crear un huerto escolar ecológico para entender los ecosistemas..." className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#4F75FF]" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Instrucciones o producto final (Opcional)</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Ej: El producto final debe ser un podcast grabado por los alumnos..." className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#4F75FF] h-24 resize-none" />
          </div>

          <button type="submit" disabled={isGenerating || !topic.trim()} className="w-full bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] text-white font-bold py-4 px-6 rounded-full hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:transform-none">
            {isGenerating ? <><Loader2 className="animate-spin" size={20} /><span>Redactando Situación de Aprendizaje...</span></> : <><Sparkles size={20} /><span>Generar SdA con IA</span></>}
          </button>
        </form>
      </div>
    </div>
  );
};