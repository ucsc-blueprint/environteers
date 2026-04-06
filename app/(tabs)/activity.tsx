import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";
import { InPersonCard, InPersonCardDataProps } from "@/components/InPersonCard";
import { OnlineCard, OnlineCardDataProps } from "@/components/OnlineCard";
import { EventCard, EventCardDataProps } from "@/components/EventCard";
import { CardProps } from "./volunteer";

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
  const [likedCards, setLikedCards] = useState<CardProps[]>([]);
  const [signedUpCards, setSignedUpCards] = useState<CardProps[]>([]);
  const [completedCards, setCompletedCards] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!user?.id) {
        setLoading(false);
        return;
      };

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
    
      const inPersonCardData: InPersonCardDataProps[] = (inPersonData ?? []).map(interaction => ({
        cardType: 'in_person',
        cardInfo: interaction["inperson_ecoactions"],
        liked: interaction.liked,
        signed_up: interaction.signed_up,
        completed: interaction.completed,
        clicked: interaction.clicked,
      }));   
    
      const onlineCardData: OnlineCardDataProps[] = (onlineData ?? []).map(interaction => ({
        cardType: 'online',
        cardInfo: interaction["online_ecoactions"],
        liked: interaction.liked,
        completed: interaction.completed,
        clicked: interaction.clicked,
      }));    

      const eventCardData: EventCardDataProps[] = (eventData ?? []).map(interaction => ({
        cardType: 'event',
        cardInfo: interaction["events"],
        liked: interaction.liked,
        signed_up: interaction.signed_up,
        completed: interaction.completed,
        clicked: interaction.clicked,
      }));

      const fullData = [...inPersonCardData, ...onlineCardData, ...eventCardData]
      const signedUpData = [...inPersonCardData, ...eventCardData]
      setLikedCards((fullData ?? []).filter(card => card.liked));
      setSignedUpCards(signedUpData.filter(card => card.signed_up));
      setCompletedCards((fullData ?? []).filter(card => card.completed));
      setLoading(false);
    };

    fetchData();
  }, [user?.id]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
        { loading && <ActivityIndicator size="large" color="#0000ff" />}
        <Text>Likes:</Text>
        { !loading && likedCards?.map(card => (
          <CardRenderer key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}
        <Text>Signed Up:</Text>
        { !loading && signedUpCards?.map(card => (
          <CardRenderer key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}
        <Text>Completed:</Text>
        { !loading && completedCards?.map(card => (
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
