import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const Jobs: React.FC = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newJobTitle, setNewJobTitle] = useState('');

    const fetchJobs = async () => {
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
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase.from('jobs').insert({
                title: newJobTitle,
                user_id: user.id,
                status: 'Ativa'
            });

            if (error) throw error;
            setNewJobTitle('');
            setIsCreateModalOpen(false);
            fetchJobs();
        } catch (error) {
            console.error('Erro ao criar:', error);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold dark:text-white">Minhas Vagas</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium"
                >
                    + Nova Vaga
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    {jobs.length === 0 ? (
                        <p className="p-10 text-center text-slate-500">Nenhuma vaga encontrada.</p>
                    ) : (
                        <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                            {jobs.map((job) => (
                                <li key={job.id} className="p-4 flex justify-between items-center">
                                    <span className="font-medium dark:text-white">{job.title}</span>
                                    <span className="text-sm text-slate-500">{job.status}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Criar Vaga</h2>
                        <form onSubmit={handleCreateJob}>
                            <input
                                className="w-full p-2 border rounded-lg mb-4 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                placeholder="Título da vaga"
                                value={newJobTitle}
                                onChange={(e) => setNewJobTitle(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 p-2 border rounded-lg dark:text-white">Cancelar</button>
                                <button type="submit" className="flex-1 p-2 bg-primary text-white rounded-lg">Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;