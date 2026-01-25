import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';

const ResetPassword = () => {
    const { session, loading: authLoading } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Check if we have a recovery session
    useEffect(() => {
        if (!authLoading && !session) {
            setError('Link de recuperação expirado ou inválido. Por favor, solicite um novo.');
        }
    }, [session, authLoading]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            setError('Sessão de recuperação não encontrada. Tente clicar no link do e-mail novamente.');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#07090D] p-4 transition-colors duration-500">
            {/* Background Decorative Blur */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-full pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="w-full max-w-md bg-white dark:bg-slate-900/50 rounded-[2.5rem] shadow-2xl p-10 border border-border/50 backdrop-blur-2xl relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-emerald-400"></div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 text-primary mb-6 animate-spring-in">
                        <span className="material-icons-round text-3xl">lock_reset</span>
                    </div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight mb-3">Nova Senha</h2>
                    <p className="text-foreground/60 font-medium leading-relaxed">
                        Crie uma nova credencial de segurança para acessar sua conta.
                    </p>
                </div>

                {success ? (
                    <div className="text-center py-6 animate-fade-in">
                        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-icons-round text-4xl">check_circle</span>
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-3">Senha Atualizada!</h3>
                        <p className="text-foreground/60 leading-relaxed font-medium">
                            Sua segurança foi reestabelecida. Redirecionando para o portal em instantes...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold border border-red-100 dark:border-red-900/50 flex items-center gap-3">
                                <span className="material-icons-round text-lg">warning</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-2">Nova Senha</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full py-4 px-6 pr-12 rounded-2xl border-border bg-slate-50 dark:bg-white/5 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all active:scale-95"
                                >
                                    <span className="material-icons-round text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-2">Confirmar Novo Acesso</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full py-4 px-6 pr-12 rounded-2xl border-border bg-slate-50 dark:bg-white/5 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all active:scale-95"
                                >
                                    <span className="material-icons-round text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:bg-emerald-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <div className="flex items-center gap-3 relative z-10">
                                    <span className="material-icons-round">security</span>
                                    REDEFINIR ACESSO
                                </div>
                            )}
                        </button>

                        <div className="pt-4 text-center">
                            <Link to="/login" className="text-xs font-black text-foreground/40 hover:text-primary transition-colors uppercase tracking-widest">
                                Voltar para o Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
