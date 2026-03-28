// src/components/SignupForm.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import {Checkbox} from 'expo-checkbox';
import { useRouter } from 'expo-router';

export interface SignupFormProps {
  onSubmit: (
    username: string,
    email: string,
    password: string,
    isAdmin: boolean
  ) => void;
}

const SignupForm = ({ onSubmit }: SignupFormProps) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (_event: GestureResponderEvent) => {
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address!');
      return;
    }

    onSubmit(username, email, password, isAdmin);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <Text style={styles.label}>username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <Text style={styles.label}>email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>password</Text>
        <TextInput
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />

        <Text style={styles.label}>confirm password</Text>
        <TextInput
          value={confirmPassword}
          secureTextEntry
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        <View style={styles.checkboxRow}>
          <Checkbox
            value={isAdmin}
            onValueChange={setIsAdmin}
            color={isAdmin ? '#88B04B' : undefined}
          />
          <Text style={styles.checkboxLabel}>Are you an admin?</Text>
        </View>

        {error !== '' && (
          <Text style={styles.error}>{error}</Text>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.customButton,
            pressed && styles.customButtonPressed,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.customButtonText}>Register</Text>
        </Pressable>

        <Text style={styles.loginText}>
          Have an account? <Pressable onPress={() => router.push('/login')}><Text style={styles.loginLink}>Login</Text></Pressable>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    textTransform: 'lowercase',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 18,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
  },

  error: {
    color: 'red',
    marginBottom: 12,
  },

  customButton: {
    backgroundColor: '#88B04B',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },

  customButtonPressed: {
    backgroundColor: '#75a03f',
  },

  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loginText: {
    textAlign: 'center',
    fontSize: 14,
  },

  loginLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignupForm;
