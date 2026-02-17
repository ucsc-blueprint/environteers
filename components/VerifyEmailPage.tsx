import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const VerifyEmailPage = () => {
    const { isAdmin } = useLocalSearchParams();
    const isAdminUser = isAdmin === 'true';

    return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify email</Text>
        <Text style={styles.subtitle}>
        We just sent a confirmation email to the Environteers {isAdminUser ? 'admin email' : 'email'}: <Text style={styles.email}>***@gmail.com</Text>
        </Text>
        <Image 
            source={require('../assets/images/email-icon.png')}
            style={styles.icon}
            resizeMode="contain"
            />

        <Text style={styles.instructionText}>
          Click the confirmation link in that email&apos;'s inbox to continue.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.customButton,
            pressed && styles.customButtonPressed,
          ]}
        >
          <Text style={styles.customButtonText}>Resend Code?</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5DC',
      justifyContent: 'center',
    },
  
    content: {
      paddingHorizontal: 24,
      alignItems: 'center',
    },
  
    title: {
      fontSize: 48,
      fontWeight: 'normal',
      marginBottom: 20,
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
  
    subtitle: {
      fontSize: 16,
      marginBottom: 40,
      lineHeight: 24,
      alignSelf: 'flex-start',
    },
  
    email: {
      fontWeight: 'bold',
    },
  
    icon: {
      width: 120,
      height: 120,
      marginBottom: 40,
    },
  
    instructionText: {
      fontSize: 16,
      marginBottom: 40,
      textAlign: 'center',
      lineHeight: 24,
    },
  
    customButton: {
      backgroundColor: '#6B7C3D',
      paddingVertical: 16,
      paddingHorizontal: 60,
      borderRadius: 8,
      alignItems: 'center',
    },
  
    customButtonPressed: {
      backgroundColor: '#5a6833',
    },
  
    customButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '500',
    },
  });
  
  export default VerifyEmailPage;