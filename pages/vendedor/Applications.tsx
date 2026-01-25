import React from 'react';
import { Link } from 'react-router-dom';

const VendedorApplications: React.FC = () => {
    const applications: any[] = [];

    return (
        <div className="animate-fade-in max-w-5xl mx-auto py-10 px-4">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                    Minhas <span className="text-primary italic">Candidaturas</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                    Acompanhe em tempo real o progresso dos seus processos seletivos.
                </p>
            </div>

            <div className="space-y-8">
                {applications.length > 0 ? (
                    applications.map(app => (
                        <div key={app.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 p-8 transition-all hover:shadow-2xl hover:-translate-y-1">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-3xl shadow-inner">
                                        {app.initial}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">{app.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{app.company} • {app.location}</p>
                                    </div>
                                </div>
                                <div className="text-right w-full md:w-auto">
                                    <div className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                                        {app.status}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">{app.date}</p>
                                </div>
                            </div>

                            {/* Steps / Progress Line */}
                            <div className="relative px-4 pb-4">
                                <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-slate-100 dark:bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/20 transition-all duration-1000" style={{ width: `${(app.step / 4) * 100}%` }}></div>
                                </div>
                                <div className="relative flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {['Enviado', 'Em Análise', 'Entrevista', 'Oferta'].map((step, idx) => {
                                        const isCompleted = idx + 1 <= app.step;
                                        const isCurrent = idx + 1 === app.step;
                                        return (
                                            <div key={step} className="flex flex-col items-center gap-3 bg-white dark:bg-slate-900 px-3 z-10 transition-all">
                                                <div className={`w-5 h-5 rounded-full border-[3px] transition-all duration-500 ${isCompleted ? 'bg-primary border-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'} ${isCurrent ? 'scale-125' : ''}`}></div>
                                                <span className={isCompleted ? 'text-primary' : ''}>{step}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5 shadow-inner">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                            <span className="material-icons-round text-5xl text-slate-300">work_outline</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Nenhuma candidatura ainda</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10 font-medium">Você está a poucos cliques de distância da sua próxima grande oportunidade.</p>
                        <Link to="/dashboard/vendedor" className="px-10 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 inline-flex items-center gap-3">
                            <span className="material-icons-round">explore</span>
                            EXPLORAR NOVAS VAGAS
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendedorApplications;
