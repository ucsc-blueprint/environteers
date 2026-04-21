import { AdminAddEcoAction } from "@/components/AdminAddEcoAction";
import { EditEcoAction } from "@/components/EditEcoAction";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function AddEcoAction(){
    const { typeOfAction } = useLocalSearchParams<{ typeOfAction: string }>();

    return (
        <AdminAddEcoAction
            typeOfAction={typeOfAction}
        />
    );
        

}
