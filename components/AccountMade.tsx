
import React, { useState } from 'react';
import {View, Text, Pressable, Image, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const AccountMade = () => {
  const router = useRouter();
    return(
        <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.backContainer}>
                <Pressable 
                  style={styles.backButton}
                  onPress={() => router.push('/signup')}
                  >
                <ChevronLeft size={20} />
                <Text style={styles.label}>Back to registration info</Text>
              </Pressable>
              </View>
              <Text style={styles.title}>Account Made!</Text>
              <Text style={styles.subtitle}>
              Thank you for helping us
              promote the work of our
              diverse and dedicated
              environmental organizations
              serving Santa Cruz County
              and beyond!</Text>
            
              <Image 
                source={require('../assets/images/email-check.png')} 
                style={styles.image}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.customButton,
                  pressed && styles.customButtonPressed,
                ]}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.customButtonText}>Go To Home</Text>
              </Pressable>
          </View>
        </View>
    )
};

export default AccountMade;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAEE',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 0,
  },

  subtitle: {
    fontSize: 33,
    marginBottom: 30,
  },

  label: {
    fontSize: 10,
    marginLeft: 4,
  },

  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 18,
 },

  customButton: {
    backgroundColor: '#88B04B',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },

  customButtonPressed: {
    backgroundColor: '#75a03f',
  },

  customButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  backContainer: {
    marginTop: 10,
    marginBottom: 6,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})
