import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Brain, Check, ChevronRight, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

interface OnboardingWizardProps {
  userId: string;
  onComplete: () => void;
}

// Lista de asignaturas simplificada y visual
const SUBJECTS = [
  { id: 'math', label: 'Matemáticas', icon: '📐' },
  { id: 'lang', label: 'Lengua', icon: '📚' },
  { id: 'sci', label: 'Ciencias', icon: '🧬' },
  { id: 'eng', label: 'Inglés', icon: '🇬🇧' },
  { id: 'hist', label: 'Historia', icon: '🏛️' },
  { id: 'art', label: 'Arte/Música', icon: '🎨' },
  { id: 'pe', label: 'Ed. Física', icon: '⚽' },
  { id: 'other', label: 'Otras', icon: '✨' }
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ userId, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Guardar en Supabase
  const handleFinish = async () => {
    setLoading(true);
    try {
      // 1. Guardamos las asignaturas y marcamos como completado
      const { error } = await supabase
        .from('profiles')
        .update({
          subjects: selectedSubjects,
          onboarding_completed: true
        })
        .eq('id', userId);

      if (error) throw error;
      
      // 2. Cerramos el wizard
      onComplete(); 
    } catch (error) {
      console.error("Error guardando:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (label: string) => {
    if (selectedSubjects.includes(label)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== label));
    } else {
      setSelectedSubjects([...selectedSubjects, label]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-100">
        
        {/* Barra de progreso sutil */}
        <div className="h-1 bg-slate-50 w-full flex">
          <div className={`h-full bg-blue-500 transition-all duration-500 ${step >= 1 ? 'w-1/3' : 'w-0'}`}></div>
          <div className={`h-full bg-blue-500 transition-all duration-500 ${step >= 2 ? 'w-1/3' : 'w-0'}`}></div>
          <div className={`h-full bg-blue-500 transition-all duration-500 ${step >= 3 ? 'w-1/3' : 'w-0'}`}></div>
        </div>

        <div className="p-8">
          
          {/* PASO 1: HOLA PROFE */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 transform hover:rotate-0 transition-all">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">¡Hola, Profe! 👋</h2>
              <p className="text-slate-500 leading-relaxed">
                Bienvenido a <strong>FichaLab</strong>. Soy tu nuevo asistente. <br/>
                Antes de empezar, necesito conocerte un poco para preparar tus materiales a medida.
              </p>
              <button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-4">
                Empezar <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* PASO 2: ASIGNATURAS (Grid visual) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-800">¿Qué impartes?</h2>
                <p className="text-sm text-slate-400">Elige una o varias opciones</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => toggleSubject(sub.label)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      selectedSubjects.includes(sub.label)
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                        : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-xl">{sub.icon}</span>
                    <span className="text-sm font-medium">{sub.label}</span>
                    {selectedSubjects.includes(sub.label) && <Check size={16} className="ml-auto" />}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(1)} className="text-slate-400 text-sm hover:text-slate-600">Atrás</button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={selectedSubjects.length === 0}
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: LISTO (Simple y limpio) */}
          {step === 3 && (
            <div className="text-center space-y-6">
               <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">¡Todo listo!</h2>
              <div className="bg-slate-50 p-4 rounded-xl text-left text-sm text-slate-600 space-y-2 border border-slate-100">
                <p className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Tu perfil ha sido configurado.</p>
                <p className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Tienes <strong>1000 generaciones</strong> disponibles.</p>
                <p className="flex items-center gap-2"><Check size={14} className="text-green-500"/> Acceso a la biblioteca habilitado.</p>
              </div>
              
              <button 
                onClick={handleFinish} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
              >
                {loading ? 'Entrando...' : 'Ir al Dashboard'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};