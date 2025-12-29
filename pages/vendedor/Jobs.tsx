import React from 'react';

const VendedorJobs: React.FC = () => {
    const savedJobs = [
        { id: 1, title: 'Vendedor Sênior', company: 'Zara', location: 'Shopping Eldorado', date: 'Há 2 dias', initial: 'Z', status: 'Aberto' },
        { id: 2, title: 'Gerente de Loja', company: 'Vivara', location: 'Shopping Morumbi', date: 'Há 5 dias', initial: 'V', status: 'Encerrado' },
    ];

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Minhas Vagas Salvas</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Acompanhe as vagas que você demonstrou interesse</p>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex">
                    <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium shadow-sm">Todas</button>
                    <button className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm font-medium">Abertas</button>
                </div>
            </div>

            <div className="grid gap-4">
                {savedJobs.map(job => (
                    <div key={job.id} className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-xl text-gray-600 dark:text-gray-300 group-hover:bg-primary group-hover:text-white transition-colors">
                                {job.initial}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-white text-lg">{job.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{job.company}</span>
                                    <span>•</span>
                                    <span>{job.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${job.status === 'Aberto' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {job.status}
                            </span>
                            <p className="text-xs text-gray-400">Salvo {job.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendedorJobs;
