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

// --- ICONO DE GOOGLE ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login con Correo y Contraseña
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

  // Login con Google
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Asegura que al volver de Google, volvamos a la app
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError("Error al conectar con Google.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      
      {/* --- COLUMNA IZQUIERDA (MARKETING / VENTA) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4F75FF] text-white flex-col justify-between p-12 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
             <div className="bg-white p-2 rounded-xl shadow-md text-[#4F75FF]">
               <Brain className="w-6 h-6" />
             </div>
             FichaLab
          </div>
        </div>

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

        <div className="text-blue-200/60 text-sm font-medium z-10">
          © 2026 FichaLab. Hecho para profesores.
        </div>
      </div>

      {/* --- COLUMNA DERECHA (FORMULARIO) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        
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

          <div className="mt-8 space-y-6">
            
            {/* BOTÓN DE GOOGLE */}
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-slate-700 font-bold transition-all shadow-sm"
            >
              <GoogleIcon />
              Continuar con Google
            </button>

            {/* SEPARADOR VISUAL */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">O con tu correo</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
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
          </div>

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