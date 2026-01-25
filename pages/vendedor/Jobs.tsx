import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VendedorJobs: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<'all' | 'open'>('all');

    // Placeholder for saved jobs. In a real scenario, this would be fetched from Supabase.
    const allSavedJobs = [
        /* 
        { 
            id: '1', 
            initial: 'Z', 
            title: 'Consultor de Vendas', 
            company: 'Zara', 
            location: 'Shopping Iguatemi', 
            status: 'Aberto', 
            date: '2 dias' 
        }
        */
    ];

    const filteredJobs = activeFilter === 'all'
        ? allSavedJobs
        : allSavedJobs.filter(job => job.status === 'Aberto');

    return (
        <div className="animate-fade-in max-w-5xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                        Favoritos <span className="text-primary italic">& Salvos</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">As melhores oportunidades que você selecionou.</p>
                </div>
                <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl p-1.5 flex shadow-inner">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeFilter === 'all'
                                ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-lg'
                                : 'text-slate-500 dark:text-slate-400 hover:text-primary'
                            }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setActiveFilter('open')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeFilter === 'open'
                                ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-lg'
                                : 'text-slate-500 dark:text-slate-400 hover:text-primary'
                            }`}
                    >
                        Abertas
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                        <div key={job.id} className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-primary/40 transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-2xl hover:-translate-y-1">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center font-black text-2xl text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-md group-hover:rotate-6">
                                    {job.initial}
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight mb-1">{job.title}</h3>
                                    <div className="flex items-center gap-3 text-sm font-bold opacity-60">
                                        <span className="text-primary">{job.company}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                        <span className="text-slate-500 dark:text-slate-400">{job.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-slate-50 dark:border-white/5">
                                <div className="text-right flex-1 md:flex-none">
                                    <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest mb-2 ${job.status === 'Aberto' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                                        {job.status}
                                    </span>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salvo há {job.date}</p>
                                </div>
                                <Link to={`/dashboard/vendedor/job/${job.id}`} className="p-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95">
                                    <span className="material-icons-round text-xl">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5 shadow-inner">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-[2.2rem] flex items-center justify-center mx-auto mb-8 rotate-12">
                            <span className="material-icons-round text-5xl text-slate-300">bookmarks</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">
                            {activeFilter === 'all' ? 'Sua vitrine de desejos' : 'Nenhuma vaga aberta salva'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                            {activeFilter === 'all'
                                ? 'Salve as vagas que mais combinam com você para analisar com calma e se candidatar depois.'
                                : 'As vagas que você salvou no momento estão com o processo encerrado ou em análise.'}
                        </p>
                        <Link to="/dashboard/vendedor" className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-emerald-400 transition-all active:scale-95 inline-flex items-center gap-3">
                            <span className="material-icons-round">category</span>
                            EXPLORAR OPORTUNIDADES
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendedorJobs;
