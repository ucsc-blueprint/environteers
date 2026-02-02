import { Tabs, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Octicons from '@expo/vector-icons/Octicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useAuth } from '@/context/AuthContext'
import { Text } from 'react-native'

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
        name="volunteer"
        options={{
          title: 'Volunteer',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="hand-extended" size={size} color={color} />
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
