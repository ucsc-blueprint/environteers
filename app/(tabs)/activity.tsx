import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import { EcoFeed } from "@/components/EcoFeed";
import { CardProps, useInteractions } from "@/context/InteractionsContext";
import { SlidersHorizontal } from "lucide-react-native";
import * as Location from "expo-location";
import { EcoFeedFilterDropdown } from "@/components/EcoFeedFilterDropdown";

export default function Activity() {
  const { cards, loading } = useInteractions();

  const [selectedFilter, setSelectedFilter] = useState<
    "signups" | "favorites"
  >("signups");

  // FILTER STATE (same as volunteer.tsx)
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const now = new Date();

  // 📍 Get user location
  useEffect(() => {
    const getLocation = async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getLocation();
  }, []);

  // 📏 Distance helper
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 3958.8;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 📅 Helper for dates
  const getCardDate = (card: CardProps) => {
    if (!card?.cardInfo) return null;

    if (
      (card.cardType === "event" || card.cardType === "in_person") &&
      card.cardInfo.start_date
    ) {
      return new Date(card.cardInfo.start_date);
    }

    return null;
  };

  // 🔍 FILTERED CARDS (core fix)
  const filteredCards = cards.filter((card) => {
    const matchesType =
      filterTypes.length === 0 || filterTypes.includes(card.cardType);

    const matchesDistance = (() => {
      if (!maxDistance || !userLocation || card.cardType === "online")
        return true;

      const lat = (card.cardInfo as any).location_latitude;
      const lon = (card.cardInfo as any).location_longitude;

      if (!lat || !lon) return true;

      return (
        getDistance(
          userLocation.latitude,
          userLocation.longitude,
          lat,
          lon
        ) <= maxDistance
      );
    })();

    return matchesType && matchesDistance;
  });

  // 📦 Derived sections FROM filtered cards
  const likedCards = filteredCards.filter((c) => c.liked === true);

  const completedCards = filteredCards.filter(
    (c) => c.completed === true
  );

  const upcomingCards = filteredCards.filter((card) => {
    const date = getCardDate(card);
    return (
      (card.cardType === "event" ||
        card.cardType === "in_person") &&
      card.signed_up === true &&
      date &&
      date > now
    );
  });

  const requiresActionCards = filteredCards.filter((card) => {
    const date = getCardDate(card);
    const isPast = date ? date < now : false;

    if (card.cardType === "online") {
      return card.clicked === true && card.completed === null;
    }

    if (
      card.cardType === "event" ||
      card.cardType === "in_person"
    ) {
      const notSignedUpYet =
        card.clicked === true && card.signed_up === null;

      const needsCompletion =
        card.clicked === true &&
        card.signed_up === true &&
        isPast &&
        card.completed === null;

      return notSignedUpYet || needsCompletion;
    }

    return false;
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <Text style={styles.title}>Activities</Text>
        {/* Filter options */}
        <View style={styles.filterItemsContainer}>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.activityButtons,
                selectedFilter === "signups"
                  ? styles.selectedButton
                  : styles.unselectedButton,
              ]}
              onPress={() => setSelectedFilter("signups")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedFilter !== "signups" &&
                    styles.nonSelectedButtonText,
                ]}
              >
                Sign-ups
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.activityButtons,
                selectedFilter === "favorites"
                  ? styles.selectedButton
                  : styles.unselectedButton,
              ]}
              onPress={() => setSelectedFilter("favorites")}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedFilter !== "favorites" &&
                    styles.nonSelectedButtonText,
                ]}
              >
                Favorites
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.filterBackground}
            onPress={() => setShowFilters((prev) => !prev)}
          >
            <SlidersHorizontal size={18} color="black" />
          </Pressable>
        </View>

        {/* Dropdown */}
        {showFilters && (
          <View style={{ marginTop: 12 }}>
            <EcoFeedFilterDropdown
              typeOptions={[
                { label: "In-Person Eco Actions", value: "in_person" },
                { label: "Online Eco Actions", value: "online" },
                { label: "Events", value: "event" },
              ]}
              selectedTypes={filterTypes}
              selectedDistance={maxDistance}
              onApply={(types, distance) => {
                setFilterTypes(types);
                setMaxDistance(distance);
                setShowFilters(false);
              }}
            />
          </View>
        )}

        {/* Main Content */}
        {selectedFilter === "favorites" ? (
          <>
            <Text>Favorites</Text>
            {!loading &&
              likedCards.map((card) => (
                <EcoFeed
                  key={`${card.cardType}-${card.cardInfo.id}`}
                  card={card}
                />
              ))}
          </>
        ) : (
          <>
            <View style={styles.cardCountContainer}>
              <Text style={styles.headerText}>Requires Action</Text>
              <Text style={styles.count}>{requiresActionCards.length}</Text>
            </View>            
            {!loading &&
              requiresActionCards.map((card) => (
                <EcoFeed
                  key={`${card.cardType}-${card.cardInfo.id}`}
                  card={card}
                />
              ))}

            <Text style={styles.headerText}>Upcoming</Text>
            {!loading &&
              upcomingCards.map((card) => (
                <EcoFeed
                  key={`${card.cardType}-${card.cardInfo.id}`}
                  card={card}
                />
              ))}

            <Text style={styles.headerText}>Completed</Text>
            {!loading &&
              completedCards.map((card) => (
                <EcoFeed
                  key={`${card.cardType}-${card.cardInfo.id}`}
                  card={card}
                />
              ))}
          </>
        )}

        <LogoutButton />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    fontFamily: 'Mulish',
  },

  filterItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },

  activityButtons: {
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  selectedButton: {
    backgroundColor: "#3A5513",
  },

  unselectedButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#3A5513",
  },

  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },

  nonSelectedButtonText: {
    color: "#3A5513",
  },

  filterBackground: {
    backgroundColor: "#D9E0DE",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  title: {
    color: 'black',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  headerText: {
    color: '#2F4068',
    fontSize: 20,
  },
  // Count
  cardCountContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  count: {
    backgroundColor: '#FF9212',
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 10,
    color: 'white',
  },
});



// import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable } from "react-native";
// import { LogoutButton } from "@/components/LogoutButton";
// import { EcoFeed } from "@/components/EcoFeed";
// import { CardProps, useInteractions } from "@/context/InteractionsContext";
// import { SlidersHorizontal } from "lucide-react-native";
// import { useState } from "react";

// export default function Activity() {
//   const { cards, loading } = useInteractions();
//   const [selectedFilter, setSelectedFilter] = useState<"signups" | "favorites">("signups");
//   const now = new Date();

//   const getCardDate = (card: CardProps) => {
//     if (!card?.cardInfo) return null;
//     if (card.cardType === "event" && card.cardInfo.start_date) {
//       return new Date(card.cardInfo.start_date);
//     }  
//     if (card.cardType === "in_person" && card.cardInfo.start_date) {
//       return new Date(card.cardInfo.start_date);
//     } 
//     return null;
//     };

//   // Derived cards from card state
//   const likedCards = cards.filter(card => card.liked === true);
//   const completedCards = cards.filter(card => card.completed === true); 
  
//   const upcomingCards = cards.filter(card => {
//     const date = getCardDate(card);
//     const isUpcoming = date && date > now;
//     return (
//       (card.cardType === "event" || card.cardType === "in_person") &&
//       card.signed_up === true && isUpcoming
//     );

//   })

  
//   const requiresActionCards = cards.filter(card => {
//     const date = getCardDate(card);
//     const isPast = date ? date < now : false;

//     // ONLINE
//     if (card.cardType === "online") {
//       return card.clicked === true && card.completed === null;
//     }

//     // EVENTS / IN-PERSON
//     if (card.cardType === "event" || card.cardType === "in_person") {
//       const notSignedUpYet =
//         card.clicked === true && card.signed_up === null;

//       const needsCompletionAfterEvent =
//         card.clicked === true &&
//         card.signed_up === true &&
//         isPast &&
//         card.completed === null;

//       return notSignedUpYet || needsCompletionAfterEvent;
//     }

//     return false;
//   });

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={{ padding: 16, gap: 16}}>
//         { loading && <ActivityIndicator size="large" color="#0000ff" />}
//         <View style={styles.filterItemsContainer}>
//           <View style={styles.buttonContainer}>
//             <Pressable
//               style={[
//                 styles.activityButtons,
//                 selectedFilter === "signups" && styles.selectedButton
//               ]}
//               onPress={() => setSelectedFilter("signups")}
//             >
//               <Text
//                 style={[
//                   styles.buttonText,
//                   selectedFilter !== "signups" && styles.nonSelectedButtonText
//                 ]}
//               >
//                 Sign-ups
//               </Text>
//             </Pressable>

//             <Pressable
//               style={[
//                 styles.activityButtons,
//                 selectedFilter === "favorites" && styles.selectedButton
//               ]}
//               onPress={() => setSelectedFilter("favorites")}
//             >
//               <Text
//                 style={[
//                   styles.buttonText,
//                   selectedFilter !== "favorites" && styles.nonSelectedButtonText
//                 ]}
//               >
//                 Favorites
//               </Text>
//             </Pressable>
//           </View>
//           <View style={styles.filterBackground}>
//             <SlidersHorizontal size={18} color="black" />
//           </View>
//         </View>
//         {selectedFilter === "favorites" ? (
//           <>
//             <Text>Favorites</Text>
//             {!loading && likedCards?.map(card => (
//               <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
//             ))}
//           </>
//         ) : (
//           <>
//             <Text>Requires Action:</Text>
//             {!loading && requiresActionCards?.map(card => (
//               <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
//             ))}

//             <Text>Upcoming:</Text>
//             {!loading && upcomingCards?.map(card => (
//               <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
//             ))}

//             <Text>Completed:</Text>
//             {!loading && completedCards?.map(card => (
//               <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
//             ))}
//           </>
//         )}
//         {/* <Text>Favorites</Text>
//         <Text>Likes:</Text>
//         { !loading && likedCards?.map(card => (
//           <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
//         ))}

//         <Text>Requires Action:</Text>
//         { !loading && requiresActionCards?.map(card => (
//           <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
//         ))}

//         <Text>Upcoming:</Text>
//         { !loading && upcomingCards?.map(card => (
//           <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
//         ))}
        

//         <Text>Completed:</Text>
//         { !loading && completedCards?.map(card => (
//           <EcoFeed key={`${card.cardType}-${card.cardInfo.id}`} card={card} />
//         ))} */}
//       <LogoutButton/>
//     </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     gap: 20,
//   },
//   filterItemsContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   buttonContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     gap: 20,
//   },
//   // activityButtons: {
//   //   backgroundColor: '#3A5513',
//   //   color: '#F2F7F5',
//   //   padding: 8,
//   //   borderRadius: 10,
//   // },
//   nonSelectedButton: {
//     backgroundColor: '#F2F7F5',
//     color: '#3A5513',
//     borderWidth: 2,
//     borderColor: '#3A5513',
//   },
  
//   // buttonText: {
//   //   color: 'white',
//   //   fontSize: 14,
//   //   fontWeight: 400,
//   // },
//   filterBackground: {
//     backgroundColor: '#D9E0DE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 5,
//     borderRadius: 5,
//   },
//   activityButtons: {
//   padding: 8,
//   borderRadius: 10,
//   backgroundColor: '#3A5513',
//   },

//   selectedButton: {
//     backgroundColor: '#3A5513',
//   },

//   unselectedButton: {
//     backgroundColor: '#F2F7F5',
//     borderWidth: 2,
//     borderColor: '#3A5513',
//   },

//   buttonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '400',
//   },

//   nonSelectedButtonText: {
//     color: '#3A5513',
//   },
// });
