import { View, Image, Text, StyleSheet, Pressable } from 'react-native';

import Icon from '@mdi/react';
import { mdiCalendar, mdiLeaf } from '@mdi/js';

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
    <View style={styles.name}>
      <Text style={styles.nameText}>Ready to Volunteer <Text style={{ fontWeight: '700' }}>Name?</Text></Text>
    </View>
    <View style={styles.cardDes}>
      <View style={styles.sort}>
        <Text style={styles.sort}>Most Recent</Text>
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
          <Text style={styles.location}>{location}</Text>

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
      <Text style={styles.notes}>
        Notes: Children under 14 require adult supervision
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  feedHeader: {
    flexDirection: 'column',
  },
  name: {
    marginBottom: 100
  },
  nameText: {
    fontSize: 40,
  },
  cardDes: {
    flexDirection: 'row',
    gap: 300,
  },
  sort: {
    alignSelf: 'flex-start',
  },
  results: {
    alignSelf: 'flex-end',
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
    alignSelf: 'flex-start',
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

  notes: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'right',
  },

  header: {
    flexDirection: 'row',
    gap: '2px',
    alignItems: 'center',
  }
});
