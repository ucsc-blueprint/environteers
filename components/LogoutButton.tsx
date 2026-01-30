import {Pressable, Text, Alert} from 'react-native';
import { supabase } from '@/constants/supabase';
import { useRouter } from 'expo-router';
import React from 'react';

export const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
       {
        text: 'Cancel', style: 'cancel'
       },
       {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut();

          if (error) {
            Alert.alert('Error', error.message);
          } else {
            router.replace('/login')
          }
        }
       }
      ]
    )
  };
  return (
    <Pressable onPress={handleLogout}>
      <Text style={{color: 'red', fontSize: 16}}>Log out</Text>
    </Pressable>
  )
}