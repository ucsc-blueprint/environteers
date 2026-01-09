import { useState } from 'react';
import { Button, View, Text, TextInput } from 'react-native';

export interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
}

export const MyLogin = ( { onSubmit }: LoginFormProps ) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View>
            <Text color='red'>Login Form</Text>
            <TextInput
                value = {email} placeholder = "Email" onChangeText = {setEmail}
            />
            <TextInput
                value = {password} placeholder = "Password" onChangeText = {setPassword}
            />

            <Button onPress = {() => onSubmit(email, password)}/>
        </View>
    )
}
