import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function Map() {
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);

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
      />
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
