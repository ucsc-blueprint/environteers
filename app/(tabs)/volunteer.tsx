import { ScrollView } from "react-native";
import { EcoFeed, Header } from "@/components/EcoFeed";

export default function Volunteer() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Header />

      <EcoFeed
        type="Eco-Action"
        title="SC Mountains Trail Stewardship: Hike & Help at Arana Gulch"
        date="Nov 3 | 4–5pm"
        location="Frederick Street Entrance, 440 Frederick St."
        spotsLeft={2}
        onLearnMore={() => {}}
        onSignUp={() => {}}
      />

      <EcoFeed
        type="Event"
        title="Community Beach Cleanup"
        date="Nov 10 | 9–11am"
        location="Main Beach, Santa Cruz"
        onLearnMore={() => {}}
        onSignUp={() => {}}
      />

      <EcoFeed
        type="Eco-Action"
        title="Tree Planting Day"
        date="Nov 18 | 1–3pm"
        location="DeLaveaga Park"
        spotsLeft={5}
        onLearnMore={() => {}}
        onSignUp={() => {}}
      />
    </ScrollView>
  );
}
