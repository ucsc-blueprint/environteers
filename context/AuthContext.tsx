import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/constants/supabase';

type UserProfile = {
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  banned_until: string | null;
  profile_picture: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: Session['user'] | null;
  profile: UserProfile | null;
  loading: boolean;
  isBanned: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isBanned: false,
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    const { data } = await supabase
      .from('users')
      .select('first_name, last_name, email, is_admin, created_at, banned_until, profile_picture')
      .eq('user_id', session.user.id)
      .single();

    setProfile(data ?? null);
  }, [session?.user]);

  // Fetch profile whenever session.user changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Initialize session and listen for changes
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const isBanned = profile?.banned_until ? new Date(profile.banned_until) > new Date() : false;

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        isBanned,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
