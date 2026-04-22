import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, Pressable, Linking, Alert } from 'react-native';
import { useState } from "react";
import { mdiOpenInNew } from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, formatEventDate, toggleLike, addSignUp, addClick } from "@/app/utils/cards";
import { router, useRouter } from "expo-router";
import { supabase } from "@/constants/supabase";
import { useInteractions } from "@/context/InteractionsContext";

export type EventCardData = {
  id: string,
  title: string,
  start_date?: Date,
  end_date?: Date,
  location?: string,
  cover_photo?: string,
  google_calendar_link?: string,
  description?: string,
  sign_up_link?: string,
}

export type EventCardDataProps = {
  cardType: "event";
  cardInfo: EventCardData,
  liked: boolean,
  signed_up: boolean | null,
  completed: boolean | null,
  clicked: boolean,
}

type EventCardProps = EventCardDataProps & {
  expanded?: boolean;
  onToggle?: () => void;
};

export const EventCard = ({
  cardInfo, 
  liked, 
  signed_up,
  completed,
  clicked,
  expanded: externalExpanded,
  onToggle,
}: EventCardProps) => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.is_admin === true;

  const { updateLike, updateSignUp, updateCompleted, updateClicked } = useInteractions();

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
          .from("interactions_events") 
          .update({ signed_up: null })
          .eq("event_id", cardInfo.id)
          .eq("user_id", user.id);

        updateSignUp(
          { cardType: "event", cardInfo, liked, signed_up, completed, clicked },
          null
        );
      }

      await addClick(
        "interactions_events",
        cardInfo.id,
        user.id,
        'event_id'
      );

      updateClicked(
        { cardType: "event", cardInfo, liked, signed_up, completed, clicked }
      );
    }

    Linking.openURL(link);
  };
  

  const handleSignUp = async (response: boolean) => {
    if (!user?.id) return;

    await supabase
      .from("interactions_events")
      .update({ signed_up: response, signed_up_timestamp: new Date().toISOString() })
      .eq("event_id", cardInfo.id)
      .eq("user_id", user.id);

    updateSignUp(
      { cardType: "event", cardInfo, liked, signed_up, completed, clicked },
      response
    );

    if (!response) {
      toggleExpanded();
    }
  };

  const handleCompletion = async (response: boolean) => {
    if (!user?.id) return;

    await supabase
      .from("interactions_events")
      .update({ completed: response, completed_timestamp: new Date().toISOString(), })
      .eq("event_id", cardInfo.id)
      .eq("user_id", user.id);

    updateCompleted(
      { cardType: "event", cardInfo, liked, signed_up, completed, clicked },
      response
    );

    toggleExpanded();
  };

  const handleLikes = async () => {
    if (!user?.id) {
      Alert.alert("Not signed in! Can't like post");
      return;
    }

    await toggleLike(
      "interactions_events",
      cardInfo.id,
      user.id,
      liked,
      'event_id'
    );
    
    updateLike(
      { cardType: "event", cardInfo, liked, signed_up, completed, clicked }, !liked
    );
  };

  return (
    <View style={CardStyles.card}>
      <Pressable onPress={toggleExpanded}>
        <View style={CardStyles.cardInfo}>
          <View style={CardStyles.imageColumn}>
            { cardInfo.cover_photo && renderCoverPhoto(cardInfo.cover_photo) } 
          </View>
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

            {isAdmin && (
            <View style={[CardStyles.formatRow, CardStyles.rsvpContainer]}>
              <Text style = {[CardStyles.rsvp]}>24 current RSVPs</Text>
            </View>
            )}

            { cardInfo.location &&
              <View style={CardStyles.formatRow}>
                <MaterialIcons name="location-on" size={25} color={'black'} />
                <Text>{cardInfo.location}</Text>
              </View>
            }
          </View>
          {/* Like/Share Icons */}
          {isAdmin ? (
            <View style={CardStyles.iconsColumn}>
              <View style={CardStyles.iconBackgrounds}> 
              <MaterialCommunityIcons
                name="pencil-outline"
                size={25}
                color={'#0282D3'}
                onPress={() => {
                  console.log("Edit pressed, id: ", cardInfo.id);
                  router.push({
                    pathname: '/(tabs)/AdminEditEcoAction',
                    params: { typeOfAction: "event", id: cardInfo.id}
                  })
                }}
              />
              </View>
              <View style={CardStyles.deleteIconBackground}><MaterialCommunityIcons name="trash-can-outline" size={25} color="#EA4335" /></View>    
              </View>
          ): (
          <View style={CardStyles.iconsColumn}>
            <View style={CardStyles.iconBackgrounds}>
            <MaterialCommunityIcons
                name={liked ? "cards-heart" : "cards-heart-outline"}
                size={25}
                color={'#0282D3'}
                onPress={handleLikes}
                disabled={!user?.id}
              />
            </View>
            <View style={CardStyles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
          </View>
          )}
        </View>
          {/* Expanded Content */}
          { expanded && 
            <View style={CardStyles.signUpContainer}>
              { cardInfo.description && <Text style={{ marginTop: 20 }}>{cardInfo.description}</Text>}
              {/* Verify If User Signed-up */}
              { /* signUpClick && !signUpStatus && */ 
               shouldShowPrompt &&
                <View style={CardStyles.confirmationContainer}>
                  <Text style={{color: '#3A5513'}}>Did you sign up for this event?</Text>
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
                    Did you complete this event?
                  </Text>

                  <View style={CardStyles.confirmationButtons}>
                  <Pressable
                    style={CardStyles.confirmationButton}
                    onPress={() => handleCompletion(true)}
                  >
                    <Text style={CardStyles.confirmationText}>Yes</Text>
                    <MaterialCommunityIcons name="check" size={20} color={'black'} />
                  </Pressable>

                  <Pressable
                    style={CardStyles.confirmationButton}
                    onPress={() => handleCompletion(false)}
                  >
                    <Text style={CardStyles.confirmationText}>No</Text>
                    <MaterialCommunityIcons name="close" size={20} color={'black'} />
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
