import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from '../components/Button';
import { 
  Lock, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Clock,
  Brain,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- LOGO INTERACTIVO ---
const BrainLogo = ({ className = "w-10 h-10" }) => (
  <div className={`relative group cursor-pointer ${className}`}>
    <div className="absolute -inset-1 bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
    <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-100 transform group-hover:scale-105 transition-transform">
      <Sparkles className="absolute top-1 right-1 w-2.5 h-2.5 text-[#4F75FF] animate-pulse z-10" />
      <Brain className="w-3/5 h-3/5 text-[#4F75FF] z-10 relative" />
    </div>
  </div>
);

export const UpdatePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 1. ESCUCHAMOS LA SESIÓN PARA EVITAR EL ERROR "MISSING"
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log("Token de recuperación detectado y validado.");
      }
    });

    // Validamos si el usuario ha entrado con un link válido
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!window.location.hash && !window.location.search && !data.session) {
        setError("El enlace ha caducado o ya se ha usado. Por favor, vuelve a solicitar otro correo.");
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        if (error.message.includes("session missing")) {
           throw new Error("El enlace de recuperación ha caducado. Vuelve al Login y solicita otro correo.");
        }
        throw error;
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3500); 
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      
      {/* --- COLUMNA IZQUIERDA (DISEÑO FICHALAB) --- */}
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
            Recupera tu <span className="text-blue-200">acceso</span>.
          </h1>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Un pequeño tropiezo lo tiene cualquiera. Elige una nueva contraseña y vuelve a crear magia en el aula.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-blue-100"><Clock className="w-6 h-6" /></div>
              <span className="text-lg font-medium text-blue-50">Tus recursos siguen intactos.</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-blue-100"><BookOpen className="w-6 h-6" /></div>
              <span className="text-lg font-medium text-blue-50">Tus alumnos te están esperando.</span>
            </div>
          </div>
        </div>

        <div className="text-blue-200/60 text-sm font-medium z-10">
          © 2026 FichaLab. Seguridad garantizada.
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
            <h2 className="text-3xl font-extrabold text-slate-900">Nueva contraseña 🔐</h2>
            <p className="mt-2 text-slate-500 font-medium">
              Escribe una contraseña segura que puedas recordar.
            </p>
          </div>

          <div className="mt-8">
            
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-red-800">{error}</p>
              </div>
            )}

            {success ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">¡Todo listo!</h3>
                <p className="text-sm text-slate-600 font-medium mb-6">Contraseña actualizada. Te estamos redirigiendo...</p>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-bold text-slate-700 mb-2">
                    Tu nueva contraseña
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      required
                      minLength={6}
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4F75FF]/20 focus:border-[#4F75FF] transition-all text-slate-900 outline-none"
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!newPassword || error !== null}
                  className="w-full flex justify-center items-center gap-2 py-4 text-base font-bold bg-[#4F75FF] hover:bg-[#3d5ee6] text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                >
                  {isLoading ? "Guardando..." : <>Guardar contraseña <ArrowRight className="w-5 h-5" /></>}
                </Button>
              </form>
            )}
          </div>
          
          {!success && (
            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-500 hover:text-[#4F75FF] transition-colors">
                Cancelar y volver al Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};