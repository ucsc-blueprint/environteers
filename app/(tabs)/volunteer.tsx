import { ScrollView, StyleSheet, View } from "react-native";
import { EcoFeed, Header } from "@/components/EcoFeed";
import { useEffect, useState } from "react";
import { supabase } from "@/constants/supabase";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

type OnlineEcoAction = {
  type: "online",
  id: string,
  created_at: string,
  cover_photo?: string,
  title: string,
  end_date?: Date,
  campaign_type?: string,
  email_link?: string,
  summary?: string,
}

type InPersonEcoAction = {
  type: "inperson",
  id: string,
  created_at: string,
  cover_photo?: string,
  title: string,
  location?: string,
  start_date: Date,
  end_date: Date,
  sign_up_link: string,
  summary?: string,
}

type Event = {
  type: "event",
  id: string,
  title: string,
  start_time?: Date,
  end_time?: Date,
  location?: string,
  cover_photo?: string,
  google_calendar_link?: string,
  description?: string,
  sign_up_link?: string,
}

type VolunteerItem = OnlineEcoAction | InPersonEcoAction | Event

export default function Volunteer() {
  const [items, setItems] = useState<VolunteerItem[]>([]);

  useEffect(() => {
    const fetchVolunteerData = async () => {
    
    // EVENTS
    const { data: event } = await supabase
      .from("events")
      .select("id, title, start_time, end_time, location, cover_photo, google_calendar_link, description, sign_up_link");

    // ONLINE ECO-ACTIONS
    const { data: ecoInPerson } = await supabase
      .from("inperson_eco-actions")
      .select("id, created_at, cover_photo, title, end_date, sign_up_link, summary, start_date, location");

    const { data: ecoOnline } = await supabase
      .from("online_eco-actions")
      .select("id, created_at, cover_photo, title, end_date, campaign_type, email_link, summary");

    const events: Event[] = event?.map((e) => ({
      type: "event",
      id: e.id,
      title: e.title,
      start_time: e.start_time ?? undefined,
      end_time: e.end_time ?? undefined,
      location: e.location ?? undefined,
      cover_photo: e.cover_photo ?? undefined,
      google_calendar_link: e.google_calendar_link ?? undefined,
      description: e.description ?? undefined,
      sign_up_link: e.sign_up_link ?? undefined,
    })) ?? [];

    const inPersonEcoItems: InPersonEcoAction[] = ecoInPerson?.map((e) => ({
      type: "inperson",
      id: e.id,
      created_at: e.created_at,
      cover_photo: e.cover_photo ?? undefined,
      title: e.title,
      location: e.location ?? undefined,
      start_date: e.start_date,
      end_date: e.end_date,
      sign_up_link: e.sign_up_link,
      summary: e.summary ?? undefined,
    })) ?? [];

    const onlineEcoItems: OnlineEcoAction[] = ecoOnline?.map((e) => ({
      type: "online",
      id: e.id,
      created_at: e.created_at,
      cover_photo: e.cover_photo ?? undefined,
      title: e.title,
      end_date: e.end_date ?? undefined,
      campaign_type: e.campaign_type ?? undefined,
      email_link: e.email_link ?? undefined,
      summary: e.summary ?? undefined,
    })) ?? [];

    setItems([...events, ...inPersonEcoItems, ...onlineEcoItems]);
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
            key={`${item.id}-${item.type}`}
            {...item}
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
