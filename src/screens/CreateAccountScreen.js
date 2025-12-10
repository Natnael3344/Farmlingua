import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import Logo from '../components/Logo'
import { colors, spacing, typography, borderRadius, shadows, scaleWidth, scaleHeight } from '../utils/theme';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ApiService from '../config/apiService';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';
const CreateAccountScreen = ({ navigation,setSession }) => {
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    navigation.navigate('SignUp',{emails:email});
  };

  const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log("User Info:", userInfo);
    const idToken = userInfo.data.idToken;
    const response = await ApiService.socialGoogleLogin({ idToken });
    console.log("response",response)
    if (response.status === 200) {
      const { token, userId } = response.data;
      const userToken= await AsyncStorage.setItem('userToken', response.data.token);
      setSession(userToken)
      // Save token securely (AsyncStorage/SecureStore)
      // Navigate to authenticated part of your app
      console.log('Logged in user with id:', userId);
      
    } else {
      // Handle unexpected response
      console.error('Authentication failed:', response.data);
    }
    console.log(userInfo);
  } catch (error) {
    console.error(error.response);
  }
};
const handleFacebookSignIn = async () => {
  try {
    // Start Facebook login prompt
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      console.log('Facebook login cancelled');
      return;
    }

    // Get access token
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw new Error('Failed to get Facebook access token');
    }

    // Send access token to backend for validation and JWT
    const response = await ApiService.socialFacebookLogin({ accessToken: data.accessToken.toString() });

    if (response.status === 200) {
      const { token, userId } = response.data;
      console.log('Logged in with Facebook user id:', userId);

      // Store token and continue with authenticated app flow
    } else {
      console.error('Facebook login failed:', response.data);
    }
  } catch (error) {
    console.error('Facebook sign-in error:', error);
  }
};
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Logo />
          </View>

          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Start your Farm Journey.</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Get started</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.8} onPress={handleGoogleSignIn}>
              <Image
                source={require('../assets/images/google.png')}
                style={styles.socialButtonIcon}
              />
              <Text style={styles.socialButtonText}>Sign up with Google</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.socialButton} activeOpacity={0.8} onPress={handleFacebookSignIn}>
              <Image
                source={require('../assets/images/facebook.png')}
                style={styles.socialButtonIcon}
              />
              <Text style={styles.socialButtonText}>Sign up with Facebook</Text>
            </TouchableOpacity> */}

            {Platform.OS=='ios' && <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
              <Image
                source={require('../assets/images/apple.png')}
                style={styles.socialButtonIcon}
              />
              <Text style={styles.socialButtonText}>Sign up with Apple</Text>
            </TouchableOpacity>}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.footerLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign:'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.text,
    marginBottom: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    // ...shadows.small,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textLight,
    marginHorizontal: spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap:spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  socialButtonIcon: {
    width:scaleWidth(20),
    height:scaleWidth(20)
  },
  socialButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight:'500',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    fontSize:scaleHeight(14),
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.body,
    color: colors.secondary,
    fontSize:scaleHeight(14),
    fontWeight: '600',
  },
});

export default CreateAccountScreen;
