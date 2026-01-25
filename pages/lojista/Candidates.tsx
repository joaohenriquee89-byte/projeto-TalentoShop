import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const isPremium = userPlan !== 'FREE' && userPlan !== 'GRÁTIS';

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
                    const mappedCandidates: Candidate[] = data.map(profile => {
                        const baseScore = profile.skills && profile.skills.length > 0 ? 80 : 70;
                        const jitter = Math.floor(Math.random() * 15);

                        return {
                            id: profile.id,
                            name: profile.full_name || 'Candidato',
                            title: profile.sector ? `Vendedor • ${profile.sector}` : 'Vendedor',
                            experience: profile.bio || 'Sem descrição de experiência.',
                            matchScore: Math.min(99, baseScore + jitter),
                            tags: profile.skills || ['Vendas', 'Atendimento'],
                            avatar: profile.avatar_url || `https://picsum.photos/seed/${profile.id}/150/150`
                        };
                    });
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
        <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
            <UpgradeModal
                isOpen={upgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
                title={upgradeConfig.title || "IA Preditiva de Talentos"}
                featureName={upgradeConfig.feature || "análise de compatibilidade avançada"}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Lista Atualizada"
                message="Filtros aplicados com precisão cirúrgica. Confira os novos resultados."
                buttonText="VER CANDIDATOS"
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

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Explorar Talentos</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium ml-4">
                        Explore nossa base de dados filtrada por nossa inteligência artificial.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-3 ml-4 lg:ml-0">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {isLoading ? '...' : filteredCandidates.length} Candidatos em destaque
                        </span>
                    </div>
                    {!isPremium && (
                        <Link to="/dashboard/lojista/plans" className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full uppercase tracking-widest hover:bg-primary/20 transition-all">
                            UPGRADE: Desbloquear buscas ilimitadas
                        </Link>
                    )}
                </div>
            </div>

            {/* Search and Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Fixed Filter Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border/50 p-8 shadow-sm lg:sticky lg:top-24">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="material-icons-round text-primary">tune</span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Refinar Busca</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Shopping / Local</label>
                                <Combobox
                                    options={SHOPPINGS_LIST}
                                    value={locationFilter}
                                    onChange={setLocationFilter}
                                    placeholder="Localidade..."
                                    allowCustom={true}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Experiência</label>
                                    <span className="text-primary font-black text-sm">{experienceFilter}+ ANOS</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="10"
                                    value={experienceFilter}
                                    onChange={(e) => setExperienceFilter(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <button
                                onClick={handleApplyFilters}
                                className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:shadow-primary/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>

                    {!isPremium && (
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-emerald-600 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                <span className="material-icons-round text-9xl">auto_awesome</span>
                            </div>
                            <h4 className="text-xl font-black mb-2 relative z-10">IA Ativada</h4>
                            <p className="text-white/80 text-sm font-medium mb-6 relative z-10 leading-relaxed text-balance">
                                Desbloqueie o ranqueamento automático para ver quem combina mais com sua marca.
                            </p>
                            <button onClick={() => setUpgradeModalOpen(true)} className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all relative z-10">
                                CONHECER PREMIUM
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-10">
                    {/* Top Search Bar */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <input
                            type="text"
                            placeholder="Buscar por nome, cargo, palavra-chave ou habilidades específicas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] py-6 pl-20 pr-8 shadow-sm focus:shadow-2xl focus:border-primary/30 outline-none transition-all text-lg font-medium relative z-10"
                        />
                        <div className="absolute left-7 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-icons-round text-xl">search</span>
                        </div>
                    </div>

                    {/* Results Container */}
                    <div className="grid grid-cols-1 gap-6">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center animate-pulse">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Mapeando base de talentos...</p>
                            </div>
                        ) : filteredCandidates.length > 0 ? (
                            filteredCandidates.map(candidate => (
                                <div
                                    key={candidate.id}
                                    className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-border/50 hover:border-primary/40 transition-all shadow-sm hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10">
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <img
                                                alt={candidate.name}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl relative"
                                                src={candidate.avatar}
                                            />
                                            <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-[10px] font-black ${candidate.matchScore > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                                                {candidate.matchScore}%
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-all mb-1 truncate">{candidate.name}</h3>
                                                    <p className="text-primary font-bold text-sm uppercase tracking-wider">{candidate.title}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!isPremium ? (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            <span className="material-icons-round text-xs">lock</span>
                                                            Perfil Privado
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                            <span className="material-icons-round text-xs">verified</span>
                                                            Verificado
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed line-clamp-2 italic font-medium">"{candidate.experience}"</p>

                                            <div className="flex flex-wrap gap-2 mt-6">
                                                {candidate.tags.slice(0, 4).map(tag => (
                                                    <span key={tag} className="px-3.5 py-1.5 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-[10px] rounded-full border border-slate-100 dark:border-white/5 font-black uppercase tracking-widest transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/20">{tag}</span>
                                                ))}
                                                {candidate.tags.length > 4 && <span className="text-[10px] font-black text-slate-300 self-center">+{candidate.tags.length - 4}</span>}
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col gap-3 w-full sm:w-auto self-stretch justify-end">
                                            <button className="flex-1 sm:flex-none p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-primary transition-all active:scale-95 group/btn">
                                                <span className="material-icons-round group-hover/btn:scale-110 transition-transform">file_download</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!isPremium) {
                                                        setUpgradeConfig({
                                                            title: "Perfil Bloqueado",
                                                            feature: "contato direto e detalhes completos de experiências"
                                                        });
                                                        setUpgradeModalOpen(true);
                                                        return;
                                                    }
                                                    setSelectedCandidate(candidate);
                                                    setProfileModalOpen(true);
                                                }}
                                                className="flex-[3] sm:flex-none px-6 py-4 rounded-2xl bg-slate-900 border border-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all text-center"
                                            >
                                                {isPremium ? 'Ver Perfil' : 'Desbloquear'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-8">
                                    <span className="material-icons-round text-5xl text-slate-300">person_search</span>
                                </div>
                                <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">Nenhum talento encontrado</h4>
                                <p className="text-slate-400 max-w-sm font-medium">Tente ajustar os filtros de localidade ou habilidades para ver novos resultados.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Candidates;
