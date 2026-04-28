import React, {useState, useRef} from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert, Image, ScrollView, Platform, KeyboardAvoidingView, Keyboard} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dispatch, SetStateAction } from 'react';
import { ActivityIndicator } from 'react-native-paper';
type Props = {
  typeOfAction: string;
  isEdit: boolean;

  title: string;
  setTitle: Dispatch<SetStateAction<string>>;

  description: string;
  setDescription: Dispatch<SetStateAction<string>>;

  host: string;
  setHost: Dispatch<SetStateAction<string>>;

  location: string;
  setLocation: Dispatch<SetStateAction<string>>;

  link: string;
  setLink: Dispatch<SetStateAction<string>>;

  eventDate: Date | null;
  setEventDate: Dispatch<SetStateAction<Date | null>>;

  startTime: Date | null;
  setStartTime: Dispatch<SetStateAction<Date | null>>;

  endTime: Date | null;
  setEndTime: Dispatch<SetStateAction<Date | null>>;

  coverPhoto: string;
  setCoverPhoto: Dispatch<SetStateAction<string>>;

  campaignType: string;
  setCampaignType: Dispatch<SetStateAction<string>>;

  customCampaignType: string;
  setCustomCampaignType: Dispatch<SetStateAction<string>>;

  loading?: boolean;
  handleSubmit: () => void;
  handleCancel: () => void;
  getImage: () => void;

  submitting: boolean;
};
export const DisplayEcoAction = ({
    typeOfAction,
    isEdit,

    title,
    setTitle,

    description,
    setDescription,

    host,
    setHost,

    location,
    setLocation,

    link,
    setLink,

    eventDate,
    setEventDate,

    startTime,
    setStartTime,

    endTime,
    setEndTime,

    coverPhoto,
    setCoverPhoto,

    campaignType,
    setCampaignType,

    customCampaignType,
    setCustomCampaignType,

    loading,
    handleSubmit,
    submitting,
    handleCancel,
    getImage,
    }: Props) => 
      {
        const [showPicker, setShowPicker] = useState(false);
        const [pickerMode, setPickerMode] = useState<"date" | "start" | "end">("date");
        const [filterOpen, setFilterOpen] = useState(false);
        const richText = useRef<RichEditor>(null);

        const actionWord = isEdit? "Edit": "Add";
    if (loading)
    {
      return (<ActivityIndicator animating={true} color="#86AE42" size="large" style={{flex: 1, justifyContent: "center", alignItems: "center"}}/>);
    }   
    return (
      <SafeAreaView style={{ flex: 1 }} edges = {['bottom']}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={40}
      >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => Keyboard.dismiss()}
      >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style = {styles.leftButton} onPress={() => handleCancel()}>
            <Ionicons name="close" size={28} color="black" />
          </Pressable>
            {typeOfAction === "in-person" || typeOfAction === "online" ? (

                <Text style={styles.headerTitle}>{actionWord} {typeOfAction} eco-action</Text>
              ) 
              : typeOfAction === "event" ? (
                <Text style={styles.headerTitle}>{actionWord} event</Text>
              )
              : null
            }

          <Pressable
            style={[styles.rightButton, submitting && { opacity: 0.5}]}
            onPress={() => handleSubmit()}
            disabled={submitting}
          >
            <Text style={styles.saveText}>{submitting ? 'Saving...' : 'Save'}</Text>
          </Pressable>
      </View>
      
        <View>
          <View style={styles.photoCard}>
            {coverPhoto ? (
              <Pressable onPress={getImage} style={{width: "100%", height: "100%"}}>
                <Image
                  source={{ uri: coverPhoto }}
                  style={styles.photo}
                  resizeMode="cover"
                />
                
                <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 6 }}>
                  <Ionicons name="camera-outline" size={18} color="white" />
                </View>
              </Pressable>
            ) : (
              <Pressable style={styles.photoPlaceholder} onPress={getImage}>
                <Ionicons name="add-circle-outline" size={64} color="#8A8A8A" />
                <Text style={styles.addPhotoText}>Add cover photo</Text>

                <View style={styles.uploadButton}>
                  <Text style={styles.uploadText}>Upload a picture</Text>
                  <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                </View>
              </Pressable>
            )}
          </View>
        <View style={styles.section}>
          {typeOfAction === "in-person" || typeOfAction === "event"? (
            <Text style={styles.label}>Set a Date<Text style={{ color: "red" }}> *</Text></Text>
          ) : (
            <Text style={styles.label}>End Date {`(optional)`}</Text>
          )}

          <View style={styles.dateRow}>
            {/* Pick the day */}
            <Pressable
              style={[
                styles.datePill,
                showPicker && pickerMode === "date" && styles.activeInput
              ]}
              onPress={() => { setPickerMode("date"); setShowPicker(!showPicker); }}
            >
              <Text>
                {eventDate ? eventDate.toLocaleDateString() : "Select date"}
              </Text>
            </Pressable>
            
            {(typeOfAction === "in-person" || typeOfAction === "event") && ( // pick start time
            <Pressable
              style={[
                styles.datePill,
                showPicker && pickerMode === "start" && styles.activeInput
              ]}
              onPress={() => { setPickerMode("start"); setShowPicker(!showPicker); }}
            >
              <Text>
                {startTime ? startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Start time"} -
              </Text>
            </Pressable>
            )}
          
            
            {/* Pick end time */}
            <Pressable
              style={[
                styles.datePill,
                showPicker && pickerMode === "end" && styles.activeInput
              ]}
              onPress={() => { setPickerMode("end"); setShowPicker(!showPicker); }}
            >
              <Text>
                {endTime
                  ? endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "Select end"}
              </Text>
            </Pressable>
          </View>

          {showPicker && (
            <DateTimePicker
              value={
                    pickerMode === "date"
                      ? eventDate || new Date()
                      : pickerMode === "start"
                      ? startTime || new Date()
                      : endTime || new Date()
                  }
              mode={pickerMode === "date" ? "date" : "time"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              textColor='black'
              onChange={(event, selectedDate) => {
                if (Platform.OS === "android") setShowPicker(false);
                if (!selectedDate) return;

                if (pickerMode === "date") {
                  setEventDate(selectedDate);

                  // Only update times if they exist (in-person or event)
                  if (startTime) {
                    const newStart = new Date(startTime);
                    newStart.setFullYear(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate()
                    );
                    setStartTime(newStart);
                  }

                  if (endTime) {
                    const newEnd = new Date(endTime);
                    newEnd.setFullYear(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate()
                    );
                    setEndTime(newEnd);
                  }

                } else if (pickerMode === "start") {
                  if (!eventDate) return;

                  const newStart = new Date(selectedDate);
                  newStart.setFullYear(
                  eventDate.getFullYear(),
                  eventDate.getMonth(),
                  eventDate.getDate()
                  );
                  setStartTime(newStart);

                } else if (pickerMode === "end") {
                  if (typeOfAction === "online") {
                    setEndTime(selectedDate);
                  } else {
                    if (!eventDate) return;
                    const newEnd = new Date(selectedDate);
                    newEnd.setFullYear(
                      eventDate.getFullYear(),
                      eventDate.getMonth(),
                      eventDate.getDate()
                    );
                    setEndTime(newEnd);
                  }
                }              
              }
            }
            />
          )}
        </View>

          <View style={styles.section}>
            <Text style={styles.label}>

              {typeOfAction === "in-person" || typeOfAction === "online"
                ? "Eco-Action Title"
                : typeOfAction === "event"
                ? "Event Title"
                : ""}
            <Text style={{ color: "red" }}> *</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={typeOfAction === "event" ? "Enter event title" : "Enter eco-action title"}
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Host organization</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Host Organization"
              placeholderTextColor="#888"
              value={host}
              onChangeText={setHost}
            />
          </View>
          {(typeOfAction === "in-person" || typeOfAction === "event") && ( // location for in person
          <View style={styles.section}>
            
            <Text style={styles.label}>Location<Text style={{ color: "red" }}> *</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Select Location Address"
              placeholderTextColor= "#888"
              value={location}
              onChangeText={setLocation}
            />
          </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.label}>
              {typeOfAction === "online" ? "Link/Email" : "Sign Up Link"}
            </Text> 
            <TextInput
              style={styles.input}
              placeholder= {(typeOfAction === "in-person" || typeOfAction === "event") ? "Paste Sign up Link" : "Add link or email"}
              placeholderTextColor="#888"
              value={link}
              onChangeText={setLink}
            />
          </View>
          
          {typeOfAction === "online" && (
          <View style={styles.section}>
            
            <Text style={styles.label}>Campaign Type<Text style={{ color: "red" }}> *</Text></Text>
            <DropDownPicker
              open={filterOpen}
              setOpen = {setFilterOpen}
              value={campaignType}
              setValue={setCampaignType}
              listMode = "SCROLLVIEW"
      
              items={[
                { label: 'Petition', value: 'Petition' },
                { label: 'Constituent Advocacy', value: 'Constituent Advocacy' },
                { label: 'Public Commenting', value: 'Public Commenting' },
                { label: 'Custom', value: 'Custom' },

              ]}
              style={{
                backgroundColor: "#F2F2F2",
                borderRadius: 10,
                borderWidth: 0,
                paddingHorizontal: 12,
                paddingVertical: 12,
              }}
              dropDownContainerStyle={{
                backgroundColor: "#F2F2F2",
                borderRadius: 10,
                borderWidth: 0,
              }}
              textStyle={{ color: "#000" }}
              selectedItemContainerStyle = {{backgroundColor : "#E4EFD4"}}
              
              
              />

            {campaignType === "Custom" && (
              <View style={styles.section}>
                <Text style={styles.label}>
                  Enter Custom Campaign Type<Text style={{ color: "red" }}> *</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter custom campaign type"
                  value={customCampaignType}
                  onChangeText={setCustomCampaignType}
                />
              </View>
            )}
            </View>
            
            )}
            <Text style={styles.label}>Description<Text style={{ color: "red" }}> *</Text></Text>
              {!loading ? 
              (
                <>
                  <RichToolbar
                    editor={richText}
                    actions={['bold', 'italic', 'underline', 'unorderedList', 'orderedList', actions.insertLink]}
                    style={{ backgroundColor: '#eee', borderRadius: 10, marginBottom: 8 }}
                  />
                  <RichEditor
                    ref={richText}
                    placeholder="Enter description..."
                    onChange={setDescription}
                    initialContentHTML={description}
                    style={{ minHeight: 150, backgroundColor: '#F2F2F2', borderRadius: 12, padding: 14 }}
                  />
                </>
              )
              : null}
      </View>
    </View>
    </Pressable>
    </KeyboardAwareScrollView>
    </SafeAreaView>
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
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  leftButton: {
    position: "absolute",
    left: 0,
  },

  rightButton: {
    position: "absolute",
    right: 0,
    backgroundColor: "#86AE42",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
  datePill:
  {
    backgroundColor: "#7676801F",
    borderRadius: 12,
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
  activeInput: {
    backgroundColor: "#CFE8FF",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  })
