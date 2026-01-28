import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import React from "react";
// Icons
import {
 Calendar,
 Leaf,
 Share2,
 Heart,
 MapPin,
 Filter,
 Menu,
 Bell,
 ListFilter
} from "lucide-react-native";


export interface EcoFeedProps {
 title: string;
 date: string;
 location: string;
 spotsLeft?: number;
 type?: 'Eco-Action' | 'Event';
 onLearnMore?: () => void;
 onSignUp?: () => void;
}


export const Header = () => (
 <View style={styles.feedHeader}>
   {/* Navbar (Top)*/}
   <View style={styles.formatBetween}>
     <Menu size={24} />
     <Bell size={24} />
   </View>
   <Text style={styles.nameText}>Ready to Volunteer <Text style={{ fontWeight: '700' }}>Name?</Text></Text>
   {/* Searchbar */}
   <View>
     <Text style={[styles.filter, styles.searchBar]}>Search for a keyword...</Text>
   </View>
   {/* Buttons */}
   <View style={styles.buttons}>
       <Text style={styles.filter}>Eco-Actions</Text>
       <Text style={styles.filter}>Events</Text>
       <Text style={styles.filter}>In person</Text>
       <Text style={styles.filter}>Online</Text>
   </View>


   <View style={styles.cardDes}>
     <View style={styles.formatRow}>
       <ListFilter size={20} />
       <Text style={{ fontWeight: '400' }}>Most Recent</Text>
     </View>
     <View style={styles.results}>
       <Text style={styles.results}>25 results</Text>
     </View>
   </View>
 </View>
);


export const EcoFeed = ({
 title,
 date,
 location,
 spotsLeft,
 type,
 onLearnMore,
 onSignUp,
}: EcoFeedProps) => {
 return (
   <View style={styles.card}>
     {/* Top content */}
     <View style={styles.row}>
       {/* Image placeholder */}
       <View style={styles.imagePlaceholder}>
         <View style={styles.header}>
           {type === "Eco-Action" ? <Leaf size={24} /> : <Calendar size={24} />}
           <Text style={styles.typeLabel}>{type}</Text>
         </View>


         {spotsLeft !== undefined && (
           <View style={styles.spotsPill}>
             <Text style={styles.spotsText}>{spotsLeft} spots left</Text>
           </View>
         )}
       </View>


       {/* Info */}
       <View style={styles.info}>
        <View style={styles.eventInfo}>

        <Text style={styles.title}>{title}</Text>
         <Text style={styles.date}>{date}</Text>
         <View style={styles.location}>
           <MapPin size={20} />
           <Text>{location}</Text>
         </View>

        </View>


         {/* Buttons */}
         <View style={styles.buttonRow}>
           <Pressable style={styles.learnMoreButton} onPress={onLearnMore}>
             <Text style={styles.learnMoreText}>Learn more</Text>
           </Pressable>


           <Pressable style={styles.signUpButton} onPress={onSignUp}>
             <Text style={styles.signUpText}>Sign Up</Text>
           </Pressable>
         </View>
       </View>
     </View>


     {/* Divider */}
     <View style={styles.divider} />


     {/* Notes */}
     <View style={styles.footnote}>
       <View style={styles.actions}>
         <Share2 size={24} />
         <Heart size={24} />
         <Image source={require('../assets/images/google-calendar.png')} style={styles.image}/>
       </View>
       <Text style={styles.notes}>
         Notes: Children under 14 require adult supervision
       </Text>
     </View>
   </View>
 );
};


const styles = StyleSheet.create({
 feedHeader: {
   flexDirection: 'column',
 },

 nameText: {
   fontSize: 30,
   paddingVertical: 20,
   marginLeft: 9
 },

 cardDes: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },

 results: {
   alignSelf: 'flex-end',
   fontWeight: '400',
 },

 card: {
   backgroundColor: '#E0E0E0',
   borderRadius: 24,
   padding: 16,
   flex: 1,
 },

 row: {
   flexDirection: 'row',
   gap: 16,
 },

 imagePlaceholder: {
   width: 130,
   height: 170,
   backgroundColor: '#FFFFFF',
   padding: 8,
   justifyContent: 'space-between',
   marginTop: 20,
 },

 typeLabel: {
   fontSize: 14,
   fontWeight: '700',
 },

 spotsPill: {
   alignSelf: 'flex-end',
   backgroundColor: '#D1D1D1',
   paddingHorizontal: 10,
   paddingVertical: 4,
   borderRadius: 999,
 },

 spotsText: {
   fontSize: 12,
   fontWeight: '600',
 },

 info: {
   flex: 1,
   justifyContent: 'space-between',
   marginTop: 20,
 },

 eventInfo: {
  gap: 1,
 },

 title: {
   fontSize: 18,
   fontWeight: '700',
   marginBottom: 6,
 },

 date: {
   fontSize: 16,
   fontWeight: '600',
   color: '#6B6B6B',
   marginBottom: 8,
 },

 location: {
   fontSize: 14,
   fontWeight: '500',
   textDecorationLine: 'underline',
   flexDirection: 'row',
   alignItems: 'flex-start',
 },

 buttonRow: {
   flexDirection: 'row',
   gap: 12,
   alignItems: 'flex-end',
 },

 learnMoreButton: {
   flexShrink: 1,
   borderWidth: 1,
   borderColor: '#000',
   borderRadius: 999,
   paddingVertical: 6,
   paddingHorizontal: 8,
 },

 learnMoreText: {
   fontSize: 14.3,
   fontWeight: '700',
 },

 signUpButton: {
   flexShrink: 1,
   backgroundColor: '#000',
   borderRadius: 999,
   paddingVertical: 6,
   paddingHorizontal: 8,
 },

 signUpText: {
   color: '#FFF',
   fontSize: 14.3,
   fontWeight: '700',
 },

 divider: {
  height: 1,
  backgroundColor: '#B0B0B0',
  marginVertical: 16,
 },

 footnote: {
   flexDirection: 'row',
   alignItems: 'flex-end',
 },

 notes: {
   fontSize: 14,
   color: '#6B6B6B',
   flex: 1,
   flexShrink: 1,
   marginLeft: 70
 },

 header: {
   flexDirection: 'row',
   gap: 6,
   alignItems: 'center',
 },

 actions: {
   flexDirection: 'row',
   gap: 12,
   alignItems: 'center',
 },

 image: {
   width: 21,
   height: 21,
 },

  formatRow: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: 10,
 },

 formatBetween: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },

 buttons: {
   marginTop: 20,
   marginBottom: 20,
   flexDirection: 'row',
   justifyContent: 'space-between',
 },

 filter: {
   borderColor: 'black',
   borderWidth: 2,
   borderRadius: 30,
   paddingHorizontal: 8,
   paddingVertical: 2,
   fontWeight: '400',
 },

 searchBar: {
   color: 'gray',
   paddingVertical: 12,
   paddingHorizontal: 15,
 },

 shareIcon: {
   paddingBottom: 1,
 },
});
