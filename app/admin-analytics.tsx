import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';

export default function AdminAnalytics() {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileCircle} />
        <Text style={styles.profileName}>Volunteer Name</Text>
        <Text style={styles.membershipText}>Member for 3 years</Text>
      </View>
      
      <View style={styles.row}>
        <View style={[styles.button, styles.hoursButton]}>
          <Text style={styles.buttonText}>117</Text>
          <Text style={styles.buttonSubtext}>Hours tracked</Text>
        </View>
        
        <View style={[styles.button, styles.actionsButton]}>
          <Text style={styles.buttonText}>23</Text>
          <Text style={styles.buttonSubtext}>Eco-Actions</Text>
        </View>
      </View>
      
      <View style={styles.bottomButton}>
        <View style={styles.buttonContent}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Status: Pending</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>View Eco-Action Details </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
  },
  profileContainer: {
    width: 138,
    height: 141,
    marginTop: 32,
    alignItems: 'center',
    gap: 10,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9D9D9',
    marginBottom: 10,
  },
  profileName: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
  },
  membershipText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
    color: '#666666',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    width: '100%',
    paddingHorizontal: 16,
  },
  button: {
    borderRadius: 9.05,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hoursButton: {
    width: 138,
    height: 141,
    backgroundColor: '#0282D3',
    marginRight: 20,
  },
  actionsButton: {
    width: 138,
    height: 141,
    backgroundColor: '#79B128',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: 0,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  buttonSubtext: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomButton: {
    width: 358,
    height: 48,
    marginTop: 32,
    backgroundColor: '#ECF3F7',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  statusContainer: {
    width: 125,
    height: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    transform: [{ rotate: '180deg' }],
  },
  statusText: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 15,
    color: '#000000',
    transform: [{ rotate: '180deg' }],
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailsText: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
  },
} as const;