
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function ContactUs() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  //const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { user, profile } = useAuth();

  const handleSend = async () => {
    if (!firstName || !lastName || !message) {
      Alert.alert('Please fill out all fields.');
      return;
    }
  
    //const userEmail = user?.email || profile?.email || 'unknown-user';
  
    const subject = encodeURIComponent('Environteers Feedback');
  
    const body = encodeURIComponent(
  `Name: ${firstName} ${lastName}
  
  Message:
  ${message}`
    );
  
    const email = 'test-email@gmail.com';
  
    const gmailUrl =
      `googlegmail://co?to=${email}&subject=${subject}&body=${body}`;
  
    const mailtoUrl =
      `mailto:${email}?subject=${subject}&body=${body}`;
  
    try {
      const canOpenGmail = await Linking.canOpenURL(gmailUrl);
  
      if (canOpenGmail) {
        await Linking.openURL(gmailUrl);
      } else {
        await Linking.openURL(mailtoUrl);
      }
  
      setFirstName('');
      setLastName('');
      setMessage('');
    } catch (err) {
      Alert.alert(
        'Could not open email app',
        'Please make sure a mail app is installed.'
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={32} color="#132433" />
        </Pressable>

        <Text style={styles.headerTitle}>Contact Us</Text>

        <View style={{ width: 32 }} />
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Share your thoughts</Text>

        <Text style={styles.description}>
          If you’d like to share feedback, share information
          about your event, or just drop us a line, fill out the
          form below:
        </Text>

        {/* First Name */}
        <Text style={styles.label}>First Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor="#9A9A9A"
          value={firstName}
          onChangeText={setFirstName}
        />

        {/* Last Name */}
        <Text style={styles.label}>Last Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          placeholderTextColor="#9A9A9A"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Email 
        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#9A9A9A"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        /> /* }

        {/* Message */}
        <Text style={styles.label}>Let us know how we can help:</Text>

        <TextInput
          style={styles.messageInput}
          placeholder="Start typing your message..."
          placeholderTextColor="#9A9A9A"
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />

        {/* Send Button */}
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  contentContainer: {
    paddingBottom: 40,
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

  card: {
    backgroundColor: '#EAF2F6',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#132433',
    marginBottom: 14,
  },

  description: {
    fontSize: 16,
    lineHeight: 30,
    color: '#132433',
    marginBottom: 30,
  },

  label: {
    fontSize: 22,
    fontWeight: '700',
    color: '#132433',
    marginBottom: 12,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C6DCEB',
    borderRadius: 16,
    height: 68,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 28,
    color: '#132433',
  },

  messageInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C6DCEB',
    borderRadius: 16,
    minHeight: 210,
    paddingHorizontal: 20,
    paddingTop: 20,
    fontSize: 16,
    marginBottom: 36,
    color: '#132433',
  },

  sendButton: {
    backgroundColor: '#5E8E16',
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '500',
  },
});