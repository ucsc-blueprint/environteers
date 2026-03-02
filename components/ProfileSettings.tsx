import React, { useState } from 'react';
import {View, Text, Pressable, Image, Switch, StyleSheet, TextInput, GestureResponderEvent} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileX } from 'lucide-react-native';

export interface ProfileSettingsProps{
onSubmit: (
  username: string,
  email: string,
  currentPassword: string,
  password: string
) => Promise<string | null>; //thanks to this, we can return an error message if the update fails, or null if it succeeds
}

const ProfileSettings = ({ onSubmit }: ProfileSettingsProps) => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState(''); 
    const [newPassword, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [isToggled, setIsToggled] = useState(false);
    const toggleSwitch = () => setIsToggled(previousState => !previousState);
    
const handleSubmit = async (_event: GestureResponderEvent) => {
  setError("");

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match!");
    return;
  }

    const result = await onSubmit(
    username,
    email,
    currentPassword,
    newPassword
  );

  if (result) {
    setError(result);
  }
};

    return(
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.backContainer}>
                    <Pressable 
                        style={styles.backButton} 
                        onPress={() => router.push('//settings.tsx')} 
                        >
                        <ChevronLeft size={24} />
                        <Text style={styles.title}>  Account</Text>
                    </Pressable>
                </View>
                <Text style={styles.header}>Profile</Text>
                <View style={styles.toggleContainer}>
                    <Image 
                        source={require('../assets/images/PFP.png')} 
                        style={styles.image}
                    />
                    <View style={styles.boxButton}>
                        <Pressable
                            style={({ pressed }) => [
                            styles.profileButton,
                            pressed && styles.saveButtonPressed,
                            ]}
                            onPress={handleSubmit}>
                            <Text style={styles.customButtonText}>Change Profile Photo</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                            styles.deleteButton,
                            pressed && styles.saveButtonPressed,
                            ]}
                            onPress={handleSubmit}>
                            <Text style={styles.customButtonText}>Remove Profile Photo</Text>
                        </Pressable>
                    </View>
                </View>
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
                <Text style={[styles.subtitle, {color: '#172A36'}]}>Reset Password</Text>

                <View style={{ marginLeft: 40 }}>

                    <Text style={styles.subtitle2}>Current Password</Text>
                    <TextInput
                        value={currentPassword}            
                        onChangeText={setCurrentPassword}  
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
                    styles.saveButton,
                    pressed && styles.saveButtonPressed,
                    ]}
                    onPress={handleSubmit}>
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
        marginBottom: 12,
    },

    label: {
        fontSize: 12,
        marginLeft: 4, 
        color: '#808080',
        marginBottom: 18,
    },

    saveButton: {
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

    boxButton: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
    },

    profileButton: {
        backgroundColor: '#0282D3',
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 9,
        marginBottom: 9,
        marginRight: 10,
        marginLeft: 10,
        width: 147,
        height: 30,
        alignSelf: 'center',
    },

    deleteButton: {
        backgroundColor: '#FFECEF',
        borderColor: '#D8021C',
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 9,
        marginBottom: 9,
        marginRight: 10,
        marginLeft: 10,
        width: 147,
        height: 30,
        alignSelf: 'center',
    },

    saveButtonPressed: {
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

    toggleContainer: {
        flexDirection: 'row',
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },

    toggleSwitch: {
        position: 'relative',
        width: 60,
        height: 34
    },

    image: {
        borderRadius: 50,
        marginLeft: 20,
        width: 70,
        height: 70,
        marginBottom: 12,
    }
})
