import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";
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

export default function Activity() {
  const { user } = useAuth()
  // const [inPersonUserInteractions, setInPersonUserInteractions] = useState<UserInteraction[]>([]);
  const [likedCards, setLikedCards] = useState<CardProps[]>([]);
  const [signedUpCards, setSignedUpCards] = useState<CardProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      const [inPersonRes, onlineRes, eventRes] = await Promise.all([
        supabase
          .from("interactions_eco_inperson")
          .select(`*, inperson_ecoactions(*)`)
          .eq("user_id", user.id),

        supabase
          .from("interactions_eco_online")
          .select(`*, online_ecoactions(*)`)
          .eq("user_id", user.id),

        supabase
          .from("interactions_events")
          .select(`*, events(*)`)
          .eq("user_id", user.id)
      ]);

      if (inPersonRes.error) console.error(inPersonRes.error);
      if (onlineRes.error) console.error(onlineRes.error);
      if (eventRes.error) console.error(eventRes.error);

      const inPersonData = inPersonRes.data ?? [];
      const onlineData = onlineRes.data ?? [];
      const eventData = eventRes.data ?? [];
    
      // Values: "event", "in_person", "online"
      const inPersonCardData: CardProps[] = (inPersonData ?? []).map(interaction => ({
        cardType: 'in_person',
        cardInfo: interaction["inperson_ecoactions"],
        liked: interaction.liked,
        signed_up: interaction.signed_up,
        completed: interaction.completed,
        clicked: interaction.clicked,
      }));   
    
      const onlineCardData: CardProps[] = (onlineData ?? []).map(interaction => ({
        cardType: 'online',
        cardInfo: interaction["online_ecoactions"],
        liked: interaction.liked,
        signed_up: interaction.signed_up,
        completed: interaction.completed,
        clicked: interaction.clicked,
      }));    

      const eventCardData: CardProps[] = (eventData ?? []).map(interaction => ({
        cardType: 'event',
        cardInfo: interaction["events"],
        liked: interaction.liked,
        signed_up: interaction.signed_up,
        completed: interaction.completed,
        clicked: interaction.clicked,
      }));

      const fullData = [...inPersonCardData, ...onlineCardData, ...eventCardData]
      setLikedCards((fullData ?? []).filter(card => card.liked));
      setSignedUpCards(fullData.filter(card => card.signed_up));
    };

    fetchData();
  }, [user?.id, likedCards, signedUpCards]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
        {/* <Text>Activity</Text>
        <Text>Requires Action</Text>
        <Text>Upcoming</Text> */}
        {/* <Text>Past Activity</Text> */}
        <Text>Likes:</Text>
        {likedCards?.map(card => (
          <CardRenderer key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}
        <Text>Signed Up:</Text>
        {signedUpCards?.map(card => (
          <CardRenderer key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}
      <LogoutButton/>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: '20',
  }
});
