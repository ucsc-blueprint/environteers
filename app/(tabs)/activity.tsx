import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";
import { InPersonCardDataProps } from "@/components/InPersonCard";
import { OnlineCardDataProps } from "@/components/OnlineCard";
import { EventCardDataProps } from "@/components/EventCard";
import { CardProps } from "./volunteer";
import { EcoFeed } from "@/components/EcoFeed";

import { useRefresh } from "@/context/RefreshContext";


export default function Activity() {
  const { user } = useAuth()
  const [likedCards, setLikedCards] = useState<CardProps[]>([]);
 //const [signedUpCards, setSignedUpCards] = useState<CardProps[]>([]);
  const [completedCards, setCompletedCards] = useState<CardProps[]>([]);

  const [requiresActionCards, setRequiresActionCards] = useState<CardProps[]>([]);
  const [upcomingCards, setUpcomingCards] = useState<CardProps[]>([]);

  const [loading, setLoading] = useState(false);

  const { refreshKey } = useRefresh();



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLikedCards([]);
      setCompletedCards([]);
      setRequiresActionCards([]);
      setUpcomingCards([]);

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
      
      const [inPersonInteractions, onlineInteractions, eventInteractions] =
        await Promise.all([
          supabase.from("interactions_eco_inperson").select("*").eq("user_id", user.id),
          supabase.from("interactions_eco_online").select("*").eq("user_id", user.id),
          supabase.from("interactions_events").select("*").eq("user_id", user.id),
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

      // const fullData = [...inPersonCardData, ...onlineCardData, ...eventCardData]
      // const signedUpData = [...inPersonCardData, ...eventCardData]
      // setLikedCards((fullData ?? []).filter(card => card.liked));
      // setSignedUpCards(signedUpData.filter(card => card.signed_up));
      // setCompletedCards((fullData ?? []).filter(card => card.completed));
      const fullData = [...inPersonCardData, ...onlineCardData, ...eventCardData];

      const now = new Date();

      // const getCardDate = (card: CardProps) => {
      //   if (card.cardType === "event") return new Date(card.cardInfo.start_time!);
      //   if (card.cardType === "in_person") return new Date(card.cardInfo.start_date);
      //   return null;
      // };
      const getCardDate = (card: CardProps) => {
        if (!card?.cardInfo) return null;
      
        if (card.cardType === "event" && card.cardInfo.end_date) {
          return new Date(card.cardInfo.end_date);
        }
      
        if (card.cardType === "in_person" && card.cardInfo.start_date) {
          return new Date(card.cardInfo.start_date);
        }
      
        return null;
      };

      setLikedCards(fullData.filter(card => card.liked === true));

      setCompletedCards(
        fullData.filter(card => card.completed === true)
      );

      setUpcomingCards(
        fullData.filter(card => {
          const date = getCardDate(card);
          const now = new Date();
      
          const isUpcoming = date && date > now;
      
          return (
            (card.cardType === "event" || card.cardType === "in_person") &&
            card.signed_up === true &&
            isUpcoming
          );
        })
      );

      // last working vesion
      // setUpcomingCards(
      //   fullData.filter(card => {
      //     if (card.signed_up !== true) return false;
      //     const date = getCardDate(card);
      //     return date && date > now;
      //   })
      // );

      // setRequiresActionCards(
      //   fullData.filter(card => {
      //     const date = getCardDate(card);

      //     const clickedNotSignedUp =
      //       card.clicked === true && card.signed_up === null;

      //     const signedUpPastNotCompleted =
      //       card.signed_up === true &&
      //       date &&
      //       date < now &&
      //       card.completed === null; //// 👈 only ask if not answered

      //     return clickedNotSignedUp || signedUpPastNotCompleted;
      //   })
      // );

      // last working version
      // setRequiresActionCards(
      //   fullData.filter(card => {
      //     const date = getCardDate(card);
      //     const isUpcoming = !date || date > now;
      
      //     // ONLINE
      //     if (card.cardType === "online") {
      //       return (
      //         card.clicked === true &&
      //         card.completed === null
      //       );
      //     }
      
      //     // EVENTS / IN-PERSON
      //     if (card.cardType === "event" || card.cardType === "in_person") {
      //       return (
      //        // card.clicked === true &&
      //        (card.clicked ?? false) === true &&
      //         card.signed_up === null &&
      //         isUpcoming
      //       );
      //     }
      
      //     return false;
      //   })
      // );
      setRequiresActionCards(
        fullData.filter(card => {
          const date = getCardDate(card);
          const now = new Date();
      
          const isPast = date ? date < now : false;

          if (card.cardType === "online") {
            return (
              card.clicked === true &&
              card.completed === null
            );
          }

          if (card.cardType === "event" || card.cardType === "in_person") {
      
            const notSignedUpYet =
              card.clicked === true &&
              card.signed_up === null;
      
            const needsCompletionAfterEvent =
              card.clicked === true &&
              card.signed_up === true &&
              isPast &&
              card.completed === null;
      
            return notSignedUpYet || needsCompletionAfterEvent;
          }
      
          return false;
        })
      );
      setLoading(false);
    };

    fetchData();
  }, [user?.id, refreshKey]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
        { loading && <ActivityIndicator size="large" color="#0000ff" />}
        <Text>Likes:</Text>
        { !loading && likedCards?.map(card => (
          <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}

        {/* <Text>Signed Up:</Text>
        { !loading && signedUpCards?.map(card => (
          <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))} */}

        <Text>Requires Action:</Text>
        { !loading && requiresActionCards?.map(card => (
          <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}

        <Text>Upcoming:</Text>
        { !loading && upcomingCards?.map(card => (
          <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}
        

        <Text>Completed:</Text>
        { !loading && completedCards?.map(card => (
          <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
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

