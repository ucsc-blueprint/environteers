import React from 'react';
import { StyleSheet, Text, View, Pressable, TextInput} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const AdminNewsUpdateForm = () => {
    return (
        <View>
            <TextInput placeholder="Title" />
            <View style= {styles.photoUpload}>
                <Ionicons name = "add-circle-outline" size={24} color="#696464" />
                <Text>Upload Photo</Text>
            </View>
            <View style = {styles.input}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        borderWidth: 0,
        marginTop: 40


    },
    photoUpload:
    {
        backgroundColor: "#eee8e8",
        borderRadius: 8,
        padding: 12,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    input:
    {
        borderWidth: 1
    }    

})