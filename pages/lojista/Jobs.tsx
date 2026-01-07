import React, { useState, useEffect } from 'react'; // Corrigido: Adicionado useEffect
import { Link } from 'react-router-dom';
import SuccessModal from '../../components/SuccessModal';
import { supabase } from '../../lib/supabase'; // Corrigido: Caminho ajustado

const Jobs: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // Form State
    const [newJobTitle, setNewJobTitle] = useState('');
    const [newJobType, setNewJobType] = useState('Moda Feminina');

    const [activeActionId, setActiveActionId] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newJobTitle) return;

        setCreating(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase.from('jobs').insert({
                title: newJobTitle,
                type: newJobType,
                user_id: user.id,
                status: 'Ativa',
                company_name: user.user_metadata?.company_name || 'Minha Loja'
            });

            if (error) throw error;

            setShowSuccessModal(true);
            setIsCreateModalOpen(false);
            setNewJobTitle('');
            fetchJobs(); // Refresh list
        } catch (error) {
            console.error('Error creating job:', error);
            alert('Erro ao criar vaga. Tente novamente.');
        } finally {
            setCreating(false);
        }
    };

    const toggleActions = (id: number) => {
        setActiveActionId(activeActionId === id ? null : id);
    };

    const handleDeleteJob = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta vaga?')) return;
        try {
            const { error } = await supabase.from('jobs').delete().eq('id', id);
            if (error) throw error;
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Erro ao excluir vaga.');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Create Job Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Nova Vaga</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <span className="material-icons-round">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreateJob} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título da Vaga</label>
                                <input
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 p-2.5 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Ex: Vendedor"
                                    value={newJobTitle}
                                    onChange={e => setNewJobTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
                                <select
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 p-2.5 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    value={newJobType}
                                    onChange={e => setNewJobType(e.target.value)}
                                >
                                    <option>Moda Feminina</option>
                                    <option>Moda Masculina</option>
                                    <option>Joalheria</option>
                                    <option>Gestão</option>
                                    <option>Atendimento</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={creating || !newJobTitle}
                                className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md hover:bg-petrol-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {creating ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
                                {creating ? 'Criando...' : 'Criar Vaga'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Minhas Vagas</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie suas oportunidades</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-opacity-90 shadow-md transition-all transform hover:-translate-y-0.5"
                >
                    <span className="material-icons-round">add</span>
                    Criar Nova Vaga
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : jobs.length > 0 ? (
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Título da Vaga</th>
                                    <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Tipo</th>
                                    <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {jobs.map((job, idx) => (
                                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-slate-800 dark:text-white font-medium">{job.title}</td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{job.type}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDeleteJob(job.id)} className="text-red-400 hover:text-red-600 p-2">
                                                <span className="material-icons-round">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <span className="material-icons-round text-4xl text-gray-400 mb-4">campaign</span>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Nenhuma vaga publicada</h3>
                    <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 px-8 py-3 bg-primary text-white rounded-lg font-bold">Criar Primeira Vaga</button>
                </div>
            )}

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Vaga Criada"
                message="Sua nova vaga foi publicada com sucesso!"
                buttonText="Ver Minhas Vagas"
            />
        </div>
    );
};

export default Jobs;