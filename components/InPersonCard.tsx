import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useState, useEffect, useRef} from "react";
import { supabase } from "@/constants/supabase";
import { 
  mdiMenu,
  mdiBell,
  mdiListBoxOutline,
  mdiOpenInNew,
} from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from "storybook/theming";


type inPersonCardData = {
  id: string,
  created_at: string,
  cover_photo?: string,
  title: string,
  location?: string,
  start_date: Date,
  end_date: Date,
  sign_up_link: string,
  summary?: string,
}

type InPersonCardProps = {
  cardInfo: inPersonCardData,
  liked: Boolean,
  signedUp: Boolean,
}

// export const InPersonCard = ({
//   cardInfo: inPersonCardData, 
//   liked: initialLiked, 
//   signedUp
// }: CardProps) => {



// };
export const InPersonCard = ({
  cardInfo, 
  liked: initialLike, 
  signedUp: initialSignUp
}: InPersonCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [signUpClick, setSignUpClicked] = useState(false);
  const [liked, setLiked] = useState(initialLike);
  const [signedUp, setSignedUp] = useState(initialSignUp);
  const [loadingLike, setLoadingLike] = useState(true);
  const { user } = useAuth();

  console.log("CARD INFO:")
  console.log(cardInfo)

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const openSignUpLink = (link: string) => {
    Linking.openURL(link);
    setSignUpClicked(true);
  }  

  useEffect(() => {
    async function checkIfLiked() {
      if (!user?.id) {
        setLoadingLike(false);
        return;
      }

      const { data, error } = await supabase
        .from("interactions_eco_inperson")
        .select("id")
        .eq("action_id", Number(cardInfo.id))
        .eq("user_id", user.id)
        .eq("interaction_type", "like")
        .maybeSingle();

      if (error) {
        console.log("Like check error:", error);
      }

      if (data) {
        setLiked(true);
      }

      setLoadingLike(false);
    }

    checkIfLiked();
  }, [user?.id, cardInfo.id]);

  async function toggleLike() {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to like.");
      return;
    }
    //const eventId = Number(props.id);
  
    if (!liked) {
      // INSERT like
      const { error } = await supabase
        .from("interactions_eco_inperson")
        .insert([
          {
            interaction_type: "like",
            action_id: Number(cardInfo.id),
            user_id: user.id,
          },
        ]);
  
      if (error) {
        console.log(error);
        Alert.alert("Error", "Could not like this event.");
        return;
      }
  
      setLiked(true);
    } else {
      // DELETE like (unlike)
      console.log("Attempting delete with:", {
        event_id: Number(cardInfo.id),
        user_id: user?.id,
        interaction_type: "like"
      });
      
      const { data, error } = await supabase
        .from("interactions_eco_inperson")
        .delete()
        .eq("interaction_type", "like")
        .eq("action_id", Number(cardInfo.id))
        .eq("user_id", user.id)
        .select();

      console.log("Deleted rows:", data);

      if (error) {
        console.log(error);
        Alert.alert("Error", "Could not unlike this event.");
        return;
      }

      setLiked(false);
    }
  }

  async function addInteraction(props: inPersonCardData, interaction: string) {
    const { data, error } = await supabase
      .from('interactions_eco_inperson')
      .insert([{
        interaction_type: interaction,
        action_id: props.id,
        user_id: user?.id,
      }]);
    if (error) {
      // 23505 = unique constraint violation
      if (error.code === '23505') {
        Alert.alert(
          'Already Recorded',
          interaction === 'like'
            ? 'You have already liked this event.'
            : 'You have already signed up for this event.'
        );
      } else {
        console.log('Supabase error:', error);
        Alert.alert(
          'Error',
          'Something went wrong. Please try again.'
        );
      }
      return;
    }
    setSignUpClicked(false);
  }
  return (
    <>
      <Text>{cardInfo.title}</Text>
    </>
  );
};