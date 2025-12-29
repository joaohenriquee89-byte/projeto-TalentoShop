import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, setIsOpen, onLogout }) => {
  const location = useLocation();
  const role = user.role;

  const NavItem = ({ to, icon, label, exact = false }: { to: string; icon: string; label: string; exact?: boolean }) => {
    const isActive = exact
      ? location.pathname === to
      : location.pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
          ? 'bg-primary text-white shadow-lg shadow-blue-900/20'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white'
          }`}
      >
        <span className={`material-icons-round text-xl ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
          {icon}
        </span>
        <span className="font-medium text-sm">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
            <Link to={role === UserRole.VENDEDOR ? "/dashboard/vendedor" : "/dashboard/lojista"} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-soft">
                <span className="material-symbols-outlined text-lg">hub</span>
              </div>
              <span className="font-display font-bold text-xl text-primary dark:text-white">
                Talento<span className="text-secondary">Shop</span>
              </span>
            </Link>
          </div>

          {/* User Profile Summary */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <img
                src={user.avatar || `https://picsum.photos/seed/${user.id}/100`}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-600 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
                  {role === UserRole.VENDEDOR ? 'Vendedor' : 'Lojista'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-4 space-y-2 overflow-y-auto">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">
              Menu Principal
            </p>

            {role === UserRole.VENDEDOR && (
              <>
                <NavItem to="/dashboard/vendedor" icon="dashboard" label="Dashboard" exact />
                <NavItem to="/dashboard/vendedor/my-jobs" icon="work_history" label="Minhas Vagas" />
                <NavItem to="/dashboard/vendedor/applications" icon="send" label="Candidaturas" />
                <NavItem to="/dashboard/vendedor/messages" icon="chat" label="Mensagens" />
              </>
            )}

            {role === UserRole.LOJISTA && (
              <>
                <NavItem to="/dashboard/lojista" icon="dashboard" label="Visão Geral" exact />
                <NavItem to="/dashboard/lojista/candidates" icon="group" label="Candidatos" />
                <NavItem to="/dashboard/lojista/jobs" icon="business_center" label="Vagas Abertas" />
                <NavItem to="/dashboard/lojista/messages" icon="chat" label="Mensagens" />
              </>
            )}

            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">
              Conta
            </p>
            <NavItem
              to={role === UserRole.VENDEDOR ? "/dashboard/vendedor/settings" : "/dashboard/lojista/settings"}
              icon="settings"
              label="Configurações"
            />
            <NavItem
              to={role === UserRole.VENDEDOR ? "/dashboard/vendedor/plans" : "/dashboard/lojista/plans"}
              icon="verified"
              label="Planos & Faturamento"
            />
          </div>

          {/* Footer / Logout */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
            >
              <span className="material-icons-round">logout</span>
              <span className="font-medium text-sm">Sair da Conta</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
