import { View } from 'react-native';
import SignupForm from '@/components/SignupForm';

export default function SignupScreen() {
  function onSubmit() {
    console.log("submitted credentials")
  }
  return (
    <View style={{flex: 1}}>
      <SignupForm onSubmit={onSubmit}/>
    </View>
  )
}