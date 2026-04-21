import { useAuth } from "@/context/AuthContext";
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  mdiMenu,
  mdiBell,
} from '@mdi/js';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { InPersonCard } from "@/components/InPersonCard";
import { OnlineCard } from "@/components/OnlineCard";
import { EventCard } from "@/components/EventCard";
import { CardProps } from "@/app/(tabs)/volunteer";
import { renderIcon } from "@/app/utils/cards";

type HeaderProps = {
  resultsCount: number,
  onOpenAddMenu: () => void,
}

<<<<<<< HEAD
export const Header = ({ resultsCount }: HeaderProps) => {
=======
export const Header = ({resultsCount, onOpenAddMenu}: HeaderProps) => {
>>>>>>> 3cbbd337861e880a03553e67cc61f4c8677a4b04
  const { profile } = useAuth();
  return (
      <View style={CardStyles.feedHeader}>
        {/* Navbar (Top)*/}
        <View style={CardStyles.formatBetween}>
          {renderIcon(24, mdiMenu, 'black')}
          {renderIcon(24, mdiBell, 'black')}
        </View>
        <Text style={CardStyles.userText}>Ready to take action
          <Text style={CardStyles.userName}> {profile?.first_name} {profile?.last_name}?</Text>
        </Text>
        {/* Searchbar */}
        <View>
          <Text style={[CardStyles.searchFilter, CardStyles.searchBar]}>Search for a keyword...</Text>
        </View>
        {/* Buttons */}
        <View style={CardStyles.filters}>
          <Pressable style={CardStyles.button} onPress={() => { }}><Text style={CardStyles.buttonText}>Events</Text></Pressable>
          <Pressable style={CardStyles.button} onPress={() => { }}><Text style={CardStyles.buttonText}>Eco Actions: In-person</Text></Pressable>
          <Pressable style={CardStyles.button} onPress={() => { }}><Text style={CardStyles.buttonText}>Eco Actions: Online</Text></Pressable>
          <Text style={CardStyles.results}>{resultsCount} results</Text>
        </View>
      </View>
<<<<<<< HEAD
  );
=======
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
>>>>>>> 3cbbd337861e880a03553e67cc61f4c8677a4b04
};

export const EcoFeed = (props: { card: CardProps }) => {

  const { card } = props;

  if (!card) return null;
  
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
<<<<<<< HEAD
};
=======
}  
>>>>>>> 3cbbd337861e880a03553e67cc61f4c8677a4b04
