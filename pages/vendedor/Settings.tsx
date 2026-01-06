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
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <img alt="Profile" className="h-32 w-32 rounded-full border-4 border-primary shadow-lg object-cover" src={currentAvatar} />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-icons-round text-white text-3xl">photo_camera</span>
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Clique na foto para alterar</p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                            <input
                                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                            <input
                                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
                            <input
                                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                                placeholder="Cidade"
                                value={formData.cidade}
                                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado (UF)</label>
                            <input
                                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                                placeholder="UF"
                                value={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-icons-round text-3xl text-gray-400 mb-2">picture_as_pdf</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Anexe seu currículo em PDF (opcional)</p>
                                <span className="text-xs text-primary mt-1 font-medium">Clique para upload</span>
                            </div>
                        </div>

                    </div>
                    <button onClick={handleSave} className="w-full bg-primary hover:bg-petrol-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95">
                        Salvar Alterações
                    </button>
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
            setResult({ error: err.message, status: 'client_error' });
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
