import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import { supabase } from '../config/supabase';
import { styles } from './CreateAccountScreen';
import Logo from '../components/Logo';
import ApiService from '../config/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginScreen = ({ navigation,setSession }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userData = { 
              email, 
              password 
            };
            const response = await ApiService.login(userData);
            console.log("Login response:", response);
            const userToken= await AsyncStorage.setItem('userToken', response.data.token);
            if (response.error) throw response.error;
            setSession(userToken)
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("User Info:", userInfo);
      const idToken = userInfo.data.idToken;
      const response = await ApiService.socialGoogleLogin({ idToken });
      await AsyncStorage.setItem('userToken', response.data.token);
      if (response.status === 200) {
        const { token, userId } = response.data;
        // Save token securely (AsyncStorage/SecureStore)
        // Navigate to authenticated part of your app
        console.log('Logged in user with id:', userId);
      } else {
        // Handle unexpected response
        console.error('Authentication failed:', response.data);
      }
      console.log(userInfo);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
           <Logo/>
          </View>

          <Text style={[styles.title,{textAlign:'left',marginTop:spacing.xl}]}>Log in</Text>
          <Text style={[styles.subtitle,{textAlign:'left',marginBottom:spacing.xs}]}>Welcome back! Please enter your details.</Text>

          <View style={styles.formContainer}>
            <Text style={{...typography.body,marginBottom:spacing.xs,color:colors.text}}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={{...typography.body,marginBottom:spacing.xs,color:colors.text}}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={style.optionsRow}>
              <TouchableOpacity
                style={style.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View style={[style.checkbox, rememberMe && style.checkboxChecked]}>
                  {rememberMe && <Text style={style.checkmark}>✓</Text>}
                </View>
                <Text style={style.checkboxLabel}>Remember for 30 days</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={style.forgotPassword}>Forgot password</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && style.buttonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleGoogleSignIn} style={[styles.socialButton,{marginTop:spacing.md}]} activeOpacity={0.8}>
              <Image
                source={require('../assets/images/google.png')}
                style={styles.socialButtonIcon}
              />
              <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    ...typography.bodySmall,
    color: colors.text,
  },
  forgotPassword: {
    ...typography.bodySmall,
    color: colors.secondary,
    fontWeight: '600',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

});

export default LoginScreen;
