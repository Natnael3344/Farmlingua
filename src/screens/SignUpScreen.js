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
  Image
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import { supabase } from '../config/supabase';
import { styles } from './CreateAccountScreen';
import Logo from '../components/Logo';
import ApiService from '../config/apiService'
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatusModal from '../components/StatusModal';
const SignUpScreen = ({ navigation,setSession,route }) => {
  const {emails}=route.params || {}
  console.log("emails",emails)
  const [name, setName] = useState('');
  const [email, setEmail] = useState(emails || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('success');
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
  
    const showModal = (type, title, message) => {
      setModalType(type);
      setModalTitle(title);
      setModalMessage(message);
      setModalVisible(true);
    };
  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      showModal(
        'error',
        'Sign Up Failed',
        'Password must be at least 8 characters.'
      );
      return;
    }

    setLoading(true);
    try {
      const userData = { 
        name, 
        email, 
        password 
      };
      const response = await ApiService.register(userData);
      await AsyncStorage.setItem('userToken', response.data.token);
      
      setSession(response.data.token);
      
      if (response.error) throw response.error;

     
      showModal(
        'success',
        'Success',
        'Account created successfully!'
      );
    } catch (error) {
      showModal(
        'error',
        'Sign Up Failed',
        error.response.data.error || 'Something went wrong. Please try again.'
      );
      console.log("account error",error.response.data.error)
    } finally {
      setLoading(false);
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
            <Logo/>
          </View>

          <Text style={[styles.title,{textAlign:'left'}]}>Sign up</Text>
          <Text style={[styles.subtitle,{textAlign:'left'}]}>Start your Farm Journey.</Text>

          <View style={styles.formContainer}>
            <Text style={{...typography.body,marginBottom:spacing.xs,color:colors.text}}>Name*</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={{...typography.body,marginBottom:spacing.xs,color:colors.text}}>Email*</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={{...typography.body,marginBottom:spacing.xs,color:colors.text}}>Password*</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Text style={style.hint}>Must be at least 8 characters.</Text>

            <TouchableOpacity
              style={[styles.primaryButton, loading && style.buttonDisabled]}
              onPress={handleSignUp}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Creating account...' : 'Get started'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton,{marginTop:spacing.md}]} activeOpacity={0.8}>
              <Image
                source={require('../assets/images/google.png')}
                style={styles.socialButtonIcon}
              />
              <Text style={styles.socialButtonText}>Sign up with Google</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.footerLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusModal
              visible={modalVisible}
              type={modalType}
              title={modalTitle}
              message={modalMessage}
              onClose={() => setModalVisible(false)}
            />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
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
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  socialButtonIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: spacing.md,
    width: 24,
    textAlign: 'center',
  },
  socialButtonText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '600',
  },
});

export default SignUpScreen;
