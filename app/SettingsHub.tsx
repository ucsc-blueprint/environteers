import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LogoutButton } from '@/components/LogoutButton';

const LEGAL_URL = 'https://environteers.org/app-policies';

export default function SettingsHub() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name='chevron-back' size={30} color='#132433' />
        </Pressable>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={{ width: 30 }} />
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        {/* Manage Account */}
        <Pressable style={styles.option} onPress={() => router.push('/profilesettings')}>
          <View style={styles.optionLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name='person-outline' size={32} color='#132433' />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Manage Account</Text>
              <Text style={styles.optionSubtitle}>View account, email, and password reset</Text>
            </View>
          </View>

          <View style={styles.chevron}>
            <Ionicons name='chevron-forward' size={28} color='#132433' />
          </View>
        </Pressable>

        <View style={styles.divider} />

        {/* Contact Us */}
        <Pressable style={styles.option} onPress={() => router.push('/ContactUs')}>
          <View style={styles.optionLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name='chatbubble-outline' size={30} color='#132433' />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Contact Us</Text>
              <Text style={styles.optionSubtitle}>Questions or comments? Let us know!</Text>
            </View>
          </View>

          <View style={styles.chevron}>
            <Ionicons name='chevron-forward' size={28} color='#132433' />
          </View>
        </Pressable>
      </View>

      <View style={styles.legalContainer}>
        <Pressable onPress={() => Linking.openURL(LEGAL_URL)}>
          <Text style={styles.legalLink}>Privacy Policy & Legal</Text>
        </Pressable>
      </View>

      <LogoutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  header: {
    height: 120,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 18,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: '#132433',
  },

  cardContainer: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#D2E5F1',
    overflow: 'hidden',
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconCircle: {
    width: 58,
    alignItems: 'center',
    marginRight: 18,
  },

  textContainer: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#132433',
    marginBottom: 8,
  },

  optionSubtitle: {
    fontSize: 15,
    color: '#6C93B0',
    lineHeight: 22,
  },

  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  divider: {
    height: 2,
    backgroundColor: '#D2E5F1',
  },

  legalContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },

  legalLink: {
    fontSize: 13,
    color: '#6C93B0',
    textDecorationLine: 'underline',
  },
});
