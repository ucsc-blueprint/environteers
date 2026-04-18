import { createContext, useContext, useEffect, useState } from "react";
import { EventCardDataProps } from "@/components/EventCard";
import { InPersonCardProps } from "@/components/InPersonCard";
import { OnlineCardDataProps } from "@/components/OnlineCard";
import { useAuth } from "./AuthContext";
import { supabase } from "@/constants/supabase";

export type CardProps = InPersonCardProps | OnlineCardDataProps | EventCardDataProps;

const InteractionsContext = createContext<InteractionsContextType | null>(null);

type InteractionsContextType = {
  cards: CardProps[];
  loading: boolean;

  updateLike: (card: CardProps, liked: boolean) => void;
  updateSignUp: (card: CardProps, value: boolean | null) => void;
  updateCompleted: (card: CardProps, value: boolean | null) => void;
  updateClicked: (card: CardProps) => void;
};

export const InteractionsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!user?.id) return;

    setLoading(true);

    const [inPersonRes, onlineRes, eventRes] = await Promise.all([
      supabase.from("interactions_eco_inperson").select(`*, inperson_ecoactions(*)`).eq("user_id", user.id),
      supabase.from("interactions_eco_online").select(`*, online_ecoactions(*)`).eq("user_id", user.id),
      supabase.from("interactions_events").select(`*, events(*)`).eq("user_id", user.id),
    ]);

    const inPerson: CardProps[] = (inPersonRes.data ?? []).map(i => ({
      cardType: "in_person",
      cardInfo: i.inperson_ecoactions,
      liked: i.liked,
      signed_up: i.signed_up,
      completed: i.completed,
      clicked: i.clicked,
    }));

    const online: CardProps[] = (onlineRes.data ?? []).map(i => ({
      cardType: "online",
      cardInfo: i.online_ecoactions,
      liked: i.liked,
      completed: i.completed,
      clicked: i.clicked,
    }));

    const events: CardProps[] = (eventRes.data ?? []).map(i => ({
      cardType: "event",
      cardInfo: i.events,
      liked: i.liked,
      signed_up: i.signed_up,
      completed: i.completed,
      clicked: i.clicked,
    }));

    setCards([...inPerson, ...online, ...events]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const updateLike = (card: CardProps, liked: boolean) => {
    setCards(prev =>
      prev.map(c =>
        c.cardInfo.id === card.cardInfo.id &&
        c.cardType === card.cardType
          ? { ...c, liked }
          : c
      )
    );
  };

  const updateSignUp = (card: CardProps, value: boolean | null) => {
    setCards(prev =>
      prev.map(c =>
        c.cardInfo.id === card.cardInfo.id &&
        c.cardType === card.cardType
          ? { ...c, signed_up: value }
          : c
      )
    );
  };

  const updateCompleted = (card: CardProps, value: boolean | null) => {
    setCards(prev =>
      prev.map(c =>
        c.cardInfo.id === card.cardInfo.id &&
        c.cardType === card.cardType
          ? { ...c, completed: value }
          : c
      )
    );
  };

  const updateClicked = (card: CardProps) => {
    setCards(prev =>
      prev.map(c =>
        c.cardInfo.id === card.cardInfo.id &&
        c.cardType === card.cardType
          ? { ...c, clicked: true }
          : c
      )
    );
  };

  return (
    <InteractionsContext.Provider
      value={{
        cards,
        loading,
        updateLike,
        updateSignUp,
        updateCompleted,
        updateClicked,
      }}
    >
      {children}
    </InteractionsContext.Provider>
  );
};


export const useInteractions = () => {
  const context = useContext(InteractionsContext);
  if (!context) {
    throw new Error("useInteractions must be used within InteractionsProvider");
  }
  return context;
};
