import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, scaleHeight, scaleWidth, spacing, typography } from '../utils/theme';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('CreateAccount');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={{ alignItems: 'center', position: 'absolute', bottom: scaleHeight(200) }}>
        <Text style={styles.title}>Welcome to Farmlingua</Text>
      <Text style={styles.subtitle}>Your Foremost Farming Chatbot</Text>    
      </View>
      </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.xxl,
  },
  logo: {
    width: scaleWidth(69),
    height: scaleWidth(69),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
 
export default WelcomeScreen;
