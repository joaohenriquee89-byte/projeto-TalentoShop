import React, { useState } from 'react';
import { supabase } from '../../src/lib/supabase';

const VendedorPlans: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: { plan_name: 'Plano PRO', price: 9.90, title: 'Assinatura PRO' }
            });
            if (error) throw error;
            if (data?.init_point) window.location.href = data.init_point;
        } catch (err) {
            console.error(err);
            alert('Erro ao processar pagamento.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            {/* Cabeçalho - Controla a largura máxima */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    Escolha o plano ideal
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    Invista na sua carreira e tenha acesso a recursos exclusivos.
                </p>
            </div>

            {/* Grid de Cards - Centralizado e com tamanho controlado */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

                {/* Plano Grátis */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Basic (Free)</h2>
                    <div className="mb-6">
                        <span className="text-4xl font-bold dark:text-white">Grátis</span>
                    </div>
                    <ul className="text-slate-600 dark:text-slate-400 space-y-3 mb-8 flex-1">
                        <li>✓ Perfil básico</li>
                        <li>✓ Visualização limitada</li>
                        <li>✓ Candidaturas básicas</li>
                    </ul>
                    <button disabled className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl font-semibold cursor-not-allowed">
                        Plano Atual
                    </button>
                </div>

                {/* Plano PRO - Destaque */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border-2 border-blue-500 shadow-xl flex flex-col relative transform hover:scale-[1.02] transition-transform">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Recomendado
                    </div>
                    <h2 className="text-xl font-bold text-blue-600 mb-2">Plano PRO</h2>
                    <div className="mb-6">
                        <span className="text-4xl font-bold dark:text-white">R$ 9,90</span>
                        <span className="text-slate-500 text-sm">/mês</span>
                    </div>
                    <ul className="text-slate-600 dark:text-slate-400 space-y-3 mb-8 flex-1">
                        <li>✓ Busca inteligente com IA</li>
                        <li>✓ Prioridade nas buscas</li>
                        <li>✓ Perfil em destaque</li>
                        <li>✓ Acesso ilimitado</li>
                    </ul>
                    <button
                        onClick={handleUpgrade}
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                    >
                        {isLoading ? 'Processando...' : 'Fazer Upgrade Agora'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default VendedorPlans;