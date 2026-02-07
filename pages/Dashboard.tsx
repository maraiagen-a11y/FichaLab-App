import React from 'react';
import { User, UserPlan } from '../types';
import { Button } from '../components/Button';
import { PLAN_LIMITS } from '../constants';
import { Sparkles, Download, Star, ArrowRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const limits = PLAN_LIMITS[user.plan];
  const usagePercentage = Math.min(100, (user.generatedCount / limits.maxGenerations) * 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Hola, {user.name} 👋</h1>
          <p className="text-slate-500 mt-1">Bienvenido a tu panel educativo.</p>
        </div>
        <Button onClick={() => onNavigate('generator')}>
          <Sparkles className="w-4 h-4 mr-2" />
          Crear Nueva Ficha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Usage Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Fichas Generadas</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {user.generatedCount} <span className="text-sm text-slate-400 font-normal">/ {user.plan === UserPlan.FREE ? limits.maxGenerations : '∞'}</span>
              </h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-brand-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${user.plan === UserPlan.PREMIUM ? 100 : usagePercentage}%` }} 
            />
          </div>
          {user.plan === UserPlan.FREE && (
             <p className="text-xs text-slate-500 mt-3">
               Actualiza a Premium para generación ilimitada.
             </p>
          )}
        </div>

        {/* Downloads Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Recursos Descargados</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">12</h3>
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Download size={20} />
            </div>
          </div>
          <p className="text-sm text-slate-600">Has accedido a recursos de Matemáticas y Lengua esta semana.</p>
        </div>

         {/* Plan Status */}
         <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-sm">
           <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-300">Plan Actual</p>
              <h3 className="text-2xl font-bold mt-1 capitalize">{user.plan}</h3>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <Star size={20} />
            </div>
          </div>
          {user.plan === UserPlan.FREE ? (
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full mt-2 bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-500"
              onClick={() => onNavigate('pricing')}
            >
              Mejorar Plan
            </Button>
          ) : (
             <p className="text-sm text-slate-300">Gracias por apoyar nuestra plataforma educativa.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Actividad Reciente</h2>
          <button 
            onClick={() => onNavigate('resources')}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"
          >
            Ver Biblioteca <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Download size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Recurso de Matemáticas descargado</p>
                  <p className="text-xs text-slate-500">Hace {i * 2} horas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
