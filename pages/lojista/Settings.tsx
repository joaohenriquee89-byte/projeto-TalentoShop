import React, { useRef, useState } from 'react';
import { User } from '../../types';

interface SettingsProps {
    user: User;
    setUser: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setUser({ ...user, avatar: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const currentAvatar = user.avatar || `https://picsum.photos/seed/${user.id}/200/200`;

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Configurações da Conta</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Gerencie seus dados pessoais e preferências</p>

            <div className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700">

                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-10 pb-8 border-b border-gray-100 dark:border-gray-700">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <img alt="Profile" className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg object-cover ring-2 ring-slate-100 dark:ring-slate-700" src={currentAvatar} />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <span className="material-icons-round text-white text-3xl">photo_camera</span>
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
                    <p className="text-sm text-primary font-medium bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full mt-2">Lojista Premium</p>
                </div>

                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ... other code ... */}
                    {/* I'll target the end of the form area to include the feedback logic better */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nome do Responsável / Loja</label>
                        <input
                            className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-mail Corporativo</label>
                        <input
                            className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Telefone / WhatsApp</label>
                        <input
                            className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                            placeholder="(11) 99999-9999"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cargo</label>
                        <input
                            className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                            placeholder="Ex: Gerente"
                        />
                    </div>

                    <div className="col-span-2 mt-4 flex justify-end gap-3 items-center">
                        <button className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-8 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-petrol-700 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            {showSuccess ? 'Salvo!' : 'Salvar Alterações'}
                            {showSuccess && <span className="material-icons-round text-sm">check</span>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Segurança</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-800 dark:text-white">Senha</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Última alteração há 3 meses</p>
                    </div>
                    <button className="text-primary hover:underline font-medium text-sm">Alterar Senha</button>
                </div>
            </div>

        </div>
    );
};

export default Settings;
