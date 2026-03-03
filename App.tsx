import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { supabase } from './services/supabaseClient'; 
import { User, UserPlan } from './types';

// --- IMPORTS DE PÁGINAS Y COMPONENTES ---
import { SeoArticle } from './pages/SeoArticle';
import Register from './pages/Register';
import { UpdatePassword } from './pages/UpdatePassword';
import { Layout } from './components/Layout';
import { Analytics } from '@vercel/analytics/react';
import { ExamGenerator } from './pages/ExamGenerator'; 
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage'; 
import { ResourceLibrary } from './pages/ResourceLibrary';
import { WorksheetGenerator } from './pages/WorksheetGenerator';
import { Pricing } from './pages/Pricing';
import { PaymentSuccess } from './pages/PaymentSuccess'; 
import { OnboardingWizard } from './components/OnboardingWizard'; 
import { Gallery } from './pages/Gallery'; 
import { RubricGenerator } from './pages/RubricGenerator'; 
import { SdaGenerator } from './pages/SdaGenerator';

const GUEST_USER: User = {
  id: 'guest',
  name: 'Profe Invitado',
  email: 'invitado@fichalab.com',
  role: 'profesor',
  plan: UserPlan.FREE,
  generatedCount: 0,
  onboardingCompleted: true 
};

// 👇 EL ARREGLO DEFINITIVO: Sacamos RequireAuth FUERA para que React no destruya la pantalla 👇
const RequireAuth = ({ 
  isAuthenticated, 
  user, 
  onComplete, 
  children 
}: { 
  isAuthenticated: boolean; 
  user: User | null; 
  onComplete: () => void;
  children: JSX.Element;
}) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (user && user.id !== 'guest' && !user.onboardingCompleted) {
    return <OnboardingWizard userId={user.id} onComplete={onComplete} />;
  }
  
  return children;
};

// --- COMPONENTE INTERNO CON ACCESO A LAS RUTAS ---
const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);  
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      await fetchUserProfile(session.user.id, session.user.email!);
    } else {
      setUser(GUEST_USER);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            email: email,
            name: email.split('@')[0], 
            role: 'profesor',
            plan: 'free',
            generated_count: 0,
            onboarding_completed: false 
          }])
          .select()
          .single();

        if (createError) throw createError;
        data = newProfile;
      } 

      if (data) {
        setUser({
          id: data.id,
          name: data.name || email.split('@')[0],
          email: data.email,
          role: data.role as 'profesor' | 'alumno',
          plan: (data.plan as UserPlan) || UserPlan.FREE, 
          generatedCount: data.generated_count || 0,
          onboardingCompleted: data.onboarding_completed,
          subjects: data.subjects
        });
        setIsAuthenticated(true);
        
        if (location.pathname === '/login' || location.pathname === '/registro') {
           navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Error perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      landing: '/',
      dashboard: '/dashboard',
      gallery: '/comunidad',
      resources: '/recursos',
      generator: '/crear-fichas',
      exams: '/crear-examenes',
      rubrics: '/crear-rubricas',
      situaciones: '/crear-situaciones',
      pricing: '/precios',
      payment_success: '/payment-success',
      login_required: '/login'
    };
    navigate(routeMap[page] || '/dashboard');
  };

  const getCurrentPageStr = () => {
    const path = location.pathname;
    if (path === '/') return 'landing';
    if (path.includes('/comunidad')) return 'gallery';
    if (path.includes('/recursos')) return 'resources';
    if (path.includes('/crear-fichas')) return 'generator';
    if (path.includes('/crear-examenes')) return 'exams';
    if (path.includes('/crear-rubricas')) return 'rubrics';
    if (path.includes('/crear-situaciones')) return 'situaciones';
    if (path.includes('/precios')) return 'pricing';
    if (path.includes('/payment-success')) return 'payment_success';
    return 'dashboard';
  };

  const handleLogin = () => window.location.reload();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    window.location.reload();
  };

  const handleCompleteOnboarding = () => {
    if (user) {
      setUser({ ...user, onboardingCompleted: true });
      navigate('/dashboard');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Cargando FichaLab...</div>;

  return (
    <Routes>
      <Route path="/" element={
        !isAuthenticated ? (
          <LandingPage 
            onStart={() => navigate('/login')} 
            onExplore={() => {
              setUser(GUEST_USER); 
              navigate('/comunidad');
            }}
          />
        ) : (
          <Navigate to="/dashboard" replace />
        )
      } />
      
      <Route path="/login" element={<Login onLogin={handleLogin} onSwitchToRegister={() => navigate('/registro')} />} />
      <Route path="/registro" element={<Register onSwitchToLogin={() => navigate('/login')} />} />
      <Route path="/actualizar-contrasena" element={<UpdatePassword />} />

      <Route element={
        user ? (
          <Layout user={user} onLogout={handleLogout} currentPage={getCurrentPageStr()} onNavigate={handleNavigate}>
            <Outlet />
          </Layout>
        ) : (
          <Navigate to="/login" replace />
        )
      }>
        <Route path="/dashboard" element={<RequireAuth isAuthenticated={isAuthenticated} user={user} onComplete={handleCompleteOnboarding}><Dashboard user={user!} onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/crear-fichas" element={<RequireAuth isAuthenticated={isAuthenticated} user={user} onComplete={handleCompleteOnboarding}><WorksheetGenerator user={user!} onWorksheetGenerated={async () => { if (user) await fetchUserProfile(user.id, user.email!); }} /></RequireAuth>} />
        <Route path="/crear-examenes" element={<RequireAuth isAuthenticated={isAuthenticated} user={user} onComplete={handleCompleteOnboarding}><ExamGenerator user={user!} /></RequireAuth>} />
        <Route path="/crear-rubricas" element={<RequireAuth isAuthenticated={isAuthenticated} user={user} onComplete={handleCompleteOnboarding}><RubricGenerator user={user!} /></RequireAuth>} />
        <Route path="/crear-situaciones" element={<RequireAuth isAuthenticated={isAuthenticated} user={user} onComplete={handleCompleteOnboarding}><SdaGenerator user={user!} /></RequireAuth>} />
        <Route path="/payment-success" element={<RequireAuth isAuthenticated={isAuthenticated} user={user} onComplete={handleCompleteOnboarding}><PaymentSuccess user={user!} onNavigate={handleNavigate} /></RequireAuth>} />

        <Route path="/comunidad" element={<Gallery />} />
        <Route path="/recursos" element={<ResourceLibrary />} />
        <Route path="/precios" element={<Pricing user={user!} onUpgrade={() => navigate('/login')} />} />
      </Route>

      {/* RUTAS SEO SATÉLITE */}
      <Route path="/recursos/fichas-matematicas-3-primaria" element={<SeoArticle metaTitle="Fichas de Matemáticas para 3º de Primaria para Imprimir | FichaLab" h1="Fichas de Matemáticas para 3º de Primaria (Listas para Imprimir)" subtitle="Descubre cómo generar infinitos ejercicios de sumas, restas, multiplicaciones y problemas adaptados al nivel exacto de tus alumnos." content={<div className="space-y-6"><p>Encontrar <strong>fichas de matemáticas para 3º de primaria</strong> que se adapten exactamente a lo que has dado en clase puede llevarte horas de búsqueda por internet. A menudo, los PDFs que descargas son demasiado fáciles, demasiado difíciles, o no cumplen con la normativa actual.</p><h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">La solución: Generación por Inteligencia Artificial</h2><p>En lugar de reciclar fotocopias antiguas, herramientas como FichaLab te permiten crear material único. Solo tienes que pedir: <em>"Crea 10 problemas de multiplicaciones por una cifra con temática de superhéroes"</em>, y obtendrás un PDF listo para imprimir en segundos.</p></div>} />} />
      <Route path="/recursos/sustituciones-ultima-hora" element={<SeoArticle metaTitle="Recursos para Sustituciones de Última Hora y Guardias | FichaLab" h1="Recursos para Sustituciones de Última Hora" subtitle="Sobrevive a las guardias y a los últimos 10 minutos de clase con actividades generadas en segundos que sí aportan valor educativo." content={<div className="space-y-6"><p>Todo docente conoce el pánico de tener que cubrir una clase que no es suya sin material preparado. Buscar <strong>recursos para sustituciones de última hora</strong> suele acabar en ponerles una película o dejarles tiempo libre, perdiendo una hora valiosa.</p><h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Salva los últimos 10 minutos de clase</h2><p>Tanto si estás de guardia como si necesitas <strong>actividades para los últimos 10 minutos de clase</strong> o <strong>ejercicios para alumnos que terminan antes</strong>, la inteligencia artificial es tu mejor aliada. Genera pasatiempos educativos, debates rápidos o retos matemáticos desde tu móvil antes de entrar por la puerta del aula.</p></div>} />} />
      <Route path="/recursos/adaptaciones-curriculares-dua" element={<SeoArticle metaTitle="Adaptaciones Curriculares Automáticas y DUA | FichaLab" h1="Adaptaciones Curriculares Automáticas (DUA)" subtitle="Crea material diferenciado para alumnos con dificultades de lectura, dislexia o altas capacidades sin invertir horas extra." content={<div className="space-y-6"><p>El Diseño Universal para el Aprendizaje (DUA) exige que adaptemos nuestros materiales a todos los ritmos, pero el día solo tiene 24 horas. Crear una <strong>tarea diferenciada sobre el mismo tema</strong> de forma manual es agotador.</p><h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Ejercicios diferenciados por nivel en 1 clic</h2><p>Con FichaLab, puedes generar tu examen normal y, con un solo clic, pedirle a la IA: <em>"Adapta este mismo texto para un alumno con dificultades de lectura"</em> o <em>"Crea una versión de ampliación para altas capacidades"</em>. Consigue <strong>adaptaciones curriculares automáticas</strong> y asegúrate de que nadie se queda atrás.</p></div>} />} />
      <Route path="/recursos/generador-examenes-lomloe" element={<SeoArticle metaTitle="Generador de Exámenes LOMLOE con IA | FichaLab" h1="Generador de Exámenes LOMLOE Automático" subtitle="Redacta exámenes tipo test o de desarrollo con la justificación de saberes básicos y criterios de evaluación ya integrada." content={<div className="space-y-6"><p>Redactar preguntas es solo la mitad del trabajo. La verdadera burocracia llega cuando tienes que justificar cada pregunta con la normativa actual. Si buscas <strong>cómo preparar clases más rápido</strong>, automatizar este proceso es el primer paso.</p><h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tu asistente curricular personal</h2><p>Un <strong>generador de exámenes</strong> moderno no solo te da las preguntas y el solucionario. FichaLab cruza tus temas con el currículo oficial y te devuelve una tabla perfecta detallando qué competencias específicas y criterios se evalúan en cada ejercicio. Imprime y al aula.</p></div>} />} />
      <Route path="/recursos/como-hacer-rubricas-evaluacion" element={<SeoArticle metaTitle="Generador de Rúbricas de Evaluación LOMLOE | FichaLab" h1="Cómo Hacer Rúbricas de Evaluación Rápido" subtitle="Evalúa situaciones de aprendizaje, proyectos y exposiciones con rúbricas detalladas creadas específicamente para tu aula." content={<div className="space-y-6"><p>La evaluación formativa exige rúbricas claras, pero diseñar los niveles de logro (Excelente, Bueno, En Proceso, Necesita Mejora) para cada pequeño proyecto consume toda tu planificación semanal.</p><h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">De la idea al papel en 10 segundos</h2><p>Si alguna vez has buscado <strong>cómo hacer rúbricas para alumnos rápido</strong>, la IA tiene la respuesta. Dile a FichaLab qué van a hacer tus alumnos (ej: "Un podcast sobre el Imperio Romano en 2º de la ESO") y la IA te construirá una tabla de evaluación perfecta lista para adjuntar a tu programación.</p></div>} />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
      <Analytics /> 
    </BrowserRouter>
  );
};

export default App;