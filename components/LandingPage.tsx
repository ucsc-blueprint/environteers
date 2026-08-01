import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const LandingPage = () => {
  const router = useRouter();
  return (
    <ImageBackground
      source={require('../assets/images/naturalbridges.jpg')}
      style={styles.background}
      resizeMode={'cover'}
    >
      <View style={styles.overlay} />
      <View style={styles.box}>
        <View style={{ flex: 128 }} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>environteers</Text>
          <Text style={styles.subtitle}>
            Inspiring informed action {'\n'}in Santa Cruz County {'\n'}
            <Text style={styles.italic}>and beyond.</Text>
          </Text>
        </View>
        <View style={{ flex: 97 }} />
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => router.push('/login')} style={styles.buttonLogin}>
            <Text style={styles.buttonTextLight}>Login</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/signup')} style={styles.buttonRegister}>
            <Text style={styles.buttonTextGreen}>Create Account</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/login?isAdmin=true')}
            style={styles.buttonAdminLogin}
          >
            <Text style={styles.buttonTextLight}>Admin Login</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/signup?isAdmin=true')}
            style={styles.buttonAdminRegister}
          >
            <Text style={styles.buttonTextNavy}>Admin Create Account</Text>
          </Pressable>
        </View>
        <View style={{ flex: 97 }} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  box: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 54,
    fontWeight: 600,
    color: '#86AE42',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
    color: '#45483D',
  },
  italic: {
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: 307,
    gap: 8,
  },
  buttonLogin: {
    borderRadius: 12,
    backgroundColor: '#3A5513',
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRegister: {
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3A5513',
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAdminLogin: {
    borderRadius: 12,
    backgroundColor: '#172A36',
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 56,
  },
  buttonAdminRegister: {
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#172A36',
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextLight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F2F7F5',
  },
  buttonTextGreen: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3A5513',
  },
  buttonTextNavy: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172A36',
  },
});

export default LandingPage;
