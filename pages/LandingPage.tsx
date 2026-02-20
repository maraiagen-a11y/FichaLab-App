import React from 'react';
import { Sparkles, Library, Edit3, Download, Check, X, ArrowRight, Play, FileText, Zap, Brain } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onExplore: () => void;
}

// --- LOGO INTERACTIVO (El Cerebro) ---
const BrainLogo = ({ className = "w-10 h-10" }) => (
  <div className={`relative group cursor-pointer ${className}`}>
    <div className="absolute -inset-1 bg-gradient-to-r from-[#4F75FF] to-[#38bdf8] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
    <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center shadow-md border border-slate-100 transform group-hover:scale-105 transition-transform">
      <Sparkles className="absolute top-1 right-1 w-2.5 h-2.5 text-[#4F75FF] animate-pulse z-10" />
      <Brain className="w-3/5 h-3/5 text-[#4F75FF] z-10 relative" />
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExplore }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo FichaLab */}
            <div className="flex items-center gap-3 cursor-pointer">
              <BrainLogo className="w-10 h-10" />
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">FichaLab</span>
            </div>

            {/* Enlaces de Escritorio */}
            <div className="hidden md:flex items-center gap-8 text-slate-500 font-medium">
              <span className="hover:text-slate-900 cursor-pointer transition-colors flex items-center gap-2"><FileText size={18}/> Inicio</span>
              <span onClick={onStart} className="hover:text-slate-900 cursor-pointer transition-colors flex items-center gap-2"><Zap size={18}/> Generador IA</span>
              <span onClick={onExplore} className="hover:text-slate-900 cursor-pointer transition-colors flex items-center gap-2"><Library size={18}/> Biblioteca</span>
              <span onClick={onStart} className="hover:text-slate-900 cursor-pointer transition-colors flex items-center gap-2"><Sparkles size={18}/> Premium</span>
            </div>

            {/* Botones Derecha */}
            <div className="flex items-center gap-4">
              <button 
                onClick={onStart}
                className="hidden md:block text-slate-600 hover:text-slate-900 font-bold transition-colors"
              >
                Iniciar sesión
              </button>
              <button 
                onClick={onStart}
                className="bg-[#4F75FF] hover:bg-[#3d5ee6] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5"
              >
                Empezar gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-[#F8FAFC] to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Texto Izquierda */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-semibold mb-8">
                <BrainLogo className="w-5 h-5" />
                Potenciado por Inteligencia Artificial
              </div>
              
              <h1 className="text-5xl lg:text-[5.5rem] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Crea recursos <br /> educativos <span className="text-[#4F75FF]">en</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F75FF] to-[#38bdf8]">
                  segundos
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
                FichaLab genera fichas, exámenes, resúmenes y materiales didácticos personalizados con IA. Perfecto para estudiantes y profesores.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onStart}
                  className="px-8 py-4 bg-[#4F75FF] hover:bg-[#3d5ee6] text-white rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Empezar gratis
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={onExplore}
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Ver galería
                </button>
              </div>

              {/* Prueba Social */}
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['A','B','C','D'].map((letter, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  <span className="text-slate-900 font-bold">+2,500</span> educadores confían en FichaLab
                </p>
              </div>
            </div>

            {/* Imagen/Tarjeta Derecha */}
            <div className="relative hidden lg:block">
              <div className="absolute -top-6 -right-6 bg-white px-5 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-20 flex items-center gap-2 font-bold text-sm text-slate-700 animate-bounce">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> IA Generando...
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-blue-900/5 border border-slate-100 relative z-10">
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-2xl text-[#4F75FF]">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Ficha de Matemáticas</h3>
                    <p className="text-slate-500">Generada en 5 segundos</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded-full w-4/6"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-blue-100 bg-blue-50/30 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-extrabold text-[#4F75FF] mb-1">10</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ejercicios</div>
                  </div>
                  <div className="border border-green-100 bg-green-50/30 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-extrabold text-green-500 mb-1">3</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Páginas</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white px-5 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-20 flex items-center gap-3 font-bold text-sm text-slate-700">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                Listo para descargar
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- SECTION: CARACTERÍSTICAS --- */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#4F75FF] font-semibold tracking-wide uppercase text-sm mb-3">Características</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Todo lo que necesitas para crear recursos educativos
            </h3>
            <p className="text-lg text-slate-500">
              FichaLab te ofrece herramientas potentes y fáciles de usar para generar materiales didácticos de calidad profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              {/* CORRECCIÓN: Ahora tiene el cerebro con su color azul en lugar del logo viejo */}
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-[#4F75FF] mb-6">
                <Brain className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Generación con IA</h4>
              <p className="text-slate-500 leading-relaxed">Crea fichas, exámenes y resúmenes en segundos. Solo describe lo que necesitas y la IA lo genera por ti.</p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center text-green-500 mb-6">
                <Library className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Biblioteca Personal</h4>
              <p className="text-slate-500 leading-relaxed">Guarda todos tus recursos en un solo lugar. Organiza por asignaturas, temas o fecha de creación.</p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-500 mb-6">
                <Edit3 className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Edición Flexible</h4>
              <p className="text-slate-500 leading-relaxed">Personaliza cualquier ficha generada. Modifica contenido, formato y estilo según tus necesidades.</p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                <Download className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Exporta en PDF</h4>
              <p className="text-slate-500 leading-relaxed">Descarga tus recursos en formato PDF listo para imprimir o compartir con tus alumnos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION: PRECIOS --- */}
      <div className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[#4F75FF] font-semibold tracking-wide uppercase text-sm mb-3">Precios</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Un plan para cada necesidad
            </h3>
            <p className="text-lg text-slate-500">
              Empieza gratis y actualiza cuando lo necesites. Sin compromisos, cancela cuando quieras.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col relative mt-4">
              {/* CORRECCIÓN: El plan free ahora tiene un icono de archivo en vez del logo viejo */}
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Free</h4>
              <p className="text-slate-500 mb-8">Perfecto para probar FichaLab</p>
              
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-slate-900">Gratis</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> 3 generaciones al mes</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Biblioteca básica</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Exportar en PDF</div>
                <div className="flex items-center gap-3 text-slate-400 opacity-60"><X className="w-5 h-5" /> Generaciones ilimitadas</div>
                <div className="flex items-center gap-3 text-slate-400 opacity-60"><X className="w-5 h-5" /> Edición avanzada</div>
              </div>

              <button 
                onClick={onStart}
                className="w-full py-4 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 transition-colors"
              >
                Empezar gratis
              </button>
            </div>

            <div className="bg-white border-2 border-[#4F75FF] rounded-[2.5rem] p-10 flex flex-col relative shadow-2xl shadow-blue-900/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4F75FF] text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
                <Sparkles className="w-4 h-4" /> Más popular
              </div>

              <div className="mb-6">
                <BrainLogo className="w-12 h-12" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Premium</h4>
              <p className="text-slate-500 mb-8">Para educadores profesionales</p>
              
              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-slate-900">4.99</span>
                <span className="text-slate-500 font-medium text-lg">/mes</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-3 text-slate-600 font-medium"><Check className="w-5 h-5 text-[#4F75FF]" /> Generaciones ilimitadas</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Biblioteca completa</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Exportar en PDF</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Edición avanzada</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Plantillas exclusivas</div>
              </div>

              <button 
                onClick={onStart}
                className="w-full py-4 rounded-xl font-bold text-white bg-[#4F75FF] hover:bg-[#3d5ee6] shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Comenzar ahora
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <BrainLogo className="w-8 h-8" />
            <span className="font-extrabold text-xl text-slate-900">FichaLab</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 FichaLab. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};