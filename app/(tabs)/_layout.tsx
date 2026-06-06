import { Tabs, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Octicons from '@expo/vector-icons/Octicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useAuth } from '@/context/AuthContext'
import { Text } from 'react-native'
import { supabase } from "@/constants/supabase"

export default function TabsLayout() {
  const router = useRouter();
  const { user, loading, profile, isBanned } = useAuth();

  useEffect(() => {
    if (!loading && !user && !profile) {
      router.replace('/');
    }

    if (isBanned) {
      supabase.auth.signOut();
      router.replace('/');
    }
  }, [user, loading, profile, isBanned, router]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const adminHref = profile?.is_admin ? null : undefined;
  const userHref = profile?.is_admin ? undefined : null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* User Tabs */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          href: adminHref,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          href: adminHref,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="analytics-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="volunteer"
        options={{
          title: 'Volunteer',
          href: adminHref,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="hand-extended"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          href: null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="map"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="newsletter"
        options={{
          title: 'Newsletter',
          href: adminHref,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="newspaper"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: adminHref,
          tabBarIcon: ({ color, size }) => (
            <Octicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Admin Tabs */}
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          title: 'Dashboard',
          href: userHref,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ContentEdit"
        options={{
          title: 'Content Edit',
          href: userHref,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="newspaper-variant-multiple"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="admin-profile"
        options={{
          title: 'Profile',
          href: userHref,
          tabBarIcon: ({ color, size }) => (
            <Octicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="admin-analytics"
        options={{
          title: 'Analytics',
          href: null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="VolunteerView"
        options={{
          title: 'Volunteer View',
          href: null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="bar-chart"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden Routes */}
      <Tabs.Screen
        name="AddEcoAction"
        options={{
          href: null,
          title: 'Add Eco Action',
        }}
      />

      <Tabs.Screen
        name="AdminEditEcoAction"
        options={{
          href: null,
          title: 'Edit Eco Action',
        }}
      />

      <Tabs.Screen
        name="AdminNewsAddFormView"
        options={{
          href: null,
          title: 'News Add Form',
        }}
      />

      <Tabs.Screen
        name="AdminNewsEditFormView"
        options={{
          href: null,
          title: 'Edit Newsletter',
        }}
      />
    </Tabs>
  );
}
