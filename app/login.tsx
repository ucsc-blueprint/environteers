import { View } from 'react-native';
import LoginForm from '@/components/LoginForm';

export default function LoginScreen() {
  function onSubmit(email: string, password: string) {
    console.log("submitted credentials: ", email, password)
  }
  return (
    <View style={{flex: 1}}>
      <LoginForm onSubmit={onSubmit}/>
    </View>
  )
}
