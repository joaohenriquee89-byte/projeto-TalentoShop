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
  const [isSaving, setIsSaving] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeConfig, setUpgradeConfig] = useState({ title: '', feature: '' });

  // Full Profile State
  const [profileData, setProfileData] = useState({
    phone: '',
    experience_years: '',
    specialty: '', // Will use first item of skills array or 'Vendas'
    shopping_mall: '',
    bio: '',
    resume_url: ''
  });

  const userPlan = user?.plan?.toUpperCase() || 'FREE';
  const isPremium = userPlan !== 'FREE' && userPlan !== 'GRÁTIS' || userPlan === 'STANDARD';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch User's Full Profile
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userProfile) {
          setProfileData({
            phone: userProfile.phone || '',
            experience_years: userProfile.experience_years || '',
            specialty: userProfile.skills?.[0] || 'Vendas',
            shopping_mall: userProfile.shopping_mall || '',
            bio: userProfile.bio || 'Vendedor focado em resultados...',
            resume_url: userProfile.resume_url || ''
          });

          // Update prop user avatar if changed remotely
          if (userProfile.avatar_url && userProfile.avatar_url !== user.avatar) {
            setUser({ ...user, avatar: userProfile.avatar_url });
          }
        }

        // 2. Fetch Stores (Jobs)
        const { data: storesData, error: storesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'lojista')
          .limit(50);

        if (storesData) {
          const validProfiles = storesData.filter(profile => profile.company_name && profile.company_name.trim() !== '');

          const mappedJobs: Job[] = validProfiles.map(profile => ({
            id: profile.id,
            companyName: profile.company_name,
            title: profile.sector || 'Varejo',
            type: profile.sector || 'Varejo',
            status: 'Ativa' as const,
            user_id: profile.id,
            location: profile.shopping_mall || profile.address?.cidade || 'Localização não informada',
            compatibility: Math.floor(Math.random() * (99 - 70 + 1)) + 70,
            logoInitial: (profile.company_name || 'L').charAt(0).toUpperCase()
          }));
          setJobs(mappedJobs);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const filteredJobs = jobs.filter(job =>
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        setUser({ ...user, avatar: publicUrl });

        // Update profile in DB immediately
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);

      } catch (error: any) {
        alert('Erro ao carregar imagem: ' + error.message);
      }
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, selecione um arquivo PDF.');
        return;
      }

      setIsSaving(true);
      try {
        const fileName = `${user.id}/resume.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, file, {
            upsert: true,
            contentType: 'application/pdf'
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName);

        setProfileData(prev => ({ ...prev, resume_url: publicUrl }));

        // Update profile in DB
        await supabase.from('profiles').update({ resume_url: publicUrl }).eq('id', user.id);

        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);

      } catch (error: any) {
        alert('Erro ao carregar currículo: ' + error.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Prepare skills array
      const skillsArray = profileData.specialty.split(',').map(s => s.trim()).filter(s => s !== '');

      const updates = {
        full_name: user.name,
        phone: profileData.phone,
        experience_years: profileData.experience_years,
        skills: skillsArray,
        shopping_mall: profileData.shopping_mall,
        bio: profileData.bio
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 4000);

    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      const errorMsg = err.message || (err.error_description) || "Erro desconhecido";
      alert(`Erro ao salvar alterações: ${errorMsg}. Tente novamente.`);
    } finally {
      setIsSaving(false);
    }
  };

  const currentAvatar = user.avatar || `https://picsum.photos/seed/${user.id}/200/200`;

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in pb-10">
        <button onClick={() => setIsEditing(false)} className="mb-6 flex items-center gap-2 text-primary font-medium hover:underline">
          <span className="material-icons-round">arrow_back</span> Voltar ao Dashboard
        </button>
        <div className="bg-surface-light dark:bg-surface-dark shadow-2xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-8 dark:text-white flex items-center gap-2">
            <span className="material-icons-round text-primary">edit_note</span>
            Editar Perfil Profissional
          </h2>

          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img alt="Profile" className="h-32 w-32 rounded-full border-4 border-primary shadow-lg object-cover transition-transform group-hover:scale-105" src={currentAvatar} />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <span className="material-icons-round text-white text-3xl">photo_camera</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <p className="mt-3 text-sm font-medium text-primary cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>Alterar foto de perfil</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                <input
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail (apenas leitura)</label>
                <input
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-gray-400 p-2.5 cursor-not-allowed"
                  value={user.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone / WhatsApp</label>
                <input
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="(11) 99999-9999"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Localização / Shopping</label>
                <input
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Ex: Shopping Morumbi, SP"
                  value={profileData.shopping_mall}
                  onChange={(e) => setProfileData({ ...profileData, shopping_mall: e.target.value })}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 pt-4">Carreira & Experiência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anos de Experiência</label>
                <select
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  value={profileData.experience_years}
                  onChange={(e) => setProfileData({ ...profileData, experience_years: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="Sem experiência">Sem experiência</option>
                  <option value="Menos de 1 ano">Menos de 1 ano</option>
                  <option value="1 a 3 anos">1 a 3 anos</option>
                  <option value="3 a 5 anos">3 a 5 anos</option>
                  <option value="Mais de 5 anos">Mais de 5 anos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidade Principal</label>
                <input
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Ex: Vendas, Gerência, Moda..."
                  value={profileData.specialty}
                  onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio Profissional / Sobre Mim</label>
                <textarea
                  className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[120px]"
                  placeholder="Conte um pouco sobre sua trajetória profissional..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Dica: Descreva suas principais conquistas e o que você busca na próxima oportunidade.</p>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currículo (PDF)</label>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="material-icons-round text-3xl text-gray-400">picture_as_pdf</span>
                  <div className="flex-1">
                    {profileData.resume_url ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Currículo atual carregado</span>
                        <a href={profileData.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-bold">Ver PDF</a>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Nenhum currículo carregado</span>
                    )}
                  </div>
                  <input type="file" id="resume-upload" className="hidden" accept=".pdf" onChange={handleResumeUpload} />
                  <label htmlFor="resume-upload" className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    {profileData.resume_url ? 'Alterar PDF' : 'Enviar PDF'}
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-3">
              <button onClick={() => setIsEditing(false)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 bg-primary text-white font-bold py-3 rounded-lg shadow-lg hover:bg-petrol-700 transition-all flex justify-center items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <span className="material-icons-round">save</span>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {showSaveSuccess && (
        <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce-in z-[100] border-2 border-white/20 backdrop-blur-sm">
          <span className="material-icons-round">check_circle</span>
          <span className="font-bold">Salvo com sucesso!</span>
        </div>
      )}
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
        <div className="flex items-center bg-primary/5 dark:bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20 backdrop-blur-sm">
          <span className="material-icons-round text-primary mr-2">verified</span>
          <span className="text-sm font-bold text-primary mr-2">Plano Atual:</span>
          <span className="text-sm font-black text-foreground/60 uppercase tracking-tighter">{userPlan}</span>
          <Link className="ml-4 text-sm font-bold text-primary hover:text-emerald-600 underline decoration-2 underline-offset-4" to="/dashboard/vendedor/plans">Fazer Upgrade</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card shadow-2xl rounded-2xl overflow-hidden border border-border/50 backdrop-blur-md">
            <div className="h-24 bg-gradient-to-r from-primary via-emerald-500 to-accent"></div>
            <div className="px-6 pb-8 relative">
              <div className="-mt-12 mb-4">
                <img alt="Profile" className="h-24 w-24 rounded-[1.25rem] border-4 border-white dark:border-slate-800 shadow-xl object-cover" src={currentAvatar} />
              </div>
              <h2 className="text-xl font-black text-foreground">{user.name}</h2>
              <p className="text-primary font-bold text-sm mb-6 tracking-tight">
                {profileData.shopping_mall || 'Localização não definida'}
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-icons-round mr-2 text-gray-400">work_outline</span>
                  <span>Experiência: {profileData.experience_years || '--'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-icons-round mr-2 text-gray-400">grade</span>
                  <span>Especialidade: {profileData.specialty || '--'}</span>
                </div>
                {profileData.resume_url && (
                  <div className="pt-2">
                    <a
                      href={profileData.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-primary dark:text-secondary font-bold hover:underline"
                    >
                      <span className="material-icons-round mr-2">description</span>
                      Ver Meu Currículo PDF
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completude do Perfil</span>
                  <span className="text-sm font-bold text-primary dark:text-secondary">85%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full shadow-lg shadow-primary/20" style={{ width: '85%' }}></div>
                </div>
                <button onClick={() => setIsEditing(true)} className="mt-6 w-full py-3 px-4 border border-border dark:bg-white/5 rounded-2xl shadow-sm text-sm font-bold text-foreground hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95">
                  Editar Perfil Profissional
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-primary/20 rounded-2xl p-8 relative overflow-hidden shadow-2xl backdrop-blur-xl group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-icons-round text-primary animate-pulse">auto_awesome</span>
              <h3 className="text-lg font-black text-foreground tracking-tight">Dicas da IA de Elite</h3>
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
          <div className="bg-primary rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-600 opacity-90"></div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px] group-hover:bg-accent/30 transition-colors"></div>
            <div className="relative z-10 sm:flex justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                  <span className="material-icons-round text-accent">rocket_launch</span>
                  Acelere sua contratação
                </h3>
                <p className="text-white/80 font-medium max-w-md">
                  Vendedores de Elite aparecem no topo das buscas e têm acesso ilimitado às melhores marcas.
                </p>
              </div>
              <Link to="/dashboard/vendedor/plans" className="bg-white text-primary font-black py-4 px-8 rounded-2xl transition-all hover:scale-105 hover:bg-emerald-50 shadow-2xl active:scale-95 inline-block text-center whitespace-nowrap">
                Ser Premium agora
              </Link>
            </div>
          </div>

          <div className="bg-card dark:bg-[#07090D] shadow-2xl rounded-2xl border border-border/50 p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                <span className="material-icons-round text-primary">storefront</span>
                Marcas em Destaque
              </h3>
            </div>
            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
              <div className="relative flex-grow">
                <span className="material-icons-round absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                <input
                  className="block w-full pl-12 pr-4 py-4 border border-border rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-foreground placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all"
                  placeholder="Ex: Zara, Shopping Iguatemi..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-primary hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-primary/20">BUSCAR</button>
            </form>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400 text-sm animate-pulse">Buscando lojas compatíveis...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-white/5 border border-border/50 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className={`h-14 w-14 rounded-xl flex items-center justify-center text-xl font-black transition-transform group-hover:rotate-6 ${job.logoInitial === 'Z' ? 'bg-black text-white' : 'bg-primary/10 text-primary'}`}>
                        {job.logoInitial}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{job.companyName}</h4>
                        <p className="text-sm text-foreground/50 font-medium">{job.title} • {job.location}</p>
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
