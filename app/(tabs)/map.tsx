import { StyleSheet, TextInput } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '@/constants/supabase';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { EcoFeed } from '@/components/EcoFeed';
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

type MapItem = InPersonEcoAction | Event;

export default function Map() {
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [items, setItems] = useState<MapItem[]>([]);
  const [search, setSearch] = useState("");

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['12%', '50%', '90%'], []);

  async function geocodeAddress(address: string) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );

    if (!res.ok) {
      console.error('Failed to geocode', res.status);
      return null;
    }

    const data = await res.json();

    if (data.length > 0) {
      console.log(data)
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }

    return null;
  }

  // get eco action locations
  useEffect(() => {
    const fetchEcoActionLocations = async () => {
      const { data, error } = await supabase
        .from('inperson_ecoactions')
        .select('*');
      if (error) {
        console.error(error);
        return;
      }

      const markers: any[] = [];

      // check if coords are stored in supabase
      // if not, reverse geocode the address from supabase and store it
      for (const item of data) {
        let coords : {latitude: number, longitude: number} | null = null;
        if (item.location_latitude && item.location_longitude) {
          coords = {latitude: item.location_latitude, longitude: item.location_longitude};
        } else {
          coords = await geocodeAddress(item.location);
          if (coords) {
            const { error: updateError } = await supabase
              .from('inperson_ecoactions')
              .update({ location_latitude: coords.latitude, location_longitude: coords.longitude })
              .eq('id', item.id);

            if (updateError) console.error('Error updating supabase coordinates:', updateError);
          }

          // this is just to help with the openstreetmap limit
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        
        if (coords && !isNaN(coords.latitude) && !isNaN(coords.longitude)) {
          markers.push({
            id: item.id,
            latitude: coords.latitude,
            longitude: coords.longitude,
            title: item.title,
            description: item.summary,
          });
        }
      }

      setMarkers(markers);
    };

    fetchEcoActionLocations();
  }, []);

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
      const { data: event } = await supabase
        .from("events")
        .select("id, title, start_time, end_time, location, cover_photo, google_calendar_link, description, sign_up_link");
  
      const { data: ecoInPerson } = await supabase
        .from("inperson_eco-actions")
        .select("id, created_at, cover_photo, title, end_date, sign_up_link, summary, start_date, location");

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

      setItems([...events, ...inPersonEcoItems]);
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
          <Marker
            key={marker.id}
            title={marker.title}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          />
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
  }
});
