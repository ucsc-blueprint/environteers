import { StyleSheet, TextInput, View, Text, Pressable } from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { supabase } from '@/constants/supabase';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { EcoFeed } from '@/components/EcoFeed';
import { InPersonCardDataProps } from '@/components/InPersonCard';
import { EventCardDataProps } from '@/components/EventCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { ChevronLeft, SlidersHorizontal, Locate } from 'lucide-react-native';
import { EcoFeedFilterDropdown } from '@/components/EcoFeedFilterDropdown';
import { useInteractions } from '@/context/InteractionsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MapItem = InPersonCardDataProps | EventCardDataProps;

interface MapMarkerProps {
  coordinate: LatLng;
  type: string;
  onPress: () => void;
  selected: boolean;
}

const MarkerContent = ({ type, selected }: { type: string; selected: boolean }) => {
  const displayType = type === 'event' ? 'Event' : 'Eco-Action';
  return (
    <View style={styles.markerContainer}>
      <View
        style={[
          type === 'event' ? styles.bubbleEvent : styles.bubbleEcoAction,
          selected && (type === 'event' ? styles.bubbleEventSelect : styles.bubbleEcoActionSelect),
        ]}
      >
        <Text
          style={[
            styles.text,
            selected && (type === 'event' ? styles.textEventSelect : styles.textEcoActionSelect),
          ]}
        >
          {displayType}
        </Text>
      </View>
      <View style={type === 'event' ? styles.tailEvent : styles.tailEcoAction} />
    </View>
  );
};

const MapMarker = ({ coordinate, type, onPress, selected }: MapMarkerProps) => {
  return (
    <Marker
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -23 }}
      onPress={(e) => {
        e.stopPropagation();
        onPress();
      }}
      tracksViewChanges={selected}
    >
      <MarkerContent type={type} selected={selected} />
    </Marker>
  );
};

// for filtering past events/in-person cards
const now = new Date();
const getItemEndDate = (item: any) => {
  return item.end_date ? new Date(item.end_date) : null;
};
const isPastItem = (item: any) => {
  const endDate = getItemEndDate(item);
  return endDate ? endDate < now : false;
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function Map() {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const [markers, setMarkers] = useState<any[]>([]);
  const [items, setItems] = useState<MapItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { cards: interactionCards } = useInteractions();

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['15%', '40%', '50%', '90%'], []);

  const handleMarkerPress = (id: string, type: string) => {
    bottomSheetRef.current?.snapToIndex(3);
    const index = filteredItems.findIndex(
      (item) => item.cardInfo.id === id && item.cardType === type,
    );
    setSelectedId(`${id}-${type}`);
    if (index === -1) return;
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    }, 800);
  };

  const handleCardPress = (id: string, type: string) => {
    const marker = markers.find((m) => m.id === id && m.type === type);

    setSelectedId(`${id}-${type}`);

    if (marker) {
      mapRef.current?.animateCamera({
        center: {
          latitude: marker.latitude,
          longitude: marker.longitude,
        },
      });

      bottomSheetRef.current?.snapToIndex(1);
    }
  };

  const handleRecenter = () => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion({
      ...userLocation,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const getInteractionState = useCallback(
    (id: string, type: string) => {
      const match = interactionCards.find((c) => c.cardInfo.id === id && c.cardType === type);
      return {
        liked: match?.liked ?? false,
        signed_up: match && 'signed_up' in match ? match.signed_up : null,
        completed: match?.completed ?? null,
        clicked: match?.clicked ?? false,
      };
    },
    [interactionCards],
  );

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
      const { data: event, error: eventError } = await supabase.from('events').select('*');

      if (eventError) {
        console.error('Error fetching events from supabase', eventError);
      }

      const { data: ecoInPerson, error: ecoInPersonError } = await supabase
        .from('inperson_ecoactions')
        .select('*');

      if (ecoInPersonError) {
        console.error('Error fetching in-person eco-actions from supabase', ecoInPersonError);
      }

      const processLocation = (item: any, type: 'event' | 'in_person') => {
        if (!item.location_longitude || !item.location_latitude) {
          return null;
        }

        return {
          id: item.id,
          latitude: item.location_latitude,
          longitude: item.location_longitude,
          title: item.title,
          type,
        };
      };

      const events: EventCardDataProps[] =
        event
          ?.filter((e) => !isPastItem(e) && !e.hidden)
          .map((e) => ({
            cardType: 'event',
            cardInfo: {
              id: e.id,
              title: e.title,
              start_date: e.start_date ?? undefined,
              end_date: e.end_date ?? undefined,
              location: e.location ?? undefined,
              cover_photo: e.cover_photo ?? undefined,
              google_calendar_link: e.google_calendar_link ?? undefined,
              description: e.description ?? undefined,
              sign_up_link: e.sign_up_link ?? undefined,
              hidden: e.hidden ?? false,
            },
            liked: false,
            signed_up: null,
            completed: null,
            clicked: false,
            feedback: null,
          })) ?? [];

      const inPersonEcoItems: InPersonCardDataProps[] = (ecoInPerson ?? [])
        .filter((e) => !isPastItem(e) && !e.hidden)
        .map((e) => ({
          cardType: 'in_person',
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
            google_calendar_link: e.google_calendar_link ?? undefined,
            hidden: e.hidden ?? false,
          },
          liked: false,
          signed_up: null,
          completed: null,
          clicked: false,
          feedback: null,
        }));

      const markerResults = [
        ...(event || []).filter((e) => !isPastItem(e)).map((e) => processLocation(e, 'event')),

        ...(ecoInPerson || [])
          .filter((e) => !isPastItem(e))
          .map((e) => processLocation(e, 'in_person')),
      ];

      const markers = markerResults.filter((m) => m !== null);

      setItems([...events, ...inPersonEcoItems]);
      setMarkers(markers);
    };

    getLocation();
    fetchMapData();
  }, []);

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => {
          const matchesSearch = item.cardInfo.title.toLowerCase().includes(search.toLowerCase());
          const matchesType = filterTypes.length === 0 || filterTypes.includes(item.cardType);

          const matchesDistance =
            !maxDistance || !userLocation
              ? true
              : markers.find((m) => m.id === item.cardInfo.id && m.type === item.cardType)
                ? getDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    markers.find((m) => m.id === item.cardInfo.id && m.type === item.cardType)!
                      .latitude,
                    markers.find((m) => m.id === item.cardInfo.id && m.type === item.cardType)!
                      .longitude,
                  ) <= maxDistance
                : true;

          return matchesSearch && matchesType && matchesDistance;
        })
        .map((item) => ({
          ...item,
          ...getInteractionState(item.cardInfo.id, item.cardType),
        })),
    [items, search, filterTypes, maxDistance, userLocation, markers, getInteractionState],
  );

  const filteredMarkers = useMemo(
    () =>
      markers.filter((marker) => {
        const matchesType = filterTypes.length === 0 || filterTypes.includes(marker.type);

        const matchesDistance =
          !maxDistance || !userLocation
            ? true
            : getDistance(
                userLocation.latitude,
                userLocation.longitude,
                marker.latitude,
                marker.longitude,
              ) <= maxDistance;

        return matchesType && matchesDistance;
      }),
    [markers, filterTypes, maxDistance, userLocation],
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Pressable
        onPress={() => router.replace('/(tabs)/volunteer')}
        style={[styles.backButton, { top: insets.top + 10 }]}
      >
        <ChevronLeft size={24} color='#000' />
      </Pressable>

      <Pressable
        onPress={handleRecenter}
        style={[styles.recenterButton, { top: insets.top + 10 }]}
      >
        <Locate size={22} color='#0282D3' />
      </Pressable>

      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={
          userLocation
            ? {
                ...userLocation,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
      >
        {filteredMarkers.map((marker) => (
          <MapMarker
            key={`${marker.id}-${marker.type}`}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            type={marker.type}
            onPress={() => handleMarkerPress(marker.id, marker.type)}
            selected={selectedId === `${marker.id}-${marker.type}`}
          />
        ))}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        enableContentPanningGesture={false}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'white' }}
        handleIndicatorStyle={{ backgroundColor: '#ccc' }}
      >
        <BottomSheetFlatList
          ref={flatListRef}
          data={filteredItems}
          style={{ flex: 1 }}
          keyExtractor={(item: MapItem) => `${item.cardInfo.id}-${item.cardType}`}
          onScrollToIndexFailed={(info: { index: number; averageItemLength: number }) => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          ListHeaderComponent={
            <View>
              <View style={styles.searchRow}>
                <TextInput
                  placeholder='Search...'
                  placeholderTextColor='#868E8B'
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                />

                <Pressable
                  onPress={() => setShowFilters((prev) => !prev)}
                  style={styles.filterButton}
                >
                  <SlidersHorizontal size={18} color='black' />
                </Pressable>
              </View>

              {showFilters && (
                <View style={{ marginTop: 16 }}>
                  <EcoFeedFilterDropdown
                    typeOptions={[
                      { label: 'Eco Actions', value: 'in_person' },
                      { label: 'Events', value: 'event' },
                    ]}
                    selectedTypes={filterTypes}
                    selectedDistance={maxDistance}
                    onApply={(types, distance) => {
                      setFilterTypes(types);
                      setMaxDistance(distance);
                      setShowFilters(false);
                    }}
                  />
                </View>
              )}
            </View>
          }
          renderItem={({ item }: { item: MapItem }) => (
            <View
              style={[
                {
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: 'transparent',
                },
                `${item.cardInfo.id}-${item.cardType}` === selectedId && {
                  borderColor: item.cardType === 'event' ? '#437CA1' : '#79B128',
                  borderRadius: 26,
                },
              ]}
            >
              {item && (
                <EcoFeed
                  card={item}
                  isSelected={`${item.cardInfo.id}-${item.cardType}` === selectedId}
                  setSelectedId={setSelectedId}
                  onPress={() => handleCardPress(item.cardInfo.id, item.cardType)}
                />
              )}
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
    left: 20,
    zIndex: 5,
  },
  recenterButton: {
    position: 'absolute',
    right: 20,
    zIndex: 5,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2F6',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
  },
  filterButton: {
    width: 35,
    height: 28,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  markerContainer: {
    alignItems: 'center',
  },
  bubbleEvent: {
    backgroundColor: '#437CA1',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleEcoAction: {
    backgroundColor: '#79B128',
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
    borderTopColor: '#437CA1',
  },
  tailEcoAction: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#79B128',
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
