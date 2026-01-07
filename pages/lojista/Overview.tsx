import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { supabase } from '../../src/lib/supabase';

interface OverviewProps {
    user: User;
    setUser?: (user: User) => void;
}

const Overview: React.FC<OverviewProps> = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [profileData, setProfileData] = useState({
        company_name: user?.name || '', // Ajustado para ser mais seguro
        phone: '',
        shopping_mall: '',
        bio: '',
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return; // Segurança extra

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    company_name: profileData.company_name,
                    phone: profileData.phone,
                    shopping_mall: profileData.shopping_mall,
                    bio: profileData.bio
                })
                .eq('id', user.id);

            if (error) throw error;
            alert("Perfil atualizado com sucesso!");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar perfil.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Perfil da Loja</h2>
                    <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-red-500">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium dark:text-slate-300">Nome da Empresa</label>
                        <input
                            type="text"
                            className="w-full p-2.5 rounded-lg border dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                            value={profileData.company_name}
                            onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                        />
                    </div>
                    {/* ... (demais inputs mantidos exatamente como os seus) */}
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 border rounded-xl dark:text-white">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold">
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