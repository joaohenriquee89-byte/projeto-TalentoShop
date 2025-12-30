import React from 'react';
// Tente este caminho, que é o padrão se 'lib' e 'pages' estiverem na 'src'
// Se a pasta 'lib' estiver dentro de 'src', use este caminho:
import { supabase } from '../src/lib/supabase';
const PricingPage: React.FC = () => {
  const handleCheckout = async (planName: string, price: number) => {
    // 1. Verifica autenticação do usuário
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Por favor, faça login para continuar.");
      return;
    }

    try {
      // 2. Chama a Edge Function com os parâmetros exatos esperados pelo servidor
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan_name: planName,
          price: price,
          title: `Assinatura ${planName}`
        }
      });

      // Se a função retornar erro (non-2xx), ele será capturado aqui
      if (error) throw error;

      // 3. Redireciona para o checkout do Mercado Pago
      console.log("Dados recebidos da função:", data);

      // 3. Redireciona para o checkout do Mercado Pago
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.warn("URL de checkout não recebida:", data);
      }
    } catch (err: any) {
      console.error("Erro no Checkout:", err);
      // Alerta amigável para o erro 400 visto nos logs
      console.error("Erro no Checkout:", err);
      // Alerta removido conforme solicitado
      // alert("Erro ao iniciar o checkout. Verifique se o Token MP está configurado corretamente.");
    }
  };

  return (
    <div className="pt-32 pb-16 bg-white min-h-screen text-center">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold mb-12">Planos de Assinatura</h1>

        <div className="max-w-sm mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold mb-4 uppercase text-blue-600">Lojista Premium</h3>
          <p className="text-4xl font-extrabold mb-6">R$ 99,90<span className="text-sm text-gray-500">/mês</span></p>

          <button
            onClick={() => handleCheckout("Lojista Premium", 99.90)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Assinar Agora
          </button>

          <p className="mt-4 text-xs text-gray-400">Pagamento seguro via Mercado Pago</p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;