import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';

interface OverviewProps {
    user: User;
}

const Overview: React.FC<OverviewProps> = ({ user }) => {
    const stats = [
        { title: 'Vagas Ativas', value: '3', icon: 'business_center', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
        { title: 'Novos Candidatos', value: '12', icon: 'group_add', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
        { title: 'Mensagens', value: '5', icon: 'chat', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
        { title: 'Visualizações', value: '1.2k', icon: 'visibility', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Visão Geral</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bem-vindo de volta, {user.name.split(' ')[0]}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
                            <span className={`material-icons-round text-2xl ${stat.color}`}>{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white">Atividade Recente</h3>
                        <button className="text-sm text-primary hover:text-primary/80 font-medium">Ver tudo</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border-b border-gray-100 dark:border-slate-800 last:border-0">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    <span className="material-icons-round text-slate-500 text-sm">notifications</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">Novo candidato aplicado para "Gerente de Loja"</p>
                                    <p className="text-xs text-slate-500">Há 2 horas</p>
                                </div>
                            </div>
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
                        <Link to="/dashboard/lojista/settings" className="w-full bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-lg flex items-center gap-3 transition-colors text-left">
                            <span className="material-icons-round">settings</span>
                            <span className="font-medium">Editar Perfil</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
