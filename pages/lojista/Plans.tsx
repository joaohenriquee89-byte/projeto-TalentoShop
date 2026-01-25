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
            if (data && data.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error("Erro no pagamento:", error);
            alert(`Erro no pagamento: Ocorreu um problema ao iniciar o checkout.`);
        } finally {
            setIsLoading(false);
            setShowUpgradeModal(false);
        }
    };

    const plans = [
        {
            id: 'free',
            name: 'Básico (Grátis)',
            price: '0',
            period: '/mês',
            features: [
                { text: '1 Vaga ativa simultânea', icon: 'campaign' },
                { text: 'Banco de talentos básico', icon: 'database' },
                { text: 'Sem IA (Busca manual)', icon: 'block' }
            ],
            status: 'Plano Atual',
            isCurrent: true,
            buttonClass: 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-default'
        },
        {
            id: 'standard',
            name: 'Plano ESSENCIAL',
            tagline: 'O salto de qualidade',
            price: '49,90',
            period: '/mês',
            highlight: 'TUDO DO FREE +',
            features: [
                { text: 'IA Padrão (Filtros Básicos)', icon: 'psychology' },
                { text: 'Acesso completo aos perfis', icon: 'visibility' },
                { text: 'Filtros Pro (Setor/Habilidades)', icon: 'tune' },
                { text: 'Mais precisão na escolha', icon: 'verified' }
            ],
            status: 'CONTRATAR AGORA',
            isCurrent: false,
            recommended: false,
            buttonClass: 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:shadow-xl hover:-translate-y-1'
        },
        {
            id: 'pro',
            name: 'Lojista Premium',
            tagline: 'Experiência ilimitada',
            price: '99,90',
            period: '/mês',
            highlight: 'ELITE SELECTION',
            features: [
                { text: 'Vagas ilimitadas', icon: 'all_inclusive' },
                { text: 'Match IA Completo (99% دقت)', icon: 'auto_awesome' },
                { text: 'Destaque nas buscas de talentos', icon: 'star' },
                { text: 'Suporte VIP dedicado', icon: 'support_agent' }
            ],
            status: 'ACESSO TOTAL + IA',
            isCurrent: false,
            recommended: true,
            buttonClass: 'bg-primary text-white hover:bg-emerald-400 shadow-xl shadow-primary/20 hover:-translate-y-1'
        }
    ];

    return (
        <div className="space-y-16 animate-fade-in max-w-7xl mx-auto py-10 px-4">
            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => !isLoading && setShowUpgradeModal(false)}></div>
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-lg w-full p-10 border border-white/10 relative overflow-hidden animate-scale-in z-10">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <span className="material-icons-round text-9xl">rocket_launch</span>
                        </div>

                        <div className="relative z-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                                <span className="material-icons-round text-4xl">upgrade</span>
                            </div>

                            <div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Upgrade de Elite</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    Você está prestes a desbloquear o plano <span className="text-primary font-black uppercase tracking-widest text-sm">{selectedPlan}</span>.
                                    Prepare-se para uma nova era de contratações.
                                </p>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleUpgrade}
                                    disabled={isLoading}
                                    className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 text-xs uppercase tracking-[0.2em]"
                                >
                                    {isLoading ? 'INICIANDO CHECKOUT...' : 'CONFIRMAR E PAGAR'}
                                </button>
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    disabled={isLoading}
                                    className="w-full bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white font-black py-3 text-[10px] uppercase tracking-widest transition-colors"
                                >
                                    TALVEZ MAIS TARDE
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-4">
                                <span className="material-icons-round text-emerald-500 text-sm">enhanced_encryption</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conexão Segura Mercado Pago</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-fade-in">
                    Assinaturas & Escala
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                    O Plano <span className="text-primary italic">Ideal</span> para o seu Negócio.
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                    Desbloqueie o poder da nossa IA Preditiva e encontre os talentos que sua marca merece.
                </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`group relative bg-white dark:bg-slate-900 rounded-[3rem] p-10 border transition-all duration-500 flex flex-col ${plan.recommended
                                ? 'border-primary ring-[6px] ring-primary/5 shadow-2xl scale-[1.02] z-10'
                                : 'border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2'
                            }`}
                    >
                        {plan.recommended && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 z-20">
                                <span className="material-icons-round text-base">auto_awesome</span>
                                Mais Popular
                            </div>
                        )}

                        <div className="space-y-2 mb-10">
                            <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${plan.recommended ? 'text-primary' : 'text-slate-400'}`}>
                                {plan.name}
                            </h3>
                            {plan.tagline && (
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">{plan.tagline}</p>
                            )}
                        </div>

                        <div className="flex flex-col mb-12">
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-black text-slate-400 dark:text-slate-500 self-start mt-2">R$</span>
                                <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {plan.price}
                                </span>
                                <span className="text-slate-400 font-bold ml-1 text-xs">{plan.period}</span>
                            </div>
                            {plan.highlight && (
                                <div className="mt-4 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-lg w-fit text-[9px] font-black text-slate-500 uppercase tracking-widest italic">
                                    {plan.highlight}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-6 mb-12">
                            <div className="w-full h-px bg-slate-100 dark:bg-white/5"></div>
                            <ul className="space-y-5">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${plan.recommended ? 'bg-primary/10 text-primary' : 'bg-slate-50 dark:bg-white/5 text-slate-400'
                                            }`}>
                                            <span className="material-icons-round text-base">{(feat as any).icon || 'check'}</span>
                                        </div>
                                        <span className="leading-tight pt-0.5">{feat.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            disabled={plan.isCurrent || isLoading}
                            onClick={() => {
                                if (plan.isCurrent) return;
                                setSelectedPlan(plan.name);
                                setShowUpgradeModal(true);
                            }}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-lg ${plan.buttonClass}`}
                        >
                            {plan.status}
                        </button>

                        {plan.recommended && (
                            <p className="mt-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                Acesso imediato após confirmação
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Proof Section */}
            <div className="pt-20 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="text-center md:text-left">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Segurança Garantida</h4>
                    <div className="flex items-center gap-6">
                        <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" className="h-4 object-contain" alt="Mercado Pago" />
                        <div className="w-px h-6 bg-slate-200 dark:bg-white/10"></div>
                        <span className="text-[10px] font-bold text-slate-500">Criptografia SSL de 256 bits</span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {/* Placeholder for real partner logos/trust badges */}
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-primary text-xl">verified</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verificado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-primary text-xl">speed</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ativação Instantânea</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Plans;
