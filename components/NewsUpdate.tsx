
import React from 'react';
import { StyleSheet, Text, View, Pressable} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trash, Pencil } from 'lucide-react-native';
import { Image } from 'expo-image';
import { supabase } from "@/constants/supabase";

export interface NewsUpdateProps {
  title: string;
  editionNumber?: number;
  date: string;
  previewImage: string;
  adminView: boolean;
  onPress: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const NewsUpdate = ({
  title,
  date,
  editionNumber,
  previewImage,
  adminView,
  onPress,
  onDelete,
  onEdit,
}: NewsUpdateProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: previewImage }} style={styles.image} />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.bottomRow}>
        <View style={styles.meta}>
          <Ionicons name="calendar-outline" size={14} color="#777" />
          <Text style={styles.metaText}>{date}</Text>
        </View>

        {adminView && (
          <View style={{flexDirection: "row"}}>
            <Pressable onPress={() => {
              onDelete?.();
            }} style={styles.deleteButton}>
              <Trash size={22} color="#ea4336" />
            </Pressable>

            <Pressable onPress={() => {
              onEdit?.();
            }} style={styles.editButton}>
              <Pencil size={22} color="#0082d3" />
            </Pressable>
          </View>
        )}
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
    marginHorizontal: 12,
  },

  bottomRow: {
    flexDirection: "row", 
    alignContent: "space-between", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 8,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaText: {
    fontSize: 13,
    color: '#777',
    marginLeft: 6,
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFE3E1"
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#E1F0FF",
    marginLeft: 16,
  }
});
