import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from '../components/Button';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Clock,
  Brain
} from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
  onSwitchToRegister: () => void;
}

// --- LOGO INTERACTIVO (El Cerebro de FichaLab) ---
const BrainLogo = ({ className = "w-10 h-10" }) => (
  <div className={`relative group cursor-pointer ${className}`}>
    <div className="absolute -inset-1 bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
    <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-100 transform group-hover:scale-105 transition-transform">
      <Sparkles className="absolute top-1 right-1 w-2.5 h-2.5 text-[#4F75FF] animate-pulse z-10" />
      <Brain className="w-3/5 h-3/5 text-[#4F75FF] z-10 relative" />
    </div>
  </div>
);

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user && data.user.email) {
        onLogin(data.user.email);
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' 
        ? 'El correo o la contraseña son incorrectos.' 
        : 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      
      {/* --- COLUMNA IZQUIERDA (MARKETING / VENTA) --- */}
      {/* Nuevo estilo FichaLab: Fondo azul brillante en lugar de oscuro */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4F75FF] text-white flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Decoración de fondo (Rayos solares / Gradiente suave) */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"></div>

        {/* Logo / Marca */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
             <div className="bg-white p-2 rounded-xl shadow-md text-[#4F75FF]">
               <Brain className="w-6 h-6" />
             </div>
             FichaLab
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Crea recursos educativos en <span className="text-blue-200">segundos</span>.
          </h1>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            FichaLab genera fichas, exámenes y materiales didácticos personalizados con Inteligencia Artificial.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-blue-100">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-lg font-medium text-blue-50">Ahorra +10 horas de preparación.</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-blue-100">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-lg font-medium text-blue-50">Adaptado a Primaria, ESO y Bachillerato.</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-blue-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-lg font-medium text-blue-50">Generación de ideas ilimitada.</span>
            </div>
          </div>
        </div>

        {/* Footer Izquierdo */}
        <div className="text-blue-200/60 text-sm font-medium z-10">
          © 2026 FichaLab. Hecho para profesores.
        </div>
      </div>

      {/* --- COLUMNA DERECHA (FORMULARIO) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        
        {/* Logo FichaLab para versión móvil (solo se ve si se oculta el lado izquierdo) */}
        <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
            <BrainLogo className="w-8 h-8"/>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">FichaLab</span>
        </div>

        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">¡Hola de nuevo! 👋</h2>
            <p className="mt-2 text-slate-500 font-medium">
              Accede a tu cuenta para continuar creando.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF]/20 focus:border-[#4F75FF] transition-all text-slate-900 outline-none"
                    placeholder="profe@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF]/20 focus:border-[#4F75FF] transition-all text-slate-900 outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-red-800">{error}</h3>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                isLoading={loading}
                className="w-full flex justify-center items-center gap-2 py-4 text-base font-bold bg-[#4F75FF] hover:bg-[#3d5ee6] text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
              >
                {loading ? "Iniciando..." : <>Iniciar Sesión <ArrowRight className="w-5 h-5" /></>}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm font-medium text-slate-500">
              ¿Aún no tienes cuenta en FichaLab? <br className="sm:hidden" />
              <button 
                onClick={onSwitchToRegister}
                className="mt-2 sm:mt-0 font-bold text-[#4F75FF] hover:text-[#3d5ee6] transition-colors"
              >
                Crea una gratis aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};