import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
}
const LoginForm = ({ onSubmit }: LoginFormProps) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={styles.container}>
            <View style={styles.textBox}>
                <Text style={styles.title}>Welcome back!</Text>
                <Text style={styles.subtitle}>Log into your account</Text>

                <View style={styles.textInputBox}>
                    <Text>email</Text>
                    <View style={styles.inputWithIcon}>
                        <MaterialCommunityIcons name="email-outline" size={20} color="#75786C" style={styles.icon}/>
                        <TextInput
                            style={styles.textInput}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <Text>password</Text>
                    <View style={styles.inputWithIcon}>
                        <MaterialCommunityIcons name="lock-outline" size={20} color="#75786C" style={styles.icon}/>
                        <TextInput
                            style={styles.textInput}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                </View>

                <Pressable
                    style={styles.loginButton}
                    onPress={() => {
                        if (email !== '' && password !== '') {
                            onSubmit(email, password);
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
            </View>

            <View style={styles.signupFooter}>
                <Text>
                    Don&apos;t have an account? <Pressable onPress={() => router.push('/signup')}><Text style={styles.signupLink}>Sign up</Text></Pressable>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loginButton: {
        borderRadius: 8,
        backgroundColor: "#4F6629",
        padding: 10,
        width: 288,
        marginTop: 40
    },
    buttonText: {
        fontSize: 20,
        color: "white",
        textAlign: "center"
    },
    signupLink: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    container: {
        display: 'flex',
        flexDirection: "column",
        alignItems: 'center',
        backgroundColor: '#DDE6C6',
        flex: 1
    },
    textBox: {
        marginTop: '30%',
    },
    textInputBox: {
        marginTop: 30,
    },
    title: {
        fontWeight: '500',
        color: '#1A1C15',
        fontSize: 40,
    },
    subtitle: {
        color: "#414A32",
        fontSize: 20,
        marginTop: 10
    },
    textInput: {
        flex: 1,
        marginTop: 0,
        padding: 10
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "#1A1C15",
        borderRadius: 2,
        paddingHorizontal: 10,
        backgroundColor: '#FAFAEE',
        marginTop: 10,
        marginBottom: 10,
        width: 288,
        height: 48
    },
    icon: {
        marginRight: 8
    },
    signupFooter: {
        color: '#1A1C15',
        marginTop: 30,
        fontSize: 20
    }
});

export default LoginForm;
