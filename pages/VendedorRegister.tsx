
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import SuccessModal from '../components/SuccessModal';
import { SHOPPINGS_LIST } from '../src/constants/data';

const VendedorRegister: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dados Pessoais
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    nascimento: '',
    cpf: '',
    email: '',
    password: '',
    confirmPassword: '',
    celular: '',
    bio: '',
    tags: '',
  });

  const [address, setAddress] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    lat: '',
    lng: ''
  });

  // Experiência
  const [experience, setExperience] = useState({
    funcao: '',
    empresa: '',
    atividades: '',
    inicio: '',
    fim: '',
    shopping: '',
    referenciaNome: '',
    referenciaTel: ''
  });

  const [selectedSetor, setSelectedSetor] = useState('');
  const [manualSetor, setManualSetor] = useState('');
  const [manualShopping, setManualShopping] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
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



  const navigate = useNavigate();

  const shoppings = SHOPPINGS_LIST;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExperience(prev => ({ ...prev, [name]: value }));
  };

  const fetchCoordinates = async (logradouro: string, cidade: string, uf: string) => {
    try {
      const query = encodeURIComponent(`${logradouro}, ${cidade}, ${uf}, Brasil`);
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

  const handleCepBlur = async () => {
    const cleanCep = address.cep.replace(/\D/g, '');
    setCepError('');

    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        let success = false;
        let data;

        // 1. Try ViaCEP
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          if (response.ok) {
            data = await response.json();
            if (!data.erro) {
              setAddress(prev => ({
                ...prev,
                logradouro: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                uf: data.uf || ''
              }));
              if (data.logradouro && data.localidade) {
                await fetchCoordinates(data.logradouro, data.localidade, data.uf);
              }
              success = true;
            }
          }
        } catch (e) {
          console.warn("ViaCEP failed", e);
        }

        // 2. Try BrasilAPI fallback
        if (!success) {
          try {
            const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`);
            if (response.ok) {
              data = await response.json();
              setAddress(prev => ({
                ...prev,
                logradouro: data.street || '',
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
            console.warn("BrasilAPI failed", e);
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

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
    buttonText: '',
    redirectUrl: ''
  });

  const handleRegister = async () => {
    if (!formData.email || !formData.password) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha email e senha.',
        buttonText: 'Ok',
        redirectUrl: ''
      });
      return;
    }
    setLoading(true);
    try {
      // 1. SignUp with Metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.nome} ${formData.sobrenome}`,
            user_type: 'vendedor',
            cpf: formData.cpf,
            birth_date: formData.nascimento,
            bio: formData.bio,
            phone: formData.celular, // Added phone saving
            address: { ...address, cep: address.cep || '' },
            experience: {
              ...experience,
              shopping: experience.shopping === 'OUTRO' ? manualShopping : experience.shopping
            },
            skills: formData.tags.split(',').map(s => s.trim())
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      // Success
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Bem-vindo ao Time!',
        message: 'Seu perfil de vendedor foi criado. Agora você pode se candidatar às melhores vagas.',
        buttonText: 'Começar Agora',
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
      if (formData.password.length < 6) return alert("Senha muito curta");
      if (formData.password !== formData.confirmPassword) return alert("Senhas não coincidem");
    }
    if (step < 3) setStep(step + 1);
    else handleRegister();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  const isOtherShopping = experience.shopping === 'OUTRO';
  const isOtherSetor = selectedSetor === 'Outros';

  return (
    <div className="min-h-screen bg-background-light dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link to="/" className="flex items-center justify-center gap-3">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-white text-2xl">hub</span>
          </div>
        </Link>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Sua jornada profissional começa aqui.</p>
      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-petrol-800 dark:bg-gray-900 p-8 text-white">
          <h1 className="text-2xl font-bold mb-6">Cadastro de Vendedor</h1>
          <div className="flex items-center justify-between">
            {[1, 2, 3].map(i => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-petrol-800 transition-all ${step >= i ? 'bg-primary' : 'bg-gray-600'}`}>{i}</div>
                  <span className={`text-xs mt-2 ${step >= i ? 'text-white' : 'text-gray-400'}`}>{i === 1 ? 'Dados' : i === 2 ? 'Experiência' : 'Perfil'}</span>
                </div>
                {i < 3 && <div className="flex-1 h-1 bg-gray-600 mx-2 rounded overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: step > i ? '100%' : '0%' }}></div>
                </div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="animate-fade-in-up space-y-4">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-primary dark:text-accent"><span className="material-symbols-outlined mr-2">person</span>Dados Pessoais</h2>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                <input name="nome" value={formData.nome} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="Nome" />
                <input name="sobrenome" value={formData.sobrenome} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="Sobrenome" />
                <div className="w-full">
                  <label className="block text-xs text-gray-500 mb-1 ml-1">Data de Nascimento</label>
                  <input name="nascimento" value={formData.nascimento} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" type="date" />
                </div>
                <div className="w-full">
                  <label className="block text-xs text-gray-500 mb-1 ml-1">CPF</label>
                  <input name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="000.000.000-00" />
                </div>

                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                      placeholder="CEP (Ex: 00000-000)"
                      value={address.cep}
                      onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                      onBlur={handleCepBlur}
                    />
                    {loadingCep && <span className="absolute right-2 top-3 text-[10px] text-primary animate-pulse">Buscando...</span>}
                    {cepError && <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-medium flex items-center gap-1"><span className="material-icons-round text-[10px]">error</span>{cepError}</span>}
                  </div>
                  <input
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 md:col-span-2"
                    placeholder="Logradouro / Rua"
                    value={address.logradouro}
                    onChange={(e) => setAddress({ ...address, logradouro: e.target.value })}
                  />
                  <input
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                    placeholder="Número"
                    value={address.numero}
                    onChange={(e) => setAddress({ ...address, numero: e.target.value })}
                  />
                  <input
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                    placeholder="Bairro"
                    value={address.bairro}
                    onChange={(e) => setAddress({ ...address, bairro: e.target.value })}
                  />
                  <input
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                    placeholder="Complemento"
                    value={address.complemento}
                    onChange={(e) => setAddress({ ...address, complemento: e.target.value })}
                  />
                  <input
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                    placeholder="Cidade"
                    value={address.cidade}
                    readOnly
                  />
                  <input
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                    placeholder="Estado (UF)"
                    value={address.uf}
                    readOnly
                  />
                  <input name="celular" value={formData.celular} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="Celular" />
                </div>
                {address.lat && (
                  <div className="col-span-1 md:col-span-2 p-2 bg-blue-50 dark:bg-slate-800/50 rounded text-[10px] text-gray-500 flex items-center gap-2">
                    <span className="material-icons-round text-sm text-primary">location_on</span>
                    Coordenadas capturadas: {address.lat}, {address.lng}
                  </div>
                )}

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Setor de Atuação Predominante</label>
                  <select
                    value={selectedSetor}
                    onChange={(e) => setSelectedSetor(e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                  >
                    <option value="">Selecione um setor...</option>
                    <option value="Moda">Moda & Vestuário</option>
                    <option value="Alimentação">Alimentação & Bebidas</option>
                    <option value="Tecnologia">Tecnologia & Eletrônicos</option>
                    <option value="Beleza">Beleza & Estética</option>
                    <option value="Outros">Outros</option>
                  </select>
                  {isOtherSetor && (
                    <input
                      className="w-full mt-2 rounded-lg border-primary dark:border-accent bg-blue-50/30 dark:bg-slate-800 dark:text-white p-2.5"
                      placeholder="Especifique o seu setor"
                      value={manualSetor}
                      onChange={(e) => setManualSetor(e.target.value)}
                    />
                  )}
                </div>

                <div className="w-full md:col-span-2">
                  <input name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="E-mail" type="email" />
                </div>
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="relative">
                      <input
                        className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 pr-10"
                        placeholder="Senha"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-icons-round text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2 space-y-1 animate-fade-in">
                        <div className="flex h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${calculateStrength(formData.password) <= 1 ? 'bg-red-500 w-1/4' :
                              calculateStrength(formData.password) === 2 ? 'bg-yellow-500 w-2/4' :
                                calculateStrength(formData.password) === 3 ? 'bg-blue-500 w-3/4' :
                                  'bg-green-500 w-full'
                              }`}
                          ></div>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 text-right">
                          {calculateStrength(formData.password) <= 1 ? 'Fraca' :
                            calculateStrength(formData.password) === 2 ? 'Média' :
                              calculateStrength(formData.password) === 3 ? 'Boa' :
                                'Forte'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 pr-10"
                      placeholder="Confirmar Senha"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-primary transition-colors"
                    >
                      <span className="material-icons-round text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="animate-fade-in-up space-y-4">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-primary dark:text-accent"><span className="material-symbols-outlined mr-2">work_outline</span>Experiência Profissional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="funcao" value={experience.funcao} onChange={handleExpChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="Função Atual/Última" />
                <input name="empresa" value={experience.empresa} onChange={handleExpChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="Nome da Loja/Empresa" />
                <textarea name="atividades" value={experience.atividades} onChange={handleExpChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5 col-span-1 md:col-span-2" placeholder="Principais Atividades" rows={2}></textarea>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Data Início</label>
                  <input name="inicio" value={experience.inicio} onChange={handleExpChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" type="date" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Data Fim (ou atual)</label>
                  <input name="fim" value={experience.fim} onChange={handleExpChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" type="date" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shopping onde trabalhou</label>
                  <select
                    value={experience.shopping}
                    onChange={handleExpChange}
                    name="shopping"
                    className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5"
                  >
                    <option value="">Selecione um shopping...</option>
                    {shoppings.sort().map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="OUTRO">Não encontrei meu shopping</option>
                  </select>
                  {isOtherShopping && (
                    <input
                      className="w-full mt-2 rounded-lg border-primary dark:border-accent bg-blue-50/30 dark:bg-slate-800 dark:text-white p-2.5"
                      placeholder="Nome do Shopping"
                      value={manualShopping}
                      onChange={(e) => setManualShopping(e.target.value)}
                    />
                  )}
                </div>
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <h3 className="col-span-1 md:col-span-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">Referências Profissionais</h3>
                  <input name="referenciaNome" value={experience.referenciaNome} onChange={handleExpChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="Nome do ex-gestor" />
                  <input name="referenciaTel" value={experience.referenciaTel} onChange={handleExpChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="Telefone da Referência" />
                </div>
                <div className="col-span-1 md:col-span-2 mt-4 p-4 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-center">
                  <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">picture_as_pdf</span>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Anexe seu currículo em PDF (opcional)</p>
                  <button className="mt-2 text-primary font-bold text-sm">Clique para upload</button>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-primary dark:text-accent"><span className="material-symbols-outlined mr-2">psychology</span>Palavras-chave & Perfil</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Insira termos que definem suas competências (ex: Moda, Luxo, Pós-venda, CRM).</p>

              <div className="space-y-4">
                <input name="tags" value={formData.tags} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="Adicione palavras-chave separadas por vírgula" />
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Aviso:</strong> Use apenas palavras verdadeiras. Sua reputação na rede depende da sua integridade.
                </div>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 dark:text-white p-2.5" placeholder="Breve resumo sobre você (Bio)..." rows={4} />
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
            <button className="px-6 py-2.5 border rounded-lg dark:text-white dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2" onClick={handlePrev}>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Voltar
            </button>
            <button className="px-8 py-2.5 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-opacity-90 transition-all" onClick={handleNext}>
              {step === 3 ? (loading ? 'Cadastrando...' : 'Finalizar Cadastro') : 'Próximo Passo'}
            </button>
          </div>
        </div>
      </div>
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

export default VendedorRegister;
