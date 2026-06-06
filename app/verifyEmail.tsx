import { useLocalSearchParams } from 'expo-router';
import VerifyEmail from '@/components/VerifyEmail';

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  return <VerifyEmail email={email ?? ''} />;
}