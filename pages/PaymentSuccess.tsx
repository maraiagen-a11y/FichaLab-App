import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Asegúrate que la ruta es correcta
import { CheckCircle, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { User } from '../types';

interface PaymentSuccessProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ user, onNavigate }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const activatePremium = async () => {
      // 1. Si no hay usuario o es "invitado", no podemos guardar
      if (!user) return;
      
      if (user.id === 'guest') {
        setStatus('error');
        setErrorMessage("Estás en modo invitado. Inicia sesión para activar tu plan.");
        return;
      }

      try {
        console.log("💎 Intentando activar Premium para ID:", user.id);

        // 2. INTENTO DE ACTUALIZACIÓN
        const { error, data } = await supabase
          .from('profiles')
          .update({ plan: 'premium' })
          .eq('id', user.id)
          .select(); // El select nos ayuda a ver si realmente devolvió algo

        if (error) throw error;

        // Si no dio error pero no devolvió datos, es culpa de las Policies (RLS)
        if (!data || data.length === 0) {
          throw new Error("La base de datos bloqueó la actualización (Revisa RLS en Supabase).");
        }

        console.log("✅ Plan actualizado con éxito:", data);
        setStatus('success');

      } catch (err: any) {
        console.error("❌ Error crítico:", err);
        setStatus('error');
        setErrorMessage(err.message || "Error desconocido al actualizar.");
      }
    };

    activatePremium();
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-100 animate-in fade-in zoom-in duration-500">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h2 className="text-xl font-bold text-slate-800">Confirmando pago...</h2>
            <p className="text-slate-500 mt-2">No cierres esta ventana.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Hubo un problema</h2>
            <p className="text-red-500 mt-2 mb-6 text-sm bg-red-50 p-2 rounded border border-red-100">
              {errorMessage}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-slate-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-green-200 shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">¡Todo listo!</h1>
            <p className="text-slate-600 mb-8 text-lg">
              Tu cuenta <strong>Premium</strong> ya está activa. <br/>
              ¡A crear fichas sin límites! 🚀
            </p>
            
            <button 
              onClick={() => { window.location.href = "/"; }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 transform hover:scale-[1.02]"
            >
              Ir al Dashboard <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};