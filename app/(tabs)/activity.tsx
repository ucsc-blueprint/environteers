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

      const { data: inPersonData, error: inPersonDataError} = await supabase
        .from("interactions_eco_inperson")
        .select(`
          liked,
          signed_up,
          completed,
          clicked,
          inperson_ecoactions(*)
        `)
        .eq("user_id", user.id);

      const { data: onlineData, error: onlineDataError } = await supabase
        .from("interactions_eco_online")
        .select(`
          liked,
          signed_up,
          completed,
          clicked,
          online_ecoactions(*)
        `)
        .eq("user_id", user.id);

      const { data: eventData, error: eventDataError } = await supabase
        .from("interactions_events")
        .select(`
          liked,
          signed_up,
          completed,
          clicked,
          events(*)
        `)
        .eq("user_id", user.id);

    if (inPersonDataError) console.error(inPersonDataError);
    if (onlineDataError) console.error(onlineDataError);
    if (eventDataError) console.error(eventDataError);
    
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
      // console.log('liked cards: ', likedCards);
      setSignedUpCards(fullData.filter(card => card.signed_up));
      // console.log('signedup cards: ', signedUpCards);
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
      {/* <LogoutButton/> */}
    </ScrollView>
    </View>
  );
}


//   return (
//     <LinearGradient
//         colors={['white','#EDF3F7', '#EAF2F6']}
//         locations={[0.8, 0.9, 1]}
//         start={{ x: 0, y: 0}}
//         end={{ x: 0, y: 0.5 }}
//         style={styles.gradient}
//       >
//       <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
//         {/* <Header resultsCount={items.length}/>
//         { items.map((item) => (
//           <EcoFeed
//             key={`${item.id}-${item.type}`}
//             {...item}
//           />
//         ))} */}
//       </ScrollView>
//         <View style={styles.mapBackground}>
//           <MaterialCommunityIcons name="map" size={30} color={'#0282D3'}></MaterialCommunityIcons>          
//         </View>
//     </LinearGradient>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: '20',
  }


  // scrollContent: {
  //   padding: 16,
  //   gap: 16,
  // },
  // mapBackground: {
  //   backgroundColor: 'white',
  //   borderRadius: 50,
  //   padding: 15,
  //   maxWidth: 80,
  //   position: 'absolute',
  //   bottom: 10,
  //   right: 20,
  //   boxShadow: '0px 0px 10px 0px #0282D333',
  // }
});
