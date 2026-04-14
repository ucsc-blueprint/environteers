import { StyleSheet, TextInput, View, Text, Pressable } from 'react-native';
import MapView from 'react-native-maps';
import { Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '@/constants/supabase';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { EcoFeed } from '@/components/EcoFeed';
import { InPersonCardDataProps } from '@/components/InPersonCard';
import { EventCardDataProps } from '@/components/EventCard';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

type MapItem = InPersonCardDataProps | EventCardDataProps;

interface MapMarkerProps {
  coordinate: LatLng;
  type: string;
  onPress: () => void;
  selected: boolean;
}

const MarkerContent = ({type, selected} : {type: string; selected: boolean}) => {
  const displayType = type === "event" ? "Event" : "Eco-Action";
  return (
    <View
      style={styles.markerContainer}>
      <View style={[type === "event" ? styles.bubbleEvent : styles.bubbleEcoAction,
        selected &&  (type === "event" ? styles.bubbleEventSelect : styles.bubbleEcoActionSelect)]
      }>
        <Text style={[styles.text,
          selected && (type === "event" ? styles.textEventSelect : styles.textEcoActionSelect)]
        }>{displayType}</Text>
      </View>
      <View style={type === "event" ? styles.tailEvent : styles.tailEcoAction}/>
    </View>
  )
}
const MapMarker = ({ coordinate, type, onPress, selected }: MapMarkerProps) => {
    return (
      <Marker
        coordinate={coordinate}
        anchor={{x: 0.5, y: 1}}
        centerOffset={{x: 0, y: -23}} 
        onPress={(e) => {
          e.stopPropagation();
          onPress();
        }}
        tracksViewChanges={selected}>
        <MarkerContent type={type} selected={selected} />
      </Marker>

    )
  };
export default function Map() {
  const router = useRouter();

  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [items, setItems] = useState<MapItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['15%', '50%', '90%'], []);

  const handleMarkerPress = (id: string, type: string) => {
    bottomSheetRef.current?.snapToIndex(2);
    const index = filteredItems.findIndex(
      item => item.cardInfo.id === id && item.cardType === type
    );
    setSelectedId(`${id}-${type}`);
    if (index === -1) return;
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0
      });
      // timeout so it doesn't try to scroll before the bottom sheet expands
    }, 800);
  }

  async function geocodeAddress(address: string) {
    const res = await Location.geocodeAsync(address);

    if (!res || res.length === 0) {
      console.warn('Failed to geocode', address);
      return null;
    }

    return {
        latitude: res[0].latitude,
        longitude: res[0].longitude,
    };
  }

  // Request user location
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

    const fetchMapData = async () => {
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("*");

      if (eventError) {
        console.error("Error fetching events from supabase", eventError);
      }
  
      const { data: ecoInPerson, error: ecoInPersonError } = await supabase
        .from("inperson_ecoactions")
        .select("*");

      if (ecoInPersonError) {
        console.error("Error fetching in-person eco-actions from supabase", ecoInPersonError);
      }

      const processLocation = async (item: any, type: "event" | "in_person") => {
        let coords = null;
        if (item.location_longitude && item.location_latitude) {
          coords = {
            latitude: item.location_latitude,
            longitude: item.location_longitude,
          };
        } else {
          if (!item.location || item.location.trim() === "") {
            return null;
          }
          coords = await geocodeAddress(item.location);

          if (coords) {
            const table = type === "event" ? "events" : "inperson_ecoactions"
            const {error} = await supabase
              .from(table)
              .update({
                location_latitude: coords.latitude,
                location_longitude: coords.longitude,
              })
              .eq("id", item.id);

            if (error) {
              console.error("Error updating coordinates on supabase", error);
            }
          }
        }

        if (!coords) return null;

        return {
          id: item.id,
          latitude: coords.latitude,
          longitude: coords.longitude,
          title: item.title,
          type,
        };
      };

      const events: EventCardDataProps[] = event?.map((e) => ({
        cardType: "event",
        cardInfo: {
          id: e.id,
          title: e.title,
          start_time: e.start_time ?? undefined,
          end_time: e.end_time ?? undefined,
          location: e.location ?? undefined,
          cover_photo: e.cover_photo ?? undefined,
          google_calendar_link: e.google_calendar_link ?? undefined,
          description: e.description ?? undefined,
          sign_up_link: e.sign_up_link ?? undefined,
        },
        liked: e.liked ?? undefined,
        signed_up: e.signed_up ?? undefined,
        completed: e.completed ?? undefined,
        clicked: e.clicked ?? undefined,
      })) ?? [];


      const inPersonEcoItems: InPersonCardDataProps[] = ecoInPerson?.map((e) => ({
        cardType: "in_person",
        cardInfo: {
          id: e.id,
          created_at: e.created_at,
          cover_photo: e.cover_photo ?? undefined,
          title: e.title,
          location: e.location ?? undefined,
          start_date: e.start_date,
          end_date: e.end_date,
          sign_up_link: e.sign_up_link,
          summary: e.summary ?? undefined,
        },
        liked: e.liked ?? undefined,
        signed_up: e.signed_up ?? undefined,
        completed: e.completed ?? undefined,
        clicked: e.clicked ?? undefined,
      })) ?? [];

      const markerResults = await Promise.all([
        ...((event || []).map((e) => processLocation(e, "event"))),
        ...((ecoInPerson || []).map((e) => processLocation(e, "in_person"))),
      ])

      const markers = markerResults.filter((m) => m !== null);

      setItems([...events, ...inPersonEcoItems]);
      setMarkers(markers);
    }

    getLocation();
    fetchMapData();
  }, []);

  const filteredItems = items.filter(item =>
    item.cardInfo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ChevronLeft size={24} color="#000" />
      </Pressable>

      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={userLocation ? {
          ...userLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : undefined}
      >
      {markers.map((marker) => (
          <MapMarker
            key={`${marker.id}-${marker.type}`}
            coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
            type={marker.type}
            onPress={() => handleMarkerPress(marker.id, marker.type)}
            selected={selectedId === `${marker.id}-${marker.type}`}/>
        ))}
      </MapView>
      
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        enableContentPanningGesture={false}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: "#ccc" }}
      >
        <BottomSheetFlatList
          ref={flatListRef}
          data={filteredItems}
          style={{flex: 1}}
          keyExtractor={(item: MapItem) => `${item.cardInfo.id}-${item.cardType}`}
          onScrollToIndexFailed={(info: {index: number; averageItemLength: number}) => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          ListHeaderComponent={
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#868E8B"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          }
          renderItem={({ item }: { item: MapItem }) => (
          <View style={[
            { borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
            `${item.cardInfo.id}-${item.cardType}` === selectedId && { borderColor: item.cardType === 'event' ? '#437CA1' : '#79B128' }
          ]}>
            { item && <EcoFeed card={item} isSelected={`${item.cardInfo.id}-${item.cardType}` === selectedId} setSelectedId={setSelectedId}/> }
          </View>
          )}
          contentContainerStyle={{ paddingBottom: 100, gap: 16, padding: 16 }}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute', 
    top: 30, 
    left: 20, 
    zIndex: 10,
  },
  map: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: "#EAF2F6",
    padding: 12,
    borderRadius: 8,
  },
  markerContainer: {
    alignItems: 'center',
  },
  bubbleEvent: {
    backgroundColor: "#437CA1",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleEcoAction: {
    backgroundColor: "#79B128",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  text: {
    color: '#fff',
    fontWeight: '300',
    fontSize: 13,
  },
  tailEvent: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: "#437CA1",
  },
  tailEcoAction: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: "#79B128",
  },
  bubbleEventSelect: {
    backgroundColor: 'white',
    borderColor: '#437CA1',
  },
  bubbleEcoActionSelect: {
    backgroundColor: 'white',
    borderColor: '#79B128',
  },
  textEventSelect: {
    color: '#437CA1',
  },
  textEcoActionSelect: {
    color: '#79B128',
  },
  tailSelected: {
    borderTopColor: 'white',
  },
});
