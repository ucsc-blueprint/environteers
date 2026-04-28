import { Tabs, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Octicons from '@expo/vector-icons/Octicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useAuth } from '@/context/AuthContext'
import { Text, Pressable, View } from 'react-native'
import { User } from 'lucide-react-native'



export default function TabsLayout() {
  const router = useRouter();
  const { user, loading, profile } = useAuth()

  useEffect(() => {
    if (!loading && !user && !profile) {
      router.replace('/')
    }
  }, [user, loading, profile, router])
  
  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="volunteer"
        options={{
          title: 'Volunteer',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hand-extended" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          href: null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="newsletter"
        options={{
          title: 'Newsletter',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="admin-dashboard"
        options={{
          title: 'Dashboard',
          href: profile?.is_admin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),

          headerRight: () => {

            return (
              <Pressable
                onPress={() => router.push('/profile')}
                style={{ marginRight: 16 }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#f0f0f0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <User size={25} color="#555" />
                </View>
              </Pressable>
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* Admin only tabs */}
      <Tabs.Screen
        name="admin-analytics"
        options={{
          href: null,
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="VolunteerView"
        options={{
          href: profile?.is_admin ? undefined : null,
          title: 'Volunteer View',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size = {size} color = {color}></Ionicons>
          ),
        }}
      />
      <Tabs.Screen
       name = "AddEcoAction"
        options = {{
          href: null,
          title: 'Add Eco Action',
        }}
      />
      <Tabs.Screen
       name = "AdminEditEcoAction"
        options = {{
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
