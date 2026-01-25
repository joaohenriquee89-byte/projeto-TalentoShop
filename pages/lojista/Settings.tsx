import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { supabase } from '../../src/lib/supabase';
import ChangePasswordModal from '../../components/ChangePasswordModal';

interface SettingsProps {
    user: User;
    setUser: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('security');

    // Robust environment checks
    const [envInfo, setEnvInfo] = useState({ isDev: false, isAdmin: false });

    useEffect(() => {
        try {
            const isDevMode = import.meta.env.DEV || import.meta.env.MODE === 'development';
            const isUserAdmin = user.role === 'ADMIN' || user.email === 'joaohenriquee89@gmail.com';
            setEnvInfo({ isDev: isDevMode, isAdmin: isUserAdmin });
        } catch (e) {
            console.warn("Env check failed, defaulting to restricted view", e);
        }
    }, [user]);

    // Internal states for settings
    const [notificationsSet, setNotificationsSet] = useState({
        apps: true,
        messages: true,
        digest: false
    });

    // @ts-ignore
    const url = typeof supabase !== 'undefined' ? (supabase as any).supabaseUrl : "unknown";

    const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'done'>('idle');
    const [aiResult, setAiResult] = useState<any>(null);

    const runAiTest = async () => {
        setAiStatus('loading');
        setAiResult(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch(`${url}/functions/v1/test-ai`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token || ''}`
                },
                body: JSON.stringify({ prompt: "Teste de diagnóstico" })
            });

            const data = await response.json();
            setAiResult(data);
        } catch (error: any) {
            setAiResult({
                status: 'error',
                message: 'Erro de conexão local',
                details: error.message,
                fallback: true
            });
        } finally {
            setAiStatus('done');
        }
    };

    const handleSave = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const tabs = [
        { id: 'security', icon: 'security', label: 'Segurança' },
        { id: 'notifications', icon: 'notifications', label: 'Notificações' },
        { id: 'ai', icon: 'psychology', label: 'Diagnóstico IA', hidden: !(envInfo.isDev || envInfo.isAdmin) },
        { id: 'excision', icon: 'delete_forever', label: 'Exclusão', color: 'text-red-500' },
    ];

    const currentTab = tabs.find(t => t.id === activeTab && !t.hidden) || tabs[0];

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Configurações</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Gerencie sua segurança e preferências corporativas.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="material-icons-round text-xs">info</span>
                    Seção: {currentTab.label}
                </div>
            </div>

            {showSuccess && (
                <div className="fixed top-24 right-8 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-spring-in z-50 font-bold border border-white/20">
                    <span className="material-icons-round">check_circle</span>
                    Configurações atualizadas!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    {tabs.filter(t => !t.hidden).map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                console.log('Tab selected:', item.id);
                                setActiveTab(item.id);
                            }}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20 font-black scale-[1.02]' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 font-bold hover:translate-x-1'} cursor-pointer outline-none`}
                        >
                            <span className={`material-icons-round ${item.color || ''}`}>{item.icon}</span>
                            <span className="text-sm uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="md:col-span-2 space-y-8 min-h-[500px]">
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
                                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 transition-all hover:shadow-md group">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Senha da Conta</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 max-w-xs">Mantenha suas credenciais protegidas e altere-as regularmente.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all active:scale-95 shadow-sm"
                                    >
                                        ALTERAR SENHA
                                    </button>
                                </div>

                                <div className="p-8 bg-blue-50/50 dark:bg-primary/5 rounded-[2rem] border border-blue-100 dark:border-primary/10 flex items-start gap-5">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                                        <span className="material-icons-round text-2xl">verified_user</span>
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-slate-900 dark:text-white mb-2">Segurança em Primeiro Lugar</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                            Seus dados estão protegidos por criptografia de ponta a ponta e auditorias de segurança automáticas.
                                        </p>
                                    </div>
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
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Centro de Notificações</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'apps', title: 'Novas Candidaturas', desc: 'Alertas em tempo real para novos perfis qualificados.' },
                                    { id: 'messages', title: 'Mensagens Diretas', desc: 'Sempre notificar quando receber chats de candidatos.' },
                                    { id: 'digest', title: 'Resumo da Semana', desc: 'Relatório consolidado de performance e visualização.' },
                                ].map((notif) => (
                                    <div key={notif.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-slate-200 transition-all">
                                        <div className="pr-4">
                                            <h3 className="font-bold text-slate-800 dark:text-white mb-1">{notif.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-tight">{notif.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={(notificationsSet as any)[notif.id]}
                                                onChange={() => setNotificationsSet(prev => ({ ...prev, [notif.id]: !(prev as any)[notif.id] }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={handleSave}
                                    className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
                                >
                                    Salvar Preferências
                                </button>
                            </div>
                        </section>
                    )}

                    {/* AI Diagnostics Section */}
                    {activeTab === 'ai' && (
                        <section className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden animate-fade-in">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center">
                                    <span className="material-icons-round">psychology</span>
                                </div>
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">Laboratório de Diagnóstico</h2>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-md">
                                    Esta área é reservada para desenvolvedores e administradores testarem as rotas da Inteligência Artificial.
                                </p>

                                <div className="flex flex-col gap-6">
                                    <button
                                        type="button"
                                        onClick={runAiTest}
                                        disabled={aiStatus === 'loading'}
                                        className="w-fit px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 shadow-2xl"
                                    >
                                        {aiStatus === 'loading' && <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>}
                                        {aiStatus === 'loading' ? 'CHECKING...' : 'DISPARAR TESTE DE IA'}
                                    </button>

                                    {aiResult && (
                                        <div className={`p-8 rounded-[1.5rem] border text-xs font-mono animate-fade-in ${aiResult.fallback ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                                            aiResult.status === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
                                                'bg-red-500/10 border-red-500/20 text-red-200'
                                            }`}>
                                            <div className="flex items-center gap-2 font-black mb-6 uppercase tracking-widest text-[10px] pb-4 border-b border-white/5">
                                                <span className={`w-2.5 h-2.5 rounded-full ${aiResult.status === 'ok' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'} animate-pulse`}></span>
                                                Status: {aiResult.status === 'ok' ? 'Conexão Estabelecida' : 'Erro de Resposta'}
                                            </div>
                                            <div className="space-y-3 opacity-80">
                                                <p><span className="text-white">Latência:</span> {aiResult.latency || 'Calculating...'}</p>
                                                <p><span className="text-white">Módulo:</span> {aiResult.edge || 'TalentoShop Pro Core'}</p>
                                                {aiResult.details && <p className="mt-4 text-[9px] text-white/40 break-all">{aiResult.details}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Excision Section */}
                    {activeTab === 'excision' && (
                        <section className="bg-red-50/50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 p-10 shadow-sm space-y-8 animate-fade-in">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                    <span className="material-icons-round">report_problem</span>
                                </div>
                                <h2 className="text-xl font-black text-red-700 dark:text-red-400 uppercase tracking-wider">Zona de Risco</h2>
                            </div>

                            <p className="text-sm text-red-600 dark:text-red-400 font-bold leading-relaxed max-w-lg">
                                Atenção: a exclusão da conta é um processo final. Você perderá acesso a todos os candidatos que favoritou, histórico de conversas e vagas publicadas.
                            </p>

                            <div className="pt-6">
                                <button
                                    type="button"
                                    className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95"
                                >
                                    EXCLUIR PERMANENTEMENTE
                                </button>
                            </div>
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

export default Settings;
