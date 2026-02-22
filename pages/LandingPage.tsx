import React, { useState } from 'react';
import { Sparkles, Library, Edit3, Download, Check, X, ArrowRight, Play, FileText, Zap, Brain, MessageSquare, Printer, Target, CheckSquare, Languages, Copy, Rocket } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onExplore: () => void;
}

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

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExplore }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer">
              <BrainLogo className="w-10 h-10" />
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">FichaLab</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-slate-500 font-medium">
              <span className="hover:text-slate-900 cursor-pointer transition-colors flex items-center gap-2"><FileText size={18}/> Inicio</span>
              <span onClick={onExplore} className="hover:text-slate-900 cursor-pointer transition-colors flex items-center gap-2"><Library size={18}/> Ejemplos</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onStart} className="hidden md:block text-slate-600 hover:text-slate-900 font-bold transition-colors">
                Iniciar sesión
              </button>
              <button onClick={onStart} className="bg-[#4F75FF] hover:bg-[#3d5ee6] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5">
                Empezar gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- 1. HERO SECTION --- */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/80 via-[#F8FAFC] to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-semibold mb-8 animate-fade-in-up">
                <BrainLogo className="w-5 h-5" />
                La IA diseñada para profesores
              </div>
              
              <h1 className="text-5xl lg:text-[5.5rem] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Crea recursos <br /> educativos <span className="text-[#4F75FF]">en</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F75FF] to-[#38bdf8]">
                  segundos
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
                Dile a la IA qué necesitas repasar. Genera el contenido, adáptalo al nivel de tus alumnos y descárgalo en PDF listo para imprimir junto con su solucionario.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onStart} className="px-8 py-4 bg-[#4F75FF] hover:bg-[#3d5ee6] text-white rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  Empezar gratis
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={onExplore} className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Ver galería
                </button>
              </div>
            </div>

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

      {/* --- 2. EL MÉTODO EN 3 PASOS --- */}
      <div className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#4F75FF] font-bold tracking-wide uppercase text-sm mb-3">Tu flujo de trabajo</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              De tu cabeza a la impresora en 3 pasos
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100 border-t-2 border-dashed border-slate-200 z-0"></div>
            
            <div className="relative z-10 bg-white p-6 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-blue-50 text-[#4F75FF] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">1. Pide por esa boquita</h4>
              <p className="text-slate-500 text-sm">Elige el curso, el tema y siéntete libre de pedir locuras: "Que los ejercicios hablen de videojuegos".</p>
            </div>

            <div className="relative z-10 bg-white p-6 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-blue-50 text-[#4F75FF] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <Brain className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">2. Magia de la IA</h4>
              <p className="text-slate-500 text-sm">FichaLab redacta los ejercicios y maqueta el documento entero de forma impecable en menos de 5 segundos.</p>
            </div>

            <div className="relative z-10 bg-white p-6 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                <Printer className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">3. Descarga e Imprime</h4>
              <p className="text-slate-500 text-sm">Obtén un PDF perfecto para repartir en clase (¡y otro documento secreto con las soluciones!).</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. SUPERPODERES --- */}
      <div className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#4F75FF] font-semibold tracking-wide uppercase text-sm mb-3">Diseñado para el aula</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Tus nuevos superpoderes docentes
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-[#4F75FF] mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">El Camaleón de Niveles</h4>
              <p className="text-slate-500 leading-relaxed">¿Alumnos con distintos ritmos? Genera una ficha estándar y, con un clic, extrae una versión más sencilla para refuerzo o más compleja para ampliación.</p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                <CheckSquare className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">El Fin de las Correcciones</h4>
              <p className="text-slate-500 leading-relaxed">Se acabó llevarse trabajo a casa. FichaLab no solo genera los ejercicios para tus alumnos, sino que te entrega un documento privado con el solucionario exacto.</p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                <Languages className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Magia Bilingüe</h4>
              <p className="text-slate-500 leading-relaxed">Ideal para centros bilingües. Pide el contenido en español para estructurarlo fácil y dile a la IA que genere el PDF final en inglés (o francés) adaptado al nivel.</p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all">
              <div className="bg-purple-50 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
                <Copy className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Variantes Anti-Copia</h4>
              <p className="text-slate-500 leading-relaxed">Genera un examen perfecto. Luego presiona un botón y obtén un "Modelo B" con preguntas equivalentes pero con distintos datos para evitar que los alumnos se copien.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. PRECIOS CON TOGGLE ANUAL CORREGIDO --- */}
      <div className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-[#4F75FF] font-bold tracking-wide uppercase text-sm mb-3">Planes Simples</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Recupera tu tiempo libre
            </h3>
          </div>

          {/* TOGGLE MENSUAL / ANUAL CORREGIDO */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Etiqueta flotante estilo "Sticker" */}
              <span className="absolute -top-4 -right-4 bg-green-100 text-green-700 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm z-20 transform rotate-3">
                2 Meses Gratis
              </span>

              <div className="bg-slate-100 p-1.5 rounded-full inline-flex relative shadow-inner">
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
                  className={`absolute top-1.5 bottom-1.5 w-32 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isAnnual ? 'translate-x-full' : 'translate-x-0'}`}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* PLAN FREE */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col relative mt-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Free</h4>
              <p className="text-slate-500 mb-8">Perfecto para probar la magia</p>
              
              <div className="mb-8 h-[60px] flex items-center">
                <span className="text-5xl font-extrabold text-slate-900">Gratis</span>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> 3 generaciones al mes</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Exportar en PDF listos para imprimir</div>
                <div className="flex items-center gap-3 text-slate-400 opacity-60"><X className="w-5 h-5" /> Fichas ilimitadas y solucionarios</div>
              </div>

              <button onClick={onStart} className="w-full py-4 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 transition-colors">
                Crear cuenta gratuita
              </button>
            </div>

            {/* PLAN PREMIUM */}
            <div className="bg-white border-2 border-[#4F75FF] rounded-[2.5rem] p-10 flex flex-col relative shadow-2xl shadow-blue-900/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4F75FF] text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
                <Sparkles className="w-4 h-4" /> Recomendado
              </div>
              <div className="mb-6"><BrainLogo className="w-12 h-12" /></div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Premium</h4>
              <p className="text-slate-500 mb-8">Para profes que valoran su tiempo</p>
              
              {/* Precio Dinámico */}
              <div className="mb-8 h-[60px] flex flex-col justify-center">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-slate-900">{isAnnual ? '4,15' : '4,99'}</span>
                  <span className="text-slate-500 font-medium text-lg">€/mes</span>
                </div>
                {isAnnual && (
                  <span className="text-sm text-slate-500 mt-1">Facturado anualmente (49,90€)</span>
                )}
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-3 text-slate-600 font-medium"><Check className="w-5 h-5 text-[#4F75FF]" /> Generaciones ilimitadas</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Todo tipo de asignaturas y niveles</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Exportar PDF con Solucionario</div>
              </div>

              <button onClick={onStart} className="w-full py-4 rounded-xl font-bold text-white bg-[#4F75FF] hover:bg-[#3d5ee6] shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                {isAnnual ? 'Desbloquear Año Premium' : 'Desbloquear Ilimitado'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- 5. BOTTOM CTA --- */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <Rocket className="w-16 h-16 text-[#4F75FF] mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Únete a la nueva era de educadores.
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                No vuelvas a regalar tus fines de semana buscando recursos en internet o maquetando documentos desde cero.
              </p>
              <button onClick={onStart} className="px-10 py-5 bg-[#4F75FF] hover:bg-[#3d5ee6] text-white rounded-full font-bold text-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                Empezar gratis ahora
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