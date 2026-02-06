import { ScrollView, StyleSheet, View } from "react-native";
import { EcoFeed, Header } from "@/components/EcoFeed";
import { useEffect, useState } from "react";
import { supabase } from "@/constants/supabase";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

type VolunteerItem = {
  id: string;
  type: "Eco-Action" | "Event";
  title: string;
  liked: boolean;
  cover_photo: string;
  description: string;
  sign_up_link: string;
  time_taken?: string;
  date?: string;
  location?: string;
  spotsLeft?: number;
};

function formatEventDate(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Format day
  const day = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Format time range
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: undefined,
  });
  const endTime = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: undefined,
  });

  return `${day} | ${startTime}–${endTime}`;
}


export default function Volunteer() {
  const [items, setItems] = useState<VolunteerItem[]>([]);

  useEffect(() => {
    const fetchVolunteerData = async () => {

    // EVENTS
    const { data: events } = await supabase
      .from("events")
      .select("event_id, event_name, start_time, end_time, location, type, cover_photo, liked, description, sign_up_link");

    // PETITIONS / CAMPAIGNS
    const { data: petitions } = await supabase
      .from("petitions_campaigns")
      .select("id, title, time_taken, type, cover_photo, liked, description, sign_up_link");
    
    const eventItems: VolunteerItem[] = events?.map((e) => ({
      id: e.event_id,
      type: e.type,
      title: e.event_name,
      date: formatEventDate(e.start_time, e.end_time),
      location: e.location,
      cover_photo: e.cover_photo,
      liked: e.liked ?? false,
      description: e.description,
      sign_up_link: e.sign_up_link,
    })) ?? [];

    const otherItems: VolunteerItem[] = petitions?.map((p) => ({
      id: p.id,
      type: p.type,
      title: p.title,
      time_taken: p.time_taken ?? '',
      cover_photo: p.cover_photo,
      liked: p.liked ?? false,
      description: p.description,
      sign_up_link: p.sign_up_link,
    })) ?? [];

      setItems([...eventItems, ...otherItems]);
      // setLoading(false);
    };

    fetchVolunteerData();
  }, []);

  return (
    <LinearGradient
        colors={['white','#EDF3F7', '#EAF2F6']}
        locations={[0.8, 0.9, 1]}
        start={{ x: 0, y: 0}}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradient}
      >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
        <Header resultsCount={items.length}/>
        { items.map((item) => (
          <EcoFeed
            key={`${item.type}-${item.id}`}
            {...item}
            onLearnMore={() => {}}
            onSignUp={() => {}}
          />
        ))}
      </ScrollView>
        <View style={styles.mapBackground}>
          <MaterialCommunityIcons name="map" size={30} color={'#0282D3'}></MaterialCommunityIcons>          
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  mapBackground: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 15,
    maxWidth: 80,
    position: 'absolute',
    bottom: 10,
    right: 20,
    boxShadow: '0px 0px 10px 0px #0282D333',
  }
});
