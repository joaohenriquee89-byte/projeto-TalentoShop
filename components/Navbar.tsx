
// Added missing React import to fix namespace error on line 12
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, theme, toggleTheme, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  // If we are in dashboard, do not render this Navbar (it is replaced by Layout's Header)
  if (isDashboard) return null;

  // Render Public Navbar
  return (
    <nav className="fixed w-full z-50 glass-effect border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-soft">
              <span className="material-symbols-outlined text-xl">hub</span>
            </div>
            <span className="font-display font-bold text-2xl text-primary dark:text-white">Talento<span className="text-secondary">Shop</span></span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition" href="#features">Funcionalidades</a>
            <Link className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition" to="/pricing">Planos</Link>
            <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition" onClick={toggleTheme}>
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-xl flex items-center">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <Link className="text-sm font-bold text-primary dark:text-white hover:underline" to="/login">Login</Link>
            <Link to="/register/vendedor" className="bg-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-full font-medium transition shadow-lg shadow-primary/30 flex items-center">
              Começar Agora
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <span className="material-icons-round text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 animate-fade-in-down shadow-xl">
          <div className="px-4 py-6 space-y-4 flex flex-col">
            <a onClick={() => setIsMobileMenuOpen(false)} href="#features" className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition">Funcionalidades</a>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/pricing" className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition">Planos</Link>

            <button
              onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition"
            >
              <span className="material-symbols-outlined text-xl">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
              <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="text-center py-3 text-base font-bold text-primary dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">
                Fazer Login
              </Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/register/vendedor" className="bg-primary hover:bg-petrol-700 text-white py-3 rounded-xl font-medium text-center shadow-lg shadow-primary/30 transition">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
