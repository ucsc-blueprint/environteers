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
import { useRouter } from 'expo-router';

type HeaderProps = {
  resultsCount: number,
}

export const Header = ({ resultsCount }: HeaderProps) => {
  const { profile } = useAuth();
  const router = useRouter();
  const isAdmin = profile?.is_admin === true; //checks if user is an admin by calling from userAuth and seeing information that's been pulled

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
      {isAdmin && (
        <>
          <Pressable
            style={styles.addButton}
            onPress={() => router.push({pathname: '/(tabs)/AddEcoAction'})}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </Pressable>
        </>
      )}
    </View>
  );
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
};

const styles = StyleSheet.create({
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  addButton: {
    position: 'absolute',
    bottom: 15,
    right: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#94C153',
    height: 35,
    width: 80,
  },
})

