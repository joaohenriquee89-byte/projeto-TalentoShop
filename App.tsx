import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import VendedorRegister from './pages/VendedorRegister';
import LojistaRegister from './pages/LojistaRegister';
import RegisterSelection from './pages/RegisterSelection';
import VendedorOverview from './pages/vendedor/Overview';
import VendedorJobs from './pages/vendedor/Jobs';
import VendedorApplications from './pages/vendedor/Applications';
import VendedorMessages from './pages/vendedor/Messages';
import VendedorSettings from './pages/vendedor/Settings';
import VendedorPlans from './pages/vendedor/Plans';

import LojistaOverview from './pages/lojista/Overview';
import LojistaCandidates from './pages/lojista/Candidates';
import LojistaJobs from './pages/lojista/Jobs';
import LojistaMessages from './pages/lojista/Messages';
import LojistaSettings from './pages/lojista/Settings';
import LojistaPlans from './pages/lojista/Plans';
import PricingPage from './pages/PricingPage';
import LimitPage from './pages/LimitPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Layout from './components/Layout';
import { User, UserRole } from './types';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';

const MainRoutes: React.FC<{ theme: 'light' | 'dark', toggleTheme: () => void, setTheme: (theme: 'light' | 'dark') => void }> = ({ theme, toggleTheme, setTheme }) => {
  const { user, loading, signOut } = useAuth();
  const [localUser, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    // Sync context user to localUser for compatibility with existing components
    // In a full refactor, we would update components to use context directly
    setLocalUser(user);
  }, [user]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Helper to handle logout
  const handleLogout = async () => {
    await signOut();
    setLocalUser(null);
  };

  // Helper to set User (mostly for updates from settings)
  // We keep this compatible with existing props, but ideally this would update context
  const handleSetUser = (u: User | null) => {
    setLocalUser(u);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen text-slate-800 dark:text-gray-100">
        <ConditionalNavbar user={localUser} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterSelection />} />
            <Route path="/register/vendedor" element={<VendedorRegister />} />
            <Route path="/register/lojista" element={<LojistaRegister />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/limit" element={<LimitPage />} />

            {/* Dashboard Routes (Wrapped in Layout) */}
            <Route
              path="/dashboard/vendedor/*"
              element={
                localUser?.role === UserRole.VENDEDOR ? (
                  <Layout user={localUser} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                    <Routes>
                      <Route path="/" element={<VendedorOverview user={localUser} setUser={handleSetUser} />} />
                      <Route path="my-jobs" element={<VendedorJobs />} />
                      <Route path="applications" element={<VendedorApplications />} />
                      <Route path="messages" element={<VendedorMessages />} />
                      <Route path="settings" element={<VendedorSettings user={localUser} setUser={handleSetUser} />} />
                      <Route path="plans" element={<VendedorPlans />} />
                      <Route path="*" element={<Navigate to="/dashboard/vendedor" />} />
                    </Routes>
                  </Layout>
                ) : <Navigate to="/login" />
              }
            />
            <Route
              path="/dashboard/lojista/*"
              element={
                localUser?.role === UserRole.LOJISTA ? (
                  <Layout user={localUser} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
                    <Routes>
                      <Route path="/" element={<LojistaOverview user={localUser} />} />
                      <Route path="candidates" element={<LojistaCandidates user={localUser} />} />
                      <Route path="jobs" element={<LojistaJobs />} />
                      <Route path="messages" element={<LojistaMessages />} />
                      <Route path="settings" element={<LojistaSettings user={localUser} setUser={handleSetUser} />} />
                      <Route path="plans" element={<LojistaPlans />} />
                      <Route path="*" element={<Navigate to="/dashboard/lojista" />} />
                    </Routes>
                  </Layout>
                ) : <Navigate to="/login" />
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <ConditionalFooter />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <AuthProvider>
      <MainRoutes theme={theme} toggleTheme={toggleTheme} setTheme={setTheme} />
    </AuthProvider>
  );
};

const ConditionalNavbar: React.FC<{
  user: User | null;
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
}> = ({ user, theme, toggleTheme, onLogout }) => {
  const location = useLocation();
  // Hide Navbar on Login/Register/Limit pages AND Dashboard pages (Layout handles Dashboard)
  const hiddenOn = ['/login', '/register', '/register/vendedor', '/register/lojista', '/limit'];
  const isDashboard = location.pathname.includes('/dashboard');

  if (hiddenOn.includes(location.pathname) || isDashboard) return null;

  return <Navbar user={user} theme={theme} toggleTheme={toggleTheme} onLogout={onLogout} />;
};

const ConditionalFooter: React.FC = () => {
  const location = useLocation();
  // Hide Footer on Auth pages and Dashboard pages
  const hiddenOn = ['/login', '/register', '/register/vendedor', '/register/lojista', '/limit'];
  const isDashboard = location.pathname.includes('/dashboard');

  if (hiddenOn.includes(location.pathname) || isDashboard) return null;

  return <Footer />;
};

const PlaceholderPage: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
      <span className="material-icons-round text-4xl text-slate-400 dark:text-slate-500">{icon}</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
    <p className="text-slate-500 dark:text-slate-400 max-w-md">
      Esta funcionalidade estará disponível em breve. Estamos trabalhando duro para trazer o melhor para você.
    </p>
  </div>
);

export default App;
