import { View } from "react-native";
import { AdminVolunteersView } from "@/components/AdminVolunteersView";
import React from "react";

export default function VolunteerView() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}

    >
      <AdminVolunteersView />
    </View>
  );
}