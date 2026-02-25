import React, { createContext, useEffect, useState, useContext } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/constants/supabase'

type UserProfile = {
  username: string
  is_admin: boolean
}

type AuthContextType = {
  session: Session | null
  user: Session['user'] | null
  profile: UserProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile whenever session.user changes
  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('users')
        .select('username, is_admin')
        .eq('user_id', session.user.id)
        .single();

      setProfile(data ?? null);
    };

    fetchProfile();
  }, [session?.user]);

  // Initialize session and listen for changes
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
