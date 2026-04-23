import { ActivityIndicator, View, Pressable, Text, StyleSheet } from "react-native";
import { AdminVolunteersView } from "@/components/AdminVolunteersView";
import AdminFeedbackView from '@/components/AdminFeedbackView'
import React from "react";
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';

export default function VolunteerView() {
  const [tab, setTab] = React.useState<"volunteers" | "feedback">("volunteers");
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#84bd00" />
      </View>
    );
  }

  if (!profile) return <Redirect href="/" />;
  if (!profile.is_admin) return <Redirect href="/(tabs)/volunteer" />;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <Pressable 
          onPress={() => setTab("volunteers")}
          style={[styles.tabButton, tab === "volunteers" && styles.activeTab]}
        >
          <Text style={[styles.tabText, tab === "volunteers" && styles.activeTabText]}>
            Volunteers
          </Text>
        </Pressable>

        <Pressable 
          onPress={() => setTab("feedback")}
          style={[styles.tabButton, tab === "feedback" && styles.activeTab]}
        >
          <Text style={[styles.tabText, tab === "feedback" && styles.activeTabText]}>
            Feedback
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {tab === "volunteers" ? <AdminVolunteersView /> : <AdminFeedbackView />}
      </View>
    </View>
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
  tabBar: {
    flexDirection: "row",
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 8,
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
  }
});