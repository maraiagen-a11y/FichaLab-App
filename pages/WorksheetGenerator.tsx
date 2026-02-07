import React, { useState } from 'react';
import { generateWorksheet } from '../services/geminiService';
import { EducationLevel, Subject, User, UserPlan, WorksheetResponse } from '../types';
import { Button } from '../components/Button';
import { Sparkles, Printer, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PLAN_LIMITS } from '../constants';

interface WorksheetGeneratorProps {
  user: User;
  onWorksheetGenerated: () => void;
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ user, onWorksheetGenerated }) => {
  const [step, setStep] = useState<'config' | 'preview'>('config');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [level, setLevel] = useState<EducationLevel>(EducationLevel.PRIMARY);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [instructions, setInstructions] = useState('');

  // Result State
  const [result, setResult] = useState<WorksheetResponse | null>(null);

  const limits = PLAN_LIMITS[user.plan];
  const canGenerate = user.plan === UserPlan.PREMIUM || user.generatedCount < limits.maxGenerations;

  const handleGenerate = async () => {
    if (!canGenerate) {
      setError("Has alcanzado el límite de tu plan gratuito. Actualiza a Premium para continuar.");
      return;
    }
    if (!topic.trim()) {
      setError("Por favor, introduce un tema para la ficha.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateWorksheet({
        subject,
        level,
        topic,
        exerciseCount: count,
        instructions
      });
      setResult(response);
      setStep('preview');
      onWorksheetGenerated(); // Increment count in parent state
    } catch (err) {
      setError("Ocurrió un error al generar la ficha. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (step === 'preview' && result) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between no-print">
          <Button variant="outline" onClick={() => setStep('config')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex gap-3">
             <Button variant="outline" onClick={handleGenerate} isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerar
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir / Guardar PDF
            </Button>
          </div>
        </div>

        {/* This container will be printed */}
        <div className="bg-white shadow-lg p-10 md:p-16 rounded-none mx-auto max-w-[210mm] min-h-[297mm] print:shadow-none print:w-full print:max-w-none">
          {/* Header for the worksheet */}
          <div className="border-b-2 border-slate-800 pb-4 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{subject}</h1>
              <p className="text-slate-600 font-medium">{level} - {topic}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-4">Fecha: _______________</div>
              <div className="text-sm text-slate-400">Nombre: ____________________________________</div>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-slate max-w-none print:prose-headings:text-slate-900 print:prose-p:text-slate-800">
             <ReactMarkdown 
               components={{
                 h1: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                 h2: ({node, ...props}) => <h3 className="text-xl font-bold mt-5 mb-3" {...props} />,
                 hr: ({node, ...props}) => <div className="my-10 border-t-2 border-dashed border-slate-300 page-break-before-always" {...props} />,
               }}
             >
                {result.content}
             </ReactMarkdown>
          </div>

          <div className="mt-12 pt-4 border-t border-slate-200 text-center text-xs text-slate-400 print:fixed print:bottom-4 print:left-0 print:w-full">
            Generado con Inteligencia Artificial por EduGenius Platform
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Generador de Fichas IA</h1>
        <p className="text-slate-500">Crea material didáctico personalizado en segundos.</p>
      </div>

      {!canGenerate && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p>Has alcanzado el límite mensual de tu plan gratuito. <button className="font-bold underline">Actualizar Plan</button></p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Asignatura</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
            >
              {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nivel Educativo</label>
             <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={level}
              onChange={(e) => setLevel(e.target.value as EducationLevel)}
            >
              {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Tema Específico</label>
          <input 
            type="text" 
            placeholder="Ej: Suma de fracciones, Los Reyes Católicos, Verbo To Be..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Número de Ejercicios: {count}</label>
          <input 
            type="range" 
            min="1" 
            max="20" 
            className="w-full accent-brand-600"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>1</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Instrucciones Adicionales (Opcional)</label>
          <textarea 
            rows={3}
            placeholder="Ej: Incluir problemas de la vida real, usar un tono divertido..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <div className="pt-4">
          <Button 
            className="w-full py-3 text-lg" 
            onClick={handleGenerate} 
            disabled={!canGenerate || isLoading}
            isLoading={isLoading}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generar Ficha
          </Button>
          <p className="text-center text-xs text-slate-500 mt-3">
            La generación puede tardar hasta 15 segundos.
          </p>
        </div>
      </div>
    </div>
  );
};
