import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, Pressable, Linking, Alert, Share, useWindowDimensions } from 'react-native';
import { useState } from "react";
import { mdiOpenInNew } from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, formatEventDate, toggleLike, addClick, isPast } from "@/app/utils/cards";
import { router } from "expo-router";
import { supabase } from "@/constants/supabase";
import { useInteractions } from "@/context/InteractionsContext";
import { ActivityFeedback } from "@/components/ActivityFeedback";
import { DeleteActionModal } from "./DeleteActionModal";
import RenderHtml from 'react-native-render-html';

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
  hidden: boolean,
}

export type EventCardDataProps = {
  cardType: "event";
  cardInfo: EventCardData,
  liked: boolean,
  signed_up: boolean | null,
  completed: boolean | null,
  clicked: boolean,
  feedback: boolean | null,
  statCount?: number,
}

type EventCardProps = EventCardDataProps & {
  expanded?: boolean;
  onToggle?: () => void;
  feedbackVisible: boolean;
  setFeedbackVisible: (val: boolean) => void;
  highlight?: boolean;
  showFeedback?: boolean;
  onDelete?: () => void;
  onHide?: () => void; 
};

const htmlTagsStyles = {
  b: { fontWeight: 'bold' as const },
  strong: { fontWeight: 'bold' as const },
  i: { fontStyle: 'italic' as const },
  em: { fontStyle: 'italic' as const },
  u: { textDecorationLine: 'underline' as const },
  ul: { marginBottom: 8 },
  ol: { marginBottom: 8 },
  li: { marginBottom: 4 },
  a: { color: '#0282D3', textDecorationLine: 'underline' as const },
};

const htmlRenderersProps = {
  a: {
    onPress: (_: any, href: string) => Linking.openURL(href),
  },
};

export const EventCard = ({
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
  onDelete,
  onHide,
  statCount,
}: EventCardProps) => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.is_admin === true;

  const { updateLike, updateSignUp, updateCompleted, updateClicked, updateFeedback } = useInteractions();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false); 

  const { width } = useWindowDimensions();

  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
  const toggleExpanded = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalExpanded(prev => !prev);
    }
  };

  const isPastEvent = isPast(cardInfo.end_date);

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
          { cardType: "event", cardInfo, liked, signed_up, completed, clicked, feedback },
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
        { cardType: "event", cardInfo, liked, signed_up, completed, clicked, feedback }
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
      { cardType: "event", cardInfo, liked, signed_up, completed, clicked, feedback },
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

    if (response) {
      setFeedbackVisible(true);
    } else {
      updateCompleted(
        { cardType: "event", cardInfo, liked, signed_up, completed, clicked, feedback },
        response
      );
      toggleExpanded();
    }
  };

  const handleFeedbackSubmit = async (feedbackText: string) => {
    if (!user?.id) return;

    await Promise.all([
      supabase
        .from("feedback")
        .insert({
          user_id: user.id,
          content: feedbackText,
          event_id: cardInfo.id,
        }),
      supabase
        .from("interactions_events")
        .update({ feedback: true })
        .eq("event_id", cardInfo.id)
        .eq("user_id", user.id)
    ])
      
    setFeedbackVisible(false);
    updateCompleted(
      { cardType: "event", cardInfo, liked, signed_up, completed: true, clicked, feedback },
      true
    );
    updateFeedback(
      { cardType: "event", cardInfo, liked, signed_up, completed: true, clicked, feedback },
      true
    );
    toggleExpanded()
  }

  const handleFeedbackCancel = () => {
    setFeedbackVisible(false);
    updateCompleted(
      { cardType: "event", cardInfo, liked, signed_up, completed: true, clicked, feedback },
      true
    );
    updateFeedback(
      { cardType: "event", cardInfo, liked, signed_up, completed: true, clicked, feedback },
      false
    );
    toggleExpanded()
  }

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
      { cardType: "event", cardInfo, liked, signed_up, completed, clicked, feedback }, !liked
    );
  };

  const handleShare = async () => {
    try {
      const message = `From the Environteers app: 
        ${cardInfo.title}
        ${cardInfo.start_date ? formatEventDate(cardInfo.start_date, cardInfo.end_date!) : ""}
        ${cardInfo.location ?? "" }
        ${cardInfo.description ?? "" }      
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
    <View style={[
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
        cardTitle = {cardInfo.title}
        cardType = "event"
      />

    {/* // <View style={CardStyles.card}> */}
      <Pressable onPress={toggleExpanded}>
        <View style={CardStyles.cardInfo}>
          <View style={CardStyles.imageColumn}>
            { cardInfo.cover_photo && (
              <View style={{ position: 'relative' }}>
                {renderCoverPhoto(cardInfo.cover_photo, signed_up || completed ? 0.5 : 1)}
                {/* Admin stat tag */}
                {isAdmin && statCount !== undefined && (
                  <View style={CardStyles.statTag}>
                    <MaterialIcons name="mail-outline" size={14} color="#11C484" />
                    <Text style={CardStyles.statTagText}>{statCount} RSVPs</Text>
                  </View>
                )}
                {/* User status tag */}
                {!isAdmin && (completed || signed_up) && (
                  <View style={CardStyles.userTag}>
                    <MaterialCommunityIcons
                      name={"check-circle"}
                      size={14}
                      color="#11C484"
                    />
                    <Text style={CardStyles.userTagText}>{completed ? "Completed" : "Signed Up"}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
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
                <View style={CardStyles.deleteIconBackground}>
                  <MaterialCommunityIcons name="trash-can-outline" size={25} color="#EA4335" 
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
          //       onPress={handleLikes}
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
                  onPress={handleLikes}   
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
              { cardInfo.description && (
                <RenderHtml
                  contentWidth={width}
                  source={{ html: cardInfo.description }}
                  baseStyle={{ marginTop: 20 }}
                  tagsStyles={htmlTagsStyles}
                  renderersProps={htmlRenderersProps}
                />
              )}
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


