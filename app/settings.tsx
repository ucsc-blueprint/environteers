import React from "react";
import ProfileSettings from "../components/ProfileSettings";
import { supabase } from "../constants/supabase";

export default function Settings() {
  const handleProfileUpdate = async (
    username: string,
    email: string,
    currentPassword: string,
    password: string
  ): Promise<string | null> => {

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "User not logged in";

    const trimmedUsername = username.trim();

    // Handle password update
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

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        return "Failed to update password";
      }
    }

    // Handle username update
    if (trimmedUsername !== "") {
      const { error } = await supabase
        .from("users")
        .update({ username: trimmedUsername })
        .eq("user_id", user.id);

      if (error) {
        return "Failed to update username";
      }
    }

    return null;
  };

  return <ProfileSettings onSubmit={handleProfileUpdate} />;
}