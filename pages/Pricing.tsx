import React from 'react';
import { User, UserPlan } from '../types';
import { Check, X as XIcon } from 'lucide-react';
import { Button } from '../components/Button';

interface PricingProps {
  user: User;
  onUpgrade: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ user, onUpgrade }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Planes diseñados para profesores</h1>
        <p className="text-lg text-slate-600">Empieza gratis y actualiza cuando necesites más potencia.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Plan Gratuito</h3>
            <p className="text-slate-500 mt-2">Para profesores que están empezando.</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900">0€</span>
              <span className="ml-1 text-slate-500">/mes</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-slate-600">Acceso a 50 recursos mensuales</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-slate-600">5 Generaciones de Fichas IA / mes</span>
            </li>
             <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-slate-600">Historial (últimas 10 fichas)</span>
            </li>
             <li className="flex items-start">
              <XIcon className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />
              <span className="text-slate-400">Sin anuncios</span>
            </li>
             <li className="flex items-start">
              <XIcon className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />
              <span className="text-slate-400">Soporte prioritario</span>
            </li>
          </ul>

          <Button 
            variant="outline" 
            className="w-full"
            disabled={user.plan === UserPlan.FREE}
          >
            {user.plan === UserPlan.FREE ? 'Plan Actual' : 'Downgrade'}
          </Button>
        </div>

        {/* Premium Plan */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-8 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMENDADO
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold">Plan Premium</h3>
            <p className="text-slate-300 mt-2">Para el "Power Teacher".</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold">9.99€</span>
              <span className="ml-1 text-slate-400">/mes</span>
            </div>
            <p className="text-xs text-brand-300 mt-1">o 89.99€/año (Ahorra 25%)</p>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
             <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-400 mr-3 flex-shrink-0" />
              <span className="text-slate-200">Acceso ILIMITADO a recursos</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-400 mr-3 flex-shrink-0" />
              <span className="text-slate-200">Generaciones de Fichas IA ILIMITADAS</span>
            </li>
             <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-400 mr-3 flex-shrink-0" />
              <span className="text-slate-200">Historial completo</span>
            </li>
             <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-400 mr-3 flex-shrink-0" />
              <span className="text-slate-200">Sin publicidad</span>
            </li>
             <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-400 mr-3 flex-shrink-0" />
              <span className="text-slate-200">Sube tus propios recursos</span>
            </li>
          </ul>

          <Button 
            variant="primary" 
            className="w-full bg-brand-500 hover:bg-brand-400 border-none text-white"
            onClick={onUpgrade}
            disabled={user.plan === UserPlan.PREMIUM}
          >
            {user.plan === UserPlan.PREMIUM ? 'Plan Actual' : 'Suscribirse Ahora'}
          </Button>
        </div>
      </div>
    </div>
  );
};
