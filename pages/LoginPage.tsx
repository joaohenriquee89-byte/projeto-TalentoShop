import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserRole, User } from '../types';

import { supabase } from '../src/lib/supabase';

import { useAuth } from '../src/contexts/AuthContext';

interface LoginPageProps {
  // setUser: (user: User) => void; // Deprecated
}

const LoginPage: React.FC<LoginPageProps> = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(UserRole.VENDEDOR);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [errorMsg, setErrorMsg] = useState('');

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate(user.role === UserRole.VENDEDOR ? '/dashboard/vendedor' : '/dashboard/lojista');
      }
    }
  }, [user, navigate, redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        console.log('Login successful, waiting for redirect...');

        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('remembered_email', email);
        } else {
          localStorage.removeItem('remembered_email');
        }

        setLoading(false);
      }

    } catch (error: any) {
      console.error("Login error:", error);
      let msg = error.message;
      if (msg === "Invalid login credentials") {
        msg = "E-mail ou senha incorretos. Tente novamente.";
      } else if (msg === "Email not confirmed") {
        msg = "E-mail não confirmado. Verifique seu e-mail.";
      } else {
        msg = "Erro ao entrar: " + msg;
      }
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'linkedin_oidc') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `https://talentoshop.vercel.app/login?role=${role}${redirectPath ? `&redirect=${redirectPath}` : ''}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      setErrorMsg(`Erro ao entrar com ${provider === 'google' ? 'Google' : 'LinkedIn'}: ${error.message}`);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `https://talentoshop.vercel.app/reset-password`,
      });
      if (error) throw error;
      setForgotSuccess(true);
    } catch (error: any) {
      console.error("Reset password error:", error);
      alert("Erro ao enviar e-mail de recuperação: " + error.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500 bg-background dark:bg-[#07090D]">
      <div className="w-full max-w-6xl h-auto md:h-[800px] flex flex-col md:flex-row bg-white dark:bg-slate-900/50 rounded-[2rem] shadow-2xl overflow-hidden border border-border/50 backdrop-blur-xl">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          <Link to="/" className="flex items-center gap-2 mb-8 transform hover:scale-105 transition-transform origin-left">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 bg-primary rounded-xl opacity-90 rotate-3 shadow-lg shadow-primary/20"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-accent rounded-full border-2 border-white dark:border-[#07090D] z-10 -mb-1 -mr-1"></div>
              <span className="material-icons-round absolute inset-0 flex items-center justify-center text-white text-xl">shopping_bag</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Talento<span className="text-primary italic">Shop</span>
            </h1>
          </Link>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Bem-vindo de volta</h2>
            <p className="text-slate-500 dark:text-slate-400">Acesse o hub de talentos e oportunidades.</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl flex mb-8">
            <button
              className={`flex-1 flex items-center justify-center py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === UserRole.VENDEDOR ? 'bg-white dark:bg-primary shadow-lg text-primary dark:text-white ring-1 ring-border' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}
              onClick={() => setRole(UserRole.VENDEDOR)}
            >
              <span className="material-icons-round text-lg mr-2">badge</span>
              Sou Vendedor
            </button>
            <button
              className={`flex-1 flex items-center justify-center py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === UserRole.LOJISTA ? 'bg-white dark:bg-primary shadow-lg text-primary dark:text-white ring-1 ring-border' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}
              onClick={() => setRole(UserRole.LOJISTA)}
            >
              <span className="material-icons-round text-lg mr-2">storefront</span>
              Sou Lojista
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex flex-col items-start gap-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <span className="material-icons-round text-red-500 mt-0.5">error</span>
                <p className="text-sm text-red-600 dark:text-red-300 font-medium leading-relaxed">{errorMsg}</p>
              </div>
              {errorMsg.includes("não confirmado") && (
                <button
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.resend({
                        type: 'signup',
                        email: email,
                        options: {
                          emailRedirectTo: 'https://talentoshop.vercel.app'
                        }
                      });
                      if (error) throw error;
                      alert("E-mail de confirmação reenviado! Verifique sua caixa de entrada.");
                    } catch (err: any) {
                      alert("Erro ao reenviar: " + err.message);
                    }
                  }}
                  className="ml-9 text-xs font-bold text-primary hover:underline"
                  type="button"
                >
                  Reenviar e-mail de confirmação
                </button>
              )}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">E-mail corporativo</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-icons-round text-xl">email</span>
                </span>
                <input
                  className="pl-10 block w-full rounded-2xl border-border bg-white dark:bg-slate-800 text-foreground focus:border-primary focus:ring-primary sm:text-sm py-4 shadow-sm transition-all"
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="password">Senha</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-icons-round text-xl">lock</span>
                </span>
                <input
                  className="pl-10 pr-10 block w-full rounded-2xl border-border bg-white dark:bg-slate-800 text-foreground focus:border-primary focus:ring-primary sm:text-sm py-4 shadow-sm transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-all active:scale-95 focus:outline-none group-hover:text-primary"
                >
                  <span className="material-icons-round text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    className="peer h-4 w-4 opacity-0 absolute cursor-pointer z-10"
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className="h-4 w-4 border-2 border-slate-300 dark:border-slate-600 rounded peer-checked:bg-primary peer-checked:border-primary transition-all duration-300 flex items-center justify-center">
                    <span className="material-icons-round text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                  </div>
                </div>
                <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer group-hover:text-foreground transition-colors" htmlFor="remember-me">Lembrar de mim</label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="font-bold text-primary hover:text-primary/80 transition-all hover:underline underline-offset-4 decoration-primary/30"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white bg-primary hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden" type="submit" disabled={loading}>
                <span className="relative z-10">{loading ? 'Entrando...' : 'ENTRAR NA PLATAFORMA'}</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface-light dark:bg-slate-800 text-slate-500 dark:text-slate-400">Ou continue com</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                <img alt="Google" className="h-5 w-5 mr-2" src="https://www.google.com/favicon.ico" />
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('linkedin_oidc')}
                disabled={loading}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
                <img alt="LinkedIn" className="h-5 w-5 mr-2" src="https://www.linkedin.com/favicon.ico" />
                LinkedIn
              </button>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Ainda não tem uma conta?
            <Link className="font-bold text-primary hover:text-petrol-700 dark:text-blue-400 dark:hover:text-blue-300 ml-1" to="/register">Criar conta grátis</Link>
          </p>
        </div>

        {/* Right Side: Visual */}
        <div className="hidden md:flex w-1/2 brand-gradient relative p-12 text-white flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary opacity-10 blur-3xl"></div>
          <div className="relative z-10 mt-auto">
            <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg transform transition hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-2 mb-4 text-secondary">
                <span className="material-icons-round text-yellow-400">auto_awesome</span>
                <span className="text-sm font-semibold uppercase tracking-wider text-white">IA Integrada</span>
              </div>
              <blockquote className="text-lg font-light leading-relaxed">
                "Com a ajuda da IA do TalentoShop, reduzimos o tempo de contratação em 40% e encontramos vendedores alinhados com a cultura da nossa loja."
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <img alt="Avatar User" className="w-10 h-10 rounded-full border-2 border-secondary" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" />
                <div>
                  <div className="font-semibold text-white">Mariana Costa</div>
                  <div className="text-sm text-slate-300">Gerente de Shopping</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end border-t border-white/10 pt-6">
              <div>
                <p className="text-slate-300 text-sm mb-1">Junte-se a mais de</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold">5.000</p>
                  <p className="text-lg">Lojistas</p>
                </div>
              </div>
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-primary"></div>
                <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-primary"></div>
                <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-primary"></div>
                <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-primary flex items-center justify-center text-xs font-bold">+2k</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="bg-white dark:bg-[#0A0A0A]/90 w-full max-w-md rounded-[2rem] shadow-2xl p-10 border border-white/20 relative overflow-hidden backdrop-blur-2xl">
            {/* Visual Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-emerald-400"></div>

            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-foreground tracking-tight">Recuperar Acesso</h3>
              <button onClick={() => { setShowForgotModal(false); setForgotSuccess(false); }} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <span className="material-icons-round text-foreground/50">close</span>
              </button>
            </div>

            {!forgotSuccess ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <p className="text-foreground/60 leading-relaxed font-medium">
                  Insira seu e-mail corporativo e enviaremos um link seguro para redefinição.
                </p>
                <div>
                  <label className="block text-xs font-black text-foreground/40 uppercase tracking-widest mb-2 ml-1">E-mail</label>
                  <input
                    className="block w-full rounded-2xl border-border bg-slate-50 dark:bg-white/5 text-foreground focus:border-primary focus:ring-primary sm:text-sm py-4 px-5 shadow-sm transition-all"
                    placeholder="seu@email.com"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <button
                  className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-primary/20 text-sm font-black text-white bg-primary hover:bg-emerald-600 transition-all active:scale-95"
                  type="submit"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'ENVIAR LINK DE SEGURANÇA'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6 animate-spring-in">
                  <span className="material-icons-round text-4xl">mark_email_read</span>
                </div>
                <h4 className="text-2xl font-black text-foreground mb-3">E-mail Enviado!</h4>
                <p className="text-foreground/60 leading-relaxed font-medium mb-8">
                  As instruções de redefinição foram enviadas com sucesso para sua caixa de entrada.
                </p>
                <button
                  onClick={() => { setShowForgotModal(false); setForgotSuccess(false); }}
                  className="w-full py-5 px-4 bg-slate-100 dark:bg-white/5 text-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  CONCLUÍDO
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
