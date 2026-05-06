import React from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Text, ViewStyle, TextStyle, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ProfileButtonProps {
  label: string;
  onPress: () => void;
  header?: string;
  eventText?: string;
  isAchievements?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function ProfileButton({ 
  label, 
  onPress, 
  header, 
  eventText, 
  isAchievements = false,
  style, 
  textStyle 
}: ProfileButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={[styles.buttonText, textStyle]}>{label}</Text>
          <MaterialIcons 
            name="keyboard-arrow-up" 
            size={24} 
            style={styles.icon} 
          />
        </View>
        
        {isAchievements ? (
          <View style={styles.ellipsesContainer}>
            {[5, 10, 20, 25, 30].map((number, index) => (
              <View key={index} style={styles.ellipseWrapper}>
                <View style={styles.ellipse}>
                  <Text style={styles.ellipseText}>{number}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.eventsContainer}>
            {header && <Text style={styles.eventsLabel}>{header}</Text>}
            {eventText && <Text style={styles.eventItem}>{eventText}</Text>}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function ProfileButtons() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ProfileButton
        label="Eco Action History"
        header="Recently logged:"
        eventText="SC Mountains Trail Stewardship: Hike & Help at Arana Gulch"
        onPress={() => router.push('/eco-action-history')}
      />
      <View style={styles.spacer} />
      <ProfileButton
        label="Upcoming"
        header="Scheduled events:"
        eventText="• Nov 31: SC Mountains Trail Stewardship: Hike & Help at Arana Gulch..."
        onPress={() => router.push('/upcoming')}
      />
      <ProfileButton
      label="Account"
      header="Options:"
      eventText="Change username & password"
      onPress={() => router.push('/profilesettings')}
      />
    </View>
  );
  
}

const styles = {
  container: {
    width: '100%',
  },
  button: {
    width: '100%',
    height: 123,
    borderWidth: 1,
    borderRadius: 9.05,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ellipsesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 10,
  },
  ellipseWrapper: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  ellipse: {
    width: 39,
    height: 39,
    borderRadius: 19.5,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0,
  },
  icon: {
    transform: [{ rotate: '90deg' }],
  },
  eventsContainer: {
    marginTop: 8,
  },
  eventsLabel: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontStyle: 'normal',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
    opacity: 0.9,
    marginBottom: 4,
  },
  eventItem: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
  },
  ellipseText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
  },
  spacer: {
    height: 16,
  },
} as const;