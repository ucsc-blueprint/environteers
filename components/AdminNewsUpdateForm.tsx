import React, {useState} from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
export const AdminNewsUpdateForm = () => {


    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [image, setImage] = useState('');

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
          setImage(result.assets[0].uri);
          console.log(result.assets[0].uri);
        }
    }

    return (
        <View style = {styles.container}>
            <TextInput style = {styles.title} placeholder = "Article Title..." placeholderTextColor={"#4b4747"} />
            <View style= {styles.photoUpload}>
              {image? <Image source = {{uri: image}} style = {{height: "100%", width: "100%"}} resizeMode='cover'/>
              : 
              <Pressable onPress = {getImage}>
                  <Ionicons style = {{alignSelf: "center"}} name = "add-circle-outline" size={24} color="#3E4657" />
                  <Text style = {{color : '#4b4747'}}>Upload Photo</Text>
              </Pressable>
              }
            </View>
            <View style = {styles.input}>
                <Ionicons name = "people-outline" size={24} color="#3E4657" />
                <TextInput style = {styles.textInput} placeholder = "NewsLetter Edition Number..." placeholderTextColor= {"#4b4747"}/>
            </View>
            <View style = {styles.input}>
                <Ionicons name = "link-outline" size={24} color="#3E4657" style = {{marginTop: 12}}/>
                <TextInput style = {styles.textInput} placeholder = "Link to newsLetter..." placeholderTextColor= {"#4b4747"}/>
            </View>
            <View style = {styles.buttonRow}>
                <Pressable style = {styles.cancelButton}>
                    <Text style = {styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable style = {styles.publishButton}>
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

  title: {
    marginTop: 60,
    fontSize: 22,
    fontWeight: "600",
    color: "#4b4747",
  },

  photoUpload: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 180,
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
