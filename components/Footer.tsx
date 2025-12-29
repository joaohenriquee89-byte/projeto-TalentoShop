
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer class="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center gap-2 mb-4">
              <span class="font-display font-bold text-xl text-primary dark:text-white">Talento<span class="text-secondary">Shop</span></span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Tecnologia a favor das conexões humanas no varejo.
            </p>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white mb-4">Plataforma</h4>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link class="hover:text-primary dark:hover:text-white transition" to="/register/vendedor">Vendedores</Link></li>
              <li><Link class="hover:text-primary dark:hover:text-white transition" to="/register/lojista">Lojistas</Link></li>
              <li><Link class="hover:text-primary dark:hover:text-white transition" to="/pricing">Preços</Link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white mb-4">Empresa</h4>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a class="hover:text-primary dark:hover:text-white transition" href="#">Sobre nós</a></li>
              <li><a class="hover:text-primary dark:hover:text-white transition" href="#">Carreiras</a></li>
              <li><a class="hover:text-primary dark:hover:text-white transition" href="#">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a class="hover:text-primary dark:hover:text-white transition" href="#">Privacidade</a></li>
              <li><a class="hover:text-primary dark:hover:text-white transition" href="#">Termos de Uso</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-slate-100 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-slate-500 dark:text-slate-400">© 2023 TalentoShop SaaS. Todos os direitos reservados.</p>
          <div class="flex space-x-4 mt-4 md:mt-0">
            <a class="text-slate-400 hover:text-primary dark:hover:text-white transition" href="#"><span class="material-icons-round text-lg">public</span></a> 
            <a class="text-slate-400 hover:text-primary dark:hover:text-white transition" href="#"><span class="material-icons-round text-lg">photo_camera</span></a> 
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
