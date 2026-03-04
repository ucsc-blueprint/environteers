import { View } from 'react-native';
import LoginForm from '@/components/LoginForm';
import { supabase } from '@/constants/supabase';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

import React from 'react';
export default function LoginScreen() {
  const router = useRouter();
  
  async function onSubmit(email: string, password: string) {
    const {error} = await supabase.auth.signInWithPassword({
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
    Toast.show({
      type: 'success',
      text1: 'You are now logged in',
    })
    router.replace('/(tabs)/home')
  }
  return (
    <View style={{flex: 1}}>
      <LoginForm onSubmit={onSubmit}/>
    </View>
  )
}
