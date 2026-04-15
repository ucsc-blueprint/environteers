import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, Pressable, Linking, Alert } from 'react-native';
// import Svg, { Path } from 'react-native-svg';
import { useState} from "react";
import { 
  // mdiMenu,
  // mdiBell,
  // mdiListBoxOutline,
  mdiOpenInNew,
} from '@mdi/js';
// import { supabase } from "@/constants/supabase";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, formatEventDate, toggleLike, addSignUp, addClick } from "@/app/utils/cards";
import { router, useRouter } from "expo-router";
import { useRefresh } from "@/context/RefreshContext";


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
  const [signUpStatus, setSignUpStatus] = useState(initialSignUp);
  const { user, profile } = useAuth();
  const isAdmin = profile?.is_admin === true;
  const router = useRouter();


  const { triggerRefresh } = useRefresh();

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const openSignUpLink = (link: string) => {
    if (user?.id) {
      addClick("interactions_eco_inperson", cardInfo.id, user.id, 'action_id');
      setSignUpClicked(true);
    }
    Linking.openURL(link);
  }

  const handleSignUp = (cardInfo: InPersonCardData) => {
    if (user?.id) {
      addSignUp("interactions_eco_inperson", cardInfo.id, user.id, 'action_id');
      setSignUpStatus(true);
      triggerRefresh();
      return;
    }
    Alert.alert("Not signed in! Can't sign up");
    return;
  }


  // const handleLikes = (cardInfo: InPersonCardData) => {
  //   if (user?.id) {
  //     toggleLike("interactions_eco_inperson", cardInfo.id, user.id, liked, 'action_id');
  //     setLiked(!liked);
  //     return;
  //   }
  //   Alert.alert("Not signed in! Can't like post");
  //   return;
  // }
  const handleLikes = async (cardInfo: InPersonCardData) => {

    if (user?.id) {
      await toggleLike(
        "interactions_eco_inperson",
        cardInfo.id,
        user.id,
        liked,
        'action_id'
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
          {isAdmin ? (
            <View style={CardStyles.iconsColumn}>
              <View style={CardStyles.iconBackgrounds}> 
              <MaterialCommunityIcons
                name="pencil-outline"
                size={25}
                color={'#0282D3'}
                onPress={() => router.push('/(tabs)/AddEcoAction')}
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
                onPress={() => handleLikes(cardInfo)}
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
            { cardInfo.summary && <Text style={{ marginTop: 20 }}>{cardInfo.summary}</Text>}
            {/* Verify If User Signed-up */}
            { signUpClick && !signUpStatus &&
              <View style={CardStyles.confirmationContainer}>
                <Text style={{color: '#3A5513'}}>Did you sign up for this in person eco action?</Text>
                <View style={CardStyles.confirmationButtons}>
                  <Pressable style={CardStyles.confirmationButton} onPress={() => (setSignUpClicked(false))}>
                    <Text style={CardStyles.confirmationText} onPress={() => setExpanded(!expanded)}>No</Text>
                    <MaterialCommunityIcons name="close" size={20} color={'black'} />
                  </Pressable>
                  <Pressable style={CardStyles.confirmationButton}>
                    <Text style={CardStyles.confirmationText} onPress={() => (handleSignUp(cardInfo))}>Yes</Text>
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
