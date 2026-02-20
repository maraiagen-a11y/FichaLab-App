import React, { useState } from 'react';
import { User } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, 
  CreditCard, 
  Menu, 
  X, 
  LogOut,
  User as UserIcon,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

// --- LOGO INTERACTIVO (Igual que en la Landing Page) ---
const BrainLogo = () => (
  <div className="relative group cursor-pointer">
    <div className="absolute -inset-1 bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
    <div className="relative w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-100 transform group-hover:scale-105 transition-transform">
      <Sparkles className="absolute top-0.5 right-0.5 w-2 h-2 text-[#4F75FF] animate-pulse z-10" />
      <Brain className="w-5 h-5 text-[#4F75FF] z-10 relative" />
    </div>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  currentPage, 
  onNavigate 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Definición del menú
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resources', label: 'Biblioteca', icon: BookOpen },
    { id: 'generator', label: 'Generador IA', icon: Brain },
    { id: 'pricing', label: 'Planes y Precios', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row print:bg-white font-sans overflow-hidden">
      
      {/* === HEADER MÓVIL === */}
      <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center no-print sticky top-0 z-50">
        <div className="flex items-center space-x-3" onClick={() => onNavigate('dashboard')}>
          <BrainLogo />
          <span className="font-extrabold text-xl tracking-tight text-slate-900">FichaLab</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === SIDEBAR (Barra Lateral Blanca) === */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        md:relative md:translate-x-0 no-print flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          
          {/* LOGO DE ESCRITORIO */}
          <div 
            className="hidden md:flex items-center gap-3 mb-10 px-2 cursor-pointer" 
            onClick={() => onNavigate('dashboard')}
          >
            <BrainLogo />
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">FichaLab</span>
          </div>

          {/* TARJETA DE USUARIO */}
          <div className="mb-8 px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[#4F75FF] shadow-sm">
                <UserIcon size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-slate-900">{user.name || "Usuario"}</p>
                <p className="text-xs font-medium text-slate-500 capitalize flex items-center gap-1">
                  {user.plan === 'premium' ? <Sparkles size={10} className="text-[#4F75FF]"/> : null}
                  {user.plan} Plan
                </p>
              </div>
            </div>
          </div>

          {/* NAVEGACIÓN */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group font-bold ${
                    isActive 
                      ? 'bg-blue-50 text-[#4F75FF]' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-[#4F75FF]' : 'text-slate-400 group-hover:text-[#4F75FF] transition-colors'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* BOTÓN CERRAR SESIÓN */}
          <button 
            onClick={onLogout}
            className="mt-auto flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-bold group"
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      {/* Ya no limitamos el ancho aquí, dejamos que cada página (Dashboard, Generador, etc) gestione su propio padding y ancho para no romper los diseños */}
      <main className="flex-1 overflow-y-auto h-screen bg-[#F8FAFC] relative w-full flex flex-col">
        {children}
      </main>

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-40 md:hidden no-print backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};