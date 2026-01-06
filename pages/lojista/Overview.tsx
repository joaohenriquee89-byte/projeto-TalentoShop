import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Job } from '../../types';
import { supabase } from '../../src/lib/supabase';

interface OverviewProps {
    user: User;
    setUser?: (user: User) => void;
}

const Overview: React.FC<OverviewProps> = ({ user, setUser }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Profile Data State
    const [profileData, setProfileData] = useState({
        company_name: '',
        phone: '',
        shopping_mall: '',
        bio: '',
        cnpj: '', // Usually read-only
        address_str: '' // Simplified address
    });

    const stats = [
        { title: 'Vagas Ativas', value: '3', icon: 'business_center', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20', link: '/dashboard/lojista/jobs' },
        { title: 'Novos Candidatos', value: '15', icon: 'group_add', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20', link: '/dashboard/lojista/candidates' },
        { title: 'Mensagens', value: '7', icon: 'chat', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20', link: '/dashboard/lojista/messages' },
        { title: 'Visualizações', value: '7.k', icon: 'visibility', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20', link: '/dashboard/lojista/plans' },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfileData({
                        company_name: data.company_name || 'Minha Loja',
                        phone: data.phone || '',
                        shopping_mall: data.shopping_mall || '',
                        bio: data.bio || '',
                        cnpj: data.cnpj || '',
                        address_str: data.address ? `${data.address.rua}, ${data.address.numero} - ${data.address.cidade}/${data.address.estado}` : ''
                    });

                    // Update global user avatar if changed
                    if (data.avatar_url && setUser && data.avatar_url !== user.avatar) {
                        setUser({ ...user, avatar: data.avatar_url });
                    }
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user.id, setUser]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (setUser) setUser({ ...user, avatar: base64String });
                // TODO: Upload to storage
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const updates = {
                full_name: user.name, // Responsável
                company_name: profileData.company_name,
                phone: profileData.phone,
                shopping_mall: profileData.shopping_mall,
                bio: profileData.bio,
                updated_at: new Date().toISOString(),
                // Address updates would require parsing or a dedicated address form, keeping simple for now
            };

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            setIsEditing(false);
            alert('Perfil da loja atualizado com sucesso!');
        } catch (err) {
            console.error("Error saving profile:", err);
            alert("Erro ao salvar perfil.");
        } finally {
            setIsSaving(false);
        }
    };

    const currentAvatar = user.avatar || `https://ui-avatars.com/api/?name=${profileData.company_name}&background=0D8ABC&color=fff`;

    if (isEditing) {
        return (
            <div className="max-w-3xl mx-auto animate-fade-in pb-10">
                <button onClick={() => setIsEditing(false)} className="mb-6 flex items-center gap-2 text-primary font-medium hover:underline">
                    <span className="material-icons-round">arrow_back</span> Voltar ao Dashboard
                </button>
                <div className="bg-surface-light dark:bg-surface-dark shadow-2xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-8 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-primary">store</span>
                        Editar Perfil da Loja
                    </h2>

                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <img alt="Profile" className="h-32 w-32 rounded-full border-4 border-primary shadow-lg object-cover transition-transform group-hover:scale-105" src={currentAvatar} />
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span className="material-icons-round text-white text-3xl">photo_camera</span>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        <p className="mt-3 text-sm font-medium text-primary cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>Alterar logo da loja</p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Informações da Empresa</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Loja</label>
                                <input
                                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={profileData.company_name}
                                    onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Responsável</label>
                                <input
                                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={user.name}
                                    onChange={(e) => setUser && setUser({ ...user, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CNPJ (Apenas leitura)</label>
                                <input
                                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-gray-400 p-2.5 cursor-not-allowed"
                                    value={profileData.cnpj || 'Não informado'}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone / WhatsApp</label>
                                <input
                                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="(11) 99999-9999"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shopping / Localização</label>
                                <input
                                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Ex: Shopping Morumbi"
                                    value={profileData.shopping_mall}
                                    onChange={(e) => setProfileData({ ...profileData, shopping_mall: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sobre a Loja</label>
                                <textarea
                                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[120px]"
                                    placeholder="Descreva sua loja, cultura e o que buscam..."
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex gap-3">
                            <button onClick={() => setIsEditing(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="flex-1 bg-primary text-white font-bold py-3 rounded-lg shadow-lg hover:bg-petrol-700 transition-all flex justify-center items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons-round">save</span>
                                        Salvar Alterações
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Visão Geral</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bem-vindo de volta, {user.name.split(' ')[0]}</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
                >
                    <span className="material-icons-round text-base">edit</span>
                    Editar Perfil
                </button>
            </div>

            {/* Profile Summary Card (Always Visible) */}
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6">
                <img src={currentAvatar} alt="Logo" className="w-20 h-20 rounded-full border-2 border-gray-100 dark:border-slate-700 object-cover" />
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profileData.company_name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{profileData.shopping_mall || 'Localização não definida'}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600 dark:text-gray-300">
                        {profileData.phone && (
                            <span className="flex items-center gap-1"><span className="material-icons-round text-base">phone</span> {profileData.phone}</span>
                        )}
                        {profileData.cnpj && (
                            <span className="flex items-center gap-1"><span className="material-icons-round text-base">badge</span> {profileData.cnpj}</span>
                        )}
                    </div>
                </div>
                <div className="border-l border-gray-100 dark:border-gray-700 pl-6 hidden sm:block">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-primary">85%</span>
                        <span className="text-xs text-gray-500">Perfil</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Link key={index} to={stat.link} className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-all active:scale-95 group">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg}`}>
                            <span className={`material-icons-round text-2xl ${stat.color}`}>{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white">Atividade Recente</h3>
                        <Link to="/dashboard/lojista/candidates" className="text-sm text-primary hover:text-primary/80 font-medium">Ver tudo</Link>
                    </div>
                    <div className="space-y-4">
                        {[
                            { text: 'Novo candidato aplicado para "Gerente de Loja"', sub: 'Maria Silva', time: 'Há 10 min' },
                            { text: 'Nova mensagem recebida', sub: 'Carlos Mendes', time: 'Há 25 min' },
                            { text: 'Sua vaga "Vendedor" recebeu 5 novos acessos', sub: 'Shopping Morumbi', time: 'Há 1 hora' },
                        ].map((item, i) => (
                            <Link to="/dashboard/lojista/candidates" key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border-b border-gray-100 dark:border-slate-800 last:border-0 block">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    <span className="material-icons-round text-slate-500 text-sm">notifications</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">{item.text} <span className="text-slate-400 font-normal">{item.sub}</span></p>
                                    <p className="text-xs text-slate-500">{item.time}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-petrol-800 to-primary rounded-xl shadow-lg p-6 text-white">
                    <h3 className="font-bold text-lg mb-4">Ações Rápidas</h3>
                    <div className="space-y-3">
                        <Link to="/dashboard/lojista/jobs" className="w-full bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-lg flex items-center gap-3 transition-colors text-left">
                            <span className="material-icons-round">add_circle</span>
                            <span className="font-medium">Criar Nova Vaga</span>
                        </Link>
                        <Link to="/dashboard/lojista/candidates" className="w-full bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-lg flex items-center gap-3 transition-colors text-left">
                            <span className="material-icons-round">search</span>
                            <span className="font-medium">Buscar Candidatos</span>
                        </Link>
                        <button onClick={() => setIsEditing(true)} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-lg flex items-center gap-3 transition-colors text-left">
                            <span className="material-icons-round">edit</span>
                            <span className="font-medium">Editar Perfil da Loja</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
