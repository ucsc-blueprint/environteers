import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, Pressable, Linking, Alert } from 'react-native';
import { useState } from "react";
import { mdiOpenInNew } from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, formatEventDate, toggleLike, addClick } from "@/app/utils/cards";
import { useInteractions } from "@/context/InteractionsContext";
import { supabase } from "@/constants/supabase";

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

export type InPersonCardDataProps = {
  cardType: "in_person";
  cardInfo: InPersonCardData,
  liked: boolean,
  signed_up: boolean | null,
  completed: boolean | null,
  clicked: boolean,
}

type InPersonCardProps = InPersonCardDataProps & {
  expanded?: boolean;
  onToggle?: () => void;
};

export const InPersonCard = ({
  cardInfo, 
  liked,
  signed_up,
  completed,
  clicked,
  expanded: externalExpanded,
  onToggle
}: InPersonCardProps) => {
  const { updateLike, updateSignUp, updateCompleted, updateClicked } = useInteractions();
  const { user } = useAuth();

  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
  const toggleExpanded = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded(prev => !prev);
    }
  };

  const isPastEvent =
  cardInfo.end_date
    ? new Date(cardInfo.end_date).getTime() < Date.now()
    : false;

  const shouldShowCompletionPrompt =
    expanded &&
    clicked &&
    signed_up === true &&
    completed === null &&
    isPastEvent;

  const shouldShowPrompt =
    expanded &&
    clicked &&
    signed_up === null;

  const openSignUpLink = async (link: string) => {
    if (user?.id) {
      // Reset signed_up ONLY if it was false
      if (signed_up === false) {
        await supabase
          .from("interactions_eco_inperson") 
          .update({ signed_up: null, signed_up_timestamp: new Date().toISOString(), })
          .eq("action_id", cardInfo.id)
          .eq("user_id", user.id);

        // Update context
        updateSignUp(
          { cardType: "in_person", cardInfo, liked, signed_up: null, completed, clicked },
          null
        );
      }

      await addClick("interactions_eco_inperson", cardInfo.id, user.id, 'action_id');

      // No refresh (just updates local state)
      updateClicked(
        { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed, clicked }
      );
    }

    Linking.openURL(link);
  };

  const handleSignUp = async (response: boolean) => {
    if (!user?.id) return;

    await supabase
      .from("interactions_eco_inperson")
      .update({ signed_up: response, signed_up_timestamp: new Date().toISOString() })
      .eq("action_id", cardInfo.id)
      .eq("user_id", user.id);
    
      // Update context
    updateSignUp (
      { cardType: "in_person", cardInfo, liked, signed_up: response, completed, clicked }, response
    );
    toggleExpanded();
  };
      

    const handleCompletion = async (response: boolean) => {
      if (!user?.id) return;
    
      await supabase
        .from("interactions_eco_inperson")
        .update({ completed: response })
        .eq("action_id", cardInfo.id)
        .eq("user_id", user.id);
    
      toggleExpanded(); 

      // Update context
      updateCompleted(
        { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed: response, clicked },
        response
      );

    };

  const handleLikes = async (cardInfo: InPersonCardData) => {
    if (user?.id) {
      await toggleLike(
        "interactions_eco_inperson",
        cardInfo.id,
        user.id,
        liked,
        'action_id'
      );
      updateLike (
        { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed, clicked }, !liked
      );

      return;
    }

    Alert.alert("Not signed in! Can't like post");
  };

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
                onPress={() => handleLikes(cardInfo)}
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
            { /* { signUpClick && !signUpStatus && */ }
            { shouldShowPrompt &&
              <View style={CardStyles.confirmationContainer}>
                <Text style={{color: '#3A5513'}}>Did you sign up for this in person eco action?</Text>
                <View style={CardStyles.confirmationButtons}>
                <Pressable
                  style={CardStyles.confirmationButton}
                  onPress={() => handleSignUp(true)}
                >
                  <Text style={CardStyles.confirmationText}>Yes</Text>
                  <MaterialCommunityIcons name="check" size={20} color={'black'} />
                </Pressable>

                <Pressable
                  style={CardStyles.confirmationButton}
                  onPress={() => handleSignUp(false)}
                >
                  <Text style={CardStyles.confirmationText}>No</Text>
                  <MaterialCommunityIcons name="close" size={20} color={'black'} />
                </Pressable>
                </View>
              </View>
            }

            {shouldShowCompletionPrompt && (
              <View style={CardStyles.confirmationContainer}>
                <Text style={{ color: '#3A5513' }}>
                  Did you complete this eco action?
                </Text>

                <View style={CardStyles.confirmationButtons}>

                  <Pressable onPress={() => handleCompletion(true)}>
                    <Text>Yes</Text>
                    <MaterialCommunityIcons name="check" size={20} color="black" />
                  </Pressable>

                  <Pressable onPress={() => handleCompletion(false)}>
                    <Text>No</Text>
                    <MaterialCommunityIcons name="close" size={20} color="black" />
                  </Pressable>

                </View>
              </View>
            )}

            {/* Sign Up Button */}
            { cardInfo.sign_up_link &&
              <View style={CardStyles.signUpButtonContainer}>
                <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(cardInfo.sign_up_link!)}> 
                  { signed_up ? 
                    <Text style={CardStyles.signUpText}>Revisit Link</Text> : 
                    <Text style={CardStyles.signUpText}>Take Action</Text> 
                  }
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
