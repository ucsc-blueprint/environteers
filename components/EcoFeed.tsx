import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useState, useEffect} from "react";
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
// import { EventCardProps } from "./EventCard";

type OnlineEcoAction = {
  type: "online",
  id: string,
  created_at: string,
  cover_photo?: string,
  title: string,
  end_date?: Date,
  campaign_type?: string,
  email_link?: string,
  summary?: string,
}

type InPersonEcoAction = {
  type: "inperson",
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

type Event = {
  type: "event",
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

type VolunteerItem = OnlineEcoAction | InPersonEcoAction | Event

type HeaderProps = {
  resultsCount: number;
};

// HEADER HELPER FUNCTIONS
const renderIcon = (size: number ,iconName: string, color: string) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={iconName} fill={color} />
    </Svg>
  );
}

// ECO-FEED CARD HELPER FUNCTIONS
function formatEventDate(start: Date, end: Date) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Format day
  const day = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // Format time range
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: undefined,
  });
  const endTime = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: undefined,
  });

  return `${day} | ${startTime}–${endTime}`;
}

const renderCoverPhoto = (coverPhoto: string) => {
  return (
    <Image
      style={{ width: 110, height: 130, borderRadius: 10 }}
      source={{ uri: coverPhoto }}
    />
  );
}

// const renderDateOrTime = (props: EcoFeedProps) => {
//   if ("date" in props) {
//     return (
//       <View style={[styles.formatRow, styles.date]}>
//         <Image
//           source={require("../assets/images/google-calendar.png")}
//           style={{ width: 18, height: 18 }}
//         />
//         <Text>{props.date}</Text>
//       </View>
//   );
//   } else if (props.type.toLowerCase().includes("petition") || props.type.toLowerCase().includes("campaign")) {
//     return (
//       <View style={styles.formatRow}>
//         {renderIcon(mdiListBoxOutline, 'black')}
//         <Text>{props.type}</Text>
//         {props.time_taken ? <Text>| {props.time_taken}</Text> : null}
//       </View>
//     );
//   } else {
//     return null;
//   }
// }

// const renderLocation = (props: EcoFeedProps) => {
//   if ("location" in props) {
//     return (
//       <View style={styles.formatRow}>
//         <View><MaterialIcons name="location-on" size={18} color={'black'} /></View>
//         <Text style={styles.location} numberOfLines={2} ellipsizeMode="tail">{props.location}</Text>
//       </View>
//     );
//   } else {
//     return null;
//   }
// }



export const Header = ({ resultsCount }: HeaderProps) => {
  const { profile } = useAuth();
  return (
    <View style={styles.feedHeader}>
      {/* Navbar (Top)*/}
      <View style={styles.formatBetween}>
        {renderIcon(24, mdiMenu, 'black')}
        {renderIcon(24, mdiBell, 'black')}
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
        <Text style={styles.results}>{resultsCount} results</Text>
      </View>
    </View>
    );
};

export const EventCard = (props: Event) => {
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

  useEffect(() => {
    async function checkIfLiked() {
      if (!user?.id) {
        setLoadingLike(false);
        return;
      }

      const { data, error } = await supabase
        .from("interactions_events")
        .select("id")
        .eq("event_id", Number(props.id))
        .eq("user_id", user.id)
        .eq("interaction_type", "like")
        .maybeSingle();

      if (error) {
        console.log("Like check error:", error);
      }

      if (data) {
        setLiked(true);
      }

      setLoadingLike(false);
    }

    checkIfLiked();
  }, [user?.id, props.id]);
  // useEffect(() => {
  //   const checkIfLiked = async () => {
  //     const { data, error } = await supabase
  //       .from("interactions_events")
  //       .select("id")
  //       .eq("event_id", props.id)
  //       .eq("user_id", user?.id)
  //       .eq("interaction_type", "like")
  //       .maybeSingle();
  
  //     if (error) {
  //       console.log("Like check error:", error);
  //       return;
  //     }
  
  //     // 👇 THIS is the key line
  //     setLiked(!!data);
  //   };
  
  //   if (user) {
  //     checkIfLiked();
  //   }
  // }, [user, props.id]);

  async function toggleLike() {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to like.");
      return;
    }
  
    if (!liked) {
      // INSERT like
      const { error } = await supabase
        .from("interactions_events")
        .insert([
          {
            interaction_type: "like",
            event_id: Number(props.id),
            user_id: user.id,
          },
        ]);
  
      if (error) {
        console.log(error);
        Alert.alert("Error", "Could not like this event.");
        return;
      }
  
      setLiked(true);
    } else {
      // DELETE like (unlike)
      console.log("Attempting delete with:", {
        event_id: Number(props.id),
        user_id: user?.id,
        interaction_type: "like"
      });
      
      const { data, error } = await supabase
        .from("interactions_events")
        .delete()
        .eq("interaction_type", "like")
        .eq("event_id", Number(props.id))
        .eq("user_id", user.id)
        .select();

      console.log("Deleted rows:", data);

      if (error) {
        console.log(error);
        Alert.alert("Error", "Could not unlike this event.");
        return;
      }

      setLiked(false);
    }
  }

  async function addInteraction(props: Event, interaction: string) {
    const { data, error } = await supabase
      .from('interactions_events')
      .insert([{
        interaction_type: interaction,
        event_id: props.id,
        user_id: user?.id,
      }]);
      if (error) {
        // 23505 = unique constraint violation
        if (error.code === '23505') {
          Alert.alert(
            'Already Recorded',
            interaction === 'like'
              ? 'You have already liked this event.'
              : 'You have already signed up for this event.'
          );
        } else {
          console.log('Supabase error:', error);
          Alert.alert(
            'Error',
            'Something went wrong. Please try again.'
          );
        }
        return;
      }
      setSignUpClicked(false);
  }

  return (
    <View style={styles.card}>
      <Pressable onPress={toggleExpanded} style={{ flex: 1 }}>
        <View style={styles.cardInfo}>
          {/* Cover Photo */}
          <View style={styles.imageColumn}>
            { props.cover_photo ? renderCoverPhoto(props.cover_photo) : null }
          </View>
          {/* Main Content */}
          <View style={styles.contentColumn}>
            <Text>{props.title}</Text>
            { props.start_time && props.end_time &&
              <View style={[styles.formatRow, styles.date]}>
                <Image
                  source={require("../assets/images/google-calendar.png")}
                  style={{ width: 18, height: 18 }}
                />
                <Text>{formatEventDate(props.start_time, props.end_time)}</Text>
              </View>
            }
            { props.location &&
              <View style={styles.formatRow}>
                <MaterialIcons name="location-on" size={25} color={'black'} />
                <Text>{props.location}</Text>
              </View>
            }
          </View>
          {/* Like/Share Icons */}
          <View style={styles.iconsColumn}>
            <View style={styles.iconBackgrounds}>
              <MaterialCommunityIcons
                name={liked ? "cards-heart" : "cards-heart-outline"}
                size={25}
                color={'#0282D3'}
                onPress={toggleLike}
              />
            </View>
            <View style={styles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
          </View>
        </View>
        {/* Expanded Content */}
        { expanded && 
          <View style={styles.signUpContainer}>
            { props.description && <Text style={{ marginTop: 20 }}>{props.description}</Text>}
            {/* Verify If User Signed-up */}
            { signUpClick &&
              <View style={styles.confirmationContainer}>
                <Text style={{color: '#3A5513'}}>Did you sign up for this event?</Text>
                <View style={styles.confirmationButtons}>
                  <Pressable style={styles.confirmationButton} onPress={() => setSignUpClicked(false)}>
                    <Text style={styles.confirmationText}>No</Text>
                    <MaterialCommunityIcons name="close" size={20} color={'black'} />
                  </Pressable>
                  <Pressable style={styles.confirmationButton} onPress={() => addInteraction(props, 'signup')}>
                    <Text style={styles.confirmationText}>Yes</Text>
                    <MaterialCommunityIcons name="check" size={20} color={'black'} />
                  </Pressable>
                </View>
              </View>
            }
            {/* Sign Up Button */}
            { props.sign_up_link &&
              <View style={styles.signUpButtonContainer}>
                <Pressable style={[styles.signUpButton, styles.formatRow]} onPress={() => openSignUpLink(props.sign_up_link!)}> 
                  <Text style={styles.signUpText}>Sign Up</Text>
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

export const InPersonCard = (props: InPersonEcoAction) => {
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

  useEffect(() => {
    async function checkIfLiked() {
      if (!user?.id) {
        setLoadingLike(false);
        return;
      }

      const { data, error } = await supabase
        .from("interactions_eco_inperson")
        .select("id")
        .eq("action_id", Number(props.id))
        .eq("user_id", user.id)
        .eq("interaction_type", "like")
        .maybeSingle();

      if (error) {
        console.log("Like check error:", error);
      }

      if (data) {
        setLiked(true);
      }

      setLoadingLike(false);
    }

    checkIfLiked();
  }, [user?.id, props.id]);

  async function toggleLike() {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to like.");
      return;
    }
    //const eventId = Number(props.id);
  
    if (!liked) {
      // INSERT like
      const { error } = await supabase
        .from("interactions_eco_inperson")
        .insert([
          {
            interaction_type: "like",
            action_id: Number(props.id),
            user_id: user.id,
          },
        ]);
  
      if (error) {
        console.log(error);
        Alert.alert("Error", "Could not like this event.");
        return;
      }
  
      setLiked(true);
    } else {
      // DELETE like (unlike)
      console.log("Attempting delete with:", {
        event_id: Number(props.id),
        user_id: user?.id,
        interaction_type: "like"
      });
      
      const { data, error } = await supabase
        .from("interactions_eco_inperson")
        .delete()
        .eq("interaction_type", "like")
        .eq("action_id", Number(props.id))
        .eq("user_id", user.id)
        .select();

      console.log("Deleted rows:", data);

      if (error) {
        console.log(error);
        Alert.alert("Error", "Could not unlike this event.");
        return;
      }

      setLiked(false);
    }
  }

  async function addInteraction(props: InPersonEcoAction, interaction: string) {
    const { data, error } = await supabase
      .from('interactions_eco_inperson')
      .insert([{
        interaction_type: interaction,
        action_id: props.id,
        user_id: user?.id,
      }]);
    if (error) {
      // 23505 = unique constraint violation
      if (error.code === '23505') {
        Alert.alert(
          'Already Recorded',
          interaction === 'like'
            ? 'You have already liked this event.'
            : 'You have already signed up for this event.'
        );
      } else {
        console.log('Supabase error:', error);
        Alert.alert(
          'Error',
          'Something went wrong. Please try again.'
        );
      }
      return;
    }
    setSignUpClicked(false);
  }

  return (
    <View style={styles.card}>
      <Pressable onPress={toggleExpanded} style={{ flex: 1 }}>
        <View style={styles.cardInfo}>
          {/* Cover Photo */}
          <View style={styles.imageColumn}>
            { props.cover_photo ? renderCoverPhoto(props.cover_photo) : null }
          </View>
          {/* Main Content */}
          <View style={styles.contentColumn}>
            <Text>{props.title}</Text>
            { props.start_date && props.end_date &&
              <View style={[styles.formatRow, styles.date]}>
                <Image
                  source={require("../assets/images/google-calendar.png")}
                  style={{ width: 18, height: 18 }}
                />
                <Text>{formatEventDate(props.start_date, props.end_date)}</Text>
              </View>
            }
            { props.location &&
              <View style={styles.formatRow}>
                <MaterialIcons name="location-on" size={25} color={'black'} />
                <Text>{props.location}</Text>
              </View>
            }
          </View>
          {/* Like/Share Icons */}
          <View style={styles.iconsColumn}>
            <View style={styles.iconBackgrounds}>
            <MaterialCommunityIcons
                name={liked ? "cards-heart" : "cards-heart-outline"}
                size={25}
                color={'#0282D3'}
                onPress={toggleLike}
              />
            </View>
            <View style={styles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
          </View>
        </View>
        {/* Expanded Content */}
        { expanded && 
          <View style={styles.signUpContainer}>
            { props.summary && <Text style={{ marginTop: 20 }}>{props.summary}</Text>}
            {/* Verify If User Signed-up */}
            { signUpClick &&
              <View style={styles.confirmationContainer}>
                <Text style={{color: '#3A5513'}}>Did you sign up for this in person eco action?</Text>
                <View style={styles.confirmationButtons}>
                  <Pressable style={styles.confirmationButton} onPress={() => setSignUpClicked(false)}>
                    <Text style={styles.confirmationText}>No</Text>
                    <MaterialCommunityIcons name="close" size={20} color={'black'} />
                  </Pressable>
                  <Pressable style={styles.confirmationButton} onPress={() => addInteraction(props, 'signup')}>
                    <Text style={styles.confirmationText}>Yes</Text>
                    <MaterialCommunityIcons name="check" size={20} color={'black'} />
                  </Pressable>
                </View>
              </View>
            }
            {/* Sign Up Button */}
            { props.sign_up_link &&
              <View style={styles.signUpButtonContainer}>
                <Pressable style={[styles.signUpButton, styles.formatRow]} onPress={() => openSignUpLink(props.sign_up_link!)}> 
                  <Text style={styles.signUpText}>Sign Up</Text>
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


export const OnlineCard = (props: OnlineEcoAction) => {
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
  useEffect(() => {
    async function checkIfLiked() {
      if (!user?.id) {
        setLoadingLike(false);
        return;
      }

      const { data, error } = await supabase
        .from("interactions_eco_online")
        .select("id")
        .eq("action_id", Number(props.id))
        .eq("user_id", user.id)
        .eq("interaction_type", "like")
        .maybeSingle();

      if (error) {
        console.log("Like check error:", error);
      }

      if (data) {
        setLiked(true);
      }

      setLoadingLike(false);
    }

    checkIfLiked();
  }, [user?.id, props.id]);

  async function toggleLike() {
    if (!user?.id) {
      Alert.alert("Error", "You must be logged in to like.");
      return;
    }
    //const eventId = Number(props.id);
  
    if (!liked) {
      // INSERT like
      const { error } = await supabase
        .from("interactions_eco_online")
        .insert([
          {
            interaction_type: "like",
            action_id: Number(props.id),
            user_id: user.id,
          },
        ]);
  
      if (error) {
        console.log(error);
        Alert.alert("Error", "Could not like this event.");
        return;
      }
  
      setLiked(true);
    } else {
      // DELETE like (unlike)
      console.log("Attempting delete with:", {
        action_id: Number(props.id),
        user_id: user?.id,
        interaction_type: "like"
      });
      
      const { data, error } = await supabase
        .from("interactions_eco_online")
        .delete()
        .eq("interaction_type", "like")
        .eq("action_id", Number(props.id))
        .eq("user_id", user.id)
        .select();

      console.log("Deleted rows:", data);

      if (error) {
        console.log(error);
        Alert.alert("Error", "Could not unlike this event.");
        return;
      }

      setLiked(false);
    }
  }
  
  async function addInteraction(props: OnlineEcoAction, interaction: string) {
    console.log('here');
    const { data, error } = await supabase
      .from('interactions_eco_online')
      .insert([{
        interaction_type: interaction,
        action_id: props.id,
        user_id: user?.id,
      }]);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Alert.alert('Success');
      setSignUpClicked(false);
    }
  }

  // RENDER END DATE
  return (
    <View style={styles.card}>
      <Pressable onPress={toggleExpanded} style={{ flex: 1 }}>
        <View style={styles.cardInfo}>
          {/* Cover Photo */}
          <View style={styles.imageColumn}>
            { props.cover_photo ? renderCoverPhoto(props.cover_photo) : null }
          </View>
          {/* Main Content */}
          <View style={styles.contentColumn}>
            <Text>{props.title}</Text>
            {/* {endDate && <Text>{endDate}</Text>} */}
            <View style={styles.formatRow}>
              {renderIcon(24, mdiListBoxOutline, 'black')}
              {props.campaign_type && <Text>{props.campaign_type}</Text>}
            </View>
          </View>
          {/* Like/Share Icons */}
          <View style={styles.iconsColumn}>
            <View style={styles.iconBackgrounds}>
              <MaterialCommunityIcons
                  name={liked ? "cards-heart" : "cards-heart-outline"}
                  size={25}
                  color={'#0282D3'}
                  onPress={toggleLike}
                />
              </View>
            <View style={styles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
          </View>
        </View>
        {/* Expanded Content */}
        { expanded && 
          <View style={styles.signUpContainer}>
            <Text style={{ marginTop: 20 }}>{props.summary}</Text>
            {/* Verify If User Signed-up */}
            { signUpClick &&
              <View style={styles.confirmationContainer}>
                <Text style={{color: '#3A5513'}}>Did you complete this online eco action?</Text>
                <View style={styles.confirmationButtons}>
                  <Pressable style={styles.confirmationButton} onPress={() => setSignUpClicked(false)}>
                    <Text style={styles.confirmationText}>No</Text>
                    <MaterialCommunityIcons name="close" size={20} color={'black'} />
                  </Pressable>
                  <Pressable style={styles.confirmationButton} onPress={() => addInteraction(props, 'signup')}>
                    <Text style={styles.confirmationText}>Yes</Text>
                    <MaterialCommunityIcons name="check" size={20} color={'black'} />
                  </Pressable>
                </View>
              </View>
            }
            {/* Sign Up Button */}
            { props.email_link &&
              <View style={styles.signUpButtonContainer}>
                <Pressable style={[styles.signUpButton, styles.formatRow]} onPress={() => openSignUpLink(props.email_link!)}> 
                  <Text style={styles.signUpText}>Sign Up</Text>
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

export const EcoFeed = (props: VolunteerItem) => {
  switch (props.type) {
    case "event":
      return <EventCard {...props} />

    case "inperson":
      return <InPersonCard {...props} />

    case "online":
      return <OnlineCard {...props} />
    default:
      return null;
  }
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
    gap: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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

  signUpButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
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

  signUpPrompt: {
    color: '#0282D3',
    fontSize: 12,
  },

  signUpButtons: {
    flexDirection: 'row',
    gap: 10,
  },

  signUpButton: {
    backgroundColor: '#437CA1',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  signedUp: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
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

  confirmationContainer: {
    flexDirection: 'column',
    backgroundColor: '#F6FBF2',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
    paddingVertical: 5,
    gap: 10,
  },

  confirmationButtons: {
    flexDirection: 'row',
    paddingVertical: 5,
    gap: 20,
  },

  confirmationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#3A5513',
    borderWidth: 1,
    padding: 5,
    backgroundColor: 'white',
    paddingHorizontal: 25,
    borderRadius: 20,
    paddingVertical: 12,
    width: 150,
    justifyContent: 'center',
    gap: 5,

  },
  confirmationText: {
    fontSize: 15,
    color: '#3A5513',
  },

});