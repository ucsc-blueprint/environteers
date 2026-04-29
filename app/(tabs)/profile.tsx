import React from 'react';
import { ActivityIndicator, Text, View, ScrollView, StyleSheet, Image, FlatList, Pressable } from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from '@/context/AuthContext';
import { useInteractions } from '@/context/InteractionsContext';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ACHIEVEMENTS = [
  { threshold: 5,  label: "Novice" },
  { threshold: 10, label: "Adept" },
  { threshold: 15, label: "Expert" },
  { threshold: 20, label: "Master" },
  { threshold: 25, label: "Mid-level" },
  { threshold: 30, label: "Bronze" },
  { threshold: 35, label: "Silver" },
  { threshold: 40, label: "Gold" },
  { threshold: 45, label: "Pro" },
  { threshold: 50, label: "Legend" },
  { threshold: 55, label: "Elite" },
  { threshold: 60, label: "Champion" },
];

export default function Profile() {
  const { profile, loading } = useAuth();
  const { interactions } = useInteractions();
  const router = useRouter();

  if (loading) return <ActivityIndicator size="large" color="#000000" />;
  if (!profile) return <Redirect href="/" />;

  const completedCount = (interactions ?? []).filter(i => i.completed).length;

  const lastUnlocked = [...ACHIEVEMENTS].reverse().find(a => completedCount >= a.threshold);
  const nextAchievement = ACHIEVEMENTS.find(a => completedCount < a.threshold);
  const prevThreshold = lastUnlocked
    ? (ACHIEVEMENTS[ACHIEVEMENTS.indexOf(lastUnlocked) - 1]?.threshold ?? 0)
    : 0;
  const progress = nextAchievement
    ? (completedCount - prevThreshold) / (nextAchievement.threshold - prevThreshold)
    : 1;
  const remaining = nextAchievement ? nextAchievement.threshold - completedCount : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Settings button */}
      <Pressable style={styles.settingsIcon} onPress={() => router.push('/profilesettings')}>
        <Ionicons name="settings-outline" size={24} color="#333" />
      </Pressable>

      {/* Avatar + name */}
      <View style={styles.avatarSection}>
        <Image style={styles.avatar} source={require('../../assets/images/PFP.png')} />
        <Text style={styles.name}>{profile.first_name} {profile.last_name}</Text>
        <Text style={styles.memberSince}>Member for 3 years</Text>
      </View>

      {/* Stats card */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <Ionicons name="leaf" size={32} color="#618E20" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.ecoCount}>{completedCount}</Text>
            <Text style={styles.ecoLabel}>Eco-Actions</Text>
          </View>
          {nextAchievement && (
            <View style={styles.rewardPill}>
              <Text style={styles.rewardPillText}>{remaining} until next reward!</Text>
            </View>
          )}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { flex: progress }]} />
          <View style={{ flex: 1 - progress }} />
        </View>
      </View>

      {/* Achievements */}
      <Text style={styles.sectionHeader}>Achievements</Text>
      <View style={styles.achievementsCard}>
        <FlatList
          data={ACHIEVEMENTS}
          numColumns={4}
          scrollEnabled={false}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => {
            const unlocked = completedCount >= item.threshold;
            return (
              <View style={styles.achievementCell}>
                <View style={[styles.achievementCircle, unlocked && styles.achievementCircleUnlocked]}>
                  <Ionicons
                    name={unlocked ? "trophy" : "lock-closed"}
                    size={28}
                    color={unlocked ? "#618E20" : "#8BAFC4"}
                  />
                </View>
                <Text style={[styles.achievementLabel, unlocked && styles.achievementLabelUnlocked]}>
                  {unlocked ? item.label : "???"}
                </Text>
              </View>
            );
          }}
        />
      </View>

      <LogoutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2F6',
    padding: 20,
  },
  settingsIcon: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
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
});