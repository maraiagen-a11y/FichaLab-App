import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ResourceLibrary } from './pages/ResourceLibrary';
import { WorksheetGenerator } from './pages/WorksheetGenerator';
import { Pricing } from './pages/Pricing';
import { User, UserPlan } from './types';

// Mock Hash Router implementation
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);

  // Check for session persistence on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('eduGenius_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (email: string) => {
    // Mock user data creation
    const newUser: User = {
      id: '123',
      name: email.split('@')[0],
      email: email,
      plan: UserPlan.FREE,
      generatedCount: 2 // Simulating some previous usage
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('eduGenius_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('eduGenius_user');
  };

  const handleUpgrade = () => {
    if (user) {
      const updatedUser = { ...user, plan: UserPlan.PREMIUM };
      setUser(updatedUser);
      localStorage.setItem('eduGenius_user', JSON.stringify(updatedUser));
      alert("¡Felicidades! Te has suscrito al plan Premium.");
    }
  };

  const handleWorksheetGenerated = () => {
    if (user) {
      const updatedUser = { ...user, generatedCount: user.generatedCount + 1 };
      setUser(updatedUser);
      localStorage.setItem('eduGenius_user', JSON.stringify(updatedUser));
    }
  };

  if (!isAuthenticated || !user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'resources':
        return <ResourceLibrary user={user} />;
      case 'generator':
        return <WorksheetGenerator user={user} onWorksheetGenerated={handleWorksheetGenerated} />;
      case 'pricing':
        return <Pricing user={user} onUpgrade={handleUpgrade} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
