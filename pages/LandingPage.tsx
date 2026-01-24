
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-spring-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pt-20 bg-background dark:bg-[#07090D] min-h-screen text-foreground transition-colors duration-500">
      {/* MODERN LUXURY HERO - CENTERED & BALANCED */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[90vh] flex items-center justify-center py-20">
        {/* Advanced Background Depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Glass Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/20 mb-10 scroll-reveal opacity-0 backdrop-blur-md">
            <span className="flex h-2 w-2 relative mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">TECNOLOGIA IA DE ELITE</span>
          </div>

          {/* Sophisticated H1 */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] scroll-reveal opacity-0 [animation-delay:100ms]">
            O Futuro do <span className="text-primary">Varejo</span><br />
            Conectado por <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-accent">Inteligência.</span>
          </h1>

          {/* Elegant Subtitle */}
          <p className="mt-8 text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-14 leading-relaxed scroll-reveal opacity-0 [animation-delay:200ms]">
            Liderando a nova era do comércio com recrutamento inteligente de alta performance. Onde talentos excepcionais encontram varejistas visionários.
          </p>

          {/* Action Hub - Premium Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 scroll-reveal opacity-0 [animation-delay:300ms]">
            <Link
              to="/register/lojista"
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Começar como Lojista
              <span className="material-icons-round">trending_up</span>
            </Link>
            <Link
              to="/register/vendedor"
              className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-white/5 text-foreground font-bold rounded-2xl border border-border hover:bg-white/50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              Painel do Vendedor
            </Link>
          </div>

          {/* Minimal Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-500 scroll-reveal opacity-0 [animation-delay:400ms]">
            <div className="flex items-center gap-2 group cursor-default">
              <span className="material-icons-round text-primary group-hover:scale-110 transition-transform">verified_user</span>
              <span className="font-bold tracking-tighter text-sm uppercase">Secure Protocol</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <span className="material-icons-round text-primary group-hover:scale-110 transition-transform">star</span>
              <span className="font-bold tracking-tighter text-sm uppercase">Curadoria Elite</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <span className="material-icons-round text-primary group-hover:scale-110 transition-transform">bolt</span>
              <span className="font-bold tracking-tighter text-sm uppercase">Match Instantâneo</span>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY FEATURE GRID */}
      <section id="features" className="py-32 bg-secondary/5 border-y border-border/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Excelência em cada <span className="text-primary italic">conexão</span>.</h2>
            <p className="text-foreground/50 text-lg">Tecnologia avançada para quem não aceita menos que o extraordinário.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: 'auto_awesome', title: 'Algoritmo de Elite', desc: 'Sistemas que aprendem o comportamento da sua loja para sugestões cirúrgicas.', color: 'primary' },
              { icon: 'shield', title: 'Validação Premium', desc: 'Candidatos verificados através de múltiplos pontos de confiança e experiência.', color: 'emerald' },
              { icon: 'speed', title: 'Resultados em Escala', desc: 'Infraestrutura desenhada para suportar operações de alta volumetria e expansão.', color: 'primary' }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 scroll-reveal opacity-0 backdrop-blur-sm" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:rotate-12 transition-transform shadow-inner">
                  <span className="material-icons-round text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-foreground/50 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESTIGE TESTIMONIAL */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden shadow-2xl backdrop-blur-xl group scroll-reveal opacity-0">
            {/* Visual Flare */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:bg-primary/10 transition-colors duration-700"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="material-icons-round text-primary text-6xl mb-8 opacity-40">format_quote</span>
                <blockquote className="text-3xl md:text-4xl font-bold leading-tight mb-10 tracking-tight">
                  "TalentoShop mudou o jogo para nossas lojas. Reduzimos o turnover pela metade em menos de um trimestre."
                </blockquote>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 overflow-hidden border-2 border-primary shadow-lg">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Executive" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Fernanda Siqueira</p>
                    <p className="text-primary text-sm font-bold tracking-widest uppercase">CEO • Grupo Retail Pro</p>
                  </div>
                </div>
              </div>

              {/* Staggered Prestige Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-background/50 p-8 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors">
                  <p className="text-4xl font-bold text-primary mb-1">+500</p>
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Unidades</p>
                </div>
                <div className="bg-background/50 p-8 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors mt-8">
                  <p className="text-4xl font-bold text-primary mb-1">98%</p>
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Match Rate</p>
                </div>
                <div className="bg-background/50 p-8 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors -mt-8">
                  <p className="text-4xl font-bold text-primary mb-1">+10k</p>
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Candidatos</p>
                </div>
                <div className="bg-background/50 p-8 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors">
                  <p className="text-4xl font-bold text-primary mb-1">#1</p>
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-32 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tight scroll-reveal opacity-0">Dê o próximo passo em sua <span className="text-primary">carreira</span>.</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 scroll-reveal opacity-0 [animation-delay:100ms]">
          <Link to="/register" className="px-12 py-5 bg-foreground text-background font-bold rounded-2xl hover:scale-105 transition-transform active:scale-95">
            Cadastrar Gratuitamente
          </Link>
          <Link to="/pricing" className="px-12 py-5 bg-white border border-border text-foreground font-bold rounded-2xl hover:bg-slate-50 transition-colors">
            Ver Planos Corporativos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
