import React from 'react';
import { Candidate } from '../types';

interface CandidateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: Candidate | null;
}

const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({ isOpen, onClose, candidate }) => {
    if (!isOpen || !candidate) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-primary to-petrol-600">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                    >
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                {/* Profile Content */}
                <div className="px-8 pb-8 -mt-12 relative flex-1 overflow-y-auto">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
                        <div className="relative">
                            <img
                                src={candidate.avatar}
                                alt={candidate.name}
                                className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-xl"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
                                DISPONÍVEL
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
                                <div className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-primary/20">
                                    Match {candidate.matchScore}%
                                </div>
                            </div>
                            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{candidate.title}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            {/* About */}
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="material-icons-round text-primary">person</span>
                                    Sobre o Profissional
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    {candidate.experience} Com foco em resultados e atendimento de excelência, busco oportunidades para aplicar minhas habilidades em vendas consultivas e fidelização de clientes no setor de {candidate.title.split('•')[1] || 'Varejo'}.
                                </p>
                            </section>

                            {/* Skills */}
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="material-icons-round text-primary">psychology</span>
                                    Habilidades & Competências
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium shadow-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 rounded-xl text-sm font-medium">
                                        +4 competências
                                    </span>
                                </div>
                            </section>

                            {/* Experience Mock */}
                            <section>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="material-icons-round text-primary">work</span>
                                    Últimas Experiências
                                </h3>
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                <span className="material-icons-round text-slate-400">business</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">Empresa Multi-Varejo S.A</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Vendedor Pleno • Jan 2022 - Atualmente</p>
                                                <p className="text-xs text-slate-400 mt-2">Destaque em atingimento de metas e fidelização via CRM.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Details */}
                        <div className="space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Informações</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cidade</p>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">São Paulo, SP</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disponibilidade</p>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Imediata (44h/sem)</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Formação</p>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Ensino Médio Completo</p>
                                    </div>
                                    <hr className="border-slate-200 dark:border-slate-700" />
                                    <div className="pt-2">
                                        <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-2xl font-bold text-sm shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                            <span className="material-icons-round text-base">download</span>
                                            Baixar CV Completo
                                        </button>
                                        <button className="w-full mt-3 bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                                            Convidar para Chat
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Secret/Locked info for FREE users */}
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/30 text-center">
                                <span className="material-icons-round text-primary text-3xl mb-2">lock</span>
                                <p className="text-xs font-medium text-slate-600 dark:text-blue-300 leading-relaxed mb-3">O contato direto e histórico detalhado via IA estão disponíveis no plano **Premium**.</p>
                                <button className="text-primary dark:text-blue-400 text-xs font-bold hover:underline">Fazer Upgrade Agora</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfileModal;
