import React, { useRef, useState } from 'react';
import { User } from '../../types';
import { supabase } from '../../src/lib/supabase';

interface SettingsProps {
    user: User;
    setUser: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser }) => {
    const [showSuccess, setShowSuccess] = useState(false);

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
                fallback: true // Client side fallback perception
            });
        } finally {
            setAiStatus('done');
        }
    };

    const handleSave = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    // Avatar editing removed from Settings (moved to Profile)


    const currentAvatar = user.avatar || `https://picsum.photos/seed/${user.id}/200/200`;

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Configurações da Conta</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Gerencie acesso, segurança e preferências do sistema</p>

            {showSuccess && (
                <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce-in z-50">
                    <span className="material-icons-round">check_circle</span>
                    Alterações salvas com sucesso!
                </div>
            )}

            <div className="bg-surface-light dark:bg-surface-dark shadow rounded-xl p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-icons-round text-primary">manage_accounts</span>
                    Segurança e Acesso
                </h2>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">Senha do Sistema</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Alterar sua senha de acesso</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            Alterar Senha
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">Notificações</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Gerenciar alertas de novos candidatos</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked readOnly className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                        <div>
                            <h3 className="font-semibold text-red-700 dark:text-red-400">Zona de Perigo</h3>
                            <p className="text-sm text-red-500 dark:text-red-500/80">Excluir conta permanentemente</p>
                        </div>
                        <button className="px-4 py-2 text-red-600 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                            Excluir Conta
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Diagnostics Section (Dev Only) */}
            {(process.env.NODE_ENV === 'development' || user.email === 'joaohenriquee89@gmail.com') && (
                <div className="mt-8 bg-surface-light dark:bg-surface-dark shadow rounded-xl p-8 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-icons-round text-secondary">psychology</span>
                        Diagnóstico de IA
                    </h2>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Verifique a conectividade com o módulo de Inteligência Artificial para garantir que o ranqueamento de candidatos esteja funcionando.
                        </p>

                        <div className="flex gap-4 items-start">
                            <button
                                onClick={runAiTest}
                                disabled={aiStatus === 'loading'}
                                className="px-4 py-2 bg-secondary text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {aiStatus === 'loading' ? (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <span className="material-icons-round text-sm">play_arrow</span>
                                )}
                                Executar Health Check
                            </button>

                            {aiResult && (
                                <div className={`flex-1 p-4 rounded-lg border text-sm font-mono animate-fade-in ${aiResult.fallback ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200' :
                                    aiResult.status === 'ok' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200' :
                                        'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
                                    }`}>
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        <span>
                                            {aiResult.status === 'ok' ? 'Sistema Operacional' : 'Erro no Sistema'}
                                        </span>
                                    </div>
                                    <p className="mb-1"><strong>Status:</strong> {aiResult.status}</p>
                                    <p className="mb-1"><strong>Edge:</strong> {aiResult.edge}</p>
                                    <p className="mb-1"><strong>Provider:</strong> {aiResult.provider} ({aiResult.provider_config})</p>
                                    {aiResult.latency && <p className="mb-1"><strong>Latência:</strong> {aiResult.latency}</p>}
                                    {aiResult.details && <p className="mt-2 text-xs opacity-80 border-t border-black/10 pt-1">Debug: {aiResult.details}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
