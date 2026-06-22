import React, {useCallback, useState, } from 'react';
import {Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';
import * as FileSystem from 'expo-file-system/legacy'
import { decode } from 'base64-arraybuffer';
import { DisplayEcoAction } from '@/components/DisplayEcoAction';
import { buildGoogleCalendarUrl } from '@/components/AdminAddEcoAction';

type Props = 
{
    isEdit?: true,
    typeOfAction: string;
    id: any; 
};
   export const EditEcoAction = ({ isEdit, typeOfAction, id }: Props) => { 
    //values for supabase
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverPhoto, setCoverPhoto] = useState("");
    const [eventDate, setEventDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [campaignType, setCampaignType] = useState("");
    const [location, setLocation] = useState("");
    const [locationLat, setLocationLat] = useState<number | null>(null);
    const [locationLng, setLocationLng] = useState<number | null>(null);
    const [link, setLink] = useState("");
    const BUCKETNAME = 'eco-action images'


    //ui handling
    const [host, setHost] = useState("");
    const [customCampaignType, setCustomCampaignType] = useState('')

    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [loading, setLoading] = useState(true);

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
        // If it's already a remote URL (unchanged from Supabase), return that url
        if (uri.startsWith('http://') || uri.startsWith('https://')) 
        {
          return uri;
        }
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
        setLocation("");
        setLocationLat(null);
        setLocationLng(null);
        setHost("");
        setEventDate(new Date());
        setDescription("");
        setTitle("");
        setCoverPhoto("");
        setLink("");
        setCampaignType("");
        setCustomCampaignType("");
        setEventDate((typeOfAction === "in-person" || typeOfAction === "event")? new Date() : null);
        setStartTime((typeOfAction === "in-person" || typeOfAction === "event")? new Date() : null);
        setEndTime((typeOfAction === "in-person" || typeOfAction === "event")? new Date() : null);
      }
      const handleCancel = () => {
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
        if ((typeOfAction === "in-person" || typeOfAction === "event") && (!locationLat || !locationLng)) {
          Alert.alert("Please select a location from the dropdown suggestions");
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
                const { error } = await supabase
                .from("online_ecoactions")
                .update({
                    cover_photo: imageUrl,

                    title: title,
                    campaign_type: campaignType === 'Custom' ? customCampaignType : campaignType,
                    email_link: link,
                    summary: description,
                    host_organization: host,
                })
                .eq('id', id);
            if (error) {
              Alert.alert(error.message);
              return;
            }
            Alert.alert("Eco action updated successfully");
            router.push("/(tabs)/volunteer");
          }
          else if (typeOfAction === "in-person") {
            const { error } = await supabase.from("inperson_ecoactions").update({
              title: title,
              summary: description,
              start_date: startTime!.toISOString(),
              end_date: endTime!.toISOString(),
              location: location,
              location_latitude: locationLat,
              location_longitude: locationLng,
              sign_up_link: link,
              cover_photo: imageUrl,
              host_organization: host,
              google_calendar_link: buildGoogleCalendarUrl(title, startTime, endTime, description, location),
            })
            .eq('id', id);
            if (error) {
                Alert.alert(error.message);
                return;
            }
            Alert.alert("Eco action updated successfully");
            router.push("/(tabs)/volunteer");
          }
          else if (typeOfAction === "event") {
            const { error } = await supabase.from("events").update({
              title: title,
              description: description,
              start_date: startTime!.toISOString(),
              end_date: endTime!.toISOString(),
              location: location,
              location_latitude: locationLat,
              location_longitude: locationLng,
              sign_up_link: link,
              cover_photo: imageUrl,
              host_organization: host,
              google_calendar_link: buildGoogleCalendarUrl(title, startTime, endTime, description, location),
            })
            .eq('id', id);
            if (error) {
                Alert.alert(error.message);
                return;
            }
          Alert.alert("Event updated successfully");
          router.push("/(tabs)/volunteer");
          }

        resetAll();
      } finally {
        setSubmitting(false);
      }
    };
    useFocusEffect
    (
      useCallback(() => 
      {
        const fetchEcoAction = async () => {
          if(!id){
            Alert.alert("No ID provided");
            return;
          }
          setLoading(true);

          let tableName = typeOfAction === 'online'
            ? 'online_ecoactions'
            : typeOfAction === 'in-person'
            ? 'inperson_ecoactions'
            : 'events';

          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            console.error(error);
            Alert.alert("Failed to load eco action");
            return;
          }

          setTitle(data.title);
          setDescription(data.description ?? data.summary ?? '');
          setCoverPhoto(data.cover_photo ?? '');
          setHost(data.host_organization ?? '');
          setLocation(data.location ?? '');
          setLocationLat(data.location_latitude ?? null);
          setLocationLng(data.location_longitude ?? null);
          setLink(data.sign_up_link ?? data.email_link ?? '');
          setCampaignType(data.campaign_type ?? '');
          setCustomCampaignType(data.campaign_type ?? '');
          console.log(data.start_date, data.start_time);
          if (typeOfAction === 'in-person' || typeOfAction === 'event') 
          {
            setStartTime(data.start_date ? new Date(data.start_date) : null);
            setEndTime(data.end_date ? new Date(data.end_date) : null);
            setEventDate(data.start_date ? new Date(data.start_date) : null);
          }
          else 
          {
            setStartTime(null);
            setEndTime(new Date(data.end_time));
            setEventDate(null);
          }

          setLoading(false);
        };

        fetchEcoAction();
      }, [id, typeOfAction])
    );
        
    return (
        <DisplayEcoAction
          typeOfAction={typeOfAction}
          isEdit={true}
          
          title={title}
          setTitle={setTitle}

          description={description}
          setDescription={setDescription}

          host={host}
          setHost={setHost}

          location={location}
          setLocation={setLocation}

          locationLat={locationLat}
          setLocationLat={setLocationLat}

          locationLng={locationLng}
          setLocationLng={setLocationLng}

          link={link}
          setLink={setLink}

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

          loading = {loading}
          handleSubmit={handleInsert}
          submitting={submitting}
          handleCancel={handleCancel}
          getImage = {getImage}
        />
    )}
