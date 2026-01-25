import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/contexts/AuthContext';

interface OverviewProps {
    user: User;
    setUser?: (user: User) => void;
}

const Overview: React.FC<OverviewProps> = ({ user }) => {
    const { refreshProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState({ jobs: 0, candidates: 0, messages: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    const [profileData, setProfileData] = useState({
        company_name: '',
        full_name: '',
        phone: '',
        avatar_url: '',
        shopping_mall: '',
        bio: '',
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            if (!user?.id) return;
            try {
                // Fetch stats in parallel
                const [jobsRes, candidatesRes, messagesRes] = await Promise.all([
                    supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('employer_id', user.id),
                    supabase.from('applications').select('id', { count: 'exact', head: true }).eq('employer_id', user.id),
                    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('receiver_id', user.id).eq('is_read', false)
                ]);

                setStats({
                    jobs: jobsRes.count || 0,
                    candidates: candidatesRes.count || 0,
                    messages: messagesRes.count || 0
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, [user?.id]);

    React.useEffect(() => {
        if (isEditing && user?.id) {
            const loadData = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('company_name, full_name, phone, avatar_url, shopping_mall, bio')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfileData({
                        company_name: data.company_name || '',
                        full_name: data.full_name || '',
                        phone: data.phone || '',
                        avatar_url: data.avatar_url || '',
                        shopping_mall: data.shopping_mall || '',
                        bio: data.bio || '',
                    });
                }
            };
            loadData();
        }
    }, [isEditing, user?.id]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setProfileData(prev => ({ ...prev, avatar_url: publicUrl }));
        } catch (err: any) {
            console.error('Error uploading image:', err.message);
            alert('Erro ao fazer upload da imagem.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    company_name: profileData.company_name,
                    full_name: profileData.full_name,
                    phone: profileData.phone,
                    avatar_url: profileData.avatar_url,
                    shopping_mall: profileData.shopping_mall,
                    bio: profileData.bio
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshProfile();
            setIsEditing(false);
            alert("Perfil atualizado com sucesso!");
        } catch (err: any) {
            console.error(err);
            alert("Erro ao salvar perfil: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-border/50 animate-fade-in backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <span className="material-icons-round text-2xl">settings_suggest</span>
                            </div>
                            Editar Perfil
                        </h2>
                        <p className="text-foreground/50 text-sm mt-1 ml-1">Mantenha os dados da sua loja atualizados.</p>
                    </div>
                    <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                        <span className="material-icons-round text-foreground/40">close</span>
                    </button>
                </div>

                <div className="mb-10 flex flex-col items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                        <img
                            src={profileData.avatar_url || user?.avatar || `https://picsum.photos/seed/${user?.id}/200/200`}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl relative z-10"
                        />
                        <label className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                            <span className="material-icons-round text-3xl">add_a_photo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                        </label>
                        {uploading && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 rounded-full">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <p className="mt-4 text-xs font-black text-foreground/40 uppercase tracking-widest">Toque para alterar imagem</p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-wider mb-2 ml-1">Responsável pela Unidade</label>
                            <input
                                type="text"
                                className="w-full p-4 rounded-2xl border dark:bg-black/20 dark:border-white/10 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                value={profileData.full_name}
                                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                placeholder="Seu nome"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-wider mb-2 ml-1">Nome Fantasia da Loja</label>
                            <input
                                type="text"
                                className="w-full p-4 rounded-2xl border dark:bg-black/20 dark:border-white/10 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                value={profileData.company_name}
                                onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                                placeholder="Nome da loja"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-wider mb-2 ml-1">Contato WhatsApp</label>
                            <input
                                type="text"
                                className="w-full p-4 rounded-2xl border dark:bg-black/20 dark:border-white/10 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-wider mb-2 ml-1">Bio / Descrição da Loja</label>
                            <textarea
                                className="w-full p-4 rounded-2xl border dark:bg-black/20 dark:border-white/10 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none"
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                placeholder="Fale um pouco sobre a cultura da sua loja e o que busca nos candidatos..."
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 px-6 border border-border dark:border-white/10 rounded-2xl dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Descartar</button>
                        <button type="submit" disabled={isSaving || uploading} className="flex-1 py-4 px-6 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-emerald-600 hover:-translate-y-1 transition-all disabled:opacity-50 active:scale-95">
                            {isSaving ? 'Gravando...' : 'ATUALIZAR PERFIL'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in max-w-7xl mx-auto">
            {/* Header / Welcome Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Painel Administrativo
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Olá, <span className="text-primary italic">{user.name.split(' ')[0]}</span>.
                        </h1>
                        <p className="text-white/60 text-lg max-w-xl font-medium leading-relaxed">
                            {stats.jobs > 0
                                ? `Sua loja tem ${stats.jobs} vagas ativas hoje. Confira os novos candidatos que se aplicaram.`
                                : "Bem-vindo! Comece criando sua primeira vaga para atrair os melhores talentos da região."}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/dashboard/lojista/jobs" className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-emerald-400 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3">
                            <span className="material-icons-round">add_circle</span>
                            CRIAR NOVA VAGA
                        </Link>
                        <button onClick={() => setIsEditing(true)} className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-black rounded-2xl border border-white/10 hover:bg-white/20 transition-all flex items-center gap-3">
                            <span className="material-icons-round">edit</span>
                            EDITAR PERFIL
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Vagas Ativas', value: stats.jobs, icon: 'campaign', color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Total de Candidatos', value: stats.candidates, icon: 'groups', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Mensagens Novas', value: stats.messages, icon: 'chat_bubble', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-2">{item.label}</p>
                                <h3 className="text-4xl font-black text-foreground tracking-tighter">
                                    {loadingStats ? (
                                        <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg"></div>
                                    ) : item.value}
                                </h3>
                            </div>
                            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <span className="material-icons-round text-2xl">{item.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Atividade Recente</h3>
                        <Link to="/dashboard/lojista/candidates" className="text-sm font-bold text-primary hover:underline underline-offset-4">Ver todos</Link>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border/50 shadow-sm p-10 min-h-[300px] flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                            <span className="material-icons-round text-4xl text-slate-300">auto_awesome</span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-2">Tudo em dia por aqui!</h4>
                        <p className="text-foreground/40 max-w-sm">Candidaturas e atualizações recentes aparecerão aqui para sua gestão rápida.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-black text-foreground tracking-tight px-2">Dica da IA</h3>
                    <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-[2rem] p-8 border border-primary/20 relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-primary opacity-20">
                            <span className="material-icons-round text-4xl">lightbulb</span>
                        </div>
                        <p className="text-foreground/60 leading-relaxed font-medium relative z-10">
                            "Lojistas que respondem candidatos em até 24h têm <span className="text-primary font-bold">3x mais chance</span> de fechar uma boa contratação."
                        </p>
                        <div className="mt-8 pt-8 border-t border-primary/10 relative z-10">
                            <Link to="/dashboard/lojista/plans" className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                UPGRADE PARA PREMIUM
                                <span className="material-icons-round text-xs">arrow_forward</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Access Card */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                        <h4 className="font-bold mb-4">Suporte ao Lojista</h4>
                        <p className="text-white/40 text-sm mb-6">Precisa de ajuda com suas vagas ou ranqueamento?</p>
                        <a href="mailto:suporte@talentoshop.com.br" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-slate-100 transition-all text-xs uppercase tracking-widest">
                            <span className="material-icons-round text-sm">mail</span>
                            Falar com Suporte
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;