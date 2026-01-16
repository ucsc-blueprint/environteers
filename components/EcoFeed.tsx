import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
// Icons
import Icon from '@mdi/react';
import { 
  mdiCalendar, 
  mdiLeaf, 
  mdiExportVariant, 
  mdiCardsHeartOutline,
  mdiMapMarker,
  mdiFilterVariant,
  mdiMenu,
  mdiBell
} from '@mdi/js';

export interface EcoFeedProps {
  title: string;
  date: string;
  location: string;
  spotsLeft?: number;
  type?: 'Eco-Action' | 'Event';
  onLearnMore?: () => void;
  onSignUp?: () => void;
}

export const Header = () => (
  <View style={styles.feedHeader}>
    {/* Navbar (Top)*/}
    <View style={styles.formatBetween}>
      <Icon path={mdiMenu} size={1.5} />
      <Icon path={mdiBell} size={1.5} />
    </View>
    <Text style={styles.nameText}>Ready to Volunteer <Text style={{ fontWeight: '700' }}>Name?</Text></Text>
    {/* Searchbar */}
    <View>
      <Text style={[styles.filter, styles.searchBar]}>Search for a keyword...</Text>
    </View>
    {/* Buttons */}
    <View style={styles.buttons}>
        <Text style={styles.filter}>Eco-Actions</Text>
        <Text style={styles.filter}>Events</Text>
        <Text style={styles.filter}>In person</Text>
        <Text style={styles.filter}>Online</Text>
        <Text style={styles.filter}>Archived/past?</Text>
    </View>

    <View style={styles.cardDes}>
      <View style={styles.formatRow}>
        <Icon path={mdiFilterVariant} size={1} />
        <Text style={{ fontWeight: '400' }}>Most Recent</Text>
      </View>
      <View style={styles.results}>
        <Text style={styles.results}>25 results</Text>
      </View>
    </View>
  </View>
);

export const EcoFeed = ({
  title,
  date,
  location,
  spotsLeft,
  type,
  onLearnMore,
  onSignUp,
}: EcoFeedProps) => {
  return (
    <View style={styles.card}>
      {/* Top content */}
      <View style={styles.row}>
        {/* Image placeholder */}
        <View style={styles.imagePlaceholder}>
          <View style={styles.header}>
            <Icon path={(type==='Eco-Action') ? mdiLeaf : mdiCalendar} size={0.8} />
            <Text style={styles.typeLabel}>{type}</Text>
          </View>

          {spotsLeft !== undefined && (
            <View style={styles.spotsPill}>
              <Text style={styles.spotsText}>{spotsLeft} spots left</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
          <View style={styles.location}>
            <Icon path={mdiMapMarker} size={1} />
            <Text>{location}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.learnMoreButton} onPress={onLearnMore}>
              <Text style={styles.learnMoreText}>Learn more</Text>
            </Pressable>

            <Pressable style={styles.signUpButton} onPress={onSignUp}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Notes */}
      <View style={styles.footnote}>
        <View style={styles.actions}>
          <Icon path={mdiExportVariant} size={1} />
          <Icon path={mdiCardsHeartOutline} size={1} />
          <Image source={require('../assets/images/google-calendar.png')} style={styles.image}/>
        </View>
        <Text style={styles.notes}>
          Notes: Children under 14 require adult supervision
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  feedHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  nameText: {
    fontSize: 38,
    paddingVertical: 20,
    marginLeft: 9
  },

  cardDes: {
    flexDirection: 'row',
    gap: 280,
  },

  results: {
    alignSelf: 'flex-end',
    fontWeight: '400',
  },

  card: {
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
    padding: 16,
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    gap: 16,
  },

  imagePlaceholder: {
    width: 130,
    height: 160,
    backgroundColor: '#FFFFFF',
    padding: 8,
    justifyContent: 'space-between',
  },

  typeLabel: {
    fontSize: 14,
    fontWeight: '700',
  },

  spotsPill: {
    alignSelf: 'flex-end',
    backgroundColor: '#D1D1D1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  spotsText: {
    fontSize: 12,
    fontWeight: '600',
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B6B6B',
    marginBottom: 8,
  },

  location: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },

  learnMoreButton: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  learnMoreText: {
    fontSize: 16,
    fontWeight: '700',
  },

  signUpButton: {
    backgroundColor: '#000',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },

  signUpText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  divider: {
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#B0B0B0',
    borderStyle: 'dashed',
  },

  footnote: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  notes: {
    fontSize: 14,
    color: '#6B6B6B',
  },

  header: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  image: {
    width: 21,
    height: 21,
  },
  
  formatRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },

  formatBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },

  filter: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 30,
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    fontWeight: 400,
  },

  searchBar: {
    color: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },

  shareIcon: {
    paddingBottom: 1,
  },
});
