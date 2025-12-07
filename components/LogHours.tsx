import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from './ui/Button';

export interface LogHoursProps {
    onSubmit: (date: string, checkInTime: string, checkOutTime: string) => void;
}

export const LogHours = ({ onSubmit }: LogHoursProps) => {
    const [date, setDate] = useState('');
    const [checkInTime, setCheckInTime] = useState('');
    const [checkOutTime, setCheckOutTime] = useState('');

    const handleSubmit = () => {
        if (date && checkInTime && checkOutTime) {
            onSubmit(date, checkInTime, checkOutTime);
        }
    }

    return (
        <View>
            <TextInput 
                placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate}
            />
            <TextInput 
                placeholder="Check-in Time (HH:MM)" value={checkInTime} onChangeText={setCheckInTime}
            />
            <TextInput 
                placeholder="Check-out Time (HH:MM)" value={checkOutTime} onChangeText={setCheckOutTime}
            />

            <Button label="Log my hours" onPress={handleSubmit}/>
        </View>
    )
} 