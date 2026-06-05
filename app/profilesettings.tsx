import React from "react";
import { useAuth } from "@/context/AuthContext";
import ProfileSettings from "../components/ProfileSettings";
import { supabase } from "../constants/supabase";
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth();

  const handleProfileUpdate = async (
    firstName: string,
    lastName: string,
    email: string,
    currentPassword: string,
    password: string,
    profilePicture: string | null,
  ): Promise<string | null> => {
    if (!user) return "User not logged in";

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    let passwordChanged = false;

    // Must fill out both current and new password, not just one
    if ((currentPassword && !password) || (password && !currentPassword)) {
        return "Please fill in all password fields";
    }

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

    // Update name
    if (trimmedFirstName !== "" || trimmedLastName !== "") {
      const updates = {};

      if (trimmedFirstName !== "" && trimmedFirstName !== profile?.first_name) {
        updates.first_name = trimmedFirstName;
      }

      if (trimmedLastName !== "" && trimmedLastName !== profile?.last_name) {
        updates.last_name = trimmedLastName;
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from("users")
          .update(updates)
          .eq("user_id", user.id);

        if (error) {
          Toast.show({
            type: 'error',
            text1: 'Failed to update name',
          });
          return null;
        }
      }
    }

    // Update profile picture
    if (profilePicture !== (profile?.profile_picture ?? null)) {
      const { error } = await supabase
        .from('users')
        .update({ profile_picture: profilePicture || null })
        .eq('user_id', user.id);

      if (error) {
        Toast.show({ type: 'error', text1: 'Failed to update profile picture' });
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

    // Update password AFTER name and email
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
        initialFirstName={profile?.first_name ?? ""}
        initialLastName={profile?.last_name ?? ""}
        initialEmail={user?.email ?? ""}
        initialProfilePicture={profile?.profile_picture ?? null}
      />
    </SafeAreaView>
  );
}
