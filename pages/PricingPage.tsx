import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState<'vendedor' | 'lojista'>('lojista');

  const handleCheckout = async (planName: string, price: number, planCode: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate(`/login?redirect=/pricing`);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan_name: planName,
          price: price,
          title: `Assinatura ${planName}`
        }
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error("Erro no Checkout:", err);
    }
  };

  const pricingData = {
    lojista: [
      { name: 'Essencial', price: 49.90, code: 'STANDARD', desc: 'Para lojas individuais', features: ['1 Vaga ativa', 'Busca IA padrão', 'Filtros avançados'] },
      { name: 'Premium', price: 99.90, code: 'PRO', desc: 'Para redes e expansão', features: ['Vagas ilimitadas', 'Match IA completo', 'Destaque prioritário'], recommended: true }
    ],
    vendedor: [
      { name: 'Grátis', price: 0, code: 'FREE', desc: 'Comece agora', features: ['Perfil básico', 'Candidaturas limitadas', 'Sem IA'] },
      { name: 'PRO', price: 9.90, code: 'PRO_VENDEDOR', desc: 'Destaque-se na multidão', features: ['Match IA de vagas', 'Perfil verificado', 'Prioridade em buscas'], recommended: true }
    ]
  };

  return (
    <div className="pt-32 pb-24 bg-background dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-display font-extrabold text-slate-900 dark:text-white mb-6">Investimento que <span className="text-primary italic">gera retorno.</span></h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-12">Escolha o plano que melhor se adapta ao seu momento profissional no varejo.</p>

          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8">
            <button
              onClick={() => setRole('lojista')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${role === 'lojista' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Sou Lojista
            </button>
            <button
              onClick={() => setRole('vendedor')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${role === 'vendedor' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Sou Vendedor
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-${pricingData[role].length} gap-8 max-w-5xl mx-auto items-start`}>
          {pricingData[role].map((plan, i) => (
            <div key={i} className={`relative bg-white dark:bg-slate-900 p-8 rounded-3xl border transition-all hover:border-primary/50 group ${plan.recommended ? 'border-primary shadow-soft ring-1 ring-primary/20 bg-slate-50/30' : 'border-slate-200 dark:border-slate-800 shadow-premium'}`}>
              {plan.recommended && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Mais Popular</span>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">{plan.desc}</p>

              <div className="mb-8">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">/mês</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium">
                    <span className="material-icons-round text-primary text-lg">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.name, plan.price, plan.code)}
                className={`w-full py-4 rounded-2xl font-bold transition-all transform group-hover:-translate-y-1 ${plan.recommended ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {plan.price === 0 ? 'Plano Atual' : 'Escolher Plano'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;