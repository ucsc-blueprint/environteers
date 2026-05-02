import React from 'react';
import { View, ScrollView, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { LogoutButton } from '@/components/LogoutButton';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';

export default function AdminProfile() {
  const { profile, loading } = useAuth();

  if (loading) return <ActivityIndicator size="large" color="#000000" />
  if (!profile) return <Redirect href="/" />

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarSection}>
          <Image style={styles.avatar} source={require('../../assets/images/PFP.png')} />
          <View style={styles.names}>
            <Text style={styles.name}>{profile.first_name} {profile.last_name}</Text>
            <Text style={styles.username}>{profile.username}</Text>
          </View>
        </View>

        <View style={styles.emailContainer}>
          <Text style={styles.email}>Email</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
      </View>

      <LogoutButton />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2F6',
    padding: 20,
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 45, 
    backgroundColor: '#ccc',
  },
  names: {
    flexDirection: 'column',
    margin: 10,
  },
  name: {
    fontWeight: 700,
    fontSize: 20,
  },
  username: {
    fontWeight: 500,
    fontSize: 12,
    color: "#929292",
  },
  emailContainer: {
    backgroundColor: '#D9D9D9',
    padding: 20,
    borderRadius: 10,
  },
  email: {
    fontWeight: 700,
    fontSize: 14,
  }
})