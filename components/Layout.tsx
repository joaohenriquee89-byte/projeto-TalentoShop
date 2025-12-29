import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    user: User;
    setUser: (user: User | null) => void;
    toggleTheme: () => void;
    theme: 'dark' | 'light';
}

const Layout: React.FC<LayoutProps> = ({ children, user, setUser, toggleTheme, theme }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setUser(null);
    };

    const rolePath = user.role === 'vendedor' ? '/dashboard/vendedor' : '/dashboard/lojista';

    const notifications = [
        {
            id: 1,
            text: 'Você recebeu uma nova candidatura para "Vendedor Jr".',
            time: 'Há 5 min',
            isNew: true,
            link: user.role === 'lojista' ? '/dashboard/lojista/candidates' : '/dashboard/vendedor/applications'
        },
        {
            id: 2,
            text: `Seu plano "${user.role === 'lojista' ? 'Lojista' : 'Vendedor'}" foi renovado com sucesso.`,
            time: 'Há 2h',
            isNew: false,
            link: `${rolePath}/plans`
        },
        {
            id: 3,
            text: 'Nova mensagem de João Silva.',
            time: 'Há 1 dia',
            isNew: false,
            link: `${rolePath}/messages`
        },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
            {/* Sidebar - Hidden on mobile by default */}
            <Sidebar
                user={user}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

                {/* Top Header */}
                <header className="sticky top-0 z-30 h-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <span className="material-icons-round">menu</span>
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">
                            Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-500 hover:text-primary hover:bg-blue-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">
                                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-full transition-all outline-none focus:ring-2 focus:ring-primary/20 ${showNotifications ? 'text-primary bg-blue-50 dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-primary hover:bg-blue-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'}`}
                            >
                                <span className="material-icons-round text-xl">notifications</span>
                                {hasUnread && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark animate-pulse"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fade-in-up origin-top-right">
                                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <h3 className="font-bold text-sm text-slate-800 dark:text-white">Notificações</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setHasUnread(false);
                                            }}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Marcar como lidas
                                        </button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => {
                                                    navigate(notif.link);
                                                    setShowNotifications(false);
                                                }}
                                                className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 ${notif.isNew && hasUnread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.isNew && hasUnread ? 'bg-primary' : 'bg-transparent'}`}></div>
                                                    <div>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{notif.text}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center">
                                        <button className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                                            Ver todas
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
