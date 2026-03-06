import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';

export const AdminNewsEditForm = ({ id }: { id: string }) => {
  const [editionNumber, setEditionNumber] = useState("");
  const [link, setLink] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const router = useRouter();

  // Pre-fill form with existing newsletter data
  useEffect(() => {
    const fetchNewsletter = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("newsletter_id", id)
        .single();

      if (error) {
        Alert.alert("Error fetching newsletter");
      } else {
        setEditionNumber(String(data.edition_number));
        setLink(data.link);
        setPreviewImage(data.preview_image);
      }
    };

    fetchNewsletter();
  }, [id]);

  const handleSave = async () => {
    if (!editionNumber) {
      Alert.alert("Edition number required");
      return;
    }

    const { data, error } = await supabase
    .from("news")
    .update({
      edition_number: editionNumber,
      link: link,
      preview_image: previewImage,
    })
    .eq("newsletter_id", id)

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Newsletter updated successfully");
      router.push("/(tabs)/newsletter");
    }
  };

  const handleCancel = () => {
    router.push("/(tabs)/newsletter");
  };

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const getImage = async () => {
    if (!status?.granted) {
      await requestPermission();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoUpload}>
        {previewImage ?
          <Image source={{ uri: previewImage }} style={{ height: "100%", width: "100%" }} resizeMode='cover' />
          :
          <Pressable onPress={getImage}>
            <Ionicons style={{ alignSelf: "center" }} name="add-circle-outline" size={24} color="#3E4657" />
            <Text style={{ color: '#4b4747' }}>Upload Photo</Text>
          </Pressable>
        }
      </View>
      <View style={styles.input}>
        <Ionicons name="people-outline" size={24} color="#3E4657" />
        <TextInput style={styles.textInput} value={editionNumber} placeholder="Newsletter Edition Number..." placeholderTextColor="#4b4747" keyboardType="numeric" onChangeText={setEditionNumber} />
      </View>
      <View style={styles.input}>
        <Ionicons name="link-outline" size={24} color="#3E4657" style={{ marginTop: 12 }} />
        <TextInput style={styles.textInput} value={link} placeholder="Link to newsletter..." placeholderTextColor="#4b4747" onChangeText={setLink} />
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
};

// copy the same styles from AdminNewsUpdateForm.tsx
// just rename publishButton → saveButton and publishText → saveText
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#DCE3E8",
      paddingHorizontal: 24,
    },
  
  
    photoUpload: {
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      marginTop: "20%",
      alignItems: "center",
      justifyContent: "center",
      height: "30%",
      borderWidth: 1,
      borderColor: "#E5E5E5",
    },
  
    input: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      height: 50,
      marginTop: 20,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: "#E5E5E5",
    },
  
    textInput: {
      flex: 1,
      marginLeft: 10,
      color: "#4b4747",
    },
  
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 30,
    },
  
    cancelButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#86AE42",
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
      marginRight: 10,
    },
  
    cancelText: {
      color: "#86AE42",
      fontWeight: "500",
      fontSize: 20,
    },
  
    saveButton: {
      flex: 1,
      backgroundColor: "#86AE42",
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
      marginLeft: 10,
    },
  
    saveText: {
      color: "#FFFFFF",
      fontWeight: "500",
      fontSize: 20,
    },
  });
