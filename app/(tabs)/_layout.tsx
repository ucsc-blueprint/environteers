import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/context/AuthContext';
import { useInteractions } from '@/context/InteractionsContext';
import { Text, View, StyleSheet } from 'react-native';
import { supabase } from '@/constants/supabase';
import { cardRequiresAction } from '@/utils/activityHelpers';

function TabBarIconWithBadge({
  children,
  showBadge,
}: {
  children: React.ReactNode;
  showBadge: boolean;
}) {
  return (
    <View style={styles.iconContainer}>
      {children}
      {showBadge && <View style={styles.badge} />}
    </View>
  );
}

export default function TabsLayout() {
  const router = useRouter();
  const { user, loading, profile, isBanned } = useAuth();
  const { cards } = useInteractions();
  const hasRequiresAction = cards.some((card) => cardRequiresAction(card));

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/');
      return;
    }

    if (isBanned) {
      supabase.auth.signOut();
      router.replace('/');
    }
  }, [user, loading, isBanned, router]);

  if (loading || !profile) {
    return <Text>Loading...</Text>;
  }

  const adminHref = profile?.is_admin === true ? null : undefined;
  const userHref = profile?.is_admin === true ? undefined : null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* User Tabs */}
      <Tabs.Screen
        name='activity'
        options={{
          title: 'Activity',
          href: adminHref,
          tabBarIcon: ({ color, size }) => (
            <TabBarIconWithBadge showBadge={hasRequiresAction}>
              <Feather name='activity' size={size} color={color} />
            </TabBarIconWithBadge>
          ),
        }}
      />

      <Tabs.Screen
        name='volunteer'
        options={{
          title: 'Volunteer',
          href: adminHref,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='hand-extended' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='map'
        options={{
          title: 'Map',
          href: null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='map' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='newsletter'
        options={{
          title: 'Newsletter',
          href: adminHref,
          tabBarIcon: ({ color, size }) => <Ionicons name='newspaper' size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          href: adminHref,
          tabBarIcon: ({ color, size }) => <Octicons name='person' size={size} color={color} />,
        }}
      />

      {/* Admin Tabs */}
      <Tabs.Screen
        name='admin-dashboard'
        options={{
          title: 'Dashboard',
          href: userHref,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home-variant-outline' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='ContentEdit'
        options={{
          title: 'Content Edit',
          href: userHref,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='newspaper-variant-multiple' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='admin-profile'
        options={{
          title: 'Profile',
          href: userHref,
          tabBarIcon: ({ color, size }) => <Octicons name='person' size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name='admin-analytics'
        options={{
          title: 'Analytics',
          href: null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='chart-bar' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='VolunteerView'
        options={{
          title: 'Volunteer View',
          href: null,
          tabBarIcon: ({ color, size }) => <Ionicons name='bar-chart' size={size} color={color} />,
        }}
      />

      {/* Hidden Routes */}
      <Tabs.Screen
        name='AddEcoAction'
        options={{
          href: null,
          title: 'Add Eco Action',
        }}
      />

      <Tabs.Screen
        name='AdminEditEcoAction'
        options={{
          href: null,
          title: 'Edit Eco Action',
        }}
      />

      <Tabs.Screen
        name='AdminNewsAddFormView'
        options={{
          href: null,
          title: 'News Add Form',
        }}
      />

      <Tabs.Screen
        name='AdminNewsEditFormView'
        options={{
          href: null,
          title: 'Edit Newsletter',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9212',
  },
});
