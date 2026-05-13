import React from 'react';
import { NewsView } from '@/components/NewsView';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Newsletter(){
  const { profile, loading } = useAuth();
  if (loading) {
      return <ActivityIndicator size="large" color="#000000" />
  }
  
  if (!profile) {
      return <Redirect href="/" />
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NewsView isAdmin={profile.is_admin} />
    </SafeAreaView>
  )
}
