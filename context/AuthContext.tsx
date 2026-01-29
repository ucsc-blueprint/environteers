import { createContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/constants/supabase';
import React from 'react';

type AuthContextType = {
  session: Session | null,
  user: Session['user'] | null,
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true
});

export const AuthProvider = (props: {children: React.ReactNode}) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      data.subscription.unsubscribe()
    }

  }, [])

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        session,
        user: session?.user ?? null,
        loading,
      },
    },
    props.children
  )
}

export function useAuth() {
  return React.useContext(AuthContext)
}
