import React from 'react';
import { NewsView } from '@/components/NewsView';
import { AdminNewsView } from '@/components/AdminNewsView';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function newsletter(){
  const { profile, loading } = useAuth();
  if (loading) {
      return <ActivityIndicator size="large" color="#000000" />
  }
  
  if (!profile) {
      return <Redirect href="/(tabs)/home" />
  }

  if (profile.is_admin) {
    return (
      <AdminNewsView />
    )
  }

  return (
    <NewsView />
  )
}