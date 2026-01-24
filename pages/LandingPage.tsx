
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
    <div className="pt-20 bg-background dark:bg-[#0A0A0A] min-h-screen">
      {/* ASYMMETRIC BRUTALIST HERO - 90/10 SPLIT */}
      <section ref={heroRef} className="relative overflow-hidden min-h-screen flex items-center">
        {/* Grain Texture Overlay (90% dead space) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"></div>

        {/* Massive Typography - Left 10% */}
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
          <div className="relative z-10 max-w-2xl">
            {/* IA Badge - Pulsing Glow */}
            <div className="inline-flex items-center px-6 py-3 bg-black dark:bg-white/5 border-2 border-primary mb-12 animate-pulse-glow">
              <span className="flex h-3 w-3 relative mr-4">
                <span className="animate-ping absolute inline-flex h-full w-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 bg-secondary"></span>
              </span>
              <span className="text-xs font-bold tracking-[0.3em] text-primary uppercase">INTELIGÊNCIA ARTIFICIAL ATIVA</span>
            </div>

            {/* MASSIVE H1 - Overlapping Layers */}
            <div className="relative mb-16">
              <h1 className="text-[clamp(4rem,12vw,14rem)] font-bold leading-[0.9] tracking-tighter text-foreground scroll-reveal opacity-0">
                O FUTURO
                <br />
                <span className="relative inline-block">
                  DO <span className="text-primary italic">VAREJO</span>
                  {/* Overlapping "IA" */}
                  <span className="absolute -right-32 -top-20 text-[clamp(8rem,20vw,24rem)] text-accent opacity-20 -z-10 font-black">
                    IA
                  </span>
                </span>
              </h1>
            </div>

            {/* Subtitle - Constrained Width */}
            <p className="text-xl md:text-2xl text-foreground/70 max-w-xl mb-16 leading-relaxed scroll-reveal opacity-0 [animation-delay:200ms]">
              A plataforma definitiva que une <span className="text-primary font-bold">talentos de vendas</span> e <span className="text-secondary font-bold">lojistas de alta performance</span>. Recrutamento inteligente para resultados extraordinários.
            </p>

            {/* CTA Buttons - Stacked Asymmetry */}
            <div className="flex flex-col gap-6 max-w-md scroll-reveal opacity-0 [animation-delay:400ms]">
              <Link
                to="/register/lojista"
                className="group relative px-12 py-6 bg-primary text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/50"
              >
                <span className="relative z-10 flex items-center justify-between">
                  SOU LOJISTA
                  <span className="material-icons-round text-2xl ml-4 group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
                </span>
                <div className="absolute inset-0 bg-accent transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </Link>

              <Link
                to="/register/vendedor"
                className="px-12 py-6 bg-transparent border-4 border-foreground text-foreground font-bold text-lg hover:bg-foreground hover:text-background transition-all hover:scale-105"
              >
                SOU VENDEDOR
              </Link>
            </div>

            {/* Trust Badges - Minimal */}
            <div className="flex items-center gap-12 mt-24 opacity-30 hover:opacity-100 transition-opacity scroll-reveal opacity-0 [animation-delay:600ms]">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-primary text-2xl">security</span>
                <span className="font-bold text-sm tracking-wider">SECURITY</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-secondary text-2xl">verified</span>
                <span className="font-bold text-sm tracking-wider">VERIFIED</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-accent text-2xl">payments</span>
                <span className="font-bold text-sm tracking-wider">SECURE</span>
              </div>
            </div>
          </div>

          {/* Dead Space Indicator (90% right side) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] h-full pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center opacity-5">
              <span className="text-[clamp(20rem,40vw,60rem)] font-black text-foreground/5 tracking-tighter leading-none">
                TS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FRAGMENTED BENTO - Features */}
      <section id="features" className="py-32 bg-foreground/5 relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Section Header - Off-center */}
          <div className="max-w-2xl mb-24">
            <h2 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              POR QUE <span className="text-primary">TALENTOSHOP</span>?
            </h2>
            <p className="text-xl text-foreground/60">
              Unimos tecnologia de ponta com a necessidade humana de conexão.
            </p>
          </div>

          {/* Fragmented Grid - Intentionally Misaligned */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Feature 1 - Large */}
            <div className="md:col-span-7 md:row-span-2 bg-primary p-12 text-white group hover:scale-[1.02] transition-transform scroll-reveal opacity-0">
              <div className="h-20 w-20 bg-white/20 flex items-center justify-center mb-8">
                <span className="material-icons-round text-5xl">psychology</span>
              </div>
              <h3 className="text-4xl font-bold mb-6">MATCH COM IA</h3>
              <p className="text-xl text-white/80 leading-relaxed">
                Algoritmos avançados que entendem o DNA da sua loja e sugerem os candidatos perfeitos. Precisão de 98% em compatibilidade.
              </p>
            </div>

            {/* Feature 2 - Medium */}
            <div className="md:col-span-5 bg-secondary p-12 text-black group hover:scale-[1.02] transition-transform scroll-reveal opacity-0 [animation-delay:200ms]">
              <div className="h-16 w-16 bg-black/10 flex items-center justify-center mb-6">
                <span className="material-icons-round text-4xl">verified</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">CURADORIA ELITE</h3>
              <p className="text-lg text-black/70">
                Processos de validação rigorosos para garantir que apenas os melhores profissionais estejam na rede.
              </p>
            </div>

            {/* Feature 3 - Medium */}
            <div className="md:col-span-5 bg-accent p-12 text-black group hover:scale-[1.02] transition-transform scroll-reveal opacity-0 [animation-delay:400ms]">
              <div className="h-16 w-16 bg-black/10 flex items-center justify-center mb-6">
                <span className="material-icons-round text-4xl">rocket_launch</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">ESCALA RÁPIDA</h3>
              <p className="text-lg text-black/70">
                Ferramentas desenhadas para acompanhar o crescimento do seu negócio, de uma loja a grandes redes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL - Asymmetric Layout */}
      <section className="py-32 bg-background dark:bg-[#0A0A0A] relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Quote - 7 columns */}
            <div className="lg:col-span-7 relative">
              <div className="absolute -top-20 -left-12 text-primary/10 transform -rotate-12">
                <span className="material-icons-round text-[300px]">format_quote</span>
              </div>
              <h4 className="text-5xl md:text-6xl font-bold text-foreground mb-12 leading-tight relative z-10 scroll-reveal opacity-0">
                "A TRANSFORMAÇÃO QUE PRECISÁVAMOS PARA O NOSSO RECRUTAMENTO."
              </h4>
              <p className="text-2xl text-foreground/60 mb-16 leading-relaxed scroll-reveal opacity-0 [animation-delay:200ms]">
                Desde que implementamos a TalentoShop em nossa rede de franquias, o turnover caiu 45%. A IA realmente filtra o talento pelo DNA da marca.
              </p>
              <div className="flex items-center gap-8 scroll-reveal opacity-0 [animation-delay:400ms]">
                <div className="w-24 h-24 bg-primary/20 overflow-hidden border-4 border-primary">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Fernanda Siqueira" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-foreground">FERNANDA SIQUEIRA</p>
                  <p className="text-primary font-bold tracking-wider text-sm">DIRETORA DE RH - GRUPO RETAIL PRO</p>
                </div>
              </div>
            </div>

            {/* Stats - 5 columns - Staggered */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              <div className="bg-primary p-10 text-white scroll-reveal opacity-0 [animation-delay:600ms]">
                <p className="text-6xl font-black mb-3">+500</p>
                <p className="text-sm font-bold tracking-wider opacity-80">LOJAS CONECTADAS</p>
              </div>
              <div className="bg-secondary p-10 text-black mt-12 scroll-reveal opacity-0 [animation-delay:700ms]">
                <p className="text-6xl font-black mb-3">98%</p>
                <p className="text-sm font-bold tracking-wider opacity-80">MATCH DE SUCESSO</p>
              </div>
              <div className="bg-accent p-10 text-black -mt-6 scroll-reveal opacity-0 [animation-delay:800ms]">
                <p className="text-6xl font-black mb-3">+10K</p>
                <p className="text-sm font-bold tracking-wider opacity-80">CANDIDATOS ATIVOS</p>
              </div>
              <div className="bg-foreground p-10 text-background mt-12 scroll-reveal opacity-0 [animation-delay:900ms]">
                <p className="text-6xl font-black mb-3">#1</p>
                <p className="text-sm font-bold tracking-wider opacity-80">APP DE VAREJO</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
