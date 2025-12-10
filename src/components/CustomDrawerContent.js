import React, { useEffect, useState, useMemo, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import {
  colors as baseColors,
  spacing,
  typography,
  scaleHeight,
  scaleWidth,
} from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../utils/ThemeContext'; // ✅ use our custom ThemeContext
import SettingsDrawer from '../utils/SettingsDrawer';
import { ProfileContext } from '../utils/ProfileContext';
import { useFocusEffect } from '@react-navigation/native';

const drawerOptions = [
  { name: 'Planting & Seasons', icon: 'sunny-outline', details: 'Best time to plant by region' },
  { name: 'Pests & Diseases', icon: 'bug-outline', details: 'ID and treatment' },
  { name: 'Soil & Fertilizers', icon: 'leaf-outline', details: 'Soil tests, NPK schedules' },
  { name: 'Irrigation & Rainfall', icon: 'cloud-outline', details: 'Water needs, timing' },
  { name: 'Markets & Prices', icon: 'trending-up-outline', details: 'Local rates, demand' },
  { name: 'Weather & Alerts', icon: 'warning-outline', details: '7-day forecast, warnings' },
];

const CustomDrawerContent = ({ navigation,setSession }) => {
  const [activeTab, setActiveTab] = useState('Categories');
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const { profile, updateProfile, fetchProfile } = useContext(ProfileContext);

  // ✅ use theme from context
  const {isDarkMode, toggleTheme,colors } = useContext(ThemeContext);

  // 🗂 Load sessions from AsyncStorage
  const loadSessions = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter((k) => k.startsWith('chat_'));
    const stores = await AsyncStorage.multiGet(chatKeys);
    console.log("cached store",stores)
    const data = stores.map(([key, value]) => {
        // 1. Parse the stored data
        const parsedData = JSON.parse(value);

        // 2. Safely get the text from the first message
        // We use optional chaining (?.) to prevent crashes if the array is empty
        const firstMessageText = parsedData?.[0]?.text;

        // 3. Truncate if the text is too long (optional, keeps UI clean)
        const displayTitle = firstMessageText 
          ? (firstMessageText.length > 30 ? firstMessageText.substring(0, 30) + '...' : firstMessageText)
          : 'Audio message';

        return {
          sessionId: key.replace('chat_', ''),
          messages: parsedData,
          title: displayTitle // ✅ Sets title to "Plan an Harvest" etc.
        };
      });
    console.log("data",data)
    setSessions(data.reverse());
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSessions);
    return unsubscribe;
  }, [navigation]);
  


  // 🔍 Filter results
  const filteredCategories = useMemo(() => {
    return drawerOptions.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) =>
      new Date(parseInt(session.sessionId))
        .toLocaleString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sessions]);

  // Render each category
  const renderCategoryItem = ({ name, icon, details }) => (
    <TouchableOpacity
      key={name}
      style={[
        styles.categoryItem,
        { backgroundColor: colors.chatBubbleAI, borderColor: colors.border },
      ]}
      onPress={() => {
        console.log(`Selected category: ${name}`);
        navigation.navigate('ChatScreen', { 
          categoryPrompt: name,
          categoryDetails: details 
        });
        navigation.closeDrawer();
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons
          name={icon}
          size={scaleHeight(20)}
          color={colors.text}
          style={{ marginRight: spacing.sm }}
        />
        <View>
          <Text style={[styles.categoryItemText, { color: colors.text }]}>{name}</Text>
          {details && (
            <Text style={[styles.categoryDetailsText, { color: colors.textLight }]}>
              {details}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward-outline" size={scaleHeight(20)} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.versionText, { color: colors.text }]}>FarmLingua v1.00000024</Text>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Ionicons name="close" size={scaleHeight(30)} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Dark Mode Toggle */}
      <View style={[styles.darkModeContainer, { borderBottomColor: colors.border }]}>
        <Text style={[styles.darkModeText, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.text}
          ios_backgroundColor={colors.border}
           onValueChange={toggleTheme}
          value={isDarkMode}
          style={styles.darkModeSwitch}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Categories' && { borderBottomColor: colors.text },
          ]}
          onPress={() => setActiveTab('Categories')}
        >
          <Text style={[styles.tabText, { color: colors.text }]}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'History' && { borderBottomColor: colors.text },
          ]}
          onPress={() => {
    setActiveTab('History');
    loadSessions();   // <–– reload history every tap
  }}
        >
          <Text style={[styles.tabText, { color: colors.text }]}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.chatBubbleAI }]}>
        <Ionicons name="search" size={scaleHeight(20)} color={colors.textLight} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search"
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="mic" size={scaleHeight(20)} color={colors.textLight} />
      </View>

      {/* List */}
      <ScrollView style={styles.scrollView}>
        {activeTab === 'Categories' ? (
          filteredCategories.length > 0 ? (
            filteredCategories.map((item) => renderCategoryItem(item))
          ) : (
            <Text
              style={{ textAlign: 'center', color: colors.textLight, marginTop: spacing.md }}
            >
              No matching category found.
            </Text>
          )
        ) : filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <TouchableOpacity
              key={session.sessionId}
              style={[styles.drawerItem, { borderColor: colors.border }]}
              onPress={() => {
                navigation.navigate('ChatScreen', { sessionCacheId: session.sessionId });
                navigation.closeDrawer();
              }}
            >
              <Text style={[styles.drawerItemText, { color: colors.text }]}>
                {session.title}
                {/* Chat on {new Date(parseInt(session.sessionId)).toLocaleString()} */}
              </Text>
              <Text style={[styles.categoryDetailsText, { color: colors.textLight }]}>
                {session.messages.length} messages
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: colors.textLight, marginTop: spacing.md }}>
            No chat history found.
          </Text>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Image source={{uri:profile?.profile_picture}} style={{width:scaleWidth(40), height:scaleWidth(40),borderRadius:scaleWidth(100)}}/>
        <Text style={[styles.profileName, { color: colors.text }]}>{profile?.name}</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Ionicons name="settings-outline" size={scaleHeight(24)} color={colors.text} />
        </TouchableOpacity>
      </View>
      <SettingsDrawer
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        navigation={navigation}
        setSession={setSession}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  versionText: { ...typography.body },
  darkModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  darkModeText: { ...typography.body, fontWeight: '600' },
  darkModeSwitch: {
    transform: [{ scaleX: scaleWidth(0.8) }, { scaleY: scaleHeight(0.8) }],
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: { ...typography.body, fontWeight: '600' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    ...typography.body,
  },
  scrollView: { flex: 1 },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  categoryItemText: { ...typography.body, fontWeight: '600' },
  categoryDetailsText: { ...typography.bodySmall },
  drawerItem: { paddingVertical: spacing.md, borderBottomWidth: 0.5 },
  drawerItemText: { ...typography.body, fontSize: scaleHeight(16) },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    justifyContent: 'space-between',
  },
  profileName: { ...typography.body, fontWeight: 'bold' },
});

export default CustomDrawerContent;
