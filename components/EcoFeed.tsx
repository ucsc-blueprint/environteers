import { useAuth } from "@/context/AuthContext";
import { View, Image, Text, Pressable, Linking, Alert } from 'react-native';
// CardStylesheet
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
import { InPersonCardData, InPersonCard } from "@/components/InPersonCard";
import { OnlineCardData, OnlineCard } from "@/components/OnlineCard";
import { EventCardData, EventCard } from "@/components/EventCard";
import { CardStyles } from "@/app/stylesheets/CardStyles";
import { renderIcon } from "@/app/utils/cards";

type InPersonCardProps = {
  cardType: "in_person";
  cardInfo: InPersonCardData;
  liked: boolean;
  signed_up: boolean;
  completed: boolean;
  clicked: boolean;
}

type OnlineCardProps = {
  cardType: "online";
  cardInfo: OnlineCardData;
  liked: boolean;
  signed_up: boolean;
  completed: boolean;
  clicked: boolean;
}

type EventCardProps = {
  cardType: "event";
  cardInfo: EventCardData;
  liked: boolean;
  signed_up: boolean;
  completed: boolean;
  clicked: boolean;
}

type CardProps = InPersonCardProps | OnlineCardProps | EventCardProps;

type HeaderProps = {
  resultsCount: number,
}

export const Header = ({resultsCount}: HeaderProps) => {
  const { profile } = useAuth();
  return (
    <View style={CardStyles.feedHeader}>
      {/* Navbar (Top)*/}
      <View style={CardStyles.formatBetween}>
        {renderIcon(24, mdiMenu, 'black')}
        {renderIcon(24, mdiBell, 'black')}
      </View>
      <Text style={CardStyles.userText}>Ready to take action 
        <Text style={ CardStyles.userName}> {profile?.first_name} {profile?.last_name}?</Text>
      </Text>
      {/* Searchbar */}
      <View>
        <Text style={[CardStyles.searchFilter, CardStyles.searchBar]}>Search for a keyword...</Text>
      </View>
      {/* Buttons */}
      <View style={CardStyles.filters}>
        <Pressable style={CardStyles.button} onPress={() => {}}><Text style={CardStyles.buttonText}>Events</Text></Pressable>
        <Pressable style={CardStyles.button} onPress={() => {}}><Text style={CardStyles.buttonText}>Eco Actions: In-person</Text></Pressable>
        <Pressable style={CardStyles.button} onPress={() => {}}><Text style={CardStyles.buttonText}>Eco Actions: Online</Text></Pressable>
        <Text style={CardStyles.results}>{resultsCount} results</Text>
      </View>
    </View>
    );
};

export const EcoFeed = (card: CardProps) => {
  switch (card.cardType) {
    case "in_person":
      return (
        <InPersonCard 
          {...card} 
          liked={card.liked} 
          signed_up={card.signed_up} 
          completed={card.completed} 
          clicked={card.clicked}
        />
      );
    case "online":
      return (
        <OnlineCard 
          {...card} 
          liked={card.liked} 
          completed={card.completed} 
          clicked={card.clicked}
        />
      );
    case "event":
      return (
        <EventCard 
          {...card} 
          liked={card.liked} 
          signed_up={card.signed_up} 
          completed={card.completed} 
          clicked={card.clicked}
        />
      );
    default:
      return null;
  }
};


// // HEADER HELPER FUNCTIONS
// const renderIcon = (size: number ,iconName: string, color: string) => {
//   return (
//     <Svg width={size} height={size} viewBox="0 0 24 24">
//       <Path d={iconName} fill={color} />
//     </Svg>
//   );
// }

// // ECO-FEED CARD HELPER FUNCTIONS
// function formatEventDate(start: Date, end: Date) {
//   const startDate = new Date(start);
//   const endDate = new Date(end);

//   // Format day
//   const day = startDate.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//   });

//   // Format time range
//   const startTime = startDate.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: undefined,
//   });
//   const endTime = endDate.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: undefined,
//   });

//   return `${day} | ${startTime}–${endTime}`;
// }

// const renderCoverPhoto = (coverPhoto: string) => {
//   return (
//     <Image
//       style={{ width: 110, height: 130, borderRadius: 10 }}
//       source={{ uri: coverPhoto }}
//     />
//   );
// }

// export const Header = ({ resultsCount }: HeaderProps) => {
//   const { profile } = useAuth();
//   return (
//     <View style={CardStyles.feedHeader}>
//       {/* Navbar (Top)*/}
//       <View style={CardStyles.formatBetween}>
//         {renderIcon(24, mdiMenu, 'black')}
//         {renderIcon(24, mdiBell, 'black')}
//       </View>
//       <Text style={CardStyles.userText}>Ready to take action 
//         <Text style={ CardStyles.userName}> {profile?.username}?</Text>
//       </Text>
//       {/* Searchbar */}
//       <View>
//         <Text style={[CardStyles.searchFilter, CardStyles.searchBar]}>Search for a keyword...</Text>
//       </View>
//       {/* Buttons */}
//       <View style={CardStyles.filters}>
//         <Pressable style={CardStyles.button} onPress={() => {}}><Text style={CardStyles.buttonText}>Events</Text></Pressable>
//         <Pressable style={CardStyles.button} onPress={() => {}}><Text style={CardStyles.buttonText}>Eco Actions: In-person</Text></Pressable>
//         <Pressable style={CardStyles.button} onPress={() => {}}><Text style={CardStyles.buttonText}>Eco Actions: Online</Text></Pressable>
//         <Text style={CardStyles.results}>{resultsCount} results</Text>
//       </View>
//     </View>
//     );
// };

// export const EventCard = (props: Event) => {
//   const [expanded, setExpanded] = useState(false);
//   const [signUpClick, setSignUpClicked] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const [loadingLike, setLoadingLike] = useState(true);
//   const { user } = useAuth();

//   const toggleExpanded = () => {
//     setExpanded(prev => !prev);
//   };

//   const openSignUpLink = (link: string) => {
//     Linking.openURL(link);
//     setSignUpClicked(true);
//   }  

//   useEffect(() => {
//     async function checkIfLiked() {
//       if (!user?.id) {
//         setLoadingLike(false);
//         return;
//       }

//       const { data, error } = await supabase
//         .from("interactions_events")
//         .select("id")
//         .eq("event_id", Number(props.id))
//         .eq("user_id", user.id)
//         .eq("interaction_type", "like")
//         .maybeSingle();

//       if (error) {
//         console.log("Like check error:", error);
//       }

//       if (data) {
//         setLiked(true);
//       }

//       setLoadingLike(false);
//     }

//     checkIfLiked();
//   }, [user?.id, props.id]);
//   // useEffect(() => {
//   //   const checkIfLiked = async () => {
//   //     const { data, error } = await supabase
//   //       .from("interactions_events")
//   //       .select("id")
//   //       .eq("event_id", props.id)
//   //       .eq("user_id", user?.id)
//   //       .eq("interaction_type", "like")
//   //       .maybeSingle();
  
//   //     if (error) {
//   //       console.log("Like check error:", error);
//   //       return;
//   //     }
  
//   //     // 👇 THIS is the key line
//   //     setLiked(!!data);
//   //   };
  
//   //   if (user) {
//   //     checkIfLiked();
//   //   }
//   // }, [user, props.id]);

//   async function toggleLike() {
//     if (!user?.id) {
//       Alert.alert("Error", "You must be logged in to like.");
//       return;
//     }
  
//     if (!liked) {
//       // INSERT like
//       const { error } = await supabase
//         .from("interactions_events")
//         .insert([
//           {
//             interaction_type: "like",
//             event_id: Number(props.id),
//             user_id: user.id,
//             liked: true,
//           },
//         ]);
  
//       if (error) {
//         console.log(error);
//         Alert.alert("Error", "Could not like this event.");
//         return;
//       }
  
//       setLiked(true);
//     } else {
//       // DELETE like (unlike)
//       console.log("Attempting delete with:", {
//         event_id: Number(props.id),
//         user_id: user?.id,
//         interaction_type: "like"
//       });
      
//       const { data, error } = await supabase
//         .from("interactions_events")
//         .delete()
//         .eq("interaction_type", "like")
//         .eq("event_id", Number(props.id))
//         .eq("user_id", user.id)
//         .select();

//       console.log("Deleted rows:", data);

//       if (error) {
//         console.log(error);
//         Alert.alert("Error", "Could not unlike this event.");
//         return;
//       }

//       setLiked(false);
//     }
//   }

//   async function addInteraction(props: Event, interaction: string) {
//     const { data, error } = await supabase
//       .from('interactions_events')
//       .insert([{
//         interaction_type: interaction,
//         event_id: props.id,
//         user_id: user?.id,
//       }]);
//       if (error) {
//         // 23505 = unique constraint violation
//         if (error.code === '23505') {
//           Alert.alert(
//             'Already Recorded',
//             interaction === 'like'
//               ? 'You have already liked this event.'
//               : 'You have already signed up for this event.'
//           );
//         } else {
//           console.log('Supabase error:', error);
//           Alert.alert(
//             'Error',
//             'Something went wrong. Please try again.'
//           );
//         }
//         return;
//       }
//       setSignUpClicked(false);
//   }

//   return (
//     <View style={CardStyles.card}>
//       <Pressable onPress={toggleExpanded} style={{ flex: 1 }}>
//         <View style={CardStyles.cardInfo}>
//           {/* Cover Photo */}
//           <View style={CardStyles.imageColumn}>
//             { props.cover_photo ? renderCoverPhoto(props.cover_photo) : null }
//           </View>
//           {/* Main Content */}
//           <View style={CardStyles.contentColumn}>
//             <Text>{props.title}</Text>
//             { props.start_time && props.end_time &&
//               <View style={[CardStyles.formatRow, CardStyles.date]}>
//                 <Image
//                   source={require("../assets/images/google-calendar.png")}
//                   style={{ width: 18, height: 18 }}
//                 />
//                 <Text>{formatEventDate(props.start_time, props.end_time)}</Text>
//               </View>
//             }
//             { props.location &&
//               <View style={CardStyles.formatRow}>
//                 <MaterialIcons name="location-on" size={25} color={'black'} />
//                 <Text>{props.location}</Text>
//               </View>
//             }
//           </View>
//           {/* Like/Share Icons */}
//           <View style={CardStyles.iconsColumn}>
//             <View style={CardStyles.iconBackgrounds}>
//               <MaterialCommunityIcons
//                 name={liked ? "cards-heart" : "cards-heart-outline"}
//                 size={25}
//                 color={'#0282D3'}
//                 onPress={toggleLike}
//               />
//             </View>
//             <View style={CardStyles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
//           </View>
//         </View>
//         {/* Expanded Content */}
//         { expanded && 
//           <View style={CardStyles.signUpContainer}>
//             { props.description && <Text style={{ marginTop: 20 }}>{props.description}</Text>}
//             {/* Verify If User Signed-up */}
//             { signUpClick &&
//               <View style={CardStyles.confirmationContainer}>
//                 <Text style={{color: '#3A5513'}}>Did you sign up for this event?</Text>
//                 <View style={CardStyles.confirmationButtons}>
//                   <Pressable style={CardStyles.confirmationButton} onPress={() => setSignUpClicked(false)}>
//                     <Text style={CardStyles.confirmationText}>No</Text>
//                     <MaterialCommunityIcons name="close" size={20} color={'black'} />
//                   </Pressable>
//                   <Pressable style={CardStyles.confirmationButton} onPress={() => addInteraction(props, 'signup')}>
//                     <Text style={CardStyles.confirmationText}>Yes</Text>
//                     <MaterialCommunityIcons name="check" size={20} color={'black'} />
//                   </Pressable>
//                 </View>
//               </View>
//             }
//             {/* Sign Up Button */}
//             { props.sign_up_link &&
//               <View style={CardStyles.signUpButtonContainer}>
//                 <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(props.sign_up_link!)}> 
//                   <Text style={CardStyles.signUpText}>Sign Up</Text>
//                   {renderIcon(15, mdiOpenInNew, 'white')}
//                 </Pressable>
//               </View>
//             }
//           </View>
//           }
//         </Pressable>
//     </View>
//   );
// }

// export const InPersonCard = (props: InPersonEcoAction) => {
//   const [expanded, setExpanded] = useState(false);
//   const [signUpClick, setSignUpClicked] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const [loadingLike, setLoadingLike] = useState(true);
//   const { user } = useAuth();

//   const toggleExpanded = () => {
//     setExpanded(prev => !prev);
//   };

//   const openSignUpLink = (link: string) => {
//     Linking.openURL(link);
//     setSignUpClicked(true);
//   }  

//   useEffect(() => {
//     async function checkIfLiked() {
//       if (!user?.id) {
//         setLoadingLike(false);
//         return;
//       }

//       const { data, error } = await supabase
//         .from("interactions_eco_inperson")
//         .select("id")
//         .eq("action_id", Number(props.id))
//         .eq("user_id", user.id)
//         .eq("interaction_type", "like")
//         .maybeSingle();

//       if (error) {
//         console.log("Like check error:", error);
//       }

//       if (data) {
//         setLiked(true);
//       }

//       setLoadingLike(false);
//     }

//     checkIfLiked();
//   }, [user?.id, props.id]);

//   async function toggleLike() {
//     if (!user?.id) {
//       Alert.alert("Error", "You must be logged in to like.");
//       return;
//     }
//     //const eventId = Number(props.id);
  
//     if (!liked) {
//       // INSERT like
//       const { error } = await supabase
//         .from("interactions_eco_inperson")
//         .insert([
//           {
//             interaction_type: "like",
//             action_id: Number(props.id),
//             user_id: user.id,
//           },
//         ]);
  
//       if (error) {
//         console.log(error);
//         Alert.alert("Error", "Could not like this event.");
//         return;
//       }
  
//       setLiked(true);
//     } else {
//       // DELETE like (unlike)
//       console.log("Attempting delete with:", {
//         event_id: Number(props.id),
//         user_id: user?.id,
//         interaction_type: "like"
//       });
      
//       const { data, error } = await supabase
//         .from("interactions_eco_inperson")
//         .delete()
//         .eq("interaction_type", "like")
//         .eq("action_id", Number(props.id))
//         .eq("user_id", user.id)
//         .select();

//       console.log("Deleted rows:", data);

//       if (error) {
//         console.log(error);
//         Alert.alert("Error", "Could not unlike this event.");
//         return;
//       }

//       setLiked(false);
//     }
//   }

//   async function addInteraction(props: InPersonEcoAction, interaction: string) {
//     const { data, error } = await supabase
//       .from('interactions_eco_inperson')
//       .insert([{
//         interaction_type: interaction,
//         action_id: props.id,
//         user_id: user?.id,
//       }]);
//     if (error) {
//       // 23505 = unique constraint violation
//       if (error.code === '23505') {
//         Alert.alert(
//           'Already Recorded',
//           interaction === 'like'
//             ? 'You have already liked this event.'
//             : 'You have already signed up for this event.'
//         );
//       } else {
//         console.log('Supabase error:', error);
//         Alert.alert(
//           'Error',
//           'Something went wrong. Please try again.'
//         );
//       }
//       return;
//     }
//     setSignUpClicked(false);
//   }

//   return (
//     <View style={CardStyles.card}>
//       <Pressable onPress={toggleExpanded} style={{ flex: 1 }}>
//         <View style={CardStyles.cardInfo}>
//           {/* Cover Photo */}
//           <View style={CardStyles.imageColumn}>
//             { props.cover_photo ? renderCoverPhoto(props.cover_photo) : null }
//           </View>
//           {/* Main Content */}
//           <View style={CardStyles.contentColumn}>
//             <Text>{props.title}</Text>
//             { props.start_date && props.end_date &&
//               <View style={[CardStyles.formatRow, CardStyles.date]}>
//                 <Image
//                   source={require("../assets/images/google-calendar.png")}
//                   style={{ width: 18, height: 18 }}
//                 />
//                 <Text>{formatEventDate(props.start_date, props.end_date)}</Text>
//               </View>
//             }
//             { props.location &&
//               <View style={CardStyles.formatRow}>
//                 <MaterialIcons name="location-on" size={25} color={'black'} />
//                 <Text>{props.location}</Text>
//               </View>
//             }
//           </View>
//           {/* Like/Share Icons */}
//           <View style={CardStyles.iconsColumn}>
//             <View style={CardStyles.iconBackgrounds}>
//             <MaterialCommunityIcons
//                 name={liked ? "cards-heart" : "cards-heart-outline"}
//                 size={25}
//                 color={'#0282D3'}
//                 onPress={toggleLike}
//               />
//             </View>
//             <View style={CardStyles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
//           </View>
//         </View>
//         {/* Expanded Content */}
//         { expanded && 
//           <View style={CardStyles.signUpContainer}>
//             { props.summary && <Text style={{ marginTop: 20 }}>{props.summary}</Text>}
//             {/* Verify If User Signed-up */}
//             { signUpClick &&
//               <View style={CardStyles.confirmationContainer}>
//                 <Text style={{color: '#3A5513'}}>Did you sign up for this in person eco action?</Text>
//                 <View style={CardStyles.confirmationButtons}>
//                   <Pressable style={CardStyles.confirmationButton} onPress={() => setSignUpClicked(false)}>
//                     <Text style={CardStyles.confirmationText}>No</Text>
//                     <MaterialCommunityIcons name="close" size={20} color={'black'} />
//                   </Pressable>
//                   <Pressable style={CardStyles.confirmationButton} onPress={() => addInteraction(props, 'signup')}>
//                     <Text style={CardStyles.confirmationText}>Yes</Text>
//                     <MaterialCommunityIcons name="check" size={20} color={'black'} />
//                   </Pressable>
//                 </View>
//               </View>
//             }
//             {/* Sign Up Button */}
//             { props.sign_up_link &&
//               <View style={CardStyles.signUpButtonContainer}>
//                 <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(props.sign_up_link!)}> 
//                   <Text style={CardStyles.signUpText}>Sign Up</Text>
//                   {renderIcon(15, mdiOpenInNew, 'white')}
//                 </Pressable>
//               </View>
//             }
//           </View>
//           }
//         </Pressable>
//     </View>
//   );
// }


// export const OnlineCard = (props: OnlineEcoAction) => {
//   const [expanded, setExpanded] = useState(false);
//   const [signUpClick, setSignUpClicked] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const [loadingLike, setLoadingLike] = useState(true);
//   const { user } = useAuth();

//   const toggleExpanded = () => {
//     setExpanded(prev => !prev);
//   };

//   const openSignUpLink = (link: string) => {
//     Linking.openURL(link);
//     setSignUpClicked(true);
//   }
//   useEffect(() => {
//     async function checkIfLiked() {
//       if (!user?.id) {
//         setLoadingLike(false);
//         return;
//       }

//       const { data, error } = await supabase
//         .from("interactions_eco_online")
//         .select("id")
//         .eq("action_id", Number(props.id))
//         .eq("user_id", user.id)
//         .eq("interaction_type", "like")
//         .maybeSingle();

//       if (error) {
//         console.log("Like check error:", error);
//       }

//       if (data) {
//         setLiked(true);
//       }

//       setLoadingLike(false);
//     }

//     checkIfLiked();
//   }, [user?.id, props.id]);

//   async function toggleLike() {
//     if (!user?.id) {
//       Alert.alert("Error", "You must be logged in to like.");
//       return;
//     }
//     //const eventId = Number(props.id);
  
//     if (!liked) {
//       // INSERT like
//       const { error } = await supabase
//         .from("interactions_eco_online")
//         .insert([
//           {
//             interaction_type: "like",
//             action_id: Number(props.id),
//             user_id: user.id,
//           },
//         ]);
  
//       if (error) {
//         console.log(error);
//         Alert.alert("Error", "Could not like this event.");
//         return;
//       }
  
//       setLiked(true);
//     } else {
//       // DELETE like (unlike)
//       console.log("Attempting delete with:", {
//         action_id: Number(props.id),
//         user_id: user?.id,
//         interaction_type: "like"
//       });
      
//       const { data, error } = await supabase
//         .from("interactions_eco_online")
//         .delete()
//         .eq("interaction_type", "like")
//         .eq("action_id", Number(props.id))
//         .eq("user_id", user.id)
//         .select();

//       console.log("Deleted rows:", data);

//       if (error) {
//         console.log(error);
//         Alert.alert("Error", "Could not unlike this event.");
//         return;
//       }

//       setLiked(false);
//     }
//   }
  
//   async function addInteraction(props: OnlineEcoAction, interaction: string) {
//     console.log('here');
//     const { data, error } = await supabase
//       .from('interactions_eco_online')
//       .insert([{
//         interaction_type: interaction,
//         action_id: props.id,
//         user_id: user?.id,
//       }]);
//     if (error) {
//       Alert.alert('Error', error.message);
//     } else {
//       // Alert.alert('Success');
//       setSignUpClicked(false);
//     }
//   }

//   // RENDER END DATE
//   return (
//     <View style={CardStyles.card}>
//       <Pressable onPress={toggleExpanded} style={{ flex: 1 }}>
//         <View style={CardStyles.cardInfo}>
//           {/* Cover Photo */}
//           <View style={CardStyles.imageColumn}>
//             { props.cover_photo ? renderCoverPhoto(props.cover_photo) : null }
//           </View>
//           {/* Main Content */}
//           <View style={CardStyles.contentColumn}>
//             <Text>{props.title}</Text>
//             {/* {endDate && <Text>{endDate}</Text>} */}
//             <View style={CardStyles.formatRow}>
//               {renderIcon(24, mdiListBoxOutline, 'black')}
//               {props.campaign_type && <Text>{props.campaign_type}</Text>}
//             </View>
//           </View>
//           {/* Like/Share Icons */}
//           <View style={CardStyles.iconsColumn}>
//             <View style={CardStyles.iconBackgrounds}>
//               <MaterialCommunityIcons
//                   name={liked ? "cards-heart" : "cards-heart-outline"}
//                   size={25}
//                   color={'#0282D3'}
//                   onPress={toggleLike}
//                 />
//               </View>
//             <View style={CardStyles.iconBackgrounds}><MaterialIcons name="ios-share" size={25} color={'#0282D3'} /></View>
//           </View>
//         </View>
//         {/* Expanded Content */}
//         { expanded && 
//           <View style={CardStyles.signUpContainer}>
//             <Text style={{ marginTop: 20 }}>{props.summary}</Text>
//             {/* Verify If User Signed-up */}
//             { signUpClick &&
//               <View style={CardStyles.confirmationContainer}>
//                 <Text style={{color: '#3A5513'}}>Did you complete this online eco action?</Text>
//                 <View style={CardStyles.confirmationButtons}>
//                   <Pressable style={CardStyles.confirmationButton} onPress={() => setSignUpClicked(false)}>
//                     <Text style={CardStyles.confirmationText}>No</Text>
//                     <MaterialCommunityIcons name="close" size={20} color={'black'} />
//                   </Pressable>
//                   <Pressable style={CardStyles.confirmationButton} onPress={() => addInteraction(props, 'signup')}>
//                     <Text style={CardStyles.confirmationText}>Yes</Text>
//                     <MaterialCommunityIcons name="check" size={20} color={'black'} />
//                   </Pressable>
//                 </View>
//               </View>
//             }
//             {/* Sign Up Button */}
//             { props.email_link &&
//               <View style={CardStyles.signUpButtonContainer}>
//                 <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(props.email_link!)}> 
//                   <Text style={CardStyles.signUpText}>Sign Up</Text>
//                   {renderIcon(15, mdiOpenInNew, 'white')}
//                 </Pressable>
//               </View>
//             }
//           </View>
//           }
//         </Pressable>
//     </View>
//   );
// }