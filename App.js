// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';  
import { StatusBar, Text, View } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WelcomeScreen from './src/screens/WelcomeScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import ChatHomeSelectorScreen from './src/screens/ChatHomeSelectorScreen';
import ChatTypingScreen from './src/screens/ChatTypingScreen';
import VoiceChatScreen from './src/screens/VoiceChatScreen';
import ChatResponseScreen from './src/screens/ChatResponseScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent'; 
import { ThemeProvider } from './src/utils/ThemeContext';
import SettingsDrawerLayout from './src/utils/SettingsDrawer';
import { navigationRef } from './src/utils/navigationRef';
import {ProfileProvider} from './src/utils/ProfileContext'
import AppearanceSettings from './src/settings/AppearanceSettings'
import AccentSettings from './src/settings/AccentSettings'
import LanguageSettings from './src/settings/LanguageSettings'
import PrivacyPolicy from './src/settings/PrivacyPolicy'
import SupportScreen from './src/settings/SupportScreen'
import TermsConditions from './src/settings/TermsConditions'
enableScreens();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();  

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="ChatHomeSelector" component={ChatHomeSelectorScreen} />
    <Stack.Screen name="ChatTyping" component={ChatTypingScreen} />
    <Stack.Screen name="VoiceChat" component={VoiceChatScreen} />
    <Stack.Screen name="ChatResponse" component={ChatResponseScreen} />
    
  </Stack.Navigator>
);

const DrawerApp = ({ setSession }) => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} setSession={setSession}/>}
    screenOptions={{
      headerShown: false,
      drawerType: 'slide', 
      overlayColor: 'rgba(0, 0, 0, 0.4)', 
    }}
  >
    <Drawer.Screen name="AppContent" component={AuthStack} />
    <Drawer.Screen name="ChatScreen" component={ChatHomeSelectorScreen} />
    <Drawer.Screen name="Appearance" component={AppearanceSettings} />
    <Drawer.Screen name="Accent" component={AccentSettings} />
    <Drawer.Screen name="Language" component={LanguageSettings} />
    <Drawer.Screen name="Privacy" component={PrivacyPolicy} />
    <Drawer.Screen name="Support" component={SupportScreen} />
    <Drawer.Screen name="Terms" component={TermsConditions} />
    {/* <Drawer.Screen
      name="SettingsDrawerLayout"
      component={SettingsDrawerLayout}
      options={{
        // Crucial options for the desired look
        headerShown: false,
        // The background must be transparent to see the screen underneath
        sceneContainerStyle: { backgroundColor: 'transparent' }, 
        // This is necessary to disable the main drawer's gesture
        swipeEnabled: false, 
      }}
    /> */}
  </Drawer.Navigator>
);


export default function App() {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      setSession(userToken);  
      setInitializing(false);
    };
    checkSession();
  }, [session]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> 
      <ThemeProvider>
        <ProfileProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {!session ? (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="Login">
                  {(props) => <LoginScreen {...props} setSession={setSession} />}
                </Stack.Screen>
            </>
          ) : (
            <Stack.Screen name="MainApp">
              {(props) => <DrawerApp {...props} setSession={setSession} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      </ProfileProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}