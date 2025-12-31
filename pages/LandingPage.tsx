
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="pt-20 bg-background dark:bg-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 mb-8 animate-fade-in-up backdrop-blur-sm">
              <span className="flex h-2 w-2 relative mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 uppercase">Inteligência Artificial Ativa</span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white text-balance leading-[1.1]">
              O Futuro do <span className="text-primary italic">Varejo</span> <br className="hidden md:block" />
              Conectado por <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">IA.</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed text-balance">
              A plataforma definitiva que une talentos de vendas e lojistas de alta performance. Recrutamento inteligente para resultados extraordinários.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/register/lojista" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-soft hover:shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Sou Lojista
                <span className="material-icons-round text-xl">arrow_right_alt</span>
              </Link>
              <Link to="/register/vendedor" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold rounded-2xl shadow-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Sou Vendedor
              </Link>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2 font-display font-bold text-xl"><span className="material-icons-round text-primary">security</span> SecurityPass</div>
              <div className="flex items-center gap-2 font-display font-bold text-xl"><span className="material-icons-round text-secondary">verified</span> TrustRecruit</div>
              <div className="flex items-center gap-2 font-display font-bold text-xl"><span className="material-icons-round text-slate-400">payments</span> MP Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Features */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 italic">Por que escolher a TalentoShop?</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">Unimos tecnologia de ponta com a necessidade humana de conexão.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: 'psychology', title: 'Match com IA', desc: 'Algoritmos avançados que entendem o DNA da sua loja e sugerem os candidatos perfeitos.', color: 'primary' },
              { icon: 'verified', title: 'Curadoria Elite', desc: 'Processos de validação rigorosos para garantir que apenas os melhores profissionais estejam na rede.', color: 'secondary' },
              { icon: 'rocket_launch', title: 'Escala Rápida', desc: 'Ferramentas desenhadas para acompanhar o crescimento do seu negócio, de uma loja a grandes redes.', color: 'primary' }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-900 hover:shadow-soft transition-all duration-300">
                <div className={`h-16 w-16 rounded-2xl bg-${f.color}/10 flex items-center justify-center mb-8 text-${f.color} group-hover:scale-110 transition-transform`}>
                  <span className="material-icons-round text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">"{f.desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background dark:bg-slate-950 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-12 -left-12 text-slate-200 dark:text-slate-800 opacity-20 transform -rotate-12">
                <span className="material-icons-round text-[200px]">format_quote</span>
              </div>
              <h4 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                "A transformação que precisávamos para o nosso recrutamento."
              </h4>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                Desde que implementamos a TalentoShop em nossa rede de franquias, o turnover caiu 45%. A IA realmente filtra o talento pelo DNA da marca.
              </p>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                  <img src="https://i.pravatar.cc/150?u=fernanda" alt="CEO" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-xl text-slate-900 dark:text-white italic">Fernanda Siqueira</p>
                  <p className="text-primary font-medium tracking-wide">Diretora de RH - Grupo Retail Pro</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-800 mt-12">
                <p className="text-4xl font-bold text-primary mb-2">+500</p>
                <p className="text-slate-500 font-medium">Lojas Conectadas</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-800">
                <p className="text-4xl font-bold text-secondary mb-2">98%</p>
                <p className="text-slate-500 font-medium">Match de Sucesso</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-800">
                <p className="text-4xl font-bold text-primary mb-2">+10k</p>
                <p className="text-slate-500 font-medium">Candidatos Ativos</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-premium border border-slate-100 dark:border-slate-800 -mt-12">
                <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">#1</p>
                <p className="text-slate-500 font-medium">App de Varejo</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
