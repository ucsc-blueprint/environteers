import { ScrollView, StyleSheet, View, Pressable, ActivityIndicator } from "react-native";
import { Header, EcoFeed } from "@/components/EcoFeed";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { InPersonCardProps } from "@/components/InPersonCard";
import { OnlineCardDataProps } from "@/components/OnlineCard";
import { EventCardDataProps } from "@/components/EventCard";
import { router } from "expo-router";

import { useInteractions } from "@/context/InteractionsContext";

export type CardProps = InPersonCardProps | OnlineCardDataProps | EventCardDataProps;

export default function Volunteer() {
  const { cards, loading } = useInteractions();

  return (
    <LinearGradient
        colors={['white','#EDF3F7', '#EAF2F6']}
        locations={[0.8, 0.9, 1]}
        start={{ x: 0, y: 0}}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradient}
      >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
        
        <Header resultsCount={cards.length}/> 
        
        { loading && <ActivityIndicator size="large" color="#0000ff" />}
        { !loading && cards.map((card) => ( 
          <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}
      </ScrollView>
        <View style={styles.mapBackground}>
          <Pressable onPress={() => router.push('/(tabs)/map')}>
            <MaterialCommunityIcons name="map" size={30} color={'#0282D3'} />
          </Pressable>
        </View>
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
  }
});
