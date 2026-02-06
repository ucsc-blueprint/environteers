import { View, Text } from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { profile } = useAuth()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home</Text>
      <Text>You are: {profile?.username}</Text>
      <LogoutButton/>
    </View>
  );
}
