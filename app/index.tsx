import { View } from "react-native";
import LandingPage from "@/components/LandingPage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React from "react";

export default function LandingIndex() {
  const router = useRouter();
  const {user, profile} = useAuth();
  
  React.useEffect(() => {
    if (user && profile) {
      router.push('/(tabs)/home')
    }
  }, [user, profile, router])
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LandingPage />
    </View>
  );
}
