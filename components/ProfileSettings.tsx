import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Pressable, Image, Switch, StyleSheet, TextInput, GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';

export interface ProfileSettingsProps {
  onSubmit: (
    username: string,
    email: string,
    currentPassword: string,
    password: string
  ) => Promise<string | null>; //thanks to this, we can return an error message if the update fails, or null if it succeeds
  initialUsername?: string;
  initialEmail?: string;
}

const ProfileSettings = ({ onSubmit, initialUsername = '', initialEmail = '' }: ProfileSettingsProps) => {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);

  // Update initial username + email once they finish fetching
  useEffect(() => {
    setUsername(initialUsername);
    setEmail(initialEmail);
  }, [initialUsername, initialEmail]);

  const [currentPassword, setCurrentPassword] = useState(''); 
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Only enable save changes button if user has made updates
  const hasChanges =
    username !== initialUsername ||
    email !== initialEmail ||
    (currentPassword != "" &&
    newPassword !== "" &&
    confirmPassword !== "");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');

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

  return (
    <View style={styles.container}>
    <View style={styles.content}>
      <View style={styles.backContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push('/profile')}
        >
          <ChevronLeft size={24} />
          <Text style={styles.title}>Manage Account</Text>
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
              pressed && styles.changeButtonPressed,
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.customButtonText}>Change Profile Photo</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.deleteButtonText}>Remove Profile Photo</Text>
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
        paddingHorizontal: 24,
        paddingBottom: 40,
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
        backgroundColor: '#86AE42',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },

    boxButton: {
        flexDirection: 'column',
        gap: 10,
        flex: 1,
    },

    profileButton: {
        backgroundColor: '#76BAE4',
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },

    deleteButton: {
        backgroundColor: '#FFECEF',
        borderColor: '#D8021C',
        borderWidth: 2,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },

    changeButtonPressed: {
        backgroundColor: '#0282D3',
    },

    saveButtonPressed: {
        backgroundColor: '#76BAE4',
    },

    saveButtonDisabled: {
        backgroundColor: '#B0C4D8',
    },

    deleteButtonPressed: {
        backgroundColor: '#d46976',
    },

    deleteButtonText: {
        color: '#D8021C',
        fontSize: 13,
        fontWeight: '600',
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
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
        marginBottom: 12,
        fontSize: 14,
        color: '#172A36',
    },

    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 16,
    },

    toggleSwitch: {
        position: 'relative',
        width: 60,
        height: 34
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
