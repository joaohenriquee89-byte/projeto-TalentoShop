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

        try {
            // Fetch Profile
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return;
            }

            // Fetch Active Subscription
            let planName = 'FREE';
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('plan_name, status, expires_at')
                .eq('profile_id', currentSession.user.id)
                .eq('status', 'active')
                .gt('expires_at', new Date().toISOString()) // Ensure not expired
                .single();

            if (subscription) {
                planName = subscription.plan_name;
            }

            if (profile) {
                const appUser: User = {
                    id: currentSession.user.id,
                    name: profile.full_name || currentSession.user.email || 'Usuário',
                    role: profile.user_type === 'vendedor' ? UserRole.VENDEDOR : UserRole.LOJISTA,
                    email: profile.email,
                    plan: planName,
                    avatar: currentSession.user.user_metadata?.avatar_url
                };
                setUser(appUser);
            }
        } catch (err) {
            console.error('Unexpected error fetching profile/subscription:', err);
        }
    };

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            fetchProfile(session).finally(() => setLoading(false));
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            // If session changed (login/logout), fetch profile again
            if (session) {
                fetchProfile(session);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
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
