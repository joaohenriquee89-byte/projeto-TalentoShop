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
        cnpj: '',
        address_str: ''
    });

    const stats = [
        { title: 'Vagas Ativas', value: '0', icon: 'business_center', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20', link: '/dashboard/lojista/jobs' },
        { title: 'Novos Candidatos', value: '0', icon: 'group_add', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20', link: '/dashboard/lojista/candidates' },
        { title: 'Mensagens', value: '0', icon: 'chat', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20', link: '/dashboard/lojista/messages' },
        { title: 'Visualizações', value: '0', icon: 'visibility', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20', link: '/dashboard/lojista/plans' },
    ];

    // useEffect para carregar dados pode ser adicionado aqui futuramente

    return (
        <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white">Atividade Recente</h3>
                    </div>

                    {/* Empty State for Activity */}
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