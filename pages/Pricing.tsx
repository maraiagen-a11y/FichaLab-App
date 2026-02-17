import React from 'react'; 
import { Check, Zap, Crown, Shield } from 'lucide-react';
import { User } from '../types';

interface PricingProps {
  user: User | null;
  onUpgrade: () => void;
}

// ⚠️ IMPORTANTE: PEGA AQUÍ TU ENLACE DE STRIPE REAL
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_fZu00jefRa8E9ldgrQ8g000"; 
export const Pricing: React.FC<PricingProps> = ({ user, onUpgrade }) => {

  const handleSubscribe = () => {
    if (!user) {
      onUpgrade(); 
    } else {
      window.location.href = STRIPE_PAYMENT_LINK;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Planes diseñados para profesores</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Empieza gratis y pásate al plan PRO por menos de lo que cuesta un desayuno.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* PLAN GRATUITO */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="text-left">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">Plan Gratuito</h3>
            <p className="text-slate-500 mt-2 text-sm">Para probar la herramienta.</p>
            <div className="my-6">
              <span className="text-4xl font-bold text-slate-900">0€</span><span className="text-slate-400">/mes</span>
            </div>
            <ul className="space-y-4 text-left mb-8">
              <li className="flex items-center gap-3 text-slate-600"><Check size={18} className="text-green-500" /> Acceso a <strong>5 recursos</strong></li>
              <li className="flex items-center gap-3 text-slate-600"><Check size={18} className="text-green-500" /> <strong>3 Fichas IA</strong> al mes</li>
              <li className="flex items-center gap-3 text-slate-600"><Check size={18} className="text-green-500" /> Historial limitado</li>
              <li className="flex items-center gap-3 text-slate-300"><Zap size={18} /> Descarga en PDF limpio</li>
            </ul>
            <button disabled className="w-full py-3 rounded-xl font-bold bg-slate-100 text-slate-400 border border-slate-200">Tu Plan Actual</button>
          </div>
        </div>

        {/* PLAN PREMIUM */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden transform md:scale-105">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">RECOMENDADO</div>
          <div className="text-left relative z-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">Plan Premium <Crown className="text-yellow-400 fill-yellow-400" size={20}/></h3>
            <p className="text-slate-400 mt-2 text-sm">Potencia total para el aula.</p>
            <div className="my-6">
              <span className="text-4xl font-bold text-white">4.99€</span><span className="text-slate-500">/mes</span>
            </div>
            <p className="text-blue-200 text-xs mb-6 font-medium">o solo 49€/año (¡2 meses gratis!)</p>
            <ul className="space-y-4 text-left text-slate-300 mb-8">
              <li className="flex items-center gap-3"><Check size={16} className="text-blue-400" /> Acceso <strong>ILIMITADO</strong> a recursos</li>
              <li className="flex items-center gap-3"><Check size={16} className="text-blue-400" /> Generaciones IA <strong>ILIMITADAS*</strong></li>
              <li className="flex items-center gap-3"><Check size={16} className="text-blue-400" /> <strong className="text-white">Descarga PDF Profesional</strong></li>
              <li className="flex items-center gap-3"><Check size={16} className="text-blue-400" /> Soporte técnico prioritario</li>
            </ul>
            {user?.plan === 'premium' ? (
              <button disabled className="w-full py-3 rounded-xl font-bold bg-green-500/20 text-green-400 border border-green-500/50 flex justify-center items-center gap-2"><Check size={20}/> Plan Activo</button>
            ) : (
              <button onClick={handleSubscribe} className="w-full py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50 transition-all flex justify-center items-center gap-2">Suscribirse Ahora</button>
            )}
            <p className="text-center text-xs text-slate-500 mt-4">*Uso responsable hasta 1000 gens/mes</p>
          </div>
        </div>
      </div>
      
       <div className="max-w-3xl mx-auto mt-16 text-center">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-center gap-2"><Shield className="text-slate-400"/> Garantía de satisfacción</h3>
        <p className="text-slate-500 text-sm">Cancela cuando quieras. Sin preguntas.</p>
      </div>
    </div>
  );
};