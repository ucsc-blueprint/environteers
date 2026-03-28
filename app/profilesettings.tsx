import React from "react";
import { useAuth } from "@/context/AuthContext";
import ProfileSettings from "../components/ProfileSettings";
import { supabase } from "../constants/supabase";
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();

  const handleProfileUpdate = async (
    username: string,
    email: string,
    currentPassword: string,
    password: string
  ): Promise<string | null> => {
    if (!user) return "User not logged in";

    const trimmedUsername = username.trim();
    let passwordChanged = false;

    // If user wants to change password, verify current password first
    if (password) {

      if (!currentPassword) {
        return "Please enter your current password";
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (loginError) {
        return "Current password is incorrect";
      }
    }

    // Update username
    if (trimmedUsername !== "" && trimmedUsername !== profile?.username) {
      const { error } = await supabase
        .from("users")
        .update({ username: trimmedUsername })
        .eq("user_id", user.id);

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to update username',
        });
        return null;
      }
    }

    // Update email
    const trimmedEmail = email.trim();
    if (trimmedEmail !== "" && trimmedEmail !== user?.email) {
      const { error } = await supabase.auth.updateUser({
        email: trimmedEmail,
      });

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to update email',
        });
        return null;
      }
    }

    // Update password AFTER username and email
    if (password) {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Failed to update password',
        });
        return null;
      }

      passwordChanged = true;
    }

    // Logout after password change
    if (passwordChanged) {
      await supabase.auth.signOut();
      Toast.show({
        type: 'success',
        text1: 'Password updated. Please log in again.',
      });
      return null;
    }

    await refreshProfile();
    Toast.show({
      type: 'success',
      text1: 'Profile updated successfully',
    });
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EAF2F6' }}>
      <ProfileSettings
        onSubmit={handleProfileUpdate}
        initialUsername={profile?.username ?? ""}
        initialEmail={user?.email ?? ""}
      />
    </SafeAreaView>
  );
}
