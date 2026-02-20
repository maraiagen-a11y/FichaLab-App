import React, { useEffect, useState } from 'react';
import { 
  Plus, Zap, FileText, Crown, ArrowRight, 
  Brain, Sparkles, Clock, TrendingUp, AlertCircle 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

// --- MASCOTA (Adaptada al nuevo diseño claro) ---
const BrainMascot = () => (
  <div className="relative group cursor-pointer">
    <div className="absolute -inset-2 bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] rounded-full blur-lg opacity-20 group-hover:opacity-40 transition duration-300"></div>
    <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 transform group-hover:scale-105 transition-transform">
      <Sparkles className="absolute top-2 right-2 w-4 h-4 text-[#4F75FF] animate-pulse z-10" />
      <Brain className="w-8 h-8 text-[#4F75FF] z-10 relative" />
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

  const isPremium = user?.plan === 'premium';
  const maxGenerations = isPremium ? 1000 : 3; 
  const currentGenerations = user?.generatedCount || 0;
  
  const usagePercentage = Math.min((currentGenerations / maxGenerations) * 100, 100);
  const isLimitReached = !isPremium && currentGenerations >= maxGenerations;

  useEffect(() => {
    if (user) loadDashboardData();
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

      setStats({ savedResources: savedCount || 0, recentActivity: recent || [] });
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (subject: string) => {
    const s = subject?.toLowerCase() || "";
    if (s.includes('mat')) return 'bg-blue-50 text-blue-500';
    if (s.includes('len')) return 'bg-red-50 text-red-500';
    if (s.includes('ing')) return 'bg-purple-50 text-purple-500';
    if (s.includes('cie')) return 'bg-green-50 text-green-500';
    return 'bg-slate-100 text-slate-500';
  };

  return (
    // Fondo exacto de la Landing Page
    <div className="p-4 pt-24 md:p-8 md:pt-28 max-w-7xl mx-auto space-y-8 font-sans pb-20 bg-[#F8FAFC] min-h-screen">
      
      {/* HEADER ESTILO LANDING PAGE */}
      <div className="bg-white rounded-[2rem] p-8 lg:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Degradado de fondo igual que la landing */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 z-10 text-center md:text-left">
          <BrainMascot />
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 flex items-center justify-center md:justify-start gap-2 tracking-tight">
              Hola, {user?.name || "Profe"} <span className="animate-bounce inline-block origin-bottom-right">👋</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg max-w-xl leading-relaxed">
              Dime qué necesitas enseñar hoy y <span className="text-[#4F75FF] font-bold">prepararé tus materiales</span> al instante.
            </p>
          </div>
        </div>

        <button 
          onClick={() => isLimitReached ? onNavigate('pricing') : onNavigate('generator')}
          className={`z-10 px-8 py-4 rounded-full font-bold transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center gap-2 ${
            isLimitReached 
              ? 'bg-slate-800 text-white shadow-slate-300' 
              : 'bg-[#4F75FF] hover:bg-[#3d5ee6] text-white shadow-blue-500/30'
          }`}
        >
          {isLimitReached ? <Crown size={20} /> : <Plus size={20} />}
          {isLimitReached ? "Mejorar Plan" : "Crear Nueva Ficha"}
        </button>
      </div>

      {/* GRID DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TARJETA 1 */}
        <div className={`p-8 rounded-[2rem] bg-white border shadow-xl shadow-slate-200/40 flex flex-col justify-between transition-all hover:-translate-y-1 ${
            isLimitReached ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-200'
          }`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isLimitReached ? 'text-red-400' : 'text-[#4F75FF]'}`}>
                Generaciones IA
              </p>
              <h3 className="text-4xl font-extrabold text-slate-900">
                {currentGenerations} <span className="text-xl text-slate-400 font-medium">/ {maxGenerations}</span>
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLimitReached ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#4F75FF]'}`}>
              {isLimitReached ? <AlertCircle size={24} /> : <Zap size={24} />}
            </div>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isLimitReached ? 'bg-red-500' : 'bg-[#4F75FF]'}`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          
          <p className={`text-sm font-medium ${isLimitReached ? 'text-red-500' : 'text-slate-500'}`}>
            {isLimitReached ? "Límite gratuito alcanzado" : "Se renuevan el día 1 de cada mes"}
          </p>
        </div>

        {/* TARJETA 2 */}
        <div 
          onClick={() => onNavigate('library')}
          className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-1 hover:border-blue-300 group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Biblioteca</p>
              <h3 className="text-4xl font-extrabold text-slate-900">{stats.savedResources}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Fichas guardadas</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-100 transition-colors">
              <FileText size={24} />
            </div>
          </div>
          <div className="mt-6 text-slate-900 font-bold flex items-center gap-2 group-hover:text-green-500 transition-colors">
            Ver mi colección <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform"/>
          </div>
        </div>

        {/* TARJETA 3 (Estilo Premium de la Landing) */}
        <div 
          onClick={() => onNavigate('pricing')}
          className="p-8 rounded-[2rem] bg-white border-2 border-[#4F75FF] shadow-xl shadow-blue-500/10 flex flex-col justify-between relative cursor-pointer group transition-all hover:-translate-y-1"
        >
          {isPremium && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F75FF] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
              <Crown size={12} /> Plan Activo
            </div>
          )}
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tu Plan</p>
              <h3 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                {isPremium ? "Premium" : "Free"} 
              </h3>
            </div>
            <div className="w-12 h-12 bg-[#4F75FF] rounded-2xl flex items-center justify-center text-white">
              <Sparkles size={24} />
            </div>
          </div>
          
          <div className="mt-6">
            {isPremium ? (
              <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-4">
                <span className="flex items-center gap-2"><Clock size={16}/> Renovación:</span>
                <span className="text-slate-900 font-bold">Activa</span>
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-500 mb-4">Generaciones ilimitadas y edición avanzada.</p>
            )}

            <div className="w-full py-3 rounded-xl font-bold text-center transition-colors bg-slate-50 text-slate-700 group-hover:bg-[#4F75FF] group-hover:text-white">
              {isPremium ? "Gestionar Suscripción" : "Comenzar ahora →"}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Actividad Reciente</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-400 animate-pulse font-medium">Cargando actividad...</div> 
          ) : stats.recentActivity.length === 0 ? (
             <div className="p-16 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <FileText className="text-slate-300" size={32} />
               </div>
               <p className="text-slate-500 font-medium text-lg">Aún no has creado ninguna ficha.</p>
               <button onClick={() => onNavigate('generator')} className="text-[#4F75FF] font-bold mt-2 hover:underline">
                 ¡Crea la primera ahora!
               </button>
             </div>
          ) : (
            stats.recentActivity.map((resource) => (
              <div key={resource.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer border-l-4 border-transparent hover:border-[#4F75FF]">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${getSubjectColor(resource.subject)}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 group-hover:text-[#4F75FF] transition-colors">
                      {resource.title || "Ficha sin título"}
                    </h4>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                      {resource.subject && <span className="bg-slate-100 px-2 py-0.5 rounded-md">{resource.subject}</span>}
                      <span>•</span>
                      {new Date(resource.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   {resource.level && (
                     <span className="hidden md:inline-block text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full uppercase tracking-wider">
                       {resource.level}
                     </span>
                   )}
                   <ArrowRight size={20} className="text-slate-300 group-hover:text-[#4F75FF] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};