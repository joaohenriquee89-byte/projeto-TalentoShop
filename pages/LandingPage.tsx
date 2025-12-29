
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="pt-20 bg-background-light dark:bg-background-dark min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 dark:bg-primary/20"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10 dark:bg-secondary/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-32 lg:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-surface-dark border border-blue-100 dark:border-slate-700 mb-8 animate-fade-in-up shadow-sm">
              <span className="flex h-2 w-2 relative mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="text-sm font-medium text-primary dark:text-blue-300">Nova IA de busca inteligente disponível</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-8 text-slate-900 dark:text-white">
              Conexão inteligente para <br className="hidden md:block" />
              <span className="gradient-text">o varejo do futuro.</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              A plataforma definitiva que une talentos de vendas e lojistas de sucesso. Encontre a oportunidade ideal ou o profissional perfeito com ajuda da nossa Inteligência Artificial.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Role Card: Vendedor */}
              <Link to="/register/vendedor" className="group relative bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-icons-round text-8xl text-primary dark:text-blue-400">badge</span>
                </div>
                <div className="relative z-10">
                  <div className="h-12 w-12 bg-petrol-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-primary dark:text-blue-400">
                    <span className="material-icons-round">person_search</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sou Vendedor</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">Busque vagas em shoppings, cadastre seu currículo e deixe a IA encontrar as melhores oportunidades para você.</p>
                  <div className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary hover:bg-petrol-700 transition-colors shadow-md">
                    Encontrar Vagas
                    <span className="material-icons-round ml-2 text-sm">arrow_forward</span>
                  </div>
                </div>
              </Link>
              {/* Role Card: Lojista */}
              <Link to="/register/lojista" className="group relative bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-icons-round text-8xl text-secondary dark:text-green-400">storefront</span>
                </div>
                <div className="relative z-10">
                  <div className="h-12 w-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 text-secondary dark:text-green-400">
                    <span className="material-icons-round">store</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sou Lojista</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">Publique vagas, filtre candidatos com IA e monte o time de alta performance para sua loja.</p>
                  <div className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-secondary hover:bg-green-600 transition-colors shadow-md">
                    Contratar Talentos
                    <span className="material-icons-round ml-2 text-sm">arrow_forward</span>
                  </div>
                </div>
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-500 dark:text-slate-500">
              Comece gratuitamente. Não é necessário cartão de crédito.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 py-20 relative">
        <div className="absolute inset-0 hero-pattern z-0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center group">
              <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 text-primary dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-slate-700">
                <span className="material-icons-round text-3xl">psychology</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Match com IA</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-xs">Nossos algoritmos analisam perfis e culturas de loja para sugerir as conexões com maior chance de sucesso.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 text-secondary dark:text-green-400 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-slate-700">
                <span className="material-icons-round text-3xl">verified</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Perfis Verificados</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-xs">Segurança para todos. Lojistas e vendedores passam por validações para garantir a qualidade da rede.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 text-primary dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-slate-700">
                <span className="material-icons-round text-3xl">rocket_launch</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Escalabilidade</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-xs">De uma loja a grandes redes de franquias. Ferramentas de gestão para todos os tamanhos de negócio.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revolution Section */}
      <div className="py-24 bg-background-light dark:bg-background-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
          <h4 className="text-center font-display font-bold text-3xl text-slate-900 dark:text-white mb-12">Junte-se à revolução do varejo</h4>
          <div className="w-full relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <img alt="Ambiente de shopping moderno" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC515kVv17U-CBsd-CtDj8xUq3iRs13yoCKUUwFmzlAoO7iNge4KEfU9bQfXyW-P3RKnWCXOD-a20USN1d2e1_tYYgxUzIC0jQIONAhRXKu0lqaI7tooczjeppYKp873xAOSSNwMayxyUzlCT7GZRg1gtXGXkZW9Yd4mNx33XQ0xJ8Grh_n-qNAw9kf78yfUbhp-yuQQgyYbIdI_BdockEj9S628kZz8-XEUQr4_gHEwyOSjx36lmzZVCCaQETPOOwz7eS1XZW-l24" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end px-8 py-12 md:px-16 md:py-20">
              <div className="text-white max-w-2xl">
                <div className="flex text-secondary mb-4">
                  <span className="material-icons-round">star</span>
                  <span className="material-icons-round">star</span>
                  <span className="material-icons-round">star</span>
                  <span className="material-icons-round">star</span>
                  <span className="material-icons-round">star</span>
                </div>
                <p className="text-xl md:text-2xl font-medium italic leading-relaxed">"A TalentoShop simplificou nosso processo de contratação em 80%. A IA realmente entende o perfil que precisamos para cada loja."</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="bg-white/10 p-2 rounded-full">
                    <span className="material-icons-round text-white">store</span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Fernanda Oliveira</p>
                    <p className="text-slate-300 text-sm">Gerente de Franquias, SP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
