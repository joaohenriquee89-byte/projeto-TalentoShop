
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-display font-bold text-2xl text-primary dark:text-white">Talento<span className="text-secondary">Shop</span></span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              A plataforma definitiva de conexões inteligentes para o varejo moderno. Transformando o futuro das contratações.
            </p>
            <div className="flex gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-primary transition-colors cursor-pointer">
                <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors">verified_user</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-primary transition-colors cursor-pointer">
                <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors">security</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 group hover:border-primary transition-colors cursor-pointer">
                <span className="material-icons-round text-slate-400 group-hover:text-primary transition-colors">payments</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Plataforma</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="/register/vendedor">Para Vendedores</Link></li>
              <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="/register/lojista">Para Lojistas</Link></li>
              <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="/pricing">Planos & Preços</Link></li>
              <li><a className="hover:text-primary dark:hover:text-white transition-colors" href="#features">Funcionalidades</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Empresa</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Sobre a TalentoShop</a></li>
              <li><a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Blog & Notícias</a></li>
              <li><a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Carreiras</a></li>
              <li><a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Legal & Suporte</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li><a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Termos de Uso</a></li>
              <li><a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Política de Privacidade</a></li>
              <li><a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Central de Ajuda</a></li>
              <li><a className="hover:text-primary dark:hover:text-white transition-colors" href="#">Segurança</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 order-2 md:order-1">
            © 2025 TalentoShop. Tecnologia segura via Mercado Pago.
          </p>
          <div className="flex space-x-6 order-1 md:order-2">
            <a className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors" href="#"><span className="material-icons-round text-xl">language</span></a>
            <a className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors" href="#"><span className="material-icons-round text-xl">camera_alt</span></a>
            <a className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors" href="#"><span className="material-icons-round text-xl">alternate_email</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
