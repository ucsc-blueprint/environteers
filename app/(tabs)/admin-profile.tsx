import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { AdminProfileView } from '@/components/AdminProfileView';
import { AdminPendingView } from '@/components/AdminPendingView';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { formatMembership } from '@/components/AdminVolunteersView';
import { UserAvatar } from '@/components/UserAvatar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminProfile() {
  const [tab, setTab] = useState<'pending' | 'active'>('pending');
  const { profile, loading } = useAuth();
  const router = useRouter();

  if (loading) return <ActivityIndicator size='large' color='#000000' />;
  if (!profile) return <Redirect href='/' />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.settingsIcon} onPress={() => router.push('/SettingsHub')}>
          <Ionicons name='settings-outline' size={24} color='#333' />
        </Pressable>

        <View style={{ marginRight: 6 }}>
          <UserAvatar
            firstName={profile.first_name}
            lastName={profile.last_name}
            photoUrl={profile.profile_picture}
            size={85}
          />
        </View>
        <View style={styles.names}>
          <Text style={styles.name}>
            {profile.first_name} {profile.last_name}
          </Text>
          <Text style={styles.membership}>{formatMembership(profile.created_at)}</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setTab('pending')}
          style={[styles.tabButton, tab === 'pending' && styles.activeTab]}
        >
          <Text style={[styles.tabText, tab === 'pending' && styles.activeTabText]}>
            Pending Requests
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setTab('active')}
          style={[styles.tabButton, tab === 'active' && styles.activeTab]}
        >
          <Text style={[styles.tabText, tab === 'active' && styles.activeTabText]}>
            Active Admins
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {tab === 'pending' ? <AdminPendingView /> : <AdminProfileView />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    marginTop: '15%',
    borderRadius: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  names: {
    flexDirection: 'column',
    margin: 10,
  },
  name: {
    fontWeight: 700,
    fontSize: 24,
    color: '#57811D',
  },
  membership: {
    fontWeight: 500,
    fontSize: 16,
    color: '#929292',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#D5D5D5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#84bd00',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    backgroundColor: '#EAF2F6',
  },
  settingsIcon: {
    position: 'absolute',
    top: 0,
    right: 20,
  },
});
