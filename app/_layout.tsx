import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import Toast from 'react-native-toast-message'
import React from 'react';

import { InteractionsProvider } from '@/context/InteractionsContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <InteractionsProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </InteractionsProvider>
    </AuthProvider>
  );
}



