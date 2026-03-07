import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export interface AdminNewsFormProps {
    editionNumber?: string,
    setEditionNumber?: (v: string) => void,
    link?: string,
    setLink?: (v: string) => void,
    previewImage?: string,
    setPreviewImage?: (v: string) => void,
}

export const AdminNewsForm = ({
    editionNumber,
    setEditionNumber,
    link,
    setLink,
    previewImage,
    setPreviewImage,
}: AdminNewsFormProps) => {
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    const getImage = async () => {
        if (!status?.granted) {
            await requestPermission();
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.canceled) {
            setPreviewImage?.(result.assets[0].uri);
            console.log(result.assets[0].uri);
        }
    }

    return (
        <View style = {styles.container}>
            <View style= {styles.photoUpload}>
                {previewImage? <Image source = {{uri: previewImage}} style = {{height: "100%", width: "100%"}} resizeMode='cover'/>
                : 
                <Pressable onPress = {getImage}>
                    <Ionicons style = {{alignSelf: "center"}} name = "add-circle-outline" size={24} color="#3E4657" />
                    <Text style = {{color : '#4b4747'}}>Upload Photo</Text>
                </Pressable>
                }
            </View>
            <View style = {styles.input}>
                <Ionicons name = "people-outline" size={24} color="#3E4657" />
                <TextInput 
                    style={styles.textInput} 
                    value={editionNumber} 
                    placeholder="NewsLetter Edition Number..." 
                    placeholderTextColor={"#4b4747"} 
                    keyboardType="numeric" 
                    onChangeText={(text) => setEditionNumber?.(text)}
                />
            </View>
            <View style = {styles.input}>
                <Ionicons name="link-outline" size={24} color="#3E4657" style = {{marginTop: 12}}/>
                <TextInput style={styles.textInput} 
                value={link} 
                placeholder="Link to newsLetter..." 
                placeholderTextColor={"#4b4747"} 
                onChangeText={(text) => setLink?.(text)}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#DCE3E8",
        paddingHorizontal: 24,
    },

    photoUpload: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginTop: "20%",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },

    input: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        height: 50,
        marginTop: 20,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#E5E5E5",
    },

    textInput: {
        flex: 1,
        marginLeft: 10,
        color: "#4b4747",
    },
});