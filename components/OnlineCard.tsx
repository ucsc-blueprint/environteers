import { useAuth } from "@/context/AuthContext";
import { View, Text, Pressable, Linking, Share, useWindowDimensions } from 'react-native';
import { useState } from "react";
import { 
  mdiListBoxOutline,
  mdiOpenInNew,
} from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, toggleLike, addClick, addCompletion } from "@/app/utils/cards";
import { useInteractions } from "@/context/InteractionsContext";
import { ActivityFeedback } from "@/components/ActivityFeedback";
import { supabase } from "@/constants/supabase";
import { router } from "expo-router";
import { DeleteActionModal } from "./DeleteActionModal";
import { AdminCardActionSelection } from "./AdminCardActionSelection";
import RenderHtml from 'react-native-render-html';

export type OnlineCardData = {
  id: string,
  created_at: string,
  cover_photo?: string,
  title: string,
  end_date?: Date,
  campaign_type?: string,
  email_link?: string,
  summary?: string,
  hidden: boolean
}

export type OnlineCardDataProps = {
  cardType: "online";
  cardInfo: OnlineCardData,
  liked: boolean,
  completed: boolean | null,
  clicked: boolean,
  feedback: boolean | null,
  statCount?: number,
}

type OnlineCardProps = OnlineCardDataProps & {
  expanded?: boolean;
  showFeedback?: boolean,
  onToggle?: () => void;
  highlight?: boolean;
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

export const OnlineCard = ({
  cardInfo, 
  liked, 
  showFeedback = false,
  completed,
  clicked,
  feedback,
  highlight,
  onHide,
  onDelete,
  statCount,
}: OnlineCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const { user, profile } = useAuth();
  const isAdmin = profile?.is_admin === true;

  const { updateLike, updateCompleted, updateClicked, updateFeedback } = useInteractions();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  const { width } = useWindowDimensions()

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const shouldShowPrompt =
    expanded &&
    clicked &&
    completed === null;

  const openSignUpLink = async () => {
    if (user?.id) {

      // Reset completion ONLY if previously false
      if (completed === false) {
        await addCompletion(
          "interactions_eco_online",
          cardInfo.id,
          user.id,
          "action_id",
          null
        );

        updateCompleted({ cardType: "online", cardInfo, liked, completed, clicked, feedback }, null);
      }

      await addClick(
        "interactions_eco_online",
        cardInfo.id,
        user.id,
        "action_id"
      );

      updateClicked({ cardType: "online", cardInfo, liked, completed, clicked, feedback });
    }

    Linking.openURL(cardInfo.email_link!);
  };

  const handleLike = async () => {
    if (!user?.id) return;

    await toggleLike(
      "interactions_eco_online",
      cardInfo.id,
      user.id,
      liked,
      "action_id"
    );
    
    updateLike(
      { cardType: "online", cardInfo, liked, completed, clicked, feedback }, !liked
    );
  };

  const handleCompletion = async (value: boolean) => {
    if (!user?.id) return;

    await addCompletion(
      "interactions_eco_online",
      cardInfo.id,
      user.id,
      "action_id",
      value
    );

    if (value) {
      setFeedbackVisible(true);
    } else {
      updateCompleted(
        { cardType: "online", cardInfo, liked, completed, clicked, feedback },
        value
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
          online_ecoaction_id: cardInfo.id,
        }),
      supabase
        .from("interactions_eco_online")
        .update({ feedback: true })
        .eq("action_id", cardInfo.id)
        .eq("user_id", user.id)
    ])

    setFeedbackVisible(false);
    updateCompleted(
      { cardType: "online", cardInfo, liked, completed: true, clicked, feedback },
      true
    );
    updateFeedback(
      { cardType: "online", cardInfo, liked, completed: true, clicked, feedback },
      true
    );
    toggleExpanded();
  }

  const handleFeedbackCancel = () => {
    setFeedbackVisible(false);
    updateCompleted(
      { cardType: "online", cardInfo, liked, completed: true, clicked, feedback },
      true
    );
    updateFeedback(
      { cardType: "online", cardInfo, liked, completed: true, clicked, feedback },
      false
    );
    toggleExpanded();
  }
  
  const handleShare = async () => {
    try {
      const message = `From the Environteers app: 
        ${cardInfo.title}
        ${cardInfo.end_date ?? ""}
        ${cardInfo.campaign_type ?? "" }
        ${cardInfo.summary ?? "" }      
      `
      await Share.share({ message });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // RENDER END DATE
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
        cardTitle= {cardInfo.title}
        cardType="online"
      />
      <AdminCardActionSelection
        visible={actionMenuVisible}
        onClose={() => setActionMenuVisible(false)}
        hidden={cardInfo.hidden}
        onToggleHide={() => onHide?.()}
        onDelete={() => setDeleteModalVisible(true)}
      />

      <Pressable onPress={toggleExpanded}>
        <View style={CardStyles.cardInfo}>
          {/* Cover Photo */}
          <View style={CardStyles.imageColumn}>
            { cardInfo.cover_photo && (
              <View style={{ position: 'relative' }}>
                {renderCoverPhoto(cardInfo.cover_photo, completed ? 0.4 : 1)}
                {/* Admin stat tag */}
                {isAdmin && statCount !== undefined && (
                  <View style={CardStyles.statTag}>
                    <MaterialIcons name="check" size={14} color="#11C484" />
                    <Text style={CardStyles.statTagText}>{statCount} Done</Text>
                  </View>
                )}
                {/* User status tag */}
                {!isAdmin && completed && (
                  <View style={CardStyles.userTag}>
                    <MaterialCommunityIcons
                      name={"check-circle"}
                      size={14}
                      color="#11C484"
                    />
                    <Text style={CardStyles.userTagText}>Completed</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          {/* Main Content */}
          <View style={CardStyles.contentColumn}>
            <Text>{cardInfo.title}</Text>
            {/* {endDate && <Text>{endDate}</Text>} */}
            <View style={CardStyles.formatRow}>
              {renderIcon(24, mdiListBoxOutline, 'black')}
              {cardInfo.campaign_type && <Text>{cardInfo.campaign_type}</Text>}
            </View>
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
                    params: { typeOfAction: "online", id: cardInfo.id}
                  })
                }}
              /> 
              </View>
                <View style={CardStyles.iconBackgrounds}>
                  <MaterialCommunityIcons name="dots-horizontal" size={25} color="#0282D3" 
                  onPress = {() => 
                  {
                    // console.log("delete press, id: ", cardInfo.id);
                    // setDeleteModalVisible(true);
                    setActionMenuVisible(true);
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
          //       onPress={handleLike}
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
                  onPress={handleLike}   
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
            { cardInfo.summary && (
              <RenderHtml
                contentWidth={width}
                source={{ html: cardInfo.summary }}
                baseStyle={{ marginTop: 20 }}
                tagsStyles={htmlTagsStyles}
                renderersProps={htmlRenderersProps}
              />
            )}
            {/* Verify If User Signed-up */}
            {  /* signUpClick && !completed && */
            shouldShowPrompt &&
              <View style={CardStyles.confirmationContainer}>
                <Text style={{color: '#3A5513'}}>Did you complete this online eco-action?</Text>
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
            }
            {/* Action Button */}
            { cardInfo.email_link &&
              <View style={CardStyles.signUpButtonContainer}>
                  <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={openSignUpLink}>       
                    { completed ? 
                      <Text style={CardStyles.signUpText}>Eco action completed </Text> : 
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

