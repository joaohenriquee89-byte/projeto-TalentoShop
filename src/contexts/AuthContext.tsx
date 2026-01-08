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
            let { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);

                // AUTO-REPAIR: If profile doesn't exist but we have a session, create it!
                if (error.code === 'PGRST116' || !profile) {
                    console.log('Profile missing. Attempting auto-repair from metadata...');
                    const { data: newProfile, error: repairError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: currentSession.user.id,
                            email: currentSession.user.email,
                            full_name: currentSession.user.user_metadata?.full_name || 'Usuário',
                            user_type: currentSession.user.user_metadata?.user_type || 'vendedor',
                            phone: currentSession.user.user_metadata?.phone || ''
                        })
                        .select()
                        .maybeSingle();

                    if (repairError || !newProfile) {
                        console.error('Auto-repair failed:', repairError);
                        return;
                    }
                    profile = newProfile;
                } else {
                    return;
                }
            }

            // Fetch Active Subscription
            let planName = 'FREE';
            const { data: subscription, error: subError } = await supabase
                .from('subscriptions')
                .select('plan_name, status, expires_at')
                .eq('profile_id', currentSession.user.id)
                .eq('status', 'active')
                .gt('expires_at', new Date().toISOString())
                .maybeSingle();

            if (subscription) {
                planName = subscription.plan_name;
            } else {
                // AUTO-REPAIR: If no active subscription found, create a FREE one
                console.log('Subscription missing. Attempting auto-repair...');
                const { error: repairSubError } = await supabase
                    .from('subscriptions')
                    .insert({
                        profile_id: currentSession.user.id,
                        status: 'active',
                        plan_name: 'FREE',
                        started_at: new Date().toISOString(),
                        expires_at: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
                    });

                if (repairSubError) {
                    console.error('Subscription auto-repair failed:', repairSubError);
                }
            }

            if (profile) {
                const appUser: User = {
                    id: currentSession.user.id,
                    name: profile.full_name || currentSession.user.email || 'Usuário',
                    role: profile.user_type === 'vendedor' ? UserRole.VENDEDOR : UserRole.LOJISTA,
                    email: profile.email,
                    plan: planName,
                    avatar: profile.avatar_url || currentSession.user.user_metadata?.avatar_url
                };
                setUser(appUser);
            }
        } catch (err) {
            console.error('Unexpected error fetching profile/subscription:', err);
        } finally {
            // Ensure any loading state dependent on this finishes
        }
    };

    useEffect(() => {
        // Fail-safe: Ensure loading is never stuck
        const failSafe = setTimeout(() => {
            if (loading) {
                console.warn('Auth timeout: force hiding spinner');
                setLoading(false);
            }
        }, 8000);

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            fetchProfile(session).finally(() => {
                setLoading(false);
                clearTimeout(failSafe);
            });
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log('Auth state change:', _event);
            setSession(session);
            if (session) {
                await fetchProfile(session);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
            clearTimeout(failSafe);
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
