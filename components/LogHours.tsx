import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "@/components/Button";

import { supabase } from "@/constants/supabase";

export interface LogHoursProps {
  onSubmit: () => void;
}

export const LogHours = ({ onSubmit }: LogHoursProps) => {
  const [date, setDate] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(new Date());
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from("event_reports")
        .insert({
          event_date: date,
          check_in: checkInTime,
          check_out: checkOutTime,
          additional_notes: additionalNotes.trim() ? additionalNotes : null,
        });
      
      if (error) {
        console.error("Error logging hours:", error);
      }

      onSubmit();
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>What day were you here?</Text>
        <DateTimePicker
          mode="date"
          value={date}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>When did you check in?</Text>
        <DateTimePicker
          mode="time"
          value={checkInTime}
          onChange={(event, selectedTime) => {
            if (selectedTime) {
              setCheckInTime(selectedTime);
            }
          }}
        />
      </View>
        
      <View style={styles.row}>
        <Text style={styles.label}>When did you check out?</Text>
        <DateTimePicker
          mode="time"
          value={checkOutTime}
          onChange={(event, selectedTime) => {
            if (selectedTime) {
              setCheckOutTime(selectedTime);
            }
          }}
        />
      </View>
      
      <Text style={styles.label}>Any additional notes you&apos;d like to leave?</Text>
      <TextInput
        value={additionalNotes}
        onChangeText={setAdditionalNotes}
        style={styles.addInfoInput}
        multiline
        textAlignVertical="top"
      />

      <View style={styles.buttonsContainer}>
        <Button label="Cancel"/>
        <Button label="Log my hours" onPress={handleSubmit}/>
      </View>
    </View>
  )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20
  },
  row: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
  },
  addInfoInput: {
    height: 150,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    marginVertical: 20,
    padding: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  }
});