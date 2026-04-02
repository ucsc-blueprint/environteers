import { View, Text } from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import Map from "./map";

export default function Home() {
  const { profile } = useAuth()
  return (
    <View
      style={{
        flex: 1,

      }}
    >
      <Map />
      <Text>You are: {profile?.first_name} {profile?.last_name}</Text>
      <LogoutButton/>
      
    </View>
  );
}
