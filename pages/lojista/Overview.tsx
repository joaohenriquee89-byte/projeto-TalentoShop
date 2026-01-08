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

    const [profileData, setProfileData] = useState({
        company_name: '',
        full_name: '',
        phone: '',
        avatar_url: '',
        shopping_mall: '',
        bio: '',
    });

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
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="material-icons-round text-primary">edit_note</span>
                        Editar Perfil da Loja
                    </h2>
                    <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <div className="mb-8 flex flex-col items-center">
                    <div className="relative group">
                        <img
                            src={profileData.avatar_url || user?.avatar || `https://picsum.photos/seed/${user?.id}/200/200`}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-md"
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <span className="material-icons-round">photo_camera</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                        </label>
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Clique na foto para alterar</p>
                </div>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Nome Completo (Responsável)</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20"
                            value={profileData.full_name}
                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                            placeholder="Seu nome"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Nome da Empresa</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20"
                            value={profileData.company_name}
                            onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                            placeholder="Nome da loja"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Telefone</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Bio / Descrição da Loja</label>
                        <textarea
                            className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary/20"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            placeholder="Descreva sua loja..."
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-4 pt-4 col-span-1 md:col-span-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancelar</button>
                        <button type="submit" disabled={isSaving || uploading} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-petrol-700 transition-all disabled:opacity-50">
                            {isSaving ? 'Salvando...' : 'Salvar Perfil'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold dark:text-white mb-6">Atividade Recente</h3>
                    <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                        <span className="material-icons-round text-3xl mb-2">history</span>
                        <p className="text-sm">Nenhuma atividade recente.</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-primary rounded-xl p-6 text-white">
                    <h3 className="font-bold mb-4">Ações Rápidas</h3>
                    <div className="space-y-3">
                        <Link to="/dashboard/lojista/jobs" className="w-full bg-white/10 p-3 rounded-lg flex items-center gap-3">
                            <span className="material-icons-round">add_circle</span>
                            <span>Criar Nova Vaga</span>
                        </Link>
                        <button onClick={() => setIsEditing(true)} className="w-full bg-white/10 p-3 rounded-lg flex items-center gap-3">
                            <span className="material-icons-round">edit</span>
                            <span>Editar Perfil</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;