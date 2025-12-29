
import React from 'react';
import { Link } from 'react-router-dom';

const LimitPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-2xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden">
        <div className="h-2 w-full bg-secondary"></div>
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 mb-6">
            <span className="material-icons-outlined text-4xl text-red-500">lock_clock</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">Limite Mensal Atingido</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Sua conta <span className="font-semibold text-primary">Plano Start</span> já utilizou todas as buscas com IA disponíveis para este mês.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8 text-left border border-slate-100">
             <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
               <span className="material-icons-outlined text-secondary text-sm">check_circle</span>
               Desbloqueie o poder total
             </h3>
             <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
               <li>• Buscas ilimitadas com Inteligência Artificial</li>
               <li>• Acesso prioritário a novos lojistas</li>
               <li>• Relatórios avançados de compatibilidade</li>
             </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing" className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2">
              <span className="material-icons-outlined">rocket_launch</span>
              Fazer Upgrade Agora
            </Link>
            <button className="px-8 py-3 border border-slate-300 text-slate-700 dark:text-slate-300 font-medium rounded-lg">Falar com Suporte</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitPage;
