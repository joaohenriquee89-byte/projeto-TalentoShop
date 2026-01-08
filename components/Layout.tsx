import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import Sidebar from './Sidebar';
import { supabase } from '../src/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LayoutProps {
    children: React.ReactNode;
    user: User;
    onLogout: () => void;
    toggleTheme: () => void;
    theme: 'dark' | 'light';
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, toggleTheme, theme }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
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

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            if (data) {
                setNotifications(data);
                setHasUnread(data.some((n: any) => !n.is_read));
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const channel = supabase
            .channel(`public:notifications:user_id=eq.${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
            }, () => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user.id]);

    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
            if (unreadIds.length === 0) return;

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .in('id', unreadIds);

            if (error) throw error;
            setHasUnread(false);
            // Local state update for immediate feedback
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleLogout = () => {
        onLogout();
    };

    const rolePath = user.role === UserRole.VENDEDOR ? '/dashboard/vendedor' : '/dashboard/lojista';

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

                        {notifications.length > 0 && (
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
                                                    markAllAsRead();
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
                                                        if (notif.link) navigate(notif.link);
                                                        markAsRead(notif.id);
                                                        setShowNotifications(false);
                                                    }}
                                                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 ${!notif.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-transparent'}`}></div>
                                                        <div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{notif.content}</p>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ptBR })}
                                                            </p>
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
                        )}
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
