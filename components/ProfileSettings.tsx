import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  GestureResponderEvent,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/constants/supabase';
import { UserAvatar } from './UserAvatar';

export interface ProfileSettingsProps {
  onSubmit: (
    firstName: string,
    lastName: string,
    email: string,
    currentPassword: string,
    password: string,
    profilePicture: string,
  ) => Promise<string | null>;
  initialFirstName?: string;
  initialLastName?: string;
  initialEmail?: string;
  initialProfilePicture?: string | null;
}

const ProfileSettings = ({
  onSubmit,
  initialFirstName = '',
  initialLastName = '',
  initialEmail = '',
  initialProfilePicture = null,
}: ProfileSettingsProps) => {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [profilePicture, setProfilePicture] = useState<string | null>(
    initialProfilePicture ?? null,
  );
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  useEffect(() => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setEmail(initialEmail);
    setProfilePicture(initialProfilePicture ?? null);
  }, [initialFirstName, initialLastName, initialEmail, initialProfilePicture]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const hasChanges =
    firstName !== initialFirstName ||
    lastName !== initialLastName ||
    email !== initialEmail ||
    profilePicture !== initialProfilePicture ||
    (currentPassword !== '' && newPassword !== '' && confirmPassword !== '');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');

  const handleChangePicture = async () => {
    if (!status?.granted) {
      await requestPermission();
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const handleRemovePicture = () => {
    setProfilePicture(null);
  };

  const uploadProfilePicture = async (uri: string): Promise<string | null> => {
    if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
    try {
      const fileName = `${Date.now()}.jpg`;
      const filePath = `user_uploads/${fileName}`;
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      const bytes = decode(base64);
      const { error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, bytes, { contentType: 'image/jpeg' });
      if (error) throw error;
      const { data } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleSubmit = async (_event: GestureResponderEvent) => {
    setError('');

    if (email !== initialEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError('Password must include at least 8 characters');
      return;
    }

    let uploadedUrl = profilePicture ?? '';
    if (profilePicture && !profilePicture.startsWith('http')) {
      const url = await uploadProfilePicture(profilePicture);
      if (!url) {
        setError('Failed to upload profile picture');
        return;
      }
      uploadedUrl = url;
    }

    const result = await onSubmit(
      firstName,
      lastName,
      email,
      currentPassword,
      newPassword,
      uploadedUrl,
    );

    if (result) {
      setError(result);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.backContainer}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} />
            <Text style={styles.title}>Manage Account</Text>
          </Pressable>
        </View>

        <Text style={styles.header}>Profile</Text>
        <View style={styles.avatarRow}>
          <UserAvatar
            firstName={firstName}
            lastName={lastName}
            photoUrl={profilePicture}
            size={80}
          />
          <View style={styles.photoButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.changePhotoButton,
                pressed && styles.changePhotoButtonPressed,
              ]}
              onPress={handleChangePicture}
            >
              <Text style={styles.changePhotoText}>Change Profile Photo</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.removePhotoButton,
                pressed && styles.removePhotoButtonPressed,
              ]}
              onPress={handleRemovePicture}
            >
              <Text style={styles.removePhotoText}>Remove Profile Photo</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.subtitle2}>First Name</Text>
        <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} />

        <Text style={styles.subtitle2}>Last Name</Text>
        <TextInput value={lastName} onChangeText={setLastName} style={styles.input} />

        <Text style={styles.subtitle2}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <Text style={styles.header}>Password Reset</Text>
        <View style={styles.passwordCard}>
          <Text style={styles.subtitle2}>Current Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent}
              placeholder='Enter old password'
              placeholderTextColor='#aaa'
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <Pressable style={styles.eyeIcon} onPress={() => setShowCurrent((prev) => !prev)}>
              {showCurrent ? <EyeOff size={18} color='#aaa' /> : <Eye size={18} color='#aaa' />}
            </Pressable>
          </View>

          <Text style={styles.subtitle2}>New Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              value={newPassword}
              secureTextEntry={!showNew}
              onChangeText={setPassword}
              placeholder='Enter new password'
              placeholderTextColor='#aaa'
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <Pressable style={styles.eyeIcon} onPress={() => setShowNew((prev) => !prev)}>
              {showNew ? <EyeOff size={18} color='#aaa' /> : <Eye size={18} color='#aaa' />}
            </Pressable>
          </View>
          <Text style={styles.label}>Must include at least 8 characters</Text>

          <Text style={styles.subtitle2}>Confirm Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              value={confirmPassword}
              secureTextEntry={!showConfirm}
              onChangeText={setConfirmPassword}
              placeholder='Confirm new password'
              placeholderTextColor='#aaa'
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <Pressable style={styles.eyeIcon} onPress={() => setShowConfirm((prev) => !prev)}>
              {showConfirm ? <EyeOff size={18} color='#aaa' /> : <Eye size={18} color='#aaa' />}
            </Pressable>
          </View>
        </View>

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            !hasChanges && styles.saveButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!hasChanges}
        >
          <Text style={styles.customButtonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileSettings;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF2F6',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 6,
    fontWeight: 'bold',
  },

  subtitle2: {
    fontSize: 15,
    fontWeight: '600',
    color: '#172A36',
    marginBottom: 6,
  },

  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172A36',
    marginBottom: 8,
    marginTop: 8,
  },

  label: {
    fontSize: 12,
    marginLeft: 4,
    color: '#808080',
    marginBottom: 14,
    marginTop: -5,
  },

  saveButton: {
    backgroundColor: '#618E20',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },

  saveButtonPressed: {
    backgroundColor: '#4e7018',
  },

  saveButtonDisabled: {
    backgroundColor: '#B0C4D8',
  },

  boxButton: {
    flexDirection: 'column',
    gap: 10,
    flex: 1,
  },

  customButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },

  backContainer: {
    marginTop: 16,
    marginBottom: 20,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    height: 35,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    fontSize: 14,
    color: '#172A36',
  },

  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    backgroundColor: '#D9D9D9',
  },

  photoButtons: {
    flex: 1,
    gap: 8,
  },

  changePhotoButton: {
    backgroundColor: '#4695FF',
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },

  changePhotoButtonPressed: {
    backgroundColor: '#2176d9',
  },

  changePhotoText: {
    color: '#F2F7F5',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },

  removePhotoButton: {
    backgroundColor: '#FFECEF',
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF4163',
  },

  removePhotoButtonPressed: {
    backgroundColor: '#ffd0d8',
  },

  removePhotoText: {
    color: '#FF4163',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },

  image: {
    borderRadius: 50,
    marginLeft: 20,
    width: 102,
    height: 102,
    marginBottom: 12,
  },

  passwordCard: {
    backgroundColor: '#D9E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 12,
  },

  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
});
