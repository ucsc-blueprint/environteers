import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, GestureResponderEvent, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/constants/supabase';
import { ProfileAvatar } from './ProfileAvatar';

export interface ProfileSettingsProps {
  onSubmit: (
    firstName: string,
    lastName: string,
    email: string,
    currentPassword: string,
    password: string,
    profilePictureUrl?: string
  ) => Promise<string | null>; //thanks to this, we can return an error message if the update fails, or null if it succeeds
  initialFirstName?: string;
  initialLastName?: string;
  initialEmail?: string;
  initialProfilePictureUrl?: string;
  userId?: string;
}

const ProfileSettings = ({ onSubmit, initialFirstName = '', initialLastName = '', initialEmail = '', initialProfilePictureUrl, userId }: ProfileSettingsProps) => {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [profilePictureUrl, setProfilePictureUrl] = useState(initialProfilePictureUrl);

  // Update initial name + email once they finish fetching
  useEffect(() => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setEmail(initialEmail);
    setProfilePictureUrl(initialProfilePictureUrl);
  }, [initialFirstName, initialLastName, initialEmail, initialProfilePictureUrl]);

  const [currentPassword, setCurrentPassword] = useState(''); 
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Only enable save changes button if user has made updates
  const hasChanges =
    firstName !== initialFirstName ||
    lastName !== initialLastName ||
    email !== initialEmail ||
    profilePictureUrl !== initialProfilePictureUrl ||
    (currentPassword !== "" &&
    newPassword !== "" &&
    confirmPassword !== "");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setUploading(true);
        const imageUri = result.assets[0].uri;
        
        if (!userId) {
          setError('User ID not found');
          setUploading(false);
          return;
        }

        // Upload to Supabase Storage
        const fileName = `${userId}/${Date.now()}.jpg`;
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: fileName,
        } as any);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, formData as any, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (uploadError) {
          setError('Failed to upload image');
          setUploading(false);
          return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(fileName);

        setProfilePictureUrl(publicUrl);
        setUploading(false);
      }
    } catch (err) {
      setError('Failed to pick image');
      setUploading(false);
    }
  };

  const removeProfilePicture = () => {
    Alert.alert(
      'Remove Profile Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setProfilePictureUrl(undefined),
        },
      ]
    );
  };

  const handleSubmit = async (_event: GestureResponderEvent) => {
    setError("");

    if (email !== initialEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError("Password must include at least 8 characters");
      return;
    }

    const result = await onSubmit(
      firstName,
      lastName,
      email,
      currentPassword,
      newPassword,
      profilePictureUrl
    );

    if (result) {
      setError(result);
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.content}>
      <View style={styles.backContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} />
          <Text style={styles.title}>Manage Account</Text>
        </Pressable>
      </View>

      <Text style={styles.header}>Profile</Text>
      <View style={styles.avatarRow}>
        <ProfileAvatar
          profilePictureUrl={profilePictureUrl}
          firstName={firstName}
          lastName={lastName}
          size={80}
        />
        <View style={styles.photoButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.changePhotoButton,
              pressed && styles.changePhotoButtonPressed,
              uploading && styles.changePhotoButtonDisabled,
            ]}
            onPress={pickImage}
            disabled={uploading}
          >
            <Text style={styles.changePhotoText}>
              {uploading ? 'Uploading...' : 'Change Profile Photo'}
            </Text>
          </Pressable>
          {profilePictureUrl && (
            <Pressable
              style={({ pressed }) => [
                styles.removePhotoButton,
                pressed && styles.removePhotoButtonPressed,
              ]}
              onPress={removeProfilePicture}
            >
              <Text style={styles.removePhotoText}>Remove Profile Photo</Text>
            </Pressable>
          )}
        </View>
      </View>

      <Text style={styles.subtitle2}>First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <Text style={styles.subtitle2}>Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <Text style={styles.subtitle2}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.header}>Password Reset</Text>
      <View style={styles.passwordCard}>
        <Text style={styles.subtitle2}>Current Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrent}
            placeholder="Enter old password"
            placeholderTextColor="#aaa"
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
          <Pressable style={styles.eyeIcon} onPress={() => setShowCurrent(prev => !prev)}>
            {showCurrent ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
          </Pressable>
        </View>

        <Text style={styles.subtitle2}>New Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            value={newPassword}
            secureTextEntry={!showNew}
            onChangeText={setPassword}
            placeholder="Enter new password"
            placeholderTextColor="#aaa"
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
          <Pressable style={styles.eyeIcon} onPress={() => setShowNew(prev => !prev)}>
            {showNew ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
          </Pressable>
        </View>
        <Text style={styles.label}>Must include at least 8 characters</Text>

        <Text style={styles.subtitle2}>Confirm Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            value={confirmPassword}
            secureTextEntry={!showConfirm}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#aaa"
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
          <Pressable style={styles.eyeIcon} onPress={() => setShowConfirm(prev => !prev)}>
            {showConfirm ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
          </Pressable>
        </View>
      </View>

      {error !== '' && (
        <Text style={styles.error}>{error}</Text>
      )}

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
    </View>
    </View>
  )
};

export default ProfileSettings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAF2F6',
    },

    content: {
        flex: 1,
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
        fontWeight: 'bold'
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

    changePhotoButtonDisabled: {
        opacity: 0.6,
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
})
