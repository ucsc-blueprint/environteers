import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export interface LandingPageProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
}
export const LandingPage = ({onLoginClick, onRegisterClick}: LandingPageProps) => {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>
        environteers
      </Text>
      <Text style={styles.subtitle}>
        Inspiring informed action.
      </Text>
      <Text style={styles.text}>
        Environteers provides easy access to environmental news and volunteer opportunities.
      </Text>
        <Pressable onPress={onLoginClick} style={styles.buttonLogin}>Login</Pressable>
        <Pressable onPress={onRegisterClick} style={styles.buttonRegister}>Make an account</Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100
  },
  title: {
    fontSize: 48,
    fontWeight: 500
  },
  subtitle: {
    fontSize: 24,
    marginTop: 24
  },
  text: {
    fontSize: 20,
    marginTop: 48,
    textAlign: "center",
    width: 288
  },
  buttonLogin: {
    borderRadius: 4,
    backgroundColor: "#86AE42",
    padding: 10,
    fontFamily: "Arial",
    color: "white",
    marginTop: 48,
    width: 288,
    textAlign: "center",
    fontSize: 23
  },
  buttonRegister: {
    borderRadius: 4,
    backgroundColor: "#86AE42",
    padding: 10,
    fontFamily: "Arial",
    color: "white",
    marginTop: 20,
    width: 288,
    textAlign: "center",
    fontSize: 23
  }
});


export default LandingPage;