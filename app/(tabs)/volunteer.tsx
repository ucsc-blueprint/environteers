import { ScrollView, StyleSheet, View, Pressable, ActivityIndicator } from "react-native";
import { Header, EcoFeed } from "@/components/EcoFeed";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/constants/supabase";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useAuth } from "@/context/AuthContext";
import { InPersonCardDataProps } from "@/components/InPersonCard";
import { OnlineCardDataProps } from "@/components/OnlineCard";
import { EventCardDataProps } from "@/components/EventCard";
import { router } from "expo-router";

import { useRefresh } from "@/context/RefreshContext";

export type CardProps = InPersonCardDataProps | OnlineCardDataProps | EventCardDataProps;

export default function Volunteer() {
  const { user } = useAuth();
  const [items, setItems] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);

  const { refreshKey } = useRefresh();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!user?.id) {
        setLoading(false);
        return;
      };

      const [inPersonRes, onlineRes, eventRes] = await Promise.all([
        supabase
          .from("inperson_ecoactions")
          .select(`*, interactions_eco_inperson!left(*)`)
          .eq("interactions_eco_inperson.user_id", user.id),

        supabase
          .from("online_ecoactions")
          .select(`*, interactions_eco_online!left(*)`)
          .eq("interactions_eco_online.user_id", user.id),

        supabase
          .from("events")
          .select(`*, interactions_events!left(*)`)
          .eq("interactions_events.user_id", user.id)
      ]);

      if (inPersonRes.error) console.error(inPersonRes.error);
      if (onlineRes.error) console.error(onlineRes.error);
      if (eventRes.error) console.error(eventRes.error);

      const inPersonData = inPersonRes.data ?? [];
      const onlineData = onlineRes.data ?? [];
      const eventData = eventRes.data ?? [];
    
      const inPersonCardData: CardProps[] = (inPersonData ?? []).map(card => {
        const interaction = card.interactions_eco_inperson?.[0];

        return {
          cardType: "in_person",
          cardInfo: card,
          liked: interaction?.liked ?? false,
          signed_up: interaction?.signed_up ?? false,
          completed: interaction?.completed ?? false,
          clicked: interaction?.clicked ?? false,
        };
      }); 
    
      const onlineCardData: CardProps[] = (onlineData ?? []).map(card => {
        const interaction = card.interactions_eco_online?.[0];

        return {
          cardType: "online",
          cardInfo: card,
          liked: interaction?.liked ?? false,
          signed_up: interaction?.signed_up ?? false,
          completed: interaction?.completed ?? false,
          clicked: interaction?.clicked ?? false,
        };
      }); 
    
      const eventCardData: CardProps[] = (eventData ?? []).map(event => {
        const interaction = event.interactions_events?.[0];

        return {
          cardType: "event",
          cardInfo: event,
          liked: interaction?.liked ?? false,
          signed_up: interaction?.signed_up ?? false,
          completed: interaction?.completed ?? false,
          clicked: interaction?.clicked ?? false,
        };
      });

      const fullData = [...inPersonCardData, ...onlineCardData, ...eventCardData]
      setItems(fullData);
      setLoading(false);
    };
    fetchData();
  }, [user?.id, refreshKey]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.cardInfo.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ?? true;

      const matchesType =
        filterTypes.length === 0 || filterTypes.includes(item.cardType);

      return matchesSearch && matchesType;
    });
  }, [items, search, filterTypes]);

  return (
    <LinearGradient
        colors={['white','#EDF3F7', '#EAF2F6']}
        locations={[0.8, 0.9, 1]}
        start={{ x: 0, y: 0}}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradient}
      >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
        
        <Header 
          resultsCount={items.length}
          search={search}
          setSearch={setSearch}
          filterTypes={filterTypes}
          setFilterTypes={setFilterTypes}
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
        />
        
        
        { loading && <ActivityIndicator size="large" color="#0000ff" />}
        { !loading && filteredItems.map((card) => ( 
          <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}
      </ScrollView>
        <View style={styles.mapBackground}>
          <Pressable onPress={() => router.push('/(tabs)/map')}>
            <MaterialCommunityIcons name="map" size={30} color={'#0282D3'} />
          </Pressable>
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
