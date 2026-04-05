import React from 'react';
import { AdminNewsEditForm } from '@/components/AdminNewsEditForm';
import { useAuth } from '@/context/AuthContext';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function AdminNewsEditFormView() {
  const { profile, loading } = useAuth();
  const { id } = useLocalSearchParams();

  if (loading) {
    return <ActivityIndicator size="large" color="#000000" />
  }
  if (!profile || !profile?.is_admin) {
    return <Redirect href="/(tabs)/home" />
  }
  return (
    <AdminNewsEditForm id={id as string} />
  )
}