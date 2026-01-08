import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { User, UserRole } from '../../types';

// Define the shape of the context
interface AuthContextType {
    session: Session | null;
    user: User | null;
    signOut: () => Promise<void>;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (currentSession: Session | null) => {
        if (!currentSession?.user) {
            setUser(null);
            return;
        }

        console.log('Fetching profile for:', currentSession.user.id);

        try {
            // 1. Concurrent Fetch: Get Profile and Subscription
            const [profileRes, subRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', currentSession.user.id).single(),
                supabase.from('subscriptions').select('plan_name, status, expires_at')
                    .eq('profile_id', currentSession.user.id)
                    .eq('status', 'active')
                    .gt('expires_at', new Date().toISOString())
                    .maybeSingle()
            ]);

            let profile = profileRes.data;
            const profileError = profileRes.error;
            const subscription = subRes.data;

            // 2. Resilience: If profile is missing, use metadata as source of truth
            const meta = currentSession.user.user_metadata;

            if (profileError || !profile) {
                console.warn('Profile sync delay or missing. Using metadata for UI.');
            }

            // 3. Subscription fallback
            const planName = subscription?.plan_name || 'FREE';

            // 4. Update state immediately with best available data
            const appUser: User = {
                id: currentSession.user.id,
                name: profile?.full_name || meta?.full_name || currentSession.user.email || 'Usuário',
                role: (profile?.user_type || meta?.user_type) === 'lojista' ? UserRole.LOJISTA : UserRole.VENDEDOR,
                email: profile?.email || currentSession.user.email || '',
                plan: planName,
                avatar: profile?.avatar_url || meta?.avatar_url
            };

            setUser(appUser);
            console.log('App User state updated:', appUser.role, appUser.plan);

        } catch (err) {
            console.error('Critical failure in fetchProfile:', err);
        } finally {
            console.log('fetchProfile finished');
        }
    };

    useEffect(() => {
        console.log('AuthProvider mounted');

        let mounted = true;

        // Fail-safe: Always hide loading after 6 seconds max
        const timer = setTimeout(() => {
            if (mounted && loading) {
                console.warn('Auth loading fail-safe triggered');
                setLoading(false);
            }
        }, 6000);

        // Initial setup
        const initAuth = async () => {
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            if (!mounted) return;

            setSession(initialSession);
            if (initialSession) {
                await fetchProfile(initialSession);
            }
            setLoading(false);
            clearTimeout(timer);
        };

        initAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            console.log('Auth transition:', _event);
            if (!mounted) return;

            setSession(newSession);
            if (newSession) {
                await fetchProfile(newSession);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    const refreshProfile = async () => {
        await fetchProfile(session);
    };

    const value = {
        session,
        user,
        signOut,
        loading,
        refreshProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
