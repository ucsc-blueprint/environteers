import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import Toast from 'react-native-toast-message'
import React from 'react';
import * as Linking from 'expo-linking'
import { supabase } from '@/constants/supabase';

export default function RootLayout() {
  // deep linking for email verification
  React.useEffect(() => {
    const handleInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        await supabase.auth.exchangeCodeForSession(url);
      }
    }

    handleInitialUrl();

    const sub = Linking.addEventListener('url', async ({url}) => {
      await supabase.auth.exchangeCodeForSession(url);
    })

    return () => sub.remove();
  }, [])

  return (
  <AuthProvider>
    <Stack screenOptions={{ headerShown: false }} />
    <Toast />
  </AuthProvider>)
  ;
}