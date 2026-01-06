import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SuccessModal from '../../components/SuccessModal';
import { supabase } from '../../src/lib/supabase';

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
        if (activeActionId === id) {
            setActiveActionId(null);
        } else {
            setActiveActionId(id);
        }
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
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título da Vaga</label>
                                <input
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 p-2.5 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Ex: Vendedor"
                                    value={newJobTitle}
                                    onChange={e => setNewJobTitle(e.target.value)}
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
                                onClick={handleCreateJob}
                                disabled={creating || !newJobTitle}
                                className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md hover:bg-petrol-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {creating ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
                                {creating ? 'Criando...' : 'Criar Vaga'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Link to="/dashboard/lojista" className="md:hidden p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                        <span className="material-icons-round">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Minhas Vagas</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie suas oportunidades</p>
                    </div>
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
                    <div className="overflow-visible">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Título da Vaga</th>
                                    <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Tipo</th>
                                    <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Candidatos</th>
                                    <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Status</th>
                                    <th className="p-4 font-semibold text-sm text-slate-600 dark:text-slate-300 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {jobs.map((job, idx) => (
                                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                                        <td className="p-4 text-slate-800 dark:text-white font-medium">{job.title}</td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{job.type}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons-round text-slate-400 text-sm">person</span>
                                                <span className="text-slate-800 dark:text-white">{job.candidates || 0}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${job.status === 'Ativa' ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-600'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right relative">
                                            <button onClick={() => toggleActions(idx)} className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                                <span className="material-icons-round">more_vert</span>
                                            </button>

                                            {activeActionId === idx && (
                                                <div className="absolute right-8 top-8 z-20 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 animate-fade-in overflow-hidden">
                                                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                                                        <span className="material-icons-round text-xs">edit</span> Editar
                                                    </button>
                                                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                                                        <span className="material-icons-round text-xs">visibility</span> Ver
                                                    </button>
                                                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                                    <button onClick={() => handleDeleteJob(job.id)} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                                        <span className="material-icons-round text-xs">delete</span> Excluir
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons-round text-4xl text-gray-400">campaign</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Nenhuma vaga publicada</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                        Você ainda não criou nenhuma vaga. Comece a divulgar suas oportunidades para encontrar os melhores talentos.
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg transform hover:-translate-y-0.5"
                    >
                        Criar Primeira Vaga
                    </button>
                </div>
            )}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Vaga Criada"
                message="Sua nova vaga foi publicada com sucesso e já está visível para candidatos compatíveis."
                buttonText="Ver Minhas Vagas"
            />
        </div>
    );
};

export default Jobs;
