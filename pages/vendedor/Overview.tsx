import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Job, UserRole } from '../../types';
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
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Full Profile State
  const [profileData, setProfileData] = useState({
    phone: '',
    experience_years: '',
    specialty: '',
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
        const { data: userProfile } = await supabase
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

          if (userProfile.avatar_url && userProfile.avatar_url !== user.avatar) {
            setUser({ ...user, avatar: userProfile.avatar_url });
          }
        }

        const { data: storesData } = await supabase
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
        setUser({ ...user, avatar: publicUrl });
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      } catch (error: any) {
        alert('Erro ao carregar imagem: ' + error.message);
      }
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsSaving(true);
      try {
        const fileName = `${user.id}/resume.pdf`;
        const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, file, { upsert: true, contentType: 'application/pdf' });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName);
        setProfileData(prev => ({ ...prev, resume_url: publicUrl }));
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
      const skillsArray = profileData.specialty.split(',').map(s => s.trim()).filter(s => s !== '');
      const { error } = await supabase.from('profiles').update({
        full_name: user.name,
        phone: profileData.phone,
        experience_years: profileData.experience_years,
        skills: skillsArray,
        shopping_mall: profileData.shopping_mall,
        bio: profileData.bio
      }).eq('id', user.id);
      if (error) throw error;
      setIsEditing(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(`Erro ao salvar alterações: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const currentAvatar = user.avatar || `https://picsum.photos/seed/${user.id}/200/200`;

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in py-10">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
          <div className="bg-slate-50/50 dark:bg-white/5 backdrop-blur-md p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <span className="material-icons-round text-2xl">person_pin</span>
                </div>
                Editar Perfil Profissional
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Refine como as melhores marcas veem você.</p>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 transition-all active:scale-95"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>

          <div className="p-10 space-y-12">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative w-40 h-40 rounded-full border-[6px] border-white dark:border-slate-800 shadow-2xl overflow-hidden z-10 text-center">
                  <img
                    src={currentAvatar}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <label className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                    <span className="material-icons-round text-3xl mb-1">photo_camera</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Alterar Foto</span>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
              <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sua Foto Profissional</p>
            </div>

            <div className="space-y-8 text-center sm:text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    placeholder="Seu Nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp de Contato</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anos de Experiência</label>
                  <select
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
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

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Especialidade Principal</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                    value={profileData.specialty}
                    onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                    placeholder="Ex: Vendas, Moda, Gerência"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currículo (PDF)</label>
                  <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center text-primary">
                      <span className="material-icons-round text-2xl">description</span>
                    </div>
                    <div className="flex-1">
                      {profileData.resume_url ? (
                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">Documento Verificado ✓</p>
                      ) : (
                        <p className="text-sm text-slate-500 italic">Nenhum currículo em PDF carregado</p>
                      )}
                    </div>
                    <input type="file" id="resume-upload" className="hidden" accept=".pdf" onChange={handleResumeUpload} />
                    <label htmlFor="resume-upload" className="px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 transition-all active:scale-95 shadow-lg">
                      {profileData.resume_url ? 'ALTERAR PDF' : 'SUBIR CURRÍCULO'}
                    </label>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resumo Profissional / Bio</label>
                  <textarea
                    className="w-full p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Fale sobre seus principais diferenciais em vendas..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-5 px-6 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  Descartar
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-[2] py-5 px-8 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                      GRAVANDO...
                    </>
                  ) : (
                    <>
                      <span className="material-icons-round text-sm">save</span>
                      SALVAR ALTERAÇÕES
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-7xl mx-auto py-4">
      {showSaveSuccess && (
        <div className="fixed top-24 right-8 bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-spring-in z-[100] font-black border border-white/20">
          <span className="material-icons-round">check_circle</span>
          Perfil atualizado com sucesso!
        </div>
      )}

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title={upgradeConfig.title}
        featureName={upgradeConfig.feature}
      />

      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 text-white p-10 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/30 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              Pilar Vendedor • Hub de Elite
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
              Olá, <span className="text-primary italic">{user.name.split(' ')[0]}!</span> 👋
            </h1>
            <p className="text-white/60 text-lg max-w-xl font-medium leading-relaxed">
              Sua jornada de vendas ganha novos capítulos hoje. Explore as melhores marcas de shoppings e feche seu próximo grande contrato.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-[1.5rem] border border-white/10 group hover:border-primary/50 transition-all">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-2xl">stars</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status da Conta</p>
                <p className="text-xl font-black tracking-tight">{userPlan}</p>
              </div>
              {userPlan === 'FREE' && (
                <Link to="/dashboard/vendedor/plans" className="ml-4 p-3 bg-primary text-white rounded-xl hover:bg-emerald-400 transition-all">
                  <span className="material-icons-round text-lg">upgrade</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Stats Sidebar */}
        <div className="lg:col-span-1 space-y-10">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 dark:from-white/5 to-transparent"></div>

            <div className="relative flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-accent rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img alt="Profile" className="relative h-32 w-32 rounded-[2rem] border-4 border-white dark:border-slate-800 shadow-2xl object-cover z-10" src={currentAvatar} />
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center">{user.name}</h2>
              <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1 mb-8">{profileData.specialty}</p>

              <div className="w-full space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="material-icons-round text-slate-400">shopping_bag</span>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Localização</p>
                    <p className="text-sm font-bold truncate">{profileData.shopping_mall || 'Não informada'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                  <span className="material-icons-round text-slate-400">history</span>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Experiência</p>
                    <p className="text-sm font-bold">{profileData.experience_years || '--'}</p>
                  </div>
                </div>
              </div>

              <div className="w-full mt-10 pt-10 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score do Perfil</span>
                  <span className="text-sm font-black text-primary">85%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 shadow-inner">
                  <div className="bg-primary h-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: '85%' }}></div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-8 w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
                >
                  EDITAR MEU PERFIL
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-icons-round text-2xl">auto_awesome</span>
              </div>
              <h3 className="text-lg font-bold tracking-tight">Vantagens PRO</h3>
            </div>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-start gap-3">
                <span className="material-icons-round text-primary text-sm mt-0.5">verified_user</span>
                <p className="text-xs text-white/70 leading-relaxed"><span className="text-white font-bold">Destaque Total:</span> Apareça nas primeiras páginas para as marcas de luxo.</p>
              </li>
            </ul>
            <Link to="/dashboard/vendedor/plans" className="mt-8 block text-center py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              CONHECER PLANOS
            </Link>
          </div>
        </div>

        {/* Content Area: Store Search / Feed */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border/50 p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 dark:bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <span className="material-icons-round text-primary">storefront</span>
                Oportunidades Recomendadas
              </h3>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-white/5">
                  Moda & Acessórios
                </div>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-10 relative z-10">
              <div className="relative flex-grow">
                <span className="material-icons-round absolute inset-y-0 left-5 flex items-center text-slate-400">search</span>
                <input
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                  placeholder="Ex: Shopping Recife, Moda, Vendas..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-primary hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95">BUSCAR</button>
            </form>

            <div className="space-y-4 relative z-10">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-slate-400 font-bold tracking-widest text-[10px] uppercase animate-pulse">Analizando seu perfil para o match ideal...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <div key={job.id} className="group p-6 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-3xl hover:border-primary/40 hover:bg-white dark:hover:bg-white/5 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg transition-transform group-hover:rotate-6 ${job.logoInitial === 'Z' ? 'bg-black text-white' : 'bg-primary text-white'}`}>
                          {job.logoInitial}
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">{job.companyName}</h4>
                          <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                            <span className="material-icons-round text-base">location_on</span>
                            {job.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 dark:border-white/5 pt-4 sm:pt-0">
                        <div className="text-right flex-1 sm:flex-none">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Compatibilidade</p>
                          <p className="text-xl font-black text-emerald-500 leading-none">{job.compatibility}%</p>
                        </div>
                        <button
                          onClick={() => {
                            if (!isPremium) {
                              setUpgradeConfig({
                                title: "Candidatura Elite",
                                feature: "entrar em contato direto com as lojas e ver detalhes da vaga"
                              });
                              setUpgradeModalOpen(true);
                            }
                          }}
                          className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${isPremium
                              ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white'
                              : 'bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10'
                            }`}
                        >
                          {isPremium ? 'VER DETALHES' : 'DESBLOQUEAR'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 opacity-40">
                  <span className="material-icons-round text-6xl mb-4">search_off</span>
                  <p className="font-bold tracking-widest text-xs uppercase">Nenhuma loja encontrada na sua região</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-primary p-1 rounded-[2.5rem] shadow-2xl">
            <div className="bg-slate-900 rounded-[2.3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h4 className="text-2xl font-black text-white tracking-tight mb-4 flex items-center gap-3">
                  <span className="material-icons-round text-primary">auto_awesome</span>
                  Radar de Vagas de Elite
                </h4>
                <p className="text-white/50 text-base font-medium leading-relaxed">
                  Assine o plano Pro para ser notificado instantaneamente quando marcas do seu interesse abrirem novas vagas nos seus shoppings favoritos.
                </p>
              </div>
              <Link to="/dashboard/vendedor/plans" className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-400 transition-all flex items-center gap-3">
                SER PRO POR R$ 9,90
                <span className="material-icons-round text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorDashboard;
