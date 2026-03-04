import { View } from 'react-native';
import SignupForm from '@/components/SignupForm';
import { supabase } from '@/constants/supabase';
import Toast from 'react-native-toast-message';
import React from 'react';
import * as Linking from "expo-linking"

export default function SignupScreen() {
  
  async function onSubmit(username: string, email: string, password: string, isAdmin: boolean) {
    const redirectUrl = Linking.createURL('login');
    console.log(redirectUrl)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
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
      username,
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
    // await supabase.auth.signInWithPassword({ email, password });

    Toast.show({
      type: 'success',
      text1: 'Check your email for a confirmation link',
    })
  }
  return (
    <View style={{flex: 1}}>
      <SignupForm onSubmit={onSubmit}/>
    </View>
  )
}