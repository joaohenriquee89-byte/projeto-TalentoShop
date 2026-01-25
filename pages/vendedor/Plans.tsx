import React, { useState } from 'react';
import { createCheckout } from '../../src/lib/api';

const VendedorPlans: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const data = await createCheckout('PRO_VENDEDOR', 9.90, 'Assinatura PRO Vendedor');
            if (data && data.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            console.error("Erro no pagamento:", error);
            alert(`Erro no pagamento: Ocorreu um problema ao iniciar o checkout.`);
        } finally {
            setIsLoading(false);
        }
    };

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            tagline: 'O essencial para começar',
            price: 'Grátis',
            period: '',
            features: [
                'Perfil profissional básico',
                'Visualização padrão de vagas',
                'Candidaturas manuais'
            ],
            status: 'Plano Atual',
            isCurrent: true,
            buttonClass: 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-default'
        },
        {
            id: 'pro',
            name: 'Plano PRO',
            tagline: 'Visibilidade máxima de elite',
            price: '9,90',
            period: '/mês',
            highlight: 'RECOMENDADO',
            features: [
                'Busca inteligente com IA',
                'Prioridade absoluta nas buscas',
                'Perfil com selo de verificado',
                'Candidaturas ilimitadas',
                'Acesso a salários e benefícios'
            ],
            status: 'CONTRATAR AGORA',
            isCurrent: false,
            recommended: true,
            buttonClass: 'bg-primary text-white hover:bg-emerald-400 shadow-xl shadow-primary/20 hover:-translate-y-1'
        }
    ];

    return (
        <div className="space-y-16 animate-fade-in max-w-5xl mx-auto py-12 px-4">
            {/* Header Section */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    Sua Carreira • Seu Futuro
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                    Destaque-se na <span className="text-secondary italic">Vitrine</span>.
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                    Vendedores Pro são contratados até 4x mais rápido pelas grandes marcas de shoppings.
                </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch pt-8 max-w-4xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`group relative bg-white dark:bg-slate-900 rounded-[3rem] p-10 border transition-all duration-500 flex flex-col ${plan.recommended
                                ? 'border-primary ring-[8px] ring-primary/5 shadow-2xl scale-[1.05] z-10'
                                : 'border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2'
                            }`}
                    >
                        {plan.recommended && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 z-20">
                                <span className="material-icons-round text-base">verified</span>
                                MAIS POPULAR
                            </div>
                        )}

                        <div className="space-y-2 mb-10">
                            <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${plan.recommended ? 'text-primary' : 'text-slate-400'}`}>
                                {plan.name}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed">{plan.tagline}</p>
                        </div>

                        <div className="flex flex-col mb-12">
                            <div className="flex items-baseline gap-1">
                                {plan.price !== 'Grátis' && <span className="text-sm font-black text-slate-400 dark:text-slate-500 self-start mt-2">R$</span>}
                                <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {plan.price}
                                </span>
                                <span className="text-slate-400 font-bold ml-1 text-xs">{plan.period}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 mb-12 text-center sm:text-left">
                            <div className="w-full h-px bg-slate-100 dark:bg-white/5"></div>
                            <ul className="space-y-5">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-4 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${plan.recommended ? 'bg-primary/10 text-primary' : 'bg-slate-50 dark:bg-white/5 text-slate-400'
                                            }`}>
                                            <span className="material-symbols-rounded text-base font-black">check</span>
                                        </div>
                                        <span className="leading-tight pt-0.5">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            disabled={plan.isCurrent || isLoading}
                            onClick={handleUpgrade}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-lg ${plan.buttonClass}`}
                        >
                            {plan.status}
                        </button>
                    </div>
                ))}
            </div>

            {/* Bottom Proof Section */}
            <div className="pt-20 border-t border-slate-100 dark:border-white/5 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">PAGUE COM SEGURANÇA VIA MERCADO PAGO</p>
                <div className="flex justify-center items-center gap-10 opacity-40 grayscale">
                    <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" className="h-4 object-contain" alt="Mercado Pago" />
                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10"></div>
                    <span className="material-icons-round text-3xl">shield</span>
                </div>
            </div>
        </div>
    );
};

export default VendedorPlans;