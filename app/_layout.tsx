import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import Toast, { BaseToast } from 'react-native-toast-message';
import React from 'react';

import { InteractionsProvider } from '@/context/InteractionsContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <InteractionsProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast
          config={{
            success: (props) => (
              <BaseToast {...props} style={{ borderLeftColor: '#618E20' }} text2NumberOfLines={3} />
            ),
            error: (props) => (
              <BaseToast {...props} style={{ borderLeftColor: '#E00000' }} text2NumberOfLines={3} />
            ),
          }}
        />
      </InteractionsProvider>
    </AuthProvider>
  );
}
