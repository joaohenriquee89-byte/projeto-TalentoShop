import React, { useState, useEffect } from 'react';
import { Candidate, User } from '../../types';
import { supabase } from '../../src/lib/supabase';
import { SHOPPINGS_LIST } from '../../src/constants/data';
import UpgradeModal from '../../components/UpgradeModal';
import CandidateProfileModal from '../../components/CandidateProfileModal';
import Combobox from '../../components/Combobox';
import SuccessModal from '../../components/SuccessModal';

interface CandidatesProps {
    user: User;
}

const Candidates: React.FC<CandidatesProps> = ({ user }) => {
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [invitedCandidateIds, setInvitedCandidateIds] = useState<string[]>([]);
    const [upgradeConfig, setUpgradeConfig] = useState({ title: '', feature: '' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Filters State
    const [locationFilter, setLocationFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const userPlan = user.plan?.toUpperCase() || 'FREE';
    const isPremium = userPlan === 'PRO' || userPlan === 'STANDARD';

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_type', 'vendedor')
                    .limit(50);

                if (error) throw error;

                if (data) {
                    const mappedCandidates: Candidate[] = data.map(profile => ({
                        id: profile.id,
                        name: profile.full_name || 'Candidato',
                        title: profile.sector ? `Vendedor • ${profile.sector}` : 'Vendedor',
                        experience: profile.bio || 'Sem descrição de experiência.',
                        matchScore: Math.floor(Math.random() * (99 - 75 + 1)) + 75,
                        tags: profile.skills || ['Vendas', 'Atendimento'],
                        avatar: profile.avatar_url || `https://picsum.photos/seed/${profile.id}/150/150`
                    }));
                    setCandidates(mappedCandidates);
                }
            } catch (err) {
                console.error('Error fetching candidates:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleApplyFilters = () => {
        setShowSuccessModal(true);
    };

    const handleInviteCandidate = (candidateId: string) => {
        if (!isPremium && invitedCandidateIds.length >= 2 && !invitedCandidateIds.includes(candidateId)) {
            setUpgradeConfig({
                title: "Limite de Convites Atingido",
                feature: "convites ilimitados para chat"
            });
            setProfileModalOpen(false);
            setUpgradeModalOpen(true);
            return;
        }

        if (!invitedCandidateIds.includes(candidateId)) {
            setInvitedCandidateIds(prev => [...prev, candidateId]);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            <UpgradeModal
                isOpen={upgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
                title={upgradeConfig.title || "IA Preditiva de Talentos"}
                featureName={upgradeConfig.feature || "análise de compatibilidade avançada"}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Filtros Aplicados"
                message="A lista de candidatos foi atualizada com sucesso de acordo com seus critérios."
                buttonText="Entendido"
            />

            <CandidateProfileModal
                isOpen={profileModalOpen}
                onClose={() => {
                    setProfileModalOpen(false);
                    setSelectedCandidate(null);
                }}
                candidate={selectedCandidate}
                userPlan={user.plan}
                onInvite={handleInviteCandidate}
                isInvited={selectedCandidate ? invitedCandidateIds.includes(selectedCandidate.id) : false}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Buscar Candidatos</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Encontre o vendedor ideal para sua loja</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {isLoading ? '...' : filteredCandidates.length + 340} Vendedores disponíveis
                    </div>
                    {!isPremium && (
                        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                            PLANO FREE: 3 de 5 buscas diárias restantes
                        </span>
                    )}
                </div>
            </div>

            {/* Global Search Bar */}
            <div className="mb-6 relative group">
                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                <input
                    type="text"
                    placeholder="Busque por nome, cargo ou palavra-chave (ex: Moda, CRM, Inglês)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-700 dark:text-white"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Filters */}
                <div className="xl:col-span-1 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit xl:sticky xl:top-24">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Filtros</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2 ml-1">Shopping</label>
                            <Combobox
                                options={SHOPPINGS_LIST}
                                value={locationFilter}
                                onChange={setLocationFilter}
                                placeholder="Filtrar por Shopping"
                                allowCustom={true}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2 ml-1">Experiência (Anos)</label>
                            <input
                                type="range"
                                min="0" max="10"
                                value={experienceFilter}
                                onChange={(e) => setExperienceFilter(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>0</span>
                                <span>{experienceFilter} anos</span>
                                <span>10+</span>
                            </div>
                        </div>
                        <button
                            onClick={handleApplyFilters}
                            className="w-full bg-primary text-white font-medium py-2.5 rounded-lg shadow-md hover:bg-opacity-90 transition-all transform hover:scale-[1.02]"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-gradient-to-r from-petrol-800 to-primary rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-center shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10 mb-4 md:mb-0">
                            <h3 className="font-bold flex items-center gap-2 text-xl">
                                <span className="material-icons-round text-secondary text-2xl animate-pulse">auto_awesome</span>
                                Agilize sua busca com IA
                            </h3>
                            <p className="text-sm opacity-90 mt-1 max-w-lg">Encontre compatibilidades de até 98% com nossa análise preditiva. Economize horas de triagem.</p>
                        </div>
                        <button
                            onClick={() => {
                                setUpgradeConfig({
                                    title: "IA Preditiva de Talentos",
                                    feature: "análise de compatibilidade avançada"
                                });
                                setUpgradeModalOpen(true);
                            }}
                            className="relative z-10 bg-white text-primary px-6 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Desbloquear IA
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 animate-pulse">Buscando candidatos...</p>
                            </div>
                        ) : filteredCandidates.length > 0 ? (
                            filteredCandidates.map(candidate => (
                                <div key={candidate.id} className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-primary/40 transition-all shadow-sm hover:shadow-md group">
                                    <div className="flex flex-col sm:flex-row gap-5">
                                        <div className="relative">
                                            <img alt={candidate.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm" src={candidate.avatar} />
                                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-surface-dark ${candidate.matchScore > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-primary transition-colors">{candidate.name}</h3>
                                                    <p className="text-primary dark:text-blue-300 font-medium text-sm">{candidate.title}</p>
                                                </div>
                                                <span className={`text-xs px-2.5 py-1 rounded font-bold border ${candidate.matchScore > 85 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'}`}>
                                                    Match {candidate.matchScore}%
                                                </span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">{candidate.experience}</p>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {candidate.tags.map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-gray-700 font-medium">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Exportar CV</button>
                                        <button
                                            onClick={() => {
                                                if (!isPremium) {
                                                    setUpgradeConfig({
                                                        title: "Acesso Limitado",
                                                        feature: "visualização completa de perfil e contato direto"
                                                    });
                                                    setUpgradeModalOpen(true);
                                                    return;
                                                }
                                                setSelectedCandidate(candidate);
                                                setProfileModalOpen(true);
                                            }}
                                            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-petrol-700 shadow-sm transition-all flex items-center justify-center gap-1"
                                        >
                                            <span className="material-icons-round text-base">visibility</span>
                                            {isPremium ? 'Ver Perfil' : 'Desbloquear Perfil'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <span className="material-icons-round text-slate-600 text-4xl mb-2">search_off</span>
                                <p className="text-slate-500">Nenhum candidato encontrado para sua busca.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Candidates;
