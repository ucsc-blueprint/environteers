import React, { useState } from 'react';
import {View, Text, Pressable, Image, StyleSheet, TextInput, GestureResponderEvent} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileX } from 'lucide-react-native';

export interface ProfileSettingsProps{
    onSubmit: (
        username: string,
        email: string,
        password: string
    ) => void;
}

const ProfileSettings = ({ onSubmit }: ProfileSettingsProps) => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (_event: GestureResponderEvent) => {
        setError('');

        if (newPassword !== confirmPassword) {
        setError('Passwords do not match!');
        return;
        }

        onSubmit(username, email, newPassword);
    };
    
    return(
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.backContainer}>
                    <Pressable 
                        style={styles.backButton} 
                        onPress={() => router.push('/login')} 
                        >
                        <ChevronLeft size={24} />
                        <Text style={styles.title}>  Account</Text>
                    </Pressable>
                </View>
                <Text style={styles.header}>Profile</Text>
                <Text style={styles.subtitle2}>Name</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <Text style={styles.subtitle2}>Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <Text style={styles.header}>Security</Text>
                <Text style={[styles.subtitle, { marginLeft : 4 }]}>
                    <Text>Profile Visibility: </Text>
                    <Text style={{ color: '#0282D3' }}>Private</Text>
                </Text>
                <Text style={styles.label}>
                    Your default profile visibility is set to 
                    <Text style={{ color: '#0282D3' }}> Private</Text>
                    . When your profile is set to public, others will be able see your name, achievements, and activity.
                </Text>
                <Text style={[styles.subtitle, {color: '#172A36'}]}>Reset Password</Text>
                <View style={{ marginLeft: 40 }}>
                    <Text style={styles.subtitle2}>Current Password</Text>
                    <TextInput
                        //check if the password typed in is equivalent to old password 
                        value={newPassword} //change this to actual password value 
                        secureTextEntry
                        style={styles.input}
                    />
                    <Text style={styles.subtitle2}>New Password</Text>
                    <TextInput
                        value={newPassword}
                        secureTextEntry
                        onChangeText={setPassword}
                        style={styles.input}
                    />
                    <Text style={styles.subtitle2}>Confirm Password</Text>
                    <TextInput
                        value={confirmPassword}
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                        style={styles.input}
                    />
                </View>
                {error !== '' && (
                    <Text style={styles.error}>{error}</Text>
                )}

                <Pressable
                          style={({ pressed }) => [
                            styles.customButton,
                            pressed && styles.customButtonPressed,
                          ]}
                          onPress={handleSubmit}
                        >
                          <Text style={styles.customButtonText}>Save Changes</Text>
                        </Pressable>
            </View>
        </View>
    )
};

export default ProfileSettings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF2F6',
        justifyContent: 'center'
    },

    content: {
    paddingHorizontal: 24,
    },

    title: {
        fontSize: 22,
    },

    subtitle: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 6,
        fontWeight: 'bold'
    },

    subtitle2: {
        fontSize: 14,
        color: '#808080',
        marginBottom: 6,
    },

    error: {
    color: 'red',
    marginBottom: 12,
    },

    header: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    label: {
        fontSize: 12,
        marginLeft: 4, 
        color: '#808080',
        marginBottom: 18,
    },

    customButton: {
        backgroundColor: '#0282D3',
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 18,
        width: 113,
        height: 35,
        alignSelf: 'center',
    },

    customButtonPressed: {
        backgroundColor: '#0282D3',
    },

    customButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    
    backContainer: {
        marginTop: 10,
        marginBottom: 20,
    },

    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    input: {
        height: 28,
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
        marginBottom: 18,
    },
})