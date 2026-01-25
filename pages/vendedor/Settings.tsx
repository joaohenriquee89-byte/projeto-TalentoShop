import React, { useState } from 'react';
import { User } from '../../types';
import { supabase } from '../../src/lib/supabase';
import ChangePasswordModal from '../../components/ChangePasswordModal';

interface VendedorSettingsProps {
    user: User;
    setUser: (user: User) => void;
}

const VendedorSettings: React.FC<VendedorSettingsProps> = ({ user }) => {
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
        <div className="animate-fade-in max-w-5xl mx-auto space-y-10 py-6 px-4">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Configurações</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Gerencie sua segurança e preferências da conta.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-3">
                    {tabs.filter(t => !t.hidden).map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all cursor-pointer group ${activeTab === item.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-white/5 font-black' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 font-bold hover:translate-x-1'}`}
                        >
                            <span className={`material-icons-round ${item.id === activeTab ? '' : item.color || ''}`}>{item.icon}</span>
                            <span className="text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="md:col-span-2 space-y-8 min-h-[400px]">
                    {/* Security Section */}
                    {activeTab === 'security' && (
                        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-10 shadow-sm space-y-10 animate-fade-in relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
                                    <span className="material-icons-round text-2xl">shield_person</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Segurança Profissional</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Acesso e Credenciais</p>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5 group gap-6">
                                    <div className="flex-1">
                                        <h3 className="font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors mb-1">Senha da Conta</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Recomendamos a troca a cada 90 dias para sua máxima proteção.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg"
                                    >
                                        ALTERAR AGORA
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Notifications Section */}
                    {activeTab === 'notifications' && (
                        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-10 shadow-sm space-y-10 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
                                    <span className="material-icons-round text-2xl">notifications_active</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Alertas de Vagas</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Preferências de Contato</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Radar de Vagas', desc: 'Alertas em tempo real para vagas com match acima de 80%.', icon: 'radar' },
                                    { title: 'Direct das Marcas', desc: 'Notificar via e-mail quando um lojista visualizar seu perfil.', icon: 'forward_to_inbox' },
                                ].map((notif, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-8 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5 group">
                                        <div className="flex gap-4 items-center">
                                            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white dark:bg-slate-800 items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                <span className="material-icons-round text-xl">{notif.icon}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors">{notif.title}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{notif.desc}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-16 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[6px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* AI Tester Section */}
                    {activeTab === 'ai' && (
                        <section className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-10 animate-fade-in border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">Engenharia de Match IA</h2>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Diagnóstico Técnico do Sistema</p>
                            </div>
                            <AITester />
                        </section>
                    )}

                    {/* Excision Section */}
                    {activeTab === 'excision' && (
                        <section className="bg-rose-50/50 dark:bg-rose-950/10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 p-10 shadow-sm space-y-10 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
                                    <span className="material-icons-round text-2xl">dangerous</span>
                                </div>
                                <h2 className="text-xl font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider">Zona de Decisão Final</h2>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-rose-400/60 font-medium leading-relaxed max-w-lg">
                                Ao excluir sua conta, todos os seus dados de currículo, histórico de candidaturas e matches de IA serão apagados permanentemente dos nossos servidores.
                            </p>
                            <button className="px-10 py-5 bg-rose-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-rose-500/20 hover:bg-rose-700 transition-all active:scale-95">
                                EXCLUIR MINHA CONTA AGORA
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
        <div className="space-y-6 relative z-10">
            <button
                onClick={runTest}
                disabled={loading}
                className="px-8 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center gap-4 shadow-2xl"
            >
                {loading ? <span className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></span> : <span className="material-icons-round text-lg">bolt</span>}
                INICIAR DIAGNÓSTICO
            </button>

            {result && (
                <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 overflow-x-auto border border-white/10 shadow-inner">
                    <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default VendedorSettings;
