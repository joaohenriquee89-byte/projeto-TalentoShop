import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

const Jobs: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newJobTitle, setNewJobTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchJobs = async () => {
        if (!supabase) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Erro ao buscar vagas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newJobTitle.trim()) return;

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Sessão expirada. Faça login novamente.");
                return;
            }

            const { error } = await supabase.from('jobs').insert({
                title: newJobTitle,
                employer_id: user.id, // Fixed: use employer_id to match RLS/schema
                status: 'Ativa',
                type: 'Moda',
                company_name: user.user_metadata?.company_name || 'Minha Loja'
            });

            if (error) throw error;
            setNewJobTitle('');
            setIsCreateModalOpen(false);
            fetchJobs();
        } catch (error) {
            console.error('Erro ao criar:', error);
            alert("Erro ao criar vaga.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Minhas Vagas</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Gerencie suas oportunidades e acompanhe o fluxo de candidatos.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-emerald-400 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
                >
                    <span className="material-icons-round">add_circle</span>
                    CRIAR NOVA VAGA
                </button>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando vagas...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons-round text-slate-300 text-4xl">work_outline</span>
                            </div>
                            <h3 className="text-xl font-bold dark:text-white mb-2">Nenhuma vaga publicada</h3>
                            <p className="text-slate-400 max-w-xs mx-auto mb-8">Comece agora a atrair os melhores talentos para sua equipe.</p>
                            <button onClick={() => setIsCreateModalOpen(true)} className="text-primary font-black uppercase tracking-widest text-xs hover:underline">Publicar Vaga Agora</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {jobs.map((job) => (
                                <div key={job.id} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <span className="material-icons-round text-3xl">business_center</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{job.title}</h3>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                    <span className="material-icons-round text-sm">schedule</span>
                                                    {new Date(job.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                    <span className="material-icons-round text-sm">location_city</span>
                                                    {job.shopping_mall || 'Unidade Principal'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${job.status === 'Ativa'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-border/20'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <button className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center active:scale-90">
                                            <span className="material-icons-round">more_horiz</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Premium Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white/10 relative">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Nova Oportunidade</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Defina o nome da sua nova vaga para atrair candidatos.</p>
                        </div>
                        <form onSubmit={handleCreateJob} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2">Título da Vaga</label>
                                <input
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-black/20 dark:border-white/10 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    placeholder="Ex: Consultor de Moda - Shopping Ibirapuera"
                                    value={newJobTitle}
                                    required
                                    autoFocus
                                    onChange={(e) => setNewJobTitle(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-4 border border-slate-200 dark:border-white/5 rounded-2xl dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all">CANCELAR</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50">
                                    {isSubmitting ? 'PUBLICANDO...' : 'PUBLICAR VAGA'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;