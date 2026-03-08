import { useAuth } from "@/context/AuthContext";
import { View, Text, Pressable, Linking, Alert } from 'react-native';
import { useState} from "react";
import { 
  mdiListBoxOutline,
  mdiOpenInNew,
} from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, toggleLike, addSignUp } from "@/app/utils/cards";


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
  signed_up: boolean,
  completed: boolean,
  clicked: boolean,
}

export const OnlineCard = ({
  cardInfo, 
  liked: initialLike, 
  signed_up: initialSignUp,
  completed,
  clicked,
}: OnlineCardDataProps) => {
  const [expanded, setExpanded] = useState(false);
  const [signUpClick, setSignUpClicked] = useState(false);
  const [liked, setLiked] = useState(initialLike);
  const [signUpStatus, setSignUpStatus] = useState(initialSignUp);
  const { user } = useAuth();

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const openSignUpLink = (link: string) => {
    Linking.openURL(link);
    setSignUpClicked(true);
  }

  const handleSignUp = (cardInfo: OnlineCardData) => {
    if (user?.id) {
      addSignUp("interactions_eco_online", cardInfo.id, user.id, 'action_id');
      setSignUpStatus(true);
      return;
    }
    Alert.alert("Not signed in! Can't sign up");
    return;
  }

  const handleLikes = (cardInfo: OnlineCardData) => {
    if (user?.id) {
      toggleLike("interactions_eco_online", cardInfo.id, user.id, liked, 'action_id');
      setLiked(!liked);
      return;
    }
    Alert.alert("Not signed in! Can't like post");
    return;
  }

  // RENDER END DATE
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
            <Text style={{ marginTop: 20 }}>{cardInfo.summary}</Text>
            {/* Verify If User Signed-up */}
            { signUpClick && !signUpStatus &&
              <View style={CardStyles.confirmationContainer}>
                <Text style={{color: '#3A5513'}}>Did you complete this online eco-action?</Text>
                <View style={CardStyles.confirmationButtons}>
                  <Pressable style={CardStyles.confirmationButton} onPress={() => setSignUpClicked(false)}>
                    <Text style={CardStyles.confirmationText} onPress={() => setExpanded(!expanded)}>No</Text>
                    <MaterialCommunityIcons name="close" size={20} color={'black'} />
                  </Pressable>
                  <Pressable style={CardStyles.confirmationButton} onPress={() => handleSignUp(cardInfo)}>
                    <Text style={CardStyles.confirmationText}>Yes</Text>
                    <MaterialCommunityIcons name="check" size={20} color={'black'} />
                  </Pressable>
                </View>
              </View>
            }
            {/* Sign Up Button */}
            { cardInfo.email_link &&
              <View style={CardStyles.signUpButtonContainer}>
                <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(cardInfo.email_link!)}> 
                  { signUpStatus ? 
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
