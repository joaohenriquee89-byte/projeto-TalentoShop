import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    featureName?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
    isOpen,
    onClose,
    title = "Desbloqueie todo o potencial",
    featureName = "esta funcionalidade"
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-scale-up border border-yellow-500/30">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10 bg-black/20 rounded-full p-1"
                >
                    <span className="material-icons-round">close</span>
                </button>

                {/* Content */}
                <div className="p-8 text-center relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>

                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="material-icons-round text-4xl text-orange-500">diamond</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        Upgrade para Premium
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        Para acessar <strong>{featureName}</strong> e muito mais, atualize seu plano para a versão Premium.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { onClose(); navigate('/dashboard/lojista/plans'); }}
                            className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-round">upgrade</span>
                            Ver Planos Disponíveis
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 px-6 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white transition-colors"
                        >
                            Agora não
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-xs text-center text-slate-400">
                    Cancele a qualquer momento. Satisfação garantida.
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
