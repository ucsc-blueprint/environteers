import React, {useState} from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';

export const AdminNewsUpdateForm = () => {
    const [editionNumber, setEditionNumber] = React.useState("");
    const [link, setLink] = React.useState("");
    const [previewImage, setPreviewImage] = useState("");
    const router = useRouter();

    const handleInsert = async () => {
      if (!editionNumber) {
        Alert.alert("Edition number required");
        return;
      }

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const dateString = `${year}-${month}-${day}`;

      const { error } = await supabase.from("news").insert({
        edition_number: editionNumber,
        link: link,
        date: dateString,
        preview_image: previewImage
      });

      if (error) {
        Alert.alert(error.message)
      } else {
        Alert.alert("Newsletter created successfully")
      }

      setEditionNumber("")
      setLink("")
      setPreviewImage("")

      router.push("/(tabs)/newsletter")
    }

    const handleCancel = () => {
      setEditionNumber("")
      setLink("")
      setPreviewImage("")
      router.push("/(tabs)/newsletter")
    }

    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    const getImage = async() => 
    {
        if (!status?.granted) 
        {
          await requestPermission();
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync()
        
        if (!result.canceled)
        {
          setPreviewImage(result.assets[0].uri);
          console.log(result.assets[0].uri);
        }
    }

    return (
        <View style = {styles.container}>
            <View style= {styles.photoUpload}>
              {previewImage? <Image source = {{uri: previewImage}} style = {{height: "100%", width: "100%"}} resizeMode='cover'/>
              : 
              <Pressable onPress = {getImage}>
                  <Ionicons style = {{alignSelf: "center"}} name = "add-circle-outline" size={24} color="#3E4657" />
                  <Text style = {{color : '#4b4747'}}>Upload Photo</Text>
              </Pressable>
              }
            </View>
            <View style = {styles.input}>
                <Ionicons name = "people-outline" size={24} color="#3E4657" />
                <TextInput style = {styles.textInput} value={editionNumber} placeholder = "NewsLetter Edition Number..." placeholderTextColor= {"#4b4747"} keyboardType="numeric" onChangeText={setEditionNumber}/>
            </View>
            <View style = {styles.input}>
                <Ionicons name = "link-outline" size={24} color="#3E4657" style = {{marginTop: 12}}/>
                <TextInput style = {styles.textInput} value={link} placeholder = "Link to newsLetter..." placeholderTextColor= {"#4b4747"} onChangeText={setLink}/>
            </View>
            <View style = {styles.buttonRow}>
                <Pressable style = {styles.cancelButton} onPress={handleCancel}>
                    <Text style = {styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable style = {styles.publishButton} onPress={handleInsert}>
                    <Text style = {styles.publishText}>Publish</Text>
                </Pressable>
                
            </View>
        </View>
    )
}

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

  publishButton: {
    flex: 1,
    backgroundColor: "#86AE42",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 10,
  },

  publishText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 20,
  },
});
