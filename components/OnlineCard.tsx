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
import { renderIcon, renderCoverPhoto, toggleLike } from "@/app/utils/cards";


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
  const [loadingLike, setLoadingLike] = useState(true);
  const { user } = useAuth();

  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };

  const openSignUpLink = (link: string) => {
    Linking.openURL(link);
    setSignUpClicked(true);
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
                onPress={() =>
                  toggleLike("interactions_eco_online", cardInfo.id, user.id, liked, 'action_id')
                }
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
            { signUpClick &&
              <View style={CardStyles.confirmationContainer}>
                <Text style={{color: '#3A5513'}}>Did you complete this online eco action?</Text>
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
            { cardInfo.email_link &&
              <View style={CardStyles.signUpButtonContainer}>
                <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(cardInfo.email_link!)}> 
                  <Text style={CardStyles.signUpText}>Sign Up</Text>
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


  // useEffect(() => {
  //   async function checkIfLiked() {
  //     if (!user?.id) {
  //       setLoadingLike(false);
  //       return;
  //     }

  //     const { data, error } = await supabase
  //       .from("interactions_eco_online")
  //       .select("id")
  //       .eq("action_id", Number(cardInfo.id))
  //       .eq("user_id", user.id)
  //       .eq("interaction_type", "like")
  //       .maybeSingle();

  //     if (error) {
  //       console.log("Like check error:", error);
  //     }

  //     if (data) {
  //       setLiked(true);
  //     }

  //     setLoadingLike(false);
  //   }

  //   checkIfLiked();
  // }, [user?.id, cardInfo.id]);

  // async function toggleLike() {
  //   if (!user?.id) {
  //     Alert.alert("Error", "You must be logged in to like.");
  //     return;
  //   }
  //   //const eventId = Number(cardInfo.id);
  
  //   if (!liked) {
  //     // INSERT like
  //     const { error } = await supabase
  //       .from("interactions_eco_online")
  //       .insert([
  //         {
  //           interaction_type: "like",
  //           action_id: Number(cardInfo.id),
  //           user_id: user.id,
  //         },
  //       ]);
  
  //     if (error) {
  //       console.log(error);
  //       Alert.alert("Error", "Could not like this event.");
  //       return;
  //     }
  
  //     setLiked(true);
  //   } else {
  //     // DELETE like (unlike)
  //     console.log("Attempting delete with:", {
  //       action_id: Number(cardInfo.id),
  //       user_id: user?.id,
  //       interaction_type: "like"
  //     });
      
  //     const { data, error } = await supabase
  //       .from("interactions_eco_online")
  //       .delete()
  //       .eq("interaction_type", "like")
  //       .eq("action_id", Number(cardInfo.id))
  //       .eq("user_id", user.id)
  //       .select();

  //     console.log("Deleted rows:", data);

  //     if (error) {
  //       console.log(error);
  //       Alert.alert("Error", "Could not unlike this event.");
  //       return;
  //     }

  //     setLiked(false);
  //   }
  // }
  
  // async function addInteraction(cardInfo: OnlineEcoAction, interaction: string) {
  //   console.log('here');
  //   const { data, error } = await supabase
  //     .from('interactions_eco_online')
  //     .insert([{
  //       interaction_type: interaction,
  //       action_id: cardInfo.id,
  //       user_id: user?.id,
  //     }]);
  //   if (error) {
  //     Alert.alert('Error', error.message);
  //   } else {
  //     // Alert.alert('Success');
  //     setSignUpClicked(false);
  //   }
  // }



// export const OnlineCard = (cardInfo: OnlineEcoAction) => {
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
//         .eq("action_id", Number(cardInfo.id))
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
//   }, [user?.id, cardInfo.id]);

//   async function toggleLike() {
//     if (!user?.id) {
//       Alert.alert("Error", "You must be logged in to like.");
//       return;
//     }
//     //const eventId = Number(cardInfo.id);
  
//     if (!liked) {
//       // INSERT like
//       const { error } = await supabase
//         .from("interactions_eco_online")
//         .insert([
//           {
//             interaction_type: "like",
//             action_id: Number(cardInfo.id),
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
//         action_id: Number(cardInfo.id),
//         user_id: user?.id,
//         interaction_type: "like"
//       });
      
//       const { data, error } = await supabase
//         .from("interactions_eco_online")
//         .delete()
//         .eq("interaction_type", "like")
//         .eq("action_id", Number(cardInfo.id))
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
  
//   async function addInteraction(cardInfo: OnlineEcoAction, interaction: string) {
//     console.log('here');
//     const { data, error } = await supabase
//       .from('interactions_eco_online')
//       .insert([{
//         interaction_type: interaction,
//         action_id: cardInfo.id,
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
//             { cardInfo.cover_photo ? renderCoverPhoto(cardInfo.cover_photo) : null }
//           </View>
//           {/* Main Content */}
//           <View style={CardStyles.contentColumn}>
//             <Text>{cardInfo.title}</Text>
//             {/* {endDate && <Text>{endDate}</Text>} */}
//             <View style={CardStyles.formatRow}>
//               {renderIcon(24, mdiListBoxOutline, 'black')}
//               {cardInfo.campaign_type && <Text>{cardInfo.campaign_type}</Text>}
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
//             <Text style={{ marginTop: 20 }}>{cardInfo.summary}</Text>
//             {/* Verify If User Signed-up */}
//             { signUpClick &&
//               <View style={CardStyles.confirmationContainer}>
//                 <Text style={{color: '#3A5513'}}>Did you complete this online eco action?</Text>
//                 <View style={CardStyles.confirmationButtons}>
//                   <Pressable style={CardStyles.confirmationButton} onPress={() => setSignUpClicked(false)}>
//                     <Text style={CardStyles.confirmationText}>No</Text>
//                     <MaterialCommunityIcons name="close" size={20} color={'black'} />
//                   </Pressable>
//                   <Pressable style={CardStyles.confirmationButton} onPress={() => addInteraction(cardInfo, 'signup')}>
//                     <Text style={CardStyles.confirmationText}>Yes</Text>
//                     <MaterialCommunityIcons name="check" size={20} color={'black'} />
//                   </Pressable>
//                 </View>
//               </View>
//             }
//             {/* Sign Up Button */}
//             { cardInfo.email_link &&
//               <View style={CardStyles.signUpButtonContainer}>
//                 <Pressable style={[CardStyles.signUpButton, CardStyles.formatRow]} onPress={() => openSignUpLink(cardInfo.email_link!)}> 
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
