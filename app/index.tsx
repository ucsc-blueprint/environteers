import { View } from "react-native";
import LandingPage from "@/components/LandingPage";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React from "react";

export default function LandingIndex() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  React.useEffect(() => {
    if (loading) return;

    if (user && profile) {
      router.replace('/(tabs)/volunteer');
    }
  }, [user, profile, loading, router]);

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
