// src/components/SignupForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Button } from '@/components/Button';

export interface SignupFormProps {
  onSubmit: (username: string, email: string, password: string) => void;
}

export const SignupForm = ({ onSubmit }: SignupFormProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // clear old error first
    setError('');
    /* Basic validation */
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match!");
      setError("Passwords do not match!");
      return;
    }

    if (!email.includes('@')) {
      console.log("Please enter a valid email address!");
      setError("Please enter a valid email address!");
      return;
    }

    onSubmit(username, email, password);
    console.log("Signup submitted:", { username, email, password });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={username}
        placeholder="Username"
        onChangeText={setUsername}
        style={inputStyle}
      />
      <TextInput
        value={email}
        placeholder="Email"
        onChangeText={setEmail}
        style={inputStyle}
      />
      <TextInput
        value={password}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={inputStyle}
      />
      <TextInput
        value={confirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        style={inputStyle}
      />

      {}
      {error !== '' && (
        <Text style={{ color: 'red', marginBottom: 10 }}>
          {error}
        </Text>
      )}

      <Button label="Sign Up" backgroundColor="green" onPress={handleSubmit} />
    </View>
  );
};

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  marginBottom: 15,
  borderRadius: 5,
};

export default SignupForm;
