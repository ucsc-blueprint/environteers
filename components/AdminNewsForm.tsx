import React from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/constants/supabase';

export interface AdminNewsFormProps {
    editionNumber?: string;
    setEditionNumber?: (v: string) => void;
    link?: string;
    setLink?: (v: string) => void;
    previewImage?: string;
    setPreviewImage?: (v: string) => void;
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
    const [uploading, setUploading] = React.useState(false);

    const uploadImage = async (uri: string): Promise<string | undefined> => {
        if (uri.startsWith('http://') || uri.startsWith('https://')) {
            return uri;
        }

        try {
            const fileName = `${Date.now()}.jpg`;
            const filePath = `news_uploads/${fileName}`;

            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64',
            });

            const bytes = decode(base64);
            // Convert
            const { error } = await supabase.storage
                .from('news-images')
                .upload(filePath, bytes, { contentType: 'image/jpeg' });

            if (error) throw error;

            const { data } = supabase.storage
                .from('news-images')
                .getPublicUrl(filePath);

            return data.publicUrl; // Return the public URL of the uploaded image
        } catch (e: any) {
            Alert.alert('Upload failed', e.message);
        }
    };

    const getImage = async () => {
        if (!status?.granted) {
            await requestPermission();
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (result.canceled) return;

        const uri = result.assets[0].uri;
        setUploading(true);

        const publicUrl = await uploadImage(uri);
        if (publicUrl) {
            setPreviewImage?.(publicUrl);
        }

        setUploading(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.photoUpload}>
                {previewImage ? (
                    <Pressable onPress={getImage} style={{ height: '100%', width: '100%' }}>
                        <Image
                            source={{ uri: previewImage }}
                            style={{ height: '100%', width: '100%', borderRadius: 12 }}
                            contentFit="cover"
                        />
                    </Pressable>
                ) : (
                    <Pressable onPress={getImage} disabled={uploading}>
                        <Ionicons style={{ alignSelf: 'center' }} name="add-circle-outline" size={24} color="#3E4657" />
                        <Text style={{ color: '#4b4747' }}>
                            {uploading ? 'Uploading...' : 'Upload Photo'}
                        </Text>
                    </Pressable>
                )}
            </View>
            <View style={styles.input}>
                <Ionicons name="people-outline" size={24} color="#3E4657" />
                <TextInput
                    style={styles.textInput}
                    value={editionNumber}
                    placeholder="NewsLetter Edition Number..."
                    placeholderTextColor="#4b4747"
                    keyboardType="numeric"
                    onChangeText={(text) => setEditionNumber?.(text)}
                />
            </View>
            <View style={styles.input}>
                <Ionicons name="link-outline" size={24} color="#3E4657" style={{ marginTop: 12 }} />
                <TextInput
                    style={styles.textInput}
                    value={link}
                    placeholder="Link to newsLetter..."
                    placeholderTextColor="#4b4747"
                    onChangeText={(text) => setLink?.(text)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DCE3E8',
        paddingHorizontal: 24,
    },
    photoUpload: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginTop: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        overflow: 'hidden',
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        height: 50,
        marginTop: 20,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        color: '#4b4747',
    },
});