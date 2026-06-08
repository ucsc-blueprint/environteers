import { View } from 'react-native';
import LoginForm from '@/components/LoginForm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';
import Toast from 'react-native-toast-message';
import React from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const { isAdmin : isAdminParam } = useLocalSearchParams();

  async function onSubmit(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: error.message
      })
      return;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('banned_until, is_admin')
      .eq('user_id', data.user.id)
      .single();
    
    const isBanned = userData?.banned_until && new Date(userData.banned_until) > new Date();

    if (isBanned) {
      await supabase.auth.signOut();
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Your account is currently banned.'
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'You are now logged in',
    });

    router.replace('/');
  }

  return (
    <View style={{flex: 1}}>
      <LoginForm
        onSubmit={onSubmit}
        isAdmin={isAdminParam === 'true'} />
    </View>
  )
}
