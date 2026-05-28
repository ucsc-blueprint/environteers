// src/components/SignupForm.tsx
import React, { useState } from 'react';
import {View, TextInput, Text, Pressable, GestureResponderEvent, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
export interface SignupFormProps {
  onSubmit: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isAdmin: boolean
  ) => void;
  isAdmin?: boolean;
}

const SignupForm = ({ onSubmit, isAdmin = false }: SignupFormProps) => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (_event: GestureResponderEvent) => {

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address!');
      return;
    }

    onSubmit(firstName, lastName, email, password, isAdmin);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Pressable style={styles.backButton} onPress={() => router.push('/')}>
          <ChevronLeft size={20} color="#757575" />
          <Text style={styles.backText}>
            {isAdmin ? 'Not an admin? Click to go back' : 'Back'}
          </Text>
        </Pressable>

        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          {isAdmin
            ? 'Create an admin account that the organization will later approve.'
            : 'Create an account to get involved'}
        </Text>

        <View style={styles.fields}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            placeholderTextColor="#868E8B"
            style={styles.input}
          />

          <Text style={styles.label}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            placeholderTextColor="#868E8B"
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor="#868E8B"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#868E8B"
              secureTextEntry={!showPassword}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <Pressable style={styles.eyeIcon} onPress={() => setShowPassword(prev => !prev)}>
              {showPassword ? <EyeOff size={18} color="#868E8B" /> : <Eye size={18} color="#868E8B" />}
            </Pressable>
          </View>
          <Text style={styles.hint}>Must include at least 8 characters</Text>

          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-type password"
              placeholderTextColor="#868E8B"
              secureTextEntry={!showConfirm}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <Pressable style={styles.eyeIcon} onPress={() => setShowConfirm(prev => !prev)}>
              {showConfirm ? <EyeOff size={18} color="#868E8B" /> : <Eye size={18} color="#868E8B" />}
            </Pressable>
          </View>
        </View>

        {error !== '' && (
          <Text style={styles.error}>{error}</Text>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Create account</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FBF2',
  },

  content: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },

  backButton: {
    marginTop: 72,
    marginBottom: 24,
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

  title: {
    fontSize: 36,
    fontWeight: '600',
    color: '#86AE42',
    lineHeight: 46,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
    lineHeight: 21,
    marginBottom: 24,
  },

  fields: {
    gap: 12,
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#525856',
    lineHeight: 20,
  },

  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#D9E0DE',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#172A36',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D9E0DE',
    borderRadius: 8,
  },

  eyeIcon: {
    position: 'absolute',
    right: 12,
  },

  hint: {
    fontSize: 12,
    color: '#868E8B',
    lineHeight: 12,
  },

  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },

  submitButton: {
    backgroundColor: '#3A5513',
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  submitButtonPressed: {
    backgroundColor: '#2d4210',
  },

  submitButtonText: {
    color: '#F2F7F5',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },

  loginText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#3A5513',
    lineHeight: 40,
  },

  loginLink: {
    fontWeight: '700',
  },
});

export default SignupForm;

