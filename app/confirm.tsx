import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';
export default function AuthConfirmScreen() {
  const router = useRouter();
  const url = Linking.useLinkingURL();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    console.log('Received URL:', url);

    const hash = url.split('#')[1];
    if (!hash) return;

    const params = Object.fromEntries(new URLSearchParams(hash));
    const { access_token, refresh_token } = params;

    if (!access_token || !refresh_token) {
      setError('Invalid or expired verification link.');
      return;
    }

    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) {
          setError(error.message);
        } else {
          router.replace('/(tabs)/volunteer'); //fallback route
        }
      });
  }, [url, router]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#86AE42" />
      <Text style={styles.label}>Verifying your email…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#DCE3E8',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 15,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
