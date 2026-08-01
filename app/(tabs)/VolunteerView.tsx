import { ActivityIndicator, View, Pressable, Text, StyleSheet } from 'react-native';
import { AdminVolunteersView } from '@/components/AdminVolunteersView';
import AdminFeedbackView from '@/components/AdminFeedbackView';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VolunteerView() {
  const [tab, setTab] = React.useState<'volunteers' | 'feedback'>('volunteers');
  const { profile, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color='#84bd00' />
      </View>
    );
  }

  if (!profile) return <Redirect href='/' />;
  if (!profile.is_admin) return <Redirect href='/(tabs)/volunteer' />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backRow} onPress={() => router.push('/(tabs)/admin-dashboard')}>
          <Ionicons name='chevron-back' size={16} color='#172A36' />
          <Text style={styles.backText}>Dashboard</Text>
        </Pressable>

        <Text style={styles.adminHeaderTitle}>Manage users and feedback</Text>
      </View>

      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setTab('volunteers')}
          style={[styles.tabButton, tab === 'volunteers' && styles.activeTab]}
        >
          <Text style={[styles.tabText, tab === 'volunteers' && styles.activeTabText]}>
            Volunteers
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setTab('feedback')}
          style={[styles.tabButton, tab === 'feedback' && styles.activeTab]}
        >
          <Text style={[styles.tabText, tab === 'feedback' && styles.activeTabText]}>Feedback</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {tab === 'volunteers' ? <AdminVolunteersView /> : <AdminFeedbackView />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 14,
  },
  backText: {
    fontSize: 14,
    color: '#172A36',
  },
  adminHeaderTitle: {
    fontFamily: 'Mulish',
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F2F7F5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 4,
    marginTop: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
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
  },
});
