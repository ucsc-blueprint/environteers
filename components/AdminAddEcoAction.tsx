import React, {useState} from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert, Image, ScrollView, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';


export const AdminAddEcoAction = ({typeOfAction}: {typeOfAction: string}) => { // in-person or online
  
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [eventDate, setEventDate] = React.useState(new Date());
    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());
    const [mode, setMode] = React.useState<'date' | 'time'>("date");
    const [host, setHost] = React.useState("");
    const [coverPhoto, setCoverPhoto] = useState("");
    const [campaignType, setCampaignType] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [link, setLink] = React.useState("");
    const [showPicker, setShowPicker] = React.useState(false);
    const [pickerMode, setPickerMode] = React.useState<"date" | "start" |"end">("date");
    
    const router = useRouter();
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
                setCoverPhoto(result.assets[0].uri);
                console.log(result.assets[0].uri);
              }
          }
      const handleCancel = () => {
        setLocation("")
        setHost("")
        setDescription("")
        setTitle("")
        setCoverPhoto("")
        setLink("")
        router.push("/(tabs)/volunteer")
    }
    const handleInsert = async () => {
        if (!title)
        {
          Alert.alert("Title required");
          return;
        }
        if (!description)
        {
          Alert.alert("description required");
          return;
        }
        if (typeOfAction === "in-person" && !location)
        {
          Alert.alert("Location required for in-person eco actions");
          return;
        }
        if (typeOfAction === "online" && !link)
        {
          Alert.alert("Link required for online eco actions");
          return;
        }
        if (typeOfAction === "online" && !campaignType)
        {
          Alert.alert("Campaign type required for online eco actions");
          return;
        }

        if (typeOfAction === "online")
        {
            const { error } = await supabase.from("online_eco-actions").insert({
              cover_photo: coverPhoto,
              title: title,
              endDate: endTime.toISOString(),
              campaign_type: campaignType,
              email_link: link,
              summary: description,
            
            });
            if (error) {
                Alert.alert(error.message)
            } 
            else {
                Alert.alert("Eco action created successfully")
            }
          }
          else if (typeOfAction === "in-person")
          {
            const { error } = await supabase.from("inperson_eco-actions").insert({
                  title,
                  summary: description,
                  start_date: startTime.toISOString(),
                  end_date: endTime.toISOString(),
                  location: location,
                  sign_up_link: link,
                  cover_photo: coverPhoto,
                });
            if (error) {
                Alert.alert(error.message)
            } 
            else {
                Alert.alert("Eco action created successfully")
            }
          }
    
        setLocation("")
        setHost("")
        setEventDate(new Date())
        setDescription("")
        setTitle("")
        setCoverPhoto("")
        setLink("")
      }



    return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/(tabs)/volunteer")}>
          <Ionicons name="close" size={28} color="black" />
        </Pressable>

        <Text style={styles.headerTitle}>Add Event</Text>

        <Pressable style={styles.saveButton} onPress={handleInsert}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>
      <View>
        <View style={styles.photoCard}>
          {coverPhoto ? (
            <Image
              source={{ uri: coverPhoto }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <Pressable style={styles.photoPlaceholder} onPress={getImage}>
              <Ionicons name="add-circle-outline" size={50} color="#8A8A8A" />
              <Text style={styles.addPhotoText}>Add cover photo</Text>

              <View style={styles.uploadButton}>
                <Text style={styles.uploadText}>Upload a picture</Text>
                <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
              </View>
            </Pressable>
          )}
        </View>
      <View style={styles.section}>
        {typeOfAction === "in-person" ? (
          <Text style={styles.label}>Event Date, Start & End Time<Text style={{ color: "red" }}> *</Text></Text>
        ) : (
          <Text style={styles.label}>End Date {`(optional)`}</Text>
        )}

        <View style={styles.dateRow}>
          {/* Pick the day */}
          <Pressable
            style={styles.input}
            onPress={() => { setPickerMode("date"); setShowPicker(!showPicker); }}
          >
            <Text>{eventDate.toLocaleDateString()}</Text>
          </Pressable>
          
          {typeOfAction === "in-person" && ( // pick start time
          <Pressable
            style={styles.input}
            onPress={() => { setPickerMode("start"); setShowPicker(!showPicker); }}
          >
            <Text>{startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          </Pressable>
          )}


          {/* Pick end time */}
          <Pressable
            style={styles.input}
            onPress={() => { setPickerMode("end"); setShowPicker(!showPicker); }}
          >
            <Text>{endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
          </Pressable>
        </View>

        {showPicker && (
          <DateTimePicker
            value={
              pickerMode === "date" ? eventDate :
              pickerMode === "start" ? startTime :
              endTime
            }
            mode={pickerMode === "date" ? "date" : "time"}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              if (Platform.OS === "android") setShowPicker(false); // only hide on Android
              if (!selectedDate) return;

              if (pickerMode === "date") {
                setEventDate(selectedDate);
                // adjust start/end times to new date
                const newStart = new Date(startTime);
                newStart.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                setStartTime(newStart);

                const newEnd = new Date(endTime);
                newEnd.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                setEndTime(newEnd);
              } else if (pickerMode === "start") {
                selectedDate.setFullYear(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                setStartTime(selectedDate);
              } else if (pickerMode === "end") {
                selectedDate.setFullYear(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                setEndTime(selectedDate);
              }
            }}
          />
        )}
      </View>

        <View style={styles.section}>
          <Text style={styles.label}>Eco-Action Title<Text style={{ color: "red" }}> *</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Event"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Host organization</Text>
          <TextInput
            style={styles.input}
            placeholder="Host Organization"
            value={host}
            onChangeText={setHost}
          />
        </View>
        {typeOfAction === "in-person" && ( // location for in person
        <View style={styles.section}>
          
          <Text style={styles.label}>Location<Text style={{ color: "red" }}> *</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
        </View>
        )}
        
        <View style={styles.section}>
          
          <Text style={styles.label}>Link<Text style={{ color: "red" }}> *</Text></Text>
          <TextInput
            style={styles.input}
            placeholder= {typeOfAction === "in-person" ? "Sign up Link" : "Add link or email"}
            value={link}
            onChangeText={setLink}
          />
        </View>

        {typeOfAction === "online" && (
        <View style={styles.section}>
          
          <Text style={styles.label}>Campaign Type<Text style={{ color: "red" }}> *</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Add campaign type"
            value={campaignType}
            onChangeText={setCampaignType}
          />
        </View>
        )}

        <View style={styles.section}>
          <Text style = {styles.label}>Description<Text style={{ color: "red" }}> *</Text></Text>
          <TextInput
            style={styles.description}
            placeholder="Desscription"
            value={description}
            onChangeText={setDescription}
            multiline = {true}
          />
        </View>
    </View>
  </View>
  </ScrollView>
  );
};
        

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCE3E8",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    position: "relative",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "center",
  },

  saveButton: {
    backgroundColor: "#86AE42",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  saveText: {
    color: "white",
    fontWeight: "600",
  },

  photoCard: {
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  photoPlaceholder: {
    alignItems: "center",
  },

  addPhotoText: {
    marginTop: 10,
    color: "#555",
    fontSize: 15,
  },

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 15,
    backgroundColor: "#1F2A37",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },

  uploadText: {
    color: "white",
    fontSize: 14,
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  section: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 6,
    fontWeight: "500",
    fontSize: 14,
  },

  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  description: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    padding: 14,
    height: 150,
    textAlignVertical: "top",
  },

  dateRow: {
    flexDirection: "row",
    gap: 10,
  },

  datePill: {
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
});