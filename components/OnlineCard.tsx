import { useAuth } from "@/context/AuthContext";
import { View, Text, Pressable, Linking } from 'react-native';
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

export type OnlineCardData = {
  id: string,
  created_at: string,
  cover_photo?: string,
  title: string,
  end_date?: Date,
  campaign_type?: string,
  email_link?: string,
  summary?: string,
}

export type OnlineCardDataProps = {
  cardType: "online";
  cardInfo: OnlineCardData,
  liked: boolean,
  completed: boolean | null,
  clicked: boolean,
}

type OnlineCardProps = OnlineCardDataProps & {
  expanded?: boolean;
  onToggle?: () => void;
  highlight?: boolean;
};

export const OnlineCard = ({
  cardInfo, 
  liked, 
  completed,
  clicked,
  highlight,
}: OnlineCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();

  const { updateLike, updateCompleted, updateClicked } = useInteractions();

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

        updateCompleted({ cardType: "online", cardInfo, liked, completed, clicked }, null);
      }

      await addClick(
        "interactions_eco_online",
        cardInfo.id,
        user.id,
        "action_id"
      );

      updateClicked({ cardType: "online", cardInfo, liked, completed, clicked });
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
      { cardType: "online", cardInfo, liked, completed, clicked }, !liked
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

    updateCompleted(
      { cardType: "online", cardInfo, liked, completed, clicked },
      value
    );
  };

  // RENDER END DATE
  return (
    <View
      style={[
        CardStyles.card,
        highlight && CardStyles.requiredCard
      ]}
    >
      <Pressable onPress={toggleExpanded}>
        <View style={CardStyles.cardInfo}>
          {/* Cover Photo */}
          <View style={CardStyles.imageColumn}>
            { cardInfo.cover_photo && renderCoverPhoto(cardInfo.cover_photo) }
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
          <View style={CardStyles.iconsColumn}>
            <View style={CardStyles.iconBackgrounds}>
              <MaterialCommunityIcons
                name={liked ? "cards-heart" : "cards-heart-outline"}
                size={25}
                color={'#0282D3'}
                onPress={handleLike}
                disabled={!user?.id}
              />
              </View>
            <View style={CardStyles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
          </View>
        </View>
        {/* Expanded Content */}
        { expanded && 
          <View style={CardStyles.signUpContainer}>
            <Text style={{ marginTop: 20 }}>{cardInfo.summary}</Text>
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

