import React from 'react';
import { Link } from 'react-router-dom';

const RegisterSelection: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-4xl w-full">
                <div className="text-center mb-12 animate-fade-in">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">hub</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                            Talento<span className="text-secondary">Shop</span>
                        </h1>
                    </Link>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Como você quer <span className="text-primary italic">começar?</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
                        Escolha o perfil que melhor descreve seu objetivo na plataforma.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Vendedor Option */}
                    <Link
                        to="/register/vendedor"
                        className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-premium hover:border-primary hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <span className="material-icons-round text-4xl">badge</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Sou Vendedor</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed italic text-sm">
                            "Quero encontrar as melhores oportunidades em lojas premium e crescer na minha carreira."
                        </p>
                        <div className="mt-auto px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-500 flex items-center gap-2">
                            Cadastrar Currículo
                            <span className="material-icons-round">chevron_right</span>
                        </div>
                    </Link>

                    {/* Lojista Option */}
                    <Link
                        to="/register/lojista"
                        className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-premium hover:border-secondary hover:shadow-secondary/10 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center"
                    >
                        <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                            <span className="material-icons-round text-4xl">storefront</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Sou Lojista</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed italic text-sm">
                            "Quero recrutar talentos excepcionais com auxílio de IA e otimizar meu time de vendas."
                        </p>
                        <div className="mt-auto px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl group-hover:bg-secondary group-hover:text-white transition-all duration-500 flex items-center gap-2">
                            Contratar Talentos
                            <span className="material-icons-round">chevron_right</span>
                        </div>
                    </Link>
                </div>

                <div className="text-center mt-12 text-slate-500 dark:text-slate-400 animate-fade-in delay-500">
                    <p className="text-sm">
                        Já possui uma conta? {' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">Fazer Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterSelection;
