import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import Toast from 'react-native-toast-message'
import React from 'react';
export default function RootLayout() {
  return (
  <AuthProvider>
    <Stack screenOptions={{ headerShown: false }} />
    <Toast />
  </AuthProvider>)
  ;
}