import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';
import Toast from 'react-native-toast-message';

export default function ResetPassword() {
  const router = useRouter();
  const url = Linking.useLinkingURL();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { access_token, refresh_token } = useLocalSearchParams<{ access_token: string, refresh_token: string }>();

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Please fill out all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    setSubmitting(true);

    const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token
    });
    if (sessionError) {
      Alert.alert('Error', sessionError.message);
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    await supabase.auth.signOut();
    setSubmitting(false);

    if (error) {
      Alert.alert(
        'Error',
        `${error.message}. Please request a new reset link.`,
        [{ text: 'OK', onPress: () => router.replace('/forgotPassword') }]
      );
    } else {
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'You can now sign in with your new password.',
      });
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={20} color="#757575" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.body}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.paragraph}>
          Please enter a new password for your account.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#868E8B"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable style={styles.eyeIcon} onPress={() => setShowPassword(prev => !prev)}>
            {showPassword ? <EyeOff size={18} color="#868E8B" /> : <Eye size={18} color="#868E8B" />}
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor="#868E8B"
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Pressable style={styles.eyeIcon} onPress={() => setShowConfirm(prev => !prev)}>
            {showConfirm ? <EyeOff size={18} color="#868E8B" /> : <Eye size={18} color="#868E8B" />}
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            submitting && styles.buttonDisabled,
          ]}
          onPress={handleReset}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm Password Reset</Text>
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

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginTop: 8,
    paddingRight: 14,
  },

  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },

  eyeIcon: {
    padding: 4,
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
  },
});
