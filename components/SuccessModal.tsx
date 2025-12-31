import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonText?: string;
    redirectUrl?: string;
    type?: 'success' | 'error';
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    buttonText = "Continuar",
    redirectUrl,
    type = 'success'
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleAction = () => {
        onClose();
        if (redirectUrl) {
            navigate(redirectUrl);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all scale-100 animate-scale-up text-center border border-slate-100 dark:border-slate-700">

                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                    <span className={`material-icons-round text-4xl ${type === 'success' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {type === 'success' ? 'check_circle' : 'error'}
                    </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                    {title}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    {message}
                </p>

                <button
                    onClick={handleAction}
                    className="w-full pym-3.5 px-6 bg-primary hover:bg-opacity-90 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
