import { ScrollView, StyleSheet, View, Pressable, ActivityIndicator, Text, Modal } from "react-native";
import { Header, EcoFeed } from "@/components/EcoFeed";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/constants/supabase";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useAuth } from "@/context/AuthContext";
import { useInteractions } from "@/context/InteractionsContext";
import { InPersonCardDataProps } from "@/components/InPersonCard";
import { OnlineCardDataProps } from "@/components/OnlineCard";
import { EventCardDataProps } from "@/components/EventCard";
import { router } from "expo-router";
import * as Location from 'expo-location';
import { getVisibleEcoActions } from "@/app/utils/cards";

export type CardProps = InPersonCardDataProps | OnlineCardDataProps | EventCardDataProps;

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};


export default function Volunteer() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  const [search, setSearch] = useState("");
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const { cards: interactionCards } = useInteractions();

  const goToAddForm = (type: "event" | "in-person" | "online") =>
  {
    setShowAddMenu(false);    
    router.push({
      pathname: "/(tabs)/AddEcoAction",
      params: { typeOfAction: type },
    });
  };

  const getInteractionState = useCallback((id: string, type: string) => {
    const match = interactionCards.find(
      c => c.cardInfo.id === id && c.cardType === type
    );
    return {
      liked: match?.liked ?? false,
      signed_up: match && 'signed_up' in match ? match.signed_up : null,
      completed: match?.completed ?? null,
      clicked: match?.clicked ?? false,
    };
  }, [interactionCards]);

  const isAdmin = profile?.is_admin === true;

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    const fetchData = async () => {
      setLoading(true);

      if (!user?.id) {
        setLoading(false);
        return;
      };

      const [inPersonRes, onlineRes, eventRes] = await Promise.all([
        supabase
          .from("inperson_ecoactions")
          .select(`*, location_latitude, location_longitude`),

        supabase
          .from("online_ecoactions")
          .select(`*`),

        supabase
          .from("events")
          .select(`*, location_latitude, location_longitude`)
      ]);

      if (inPersonRes.error) console.error(inPersonRes.error);
      if (onlineRes.error) console.error(onlineRes.error);
      if (eventRes.error) console.error(eventRes.error);

      const inPersonData = inPersonRes.data ?? [];
      const onlineData = onlineRes.data ?? [];
      const eventData = eventRes.data ?? [];
    
      const inPersonCardData: CardProps[] = (inPersonData ?? []).map(card => ({
        cardType: "in_person",
        cardInfo: card,
        liked: false,
        signed_up: null,
        completed: null,
        clicked: false,
      }));

      const onlineCardData: CardProps[] = (onlineData ?? []).map(card => ({
        cardType: "online",
        cardInfo: card,
        liked: false,
        signed_up: null,
        completed: null,
        clicked: false,
      })); 
    
      const eventCardData: CardProps[] = (eventData ?? []).map(event => ({
        cardType: "event",
        cardInfo: event,
        liked: false,
        signed_up: null,
        completed: null,
        clicked: false,
      }));

      const fullData = [...inPersonCardData, ...onlineCardData, ...eventCardData]
      setItems(fullData);
      setLoading(false);
    };

    getLocation();
    fetchData();
  }, [user?.id]);

  const visibleItems = useMemo(() => {
    return getVisibleEcoActions(items);
  }, [items]);

  const filteredItems = useMemo(() => {
    return visibleItems
      .filter((item) => {
        const matchesSearch =
          item.cardInfo.title
            ?.toLowerCase()
            .includes(search.toLowerCase()) ?? true;

        const matchesType =
          filterTypes.length === 0 || filterTypes.includes(item.cardType);

        const matchesDistance = (() => {
          if (!maxDistance || !userLocation || item.cardType === "online") return true;
          const lat = (item.cardInfo as any).location_latitude;
          const lon = (item.cardInfo as any).location_longitude;
          if (!lat || !lon) return true;
          return getDistance(userLocation.latitude, userLocation.longitude, lat, lon) <= maxDistance;
        })();
        
        const now = new Date().getTime();
        const matchesDate = (() => {
          const end = item.cardInfo.end_date
            ? new Date(item.cardInfo.end_date).getTime()
            : null;

          return end ? end >= now : true;
        })();

        return matchesSearch && matchesType && matchesDistance && matchesDate;
      })
      .map(item => ({
        ...item,
        ...getInteractionState(item.cardInfo.id, item.cardType)
      }));
  }, [visibleItems, search, filterTypes, maxDistance, userLocation, getInteractionState]);

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
          resultsCount={filteredItems.length}
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

   addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});