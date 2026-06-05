import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';
import * as Linking from 'expo-linking';
import Toast from 'react-native-toast-message';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!email) { Alert.alert('Please enter your email'); return; }
    setSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL('confirm'),
    });
    setSending(false);
    if (error) {
      Toast.show({ type: 'error', text1: 'Failed to send reset email', text2: error.message });
    } else {
      Toast.show({ type: 'success', text1: 'Successful', text2: 'Reset link sent!' });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={20} color="#757575" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.body}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.paragraph}>
          No worries, we'll send a reset link to the account email.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#868E8B"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            sending && styles.buttonDisabled,
          ]}
          onPress={handleSend}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FBF2',
    paddingHorizontal: 40,
  },

  backButton: {
    marginTop: 72,
    marginBottom: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: -4,
  },

  backText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#757575',
  },

  body: {
    flex: 1,
    marginTop: 125,
  },

  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#57811D',
    lineHeight: 46,
    marginBottom: 24,
  },

  paragraph: {
    fontSize: 16,
    fontWeight: '400',
    color: '#172A36',
    lineHeight: 24,
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },

  button: {
    backgroundColor: '#3A5513',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  buttonPressed: {
    backgroundColor: '#2d4210',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#F2F7F5',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
});
