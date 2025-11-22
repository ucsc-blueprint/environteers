import { View, Text } from "react-native";
import { Button } from "./Button";

export interface LoginProps {
  onSubmit: (email: string, password: string) => void;
} 
export const LoginForm = ({onSubmit}: LoginProps) => {
  return (
    <View>
      <Text>Login Form Here</Text>
      
      <Button
        primary
        label="Submit"
        onPress={() => onSubmit("placholder email", "placeholder password")} />
    </View>
  )
}