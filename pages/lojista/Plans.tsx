import React, { useState } from 'react';
import { createCheckout } from '../../src/lib/api';

const Plans: React.FC = () => {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!selectedPlan) return;
        setIsLoading(true);

        let price = 0;
        let planInternalValid = false;
        let planCode = '';

        if (selectedPlan === 'Plano ESSENCIAL') {
            price = 49.90;
            planCode = 'STANDARD';
            planInternalValid = true;
        } else if (selectedPlan === 'Lojista Premium') {
            price = 99.90;
            planCode = 'PRO';
            planInternalValid = true;
        }

        if (!planInternalValid) {
            alert('Plano inválido selecionado.');
            setIsLoading(false);
            return;
        }

        try {
            const data = await createCheckout(planCode, price, `Assinatura ${selectedPlan} `);
            console.log("Dados recebidos da função (Plans):", data);
            if (data && data.url) {
                window.location.href = data.url;
            } else {
                console.warn("URL não recebida no Plans:", data);
            }
        } catch (error: any) {
            console.error(error);
            // MODIFICAÇÃO DE DEBUG: Mostrar erro real na tela
            console.error("Erro detalhado:", error);
            alert(`Erro no pagamento: ${JSON.stringify(error)}`);
        } finally {
            setIsLoading(false);
            setShowUpgradeModal(false);
        }
    };


    const plans = [
        {
            name: 'Básico (Grátis)',
            price: 'R$ 0',
            period: '/mês',
            features: [
                '1 Vaga ativa',
                'Banco de talentos básico',
                'Sem IA'
            ],
            active: true,
            button: 'Plano Atual',
            recommended: false,
            action: () => { }
        },
        {
            name: 'Plano ESSENCIAL',
            description: 'Contrate melhor',
            price: 'R$ 49,90',
            period: '/mês',
            subText: 'Encontre vendedores com mais rapidez e menos erro.',
            featuresHeader: 'Tudo do FREE +',
            features: [
                'Busca com ajuda da IA (padrão)',
                'Filtros por experiência, shopping, setor e habilidades',
                'Acesso completo aos perfis',
                'Mais precisão na escolha do candidato'
            ],
            footerText: '🎯 Perfeito para quem quer acertar mais na contratação.',
            active: false,
            button: 'Contratar Equipe',
            recommended: false,
            action: () => {
                setSelectedPlan('Plano ESSENCIAL');
                setShowUpgradeModal(true);
            }
        },
        {
            name: 'Lojista Premium',
            price: 'R$ 99,90',
            period: '/mês',
            features: [
                'Vagas ilimitadas',
                'Match IA completo'
            ],
            active: false,
            button: 'Acesso Total + IA',
            recommended: true,
            action: () => {
                setSelectedPlan('Lojista Premium');
                setShowUpgradeModal(true);
            }
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in relative max-w-6xl mx-auto">
            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                        <button
                            onClick={() => setShowUpgradeModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <span className="material-icons-round">close</span>
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-icons-round text-3xl text-primary">rocket_launch</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade para {selectedPlan}</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Você está a um passo de transformar suas contratações com o plano <span className="font-bold text-primary">{selectedPlan}</span>.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-petrol-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processando...' : 'Confirmar Upgrade'}
                            </button>
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                disabled={isLoading}
                                className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Talvez depois
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <span className="material-icons-round text-sm">lock</span>
                            Pagamento processado com segurança via Mercado Pago
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Escolha o plano ideal</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Desbloqueie todo o potencial da nossa IA para encontrar os melhores vendedores.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {plans.map((plan, idx) => (
                    <div key={idx} className={`relative bg-white dark:bg-slate-900 rounded-3xl p-8 border transition-all duration-300 hover:shadow-soft ${plan.recommended ? 'border-primary shadow-soft ring-1 ring-primary/20 scale-105 z-10' : 'border-slate-200 dark:border-slate-800 shadow-premium'} flex flex-col`}>
                        {plan.recommended && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
                                <span className="material-icons-round text-base">star</span>
                                Recomendado
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className={`text-2xl font-bold mb-1 ${plan.recommended ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>{plan.name}</h3>
                            {plan.description && <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{plan.description}</p>}
                        </div>

                        <div className="flex flex-col mb-8">
                            <div className="flex items-baseline">
                                <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                                <span className="text-gray-500 dark:text-gray-400 ml-2 text-lg">{plan.period}</span>
                            </div>
                            {plan.subText && <p className="text-sm text-primary font-medium mt-2 leading-snug">{plan.subText}</p>}
                        </div>

                        <div className="flex-1">
                            {plan.featuresHeader && <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{plan.featuresHeader}</p>}
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-base text-gray-600 dark:text-gray-300">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${plan.recommended ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
                                            <span className="material-icons-round text-base">check</span>
                                        </div>
                                        <span className="leading-tight">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                            {plan.footerText && <p className="text-sm font-medium text-gray-500 dark:text-gray-400 italic mb-6 border-t border-dashed border-gray-200 dark:border-gray-700 pt-4">{plan.footerText}</p>}
                        </div>

                        <button
                            onClick={plan.action}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${plan.recommended ? 'bg-primary text-white hover:bg-petrol-700 shadow-xl shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                            {plan.button}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;
