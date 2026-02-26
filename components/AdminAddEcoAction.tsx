import React, {useState} from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert, Image, ScrollView, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';


export const AdminAddEcoAction = ({typeOfAction}: {typeOfAction: string}) => { // in-pesron or online-eco-action
  
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [date, setDate] = React.useState(new Date());
    const [showPicker, setShowPicker] = React.useState(false);
    const [mode, setMode] = React.useState<'date' | 'time'>("date");
    const [host, setHost] = React.useState("");
    const [guestLimit, setGuestLimit] = React.useState("");
    const [coverPhoto, setCoverPhoto] = useState("");
    const [location, setLocation] = React.useState("");
    
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
        setGuestLimit("")
        setHost("")
        setDate(new Date())
        setDescription("")
        setTitle("")
        setCoverPhoto("")
        router.push("/(tabs)/volunteer")
    }


    return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/(tabs)/volunteer")}>
          <Ionicons name="close" size={28} color="black" />
        </Pressable>

        <Text style={styles.headerTitle}>Add Event</Text>

        <Pressable style={styles.saveButton}>
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
        { typeOfAction === "in-person" && (
          <View style={styles.section}>
            <Text style={styles.label}>Set a date & time<Text style={{ color: "red" }}> *</Text></Text>

            {Platform.OS === 'android' 
            ? 
            (
              <View style={styles.dateRow}>
                <Pressable style={styles.input} onPress={() => { setMode('date'); setShowPicker(true); }}>
                  <Text>{date.toLocaleDateString()}</Text>
                </Pressable>

                <Pressable style={styles.input} onPress={() => { setMode('time'); setShowPicker(true); }}>
                  <Text>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </Pressable>
              </View>
            ) 
            : 
            (
              <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
                <Text>{date.toLocaleString()}</Text>
              </Pressable>
            )}

             {showPicker && (
              <DateTimePicker
                value={date}
                mode={Platform.OS === 'ios' ? 'datetime' : mode} // <-- iOS uses 'datetime', Android uses 'date' or 'time'
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (!selectedDate) return;

                  const updated = new Date(date);
                  if (Platform.OS === 'android') {
                    // separate date/time for Android
                    if (mode === 'date') {
                      updated.setFullYear(selectedDate.getFullYear());
                      updated.setMonth(selectedDate.getMonth());
                      updated.setDate(selectedDate.getDate());
                    } else if (mode === 'time') {
                      updated.setHours(selectedDate.getHours());
                      updated.setMinutes(selectedDate.getMinutes());
                    }
                  } else {
                    // iOS: datetime picker gives both
                    updated.setFullYear(selectedDate.getFullYear());
                    updated.setMonth(selectedDate.getMonth());
                    updated.setDate(selectedDate.getDate());
                    updated.setHours(selectedDate.getHours());
                    updated.setMinutes(selectedDate.getMinutes());
                  }

                  setDate(updated);
                }}
              />
            )}
          </View>
        )}


        <View style={styles.section}>
          <Text style={styles.label}>Event Title<Text style={{ color: "red" }}> *</Text></Text>
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

        {typeOfAction === "online-eco-action" && ( // link for online eco action}
        <View style={styles.section}>
          
          <Text style={styles.label}>Link<Text style={{ color: "red" }}> *</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Paste Sign up Link"
            value={location}
            onChangeText={setLocation}
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