import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, StyleSheet, Pressable, Linking } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useState } from "react";
import { supabase } from "@/constants/supabase";
import { 
  mdiMenu,
  mdiBell,
  mdiListBoxOutline,
  mdiOpenInNew,
} from '@mdi/js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { MaterialIcons } from '@expo/vector-icons';


type EcoFeedProps = {
  event_id?: number;
  type: string;
  title: string;
  liked: boolean;
  cover_photo: string;
  description: string,
  sign_up_link: string, 
  date?: string;
  location?: string;
  spotsLeft?: number;
  time_taken?: string;
  onLearnMore?: () => void;
  onSignUp?: () => void;
};

type HeaderProps = {
  resultsCount: number;
};

// HEADER HELPER FUNCTIONS
const renderIcon = (iconName: string, color: string) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d={iconName} fill={color} />
    </Svg>
  );
}

// ECO-FEED CARD HELPER FUNCTIONS
const renderCoverPhoto = (coverPhoto: string) => {
  return (
    <Image
      style={{ width: 110, height: 130, borderRadius: 10 }}
      source={{ uri: coverPhoto }}
    />
  );
}

const renderDateOrTime = (props: EcoFeedProps) => {
  if ("date" in props) {
    return (
      <View style={[styles.formatRow, styles.date]}>
        <Image
          source={require("../assets/images/google-calendar.png")}
          style={{ width: 18, height: 18 }}
        />
        <Text>{props.date}</Text>
      </View>
  );
  } else if (props.type.toLowerCase().includes("petition") || props.type.toLowerCase().includes("campaign")) {
    return (
      <View style={styles.formatRow}>
        {renderIcon(mdiListBoxOutline, 'black')}
        <Text>{props.type}</Text>
        {props.time_taken ? <Text>| {props.time_taken}</Text> : null}
      </View>
    );
  } else {
    return null;
  }
}

const renderLocation = (props: EcoFeedProps) => {
  if ("location" in props) {
    return (
      <View style={styles.formatRow}>
        <View><MaterialIcons name="location-on" size={18} color={'black'} /></View>
        <Text style={styles.location} numberOfLines={2} ellipsizeMode="tail">{props.location}</Text>
      </View>
    );
  } else {
    return null;
  }
}

export const Header = ({ resultsCount }: HeaderProps) => {
  const { profile } = useAuth();

  return (
    <View style={styles.feedHeader}>
      {/* Navbar (Top)*/}
      <View style={styles.formatBetween}>
        {renderIcon(mdiMenu, 'black')}
        {renderIcon(mdiBell, 'black')}
      </View>
      <Text style={styles.userText}>Ready to take action 
        <Text style={ styles.userName}> {profile?.username}?</Text>
      </Text>
      {/* Searchbar */}
      <View>
        <Text style={[styles.searchFilter, styles.searchBar]}>Search for a keyword...</Text>
      </View>
      {/* Buttons */}
      <View style={styles.filters}>
        <Pressable style={styles.button} onPress={() => {}}><Text style={styles.buttonText}>Events</Text></Pressable>
        <Pressable style={styles.button} onPress={() => {}}><Text style={styles.buttonText}>Eco Actions: In-person</Text></Pressable>
        <Pressable style={styles.button} onPress={() => {}}><Text style={styles.buttonText}>Eco Actions: Online</Text></Pressable>
        {/* TO-DO: Dynamically show # of results */}
        <Text style={styles.results}>{resultsCount} results</Text>
      </View>
    </View>
    );
};

export const EcoFeed = (props: EcoFeedProps) => {
  const [expanded, setExpanded] = useState(false);
  const [signUpClicked, setShowSignupConfirm] = useState(false);

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const openSignUpLink = (link: string) => {
    Linking.openURL(link);
    setShowSignupConfirm(true);
  }

  /*const handleSignUp = () => {
    setSignUpClicked(false);
  }*/
    const handleSignUp = async () => {
      setShowSignupConfirm(false);
  
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user) return;
  
      const { error } = await supabase.from("user_analytics").insert({
        user_id: user.id,
        interaction_type: "signup",
        interaction_date: new Date().toISOString(),
        interaction_id: props.event_id ?? null,
      });
  
      if (error) {
        console.error("Failed to log signup analytics:", error);
      }
    };
  
    /* ❌ NO → just close popup */
    const handleDeclineSignup = () => {
      setShowSignupConfirm(false);
    };

  return (
    <Pressable
      onPress={toggleExpanded}
      style={({ pressed }) => [
        pressed && { opacity: 0.95 },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          {/* Cover Photo */}
          <View style={styles.imageColumn}>
            { props.cover_photo ? renderCoverPhoto(props.cover_photo) : null }
          </View>
          {/* Main Content */}
          <View style={styles.contentColumn}>
            <View>
              <Text numberOfLines={3} ellipsizeMode="tail" style={styles.title}>{props.title}</Text>
              { renderDateOrTime(props) }
            </View>
            { renderLocation (props) }        
          </View>
          {/* Like/Share Icons */}
          <View style={styles.iconsColumn}>
            <View style={styles.iconBackgrounds}><MaterialCommunityIcons name="cards-heart-outline" size={25} color={'#0282D3'} /></View>
            <View style={styles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
          </View>
        </View>
        {/* Expanded Card Content */}
        { expanded ?
          <>
            <Text>{props.description}</Text>
            <View style={styles.signUpContainer}>
            {/* Sign up confirmation popup */}
            { signUpClicked ? 
              <View style={styles.signUpPopup}>
                <Text style={styles.signUpPrompt}>Did you sign up through the external site?</Text>
                <View style={styles.signUpButtons}>
                  <Pressable
                    style={styles.signUpButton}
                    onPress={handleSignUp}   // YES → log to Supabase
                  >
                    <Text style={styles.signUpPrompt}>yes</Text>
                  </Pressable>

                  <Pressable
                    style={styles.signUpButton}
                    onPress={handleDeclineSignup}  // NO → just close popup
                  >
                    <Text style={styles.signUpPrompt}>no</Text>
                  </Pressable>
                </View>
              </View>
              : 
              <></>
            }
            <View style={styles.signedUp}>
              <Pressable style={styles.signUp} onPress={() => openSignUpLink(props.sign_up_link)}>
                <Text style={styles.signUpText}>Sign Up</Text>
                  <Svg width={20} height={20} viewBox="0 0 24 24">
                    <Path d={mdiOpenInNew} fill={'white'} />
                  </Svg>
              </Pressable>               
              </View>
            </View>
          </> : 

        <></>
        }
      </View>
  </Pressable>
  );
};


const styles = StyleSheet.create({
  feedHeader: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  userText: {
    fontSize: 38,
    paddingVertical: 20,
    marginLeft: 9,
    fontStyle: 'italic',
    fontWeight: '300',
  },

  userName: {
    fontWeight: '700', 
    color: '#79B128',
    fontStyle: 'normal',
  },

  results: {
    fontSize: 11,
    alignSelf: 'center',
    fontWeight: '400',
    paddingVertical: 1,
    color: '#3E4657',
  },

  formatRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    minWidth: 0,
  },

  formatBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 3,
    paddingVertical: 20,
    alignItems: 'center',
    textAlign: 'center',
  },

  searchFilter: {
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: 400,
    fontSize: 12,
  },

  buttonFilter: {
    borderColor: '#0282D3',
    color: '#0282D3',
    borderWidth: 1.5,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: 400,
    fontSize: 10,
  },

  buttonPressed: {
    backgroundColor: '#0282D3',
  },

  searchBar: {
    color: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#ECF3F7',
  },

  card: {
    borderRadius: 24,
    padding: 16,
    gap: 15,
    boxShadow: '0px 0px 10px 0px rgb(207, 207, 207)',
    backgroundColor: 'white',
  },

  cardInfo: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  imageColumn: {
    width: 110,
  },

  contentColumn: {
    minWidth: 0,
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },

  iconsColumn: {
    width: 40,
    flexShrink: 0,
    alignItems: 'center',
    gap: 8,
  },
  
  title: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    flexShrink: 1,
    color: '#0282D3',
  },

  date: {
    fontSize: 12,
    marginBottom: 6,
    flex: 1,
    flexWrap: 'wrap',
    marginVertical: 5,
  },

  location: {
    flexShrink: 1,
    minWidth: 0,
    textDecorationLine: 'underline',
  },

  iconBackgrounds: {
    backgroundColor: '#EAF2F6',
    width: 35,
    height: 35,
    borderRadius: 50,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },

  button: {
    borderWidth: 1,
    borderColor: '#0282D3',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },

  buttonText: {
    fontSize: 11,
    color: '#0282D3',
  },

  signUpContainer: {
    display: 'flex',
  },

  signUp: {
    backgroundColor: '#0282D3',
    color: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    width: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },

  signUpText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  signUpPopup: {
    backgroundColor: '#EAF2F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  
  signUpPrompt: {
    color: '#0282D3',
    fontSize: 12,
  },

  signUpButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  signUpButton: {
    color: '#0282D3',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  signedUp: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  }
});