
import React, { useState, useRef } from 'react';
import { User, Candidate } from '../types';

interface LojistaDashboardProps {
  user: User;
  setUser: (user: User) => void;
}

const LojistaDashboard: React.FC<LojistaDashboardProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [candidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Mariana Costa',
      title: 'Vendedora Sênior • Moda & Acessórios',
      experience: '5 anos de experiência em varejo de alto padrão.',
      matchScore: 95,
      tags: ['Inglês Intermediário', 'CRM', 'Metas'],
      avatar: 'https://picsum.photos/seed/mari/150/150'
    },
    {
      id: '2',
      name: 'Carlos Mendes',
      title: 'Gerente de Loja • Tecnologia',
      experience: 'Gestão de equipe e estoque. Experiência FastShop.',
      matchScore: 78,
      tags: ['Gestão', 'Eletrônicos'],
      avatar: 'https://picsum.photos/seed/car/150/150'
    }
  ]);

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

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <button onClick={() => setIsEditing(false)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-800 rounded-lg mb-4">
          <span className="material-icons-round">arrow_back</span>
          <span>Voltar</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Editar Perfil do Lojista</h1>
        <div className="bg-surface-light dark:bg-surface-dark shadow rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img alt="Profile" className="h-32 w-32 rounded-full border-4 border-secondary shadow-lg object-cover" src={currentAvatar} />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-icons-round text-white text-3xl">photo_camera</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Clique na foto para alterar</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Loja/Responsável</label>
                <input
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail Corporativo</label>
                <input
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
            </div>
            <button onClick={() => setIsEditing(false)} className="w-full bg-primary text-white font-bold py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all">
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Buscar Candidatos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Encontre o vendedor ideal para sua loja</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          342 Vendedores disponíveis
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="xl:col-span-1 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit sticky top-24">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Filtros</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Localização</label>
                <button className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <span className="material-icons-round text-sm">my_location</span>
                  Ao vivo
                </button>
              </div>
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-2.5 text-gray-400 text-lg">storefront</span>
                <select className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm pl-10 pr-3 py-2.5 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary appearance-none custom-select">
                  <option>Todos os Shoppings</option>
                  <option>Shopping Iguatemi (SP)</option>
                  <option>Barra Shopping (RJ)</option>
                  <option>Morumbi Shopping (SP)</option>
                  <option>Shopping Recife (PE)</option>
                </select>
                <span className="material-icons-round absolute right-3 top-3 text-gray-400 text-sm pointer-events-none">expand_more</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Mapas atualizados em tempo real
              </p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Experiência</label>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">0 anos</span>
              </div>
              <input type="range" className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Iniciante</span>
                <span>10+ anos</span>
              </div>
            </div>
            <button className="w-full bg-petrol-600 hover:bg-petrol-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
              Aplicar Filtros
              <span className="material-icons-round text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-gradient-to-r from-petrol-800 to-primary rounded-xl p-4 text-white flex justify-between items-center shadow-lg">
            <div>
              <h3 className="font-bold flex items-center gap-2">
                <span className="material-icons-round text-secondary">auto_awesome</span>
                Agilize sua busca com IA
              </h3>
              <p className="text-sm opacity-80 mt-1">Encontre compatibilidades de até 98% com nossa análise preditiva.</p>
            </div>
            <button className="bg-white text-primary px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm">Desbloquear IA</button>
          </div>

          <div className="space-y-4">
            {candidates.map(candidate => (
              <div key={candidate.id} className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                <div className="flex flex-col sm:flex-row gap-5">
                  <img alt={candidate.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm" src={candidate.avatar} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{candidate.name}</h3>
                        <p className="text-primary dark:text-blue-300 font-medium text-sm">{candidate.title}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1 rounded font-medium border border-green-200 dark:border-green-800">Match {candidate.matchScore}%</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">{candidate.experience}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {candidate.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded border border-gray-200 dark:border-gray-700">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400 text-sm cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800">Exportar CV</button>
                  <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 shadow-sm transition-all">Ver Perfil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LojistaDashboard;
