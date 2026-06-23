import { useAuth } from '@/context/AuthContext';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import React, { useState } from 'react';
import { CardStyles } from '@/utils/CardStyles';
import { InPersonCard } from '@/components/InPersonCard';
import { OnlineCard } from '@/components/OnlineCard';
import { EventCard } from '@/components/EventCard';
import { CardProps } from '@/app/(tabs)/volunteer';
import { SlidersHorizontal } from 'lucide-react-native';
import { EcoFeedFilterDropdown } from '@/components/EcoFeedFilterDropdown';

type HeaderProps = {
  resultsCount: number;
  search: string;
  setSearch(value: string): void;
  filterTypes: string[];
  setFilterTypes(types: string[]): void;
  maxDistance: number | null;
  setMaxDistance(distance: number | null): void;
  hideTitle?: boolean;
};

type ExpandableProps = {
  isSelected?: boolean;
  showFeedback?: boolean;
  setSelectedId?: React.Dispatch<React.SetStateAction<string | null>>;
  highlight?: boolean;
  onDelete?: () => void;
  onHide?: () => void;
  onPress?: () => void;
};

export const Header = ({
  resultsCount,
  search,
  setSearch,
  filterTypes,
  setFilterTypes,
  maxDistance,
  setMaxDistance,
  hideTitle = false,
}: HeaderProps) => {
  const { profile } = useAuth();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View style={[CardStyles.feedHeader, hideTitle && styles.headerNoTitle]}>
      {!hideTitle && (
        <Text style={CardStyles.userText}>
          Ready to take action
          <Text style={CardStyles.userName}>
            {' '}
            {profile?.first_name} {profile?.last_name}?
          </Text>
        </Text>
      )}
      {/* Searchbar */}
      <View>
        <View style={[styles.searchRow, hideTitle && styles.searchRowAdmin]}>
          <TextInput
            placeholder='Search...'
            placeholderTextColor='#868E8B'
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, hideTitle && styles.searchInputAdmin]}
          />

          <Pressable
            onPress={() => setShowFilters((prev) => !prev)}
            style={[styles.filterButton, hideTitle && styles.filterButtonAdmin]}
          >
            <SlidersHorizontal size={18} color='black' />
          </Pressable>
        </View>

        {showFilters && (
          <View style={{ marginTop: 16 }}>
            <EcoFeedFilterDropdown
              typeOptions={[
                { label: 'In-Person Eco Actions', value: 'in_person' },
                { label: 'Online Eco Actions', value: 'online' },
                { label: 'Events', value: 'event' },
              ]}
              selectedTypes={filterTypes}
              selectedDistance={maxDistance}
              onApply={(types, distance) => {
                setFilterTypes(types);
                setMaxDistance(distance);
                setShowFilters(false);
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export const EcoFeed = (props: { card: CardProps } & ExpandableProps) => {
  const { card } = props;
  const expanded = props.isSelected ?? false;

  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const toggleExpanded = () => {
    if (props.setSelectedId) {
      const key = `${card.cardInfo.id}-${card.cardType}`;
      props.setSelectedId((prev) => (prev === key ? null : key));
      props.onPress?.();
    }
  };

  if (!card) return null;

  switch (card.cardType) {
    case 'in_person':
      return (
        <InPersonCard
          {...card}
          highlight={props.highlight}
          showFeedback={props.showFeedback === true}
          onDelete={props.onDelete}
          onHide={props.onHide}
          liked={card.liked}
          signed_up={card.signed_up}
          completed={card.completed}
          clicked={card.clicked}
          feedbackVisible={feedbackVisible}
          setFeedbackVisible={setFeedbackVisible}
          {...(props.setSelectedId ? { expanded, onToggle: toggleExpanded } : {})}
          statCount={card.statCount}
        />
      );
    case 'online':
      return (
        <OnlineCard
          {...card}
          highlight={props.highlight}
          showFeedback={props.showFeedback === true}
          onDelete={props.onDelete}
          onHide={props.onHide}
          liked={card.liked}
          completed={card.completed}
          clicked={card.clicked}
          statCount={card.statCount}
        />
      );
    case 'event':
      return (
        <EventCard
          {...card}
          highlight={props.highlight}
          showFeedback={props.showFeedback === true}
          onDelete={props.onDelete}
          onHide={props.onHide}
          liked={card.liked}
          signed_up={card.signed_up}
          completed={card.completed}
          clicked={card.clicked}
          feedbackVisible={feedbackVisible}
          setFeedbackVisible={setFeedbackVisible}
          {...(props.setSelectedId ? { expanded, onToggle: toggleExpanded } : {})}
          statCount={card.statCount}
        />
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  headerNoTitle: {
    backgroundColor: 'transparent',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2F6',
    borderRadius: 8,
  },
  searchRowAdmin: {
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  searchInputAdmin: {
    backgroundColor: '#fff',
  },
  filterButton: {
    width: 35,
    height: 28,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  filterButtonAdmin: {
    backgroundColor: '#EAF2F6',
  },
});
