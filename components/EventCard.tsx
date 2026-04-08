import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, Pressable, Linking, Alert } from 'react-native';
import { useState } from "react";
import { 
  mdiOpenInNew,
} from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, formatEventDate, toggleLike, addSignUp, addClick } from "@/app/utils/cards";
import { addClick } from "@/app/utils/cards";
import { useRefresh } from "@/context/RefreshContext";

export type EventCardData = {
  id: string,
  title: string,
  start_time?: Date,
  end_time?: Date,
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
  signed_up: boolean,
  completed: boolean,
  clicked: boolean,
}

export const EventCard = ({
  cardInfo, 
  liked: initialLike, 
  signed_up: initialSignUp,
  completed,
  clicked,
}: EventCardDataProps) => {
  const [expanded, setExpanded] = useState(false);
  const [signUpClick, setSignUpClicked] = useState(false);
  const [signUpStatus, setSignUpStatus] = useState(initialSignUp);
  const [liked, setLiked] = useState(initialLike);
  const { user } = useAuth();

  const { triggerRefresh } = useRefresh();


  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const openSignUpLink = (link: string) => {
    if (user?.id) {
      addClick("interactions_events", cardInfo.id, user.id, 'event_id');
      setSignUpClicked(true);
    }
    Linking.openURL(link);
  }  

  const handleSignUp = (cardInfo: EventCardData) => {
    if (user?.id) {
      addSignUp("interactions_events", cardInfo.id, user.id, 'event_id');
      setSignUpStatus(true);
      triggerRefresh();
      return;
    }
    Alert.alert("Not signed in! Can't sign up");
    return;
  }


  // const handleLikes = (cardInfo: EventCardData) => {
  //   if (user?.id) {
  //     toggleLike("interactions_events", cardInfo.id, user.id, liked, 'event_id');
  //     setLiked(!liked);
  //     return;
  //   }
  //   Alert.alert("Not signed in! Can't like post");
  //   return;
  // }

  const handleLikes = async (cardInfo: EventCardData) => {
    if (user?.id) {
      await toggleLike(
        "interactions_events",
        cardInfo.id,
        user.id,
        liked,
        'event_id'
      );
  
      setLiked(!liked);
      triggerRefresh(); 
      return;
    }
  
    Alert.alert("Not signed in! Can't like post");
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
            { cardInfo.start_time && cardInfo.end_time &&
              <View style={[CardStyles.formatRow, CardStyles.date]}>
                <Image
                  source={require("../assets/images/google-calendar.png")}
                  style={{ width: 18, height: 18 }}
                />
                <Text>{formatEventDate(cardInfo.start_time, cardInfo.end_time)}</Text>
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
              { cardInfo.description && <Text style={{ marginTop: 20 }}>{cardInfo.description}</Text>}
              {/* Verify If User Signed-up */}
              { signUpClick && !signUpStatus &&
                <View style={CardStyles.confirmationContainer}>
                  <Text style={{color: '#3A5513'}}>Did you sign up for this event?</Text>
                  <View style={CardStyles.confirmationButtons}>
                    <Pressable style={CardStyles.confirmationButton} onPress={() => setSignUpClicked(false)}>
                      <Text style={CardStyles.confirmationText} onPress={() => setExpanded(!expanded)}>No</Text>
                      <MaterialCommunityIcons name="close" size={20} color={'black'} />
                    </Pressable>
                    <Pressable style={CardStyles.confirmationButton}>
                      <Text style={CardStyles.confirmationText} onPress={() => handleSignUp(cardInfo)}>Yes</Text>
                      <MaterialCommunityIcons name="check" size={20} color={'black'} />
                    </Pressable>
                  </View>
                </View>
              }
              {/* Sign Up Button */}
              { cardInfo.sign_up_link &&
                <View style={CardStyles.signUpButtonContainer}>
                  <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(cardInfo.sign_up_link!)}> 
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

