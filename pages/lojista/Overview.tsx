import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { supabase } from '../../lib/supabase'; // Caminho corrigido

interface OverviewProps {
    user: User;
    setUser?: (user: User) => void;
}

const Overview: React.FC<OverviewProps> = ({ user, setUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Profile Data State
    const [profileData, setProfileData] = useState({
        company_name: user?.full_name || '',
        phone: '',
        shopping_mall: '',
        bio: '',
    });

    // Função para salvar as alterações
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
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
            alert("Perfil atualizado!");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar perfil.");
        } finally {
            setIsSaving(false);
        }
    };

    // TELA DE EDIÇÃO (Aparece quando isEditing é true)
    if (isEditing) {
        return (
            <div className="max-w-2xl mx-auto bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Perfil da Loja</h2>
                    <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Loja/Empresa</label>
                        <input
                            type="text"
                            className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary"
                            value={profileData.company_name}
                            onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shopping / Localização</label>
                        <input
                            type="text"
                            className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary"
                            placeholder="Ex: Shopping Center Recife"
                            value={profileData.shopping_mall}
                            onChange={(e) => setProfileData({ ...profileData, shopping_mall: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone / WhatsApp</label>
                        <input
                            type="text"
                            className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio / Descrição da Loja</label>
                        <textarea
                            rows={4}
                            className="w-full p-2.5 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-primary"
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg flex justify-center items-center gap-2"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar Perfil'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // DASHBOARD NORMAL
    return (
        <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white">Atividade Recente</h3>
                    </div>

                    <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                        <span className="material-icons-round text-slate-300 text-3xl mb-2">history</span>
                        <p className="text-sm">Nenhuma atividade recente registrada.</p>
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