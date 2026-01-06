import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Job } from '../../types';
import UpgradeModal from '../../components/UpgradeModal';
import { supabase } from '../../src/lib/supabase';

interface VendedorDashboardProps {
  user: User;
  setUser: (user: User) => void;
}

const VendedorDashboard: React.FC<VendedorDashboardProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeConfig, setUpgradeConfig] = useState({ title: '', feature: '' });

  const userPlan = user?.plan?.toUpperCase() || 'FREE';
  const isPremium = userPlan !== 'FREE' && userPlan !== 'GRÁTIS' || userPlan === 'STANDARD';

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'lojista')
          .limit(50);

        if (error) throw error;

        if (data) {
          // Filter out profiles without company name to avoid "Loja Sem Nome"
          const validProfiles = data.filter(profile => profile.company_name && profile.company_name.trim() !== '');

          const mappedJobs: Job[] = validProfiles.map(profile => ({
            id: profile.id,
            companyName: profile.company_name,
            title: profile.sector || 'Varejo',
            location: profile.shopping_mall || profile.address?.cidade || 'Localização não informada',
            compatibility: Math.floor(Math.random() * (99 - 70 + 1)) + 70, // Simulated for now
            logoInitial: (profile.company_name || 'L').charAt(0).toUpperCase()
          }));
          setJobs(mappedJobs);
        }
      } catch (err) {
        console.error('Error fetching stores:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already real-time via filteredJobs, 
    // but the button can trigger a refresh or just visual feedback
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const filteredJobs = jobs.filter(job =>
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button onClick={() => setIsEditing(false)} className="mb-6 flex items-center gap-2 text-primary font-medium">
          <span className="material-icons-round">arrow_back</span> Voltar ao Dashboard
        </button>
        <div className="bg-surface-light dark:bg-surface-dark shadow rounded-xl p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Editar Perfil Profissional</h2>

          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img alt="Profile" className="h-32 w-32 rounded-full border-4 border-primary shadow-lg object-cover" src={currentAvatar} />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-icons-round text-white text-3xl">photo_camera</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Clique na foto para alterar</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                placeholder="Nome Completo"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
              <input
                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                placeholder="E-mail"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <textarea
                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 col-span-2"
                placeholder="Bio Profissional"
                defaultValue="Vendedor focado em resultados com 5 anos de experiência..."
                rows={4}
              />
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
    <div className="space-y-6">
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title={upgradeConfig.title}
        featureName={upgradeConfig.feature}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Olá, {user.name.split(' ')[0]}! 👋</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aqui está o resumo das suas conexões hoje.</p>
        </div>
        <div className="flex items-center bg-blue-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-blue-100 dark:border-gray-700">
          <span className="material-icons-round text-primary dark:text-secondary mr-2">verified</span>
          <span className="text-sm font-medium text-primary dark:text-white mr-2">Plano Atual:</span>
          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">FREE</span>
          <Link className="ml-4 text-sm font-semibold text-secondary hover:text-green-600 underline decoration-2 underline-offset-2" to="/dashboard/vendedor/plans">Fazer Upgrade</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-surface-light dark:bg-surface-dark shadow rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="h-24 bg-gradient-to-r from-primary to-secondary"></div>
            <div className="px-6 pb-6 relative">
              <div className="-mt-12 mb-4">
                <img alt="Profile" className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover" src={currentAvatar} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-primary dark:text-secondary font-medium text-sm mb-4">Shopping Morumbi • São Paulo, SP</p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-icons-round mr-2 text-gray-400">work_outline</span>
                  <span>Experiência: 5 anos</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-icons-round mr-2 text-gray-400">grade</span>
                  <span>Especialidade: Moda Masculina</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completude do Perfil</span>
                  <span className="text-sm font-bold text-primary dark:text-secondary">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <button onClick={() => setIsEditing(true)} className="mt-4 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-blue-100 dark:border-gray-700 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-secondary">auto_awesome</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dicas da IA</h3>
            </div>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                <span className="material-icons-round text-yellow-500 text-base mr-2 mt-0.5">lightbulb</span>
                Adicione um vídeo de apresentação curto.
              </li>
              <li className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                <span className="material-icons-round text-yellow-500 text-base mr-2 mt-0.5">lightbulb</span>
                Liste suas últimas 2 conquistas de vendas.
              </li>
            </ul>
          </div>
        </div>

        {/* Job Listings Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-primary rounded-xl shadow-lg p-6 text-white relative overflow-hidden group">
            <div className="relative z-10 sm:flex justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="material-icons-round">rocket_launch</span>
                  Acelere sua contratação
                </h3>
                <p className="text-blue-100 text-sm">
                  Usuários Premium aparecem no topo das buscas e têm acesso ilimitado.
                </p>
              </div>
              <Link to="/dashboard/vendedor/plans" className="bg-secondary hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 inline-block text-center">
                Quero ser Premium
              </Link>
            </div>
          </div>

          <div className="bg-[#1e2533] dark:bg-surface-dark shadow-xl rounded-xl border border-slate-700 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-icons-round text-secondary">storefront</span>
                Buscar Lojas Contratando
              </h3>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="relative flex-grow">
                <span className="material-icons-round absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">search</span>
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-md bg-[#161b26] dark:bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-secondary sm:text-sm"
                  placeholder="Ex: Zara, Shopping Iguatemi..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-md font-bold text-sm transition-all active:scale-95">Buscar</button>
            </form>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400 text-sm animate-pulse">Buscando lojas compatíveis...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#161b26] dark:bg-gray-800 border border-slate-700 rounded-lg hover:border-secondary transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-110 ${job.logoInitial === 'Z' ? 'bg-black text-white' : 'bg-slate-700 text-white'}`}>
                        {job.logoInitial}
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white">{job.companyName}</h4>
                        <p className="text-sm text-slate-400">{job.title} • {job.location}</p>
                        {job.compatibility && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-900/40 text-green-400 border border-green-800/50 mt-1">
                            {job.compatibility}% Match
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!isPremium) {
                          setUpgradeConfig({
                            title: "Candidatura Bloqueada",
                            feature: "candidatar-se a vagas e ver detalhes exclusivos"
                          });
                          setUpgradeModalOpen(true);
                          return;
                        }
                      }}
                      className="text-secondary font-bold text-sm hover:text-green-400 transition-colors"
                    >
                      {isPremium ? 'Ver Detalhes' : 'Desbloquear Vaga'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <span className="material-icons-round text-slate-600 text-4xl mb-2">search_off</span>
                  <p className="text-slate-500">Nenhuma loja encontrada para "{searchTerm}"</p>
                </div>
              )}

              <div className="relative group p-4 border border-dashed border-slate-600 rounded-lg flex items-center justify-center bg-black/20">
                <div className="text-center">
                  <span className="material-icons-round text-secondary text-2xl mb-1">lock</span>
                  <p className="text-xs text-slate-400 font-medium">Upgrade para ver mais 15 vagas compatíveis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorDashboard;
