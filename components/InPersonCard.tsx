import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, Pressable, Linking, Alert, Share } from 'react-native';
import { useState } from "react";
import { mdiOpenInNew } from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, formatEventDate, toggleLike, addClick, addCompletion } from "@/app/utils/cards";
import { useInteractions } from "@/context/InteractionsContext";
import { supabase } from "@/constants/supabase";
import { ActivityFeedback } from "@/components/ActivityFeedback";
import Toast from 'react-native-toast-message';
import { router } from "expo-router";
import { DeleteActionModal } from "./DeleteActionModal";

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
  google_calendar_link?: string,
  hidden : boolean,
}

export type InPersonCardDataProps = {
  cardType: "in_person";
  cardInfo: InPersonCardData,
  liked: boolean,
  signed_up: boolean | null,
  completed: boolean | null,
  clicked: boolean,
  feedback: boolean | null,
  onDelete?: () => void;
  onHide?: () => void; 
}

type InPersonCardProps = InPersonCardDataProps & {
  expanded?: boolean;
  onToggle?: () => void;
  feedbackVisible: boolean;
  setFeedbackVisible: (val: boolean) => void;
  highlight?: boolean;
  showFeedback?: boolean,
};

export const InPersonCard = ({
  cardInfo, 
  liked,
  showFeedback,
  signed_up,
  completed,
  clicked,
  feedback,
  feedbackVisible,
  setFeedbackVisible,
  expanded: externalExpanded,
  onToggle,
  highlight,
  onHide,
  onDelete,
}: InPersonCardProps) => {
  const { updateLike, updateSignUp, updateCompleted, updateClicked, updateFeedback } = useInteractions();
  const { user, profile } = useAuth();
  const isAdmin = profile?.is_admin === true;

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
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
          .update({ signed_up: null })
          .eq("action_id", cardInfo.id)
          .eq("user_id", user.id);

        // Update context
        updateSignUp(
          { cardType: "in_person", cardInfo, liked, signed_up: null, completed, clicked, feedback },
          null
        );
      }

      await addClick("interactions_eco_inperson", cardInfo.id, user.id, 'action_id');

      // No refresh (just updates local state)
      updateClicked(
        { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed, clicked, feedback }
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
      { cardType: "in_person", cardInfo, liked, signed_up: response, completed, clicked, feedback }, response
    );
    toggleExpanded();
  };
      

  // const handleCompletion = async (response: boolean) => {
  //   if (!user?.id) return;

  //   await supabase
  //     .from("interactions_eco_inperson")
  //     .update({ completed: response })
  //     .eq("action_id", cardInfo.id)
  //     .eq("user_id", user.id);

  //   if (response) {
  //     setFeedbackVisible(true);
  //   } else {
  //     // Update context
  //     updateCompleted(
  //       { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed: response, clicked, feedback },
  //       response
  //     );
  //     toggleExpanded(); 
  //   }
  // };

  const handleCompletion = async (response: boolean) => {
    if (!user?.id) return;
  
    await addCompletion(
      "interactions_eco_inperson",
      cardInfo.id,
      user.id,
      "action_id",
      response
    );
  
    updateCompleted(
      { cardType: "in_person", cardInfo, liked, signed_up, completed: response, clicked, feedback },
      response
    );
  
    toggleExpanded();
  };

  const handleFeedbackSubmit = async (feedbackText: string) => {
    if (!user?.id) return;

    await Promise.all([
      supabase
        .from("feedback")
        .insert({
          user_id: user.id,
          content: feedbackText,
          inperson_ecoaction_id: cardInfo.id,
        }),
      supabase
        .from("interactions_eco_inperson")
        .update({ feedback: true })
        .eq("action_id", cardInfo.id)
        .eq("user_id", user.id)
    ])
      
    setFeedbackVisible(false);
    updateCompleted(
      { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed: true, clicked, feedback },
      true
    );
    updateFeedback(
      { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed: true, clicked, feedback },
      true
    );
    toggleExpanded()

    Toast.show({
      type: 'success',
      text1: 'Thank you for your feedback!',
    })
  }

  const handleFeedbackCancel = () => {
    setFeedbackVisible(false);
    updateCompleted(
      { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed: true, clicked, feedback },
      true
    );
    updateFeedback(
      { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed: true, clicked, feedback },
      false
    );
    toggleExpanded();
  }

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
        { cardType: "in_person", cardInfo, liked, signed_up: signed_up, completed, clicked, feedback }, !liked
      );

      return;
    }

    Alert.alert("Not signed in! Can't like post");
  };

  const handleShare = async () => {
    try {
      const message = `From the Environteers app: 
        ${cardInfo.title}
        ${cardInfo.start_date ? formatEventDate(cardInfo.start_date, cardInfo.end_date!) : ""}
        ${cardInfo.location ?? "" }
        ${cardInfo.summary ?? "" }      
      `
      await Share.share({ message });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Invalid link");
    }
  };

  return (
    <View
      style={[
        CardStyles.card,
        highlight && CardStyles.requiredCard
      ]}
    >
      <ActivityFeedback 
        visible={feedbackVisible} 
        onSubmit={handleFeedbackSubmit} 
        onCancel={handleFeedbackCancel} 
      />
      <DeleteActionModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onFullDelete={() => { setDeleteModalVisible(false); onDelete?.(); }}
        onHide={() => { setDeleteModalVisible(false); onHide?.(); }}
        cardTitle= {cardInfo.title}
        cardType= "in_person"
      />

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
                {cardInfo.google_calendar_link && (
                  <Pressable onPress={() => openLink(cardInfo.google_calendar_link!)}>
                    <Image
                      source={require("../assets/images/google-calendar.png")}
                      style={{ width: 18, height: 18 }}
                    />
                  </Pressable>
                )}
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
                    params: { typeOfAction: "in-person", id: cardInfo.id}
                  })
                }}
              />
              </View>
              <View style={CardStyles.deleteIconBackground}>
                <MaterialCommunityIcons name="trash-can-outline"
                  size={25} color="#EA4335"
                  onPress = {() => 
                  {
                    console.log("delete press, id: ", cardInfo.id);
                    setDeleteModalVisible(true);
                  }}
                />
              </View>    
            </View>
          ): (
          // <View style={CardStyles.iconsColumn}>
          //   <View style={CardStyles.iconBackgrounds}>
          //   <MaterialCommunityIcons
          //       name={liked ? "cards-heart" : "cards-heart-outline"}
          //       size={25}
          //       color={'#0282D3'}
          //       onPress={() => handleLikes(cardInfo)}
          //       disabled={!user?.id}
          //     />
          //   </View>
          //   <View style={CardStyles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} onPress={handleShare}/></View>
          // </View>

          <View style={CardStyles.iconsColumn}>
            <View style={CardStyles.iconBackgrounds}>
              {showFeedback ? (
                <MaterialCommunityIcons
                  name="message-alert-outline"
                  size={25}
                  color={'#0282D3'}
                  onPress={() => setFeedbackVisible(true)}
                />
              ) : (
                <MaterialCommunityIcons
                  name={liked ? "cards-heart" : "cards-heart-outline"}
                  size={25}
                  color={'#0282D3'}
                  onPress={() => handleLikes(cardInfo)}
                  disabled={!user?.id}
                />
              )}
            </View>
            <View style={CardStyles.iconBackgrounds}>
              <MaterialIcons name="ios-share" size={25} color={'#0282D3'} onPress={handleShare}/>
            </View>
          </View>

          )}
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
                { completed && !feedback ? (
                  <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => setFeedbackVisible(true)}>
                    <Text style={CardStyles.signUpText}>Provide Feedback</Text>
                  </Pressable>
                ) : (
                  <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(cardInfo.sign_up_link!)}> 
                    { signed_up ? 
                      <Text style={CardStyles.signUpText}>Revisit Link</Text> : 
                      <Text style={CardStyles.signUpText}>Take Action</Text> 
                    }
                    {renderIcon(15, mdiOpenInNew, 'white')}
                  </Pressable>
                )}
              </View>
            }
          </View>
          }
        </Pressable>
    </View>
  );
}
