import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';

interface VerifyEmailProps {
  email: string;
}

export default function VerifyEmail({ email }: VerifyEmailProps) {
  const router = useRouter();
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try 
    {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });

        if (error) 
        {
            Alert.alert('Failed to resend', error.message);
        } 
        else 
        {
            Alert.alert('Email sent', 'A new verification email has been sent to your inbox.');
        }
    } 
    catch 
    {
        Alert.alert('Error', 'Something went wrong. Please try again.');
    } 
    finally 
    {
        setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={20} color="#757575" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.body}>
        <Text style={styles.title}>Verify Email</Text>

        <Text style={styles.paragraph}>
            We just sent a verification email to{' '}<Text style={styles.emailBold}>{email}</Text>.
        </Text>

      {/* Body content */}
        <Text style={styles.paragraph}>
            Please check your inbox and click the verification link to activate
            your account.
        </Text>

        {/* Resend button */}
        <Pressable
          style={({ pressed }) => [
            styles.resendButton,
            pressed && styles.resendButtonPressed,
            resending && styles.resendButtonDisabled,
          ]}
          onPress={handleResend}
          disabled={resending}
        >
          {resending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.resendButtonText}>Resend Email</Text>
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

  emailBold: {
    fontWeight: '700',
    color: '#172A36',
  },

  resendButton: {
    backgroundColor: '#3A5513',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  resendButtonPressed: {
    backgroundColor: '#2d4210',
  },

  resendButtonDisabled: {
    opacity: 0.6,
  },

  resendButtonText: {
    color: '#F2F7F5',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
});
