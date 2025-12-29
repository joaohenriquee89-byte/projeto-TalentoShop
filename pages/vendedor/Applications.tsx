import React from 'react';

const VendedorApplications: React.FC = () => {
    const applications = [
        { id: 1, title: 'Consultor de Vendas', company: 'Nike', location: 'Shopping Ibirapuera', status: 'Em Análise', date: 'Enviado hoje', initial: 'N', step: 2 },
        { id: 2, title: 'Vendedor Responsável', company: 'Centauro', location: 'Shopping Metrô Santa Cruz', status: 'Visualizado', date: 'Enviado ontem', initial: 'C', step: 3 },
    ];

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Minhas Candidaturas</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Gerencie o status dos seus processos seletivos</p>

            <div className="space-y-6">
                {applications.map(app => (
                    <div key={app.id} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-bold text-2xl text-gray-700 dark:text-gray-200">
                                    {app.initial}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{app.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{app.company} • {app.location}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                    {app.status}
                                </span>
                                <p className="text-xs text-gray-400 mt-2">{app.date}</p>
                            </div>
                        </div>

                        {/* Steps / Progress Line */}
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700 -translate-y-1/2 rounded-full"></div>
                            <div className="relative flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                {['Enviado', 'Em Análise', 'Entrevista', 'Oferta'].map((step, idx) => {
                                    const isCompleted = idx + 1 <= app.step;
                                    const isCurrent = idx + 1 === app.step;
                                    return (
                                        <div key={step} className="flex flex-col items-center gap-2 bg-white dark:bg-surface-dark px-2 z-10">
                                            <div className={`w-3 h-3 rounded-full border-2 ${isCompleted ? 'bg-primary border-primary' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'} ${isCurrent ? 'ring-4 ring-blue-100 dark:ring-blue-900/30' : ''}`}></div>
                                            <span className={isCompleted ? 'text-primary' : ''}>{step}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendedorApplications;
