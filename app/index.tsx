import { View } from 'react-native';
import LandingPage from '@/components/LandingPage';
import { useAuth } from '@/context/AuthContext';
import { usePathname, Redirect } from 'expo-router';
import React from 'react';

export default function LandingIndex() {
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();

  if (!loading && user && profile && pathname !== '/resetPassword') {
    if (profile.is_admin) {
      return <Redirect href='/(tabs)/admin-dashboard' />;
    } else {
      return <Redirect href='/(tabs)/volunteer' />;
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LandingPage />
    </View>
  );
}
