import { View } from 'react-native';
import SignupForm from '@/components/SignupForm';
import { supabase } from '@/constants/supabase';

export default function SignupScreen() {
  async function onSubmit(username: string, email: string, password: string, isAdmin: boolean) {
    console.log(password)
    const { data, error } = await supabase.auth.signUp({email, password});
    if (error) throw error;
    const success = await supabase.from('users').insert({
      user_id: data.user!.id,
      username,
      email,
      is_admin: isAdmin
    })
    console.log(success)
  }
  return (
    <View style={{flex: 1}}>
      <SignupForm onSubmit={onSubmit}/>
    </View>
  )
}