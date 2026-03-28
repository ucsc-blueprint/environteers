import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const LandingPage = () => {
  const router = useRouter();
  return (
    <ImageBackground
      source={require('../assets/images/naturalbridges.jpg')}
      style={styles.background}
      resizeMode={'cover'}>
      <View style={styles.overlay}/>
      <View style={styles.box}>
        <Text style={styles.title}>
          environteers
        </Text>
        <Text style={styles.subtitle}>
          Inspiring informed action in Santa Cruz County <Text style={styles.italic}>and beyond.</Text>
        </Text>
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => router.push('/login')} style={styles.buttonLogin}><Text style={styles.buttonText}>Login</Text></Pressable>
          <Pressable onPress={() => router.push('/signup')} style={styles.buttonRegister}><Text style={styles.buttonText}>Make an account</Text></Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.35)'
  },
  box: {
    flex: 1,
    flexDirection: "column",
    marginTop: 40,
    alignItems: "center"
  },
  title: {
    fontSize: 48,
    fontWeight: 500,
    color: "#86AE42"
  },
  subtitle: {
    fontSize: 20,
    marginTop: 24,
    textAlign: "center",
    width: 288,
    color: "#45483D"
  },
  italic: {
    fontSize: 20,
    fontStyle: "italic",
    width: 288
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 60,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 120
  },
  buttonLogin: {
    borderRadius: 8,
    backgroundColor: "#4F6629",
    padding: 10,
    width: 288
  },
  buttonRegister: {
    borderRadius: 8,
    backgroundColor: "#4F6629",
    padding: 10,
    width: 288,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    textAlign: "center"
  }
});


export default LandingPage;
