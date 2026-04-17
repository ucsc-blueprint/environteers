import { AdminAddEcoAction } from "@/components/AdminAddEcoAction";
import { EditEcoAction } from "@/components/EditEcoAction";
import React from "react";
export default function AddEcoAction(){
    return(
        //<AdminAddEcoAction typeOfAction= "in-person" /*pass in just typeOfAction*/></AdminAddEcoAction>
        
        <EditEcoAction typeOfAction= "event" id={1} /*pass in typeOfAction and id number for edit*/></EditEcoAction>

    )
}