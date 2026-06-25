import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { AdminNewsForm } from '@/components/AdminNewsForm';
import { useRouter } from 'expo-router';
import { supabase } from '@/constants/supabase';

export const AdminNewsEditForm = ({ id }: { id: string }) => {
  const [editionNumber, setEditionNumber] = useState('');
  const [link, setLink] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNewsletter = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('newsletter_id', id)
        .single();

      if (error) {
        Alert.alert('Error fetching newsletter');
      } else {
        setEditionNumber(data.edition_number);
        setLink(data.link);
        setPreviewImage(data.preview_image);
      }

      setLoading(false);
    };

    fetchNewsletter();
  }, [id]);

  const handleSave = async () => {
    if (!editionNumber) {
      Alert.alert('Edition number required');
      return;
    }

    const { error } = await supabase
      .from('news')
      .update({
        edition_number: editionNumber,
        link: link,
        preview_image: previewImage,
      })
      .eq('newsletter_id', id);

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert('Newsletter edited successfully');
    }

    router.push('/(tabs)/newsletter');
  };

  const handleCancel = () => {
    router.push('/(tabs)/newsletter');
  };

  if (loading) {
    return <ActivityIndicator size='large' color='#000000' />;
  }

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
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
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

  saveButton: {
    flex: 1,
    backgroundColor: '#86AE42',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 10,
  },

  saveText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 20,
  },
});
