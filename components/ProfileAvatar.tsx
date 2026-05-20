import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProfileAvatarProps {
  profilePictureUrl?: string;
  firstName?: string;
  lastName?: string;
  size?: number;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profilePictureUrl,
  firstName = '',
  lastName = '',
  size = 80,
}) => {
  const getInitials = (first: string, last: string) => {
    const firstInitial = first.trim().charAt(0).toUpperCase();
    const lastInitial = last.trim().charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  const initials = getInitials(firstName, lastName);

  if (profilePictureUrl) {
    return (
      <Image
        source={{ uri: profilePictureUrl }}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        styles.initialsContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          { fontSize: size * 0.4 },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#D9D9D9',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#618E20',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
