import React, { useRef, useState } from 'react';
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

    // @ts-ignore
    const url = typeof supabase !== 'undefined' ? supabase.supabaseUrl : "unknown";

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

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Configurações</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Gerencie sua segurança, preferências e diagnósticos de IA.</p>
            </div>

            {showSuccess && (
                <div className="fixed top-24 right-8 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-spring-in z-50 font-bold border border-white/20">
                    <span className="material-icons-round">check_circle</span>
                    Alterações salvas com sucesso!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Navigation Sidebar (Visual only) */}
                <div className="md:col-span-1 space-y-2">
                    {[
                        { icon: 'security', label: 'Segurança', active: true },
                        { icon: 'notifications', label: 'Notificações' },
                        { icon: 'psychology', label: 'Diagnóstico IA' },
                        { icon: 'delete_forever', label: 'Exclusão', color: 'text-red-500' },
                    ].map((item, idx) => (
                        <button key={idx} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20 font-black' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 font-bold'}`}>
                            <span className={`material-icons-round ${item.color || ''}`}>{item.icon}</span>
                            <span className="text-sm uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="md:col-span-2 space-y-8">
                    {/* Security Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border/50 p-10 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <span className="material-icons-round">shield</span>
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Segurança e Acesso</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 transition-all hover:shadow-md group">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Senha da Conta</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Mantenha suas credenciais protegidas.</p>
                                </div>
                                <button
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all active:scale-95"
                                >
                                    Alterar
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 group">
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Alertas de Candidatos</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Notificar quando novos perfis derem match.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked readOnly className="sr-only peer" />
                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="w-full p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30 flex items-center justify-between group hover:bg-red-100 dark:hover:bg-red-900/20 transition-all">
                                <div className="text-left">
                                    <h3 className="font-bold text-red-600 dark:text-red-400">Excluir Minha Conta</h3>
                                    <p className="text-xs text-red-500/70 dark:text-red-400/60 font-medium">Esta ação é irreversível e apagará todos os seus dados.</p>
                                </div>
                                <span className="material-icons-round text-red-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
                            </button>
                        </div>
                    </section>

                    {/* AI Diagnostics Section */}
                    {(process.env.NODE_ENV === 'development' || user.role === 'ADMIN' || user.email === 'joaohenriquee89@gmail.com') && (
                        <section className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center">
                                    <span className="material-icons-round">psychology</span>
                                </div>
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">Laboratório de IA</h2>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                    Verifique a integridade operacional do motor de inteligência artificial e conectividade com a rede neural da Talentoshop.
                                </p>

                                <div className="flex flex-col gap-6">
                                    <button
                                        onClick={runAiTest}
                                        disabled={aiStatus === 'loading'}
                                        className="w-fit px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 shadow-xl"
                                    >
                                        {aiStatus === 'loading' && <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>}
                                        TESTAR CONEXÃO
                                    </button>

                                    {aiResult && (
                                        <div className={`p-6 rounded-3xl border text-xs font-mono animate-fade-in ${aiResult.fallback ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                                            aiResult.status === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
                                                'bg-red-500/10 border-red-500/20 text-red-200'
                                            }`}>
                                            <div className="flex items-center gap-2 font-black mb-4 uppercase tracking-widest text-[10px]">
                                                <span className={`w-2 h-2 rounded-full ${aiResult.status === 'ok' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
                                                {aiResult.status === 'ok' ? 'Sistema Online' : 'Falla de Resposta'}
                                            </div>
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                                <p><span className="opacity-50">Status:</span> {aiResult.status}</p>
                                                <p><span className="opacity-50">Latência:</span> {aiResult.latency || 'N/A'}</p>
                                                <p className="col-span-2"><span className="opacity-50">Endpoint:</span> {aiResult.edge || 'TalentoShop Network'}</p>
                                            </div>
                                            {aiResult.details && <div className="mt-4 pt-4 border-t border-white/5 opacity-60 overflow-hidden line-clamp-1">{aiResult.details}</div>}
                                        </div>
                                    )}
                                </div>
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
