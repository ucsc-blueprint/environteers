import React from 'react';
import { Pressable, Text, Alert, StyleSheet } from 'react-native';

import { supabase } from '@/constants/supabase';

export const LogoutButton: React.FC = () => {
  const handleLogout = async (): Promise<void> => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.auth.signOut();

          if (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  return (
    <Pressable style={styles.logoutButton} onPress={handleLogout}>
      <Text style={styles.logoutText}>Log Out</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginTop: 28,
    marginHorizontal: 20,
    backgroundColor: '#F10000',
    borderRadius: 20,
    height: 68,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
});
