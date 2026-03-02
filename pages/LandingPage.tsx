import React, { useState } from 'react';
import { Sparkles, Library, Edit3, Download, Check, X, ArrowRight, Play, FileText, Zap, Brain, MessageSquare, Printer, Target, CheckSquare, Languages, Copy, Rocket, Globe, Users, Clock, ShieldAlert, Calculator, Calendar } from 'lucide-react';

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
      
      {/* --- NAVBAR REDISEÑADO --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer">
              <BrainLogo className="w-10 h-10" />
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">FichaLab</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-slate-500 font-medium">
              <span className="hover:text-[#4F75FF] cursor-pointer transition-colors flex items-center gap-2 font-bold">
                <FileText size={18}/> Inicio
              </span>
              <span onClick={onStart} className="hover:text-[#4F75FF] cursor-pointer transition-colors flex items-center gap-2 font-bold">
                <Brain size={18}/> Generador IA
              </span>
              <span onClick={onExplore} className="hover:text-[#4F75FF] cursor-pointer transition-colors flex items-center gap-2 font-bold">
                <Globe size={18}/> Comunidad
              </span>
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

      {/* --- 1. HERO SECTION (SEO OPTIMIZADO) --- */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/80 via-[#F8FAFC] to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-semibold mb-8 animate-fade-in-up">
                <Users className="w-4 h-4 text-[#4F75FF]" />
                IA Educativa para Docentes Inconformistas
              </div>
              
              <h1 className="text-5xl lg:text-[5.5rem] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                SdA, Exámenes y Fichas <span className="text-[#4F75FF]">en</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F75FF] to-[#38bdf8]">
                  segundos
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
                El generador inteligente para profesores. Pega tu temario y la IA creará <strong>Situaciones de Aprendizaje (SdA), exámenes tipo test, rúbricas y material adaptado a DUA</strong> al instante, listo para imprimir.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onStart} className="px-8 py-4 bg-[#4F75FF] hover:bg-[#3d5ee6] text-white rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  Crear mi primera SdA
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={onExplore} className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-blue-200 rounded-full font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2 group">
                  <Globe className="w-5 h-5 text-blue-500 group-hover:animate-pulse" />
                  Explorar Comunidad
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -top-6 -right-6 bg-white px-5 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-20 flex items-center gap-2 font-bold text-sm text-slate-700 animate-bounce">
                <Target className="w-5 h-5 text-[#4F75FF]" /> Generando Saberes Básicos...
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-blue-900/5 border border-slate-100 relative z-10">
                <div className="flex items-start gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-2xl text-[#4F75FF]">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Situación de Aprendizaje</h3>
                    <p className="text-slate-500">Con tabla de justificación curricular</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded-full w-4/6"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-blue-100 bg-blue-50/30 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-extrabold text-[#4F75FF] mb-1">6</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sesiones</div>
                  </div>
                  <div className="border border-green-100 bg-green-50/30 rounded-2xl p-4 text-center">
                    <div className="text-3xl font-extrabold text-green-500 mb-1">100%</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adaptado a DUA</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white px-5 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-20 flex items-center gap-3 font-bold text-sm text-slate-700">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                Normativa LOMLOE
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- 2. EL MÉTODO EN 3 PASOS --- */}
      <div className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#4F75FF] font-bold tracking-wide uppercase text-sm mb-3">La herramienta definitiva</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              De tus apuntes a la clase en 3 pasos
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100 border-t-2 border-dashed border-slate-200 z-0"></div>
            
            <div className="relative z-10 bg-white p-6 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-blue-50 text-[#4F75FF] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">1. Pega tu Temario</h4>
              <p className="text-slate-500 text-sm">Elige la asignatura, el curso y dinos qué necesitas evaluar para que la IA se encargue de todo.</p>
            </div>

            <div className="relative z-10 bg-white p-6 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-blue-50 text-[#4F75FF] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                <Brain className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">2. Magia Curricular</h4>
              <p className="text-slate-500 text-sm">FichaLab redacta las actividades y genera automáticamente la tabla de Competencias y Criterios LOMLOE.</p>
            </div>

            <div className="relative z-10 bg-white p-6 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                <Printer className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">3. Descarga e Imprime</h4>
              <p className="text-slate-500 text-sm">Obtén tu Situación de Aprendizaje o examen en un PDF impecable para presentar a inspección.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. NUEVA SECCIÓN DE CASOS DE USO (SÚPER SEO) --- */}
      <div className="py-24 bg-blue-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#4F75FF] font-bold tracking-wide uppercase text-sm mb-3">Situaciones Reales en el Aula</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              ¿No tienes tiempo para preparar clases? <br/>
              FichaLab es tu salvavidas.
            </h3>
            <p className="text-lg text-slate-600">Descubre cómo resolver los problemas diarios del profesorado con un solo clic.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <ShieldAlert className="w-10 h-10 text-red-500 mb-6 bg-red-50 p-2 rounded-xl" />
              <h4 className="text-lg font-bold text-slate-900 mb-3">Urgencias y Sustituciones</h4>
              <p className="text-slate-600 text-sm mb-4">Si necesitas <strong>recursos para sustituciones de última hora</strong>, FichaLab te salva. Genera <strong>actividades para los últimos 10 minutos de clase</strong> o <strong>actividades para después de un examen</strong> en tiempo récord.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <Target className="w-10 h-10 text-emerald-500 mb-6 bg-emerald-50 p-2 rounded-xl" />
              <h4 className="text-lg font-bold text-slate-900 mb-3">Atención a la Diversidad</h4>
              <p className="text-slate-600 text-sm mb-4">Logra crear una <strong>tarea diferenciada sobre el mismo tema</strong> o <strong>ejercicios diferenciados por nivel</strong>. Obtén <strong>adaptaciones curriculares automáticas</strong> y <strong>recursos para alumnos con dificultades de lectura</strong>.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <Calculator className="w-10 h-10 text-purple-500 mb-6 bg-purple-50 p-2 rounded-xl" />
              <h4 className="text-lg font-bold text-slate-900 mb-3">Material Específico</h4>
              <p className="text-slate-600 text-sm mb-4">Descubre cómo hacer <strong>fichas para alumnos rápido</strong>. Úsalo como tu <strong>generador de ejercicios de matemáticas para primaria</strong> o para conseguir <strong>fichas de refuerzo de matemáticas</strong> listas para imprimir.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
              <Calendar className="w-10 h-10 text-blue-500 mb-6 bg-blue-50 p-2 rounded-xl" />
              <h4 className="text-lg font-bold text-slate-900 mb-3">Productividad y Tiempo Libre</h4>
              <p className="text-slate-600 text-sm mb-4">Aprende <strong>cómo preparar clases más rápido</strong> y consigue tu <strong>Situación de Aprendizaje automatizada</strong>. Consigue <strong>ejercicios para alumnos que terminan antes</strong> y reduce el tiempo de corrección.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. LA COMUNIDAD --- */}
      <div className="py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-blue-400 text-sm font-bold mb-6">
                <Globe className="w-4 h-4" /> La Galería Docente Pública
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Miles de recursos educativos a un clic.<br/> <span className="text-[#4F75FF]">Gratis.</span>
              </h3>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                ¿Para qué vas a pasar horas diseñando un examen o una SdA si otro profe ya lo ha creado en FichaLab? Accede a nuestro banco de recursos, busca tu tema, descarga el PDF y ahorra tiempo.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-200 font-medium"><div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-400"><Check size={18}/></div> Material revisado por profesores.</li>
                <li className="flex items-center gap-3 text-slate-200 font-medium"><div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-400"><Check size={18}/></div> Edita y adapta cualquier ficha a tus alumnos.</li>
                <li className="flex items-center gap-3 text-slate-200 font-medium"><div className="bg-blue-500/20 p-1.5 rounded-lg text-blue-400"><Check size={18}/></div> Comparte tus mejores creaciones.</li>
              </ul>
              <button onClick={onExplore} className="px-8 py-4 bg-[#4F75FF] hover:bg-[#3d5ee6] text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" /> Entrar al Banco de Recursos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- 5. PRECIOS CON TOGGLE ANUAL --- */}
      <div className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-[#4F75FF] font-bold tracking-wide uppercase text-sm mb-3">Planes Docentes</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Recupera tus fines de semana
            </h3>
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative">
              <span className="absolute -top-4 -right-4 bg-green-100 text-green-700 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm z-20 transform rotate-3">
                2 Meses Gratis
              </span>
              <div className="bg-slate-100 p-1.5 rounded-full inline-flex relative shadow-inner">
                <button onClick={() => setIsAnnual(false)} className={`relative z-10 w-32 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 ${!isAnnual ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Mensual</button>
                <button onClick={() => setIsAnnual(true)} className={`relative z-10 w-32 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 ${isAnnual ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Anual</button>
                <div className={`absolute top-1.5 bottom-1.5 w-32 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isAnnual ? 'translate-x-full' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* PLAN FREE */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col relative mt-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 mb-6"><FileText className="w-6 h-6" /></div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Free</h4>
              <p className="text-slate-500 mb-8">Perfecto para probar la inteligencia artificial</p>
              <div className="mb-8 h-[60px] flex items-center"><span className="text-5xl font-extrabold text-slate-900">Gratis</span></div>
              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> 3 generaciones al mes</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Acceso al Banco de Recursos</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Exportar en PDF listos para imprimir</div>
                <div className="flex items-center gap-3 text-slate-400 opacity-60"><X className="w-5 h-5" /> SdA y Exámenes ilimitados</div>
              </div>
              <button onClick={onStart} className="w-full py-4 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 transition-colors">Crear cuenta gratuita</button>
            </div>

            {/* PLAN PREMIUM */}
            <div className="bg-white border-2 border-[#4F75FF] rounded-[2.5rem] p-10 flex flex-col relative shadow-2xl shadow-blue-900/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4F75FF] text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-md"><Sparkles className="w-4 h-4" /> Recomendado</div>
              <div className="mb-6"><BrainLogo className="w-12 h-12" /></div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">Pro Docente</h4>
              <p className="text-slate-500 mb-8">Para profes que quieren olvidarse de la burocracia</p>
              <div className="mb-8 h-[60px] flex flex-col justify-center">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-slate-900">{isAnnual ? '4,15' : '4,99'}</span>
                  <span className="text-slate-500 font-medium text-lg">€/mes</span>
                </div>
                {isAnnual && <span className="text-sm text-slate-500 mt-1">Facturado anualmente (49,90€)</span>}
              </div>
              <div className="space-y-4 mb-10 flex-1">
                <div className="flex items-center gap-3 text-slate-600 font-medium"><Check className="w-5 h-5 text-[#4F75FF]" /> Generador de SdA, rúbricas y exámenes ilimitado</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Adaptación a DUA y justificación LOMLOE</div>
                <div className="flex items-center gap-3 text-slate-600"><Check className="w-5 h-5 text-[#4F75FF]" /> Exportar PDF con Solucionario automático</div>
              </div>
              <button onClick={onStart} className="w-full py-4 rounded-xl font-bold text-white bg-[#4F75FF] hover:bg-[#3d5ee6] shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                {isAnnual ? 'Desbloquear Año Pro' : 'Desbloquear Pro Mensual'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3"><BrainLogo className="w-8 h-8" /><span className="font-extrabold text-xl text-slate-900">FichaLab</span></div>
          <p className="text-slate-500 text-sm">© 2026 FichaLab España. Herramientas de Inteligencia Artificial para la Educación.</p>
        </div>
      </footer>
    </div>
  );
};