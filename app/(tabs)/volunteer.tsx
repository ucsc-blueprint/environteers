import { ScrollView, StyleSheet, View, Pressable, ActivityIndicator, Text, Modal} from "react-native";
import { Header, EcoFeed } from "@/components/EcoFeed";
import { useEffect, useState } from "react";
import { supabase } from "@/constants/supabase";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useAuth } from "@/context/AuthContext";
import { InPersonCardProps } from "@/components/InPersonCard";
import { OnlineCardDataProps } from "@/components/OnlineCard";
import { EventCardDataProps } from "@/components/EventCard";
import { router } from "expo-router";
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useRefresh } from "@/context/RefreshContext";

export type CardProps = InPersonCardProps | OnlineCardDataProps | EventCardDataProps;

export default function Volunteer() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const isAdmin = profile?.is_admin === true;

  const { refreshKey } = useRefresh();
  const goToAddForm = (type: "event" | "in-person" | "online") => 
  {
    setShowAddMenu(false);    
    router.push({
      pathname: "/(tabs)/AddEcoAction",
      params: { typeOfAction: type },
    });
  };


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

  return (
    <LinearGradient
        colors={['white','#EDF3F7', '#EAF2F6']}
        locations={[0.8, 0.9, 1]}
        start={{ x: 0, y: 0}}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradient}
      >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
        
        <Header resultsCount={items.length} onOpenAddMenu={() => setShowAddMenu(true)}/> 
        
        
        { loading && <ActivityIndicator size="large" color="#0000ff" />}
        { !loading && items.map((card) => ( 
          <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}
      </ScrollView>
      {isAdmin ? (
        <>
          <Pressable
            style={styles.addButton}
            onPress={() => setShowAddMenu(true)}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </Pressable>

          <Modal visible={showAddMenu} transparent animationType="fade" onRequestClose={() => setShowAddMenu(false)}>
            <Pressable style={styles.backdrop} onPress={() => setShowAddMenu(false)}>
              <Pressable style={styles.popup} onPress={() => { }}>
                <Text style={styles.popupTitle}>Add something new</Text>
                <Pressable style={styles.popupButton} onPress={() => goToAddForm("event")}>
                  <Text>Add Event</Text>
                </Pressable>
                <Pressable style={styles.popupButton} onPress={() => goToAddForm("in-person")}>
                  <Text>Add In-Person Eco-Action</Text>
                </Pressable>
                <Pressable style={styles.popupButton} onPress={() => goToAddForm("online")}>
                  <Text>Add Online Eco-Action</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
        </>
      ) : (
        <View style={styles.mapBackground}>
          <Pressable onPress={() => router.push('/(tabs)/map')}>
            <MaterialCommunityIcons name="map" size={30} color={'#0282D3'} />
          </Pressable>
        </View>
      )}
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
  },

  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  addButton: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    zIndex: 10,
    backgroundColor: '#94C153',
    height: 45,
    width: 80,
  },
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  popup: {
    width: '100%', backgroundColor: 'white',
    borderRadius: 16, padding: 16, gap: 12,
  },

  popupTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  popupButton: {
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 12, backgroundColor: '#F2F2F2',
  },

});

