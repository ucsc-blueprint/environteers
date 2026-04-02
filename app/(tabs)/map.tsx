import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { supabase } from '@/constants/supabase';

export default function Map() {
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);

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
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
