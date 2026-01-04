import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { SHOPPINGS_LIST } from '../src/constants/data';
import SuccessModal from '../components/SuccessModal';
import Combobox from '../components/Combobox';

const LojistaRegister: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Company Data
  const [companyData, setCompanyData] = useState({
    nomeEmpresa: '',
    tipoUnidade: 'Loja',
    cnpj: '', // Add if needed in UI, assume UI might not have it or I need to add it. UI doesn't have CNPJ field visible in previous view! I should add it.
  });

  const [selectedShopping, setSelectedShopping] = useState('');
  const [manualShopping, setManualShopping] = useState('');
  const [selectedSetor, setSelectedSetor] = useState('');
  const [manualSetor, setManualSetor] = useState('');

  // Address
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState({
    rua: '',
    bairro: '',
    cidade: '',
    uf: '',
    numero: '',
    complemento: '',
    lat: '',
    lng: ''
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [cnpjError, setCnpjError] = useState('');

  // Responsible Data
  const [responsibleData, setResponsibleData] = useState({
    nome: '',
    cpf: '',
    rg: '',
    funcao: '',
    celular: '',
    email: '',
    password: '',
    confirmPassword: ''
  });



  const navigate = useNavigate();

  const shoppings = SHOPPINGS_LIST;

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'cnpj') formattedValue = formatCNPJ(value);
    setCompanyData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleResponsibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') formattedValue = formatCPF(value);
    if (name === 'celular') formattedValue = formatPhone(value);
    if (name === 'nome') {
      // Impedir números no nome
      formattedValue = value.replace(/[0-9]/g, '');
    }

    setResponsibleData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const fetchCoordinates = async (logradouro: string, cidade: string, uf: string) => {
    try {
      const query = encodeURIComponent(`${logradouro}, ${cidade}, ${uf}, Brasil`);
      // Nominatim (OpenStreetMap) para geocoding gratuito
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        setAddress(prev => ({
          ...prev,
          lat: data[0].lat,
          lng: data[0].lon
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar coordenadas:", err);
    }
  };

  const [cepError, setCepError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (password: string) => {
    let score = 0;
    if (password.length > 5) score += 1;
    if (password.length > 7) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
  };

  // Funções de Máscara e Formatação
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    setCepError(''); // Clear previous error

    if (cleanCep.length === 8) {
      setLoadingCep(true);
      setLoadingCep(true);
      try {
        // Try ViaCEP first
        let data;
        let success = false;

        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          if (!response.ok) throw new Error('ViaCEP error');
          data = await response.json();
          if (!data.erro) {
            success = true;
            setAddress(prev => ({
              ...prev,
              rua: data.logradouro || '',
              bairro: data.bairro || '',
              cidade: data.localidade || '',
              uf: data.uf || ''
            }));
            // Fetch coords
            if (data.logradouro && data.localidade) {
              await fetchCoordinates(data.logradouro, data.localidade, data.uf);
            }
          }
        } catch (e) {
          console.warn("ViaCEP attempt failed", e);
        }

        // 2. Try BrasilAPI if ViaCEP failed
        if (!success) {
          try {
            const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
            if (response.ok) {
              data = await response.json();
              setAddress(prev => ({
                ...prev,
                rua: data.street || '',
                bairro: data.neighborhood || '',
                cidade: data.city || '',
                uf: data.state || ''
              }));
              if (data.street && data.city) {
                await fetchCoordinates(data.street, data.city, data.state);
              }
              success = true;
            }
          } catch (e) {
            console.warn("BrasilAPI attempt failed", e);
          }
        }

        if (!success) {
          setCepError("CEP não encontrado.");
        }

      } catch (error) {
        console.error("Erro geral no CEP:", error);
        setCepError("Erro ao buscar CEP.");
      } finally {
        setLoadingCep(false);
      }
    } else if (cleanCep.length > 0 && cleanCep.length < 8) {
      setCepError("CEP inválido.");
    }
  };

  const handleCnpjBlur = async () => {
    const cleanCnpj = companyData.cnpj.replace(/\D/g, '');
    setCnpjError('');

    if (cleanCnpj.length === 14) {
      setLoadingCnpj(true);
      try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
        if (!response.ok) throw new Error('CNPJ não encontrado');

        const data = await response.json();

        // Populate Company Data
        setCompanyData(prev => ({
          ...prev,
          nomeEmpresa: data.nome_fantasia || data.razao_social || prev.nomeEmpresa
        }));

        // Populate Address
        setAddress(prev => ({
          ...prev,
          rua: data.logradouro || prev.rua,
          bairro: data.bairro || prev.bairro,
          cidade: data.municipio || prev.cidade,
          uf: data.uf || prev.uf
        }));

        if (data.cep) {
          setCep(formatCEP(data.cep));
        }

        // Fetch coordinates if we have enough address data
        if (data.logradouro && data.municipio) {
          await fetchCoordinates(data.logradouro, data.municipio, data.uf);
        }

      } catch (error) {
        console.error("Erro ao buscar CNPJ:", error);
        setCnpjError("CNPJ não encontrado ou erro na busca.");
      } finally {
        setLoadingCnpj(false);
      }
    } else if (cleanCnpj.length > 0 && cleanCnpj.length < 14) {
      setCnpjError("CNPJ inválido.");
    }
  };

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
    buttonText: '',
    redirectUrl: ''
  });

  const handleRegister = async () => {
    if (!responsibleData.email || !responsibleData.password || !responsibleData.rg) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha todos os campos obrigatórios (*).',
        buttonText: 'Entendi',
        redirectUrl: ''
      });
      return;
    }
    setLoading(true);
    try {
      console.log('Step 1: Creating auth user WITHOUT metadata...');

      // 1. Create auth user WITHOUT metadata to avoid trigger issues
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: responsibleData.email,
        password: responsibleData.password
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      if (!authData.user) throw new Error("Erro ao criar usuário");

      console.log('Step 2: Auth user created, ID:', authData.user.id);

      // 2. Manually create profile
      const profileData = {
        id: authData.user.id,
        email: responsibleData.email,
        full_name: responsibleData.nome,
        user_type: 'lojista',
        company_name: companyData.nomeEmpresa,
        unit_type: companyData.tipoUnidade,
        sector: isOtherSetor ? manualSetor : selectedSetor,
        shopping_mall: selectedShopping,
        address: { ...address, cep: cep.replace(/\D/g, '') },
        cnpj: companyData.cnpj.replace(/\D/g, ''),
        phone: responsibleData.celular.replace(/\D/g, ''),
        rg: responsibleData.rg.replace(/\D/g, ''),
        responsible_cpf: responsibleData.cpf.replace(/\D/g, ''),
        responsible_phone: responsibleData.celular.replace(/\D/g, ''),
        responsible_function: responsibleData.funcao,
        responsible_contact: {
          nome: responsibleData.nome,
          cpf: responsibleData.cpf.replace(/\D/g, ''),
          rg: responsibleData.rg.replace(/\D/g, ''),
          funcao: responsibleData.funcao,
          celular: responsibleData.celular.replace(/\D/g, ''),
          email: responsibleData.email
        }
      };

      console.log('Step 3: Creating profile manually...');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error(`Erro ao criar perfil: ${profileError.message}`);
      }

      console.log('Step 4: Profile created successfully!');

      // Success
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Cadastro Realizado!',
        message: 'Sua conta foi criada com sucesso. Bem-vindo ao TalentoShop!',
        buttonText: 'Acessar minha conta',
        redirectUrl: '/login'
      });

    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      let msg = error.message || "Erro ao realizar cadastro.";
      let title = "Erro no Cadastro";
      let btnText = "Tentar Novamente";
      let redirect = "";

      if (msg.includes("User already registered")) {
        title = "Conta já existe";
        msg = "Este e-mail já está cadastrado. Por favor, faça login.";
        btnText = "Ir para Login";
        redirect = "/login";
      }

      setModalConfig({
        isOpen: true,
        type: 'error',
        title: title,
        message: msg,
        buttonText: btnText,
        redirectUrl: redirect
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!companyData.nomeEmpresa || !companyData.cnpj || !cep || !address.rua || !address.numero) {
        setModalConfig({
          isOpen: true,
          type: 'error',
          title: 'Dados da Empresa Incompletos',
          message: 'Por favor, preencha todos os campos obrigatórios (*) da unidade para prosseguir.',
          buttonText: 'Entendido',
          redirectUrl: ''
        });
        return;
      }
      setStep(2);
    } else {
      if (!responsibleData.nome || !responsibleData.cpf || !responsibleData.celular || !responsibleData.email || !responsibleData.password) {
        setModalConfig({
          isOpen: true,
          type: 'error',
          title: 'Dados do Responsável Incompletos',
          message: 'Por favor, preencha todos os campos obrigatórios (*) para finalizar o cadastro.',
          buttonText: 'Entendido',
          redirectUrl: ''
        });
        return;
      }
      if (responsibleData.password !== responsibleData.confirmPassword) {
        setModalConfig({
          isOpen: true,
          type: 'error',
          title: 'Senhas não coincidem',
          message: 'As senhas informadas não são iguais. Por favor, verifique.',
          buttonText: 'Tentar Novamente',
          redirectUrl: ''
        });
        return;
      }
      handleRegister();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const isOtherShopping = selectedShopping === 'OUTRO';
  const isOtherSetor = selectedSetor === 'Outros';

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background-light dark:bg-slate-900 font-sans transition-colors duration-200">
      <aside className="w-full md:w-2/5 bg-primary relative overflow-hidden flex flex-col justify-between p-8 md:p-12 text-white shrink-0">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-secondary opacity-10 blur-3xl"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-6 md:mb-12 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 md:w-10 md:h-10 relative">
              <div className="absolute inset-0 bg-white/20 rounded-xl backdrop-blur-sm"></div>
              <span className="material-icons-round absolute inset-0 flex items-center justify-center text-white text-lg md:text-xl">hub</span>
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight">Talento<span className="text-secondary">Shop</span></span>
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4 md:mb-6">Encontre os melhores vendedores para o seu negócio.</h1>
          <p className="text-blue-100 text-sm md:text-lg font-light leading-relaxed hidden md:block">Junte-se à plataforma líder em conexão e otimize suas contratações com nossa IA.</p>
        </div>
        <div className="relative z-10 mt-8 md:mt-12 hidden md:block">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-primary"></div>
              <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-primary"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-primary"></div>
            </div>
            <p className="text-sm font-bold">+2.000 lojistas cadastrados</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">Cadastro de Lojista</p>
            <div className="flex items-center justify-between relative mt-6">
              <div className="absolute top-1/2 w-full h-1 bg-slate-100 -z-10 dark:bg-slate-700 rounded-full"></div>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800 transition-all shadow-sm ${step >= 1 ? 'bg-primary text-white scale-110' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>1</div>
                <span className={`text-xs mt-2 font-medium ${step >= 1 ? 'text-primary dark:text-white' : 'text-slate-400'}`}>Empresa</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-slate-800 transition-all shadow-sm ${step >= 2 ? 'bg-primary text-white scale-110' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>2</div>
                <span className={`text-xs mt-2 font-medium ${step >= 2 ? 'text-primary dark:text-white' : 'text-slate-400'}`}>Responsável</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <div className="animate-fade-in-up space-y-5">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dados da Empresa</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome da Empresa *</label>
                  <input
                    name="nomeEmpresa"
                    value={companyData.nomeEmpresa}
                    onChange={handleCompanyChange}
                    className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                    placeholder="Ex: Fashion Store Ltda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CNPJ *</label>
                  <div className="relative">
                    <input
                      name="cnpj"
                      value={companyData.cnpj}
                      onChange={handleCompanyChange}
                      onBlur={handleCnpjBlur}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                      placeholder="00.000.000/0000-00"
                    />
                    {loadingCnpj && <span className="absolute right-3 top-3.5 text-[10px] text-primary font-bold animate-pulse">BUSCANDO...</span>}
                  </div>
                  {cnpjError && (
                    <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1 animate-fade-in">
                      <span className="material-icons-round text-[14px]">error</span>
                      {cnpjError}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tipo de Unidade</label>
                    <select name="tipoUnidade" value={companyData.tipoUnidade} onChange={handleCompanyChange} className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm">
                      <option value="Loja">Loja</option>
                      <option value="Quiosque">Quiosque</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Setor</label>
                    <select
                      value={selectedSetor}
                      onChange={(e) => setSelectedSetor(e.target.value)}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                    >
                      <option value="">Selecione...</option>
                      <option value="Moda">Moda</option>
                      <option value="Alimentação">Alimentação</option>
                      <option value="Tecnologia">Tecnologia</option>
                      <option value="Serviços">Serviços</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Outros">Outros</option>
                    </select>
                    {isOtherSetor && (
                      <input
                        className="w-full mt-3 rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                        placeholder="Especifique o setor"
                        value={manualSetor}
                        onChange={(e) => setManualSetor(e.target.value)}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-6 mt-2 border-t border-slate-100 dark:border-slate-700">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="material-icons-round text-primary text-lg">location_on</span>
                    Localização da Unidade
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">CEP *</label>
                      <div className="relative">
                        <input
                          className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                          placeholder="00000-000"
                          value={cep}
                          onChange={(e) => setCep(formatCEP(e.target.value))}
                          onBlur={handleCepBlur}
                        />
                        {loadingCep && <span className="absolute right-3 top-3.5 text-[10px] text-primary font-bold animate-pulse">BUSCANDO...</span>}
                      </div>
                      {cepError && (
                        <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1 animate-fade-in">
                          <span className="material-icons-round text-[14px]">error</span>
                          {cepError}
                        </p>
                      )}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Rua / Logradouro *</label>
                      <input
                        className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                        placeholder="Rua..."
                        value={address.rua}
                        onChange={(e) => setAddress({ ...address, rua: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Número *</label>
                      <input
                        className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                        placeholder="123"
                        value={address.numero}
                        onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Bairro</label>
                      <input
                        className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                        placeholder="Bairro"
                        value={address.bairro}
                        onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Cidade / UF</label>
                      <input
                        className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm cursor-not-allowed"
                        placeholder="Cidade/UF"
                        value={address.cidade ? `${address.cidade} - ${address.uf}` : ''}
                        readOnly
                      />
                    </div>
                  </div>
                  {address.lat && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 flex items-center gap-2 border border-blue-100 dark:border-slate-700 col-span-full">
                      <span className="material-icons-round text-lg text-primary">check_circle</span>
                      Coordenadas capturadas: {address.lat}, {address.lng}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Shopping Center</label>
                  <Combobox
                    options={SHOPPINGS_LIST}
                    value={selectedShopping}
                    onChange={setSelectedShopping}
                    placeholder="Selecione ou digite o Shopping..."
                  />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="animate-fade-in-up space-y-5">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dados do Responsável</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome Completo *</label>
                    <input
                      name="nome"
                      value={responsibleData.nome}
                      onChange={handleResponsibleChange}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CPF *</label>
                    <input
                      name="cpf"
                      value={responsibleData.cpf}
                      onChange={handleResponsibleChange}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Identidade (RG) *</label>
                    <input
                      name="rg"
                      value={responsibleData.rg}
                      onChange={handleResponsibleChange}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                      placeholder="00.000.000-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Função</label>
                    <input
                      name="funcao"
                      value={responsibleData.funcao}
                      onChange={handleResponsibleChange}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                      placeholder="Ex: Gerente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Celular *</label>
                    <input
                      name="celular"
                      value={responsibleData.celular}
                      onChange={handleResponsibleChange}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail Corporativo *</label>
                    <input
                      name="email"
                      value={responsibleData.email}
                      onChange={handleResponsibleChange}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                      placeholder="nome@empresa.com.br"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Senha *</label>
                    <div className="relative">
                      <input
                        name="password"
                        value={responsibleData.password}
                        onChange={handleResponsibleChange}
                        className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 pr-10 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-icons-round text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    {responsibleData.password && (
                      <div className="mt-2 space-y-1 animate-fade-in">
                        <div className="flex h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${calculateStrength(responsibleData.password) <= 1 ? 'bg-red-500 w-1/4' :
                              calculateStrength(responsibleData.password) === 2 ? 'bg-yellow-500 w-2/4' :
                                calculateStrength(responsibleData.password) === 3 ? 'bg-blue-500 w-3/4' :
                                  'bg-green-500 w-full'
                              }`}
                          ></div>
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right">
                          {calculateStrength(responsibleData.password) <= 1 ? 'Fraca' :
                            calculateStrength(responsibleData.password) === 2 ? 'Média' :
                              calculateStrength(responsibleData.password) === 3 ? 'Boa' :
                                'Forte'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirmar Senha</label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        value={responsibleData.confirmPassword}
                        onChange={handleResponsibleChange}
                        className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 pr-10 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-icons-round text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6">
              <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-petrol-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" onClick={handleNext}>
                {step === 2 ? (loading ? 'Cadastrando...' : 'Finalizar Cadastro') : 'Continuar'}
                <span className="material-icons-round">{step === 2 ? 'check_circle' : 'arrow_forward'}</span>
              </button>
              {step === 2 && <button className="w-full mt-4 text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 transition-colors" onClick={handlePrev}>Voltar para Empresa</button>}
            </div>
          </div>
        </div>
      </main>

      <SuccessModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        buttonText={modalConfig.buttonText}
        redirectUrl={modalConfig.redirectUrl}
        type={modalConfig.type}
      />
    </div>
  );
};

export default LojistaRegister;
