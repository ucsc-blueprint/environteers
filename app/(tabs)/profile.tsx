import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Text, View, ScrollView, StyleSheet,
  Image, FlatList, Pressable, Modal
} from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from '@/context/AuthContext';
import { useInteractions } from '@/context/InteractionsContext';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACHIEVEMENTS = [
  { threshold: 5,  label: "Novice",    description: "Complete your first five eco-actions." },
  { threshold: 10, label: "Mid-level", description: "Complete 10 eco-actions." },
  { threshold: 15, label: "Eco-Taker", description: "Complete 15 eco-actions." },
  { threshold: 20, label: "Pro",       description: "Complete 20 eco-actions." },
  { threshold: 25, label: "Gold",      description: "Complete 25 eco-actions." },
  { threshold: 30, label: "Adept",     description: "Complete 30 eco-actions." },
  { threshold: 35, label: "Expert",    description: "Complete 35 eco-actions." },
  { threshold: 40, label: "Master",    description: "Complete 40 eco-actions." },
  { threshold: 45, label: "Elite",     description: "Complete 45 eco-actions." },
  { threshold: 50, label: "Legend",    description: "Complete 50 eco-actions." },
  { threshold: 55, label: "Champion",  description: "Complete 55 eco-actions." },
  { threshold: 60, label: "Icon",      description: "Complete 60 eco-actions." },
];

export default function Profile() {
  const { profile, loading } = useAuth();
  const { cards } = useInteractions();
  const router = useRouter();

  const [newAchievement, setNewAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (loading) return <ActivityIndicator size="large" color="#000000" />;
  if (!profile) return <Redirect href="/" />;

  const completedCount = (cards ?? []).filter(i => i.completed).length;

  const lastUnlocked = [...ACHIEVEMENTS].reverse().find(a => completedCount >= a.threshold);
  const nextAchievement = ACHIEVEMENTS.find(a => completedCount < a.threshold);
  const prevThreshold = lastUnlocked
    ? (ACHIEVEMENTS[ACHIEVEMENTS.indexOf(lastUnlocked) - 1]?.threshold ?? 0)
    : 0;
  const progress = nextAchievement
    ? (completedCount - prevThreshold) / (nextAchievement.threshold - prevThreshold)
    : 1;
  const remaining = nextAchievement ? nextAchievement.threshold - completedCount : 0;

  useEffect(() => {
    const checkNewAchievement = async () => {
      const stored = await AsyncStorage.getItem('lastCompletedCount');
      const lastCount = stored ? parseInt(stored) : 0;

      const newlyUnlocked = ACHIEVEMENTS.find(
        a => completedCount >= a.threshold && lastCount < a.threshold
      );

      if (newlyUnlocked) {
        setNewAchievement(newlyUnlocked);
        setShowModal(true);
      }

      await AsyncStorage.setItem('lastCompletedCount', String(completedCount));
    };

    checkNewAchievement();
  }, [completedCount]);

  return (
    <ScrollView style={styles.container}>
      {/* Achievement popup modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Ionicons name="trophy" size={24} color="#618E20" />
              <Text style={styles.modalTitle}>Volunteering: {newAchievement?.label}</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={22} color="#333" />
              </Pressable>
            </View>
            <View style={styles.modalDivider} />
            <Text style={styles.modalDescription}>{newAchievement?.description}</Text>
            <View style={styles.modalDivider} />
            <View style={styles.modalFooter}>
              <Pressable
                style={styles.congratsButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.congratsText}>Congrats!</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
  container: { flex: 1, backgroundColor: '#EAF2F6', padding: 20 },
  settingsIcon: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 10 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#ccc', marginBottom: 12 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#618E20' },
  memberSince: { fontSize: 14, color: '#666', marginTop: 4 },
  statsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ecoCount: { fontSize: 28, fontWeight: 'bold', color: '#172A36' },
  ecoLabel: { fontSize: 13, color: '#666' },
  rewardPill: {
    marginLeft: 'auto', backgroundColor: '#DDE8F5',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  rewardPillText: { fontSize: 13, color: '#3A6EA5' },
  progressTrack: {
    height: 10, borderRadius: 5, backgroundColor: '#D9E8F0',
    flexDirection: 'row', overflow: 'hidden',
  },
  progressFill: { backgroundColor: '#618E20', borderRadius: 5 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', color: '#172A36', marginBottom: 12 },
  achievementsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 20 },
  achievementCell: { flex: 1, alignItems: 'center', marginVertical: 12 },
  achievementCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 2,
    borderColor: '#8BAFC4', justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  achievementCircleUnlocked: { borderColor: '#618E20' },
  achievementLabel: { fontSize: 12, color: '#8BAFC4', textAlign: 'center' },
  achievementLabelUnlocked: { color: '#618E20', fontWeight: '600' },
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 16, width: '85%',
    borderWidth: 2, borderColor: '#4695FF',
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, padding: 16,
  },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#172A36' },
  modalDivider: {
    height: 1, borderStyle: 'dashed',
    borderWidth: 1, borderColor: '#4695FF',
  },
  modalDescription: { fontSize: 15, color: '#618E20', padding: 16 },
  modalFooter: { padding: 16, alignItems: 'flex-end' },
  congratsButton: {
    backgroundColor: '#618E20', borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  congratsText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});