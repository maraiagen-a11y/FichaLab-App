import React, { useState } from 'react'; 
import { Check, Zap, Crown, Shield, Sparkles, Brain, X, FileText } from 'lucide-react';
import { User } from '../types';

interface PricingProps {
  user: User | null;
  onUpgrade: () => void;
}

// ⚠️ IMPORTANTE: TUS ENLACES DE STRIPE
const STRIPE_PAYMENT_LINK_MONTHLY = "https://buy.stripe.com/dRm4gA0d2gVsfRv3E9frW00"; 
const STRIPE_PAYMENT_LINK_ANNUAL = "https://buy.stripe.com/aFacN69NC48G6gV0rXfrW01"; // TODO: Pon aquí tu enlace anual cuando lo crees en Stripe

// --- LOGO INTERACTIVO (BrainLogo) ---
const BrainLogo = () => (
  <div className="relative group cursor-pointer inline-block">
    <div className="absolute -inset-1 bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
    <div className="relative w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-100 transform group-hover:scale-105 transition-transform">
      <Sparkles className="absolute top-0.5 right-0.5 w-2 h-2 text-[#4F75FF] animate-pulse z-10" />
      <Brain className="w-5 h-5 text-[#4F75FF] z-10 relative" />
    </div>
  </div>
);

export const Pricing: React.FC<PricingProps> = ({ user, onUpgrade }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleSubscribe = () => {
    if (!user) {
      onUpgrade(); 
    } else {
      window.location.href = isAnnual ? STRIPE_PAYMENT_LINK_ANNUAL : STRIPE_PAYMENT_LINK_MONTHLY;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER DEL PRICING */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <BrainLogo />
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">FichaLab</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Mejora tu plan, recupera tu tiempo
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Actualmente estás en el plan <strong className="uppercase text-[#4F75FF]">{user?.plan || 'free'}</strong>.
        </p>
      </div>

      {/* TOGGLE MENSUAL / ANUAL CORREGIDO */}
      <div className="flex justify-center mb-12">
        <div className="relative">
          {/* Etiqueta flotante estilo "Sticker" */}
          <span className="absolute -top-4 -right-4 bg-green-100 text-green-700 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm z-20 transform rotate-3">
            2 Meses Gratis
          </span>

          <div className="bg-white border border-slate-200 p-1.5 rounded-full inline-flex relative shadow-sm">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`relative z-10 w-32 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 ${!isAnnual ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Mensual
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`relative z-10 w-32 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 ${isAnnual ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Anual
            </button>
            
            {/* Fondo animado del toggle (Tamaño exacto) */}
            <div 
              className={`absolute top-1.5 bottom-1.5 w-32 bg-slate-100 rounded-full transition-transform duration-300 ease-in-out ${isAnnual ? 'translate-x-full' : 'translate-x-0'}`}
            ></div>
          </div>
        </div>
      </div>

      {/* GRID DE PRECIOS */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        
        {/* PLAN GRATUITO */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col relative mt-4 opacity-70 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 mb-6">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            Plan Gratuito {user?.plan === 'free' && <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">Actual</span>}
          </h3>
          <p className="text-slate-500 mb-8">Perfecto para probar FichaLab.</p>
          
          <div className="mb-8 h-[60px] flex items-center">
            <span className="text-5xl font-extrabold text-slate-900">0€</span><span className="text-slate-400 text-xl">/mes</span>
          </div>

          <div className="space-y-4 mb-10 flex-1">
            <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> 3 generaciones al mes</div>
            <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Biblioteca básica</div>
            <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Exportar en PDF</div>
            <div className="flex items-center gap-3 text-slate-400 opacity-60"><X className="w-5 h-5" /> Generaciones ilimitadas</div>
            <div className="flex items-center gap-3 text-slate-400 opacity-60"><X className="w-5 h-5" /> Edición avanzada</div>
          </div>

          {user?.plan === 'free' ? (
             <button disabled className="w-full py-4 rounded-xl font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">Tu Plan Actual</button>
          ) : user?.plan === 'premium' ? (
             <button disabled className="w-full py-4 rounded-xl font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">Ya eres Premium</button>
          ) : (
             <button onClick={onUpgrade} className="w-full py-4 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 transition-colors">Empezar gratis</button>
          )}
        </div>

        {/* PLAN PREMIUM */}
        <div className="bg-white border-2 border-[#4F75FF] rounded-[2.5rem] p-10 flex flex-col relative shadow-2xl shadow-blue-900/10 transform md:-translate-y-4 z-10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4F75FF] text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
            <Crown className="w-4 h-4 fill-current" /> Recomendado
          </div>

          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#4F75FF] mb-6">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            Plan Premium {user?.plan === 'premium' && <span className="bg-[#4F75FF]/10 text-[#4F75FF] text-xs px-2 py-1 rounded-full">Actual</span>}
          </h3>
          <p className="text-slate-500 mb-8">Potencia total para tu aula.</p>
          
          {/* Precio Dinámico */}
          <div className="mb-8 h-[60px] flex flex-col justify-center">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-slate-900">{isAnnual ? '4,15€' : '4,99€'}</span>
              <span className="text-slate-500 font-medium text-xl">/mes</span>
            </div>
            {isAnnual && (
              <span className="text-sm text-[#4F75FF] font-medium mt-1">Facturado anualmente (49,90€)</span>
            )}
          </div>

          <div className="space-y-4 mb-10 flex-1 font-medium">
            <div className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#4F75FF]" /> Generaciones IA <strong>ILIMITADAS*</strong></div>
            <div className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#4F75FF]" /> Biblioteca completa</div>
            <div className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#4F75FF]" /> Exportar PDF con Solucionario</div>
            <div className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#4F75FF]" /> Edición avanzada</div>
            <div className="flex items-center gap-3 text-slate-700"><Check className="w-5 h-5 text-[#4F75FF]" /> Soporte prioritario</div>
          </div>

          {user?.plan === 'premium' ? (
            <button disabled className="w-full py-4 rounded-xl font-bold bg-green-100 text-green-600 border border-green-200 flex justify-center items-center gap-2 cursor-not-allowed transition-all">
              <Check size={20}/> Plan Activo
            </button>
          ) : (
            <button 
              onClick={handleSubscribe} 
              className="w-full py-4 rounded-xl font-bold text-white bg-[#4F75FF] hover:bg-[#3d5ee6] shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
            >
              <Zap size={20} className="fill-current"/> 
              {isAnnual ? 'Suscribirse Anualmente' : 'Suscribirse Mensualmente'}
            </button>
          )}
          <p className="text-center text-xs text-slate-500 mt-4">*Uso responsable hasta 1000 gens/mes</p>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto mt-16 text-center pb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-center gap-2"><Shield className="text-slate-400" size={20}/> Garantía de satisfacción</h3>
        <p className="text-slate-500 text-sm">Cancela tu suscripción en cualquier momento desde tu perfil. Sin preguntas.</p>
      </div>
    </div>
  );
};