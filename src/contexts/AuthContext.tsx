import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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

    // Use a ref to prevent overlapping fetch calls for the same user
    const lastFetchedId = useRef<string | null>(null);
    const fetchInProgress = useRef<boolean>(false);

    const fetchProfile = async (currentSession: Session | null) => {
        if (!currentSession?.user) {
            console.log('[AUTH_DEBUG] fetchProfile: No user in session');
            setUser(null);
            return;
        }

        const uid = currentSession.user.id;

        // Prevent redundant identical fetches if already in progress or already fetched
        if (fetchInProgress.current && lastFetchedId.current === uid) {
            console.log('[AUTH_DEBUG] fetchProfile: Skipping, already in progress for:', uid);
            return;
        }

        console.log('[AUTH_DEBUG] fetchProfile START for:', uid);
        fetchInProgress.current = true;
        lastFetchedId.current = uid;

        try {
            // Sequential fetches with timeouts to identify exact hang point
            console.log('[AUTH_DEBUG] Attempting profiles fetch...');
            const profilePromise = supabase.from('profiles').select('*').eq('id', uid).maybeSingle();

            const profileRes = await Promise.race([
                profilePromise,
                new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 8000))
            ]);
            console.log('[AUTH_DEBUG] Profiles fetch DONE/RESULT:', profileRes?.data ? 'Found' : 'Not Found');

            console.log('[AUTH_DEBUG] Attempting subscriptions fetch...');
            const subPromise = supabase.from('subscriptions').select('plan_name, status, expires_at')
                .eq('profile_id', uid)
                .eq('status', 'active')
                .gt('expires_at', new Date().toISOString())
                .maybeSingle();

            const subRes = await Promise.race([
                subPromise,
                new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Subscription fetch timeout')), 8000))
            ]);
            console.log('[AUTH_DEBUG] Subscriptions fetch DONE');

            const profile = profileRes?.data;
            const subscription = subRes?.data;
            const meta = currentSession.user.user_metadata;

            // HANDLE SOCIAL LOGIN ROLE SYNC: Check if there's a role in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const urlRole = urlParams.get('role');

            if (urlRole && profile && !profile.user_type_set_manually) {
                const normalizedRole = urlRole.toLowerCase() === 'lojista' ? 'lojista' : 'vendedor';
                if (profile.user_type !== normalizedRole) {
                    console.log('[AUTH_DEBUG] Updating profile role from URL:', normalizedRole);
                    await supabase.from('profiles').update({ user_type: normalizedRole }).eq('id', uid);
                    profile.user_type = normalizedRole; // Update local copy
                }
            }

            const planName = subscription?.plan_name || 'FREE';

            const appUser: User = {
                id: uid,
                name: profile?.full_name || meta?.full_name || currentSession.user.email || 'Usuário',
                role: (profile?.user_type || meta?.user_type) === 'lojista' ? UserRole.LOJISTA : UserRole.VENDEDOR,
                email: profile?.email || currentSession.user.email || '',
                plan: planName,
                avatar: profile?.avatar_url || meta?.avatar_url
            };

            console.log('[AUTH_DEBUG] Updating internal user state:', appUser.email, appUser.role);
            setUser(appUser);

        } catch (err: any) {
            console.error('[AUTH_DEBUG] Critical failure in fetchProfile:', err.message);

            // EMERGENCY METADATA FALLBACK: If DB hangs or fails, use metadata to unlock UI
            const meta = currentSession.user.user_metadata;
            if (meta) {
                console.warn('[AUTH_DEBUG] Using metadata fallback to unlock UI');
                setUser({
                    id: uid,
                    name: meta.full_name || currentSession.user.email || 'Usuário',
                    role: meta.user_type === 'lojista' ? UserRole.LOJISTA : UserRole.VENDEDOR,
                    email: currentSession.user.email || '',
                    plan: 'FREE'
                });
            }
        } finally {
            console.log('[AUTH_DEBUG] fetchProfile END');
            fetchInProgress.current = false;
        }
    };

    useEffect(() => {
        console.log('[AUTH_DEBUG] AuthProvider mounted');

        let mounted = true;

        // GLOBAL FAIL-SAFE: Re-ensure loading is never stuck beyond 7 seconds
        const timer = setTimeout(() => {
            if (mounted && loading) {
                console.warn('[AUTH_DEBUG] Global Loading fail-safe triggered (v2.1)');
                setLoading(false);
            }
        }, 7000);

        const initAuth = async () => {
            console.log('[AUTH_DEBUG] initAuth START');
            try {
                const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;
                console.log('[AUTH_DEBUG] Session check complete:', initialSession ? 'Found' : 'No Session');

                if (!mounted) return;

                setSession(initialSession);
                if (initialSession) {
                    await fetchProfile(initialSession);
                }
            } catch (err) {
                console.error('[AUTH_DEBUG] initAuth Critical Error:', err);
            } finally {
                if (mounted) {
                    console.log('[AUTH_DEBUG] initAuth FINISHED - Unlocking UI');
                    setLoading(false);
                }
                clearTimeout(timer);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            console.log('[AUTH_DEBUG] onAuthStateChange event:', _event, 'User:', newSession?.user?.id || 'none');

            if (!mounted) return;

            // If we already have this session/user, and it's just a repetitive SIGNED_IN, quiet it down
            if (_event === 'SIGNED_IN' && session?.user?.id === newSession?.user?.id && user) {
                console.log('[AUTH_DEBUG] Redundant auth event, skipping profile fetch');
                return;
            }

            setSession(newSession);

            if (newSession) {
                // Fire and forget fetchProfile, but ensure loading eventually stops
                fetchProfile(newSession).finally(() => {
                    if (mounted) {
                        console.log('[AUTH_DEBUG] Post-transition sync complete');
                        setLoading(false);
                    }
                });
            } else {
                setUser(null);
                lastFetchedId.current = null;
                setLoading(false);
            }
        });

        return () => {
            console.log('[AUTH_DEBUG] AuthProvider unmounting');
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const signOut = async () => {
        console.log('[AUTH_DEBUG] Signing out...');
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        lastFetchedId.current = null;
        setLoading(false);
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
