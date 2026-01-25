import React from 'react';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const supportChannels = [
        {
            title: 'Atendimento via WhatsApp',
            description: 'Fale com um de nossos consultores em tempo real.',
            icon: 'chat',
            color: 'bg-emerald-500',
            link: 'https://wa.me/5511999999999', // Placeholder
            action: 'INICIAR CHAT'
        },
        {
            title: 'Suporte por E-mail',
            description: 'Envie sua dúvida e responderemos em até 24h úteis.',
            icon: 'mail',
            color: 'bg-blue-500',
            link: 'mailto:suporte@talentoshop.com.br',
            action: 'ENVIAR E-MAIL'
        },
        {
            title: 'Central de Ajuda',
            description: 'Confira nossos tutoriais e perguntas frequentes.',
            icon: 'help_center',
            color: 'bg-slate-700',
            link: '#',
            action: 'ACESSAR FAQ'
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 p-2 relative">
                <div className="p-8 md:p-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Suporte Premium</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Como podemos ajudar sua loja hoje?</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all active:scale-90"
                        >
                            <span className="material-icons-round">close</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {supportChannels.map((channel, idx) => (
                            <a
                                key={idx}
                                href={channel.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 ${channel.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <span className="material-icons-round text-2xl">{channel.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{channel.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">{channel.description}</p>
                                </div>
                                <span className="material-icons-round text-slate-300 group-hover:text-primary transition-colors rotate-[-45deg] group-hover:rotate-0">arrow_forward</span>
                            </a>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
                        <span className="material-icons-round text-primary mt-0.5">verified_user</span>
                        <div>
                            <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Dica de Segurança</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                Nossa equipe nunca solicitará sua senha ou dados de pagamento por WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;
