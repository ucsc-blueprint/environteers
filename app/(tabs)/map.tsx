import { StyleSheet, TextInput, View, Text, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '@/constants/supabase';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { EcoFeed, InPersonEcoAction, Event } from '@/components/EcoFeed';
import { GestureHandlerRootView } from "react-native-gesture-handler";

type MapItem = InPersonEcoAction | Event;

interface MapMarkerProps {
  coordinate: LatLng;
  title: string;
  type: string;
}

const MapMarker = ({ coordinate, title, type }: MapMarkerProps) => {
  const displayType = type === "event" ? "Event" : "Eco-Action";
    return (
      <Marker coordinate={coordinate} anchor={{x: 0.5, y: 1}}>
        <View
          style={styles.markerContainer}>
          <View style={type === "event" ? styles.bubbleEvent : styles.bubbleEcoAction}>
            <Text style={styles.text}>{displayType}</Text>
          </View>
          <View style={type === "event" ? styles.tailEvent : styles.tailEcoAction} />
        </View>
      </Marker>

    )
  };
export default function Map() {
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [items, setItems] = useState<MapItem[]>([]);
  const [search, setSearch] = useState("");

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['12%', '50%', '90%'], []);

  

  async function geocodeAddress(address: string) {
    const res = await Location.geocodeAsync(address);

    if (!res || res.length === 0) {
      console.error('Failed to geocode', res);
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
      
      const processLocation = async (item: any, type: "event" | "inperson") => {
        let coords = null;
        if (item.location_longitude && item.location_latitude) {
          coords = {
            latitude: item.location_latitude,
            longitude: item.location_longitude,
          };
        } else {
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

      const markerResults = await Promise.all([
        ...((event || []).map((e) => processLocation(e, "event"))),
        ...((ecoInPerson || []).map((e) => processLocation(e, "inperson"))),
      ])

      const markers = markerResults.filter((m) => m !== null);

      setItems([...events, ...inPersonEcoItems]);
      setMarkers(markers);
    }

    getLocation();
    fetchMapData();
  }, []);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <GestureHandlerRootView style={styles.container}>
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
            title={marker.title}
            type={marker.type}/>
        ))}
      </MapView>
      
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: "#ccc" }}
      >
        <BottomSheetFlatList
          data={filteredItems}
          keyExtractor={(item: MapItem) => `${item.id}-${item.type}`}
          ListHeaderComponent={
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#868E8B"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          }
          renderItem={({ item }: { item: MapItem }) => <EcoFeed {...item} />}
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleEcoAction: {
    backgroundColor: "#79B128",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  }
});
