import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { supabase } from './services/supabaseClient'; 
import { User, UserPlan } from './types';

// --- IMPORTS DE PÁGINAS Y COMPONENTES ---
import { SeoArticle } from './pages/SeoArticle'; // <-- NUESTRO CABALLO DE TROYA
import Register from './pages/Register';
import { Layout } from './components/Layout';
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

const GUEST_USER: User = {
  id: 'guest',
  name: 'Profe Invitado',
  email: 'invitado@fichalab.com',
  role: 'profesor',
  plan: UserPlan.FREE,
  generatedCount: 0,
  onboardingCompleted: true 
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
        
        // Si estábamos en login y nos logueamos, redirigir al panel
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

  // ADAPTADOR MÁGICO: Traduce tus antiguas variables a las nuevas URLs SEO
  const handleNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      landing: '/',
      dashboard: '/dashboard',
      gallery: '/comunidad',
      resources: '/recursos',
      generator: '/crear-fichas',
      exams: '/crear-examenes',
      rubrics: '/crear-rubricas',
      pricing: '/precios',
      payment_success: '/payment-success',
      login_required: '/login'
    };
    navigate(routeMap[page] || '/dashboard');
  };

  // COMPATIBILIDAD CON TU LAYOUT: Le dice al menú lateral qué pestaña iluminar
  const getCurrentPageStr = () => {
    const path = location.pathname;
    if (path === '/') return 'landing';
    if (path.includes('/comunidad')) return 'gallery';
    if (path.includes('/recursos')) return 'resources';
    if (path.includes('/crear-fichas')) return 'generator';
    if (path.includes('/crear-examenes')) return 'exams';
    if (path.includes('/crear-rubricas')) return 'rubrics';
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Cargando FichaLab...</div>;

  // --- PROTECCIÓN DE RUTAS (Bloquea a usuarios sin cuenta) ---
  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    // Asistente de inicio para nuevos usuarios
    if (user && user.id !== 'guest' && !user.onboardingCompleted) {
      return <OnboardingWizard userId={user.id} onComplete={() => {
        setUser({ ...user, onboardingCompleted: true });
        navigate('/dashboard');
      }} />;
    }
    
    return children;
  };

  // --- ENVOLTORIO CON TU DISEÑO (Sidebar y Header) ---
  const AppLayout = () => {
    if (!user) return <Navigate to="/login" replace />;
    return (
      <Layout user={user} onLogout={handleLogout} currentPage={getCurrentPageStr()} onNavigate={handleNavigate}>
        <Outlet />
      </Layout>
    );
  };

  return (
    <Routes>
      {/* RUTAS PÚBLICAS FRONTALES */}
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

      {/* RUTAS CON LAYOUT (El panel de control) */}
      <Route element={<AppLayout />}>
        
        {/* Rutas Privadas (Requieren Login) */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard user={user!} onNavigate={handleNavigate} /></RequireAuth>} />
        <Route path="/crear-fichas" element={<RequireAuth><WorksheetGenerator user={user!} onWorksheetGenerated={async () => { if (user) await fetchUserProfile(user.id, user.email!); }} /></RequireAuth>} />
        <Route path="/crear-examenes" element={<RequireAuth><ExamGenerator user={user!} /></RequireAuth>} />
        <Route path="/crear-rubricas" element={<RequireAuth><RubricGenerator user={user!} /></RequireAuth>} />
        <Route path="/payment-success" element={<RequireAuth><PaymentSuccess user={user!} onNavigate={handleNavigate} /></RequireAuth>} />

        {/* Rutas Semi-Públicas (Los invitados pueden verlas) */}
        <Route path="/comunidad" element={<Gallery />} />
        <Route path="/recursos" element={<ResourceLibrary />} />
        <Route path="/precios" element={<Pricing user={user!} onUpgrade={() => navigate('/login')} />} />

      </Route>

      {/* 👇 RUTAS SEO SATÉLITE (El Caballo de Troya) 👇 */}
      <Route path="/recursos/fichas-matematicas-3-primaria" element={
        <SeoArticle 
          metaTitle="Fichas de Matemáticas para 3º de Primaria para Imprimir | FichaLab"
          h1="Fichas de Matemáticas para 3º de Primaria (Listas para Imprimir)"
          subtitle="Descubre cómo generar infinitos ejercicios de sumas, restas, multiplicaciones y problemas adaptados al nivel exacto de tus alumnos."
          content={
            <div className="space-y-6">
              <p>Encontrar <strong>fichas de matemáticas para 3º de primaria</strong> que se adapten exactamente a lo que has dado en clase puede llevarte horas de búsqueda por internet. A menudo, los PDFs que descargas son demasiado fáciles, demasiado difíciles, o no cumplen con la normativa LOMLOE actual.</p>
              
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">El problema de los recursos estándar</h2>
              <p>Cada aula es un mundo. Algunos alumnos necesitan <strong>ejercicios de refuerzo</strong> porque se atascan con las llevadas, mientras que otros necesitan <strong>actividades para alumnos que terminan antes</strong> (ejercicios de ampliación).</p>
              
              <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">La solución: Generación por Inteligencia Artificial</h2>
              <p>En lugar de reciclar fotocopias antiguas, las nuevas herramientas educativas te permiten crear material único. Con un generador como FichaLab, solo tienes que pedir: <em>"Crea 10 problemas de multiplicaciones por una cifra con temática de superhéroes"</em>, y obtendrás un PDF listo para imprimir en segundos, junto con su solucionario para ti.</p>
            </div>
          }
        />
      } />

      {/* RUTA COMODÍN: Si escriben mal una URL, vuelven al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// --- EL CONTENEDOR PRINCIPAL ---
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;