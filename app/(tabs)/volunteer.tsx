import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
  Text,
  Modal,
  RefreshControl,
} from 'react-native';
import { Header, EcoFeed } from '@/components/EcoFeed';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/constants/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '@/context/AuthContext';
import { useInteractions } from '@/context/InteractionsContext';
import { InPersonCardDataProps } from '@/components/InPersonCard';
import { OnlineCardDataProps } from '@/components/OnlineCard';
import { EventCardDataProps } from '@/components/EventCard';
import { DeleteToast } from '@/components/DeleteToast';
import { router, useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { getVisibleEcoActions } from '@/utils/cards';
import { SafeAreaView } from 'react-native-safe-area-context';

export type CardProps = InPersonCardDataProps | OnlineCardDataProps | EventCardDataProps;

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

const TABLE_MAP: Record<string, string> = {
  in_person: 'inperson_ecoactions',
  online: 'online_ecoactions',
  event: 'events',
};

export default function Volunteer() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );

  const [search, setSearch] = useState('');
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [toast, setToast] = useState<{ message: string; description: string } | null>(null);
  const [tab, setTab] = useState<'active' | 'hidden'>('active');

  const [refreshing, setRefreshing] = useState(false);

  const { cards: interactionCards } = useInteractions();

  const goToAddForm = (type: 'event' | 'in-person' | 'online') => {
    setShowAddMenu(false);
    router.push({
      pathname: '/(tabs)/AddEcoAction',
      params: { typeOfAction: type },
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

  const isAdmin = profile?.is_admin === true;

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    const [inPersonRes, onlineRes, eventRes, inPersonSignups, onlineCompletions, eventSignups] =
      await Promise.all([
        supabase
          .from('inperson_ecoactions')
          .select(`*, location_latitude, location_longitude`)
          .order('start_date')
          .order('created_at'),

        supabase.from('online_ecoactions').select(`*`).order('end_date').order('created_at'),

        supabase
          .from('events')
          .select(`*, location_latitude, location_longitude`)
          .order('start_date')
          .order('created_at'),

        isAdmin
          ? supabase.from('interactions_eco_inperson').select('action_id').eq('signed_up', true)
          : Promise.resolve({ data: [] }),

        isAdmin
          ? supabase.from('interactions_eco_online').select('action_id').eq('completed', true)
          : Promise.resolve({ data: [] }),

        isAdmin
          ? supabase.from('interactions_events').select('action_id').eq('signed_up', true)
          : Promise.resolve({ data: [] }),
      ]);

    if (inPersonRes.error) console.error(inPersonRes.error);
    if (onlineRes.error) console.error(onlineRes.error);
    if (eventRes.error) console.error(eventRes.error);

    const inPersonSignupMap: Record<string, number> = {};
    for (const row of inPersonSignups.data ?? []) {
      inPersonSignupMap[row.action_id] = (inPersonSignupMap[row.action_id] ?? 0) + 1;
    }
    const onlineCompletionMap: Record<string, number> = {};
    for (const row of onlineCompletions.data ?? []) {
      onlineCompletionMap[row.action_id] = (onlineCompletionMap[row.action_id] ?? 0) + 1;
    }
    const eventSignupMap: Record<string, number> = {};
    for (const row of eventSignups.data ?? []) {
      eventSignupMap[row.action_id] = (eventSignupMap[row.action_id] ?? 0) + 1;
    }

    const inPersonData = inPersonRes.data ?? [];
    const onlineData = onlineRes.data ?? [];
    const eventData = eventRes.data ?? [];

    const inPersonCardData: CardProps[] = (inPersonData ?? []).map((card) => ({
      cardType: 'in_person',
      cardInfo: card,
      liked: false,
      signed_up: null,
      completed: null,
      clicked: false,
      feedback: false,
      statCount: inPersonSignupMap[card.id] ?? 0,
    }));

    const onlineCardData: CardProps[] = (onlineData ?? []).map((card) => ({
      cardType: 'online',
      cardInfo: card,
      liked: false,
      signed_up: null,
      completed: null,
      clicked: false,
      feedback: false,
      statCount: onlineCompletionMap[card.id] ?? 0,
    }));

    const eventCardData: CardProps[] = (eventData ?? []).map((event) => ({
      cardType: 'event',
      cardInfo: event,
      liked: false,
      signed_up: null,
      completed: null,
      clicked: false,
      feedback: false,
      statCount: eventSignupMap[event.id] ?? 0,
    }));

    const fullData = [...inPersonCardData, ...onlineCardData, ...eventCardData];
    setItems(fullData);
  }, [user?.id, isAdmin]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      fetchData().finally(() => setLoading(false));
    }, [fetchData]),
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

    getLocation();
  }, []);

  const visibleItems = useMemo(() => {
    return getVisibleEcoActions(items);
  }, [items]);

  const filteredItems = useMemo(() => {
    return visibleItems
      .filter((item) => {
        const matchesTab =
          tab === 'hidden' ? item.cardInfo.hidden === true : item.cardInfo.hidden === false;

        const matchesSearch =
          item.cardInfo.title?.toLowerCase().includes(search.toLowerCase()) ?? true;

        const matchesType = filterTypes.length === 0 || filterTypes.includes(item.cardType);

        const matchesDistance = (() => {
          if (!maxDistance || !userLocation || item.cardType === 'online') return true;
          const lat = (item.cardInfo as any).location_latitude;
          const lon = (item.cardInfo as any).location_longitude;
          if (!lat || !lon) return true;
          return (
            getDistance(userLocation.latitude, userLocation.longitude, lat, lon) <= maxDistance
          );
        })();

        const now = new Date().getTime();
        const matchesDate = (() => {
          const end = item.cardInfo.end_date ? new Date(item.cardInfo.end_date).getTime() : null;

          return end ? end >= now : true;
        })();

        return matchesTab && matchesSearch && matchesType && matchesDistance && matchesDate;
      })
      .map((item) => ({
        ...item,
        ...getInteractionState(item.cardInfo.id, item.cardType),
      }));
  }, [tab, visibleItems, search, filterTypes, maxDistance, userLocation, getInteractionState]);

  const handleFullDelete = useCallback(async (id: string, cardType: string) => {
    const table = TABLE_MAP[cardType];
    if (!table) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error(error);
      return;
    }
    setItems((prev) =>
      prev.filter((item) => !(item.cardInfo.id === id && item.cardType === cardType)),
    );
    setToast({
      message: 'Eco-action deleted',
      description: 'Users can no longer access this event',
    });
  }, []);

  const handleHide = useCallback(
    async (id: string, cardType: string) => {
      const table = TABLE_MAP[cardType];
      if (!table) return;
      const item = items.find((item) => item.cardInfo.id === id && item.cardType === cardType);
      if (!item) return;

      const newHidden = !item.cardInfo.hidden;
      const { error } = await supabase.from(table).update({ hidden: newHidden }).eq('id', id);
      if (error) {
        console.error(error);
        return;
      }

      // update hidden flag
      setItems((prev) =>
        prev.map((item) =>
          item.cardInfo.id === id && item.cardType === cardType
            ? ({ ...item, cardInfo: { ...item.cardInfo, hidden: newHidden } } as CardProps)
            : item,
        ),
      );
      const unHideMessage = 'Event unhidden';
      const unHideDesc = 'Non-registered users can now see this event on their feed.';
      const hideMessage = 'Event hidden';
      const hideDesc = 'Non-registered users can no longer see this event on their feed.';
      setToast({
        message: newHidden === true ? hideMessage : unHideMessage,
        description: newHidden === true ? hideDesc : unHideDesc,
      });
    },
    [items],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      {isAdmin ? (
        <View style={styles.adminContainer}>
          <View style={styles.adminHeaderContainer}>
            <Text style={styles.adminHeaderTitle}>Manage events + eco actions</Text>
            <Text style={styles.adminHeaderSubtitle}>Add, edit, and delete</Text>
          </View>
          <View style={styles.adminContentContainer}>
            {toast && (
              <DeleteToast
                visible={!!toast}
                message={toast.message}
                description={toast.description}
                onClose={() => setToast(null)}
              />
            )}
            <ScrollView
              contentContainerStyle={{ padding: 16, gap: 16 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              <Header
                resultsCount={filteredItems.length}
                search={search}
                setSearch={setSearch}
                filterTypes={filterTypes}
                setFilterTypes={setFilterTypes}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                hideTitle
              />

              <View style={styles.tabContainer}>
                <Pressable
                  onPress={() => setTab('active')}
                  style={[styles.tab, tab === 'active' && styles.tabActive]}
                >
                  <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>
                    Active
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setTab('hidden')}
                  style={[styles.tab, tab === 'hidden' && styles.tabActive]}
                >
                  <Text style={[styles.tabText, tab === 'hidden' && styles.tabTextActive]}>
                    Hidden
                  </Text>
                </Pressable>
              </View>

              {loading && <ActivityIndicator size='large' color='#0000ff' />}
              {!loading &&
                filteredItems.map((card) => (
                  <EcoFeed
                    key={`${card.cardType}-${card.cardInfo.id}`}
                    card={card}
                    onDelete={() => handleFullDelete(card.cardInfo.id, card.cardType)}
                    onHide={() => handleHide(card.cardInfo.id, card.cardType)}
                  />
                ))}
            </ScrollView>
            <Pressable style={styles.addButton} onPress={() => setShowAddMenu(true)}>
              <Feather name='plus' size={36} color='white' />
            </Pressable>

            <Modal
              visible={showAddMenu}
              transparent
              animationType='fade'
              onRequestClose={() => setShowAddMenu(false)}
            >
              <Pressable style={styles.backdrop} onPress={() => setShowAddMenu(false)}>
                <Pressable style={styles.popup} onPress={() => {}}>
                  <Text style={styles.popupTitle}>Add something new</Text>
                  <Pressable style={styles.popupButton} onPress={() => goToAddForm('event')}>
                    <Text>Add Event</Text>
                  </Pressable>
                  <Pressable style={styles.popupButton} onPress={() => goToAddForm('in-person')}>
                    <Text>Add In-Person Eco-Action</Text>
                  </Pressable>
                  <Pressable style={styles.popupButton} onPress={() => goToAddForm('online')}>
                    <Text>Add Online Eco-Action</Text>
                  </Pressable>
                </Pressable>
              </Pressable>
            </Modal>
          </View>
        </View>
      ) : (
        <LinearGradient
          colors={['white', '#EDF3F7', '#EAF2F6']}
          locations={[0.8, 0.9, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.5 }}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={{ padding: 16, gap: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <Header
              resultsCount={filteredItems.length}
              search={search}
              setSearch={setSearch}
              filterTypes={filterTypes}
              setFilterTypes={setFilterTypes}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
            />

            {loading && <ActivityIndicator size='large' color='#0000ff' />}
            {!loading &&
              filteredItems.map((card) => (
                <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
              ))}
          </ScrollView>
          <View style={styles.mapBackground}>
            <Pressable onPress={() => router.push('/(tabs)/map')}>
              <MaterialCommunityIcons name='map' size={30} color='white' />
            </Pressable>
          </View>
        </LinearGradient>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  adminContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  adminHeaderContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  adminHeaderTitle: {
    fontFamily: 'Mulish',
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  adminHeaderSubtitle: {
    fontFamily: 'Mulish',
    fontSize: 18,
    color: '#79B128',
    marginTop: 4,
  },
  adminContentContainer: {
    flex: 1,
    backgroundColor: '#EAF2F6',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  mapBackground: {
    backgroundColor: '#437CA1',
    borderRadius: 50,
    padding: 15,
    maxWidth: 80,
    position: 'absolute',
    bottom: 10,
    right: 20,
    shadowColor: 'rgba(2, 130, 211, 0.20)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#57811D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#79B128',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },

  popupTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  popupButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
  },

  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    gap: 16,
    alignSelf: 'flex-start',
  },

  tab: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 16,
    borderColor: '#57811D',
    borderWidth: 1,
    backgroundColor: 'white',
  },

  tabActive: {
    backgroundColor: '#57811D',
  },

  tabText: {
    color: '#57811D',
    fontWeight: '400',
    fontSize: 16,
  },

  tabTextActive: {
    color: '#F2F7F5',
    fontWeight: '400',
    fontSize: 16,
  },
});
