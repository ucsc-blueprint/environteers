import { View } from 'react-native';
import SignupForm from '@/components/SignupForm';
import { supabase } from '@/constants/supabase';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

export default function SignupScreen() {
  const router = useRouter();
  const {user, profile} = useAuth();
    
  React.useEffect(() => {
    if (user && profile) {
      router.push('/(tabs)/home')
    }
  }, [user, profile, router])

  const { isAdmin: isAdminParam } = useLocalSearchParams();

  async function onSubmit(username: string, email: string, password: string, isAdmin: boolean) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed',
        text2: error.message
      })
      return;
    };
    const {error: insertError} = await supabase.from('users').insert({
      user_id: data.user!.id,
      username,
      email,
      is_admin: isAdmin
    })
    if (insertError) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed',
        text2: insertError.message
      })
      return;
    };
    await supabase.auth.signInWithPassword({ email, password });

    Toast.show({
      type: 'success',
      text1: 'You are now signed up',
    })    
  }
  return (
    <View style={{flex: 1}}>
      <SignupForm onSubmit={onSubmit} isAdmin={isAdminParam === 'true'} />
    </View>
  )
}
