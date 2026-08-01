import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { AdminNewsForm } from '@/components/AdminNewsForm';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';

export const AdminNewsAddForm = () => {
  const [editionNumber, setEditionNumber] = useState('');
  const [link, setLink] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const router = useRouter();

  const handleInsert = async () => {
    if (!editionNumber) {
      Alert.alert('Edition number required');
      return;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const dateString = `${year}-${month}-${day}`;

    const { error } = await supabase.from('news').insert({
      edition_number: editionNumber,
      link: link,
      date: dateString,
      preview_image: previewImage,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Newsletter created successfully');
    }

    setEditionNumber('');
    setLink('');
    setPreviewImage('');
    router.push('/(tabs)/newsletter');
  };

  const handleCancel = () => {
    setEditionNumber('');
    setLink('');
    setPreviewImage('');
    router.push('/(tabs)/newsletter');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled'>
        <AdminNewsForm
          editionNumber={editionNumber}
          setEditionNumber={setEditionNumber}
          link={link}
          setLink={setLink}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
        />

        <View style={styles.buttonRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.publishButton} onPress={handleInsert}>
            <Text style={styles.publishText}>Publish</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCE3E8',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 24,
  },

  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#86AE42',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },

  cancelText: {
    color: '#86AE42',
    fontWeight: '500',
    fontSize: 20,
  },

  publishButton: {
    flex: 1,
    backgroundColor: '#86AE42',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 10,
  },

  publishText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 20,
  },
});
