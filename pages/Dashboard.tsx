import React, { useEffect, useState } from 'react';
import { 
  Plus, Zap, FileText, Crown, ArrowRight, 
  Brain, Sparkles, Clock, TrendingUp, AlertCircle 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

// MASCOTA
const BrainMascot = () => (
  <div className="relative group cursor-pointer">
    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition duration-300"></div>
    <div className="relative w-16 h-16 bg-gradient-to-br from-white to-blue-50 rounded-2xl flex items-center justify-center shadow-xl border border-blue-100 overflow-hidden">
      <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-400 animate-pulse z-10" />
      <Brain className="w-9 h-9 text-blue-600 z-10 relative" />
    </div>
  </div>
);

interface DashboardProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [stats, setStats] = useState({
    savedResources: 0,
    recentActivity: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  // --- REGLAS DE NEGOCIO ---
  const isPremium = user?.plan === 'premium';
  // AQUÍ ESTABA EL CAMBIO: Ponemos 3 en lugar de 10
  const maxGenerations = isPremium ? 1000 : 3; 
  const currentGenerations = user?.generatedCount || 0;
  
  // Porcentaje de uso
  const usagePercentage = Math.min((currentGenerations / maxGenerations) * 100, 100);
  const isLimitReached = !isPremium && currentGenerations >= maxGenerations;

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      if (!user) return;

      const { count: savedCount } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id); 

      const { data: recent } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)
        .eq('user_id', user.id);

      setStats({
        savedResources: savedCount || 0,
        recentActivity: recent || []
      });
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (subject: string) => {
    const s = subject?.toLowerCase() || "";
    if (s.includes('mat')) return 'bg-blue-100 text-blue-600';
    if (s.includes('len')) return 'bg-red-100 text-red-600';
    if (s.includes('ing')) return 'bg-purple-100 text-purple-600';
    if (s.includes('cie')) return 'bg-green-100 text-green-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        
        <div className="flex items-center gap-6 z-10">
          <BrainMascot />
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Hola, {user?.name || "Profe"} <span className="animate-wave inline-block origin-bottom-right">👋</span>
            </h1>
            <p className="text-slate-300 mt-2 text-lg max-w-xl leading-relaxed">
              Soy tu <span className="text-blue-400 font-bold">asistente inteligente</span>. Dime qué necesitas enseñar hoy y prepararé tus materiales al instante.
            </p>
          </div>
        </div>

        {/* Botón de acción (Deshabilitado si alcanzó el límite gratuito) */}
        <button 
          onClick={() => isLimitReached ? onNavigate('pricing') : onNavigate('generator')}
          className={`z-10 px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 transform hover:scale-105 ${
            isLimitReached 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/50' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50'
          }`}
        >
          {isLimitReached ? <Crown size={20} /> : <Plus size={20} />}
          {isLimitReached ? "Mejorar Plan" : "Crear Nueva Ficha"}
        </button>
      </div>

      {/* GRID DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TARJETA GENERACIONES (Límite 3) */}
        <div className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between hover:shadow-md transition-shadow ${
            isLimitReached ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'
          }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-sm font-bold uppercase tracking-wider ${isLimitReached ? 'text-red-400' : 'text-slate-400'}`}>
                Generaciones IA
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {currentGenerations} <span className="text-lg text-slate-400 font-normal">/ {maxGenerations}</span>
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${isLimitReached ? 'bg-red-200 text-red-600' : 'bg-blue-50 text-blue-500'}`}>
              {isLimitReached ? <AlertCircle size={24} /> : <Zap size={24} />}
            </div>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isLimitReached ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          
          <p className={`text-xs mt-3 ${isLimitReached ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
            {isLimitReached ? "Has alcanzado el límite mensual." : "Se renuevan el 1 de cada mes"}
          </p>
        </div>

        {/* BIBLIOTECA */}
        <div 
          onClick={() => onNavigate('library')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Biblioteca</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.savedResources}</h3>
              <p className="text-sm text-slate-500 mt-1">Fichas guardadas</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><FileText size={24} /></div>
          </div>
          <div className="mt-4 text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Ver mi colección <ArrowRight size={16} />
          </div>
        </div>

        {/* PLAN */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg flex flex-col justify-between relative overflow-hidden text-white group">
          <Brain className="absolute -bottom-10 -right-10 w-48 h-48 text-slate-800 opacity-20 rotate-12" />
          
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tu Plan</p>
              <h3 className="text-2xl font-bold mt-1 flex items-center gap-2 capitalize">
                {isPremium ? "Premium" : "Gratuito"} 
                {isPremium && <Crown size={20} className="text-yellow-400 fill-yellow-400" />}
              </h3>
            </div>
            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700"><Sparkles size={20} className="text-yellow-400" /></div>
          </div>
          
          <div className="mt-6 space-y-3 z-10">
            {isPremium ? (
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="flex items-center gap-2"><Clock size={14}/> Renovación:</span>
                <span className="font-medium text-white">12 Mar 2026</span>
              </div>
            ) : (
              <p className="text-sm text-slate-300">Pásate a Premium para generaciones ilimitadas.</p>
            )}

            <div onClick={() => onNavigate('pricing')} className="w-full bg-slate-800 rounded-lg p-2 text-center text-xs text-yellow-400 font-bold border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
              {isPremium ? "Gestionar Suscripción" : "Mejorar Plan ⚡"}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><TrendingUp size={20} /></div>
          <h3 className="font-bold text-lg text-slate-800">Actividad Reciente</h3>
        </div>
        
        <div className="divide-y divide-slate-50">
          {loading ? <div className="p-8 text-center text-slate-400">Cargando...</div> : 
           stats.recentActivity.length === 0 ? (
             <div className="p-10 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3"><FileText className="text-slate-300" /></div>
               <p className="text-slate-500">Aún no has creado ninguna ficha.</p>
               <button onClick={() => onNavigate('generator')} className="text-blue-600 font-bold mt-2 hover:underline">¡Crea la primera!</button>
             </div>
          ) : (
            stats.recentActivity.map((resource) => (
              <div key={resource.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSubjectColor(resource.subject)}`}><FileText size={18} /></div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{resource.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      {resource.subject && <span className="uppercase font-bold">{resource.subject}</span>}
                      <span className="mx-1">•</span>
                      {new Date(resource.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   {resource.level && <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase">{resource.level}</span>}
                   <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};