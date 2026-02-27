import { ActivityIndicator, View } from "react-native";
import { AdminVolunteersView } from "@/components/AdminVolunteersView";
import React from "react";
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';

export default function VolunteerView() {
  const { profile, loading } = useAuth();
  if (loading) {
    return <ActivityIndicator size="large" color="#000000" />
  }
  if (!profile || !profile?.is_admin) {
    return <Redirect href="/(tabs)/home" />
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}

    >
      <AdminVolunteersView />
    </View>
  );
}
