import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {
  spacing,
  typography,
  scaleHeight,
  scaleWidth,
} from '../utils/theme';
import { ThemeContext } from '../utils/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../utils/navigationRef';
import { resetToWelcome } from '../utils/RootNavigation';
// --- Utility Components (Simplified Placeholders) ---

// Placeholder for the profile image
const ProfileImage = ({ size, source }) => (
  <View style={{
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: '#ccc', 
    overflow: 'hidden',
  }}>
    {/* Using a placeholder image source for demonstration */}
    <Image
      source={{ uri: source || 'https://i.pravatar.cc/150?img=49' }} 
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    />
  </View>
);

// --- Settings Configuration Data ---

const settingsSections = [
  {
    title: 'General',
    options: [
      { name: 'Appearance', route: 'AppearanceSettings', isNavigatable: true, hasChevron: true },
    ],
  },
  {
    title: null, 
    options: [
      { name: 'Search Suggestions', isToggle: true, stateKey: 'searchSuggestions' },
    ],
  },
  {
    title: 'Voice & Speech',
    options: [
      { name: 'Language', route: 'LanguageSettings', isNavigatable: true, hasChevron: true },
      { name: 'Accent', route: 'AccentSettings', isNavigatable: true, hasChevron: true },
    ],
  },
  {
    title: 'About',
    options: [
      { name: 'Support', route: 'SupportScreen', isNavigatable: true },
      { name: 'Terms & Conditions', route: 'TermsScreen', isNavigatable: true },
      { name: 'Privacy Policy', route: 'PrivacyScreen', isNavigatable: true },
    ],
  },
];

// --- Main Settings Screen Component ---

const SettingsScreen = ({ navigation,onClose,setSession  }) => {
  const { isDarkMode, colors } = useContext(ThemeContext);
  
  // State for toggles
  const [settingsState, setSettingsState] = useState({
    searchSuggestions: true, 
  });

  const handleLogOut = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              // 1️⃣ Remove user token from storage
              await AsyncStorage.removeItem('userToken');

              // 2️⃣ Try Google sign out (in case user used Google login)
              const isSignedIn = await GoogleSignin.getCurrentUser();
              if (isSignedIn) {
                await GoogleSignin.signOut();
              }

                // 3️⃣ Reset navigation to Welcome screen
                setSession(null);

              console.log("User logged out successfully.");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Something went wrong while logging out.");
            }
          },
        },
      ]
    );
  };


  const handleToggle = (key) => {
    setSettingsState(prev => ({ ...prev, [key]: !prev[key] }));
  };


  
  const handleNavigation = (route) => {
    if (route) {
      console.log(`Navigating to ${route}`);
      // Future: navigation.navigate(route);
    }
  };
  
  const renderOption = (option) => (
    <TouchableOpacity
      key={option.name}
      // Apply different styles for Appearance as seen in the image
      style={[
        styles.settingOption,
      ]}
      onPress={() => option.isNavigatable ? handleNavigation(option.route) : null}
      // Disable touch feedback for toggle items
      activeOpacity={option.isToggle ? 1 : 0.7}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.settingText, { color: colors.text }]}>{option.name}</Text>
      </View>
      
      {/* Toggle Switch */}
      {option.isToggle && (
        <Switch
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.text}
          ios_backgroundColor={colors.border}
          onValueChange={() => handleToggle(option.stateKey)}
          value={settingsState[option.stateKey]}
          style={styles.switchStyle}
        />
      )}
      
      {/* Chevron Icon */}
      {option.hasChevron && (
        <Ionicons name="chevron-forward-outline" size={scaleHeight(20)} color={colors.textLight} />
      )}
      
      {/* Spacer for alignment */}
      {!option.isToggle && !option.hasChevron && <View style={{width: scaleHeight(20)}} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={[styles.header]}>
        {/* Back Arrow */}
        <TouchableOpacity onPress={() => onClose()}>
          <Ionicons name="arrow-back" size={scaleHeight(24)} color={colors.text} />
        </TouchableOpacity>
        
        {/* Title (hidden to match the image's layout) */}
        <Text style={[styles.headerTitle, { color: colors.text,marginLeft:scaleWidth(20) }]}>Settings</Text>
        
        {/* Close Icon */}
        <TouchableOpacity style={{position:'absolute', right: 0}} onPress={() => onClose()}>
          <Ionicons name="close" size={scaleHeight(24)} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <ProfileImage size={scaleHeight(80)} />
          <Text style={[styles.profileName, { color: colors.text }]}>Jide Lawal</Text>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={scaleHeight(16)} color={'blue'} />
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            {section.title && (
              <Text style={[styles.sectionTitle, { color: 'black' }]}>
                {section.title}
              </Text>
            )}
            {section.options.map(renderOption)}
          </View>
        ))}

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Text style={[styles.logoutText, { color: colors.error || 'red' }]}>Log Out</Text>
          <Ionicons name="log-out-outline" size={scaleHeight(24)} color={colors.error || 'red'} />
        </TouchableOpacity>
        
      </ScrollView>

      {/* Footer Version */}
      <Text style={[styles.versionText, { color: colors.textLight }]}>
        FarmLingua v1.00000024
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.sm },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: spacing.lg * 2 },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerTitle: { ...typography.title, fontWeight: 'bold', fontSize: scaleHeight(18) },

  // Profile Styles
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    marginLeft:spacing.lg
  },
  profileName: { 
    ...typography.body, 
    fontWeight: '600', 
    marginLeft: spacing.md 
  },
  editIcon: {
    marginLeft: spacing.sm,
  },
  
  // Section Styles
  sectionContainer: {
    marginBottom: spacing.xs,
    
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: 'bold',
    fontSize: scaleHeight(17),
    marginTop: spacing.sm,
    marginBottom: spacing.sm / 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: spacing.sm,
    marginHorizontal:spacing.md
  },
  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginVertical:spacing.xs,
    borderRadius: 8,
  },
  settingText: { 
    ...typography.bodySmall, 
    fontWeight: '500' 
  },
  switchStyle: {
    transform: [{ scaleX: scaleWidth(0.8) }, { scaleY: scaleHeight(0.8) }],
  },
  
  // Log Out Styles
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  logoutText: {
    ...typography.body,
    fontWeight: 'bold',
    marginRight: spacing.sm,
  },
  
  // Version Footer
  versionText: { 
    ...typography.bodySmall, 
    textAlign: 'center', 
    paddingVertical: spacing.md ,
    borderTopWidth:1,
    borderTopColor:'#E5E7EB'
  },
});

export default SettingsScreen;