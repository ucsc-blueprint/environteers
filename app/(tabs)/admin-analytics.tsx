import React from 'react';
import {
  View, ScrollView, Text, ActivityIndicator,
  StyleSheet, FlatList, Pressable,
} from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { AdminFeedbackList } from '@/components/AdminFeedbackList';
import { supabase } from '@/constants/supabase';

const ACHIEVEMENTS = [
  { threshold: 5,  label: 'Novice',    description: 'Complete your first five eco-actions.' },
  { threshold: 10, label: 'Mid-level', description: 'Complete 10 eco-actions.' },
  { threshold: 15, label: 'Eco-Taker', description: 'Complete 15 eco-actions.' },
  { threshold: 20, label: 'Pro',       description: 'Complete 20 eco-actions.' },
  { threshold: 25, label: 'Gold',      description: 'Complete 25 eco-actions.' },
  { threshold: 30, label: 'Adept',     description: 'Complete 30 eco-actions.' },
  { threshold: 35, label: 'Expert',    description: 'Complete 35 eco-actions.' },
  { threshold: 40, label: 'Master',    description: 'Complete 40 eco-actions.' },
  { threshold: 45, label: 'Elite',     description: 'Complete 45 eco-actions.' },
  { threshold: 50, label: 'Legend',    description: 'Complete 50 eco-actions.' },
  { threshold: 55, label: 'Champion',  description: 'Complete 55 eco-actions.' },
  { threshold: 60, label: 'Icon',      description: 'Complete 60 eco-actions.' },
];

type CompletedItem = {
  id: string;
  title: string;
  type: 'event' | 'eco-action';
  date: string;
};

type Tab = 'achievements' | 'manage';

export default function AdminAnalytics() {
  const { volunteerName, membershipStatus, volunteerID } = useLocalSearchParams();
  const { profile, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = React.useState<Tab>('achievements');
  const [feedback, setFeedback] = React.useState<any[]>([]);
  const [loadingFeedback, setLoadingFeedback] = React.useState(true);
  const [completedItems, setCompletedItems] = React.useState<CompletedItem[]>([]);
  const [loadingCompleted, setLoadingCompleted] = React.useState(true);
  const [ecoCount, setEcoCount] = React.useState(0);

  React.useEffect(() => {
    if (!volunteerID) return;
    const id = Array.isArray(volunteerID) ? volunteerID[0] : volunteerID;

    const fetchFeedback = async () => {
      setLoadingFeedback(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (error) { setLoadingFeedback(false); return; }

      const formatted: any[] = [];
      for (const item of data) {
        let eventName = '';
        if (item.event_id) {
          const { data: ev } = await supabase
            .from('events').select('title').eq('id', item.event_id).single();
          if (ev) eventName = ev.title;
        } else if (item.inperson_ecoaction_id) {
          const { data: ip } = await supabase
            .from('inperson_ecoactions').select('title').eq('id', item.inperson_ecoaction_id).single();
          if (ip) eventName = ip.title;
        } else if (item.online_ecoaction_id) {
          const { data: ol } = await supabase
            .from('online_ecoactions').select('title').eq('id', item.online_ecoaction_id).single();
          if (ol) eventName = ol.title;
        }
        formatted.push({
          event_name: eventName,
          user_name: volunteerName || 'Volunteer Name',
          feedback_content: item.content,
          date: new Date(item.created_at),
          is_specific: true,
          membership: membershipStatus,
          user_id: volunteerID,
        });
      }
      setFeedback(formatted);
      setLoadingFeedback(false);
    };

    // ── Fetch interactions ────────────────────────────────────────────────
    const fetchInteractions = async () => {
      setLoadingCompleted(true);

      const [inPersonRes, onlineRes, eventsRes] = await Promise.all([
        supabase
          .from('interactions_eco_inperson')
          .select('*, inperson_ecoactions(*)')
          .eq('user_id', id)
          .eq('completed', true),
        supabase
          .from('interactions_eco_online')
          .select('*, online_ecoactions(*)')
          .eq('user_id', id)
          .eq('completed', true),
        supabase
          .from('interactions_events')
          .select('*, events(*)')
          .eq('user_id', id)
          .eq('completed', true),
      ]);

      const inPersonItems: CompletedItem[] = (inPersonRes.data || []).map((r: any) => ({
        id: `ip-${r.id}`,
        title: r.inperson_ecoactions?.title ?? 'Eco-Action',
        type: 'eco-action',
        date: r.completed_timestamp ?? r.signed_up_timestamp ?? '',
      }));

      const onlineItems: CompletedItem[] = (onlineRes.data || []).map((r: any) => ({
        id: `ol-${r.id}`,
        title: r.online_ecoactions?.title ?? 'Eco-Action',
        type: 'eco-action',
        date: r.completed_timestamp ?? r.signed_up_timestamp ?? '',
      }));

      const eventItems: CompletedItem[] = (eventsRes.data || []).map((r: any) => ({
        id: `ev-${r.id}`,
        title: r.events?.title ?? 'Event',
        type: 'event',
        date: r.completed_timestamp ?? r.signed_up_timestamp ?? '',
      }));

      // eco count = in-person + online only (matches profile.tsx completedCount logic)
      setEcoCount(inPersonItems.length + onlineItems.length);

      const all = [...inPersonItems, ...onlineItems, ...eventItems].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setCompletedItems(all);
      setLoadingCompleted(false);
    };

    fetchFeedback();
    fetchInteractions();
  }, [volunteerID]);

  const lastUnlocked = [...ACHIEVEMENTS].reverse().find(a => ecoCount >= a.threshold);
  const nextAchievement = ACHIEVEMENTS.find(a => ecoCount < a.threshold);
  const prevThreshold = lastUnlocked
    ? (ACHIEVEMENTS[ACHIEVEMENTS.indexOf(lastUnlocked) - 1]?.threshold ?? 0)
    : 0;
  const progress = nextAchievement
    ? (ecoCount - prevThreshold) / (nextAchievement.threshold - prevThreshold)
    : 1;
  const remaining = nextAchievement ? nextAchievement.threshold - ecoCount : 0;

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (!profile) return <Redirect href="/" />;
  if (!profile.is_admin) return <Redirect href="/(tabs)/volunteer" />;

  const name = Array.isArray(volunteerName) ? volunteerName[0] : volunteerName ?? 'Volunteer Name';
  const membership = Array.isArray(membershipStatus) ? membershipStatus[0] : membershipStatus ?? '';

  const formatDate = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `On ${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
  };

  return (
    <ScrollView style={styles.container}>

      <Pressable style={styles.backRow} onPress={() => router.push('/(tabs)/VolunteerView')}>
        <Ionicons name="chevron-back" size={16} color="#172A36" />
        <Text style={styles.backText}>All Users</Text>
      </Pressable>

      <View style={styles.avatarSection}>
        <View style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.memberSince}>{membership}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <Ionicons name="leaf" size={32} color="#618E20" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.ecoCount}>{ecoCount}</Text>
            <Text style={styles.ecoLabel}>Eco-Actions</Text>
          </View>
          {nextAchievement && (
            <View style={styles.rewardPill}>
              <Text style={styles.rewardPillText}>{remaining} until next reward!</Text>
            </View>
          )}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { flex: Math.max(progress, 0.01) }]} />
          <View style={{ flex: Math.max(1 - progress, 0) }} />
        </View>
      </View>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabBtn, tab === 'achievements' && styles.tabBtnActive]}
          onPress={() => setTab('achievements')}
        >
          <Text style={[styles.tabText, tab === 'achievements' && styles.tabTextActive]}>
            User Achievements
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, tab === 'manage' && styles.tabBtnActive]}
          onPress={() => setTab('manage')}
        >
          <Text style={[styles.tabText, tab === 'manage' && styles.tabTextActive]}>
            Manage this user
          </Text>
        </Pressable>
      </View>

      {tab === 'achievements' && (
        <>
          <Text style={styles.sectionHeader}>Achievements</Text>
          <View style={styles.achievementsCard}>
            <FlatList
              data={ACHIEVEMENTS}
              numColumns={4}
              scrollEnabled={false}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => {
                const unlocked = ecoCount >= item.threshold;
                return (
                  <View style={styles.achievementCell}>
                    <View style={[
                      styles.achievementCircle,
                      unlocked && styles.achievementCircleUnlocked,
                    ]}>
                      <Ionicons
                        name={unlocked ? 'trophy' : 'lock-closed'}
                        size={28}
                        color={unlocked ? '#618E20' : '#8BAFC4'}
                      />
                    </View>
                    <Text style={[
                      styles.achievementLabel,
                      unlocked && styles.achievementLabelUnlocked,
                    ]}>
                      {unlocked ? item.label : '???'}
                    </Text>
                  </View>
                );
              }}
            />
          </View>

          <Text style={styles.sectionHeader}>Events + Eco-actions completed</Text>
          <View style={styles.completedCard}>
            {loadingCompleted ? (
              <ActivityIndicator color="#618E20" />
            ) : completedItems.length === 0 ? (
              <Text style={styles.emptyText}>No completed items yet</Text>
            ) : (
              completedItems.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.completedRow}>
                    <Text style={styles.completedTitle}>
                      {item.type === 'event' ? 'For Event ' : 'Eco-Action '}
                      <Text style={{ fontWeight: '600' }}>{item.title}</Text>
                    </Text>
                    <Text style={styles.completedDate}>{formatDate(item.date)}</Text>
                  </View>
                  {index < completedItems.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            )}
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 8 }]}>Event feedback sent</Text>
          {loadingFeedback ? (
            <ActivityIndicator color="#618E20" style={{ marginTop: 12 }} />
          ) : feedback.length > 0 ? (
            <AdminFeedbackList data={feedback} />
          ) : (
            <Text style={styles.emptyText}>No feedback yet</Text>
          )}
        </>
      )}

      {tab === 'manage' && (
        <View style={styles.manageContainer}>
          <Text style={styles.emptyText}>Admin management options coming soon.</Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2F6',
    padding: 20,
  },

  // back
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 2,
  },
  backText: {
    fontSize: 14,
    color: '#172A36',
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#618E20',
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ecoCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#172A36',
  },
  ecoLabel: {
    fontSize: 13,
    color: '#666',
  },
  rewardPill: {
    marginLeft: 'auto',
    backgroundColor: '#DDE8F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rewardPillText: {
    fontSize: 13,
    color: '#3A6EA5',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D9E8F0',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#618E20',
    borderRadius: 5,
  },

  // tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#618E20',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#172A36',
    marginBottom: 12,
  },

  achievementsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
  },
  achievementCell: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 12,
  },
  achievementCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#8BAFC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  achievementCircleUnlocked: {
    borderColor: '#618E20',
  },
  achievementLabel: {
    fontSize: 12,
    color: '#8BAFC4',
    textAlign: 'center',
  },
  achievementLabelUnlocked: {
    color: '#618E20',
    fontWeight: '600',
  },

  // completed items list
  completedCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  completedRow: {
    paddingVertical: 10,
  },
  completedTitle: {
    fontSize: 14,
    color: '#172A36',
  },
  completedDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },

  emptyText: {
    fontSize: 13,
    color: '#888',
  },

  manageContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
});