import { EditEcoAction } from "@/components/EditEcoAction";
import React, {useState} from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from 'react-native-paper';

export default function AdminEditEcoAction(){
    const { typeOfAction } = useLocalSearchParams<{ typeOfAction: string }>();
    const {id} = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    if (loading)
        {
          return (<ActivityIndicator animating={true} color="#86AE42" size="large" style={{flex: 1, justifyContent: "center", alignItems: "center"}}/>);
        }   
        
    return (
        <EditEcoAction
            typeOfAction={typeOfAction}
            id={id as string} 
        />
    );
        

}