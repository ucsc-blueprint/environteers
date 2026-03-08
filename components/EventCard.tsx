import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useState, useEffect, useRef} from "react";
import { supabase } from "@/constants/supabase";
import { 
  mdiMenu,
  mdiBell,
  mdiListBoxOutline,
  mdiOpenInNew,
} from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';
import { styled } from "storybook/theming";
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon, renderCoverPhoto, formatEventDate } from "@/app/utils/cards";

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
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(true);
  const { user } = useAuth();

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const openSignUpLink = (link: string) => {
    Linking.openURL(link);
    setSignUpClicked(true);
  }  

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
                // onPress={toggleLike}
              />
            </View>
            <View style={CardStyles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
          </View>
          {/* Expanded Content */}
          { expanded && 
            <View style={CardStyles.signUpContainer}>
              { cardInfo.description && <Text style={{ marginTop: 20 }}>{cardInfo.description}</Text>}
              {/* Verify If User Signed-up */}
              { signUpClick &&
                <View style={CardStyles.confirmationContainer}>
                  <Text style={{color: '#3A5513'}}>Did you sign up for this event?</Text>
                  <View style={CardStyles.confirmationButtons}>
                    <Pressable style={CardStyles.confirmationButton} onPress={() => setSignUpClicked(false)}>
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
        </View>
      </Pressable>
    </View>
  );
}


