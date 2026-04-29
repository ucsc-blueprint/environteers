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
import { SlidersHorizontal, ChevronRight, ChevronDown } from "lucide-react-native";
import * as Location from "expo-location";
import { EcoFeedFilterDropdown } from "@/components/EcoFeedFilterDropdown";

export default function Activity() {
  const { cards, loading } = useInteractions();

  const [selectedFilter, setSelectedFilter] = useState<
    "signups" | "favorites"
  >("signups");

  // Filters
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Collapsible sections
  const [requiresActionOpen, setRequiresActionOpen] = useState(true);
  const [upcomingOpen, setUpcomingOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(true);

  // User location
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const now = new Date();

  // Get location
  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getLocation();
  }, []);

  // Distance helper
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
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Date helper
  const getCardDate = (card: CardProps) => {
    if (!card?.cardInfo) return null;

    if (
      (card.cardType === "event" ||
        card.cardType === "in_person" ||
        card.cardType === "online") &&
      card.cardInfo.end_date
    ) {
      return new Date(card.cardInfo.end_date);
    }

    return null;
  };

  // Apply filters
  const filteredCards = cards.filter((card) => {
    const matchesType =
      filterTypes.length === 0 || filterTypes.includes(card.cardType);

    const matchesDistance = (() => {
      if (
        !maxDistance ||
        !userLocation ||
        card.cardType === "online"
      ) {
        return true;
      }

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

  // Card groups
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
        card.clicked === true &&
        card.signed_up === null;

      const needsCompletion =
        card.clicked === true &&
        card.signed_up === true &&
        isPast &&
        card.completed === null;

      return notSignedUpYet || needsCompletion;
    }

    return false;
  });

  const renderSection = (
    title: string,
    cardsToRender: CardProps[],
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    highlight = false
  ) => {
    return (
      <View style={styles.sectionContainer}>
        <Pressable
          style={styles.sectionHeader}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={styles.headerText}>{title}</Text>

          <View style={styles.rightSection}>
            <Text style={styles.count}>
              {cardsToRender.length}
            </Text>

            {isOpen ? (
              <ChevronDown size={22} color="#2F4068" />
            ) : (
              <ChevronRight size={22} color="#2F4068" />
            )}
          </View>
        </Pressable>

        {isOpen && (
          <View style={styles.cardsContainer}>
            {cardsToRender.length === 0 ? (
              <Text style={styles.emptyText}>
                No activity yet...
                {"\n"}
                Go to the home page to discover your next opportunity!
              </Text>
            ) : (
              cardsToRender.map((card) => (
                <EcoFeed
                  key={`${card.cardType}-${card.cardInfo.id}`}
                  card={card}
                  highlight={highlight}
                />
              ))
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
      >
        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
          />
        )}

        <Text style={styles.title}>Activities</Text>

        {/* Top Controls */}
        <View style={styles.filterItemsContainer}>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.activityButtons,
                selectedFilter === "signups"
                  ? styles.selectedButton
                  : styles.unselectedButton,
              ]}
              onPress={() =>
                setSelectedFilter("signups")
              }
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
              onPress={() =>
                setSelectedFilter("favorites")
              }
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
            onPress={() =>
              setShowFilters((prev) => !prev)
            }
          >
            <SlidersHorizontal
              size={18}
              color="black"
            />
          </Pressable>
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={{ marginTop: 12 }}>
            <EcoFeedFilterDropdown
              typeOptions={[
                {
                  label: "In-Person Eco Actions",
                  value: "in_person",
                },
                {
                  label: "Online Eco Actions",
                  value: "online",
                },
                {
                  label: "Events",
                  value: "event",
                },
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
        {!loading &&
          (selectedFilter === "favorites" ? (
            renderSection(
              "Favorites",
              likedCards,
              favoritesOpen,
              setFavoritesOpen
            )
          ) : (
            <>
              {renderSection(
                "Requires Action",
                requiresActionCards,
                requiresActionOpen,
                setRequiresActionOpen,
                true
              )}

              {renderSection(
                "Upcoming",
                upcomingCards,
                upcomingOpen,
                setUpcomingOpen
              )}

              {renderSection(
                "Completed",
                completedCards,
                completedOpen,
                setCompletedOpen
              )}
            </>
          ))}

        <LogoutButton />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  scrollContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },

  title: {
    color: "black",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "600",
  },

  filterItemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },

  activityButtons: {
    paddingVertical: 10,
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
    fontWeight: "500",
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

  sectionContainer: {
    gap: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },

  headerText: {
    color: "#2F4068",
    fontSize: 20,
    fontWeight: "600",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  count: {
    backgroundColor: "#FF9212",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    color: "white",
    overflow: "hidden",
    fontWeight: "600",
    minWidth: 32,
    textAlign: "center",
  },

  cardsContainer: {
    gap: 12,
  },

  emptyText: {
    color: "#777",
    fontSize: 15,
    fontStyle: "italic",
    paddingVertical: 8,
    paddingHorizontal: 4,
    textAlign: "center",
    lineHeight: 22,
  },
});








// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   Pressable,
// } from "react-native";
// import { useState, useEffect } from "react";
// import { LogoutButton } from "@/components/LogoutButton";
// import { EcoFeed } from "@/components/EcoFeed";
// import { CardProps, useInteractions } from "@/context/InteractionsContext";
// import { SlidersHorizontal } from "lucide-react-native";
// import * as Location from "expo-location";
// import { EcoFeedFilterDropdown } from "@/components/EcoFeedFilterDropdown";

// type SectionHeaderProps = {
//   title: string;
//   count?: number;
//   expanded: boolean;
//   onToggle: () => void;
// };

// const SectionHeader = ({
//   title,
//   count,
//   expanded,
//   onToggle,
// }: SectionHeaderProps) => {
//   return (
//     <Pressable
//       onPress={onToggle}
//       style={styles.sectionHeaderContainer}
//     >
//       <View style={styles.sectionHeaderLeft}>
//         <Text style={styles.headerText}>{title}</Text>

//         {count !== undefined && (
//           <Text style={styles.count}>{count}</Text>
//         )}
//       </View>

//       <Text style={styles.chevron}>
//         {expanded ? "−" : "+"}
//       </Text>
//     </Pressable>
//   );
// };

// export default function Activity() {
//   const { cards, loading } = useInteractions();

//   const [selectedFilter, setSelectedFilter] = useState<
//     "signups" | "favorites"
//   >("signups");

//   // Filter state
//   const [filterTypes, setFilterTypes] = useState<string[]>([]);
//   const [maxDistance, setMaxDistance] = useState<number | null>(null);
//   const [showFilters, setShowFilters] = useState(false);

//   const [userLocation, setUserLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);

//   // Collapsible sections
//   const [showRequiresAction, setShowRequiresAction] = useState(true);
//   const [showUpcoming, setShowUpcoming] = useState(true);
//   const [showCompleted, setShowCompleted] = useState(true);

//   const now = new Date();

//   // Get user location
//   useEffect(() => {
//     const getLocation = async () => {
//       const { status } =
//         await Location.requestForegroundPermissionsAsync();

//       if (status !== "granted") return;

//       const location = await Location.getCurrentPositionAsync({});

//       setUserLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//     };

//     getLocation();
//   }, []);

//   // Distance helper
//   const getDistance = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ) => {
//     const R = 3958.8;

//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   };

//   // Date helper
//   const getCardDate = (card: CardProps) => {
//     if (!card?.cardInfo) return null;

//     if (
//       (card.cardType === "event" ||
//         card.cardType === "in_person") &&
//       card.cardInfo.end_date
//     ) {
//       return new Date(card.cardInfo.end_date);
//     }

//     if (
//       card.cardType === "online" &&
//       card.cardInfo.end_date
//     ) {
//       return new Date(card.cardInfo.end_date);
//     }

//     return null;
//   };

//   // Filtered cards
//   const filteredCards = cards.filter((card) => {
//     const matchesType =
//       filterTypes.length === 0 ||
//       filterTypes.includes(card.cardType);

//     const matchesDistance = (() => {
//       if (
//         !maxDistance ||
//         !userLocation ||
//         card.cardType === "online"
//       ) {
//         return true;
//       }

//       const lat = (card.cardInfo as any).location_latitude;
//       const lon = (card.cardInfo as any).location_longitude;

//       if (!lat || !lon) return true;

//       return (
//         getDistance(
//           userLocation.latitude,
//           userLocation.longitude,
//           lat,
//           lon
//         ) <= maxDistance
//       );
//     })();

//     return matchesType && matchesDistance;
//   });

//   // Derived card states
//   const likedCards = filteredCards.filter(
//     (c) => c.liked === true
//   );

//   const completedCards = filteredCards.filter(
//     (c) => c.completed === true
//   );

//   const upcomingCards = filteredCards.filter((card) => {
//     const date = getCardDate(card);

//     return (
//       (card.cardType === "event" ||
//         card.cardType === "in_person") &&
//       card.signed_up === true &&
//       date &&
//       date > now
//     );
//   });

//   const requiresActionCards = filteredCards.filter((card) => {
//     const date = getCardDate(card);

//     const isPast = date ? date < now : false;

//     if (card.cardType === "online") {
//       return (
//         card.clicked === true &&
//         card.completed === null
//       );
//     }

//     if (
//       card.cardType === "event" ||
//       card.cardType === "in_person"
//     ) {
//       const notSignedUpYet =
//         card.clicked === true &&
//         card.signed_up === null;

//       const needsCompletion =
//         card.clicked === true &&
//         card.signed_up === true &&
//         isPast &&
//         card.completed === null;

//       return notSignedUpYet || needsCompletion;
//     }

//     return false;
//   });

//   // Empty states
//   const hasNoSignupsActivity =
//     requiresActionCards.length === 0 &&
//     upcomingCards.length === 0 &&
//     completedCards.length === 0;

//   const hasNoFavorites = likedCards.length === 0;

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={{
//           padding: 16,
//           gap: 16,
//         }}
//       >
//         {loading && (
//           <ActivityIndicator
//             size="large"
//             color="#0000ff"
//           />
//         )}

//         <Text style={styles.title}>Activities</Text>

//         {/* Filter options */}
//         <View style={styles.filterItemsContainer}>
//           <View style={styles.buttonContainer}>
//             <Pressable
//               style={[
//                 styles.activityButtons,
//                 selectedFilter === "signups"
//                   ? styles.selectedButton
//                   : styles.unselectedButton,
//               ]}
//               onPress={() =>
//                 setSelectedFilter("signups")
//               }
//             >
//               <Text
//                 style={[
//                   styles.buttonText,
//                   selectedFilter !== "signups" &&
//                     styles.nonSelectedButtonText,
//                 ]}
//               >
//                 Sign-ups
//               </Text>
//             </Pressable>

//             <Pressable
//               style={[
//                 styles.activityButtons,
//                 selectedFilter === "favorites"
//                   ? styles.selectedButton
//                   : styles.unselectedButton,
//               ]}
//               onPress={() =>
//                 setSelectedFilter("favorites")
//               }
//             >
//               <Text
//                 style={[
//                   styles.buttonText,
//                   selectedFilter !== "favorites" &&
//                     styles.nonSelectedButtonText,
//                 ]}
//               >
//                 Favorites
//               </Text>
//             </Pressable>
//           </View>

//           <Pressable
//             style={styles.filterBackground}
//             onPress={() =>
//               setShowFilters((prev) => !prev)
//             }
//           >
//             <SlidersHorizontal
//               size={18}
//               color="black"
//             />
//           </Pressable>
//         </View>

//         {/* Dropdown */}
//         {showFilters && (
//           <View style={{ marginTop: 12 }}>
//             <EcoFeedFilterDropdown
//               typeOptions={[
//                 {
//                   label: "In-Person Eco Actions",
//                   value: "in_person",
//                 },
//                 {
//                   label: "Online Eco Actions",
//                   value: "online",
//                 },
//                 {
//                   label: "Events",
//                   value: "event",
//                 },
//               ]}
//               selectedTypes={filterTypes}
//               selectedDistance={maxDistance}
//               onApply={(types, distance) => {
//                 setFilterTypes(types);
//                 setMaxDistance(distance);
//                 setShowFilters(false);
//               }}
//             />
//           </View>
//         )}

//         {/* Main Content */}
//         {selectedFilter === "favorites" ? (
//           <>
//             <SectionHeader
//               title="Favorites"
//               expanded={true}
//               onToggle={() => {}}
//             />

//             {hasNoFavorites ? (
//               <View style={styles.emptyStateContainer}>
//                 <Text style={styles.emptyStateText}>
//                   No favorites yet.
//                 </Text>

//                 <Text style={styles.emptyStateSubtext}>
//                   Like eco-actions or events to save
//                   them here.
//                 </Text>
//               </View>
//             ) : (
//               likedCards.map((card) => (
//                 <EcoFeed
//                   key={`${card.cardType}-${card.cardInfo.id}`}
//                   card={card}
//                 />
//               ))
//             )}
//           </>
//         ) : (
//           <>
//             {hasNoSignupsActivity ? (
//               <View style={styles.emptyStateContainer}>
//                 <Text style={styles.emptyStateText}>
//                   No activity yet.
//                 </Text>

//                 <Text style={styles.emptyStateSubtext}>
//                   Sign up for eco-actions or events to
//                   track them here.
//                 </Text>
//               </View>
//             ) : (
//               <>
//                 {/* Requires Action */}
//                 {requiresActionCards.length > 0 && (
//                   <>
//                     <SectionHeader
//                       title="Requires Action"
//                       count={
//                         requiresActionCards.length
//                       }
//                       expanded={showRequiresAction}
//                       onToggle={() =>
//                         setShowRequiresAction(
//                           (prev) => !prev
//                         )
//                       }
//                     />

//                     {showRequiresAction &&
//                       requiresActionCards.map(
//                         (card) => (
//                           <EcoFeed
//                             key={`${card.cardType}-${card.cardInfo.id}`}
//                             card={card}
//                             highlight={true}
//                           />
//                         )
//                       )}
//                   </>
//                 )}

//                 {/* Upcoming */}
//                 {upcomingCards.length > 0 && (
//                   <>
//                     <SectionHeader
//                       title="Upcoming"
//                       expanded={showUpcoming}
//                       onToggle={() =>
//                         setShowUpcoming(
//                           (prev) => !prev
//                         )
//                       }
//                     />

//                     {showUpcoming &&
//                       upcomingCards.map((card) => (
//                         <EcoFeed
//                           key={`${card.cardType}-${card.cardInfo.id}`}
//                           card={card}
//                         />
//                       ))}
//                   </>
//                 )}

//                 {/* Completed */}
//                 {completedCards.length > 0 && (
//                   <>
//                     <SectionHeader
//                       title="Completed"
//                       expanded={showCompleted}
//                       onToggle={() =>
//                         setShowCompleted(
//                           (prev) => !prev
//                         )
//                       }
//                     />

//                     {showCompleted &&
//                       completedCards.map((card) => (
//                         <EcoFeed
//                           key={`${card.cardType}-${card.cardInfo.id}`}
//                           card={card}
//                         />
//                       ))}
//                   </>
//                 )}
//               </>
//             )}
//           </>
//         )}

//         <LogoutButton />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     fontFamily: "Mulish",
//   },

//   filterItemsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 10,
//   },

//   buttonContainer: {
//     flexDirection: "row",
//     gap: 20,
//   },

//   activityButtons: {
//     padding: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//   },

//   selectedButton: {
//     backgroundColor: "#3A5513",
//   },

//   unselectedButton: {
//     backgroundColor: "white",
//     borderWidth: 2,
//     borderColor: "#3A5513",
//   },

//   buttonText: {
//     color: "white",
//     fontSize: 14,
//     fontWeight: "400",
//   },

//   nonSelectedButtonText: {
//     color: "#3A5513",
//   },

//   filterBackground: {
//     backgroundColor: "#D9E0DE",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 8,
//     paddingVertical: 5,
//     borderRadius: 5,
//   },

//   title: {
//     color: "black",
//     fontSize: 24,
//     textAlign: "center",
//     marginVertical: 10,
//   },

//   headerText: {
//     color: "#2F4068",
//     fontSize: 20,
//     fontWeight: "600",
//   },

//   count: {
//     backgroundColor: "#FF9212",
//     borderRadius: 20,
//     padding: 5,
//     paddingHorizontal: 10,
//     color: "white",
//     overflow: "hidden",
//   },

//   sectionHeaderContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 10,
//   },

//   sectionHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },

//   chevron: {
//     fontSize: 24,
//     color: "#2F4068",
//     fontWeight: "300",
//   },

//   emptyStateContainer: {
//     paddingVertical: 50,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   emptyStateText: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#2F4068",
//   },

//   emptyStateSubtext: {
//     marginTop: 10,
//     textAlign: "center",
//     color: "#6B7280",
//     paddingHorizontal: 30,
//     lineHeight: 22,
//   },
// });








