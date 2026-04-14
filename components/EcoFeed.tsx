import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import React, { useState, useEffect} from "react";
import { supabase } from "@/constants/supabase";
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
  resultsCount: number;
};

type ExpandableProps = {
  isSelected?: boolean,
  setSelectedId?: React.Dispatch<React.SetStateAction<string | null>>; 
};

export const Header = ({ resultsCount }: HeaderProps) => {
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

export const EcoFeed = (props: { card: CardProps } & ExpandableProps) => {
  const { card } = props;
  const expanded = props.isSelected ?? false;

  const toggleExpanded = () => {
    if (!props.setSelectedId) return;
    const key = `${card.cardInfo.id}-${card.cardType}`;
    props.setSelectedId(prev => (prev === key ? null : key));
  };

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
          expanded={expanded}
          onToggle={toggleExpanded}
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
          expanded={expanded}
          onToggle={toggleExpanded}
        />
      );
    default:
      return null;
  }
};

