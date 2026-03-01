import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FileText, Brain, Printer } from 'lucide-react';

interface SeoArticleProps {
  metaTitle: string;
  h1: string;
  subtitle: string;
  content: React.ReactNode;
}

export const SeoArticle: React.FC<SeoArticleProps> = ({ metaTitle, h1, subtitle, content }) => {
  const navigate = useNavigate();

  // Cambiamos el título de la pestaña para Google
  useEffect(() => {
    document.title = metaTitle;
  }, [metaTitle]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      
      {/* NAVBAR SIMPLE (Para no distraer del botón de registro) */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-[#4F75FF] p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Brain className="text-white w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">FichaLab</span>
        </div>
        <button 
          onClick={() => navigate('/registro')} 
          className="text-sm font-bold text-[#4F75FF] bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
        >
          Probar Gratis
        </button>
      </nav>

      {/* CABECERA DEL ARTÍCULO */}
      <header className="bg-white border-b border-slate-200 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
            <FileText size={16} />
            Recursos Docentes
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {h1}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </header>

      {/* CONTENIDO DEL ARTÍCULO */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <article className="prose prose-lg prose-blue max-w-none text-slate-700">
          {content}
        </article>
      </main>

      {/* EL "CABALLO DE TROYA" (Call To Action Gigante) */}
      <section className="bg-slate-900 py-20 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Deja de buscar PDFs por internet. <br/>
            <span className="text-[#4F75FF]">Créalos a medida en 10 segundos.</span>
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            FichaLab es la IA diseñada para profesores. Redacta exámenes, rúbricas LOMLOE y fichas adaptadas a tus alumnos al instante.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button 
              onClick={() => navigate('/registro')} 
              className="bg-[#4F75FF] hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-transform hover:-translate-y-1 shadow-xl shadow-blue-500/30"
            >
              Crear cuenta gratuita <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400"/> Sin tarjeta de crédito</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400"/> Justificación LOMLOE</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400"/> Adaptación a DUA</span>
          </div>
        </div>
      </section>

    </div>
  );
};