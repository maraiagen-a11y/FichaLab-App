import React from 'react';
import { Sparkles, Zap, Brain, Shield, Library } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExplore }) => {
  return (
    // He cambiado 'brand' por 'blue' e 'indigo' estándar para asegurar que se vean los colores
    // Si tienes configurado 'brand' en tu tailwind.config, puedes cambiarlo de vuelta.
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans text-slate-900 overflow-x-hidden">
      
      {/* NAVBAR */}
      {/* px-4 en móvil, px-6 en escritorio (md) */}
      <nav className="flex items-center justify-between px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900">FichaLab</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onExplore}
            className="hidden md:block text-slate-600 hover:text-blue-600 font-medium transition-colors px-4 py-2"
          >
            Explorar Fichas
          </button>
          {/* Botón más compacto en móvil */}
          <button 
            onClick={onStart} 
            className="px-4 py-2 md:px-5 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm md:text-base transition-all shadow-lg shadow-blue-200"
          >
            Empezar Gratis
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      {/* Menos padding arriba (pt-12) en móvil, mucho en PC (md:pt-20) */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-12 pb-20 md:pt-20 md:pb-32 text-center">
        
        {/* Badge: Texto más pequeño en móvil */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-50 text-blue-700 text-xs md:text-sm font-semibold mb-6 md:mb-8 border border-blue-100">
          <Zap className="w-3 h-3 md:w-4 md:h-4 fill-current" />
          <span>Nueva IA Generativa v2.0</span>
        </div>
        
        {/* TÍTULO: Aquí estaba el problema principal. 
            text-4xl en móvil -> text-7xl en escritorio.
            Añadido break-words para evitar desbordes. */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 md:mb-8 leading-tight drop-shadow-sm">
          Crea fichas educativas <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block md:inline mt-2 md:mt-0">
            en segundos.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-2">
          FichaLab es la herramienta definitiva para profesores. Genera ejercicios, exámenes y material de estudio ilimitado con Inteligencia Artificial.
        </p>
        
        {/* BOTONES: En móvil columna (vertical), en PC fila. Ancho completo en móvil. */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-2">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Crear mi primera ficha
          </button>
          
          <button 
            onClick={onExplore}
            className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <Library className="w-5 h-5" />
            Ver Galería Pública
          </button>
        </div>

        {/* FEATURES GRID */}
        {/* mt-16 en móvil para separar menos, text-center en móvil para que quede centrado */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-32 text-center md:text-left">
          
          {/* Card 1 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 md:mb-6 mx-auto md:mx-0">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Instantáneo</h3>
            <p className="text-slate-500 leading-relaxed text-sm md:text-base">
              Olvídate de buscar en Google. Pide "Ejercicios de sumas para 2º de primaria" y tenlo listo para imprimir.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 md:mb-6 mx-auto md:mx-0">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">IA Pedagógica</h3>
            <p className="text-slate-500 leading-relaxed text-sm md:text-base">
              Nuestra IA entiende el currículo escolar. Adapta la dificultad y el tono según la edad de tus alumnos.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4 md:mb-6 mx-auto md:mx-0">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Tuyo para siempre</h3>
            <p className="text-slate-500 leading-relaxed text-sm md:text-base">
              Todo lo que generas es tuyo. Guárdalo en tu biblioteca privada o compártelo con la comunidad.
            </p>
          </div>
        </div>
      </main>
      
      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-8 md:py-12 text-center text-slate-400 text-xs md:text-sm px-4">
        <p>© 2024 FichaLab. Hecho con ❤️ para profesores.</p>
      </footer>
    </div>
  );
};