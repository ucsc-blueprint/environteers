import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import {Button} from './ui/Button';

export interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
}
export const LoginForm = ( {onSubmit }: LoginFormProps) =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View>
            <TextInput
                value = {email} placeholder = "Email" onChangeText = {setEmail}
            />
            <TextInput
                value = {password} placeholder = "Password" onChangeText = {setPassword}
            />
            <Button label = "Login" backgroundColor = "green" onPress = {() => {
                if (email != '' && password != '')
                {
                    onSubmit(email, password)
                    console.log("on submit called with " + email + " and " + [password])
                }
                }
            }>
            </Button>


        </View>

    )
}
export default LoginForm;