import { View } from 'react-native';
import LoginForm from '@/components/LoginForm';
import { supabase } from '@/constants/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
export default function LoginScreen() {
  const router = useRouter();
  const {user} = useAuth();
  
  React.useEffect(() => {
    if (user) {
      router.push('/(tabs)')
    }
  }, [user, router])
  
  async function onSubmit(email: string, password: string) {
    const {data, error} = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (error) {
      alert(error.message);
      console.log(data)
      return null
    }
    console.log('login success')
  }
  return (
    <View style={{flex: 1}}>
      <LoginForm onSubmit={onSubmit}/>
    </View>
  )
}
