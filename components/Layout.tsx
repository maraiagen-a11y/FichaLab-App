import React, { useState } from 'react';
import { User } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Brain, // Usamos el cerebro como logo principal
  CreditCard, 
  Menu, 
  X, 
  LogOut,
  User as UserIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

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
    { id: 'resources', label: 'Biblioteca', icon: BookOpen }, // Texto más corto para que quede limpio
    { id: 'generator', label: 'Generador IA', icon: Brain },
    { id: 'pricing', label: 'Planes y Precios', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row print:bg-white font-sans">
      
      {/* === HEADER MÓVIL === */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center no-print sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          {/* Logo móvil con cerebro */}
          <Brain className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-lg text-slate-900">FichaLab</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600 p-1">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === SIDEBAR (Barra Lateral) === */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl
        md:relative md:translate-x-0 no-print flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          
          {/* LOGO DE ESCRITORIO (NUEVO DISEÑO CEREBRO) */}
          <div 
            className="hidden md:flex items-center gap-3 mb-10 px-2 cursor-pointer" 
            onClick={() => onNavigate('dashboard')}
          >
            <div className="relative">
              {/* Efecto de brillo detrás del cerebro */}
              <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-30"></div>
              <Brain className="relative w-8 h-8 text-blue-500" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Ficha<span className="text-blue-500">Lab</span>
            </span>
          </div>

          {/* TARJETA DE USUARIO */}
          <div className="mb-6 px-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-slate-700 p-2 rounded-full border border-slate-600 text-blue-400">
                <UserIcon size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate text-slate-100">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.plan} Plan</p>
              </div>
            </div>
          </div>

          {/* NAVEGACIÓN */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  currentPage === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className={currentPage === item.id ? 'text-white' : 'group-hover:text-blue-400 transition-colors'} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* BOTÓN CERRAR SESIÓN */}
          <button 
            onClick={onLogout}
            className="mt-auto flex items-center space-x-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50 relative w-full">
        {/* Padding responsivo para que no se pegue al borde */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden no-print backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};