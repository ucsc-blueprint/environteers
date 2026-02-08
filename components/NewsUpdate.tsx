
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Pressable, Image, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';


export interface NewsUpdateProps {
  title: string;
  editionNumber?: number;
  date: string;
  previewImage: string;
  onPress: () => void;
}


export const NewsUpdate = ({
  title,
  date,
  editionNumber,
  previewImage,
  onPress,
}: NewsUpdateProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: previewImage }} style={styles.image} />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}: {editionNumber}th Edition
      </Text>

      <View style={styles.meta}>
        <Ionicons name="calendar-outline" size={14} color="#777" />
        <Text style={styles.metaText}>{date}</Text>
      </View>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
  },

  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 200,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginHorizontal: 4,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
    marginLeft: 8,
  },

  metaText: {
    fontSize: 13,
    color: '#777',
    marginLeft: 6,
  },
});
