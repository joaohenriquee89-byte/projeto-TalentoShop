// Test script for vendedor registration
// Run this in browser console on localhost:5173

const testVendedorRegistration = async () => {
    const { createClient } = await import('@supabase/supabase-js');

    const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
    );

    const testData = {
        email: `test${Date.now()}@example.com`,
        password: 'Test123456!',
        options: {
            data: {
                full_name: 'Test Vendedor',
                user_type: 'vendedor',
                cpf: '12345678901',
                rg: '123456789',
                birth_date: '1990-01-01',
                bio: 'Test bio',
                phone: '11999999999',
                escolaridade: 'Superior Completo',
                disponibilidade: 'Tempo Integral',
                address: {
                    cep: '01310100',
                    rua: 'Av Paulista',
                    numero: '1000',
                    bairro: 'Bela Vista',
                    cidade: 'São Paulo',
                    estado: 'SP'
                },
                company_name: '',
                shopping_mall: '',
                experiences: [{
                    empresa: 'Test Company',
                    cargo: 'Vendedor',
                    periodo: '2020-2023',
                    descricao: 'Test description',
                    referenciaName: 'Test Reference',
                    referenciaTel: '11888888888'
                }],
                skills: ['Vendas', 'Atendimento']
            }
        }
    };

    try {
        console.log('Attempting registration with data:', testData);
        const { data, error } = await supabase.auth.signUp(testData);

        if (error) {
            console.error('❌ Registration failed:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                name: error.name
            });
            return { success: false, error };
        }

        console.log('✅ Registration successful:', data);
        return { success: true, data };
    } catch (err) {
        console.error('❌ Unexpected error:', err);
        return { success: false, error: err };
    }
};

// Run the test
testVendedorRegistration();
