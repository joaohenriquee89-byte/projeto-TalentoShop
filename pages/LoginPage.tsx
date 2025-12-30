
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState('');

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === UserRole.VENDEDOR ? '/dashboard/vendedor' : '/dashboard/lojista');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); // Clear previous errors

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // No need to fetch profile or set user manually.
      // AuthContext detects onAuthStateChange -> fetches profile -> updates 'user' state -> useEffect above redirects.

    } catch (error: any) {
      console.error("Login error:", error);
      let msg = error.message;
      if (msg === "Invalid login credentials") {
        msg = "E-mail ou senha incorretos. Tente novamente.";
      } else if (msg === "Email not confirmed") {
        msg = "E-mail não confirmado. Verifique sua caixa de entrada.";
      } else {
        msg = "Falha ao entrar: " + msg;
      }
      setErrorMsg(msg);
      setLoading(false); // Stop loading only on error. On success, we wait for redirect.
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-200 bg-background-light dark:bg-slate-900">
      <div className="w-full max-w-6xl h-auto md:h-[800px] flex flex-col md:flex-row bg-surface-light dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          <Link to="/" className="flex items-center gap-2 mb-8 transform hover:scale-105 transition-transform origin-left">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 bg-primary rounded-xl opacity-90 rotate-3"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-secondary rounded-full border-2 border-white dark:border-surface-dark z-10 -mb-1 -mr-1"></div>
              <span className="material-icons-round absolute inset-0 flex items-center justify-center text-white text-xl">shopping_bag</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-primary dark:text-white">
              Talento<span className="text-secondary">Shop</span>
            </h1>
          </Link>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Bem-vindo de volta</h2>
            <p className="text-slate-500 dark:text-slate-400">Acesse o hub de talentos e oportunidades.</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl flex mb-8">
            <button
              className={`flex-1 flex items-center justify-center py-3 text-sm font-medium rounded-lg transition-all duration-300 ${role === UserRole.VENDEDOR ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              onClick={() => setRole(UserRole.VENDEDOR)}
            >
              <span className="material-icons-round text-lg mr-2">badge</span>
              Sou Vendedor
            </button>
            <button
              className={`flex-1 flex items-center justify-center py-3 text-sm font-medium rounded-lg transition-all duration-300 ${role === UserRole.LOJISTA ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              onClick={() => setRole(UserRole.LOJISTA)}
            >
              <span className="material-icons-round text-lg mr-2">storefront</span>
              Sou Lojista
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-start gap-3 animate-fade-in">
              <span className="material-icons-round text-red-500 mt-0.5">error</span>
              <p className="text-sm text-red-600 dark:text-red-300 font-medium leading-relaxed">{errorMsg}</p>
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
                  className="pl-10 block w-full rounded-xl border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm py-3 shadow-sm transition-all"
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
                  className="pl-10 block w-full rounded-xl border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm py-3 shadow-sm transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600" id="remember-me" name="remember-me" type="checkbox" />
                <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400" htmlFor="remember-me">Lembrar de mim</label>
              </div>
              <div className="text-sm">
                <a className="font-medium text-primary hover:text-petrol-700 dark:text-blue-400 dark:hover:text-blue-300" href="#">Esqueci minha senha</a>
              </div>
            </div>
            <div>
              <button className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary hover:bg-petrol-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar na Plataforma'}
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
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <img alt="Google" className="h-5 w-5 mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKsb6tOVQFw7LK0uFBc8s-WRlLnFXLHk3tsWde9QEFUSTFBaNYv3tGpOoXHvzrxKaPSW8mvoKpNc0GTmgdS6d5_PJjWwcpfAHVhTQRrxaJZ2_Hw68ylK6Tks0EMOt75-cJwbbDr7jIhDqdJuEcI-5uVxqm_HDrkT4nO4Qn0ysVz5DEItRwwIoCT00OnQ8t62HHrbJPaRXk3zYmwvxQ4BdB2wByRVMSxwQamYUdcP_WZg17v-OrtJJq06oeIWLa7UPKWCRHnQhziHQ" />
                Google
              </button>
              <button className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <img alt="LinkedIn" className="h-5 w-5 mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkRE4WlYKywSrWhvTEtWe9-TTwyn1_H9sw_PqC2KMiTFkL8DEwFNhLjK8LdqZriHQAEtPzzOCHbuN3BN0a_nMvOXFfAt4fkoE9vqAO194RGcF4l7Q0wXHNaZTri2n95ZYbuK-XkDHcGGOvSRwaJ2HhaWWKZKFAwMSXzPwnd39PwKdU7P73mEKU7YK6g1xXyX2ZSD92aHSIWfdUczUe9KLc-wDWEXepfoInmDHkEGAjAVXey05wn5GSqkpSLSv0Ltxgzlb0F0dLKG4" />
                LinkedIn
              </button>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Ainda não tem uma conta?
            <Link className="font-bold text-primary hover:text-petrol-700 dark:text-blue-400 dark:hover:text-blue-300 ml-1" to="/register/vendedor">Criar conta grátis</Link>
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
                <img alt="Avatar User" className="w-10 h-10 rounded-full border-2 border-secondary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWNj8CXVhxxIJ59JVgAam3T-AWfRJtmzsHg7EVmZclmNbKkJupKsuG4f_jKR8EF324U92omED-PKzgFEpOi8aDr06b2XTpUXbStVqejLQGGBdVjdkgxvy9YA2iQEMtYjrH8c9mpse-bEC1ZWq6wOxnVQHpi3i4XjdGm1I8Pd2z4LIDpD1uiPBnrvkZfPhpopQoxhwFzNQ1DTmqJh_zBWmemWcNwz0KqdOAlqX8EbceQZl2pG0rDVSEj9A-aQ5Wh28oOUHCmTZNAJ4" />
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
    </div>
  );
};

export default LoginPage;
