/** Helper functions for Activity/Eco-Feed Cards */
import { Image, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { supabase } from "@/constants/supabase";


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

export async function addInteraction(
  tableName: string, 
  foreign_id: string, 
  user_id: string,
  liked: boolean,
  signed_up: boolean,
  completed: boolean,
  clicked: boolean,
){
  if (tableName === "interactions_events") {
    const { data, error } = await supabase
      .from(tableName)
      .insert([{
        event_id: foreign_id,
        user_id: user_id,
        liked: liked,
        signed_up: signed_up,
        completed: completed,
        clicked: clicked,
      }]);
    if (error) {
      console.log('error occured: ', error);
    }
    return;
  // Eco-action
  } else {
    const { data, error } = await supabase
      .from(tableName)
      .insert([{
        action_id: foreign_id,
        user_id: user_id,
        liked: liked,
        signed_up: signed_up,
        completed: completed,
        clicked: clicked,
      }]);
    if (error) {
      console.log('error occured: ', error);
    }
    return;
    // 23505 = unique constraint violation 
    // if (error && error.code === '23505') {
    //   Alert.alert(
    //     'Already Recorded',
    //     interaction === 'like'
    //       ? 'You have already liked this event.'
    //       : 'You have already signed up for this event.'
    //   );
    //   } else {
    //     console.log('Supabase error:', error);
    //     Alert.alert(
    //       'Error',
    //       'Something went wrong. Please try again.'
    //     );
  }
}