import React from "react";
import { useAuth } from "@/context/AuthContext";
import ProfileSettings from "../components/ProfileSettings";
import { supabase } from "../constants/supabase";
import Toast from 'react-native-toast-message';

export default function Settings() {
  const { user, profile } = useAuth();

  const handleProfileUpdate = async (
    username: string,
    email: string,
    currentPassword: string,
    password: string
  ): Promise<string | null> => {

    const { data: { user } } = await supabase.auth.getUser();
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
    if (trimmedUsername !== "") {
      const { error } = await supabase
        .from("users")
        .update({ username: trimmedUsername })
        .eq("user_id", user.id);

      if (error) {
        return "Failed to update username";
      }
    }

    // Update password AFTER username
    if (password) {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        return "Failed to update password";
      }

      passwordChanged = true;
    }

    // Logout after password change
    if (passwordChanged) {
      await supabase.auth.signOut();
      return "Password updated. Please log in again.";
    }

    Toast.show({
      type: 'success',
      text1: 'Profile updated successfully',
    });
    return null;
  };

  return <ProfileSettings
    onSubmit={handleProfileUpdate}
    initialUsername={profile?.username ?? ""}
    initialEmail={user?.email ?? ""}
  />;
}
