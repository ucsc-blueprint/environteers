import { View, Text } from "react-native";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";
import { InPersonCard } from "@/components/InPersonCard";

type UserInteraction = {
  id: string;
  created_at: string;
  user_id: string;
  action_id: string;
  liked: string;
  signedUp: string;
}

type InPersonCardData = {
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

type InPersonCardProps = {
  cardInfo: InPersonCardData,
  liked: Boolean,
  signedUp: Boolean,
}

export default function Activity() {
  const { profile, user } = useAuth()
  const [inPersonUserInteractions, setInPersonUserInteractions] = useState<UserInteraction[]>([]);
  const [likedCards, setLikedCards] = useState<InPersonCardProps[]>([]);
  const [signedUpCards, setSignedUpCards] = useState<InPersonCardProps[]>([]);

  useEffect(() => {
    const fetchInPersonInteractions = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("test_interactions")
        .select(`
          liked,
          signed_up,
          inperson_eco-actions(*)
        `)
        .eq("user_id", user.id);

      if (error || !data) {
        setLikedCards([]);
        setSignedUpCards([]);
        return;
      }

      const fullCardData: InPersonCardProps[] = data.map(interaction => ({
        cardInfo: interaction["inperson_eco-actions"],
        liked: interaction.liked,
        signedUp: interaction.signed_up,
      }));
      console.log('FULL CARD DATA: ', fullCardData);
      setLikedCards(fullCardData.filter(card => card.liked));
      setSignedUpCards(fullCardData.filter(card => card.signedUp));

      // const { data: interactions, error } = await supabase
      //   .from("test_interactions")
      //   .select("*")
      //   .eq("user_id", user?.id);

      // if (error || !interactions?.length) {
      //   setLikedCards([]);
      //   setSignedUpCards([]);
      //   return;
      // }

      // const cardIds = interactions.map(i => i.action_id);
      // const { data: cards, error: cardError } = await supabase
      //   .from("inperson_eco-actions")
      //   .select("*")
      //   .in("id", cardIds);

      // if (cardError || !cards) return;

      // const cardMap = new Map(
      //   cards.map(card => [card.id, card])
      // );

      // const fullCardData: InPersonCardProps[] = interactions
      //   .map(interaction => {
      //     const card = cardMap.get(interaction.action_id);
      //     if (!card) return null;

      //     return {
      //       cardInfo: {...card},
      //       liked: interaction.liked,
      //       signedUp: interaction.signed_up,
      //     };
      //   })
      //   .filter(Boolean) as InPersonCardProps[];

      // // 6️⃣ Split into two lists
      // setLikedCards(fullCardData.filter(card => card.liked));
      // setSignedUpCards(fullCardData.filter(card => card.signedUp));
      // console.log(fullCardData.filter(card => card.liked));
      // console.log(fullCardData.filter(card => card.signedUp));
      // console.log(fullCardData);
    };

    fetchInPersonInteractions();
  }, [user?.id]);

  return (
    <View>
      <Text>Activity</Text>
      <Text>Activity</Text>
      <Text>Activity</Text>
      <Text>Requires Action</Text>
      <Text>Upcoming</Text>
      <Text>Past Activity</Text>
      <Text>Likes:</Text>
      <Text>Likes:</Text>
      {likedCards?.map(card => (
        <InPersonCard key={card.cardInfo.id} cardInfo={card.cardInfo} liked={card.liked} signedUp={card.signedUp} />
      ))}

      <Text>Signed Up:</Text>
      {signedUpCards?.map(card => (
        <InPersonCard key={card.cardInfo.id} cardInfo={card.cardInfo} liked={card.liked} signedUp={card.signedUp} />
      ))}     
    <LogoutButton/>
    </View>
  );
}
