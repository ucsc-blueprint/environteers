import { ScrollView, StyleSheet, View } from "react-native";
import { EcoFeed, Header } from "@/components/EcoFeed";
// import { EcoHeader } from "@/components/EcoHeader";
import { useEffect, useState } from "react";
import { supabase } from "@/constants/supabase";
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useAuth } from "@/context/AuthContext";
import { InPersonCardData, InPersonCard } from "@/components/InPersonCard";
import { OnlineCardData, OnlineCard } from "@/components/OnlineCard";
import { EventCardData, EventCard } from "@/components/EventCard";

type InPersonCardProps = {
  cardType: "in_person";
  cardInfo: InPersonCardData;
  liked: boolean;
  signed_up: boolean;
  completed: boolean;
  clicked: boolean;
}

type OnlineCardProps = {
  cardType: "online";
  cardInfo: OnlineCardData;
  liked: boolean;
  signed_up: boolean;
  completed: boolean;
  clicked: boolean;
}

type EventCardProps = {
  cardType: "event";
  cardInfo: EventCardData;
  liked: boolean;
  signed_up: boolean;
  completed: boolean;
  clicked: boolean;
}

type CardProps = InPersonCardProps | OnlineCardProps | EventCardProps;

function CardRenderer({card}: { card: CardProps }) {
  switch (card.cardType) {
    case "in_person":
      return (
        <InPersonCard 
          {...card} 
          liked={card.liked} 
          signed_up={card.signed_up} 
          completed={card.completed} 
          clicked={card.clicked}
        />
      );
    case "online":
      return (
        <OnlineCard 
          {...card} 
          liked={card.liked} 
          signed_up={card.signed_up} 
          completed={card.completed} 
          clicked={card.clicked}
        />
      );
    case "event":
      return (
        <EventCard 
          {...card} 
          liked={card.liked} 
          signed_up={card.signed_up} 
          completed={card.completed} 
          clicked={card.clicked}
        />
      );
    default:
      return null;
  }
}

export default function Volunteer() {
  const { user } = useAuth();
  const [items, setItems] = useState<CardProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      const { data: inPersonData, error: inPersonDataError} = await supabase
        .from("inperson_ecoactions")
        .select(`
          *,
          interactions_eco_inperson!left(*)
        `)
        .eq("interactions_eco_inperson.user_id", user.id);
      
        const { data: onlineData, error: onlineDataError } = await supabase
        .from("online_ecoactions")
        .select(`
          *,
          interactions_eco_online!left(*)
        `)
        .eq("interactions_eco_online.user_id", user.id);


      const { data: eventData, error: eventDataError } = await supabase
        .from("events")
        .select(`
          *,
          interactions_events!left(*)
        `)
        .eq("interactions_events.user_id", user.id);

    if (inPersonDataError) console.error(inPersonDataError);
    if (onlineDataError) console.error(onlineDataError);
    if (eventDataError) console.error(eventDataError);
    
      // Values: "event", "in_person", "online"
      const inPersonCardData: CardProps[] = (inPersonData ?? []).map(card => {
        const interaction = card.interactions_eco_inperson?.[0];

        return {
          cardType: "in_person",
          cardInfo: card,
          liked: interaction?.liked ?? false,
          signed_up: interaction?.signed_up ?? false,
          completed: interaction?.completed ?? false,
          clicked: interaction?.clicked ?? false,
        };
      }); 
    
      const onlineCardData: CardProps[] = (onlineData ?? []).map(card => {
        const interaction = card.interactions_eco_online?.[0];

        return {
          cardType: "online",
          cardInfo: card,
          liked: interaction?.liked ?? false,
          signed_up: interaction?.signed_up ?? false,
          completed: interaction?.completed ?? false,
          clicked: interaction?.clicked ?? false,
        };
      }); 
    
      const eventCardData: CardProps[] = (eventData ?? []).map(event => {
        const interaction = event.interactions_events?.[0];

        return {
          cardType: "event",
          cardInfo: event,
          liked: interaction?.liked ?? false,
          signed_up: interaction?.signed_up ?? false,
          completed: interaction?.completed ?? false,
          clicked: interaction?.clicked ?? false,
        };
      });

      const fullData = [...inPersonCardData, ...onlineCardData, ...eventCardData]
      setItems(fullData);
    };

    fetchData();
  }, [user?.id]);

  return (
    <LinearGradient
        colors={['white','#EDF3F7', '#EAF2F6']}
        locations={[0.8, 0.9, 1]}
        start={{ x: 0, y: 0}}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradient}
      >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
        <Header resultsCount={items.length}/>
        { items.map((card) => (
          <CardRenderer key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}
      </ScrollView>
        <View style={styles.mapBackground}>
          <MaterialCommunityIcons name="map" size={30} color={'#0282D3'}></MaterialCommunityIcons>          
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
