import React, { useState } from 'react';
import { User } from '../../types';
import { supabase } from '../../src/lib/supabase';
import ChangePasswordModal from '../../components/ChangePasswordModal';

interface VendedorSettingsProps {
    user: User;
    setUser: (user: User) => void;
}

const VendedorSettings: React.FC<VendedorSettingsProps> = ({ user, setUser }) => {
    const [showSuccess] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('security');

    const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
    const isAdmin = user.role === 'ADMIN' || user.email === 'joaohenriquee89@gmail.com';

    const tabs = [
        { id: 'security', icon: 'security', label: 'Segurança' },
        { id: 'notifications', icon: 'notifications', label: 'Notificações' },
        { id: 'ai', icon: 'psychology', label: 'Diagnóstico IA', hidden: !(isDev || isAdmin) },
        { id: 'excision', icon: 'delete_forever', label: 'Exclusão', color: 'text-red-500' },
    ];

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Configurações</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Gerencie sua segurança e preferências.</p>
            </div>

            {showSuccess && (
                <div className="fixed top-24 right-8 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-spring-in z-50 font-bold border border-white/20">
                    <span className="material-icons-round">check_circle</span>
                    Alterações salvas com sucesso!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    {tabs.filter(t => !t.hidden).map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20 font-black' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 font-bold'}`}
                        >
                            <span className={`material-icons-round ${item.color || ''}`}>{item.icon}</span>
                            <span className="text-sm uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="md:col-span-2 space-y-8 min-h-[400px]">
                    {/* Security Section */}
                    {activeTab === 'security' && (
                        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border/50 p-10 shadow-sm space-y-8 animate-fade-in">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <span className="material-icons-round">shield</span>
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Segurança e Acesso</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 group">
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Senha da Conta</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Troque sua senha periodicamente.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all active:scale-95"
                                    >
                                        Alterar
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Notifications Section */}
                    {activeTab === 'notifications' && (
                        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border/50 p-10 shadow-sm space-y-8 animate-fade-in">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                                    <span className="material-icons-round">notifications</span>
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Notificações</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Novos Trabalhos', desc: 'Alertas de vagas que dão match com seu perfil.' },
                                    { title: 'Mensagens de Lojas', desc: 'Notificar quando receber contatos de recrutadores.' },
                                ].map((notif, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 group">
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">{notif.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{notif.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* AI Tester Section */}
                    {activeTab === 'ai' && (
                        <section className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-fade-in">
                            <h2 className="text-xl font-black text-white uppercase tracking-wider">Diagnóstico de IA</h2>
                            <AITester />
                        </section>
                    )}

                    {/* Excision Section */}
                    {activeTab === 'excision' && (
                        <section className="bg-red-50/50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 p-10 shadow-sm space-y-8 animate-fade-in">
                            <h2 className="text-xl font-black text-red-700 dark:text-red-400 uppercase tracking-wider">Zona de Perigo</h2>
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-relaxed">
                                Esta ação é irreversível e excluirá todo seu histórico de aplicações e currículo.
                            </p>
                            <button className="px-10 py-5 bg-red-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95">
                                EXCLUIR MINHA CONTA
                            </button>
                        </section>
                    )}
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

const AITester: React.FC = () => {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const url = typeof supabase !== 'undefined' ? supabase.supabaseUrl : "unknown";

    const runTest = async () => {
        setLoading(true);
        setResult(null);
        try {
            const { data, error } = await supabase.functions.invoke('test-ai', {
                body: { prompt: "Teste de conexão do usuário." }
            });

            if (error) throw error;
            setResult(data);
        } catch (err: any) {
            setResult({
                error: err.message,
                status: 'client_error',
                debug_url: url
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={runTest}
                disabled={loading}
                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl"
            >
                {loading ? <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span> : <span className="material-icons-round">play_arrow</span>}
                Executar Teste
            </button>

            {result && (
                <div className="bg-slate-800 rounded-2xl p-6 overflow-x-auto border border-white/5">
                    <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default VendedorSettings;
