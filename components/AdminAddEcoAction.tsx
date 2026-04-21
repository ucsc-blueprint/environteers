import React, {useState, useRef} from 'react';
import {Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy'
import { decode } from 'base64-arraybuffer';
import { DisplayEcoAction } from '@/components/DisplayEcoAction';


export const AdminAddEcoAction = ({typeOfAction}: {typeOfAction: string}) => { // in-person or online
    //values for supabase
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState<Date | null>(
      (typeOfAction === "in-person" || typeOfAction === "event")? new Date() : null
    );
    const [startTime, setStartTime] = useState<Date | null>(
      (typeOfAction === "in-person" || typeOfAction === "event")? new Date() : null
    );
    const [endTime, setEndTime] = useState<Date | null>(
      (typeOfAction === "in-person" || typeOfAction === "event")? new Date() : null
    );
    const [coverPhoto, setCoverPhoto] = useState("");
    const [campaignType, setCampaignType] = useState("");
    const [location, setLocation] = useState("");
    const [link, setLink] = useState("");
    const [googleCalendarLink, setGoogleCalendarLink] = useState("");
    const BUCKETNAME = 'eco-action images'


    //ui handling
    const [host, setHost] = useState("");
    const [customCampaignType, setCustomCampaignType] = useState('')

    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [resetKey, setResetKey] = useState(0); // used to reset the rich text component

    const getImage = async() => 
        {
            if (!status?.granted) 
            {
              await requestPermission();
            }

            const result = await ImagePicker.launchImageLibraryAsync()

            if (!result.canceled)
            {
              setCoverPhoto(result.assets[0].uri);
            }
        };

      const uploadImage = async(uri: string) => { // returns the public url for the supabase stroage
        if (!uri) return;

        try {
          const fileName = `${Date.now()}.jpg`;
          const filePath = `user_uploads/${fileName}`;
          const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: 'base64', 
            });
          
          const bytes = decode(base64);

          const { error } = await supabase.storage
            .from(BUCKETNAME)
            .upload(filePath, bytes, { contentType: 'image/jpeg' });

          if (error) throw error;
        
          const { data } = supabase.storage
            .from(BUCKETNAME)
            .getPublicUrl(filePath);
          
          console.log(data);
          return data.publicUrl

          } catch(error) {
            console.error(error);
            alert('Upload failed');
          }
        };
      
      const resetAll = () => 
      {
        setLocation("")
        setHost("")
        setEventDate(new Date())
        setDescription("")
        setTitle("")
        setCoverPhoto("")
        setLink("")
        setCampaignType("")
        setCustomCampaignType("")
        setGoogleCalendarLink("")
        setEventDate((typeOfAction === "in-person" || typeOfAction === "event")? new Date() : null);
        setStartTime((typeOfAction === "in-person" || typeOfAction === "event")? new Date() : null);
        setEndTime((typeOfAction === "in-person" || typeOfAction === "event")? new Date() : null);
        setResetKey(prev => prev + 1) // resets rich text editor  
      }
      
      const handleCancel = () => 
      {
        resetAll()
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
          Alert.alert("Description required");
          return;
        }
        if (typeOfAction === "in-person" && !location)
        {
          Alert.alert("Location required for in-person eco actions");
          return;
        }
        if (typeOfAction === "event" && !location){
          Alert.alert("Location required for events");
          return;
        }
        if (typeOfAction === "online" && !link)
        {
          Alert.alert("Link required for online eco actions");
          return;
        }
        if (typeOfAction === "in-person" && (!eventDate || !startTime || !endTime)) 
          {
            Alert.alert("Date and times required for in-person eco actions");
            return;
          }
        if (typeOfAction === "event" && (!eventDate || !startTime || !endTime)) 
          {
            Alert.alert("Date and times required for events");
            return;
          }
        if (typeOfAction === "online" && (!campaignType || (campaignType === "Custom" && !customCampaignType))) 
        {
          Alert.alert("Campaign type required for online eco actions");
          return;
        }

        setSubmitting(true);
        try {
          const imageUrl = await uploadImage(coverPhoto)
          if (coverPhoto && !imageUrl) return;

          if (typeOfAction === "online") {
            const { error } = await supabase.from("online_ecoactions").insert({
              cover_photo: imageUrl,
              title: title,
              campaign_type: campaignType === 'Custom' ? customCampaignType : campaignType,
              email_link: link,
              summary: description,
              host_organization: host,
            });
            if (error) {
              Alert.alert(error.message);
              return;
            }
            Alert.alert("Eco action created successfully");
          }
          else if (typeOfAction === "in-person") {
            const { error } = await supabase.from("inperson_ecoactions").insert({
              title: title,
              summary: description,
              start_date: startTime!.toISOString(),
              end_date: endTime!.toISOString(),
              location: location,
              sign_up_link: link,
              cover_photo: imageUrl,
              host_organization: host,
            });
            if (error) {
                Alert.alert(error.message);
                return;
            }
            Alert.alert("Eco action created successfully");
          }
          else if (typeOfAction === "event") {
            const { error } = await supabase.from("events").insert({
              title: title,
              description: description,
              start_time: startTime!.toISOString(),
              end_time: endTime!.toISOString(),
              location: location,
              sign_up_link: link,
              cover_photo: imageUrl,
              host_organization: host,
              google_calendar_link: googleCalendarLink,
            });
            if (error) {
                Alert.alert(error.message);
                return;
            }
          Alert.alert("Event created successfully");
          router.push("/(tabs)/volunteer")
          }

        resetAll();
      }
      finally 
      {
        setSubmitting(false);
      }
    };
    return (
        <DisplayEcoAction
          key = {resetKey}// forces remount of component to reset the rich text editor
          typeOfAction={typeOfAction}

          title={title}
          setTitle={setTitle}

          description={description}
          setDescription={setDescription}

          host={host}
          setHost={setHost}

          location={location}
          setLocation={setLocation}

          link={link}
          setLink={setLink}

          googleCalendarLink={googleCalendarLink}
          setGoogleCalendarLink={setGoogleCalendarLink}

          eventDate={eventDate}
          setEventDate={setEventDate}

          startTime={startTime}
          setStartTime={setStartTime}

          endTime={endTime}
          setEndTime={setEndTime}

          coverPhoto={coverPhoto}
          setCoverPhoto={setCoverPhoto}

          campaignType={campaignType}
          setCampaignType={setCampaignType}

          customCampaignType={customCampaignType}
          setCustomCampaignType={setCustomCampaignType}

          handleSubmit={handleInsert}
          submitting={submitting}
          handleCancel={handleCancel}
          getImage = {getImage}
        />
    )}


        

