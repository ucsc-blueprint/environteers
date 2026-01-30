import { View } from "react-native";
import LandingPage from "@/components/LandingPage";

export default function LandingIndex() {
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
