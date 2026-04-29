/** Helper functions for Activity/Eco-Feed Cards */
import { Image, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { supabase } from "@/constants/supabase";
import { CardProps } from "@/app/(tabs)/volunteer";


/** UI Rendering/Text Formatting Functions */
export const renderIcon = (size: number ,iconName: string, color: string) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={iconName} fill={color} />
    </Svg>
  );
}

export const formatEventDate = (start: Date, end: Date) => {
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

export const renderCoverPhoto = (coverPhoto: string) => {
  return (
    <Image
      style={{ width: 110, height: 130, borderRadius: 10 }}
      source={{ uri: coverPhoto }}
    />
  );
}

// Adds/updates user's like to supabase (doesn't get rid of existing likes).
export async function toggleLike (
  tableName: string,
  foreign_id: string,
  user_id: string,
  alreadyLiked: boolean,
  foreign_field_name: string // Expected Values: "event_id" or "action_id"
) {
  // Add interaction if not liked
  const { data, error } = await supabase
    .from(tableName)
    .upsert([{
      [foreign_field_name]: foreign_id,
      user_id: user_id,
      liked: !alreadyLiked,
      liked_timestamp: !alreadyLiked ? new Date().toISOString() : null,
    }], {
    onConflict: `user_id,${foreign_field_name}`
  });
    
  if (error) {
    console.log(data);
    console.log(error);
    Alert.alert('Error. Something went wrong. Please try again');
  }
};

export async function addSignUp (
  tableName: string,
  foreign_id: string,
  user_id: string,
  foreign_field_name: string // Expected Values: "event_id" or "action_id"
) {
  const { data, error} = await supabase
    .from(tableName)
    .upsert([{
        [foreign_field_name]: foreign_id,
        user_id: user_id,
        signed_up: true,
        signed_up_timestamp: new Date().toISOString(),
      }],
      { onConflict: `${foreign_field_name},user_id`}
    );
    
    if (error) { 
      console.log(data);
      console.log(error);
      Alert.alert('Error. Something went wrong. Please try again');
    }
};


// export async function addCompletion (
//   tableName: string,
//   foreign_id: string,
//   user_id: string,
//   foreign_field_name: string // Expected Values: "event_id" or "action_id"
// ) {
//   const { data, error} = await supabase
//     .from(tableName)
//     .upsert([{
//         [foreign_field_name]: foreign_id,
//         user_id: user_id,
//         completed: true,
//         completed_timestamp: new Date().toISOString(),
//       }],
//       { onConflict: `${foreign_field_name},user_id`}
//     );
//     console.log('added?');
//     if (error) { 
//       console.log(data);
//       console.log(error);
//       Alert.alert('Error. Something went wrong. Please try again');
//     }
// };
export async function addCompletion (
  tableName: string,
  foreign_id: string,
  user_id: string,
  foreign_field_name: string,
  value: boolean | null
) {
  const { data, error } = await supabase
    .from(tableName)
    .upsert([
      {
        [foreign_field_name]: foreign_id,
        user_id: user_id,
        completed: value,
        completed_timestamp: value
          ? new Date().toISOString()
          : null,
      }
    ],
    { onConflict: `${foreign_field_name},user_id` }
  );

  console.log('added?');

  if (error) {
    console.log(data);
    console.log(error);
    Alert.alert('Error. Something went wrong. Please try again');
  }
};

// Tracks external link click
export async function addClick (
  tableName: string,
  foreign_id: string,
  user_id: string,
  foreign_field_name: string // Expected Values: "event_id" or "action_id"
) {
  const { data, error} = await supabase
    .from(tableName)
    .upsert([{
        [foreign_field_name]: foreign_id,
        user_id: user_id,
        clicked: true,
        clicked_timestamp: new Date().toISOString(),
      }],
      { onConflict: `${foreign_field_name},user_id`}
    );
    
    if (error) { 
      console.log(data);
      console.log(error);
      Alert.alert('Error. Something went wrong. Please try again');
    }
};

export const isPast = (date?: Date | string | null) => {
  if (!date) return false;

  return new Date(date).getTime() < Date.now();
};

export const isUpcoming = (date?: Date | string | null) => {
  if (!date) return true;

  return new Date(date).getTime() >= Date.now();
};

export const getVisibleEcoActions = (cards: CardProps[]) => {
  return cards.filter((card) => {
    const info = card.cardInfo as any;

    switch (card.cardType) {
      case "event":
      case "in_person":
        return isUpcoming(info.end_date);

      case "online":
        return !info.end_date || isUpcoming(info.end_date);

      default:
        return true;
    }
  });
};