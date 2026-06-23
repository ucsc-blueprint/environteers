import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type LocationInputProps = {
  value: string;
  onSelectLocation: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
};

export const LocationInput = ({
  value,
  onSelectLocation,
  placeholder = 'Enter location',
}: LocationInputProps) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (value && ref.current) {
      ref.current.setAddressText(value);
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder={placeholder}
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details) {
            onSelectLocation(
              data.description,
              details.geometry.location.lat,
              details.geometry.location.lng,
            );
          }
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
        listViewDisplayed='auto'
        keyboardShouldPersistTaps='always'
        styles={{
          container: { flex: 0 },
          textInput: styles.input,
          listView: styles.listView,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#D9E0DE',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#172A36',
  },
  listView: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 4,
  },
});
