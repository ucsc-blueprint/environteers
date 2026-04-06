import { useAuth } from "@/context/AuthContext";
import { View, Text, Pressable } from 'react-native';
// CardStylesheet
import { 
  mdiMenu,
  mdiBell,
} from '@mdi/js';
import { InPersonCardData, InPersonCard } from "@/components/InPersonCard";
import { OnlineCardData, OnlineCard } from "@/components/OnlineCard";
import { EventCardData, EventCard } from "@/components/EventCard";
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon } from "@/app/utils/cards";

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

type HeaderProps = {
  resultsCount: number,
}

export const Header = ({resultsCount}: HeaderProps) => {
  const { profile } = useAuth();
  return (
    <View style={CardStyles.feedHeader}>
      {/* Navbar (Top)*/}
      <View style={CardStyles.formatBetween}>
        {renderIcon(24, mdiMenu, 'black')}
        {renderIcon(24, mdiBell, 'black')}
      </View>
      <Text style={CardStyles.userText}>Ready to take action 
        <Text style={ CardStyles.userName}> {profile?.first_name} {profile?.last_name}?</Text>
      </Text>
      {/* Searchbar */}
      <View>
        <Text style={[CardStyles.searchFilter, CardStyles.searchBar]}>Search for a keyword...</Text>
      </View>
      {/* Buttons */}
      <View style={CardStyles.filters}>
        <Pressable style={CardStyles.button} onPress={() => {}}><Text style={CardStyles.buttonText}>Events</Text></Pressable>
        <Pressable style={CardStyles.button} onPress={() => {}}><Text style={CardStyles.buttonText}>Eco Actions: In-person</Text></Pressable>
        <Pressable style={CardStyles.button} onPress={() => {}}><Text style={CardStyles.buttonText}>Eco Actions: Online</Text></Pressable>
        <Text style={CardStyles.results}>{resultsCount} results</Text>
      </View>
    </View>
    );
};

export const EcoFeed = (card: CardProps) => {
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
};

