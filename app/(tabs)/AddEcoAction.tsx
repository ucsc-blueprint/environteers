import { AdminAddEcoAction } from "@/components/AdminAddEcoAction";
import { EditEcoAction } from "@/components/EditEcoAction";
import { Edit } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
export default function AddEcoAction(){
    return(
        //<AdminAddEcoAction typeOfAction= "event"></AdminAddEcoAction>
        <EditEcoAction typeOfAction= "event" id={1}></EditEcoAction>
        
    )
}