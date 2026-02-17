import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient'; 
import { User, UserPlan } from './types';

// --- IMPORTS DE PÁGINAS Y COMPONENTES ---
import Register from './pages/Register';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage'; 
import { ResourceLibrary } from './pages/ResourceLibrary';
import { WorksheetGenerator } from './pages/WorksheetGenerator';
import { Pricing } from './pages/Pricing';
import { PaymentSuccess } from './pages/PaymentSuccess'; 
import { OnboardingWizard } from './components/OnboardingWizard'; 

// --- DEFINIMOS EL USUARIO INVITADO ---
const GUEST_USER: User = {
  id: 'guest',
  name: 'Profe Invitado',
  email: 'invitado@fichalab.com',
  role: 'profesor',
  plan: UserPlan.FREE,
  generatedCount: 0,
  onboardingCompleted: true 
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 1. CORRECCIÓN CRÍTICA: Detectamos la URL *al inicio* del estado, no después.
  // Si la barra dice payment-success, arrancamos ahí directamente.
  const [currentPage, setCurrentPage] = useState(
    window.location.pathname === '/payment-success' ? 'payment_success' : 'landing'
  );

  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);  
  const [loading, setLoading] = useState(true);

  // 2. EFECTO PARA CHEQUEAR SESIÓN
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
        
        // 3. PROTECCIÓN: Solo vamos al Dashboard si NO estamos en la página de éxito
        // Y hemos quitado el borrado de URL para que esta comprobación funcione bien.
        if (window.location.pathname !== '/payment-success') {
           // Si estábamos cargando y no es payment_success, vamos al dashboard
           if (loading) setCurrentPage('dashboard');
        }
      }
    } catch (error) {
      console.error("Error perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    if (user) {
      setUser({ ...user, onboardingCompleted: true });
      setCurrentPage('dashboard');
    }
  };

  const handleLogin = () => window.location.reload();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const requireAuth = () => {
    setAuthView('login');
    setCurrentPage('login_required'); 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando FichaLab...</div>;
  
  // Evitamos mostrar Landing si estamos en payment_success
  if (!isAuthenticated && currentPage === 'landing' && currentPage !== 'payment_success') {
    return (
      <LandingPage 
        onStart={() => setCurrentPage('login_required')} 
        onExplore={() => {
          setUser(GUEST_USER); 
          setCurrentPage('resources');
        }}
      />
    );
  }

  if (currentPage === 'login_required') {
    return authView === 'register' 
      ? <Register onSwitchToLogin={() => setAuthView('login')} />
      : <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
  }

  if (!user) return null;

  const renderPage = () => {
    // Si estamos en payment_success, ignoramos el onboarding temporalmente
    if (currentPage === 'payment_success') {
       return <PaymentSuccess user={user} onNavigate={setCurrentPage} />;
    }

    if (isAuthenticated && user.id !== 'guest' && !user.onboardingCompleted) {
       return <OnboardingWizard userId={user.id} onComplete={handleOnboardingComplete} />;
    }

    switch (currentPage) {
      case 'dashboard': 
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      
      case 'resources': 
        return <ResourceLibrary />;
      
      case 'generator': 
        if (!isAuthenticated) return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
        return (
          <WorksheetGenerator 
            user={user} 
            onWorksheetGenerated={async () => {
              if (user) await fetchUserProfile(user.id, user.email);
            }} 
          />
        );
      
      case 'pricing': 
        return <Pricing user={user} onUpgrade={requireAuth} />;
      
      default: 
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;