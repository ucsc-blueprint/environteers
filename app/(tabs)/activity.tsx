import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { EcoFeed } from "@/components/EcoFeed";
import { CardProps } from "./volunteer";
import { useInteractions } from "@/context/InteractionsContext";

export default function Activity() {
  const { cards, loading } = useInteractions();
  const now = new Date();

  const getCardDate = (card: CardProps) => {
    if (!card?.cardInfo) return null;
    if (card.cardType === "event" && card.cardInfo.start_date) {
      return new Date(card.cardInfo.start_date);
    }  
    if (card.cardType === "in_person" && card.cardInfo.start_date) {
      return new Date(card.cardInfo.start_date);
    } 
    return null;
    };

  // Derived cards from card state
  const likedCards = cards.filter(card => card.liked === true);
  const completedCards = cards.filter(card => card.completed === true); 
  
  const upcomingCards = cards.filter(card => {
    const date = getCardDate(card);
    const isUpcoming = date && date > now;
    return (
      (card.cardType === "event" || card.cardType === "in_person") &&
      card.signed_up === true && isUpcoming
    );

  })

  
  const requiresActionCards = cards.filter(card => {
    const date = getCardDate(card);
    const isPast = date ? date < now : false;

    // ONLINE
    if (card.cardType === "online") {
      return card.clicked === true && card.completed === null;
    }

    // EVENTS / IN-PERSON
    if (card.cardType === "event" || card.cardType === "in_person") {
      const notSignedUpYet =
        card.clicked === true && card.signed_up === null;

      const needsCompletionAfterEvent =
        card.clicked === true &&
        card.signed_up === true &&
        isPast &&
        card.completed === null;

      return notSignedUpYet || needsCompletionAfterEvent;
    }

    return false;
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
        { loading && <ActivityIndicator size="large" color="#0000ff" />}
        <Text>Likes:</Text>
        { !loading && likedCards?.map(card => (
          <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
        ))}

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

