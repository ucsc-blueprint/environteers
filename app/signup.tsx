import { View } from 'react-native';
import SignupForm from '@/components/SignupForm';
import { supabase } from '@/constants/supabase';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import * as Linking from 'expo-linking';
import React from 'react';
export default function SignupScreen() {
  const router = useRouter();
  const {user, profile} = useAuth();
    
  React.useEffect(() => {
    if (user && profile) {
      router.push('/(tabs)/volunteer')
    }
  }, [user, profile, router])

  const { isAdmin: isAdminParam } = useLocalSearchParams();

  async function onSubmit(firstName: string, lastName: string, email: string, password: string, isAdmin: boolean) {
    console.log('onSubmit fired');
    const redirectTo = Linking.createURL('confirm'); // link for going back into the app for the email verification button

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed',
        text2: error.message
      })
      return;
    };
    const {error: insertError} = await supabase.from('users').insert({
      user_id: data.user!.id,
      first_name: firstName,
      last_name: lastName,
      email,
      is_admin: isAdmin
    })
    if (insertError) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed',
        text2: insertError.message
      })
      return;
    };

    Toast.show({
      type: 'success',
      text1: 'check your email',
      text2: 'Click the verification link in your email to complete the signup process'
    })    
  }
  return (
    <View style={{flex: 1}}>
      <SignupForm onSubmit={onSubmit} isAdmin={isAdminParam === 'true'} />
    </View>
  )
}
