import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { supabase } from '../../src/lib/supabase';

interface VendedorSettingsProps {
    user: User;
    setUser: (user: User) => void;
}

const VendedorSettings: React.FC<VendedorSettingsProps> = ({ user, setUser }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        bio: 'Vendedor com experiência em...',
        cidade: '',
        estado: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setUser({ ...user, avatar: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setUser({ ...user, ...formData });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const currentAvatar = user.avatar || `https://picsum.photos/seed/${user.id}/200/200`;

    return (
        <div className="max-w-3xl mx-auto animate-fade-in relative">

            {showSuccess && (
                <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce-in z-50">
                    <span className="material-icons-round">check_circle</span>
                    Alterações salvas com sucesso!
                </div>
            )}

            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Configurações da Conta</h1>

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
                            <p className="text-sm text-gray-500 dark:text-gray-400">Gerenciar alertas por e-mail e push</p>
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

            {/* AI Diagnostics Section */}
            <div className="mt-8 bg-surface-light dark:bg-surface-dark shadow rounded-xl p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-icons-round text-secondary">psychology</span>
                    Diagnóstico de IA
                </h2>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use este botão para testar a conectividade com o módulo de Inteligência Artificial e verificar se sua chave de API e plano estão sendo reconhecidos corretamente.
                    </p>

                    <AITester />
                </div>
            </div>
        </div>
    );
};

const AITester: React.FC = () => {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const url = supabase.supabaseUrl || "unknown";

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
                className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2 hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <span className="material-icons-round">play_arrow</span>}
                Executar Teste de IA
            </button>

            {result && (
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto border border-slate-700">
                    <pre className="text-green-400 font-mono text-sm leading-relaxed">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default VendedorSettings;
