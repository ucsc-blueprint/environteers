import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isAdmin?: boolean;
}

const LoginForm = ({ onSubmit, isAdmin = false }: LoginFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!email || !password) {
      setError('Please fill out all fields.');
      return;
    }
    onSubmit(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps='handled'>
        <Pressable style={styles.backButton} onPress={() => router.push('/')}>
          <ChevronLeft size={20} color='#757575' />
          <Text style={styles.backText}>
            {isAdmin ? 'Not an admin? Click to go back' : 'Go back'}
          </Text>
        </Pressable>

        <Text style={styles.title}>{isAdmin ? 'Welcome Admin!' : 'Welcome Back!'}</Text>
        <Text style={styles.subtitle}>
          {isAdmin
            ? 'Log into your account to monitor environmental activities.'
            : 'Log into your account to check the latest updates!'}
        </Text>

        <View style={styles.fields}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder='Email'
            placeholderTextColor='#868E8B'
            keyboardType='email-address'
            autoCapitalize='none'
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder='Password'
              placeholderTextColor='#868E8B'
              secureTextEntry={!showPassword}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <Pressable style={styles.eyeIcon} onPress={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <EyeOff size={18} color='#868E8B' />
              ) : (
                <Eye size={18} color='#868E8B' />
              )}
            </Pressable>
          </View>
        </View>

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]}
          onPress={handleSubmit}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/forgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
    flexGrow: 1,
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
    marginTop: 100,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
    lineHeight: 21,
    marginBottom: 64,
  },

  fields: {
    gap: 12,
    marginBottom: 64,
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

  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },

  loginButton: {
    backgroundColor: '#3A5513',
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  loginButtonPressed: {
    backgroundColor: '#2d4210',
  },

  loginButtonText: {
    color: '#F2F7F5',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },

  forgotPassword: {
    textAlign: 'center',
    fontSize: 14,
    color: '#3A5513',
    lineHeight: 36,
  },
});

export default LoginForm;
