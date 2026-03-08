import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useState, useEffect, useRef} from "react";
import { 
  mdiMenu,
  mdiBell,
  mdiListBoxOutline,
  mdiOpenInNew,
} from '@mdi/js';
import { supabase } from "@/constants/supabase";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, formatEventDate, toggleLike } from "@/app/utils/cards";


export type InPersonCardData = {
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

export type InPersonCardProps = {
  cardType: "in_person";
  cardInfo: InPersonCardData,
  liked: boolean,
  signed_up: boolean,
  completed: boolean,
  clicked: boolean,
}

export const InPersonCard = ({
  cardInfo, 
  liked: initialLike, 
  signed_up: initialSignUp,
  completed,
  clicked,
}: InPersonCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [signUpClick, setSignUpClicked] = useState(false);
  const [liked, setLiked] = useState(initialLike);
  const [loadingLike, setLoadingLike] = useState(true);
  const [signedUp, setSignedUp] = useState(initialSignUp);
  const { user } = useAuth();

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const openSignUpLink = (link: string) => {
    Linking.openURL(link);
    setSignUpClicked(true);
  }

  const userSignUp = () => {
    setSignedUp(true);
  }

  return (
    <View style={CardStyles.card}>
      <Pressable onPress={toggleExpanded}>
        <View style={CardStyles.cardInfo}>
          {/* Cover Photo */}
          <View style={CardStyles.imageColumn}>
            { cardInfo.cover_photo && renderCoverPhoto(cardInfo.cover_photo) }
          </View>
          {/* Main Content */}
          <View style={CardStyles.contentColumn}>
            <Text>{cardInfo.title}</Text>
            { cardInfo.start_date && cardInfo.end_date &&
              <View style={[CardStyles.formatRow, CardStyles.date]}>
                <Image
                  source={require("../assets/images/google-calendar.png")}
                  style={{ width: 18, height: 18 }}
                />
                <Text>{formatEventDate(cardInfo.start_date, cardInfo.end_date)}</Text>
              </View>
            }
            { cardInfo.location &&
              <View style={CardStyles.formatRow}>
                <MaterialIcons name="location-on" size={25} color={'black'} />
                <Text>{cardInfo.location}</Text>
              </View>
            }
          </View>
          {/* Like/Share Icons */}
          <View style={CardStyles.iconsColumn}>
            <View style={CardStyles.iconBackgrounds}>
            <MaterialCommunityIcons
                name={liked ? "cards-heart" : "cards-heart-outline"}
                size={25}
                color={'#0282D3'}
                onPress={() =>
                  toggleLike("interactions_eco_inperson", cardInfo.id, user.id, liked, 'action_id')
                }
                disabled={!user?.id}
              />
            </View>
            <View style={CardStyles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
          </View>
        </View>
        {/* Expanded Content */}
        { expanded && 
          <View style={CardStyles.signUpContainer}>
            { cardInfo.summary && <Text style={{ marginTop: 20 }}>{cardInfo.summary}</Text>}
            {/* Verify If User Signed-up */}
            { signUpClick &&
              <View style={CardStyles.confirmationContainer}>
                <Text style={{color: '#3A5513'}}>Did you sign up for this in person eco action?</Text>
                <View style={CardStyles.confirmationButtons}>
                  <Pressable style={CardStyles.confirmationButton} onPress={() => (setSignUpClicked(false))}>
                    <Text style={CardStyles.confirmationText}>No</Text>
                    <MaterialCommunityIcons name="close" size={20} color={'black'} />
                  </Pressable>
                  <Pressable style={CardStyles.confirmationButton}>
                    <Text style={CardStyles.confirmationText}>Yes</Text>
                    <MaterialCommunityIcons name="check" size={20} color={'black'} />
                  </Pressable>
                </View>
              </View>
            }
            {/* Sign Up Button */}
            { cardInfo.sign_up_link &&
              <View style={CardStyles.signUpButtonContainer}>
                <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(cardInfo.sign_up_link!)}> 
                  <Text style={CardStyles.signUpText}>Sign Up</Text>
                  {renderIcon(15, mdiOpenInNew, 'white')}
                </Pressable>
              </View>
            }
          </View>
          }
        </Pressable>
    </View>
  );
}


  // async function toggleLike() {
  //   if (!user?.id) {
  //     Alert.alert("Error", "You must be logged in to like.");
  //     return;
  //   }
  //   //const eventId = Number(props.id);
  
  //   if (!liked) {
  //     // INSERT like
  //     const { error } = await supabase
  //       .from("interactions_eco_inperson")
  //       .insert([
  //         {
  //           interaction_type: "like",
  //           action_id: Number(props.id),
  //           user_id: user.id,
  //         },
  //       ]);
  
  //     if (error) {
  //       console.log(error);
  //       Alert.alert("Error", "Could not like this event.");
  //       return;
  //     }
  
  //     setLiked(true);
  //   } else {
  //     // DELETE like (unlike)
  //     console.log("Attempting delete with:", {
  //       event_id: Number(props.id),
  //       user_id: user?.id,
  //       interaction_type: "like"
  //     });



      
  //     const { data, error } = await supabase
  //       .from("interactions_eco_inperson")
  //       .delete()
  //       .eq("interaction_type", "like")
  //       .eq("action_id", Number(props.id))
  //       .eq("user_id", user.id)
  //       .select();

  //     console.log("Deleted rows:", data);

  //     if (error) {
  //       console.log(error);
  //       Alert.alert("Error", "Could not unlike this event.");
  //       return;
  //     }

  //     setLiked(false);
  //   }
  // }


    // async function addInteraction(props: InPersonEcoAction, interaction: string) {
  //   const { data, error } = await supabase
  //     .from('interactions_eco_inperson')
  //     .insert([{
  //       interaction_type: interaction,
  //       action_id: props.id,
  //       user_id: user?.id,
  //     }]);
  //   if (error) {
  //     // 23505 = unique constraint violation
  //     if (error.code === '23505') {
  //       Alert.alert(
  //         'Already Recorded',
  //         interaction === 'like'
  //           ? 'You have already liked this event.'
  //           : 'You have already signed up for this event.'
  //       );
  //     } else {
  //       console.log('Supabase error:', error);
  //       Alert.alert(
  //         'Error',
  //         'Something went wrong. Please try again.'
  //       );
  //     }
  //     return;
  //   }
  //   setSignUpClicked(false);
  // }
