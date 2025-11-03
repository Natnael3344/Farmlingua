import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {  spacing, typography, borderRadius, shadows, scaleHeight, scaleWidth } from '../utils/theme';
import {Ionicons} from '@react-native-vector-icons/ionicons'
import {Lucide} from '@react-native-vector-icons/lucide'
import Logo from '../components/Logo';
import RippleEffect from '../components/RippleEffect'
import axios from 'axios';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { DrawerActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../utils/ThemeContext';
import OnboardingTutorial from './OnboardingTutorial';
import Tooltip from 'react-native-walkthrough-tooltip';
export const quickActions = [
  { id: 1, title: 'Plan an Harvest', icon: 'clipboard-outline' },
  { id: 2, title: 'Fertilizers', icon: 'flash-outline' },
  { id: 3, title: 'Technical Help', icon: 'construct-outline' },
  { id: 4, title: 'Irrigation', icon: 'water-outline' },
  { id: 5, title: 'Pest Control', icon: 'warning-outline' },
  { id: 6, title: 'Weather', icon: 'thunderstorm-outline' },
  { id: 7, title: 'Loans & Finances', icon: 'cash-outline' },
  { id: 8, title: 'Farm Security', icon: 'shield-outline' },
  { id: 9, title: 'Get Farm Workers', icon: 'settings-outline' },
];
const generateSessionId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// --- Main Component ---
const ChatHomeSelectorScreen = ({navigation,route}) => {
   
  // States to manage the chat flow
  const { sessionCacheId } = route.params || {};
  const [mode, setMode] = useState('home'); // 'home', 'typing', 'response'
  const [message, setMessage] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [thinking, setThinking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bottomAreaHeight, setBottomAreaHeight] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState(generateSessionId()); 
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const drawerNavigation = useNavigation();
  const markdownItInstance = MarkdownIt({ typographer: true });
  const {colors } = useContext(ThemeContext);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const menuRef = useRef();
  const attachRef=useRef();
  const profileRef = useRef();
const suggestionRef = useRef();
const doneRef = useRef();
const nextStep = () => {
  if (tutorialStep < 5) {
    setTutorialStep(tutorialStep + 1);
  } else {
    handleTutorialComplete();
  }
};



  const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContent: {
    flex: 1, // Crucial for making the chat/home content take available space
  },
  
  // --- Header Styles (Shared) ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  profileButton: {
    width: scaleWidth(40),
    height: scaleWidth(40),
  },
  profileImage: {
    width: scaleWidth(40),
    height: scaleWidth(40),
    borderRadius: scaleWidth(100),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- Home Mode Styles (from ChatHomeSelectorScreen) ---
  scrollContentHome: {
    flex: 1,
  },
  scrollContentHomeContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: scaleHeight(100),
    marginBottom: spacing.xl,
  },
  voiceModeText: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm / 2,
    marginBottom: spacing.sm,
    gap: scaleHeight(7),
  },
  quickActionText: {
    ...typography.body,
    color: colors.text,
    fontSize: scaleHeight(14),
    fontWeight: '500',
  },

  // --- Chat/Response Mode Styles (from ChatTypingScreen & ChatResponseScreen) ---
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    flexGrow: 1,
  },
  chatPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatPlaceholderText: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.lg,
    alignSelf:'flex-end',
    flexShrink: 1,
    maxWidth: '80%',
  },
  messageText: {
    ...typography.body,
    backgroundColor: colors.chatBubbleUser,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-end',
    marginRight: spacing.sm,
    includeFontPadding: false,        
    flexWrap: 'wrap',                 
    textAlign: 'left', 
     
  },
  userAvatar: {
    width: scaleWidth(32),
    height: scaleWidth(32),
    borderRadius: scaleWidth(10),
    backgroundColor: colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  aiAvatar: {
    width: scaleWidth(32),
    height: scaleWidth(32),
    borderRadius: scaleWidth(10),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  aiAvatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  thinkingContainer: {
    backgroundColor: colors.chatBubbleAI,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    maxWidth: '80%',
  },
  progressBar: {
    width: scaleWidth(200),
    height: scaleHeight(8),
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  thinkingText: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
  aiMessageBubble: {
    borderWidth:1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    maxWidth: '94%',
    alignSelf: 'flex-start',
  },
  aiMessageText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  suggestionContainer: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:'space-between'
  },
  suggestionPillPrimary: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    flexShrink: 1,           
    minWidth: 0,           
    maxWidth: '48%',
  },
  suggestionTextPrimary: {
    ...typography.bodySmall,
    color: colors.black,
  },
  suggestionPillSecondary: {
    backgroundColor: colors.secondaryLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexShrink: 1,           
    minWidth: 0,           
    maxWidth: '48%',

  },
  suggestionTextSecondary: {
    ...typography.bodySmall,
    color: colors.secondary,
  },
  actionBar: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop:spacing.md
  },
  actionIcon: {
    fontSize: 14,
  },

  bottomContainer: {
    backgroundColor: colors.white,
  },
  inputWrapper: {
    paddingTop: spacing.md,
  },
  inputContainer: {
    
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadows.small, 
  },
  inputContainerChatMode: {
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
    paddingVertical: spacing.sm,   
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.sm, // Adjust for Home mode
  },
  inputChatMode: {
    flex: 1,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  },
  attachButton: {
    marginRight: spacing.sm,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border,
    padding: scaleHeight(5),
    marginBottom: Platform.OS === 'ios' ? 0 : 2, // Fine-tuning for multiline alignment
  },
  micButton: {
    marginLeft: spacing.sm,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border,
    padding: scaleHeight(5),
    marginBottom: Platform.OS === 'ios' ? 0 : 2,
  },
  aiButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  aiIcon: {
    fontSize: 16,
    color: 'white',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    alignSelf: 'flex-end',
    marginBottom: Platform.OS === 'ios' ? 0 : 2,
  },
  sendButtonActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  shortcutsContainer: {
    marginBottom: spacing.sm,
  },
  shortcutsContent: {
    paddingRight: spacing.md,
  },
  shortcutPill: {
    flexDirection: 'row',
    gap: scaleWidth(5),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  shortcutText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  voiceModeContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.white,
  },
  voiceText: {
    marginTop: spacing.xxl, 
    ...typography.body,
    color: colors.text,
    fontSize: scaleHeight(18),
    fontWeight: '500',
  },
  stopListeningButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.black,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  stopListeningText: {
    color: colors.white,
    ...typography.body,
    fontWeight: 'bold',
  }
});
 useFocusEffect(
    useCallback(() => {
      const checkTutorialStatus = async () => {
        try {
          const hasCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
          // If the flag is not set to 'true', show the tutorial
          if (hasCompleted == 'false') {
            setShowTutorial(true);
          }
        } catch (e) {
          console.error("Failed to load onboarding status", e);
        }
      };
      checkTutorialStatus();
      return () => {};
    }, [])
  );

  // ✅ Function to mark tutorial as complete
  const handleTutorialComplete = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setShowTutorial(false);
    } catch (e) {
      console.error("Failed to save onboarding status", e);
    }
  };


  useEffect(() => {
  if (sessionCacheId) {
    loadChatHistory(sessionCacheId).then(history => {
      setMessages(history);
      setSessionId(sessionCacheId);
      setMode(history.length ? 'response' : 'home');
    });
  }
}, [sessionCacheId]);


  // Save messages for this session
const saveChatHistory = async (sessionId, messages) => {
  try {
    await AsyncStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

// Load messages for a session
const loadChatHistory = async (sessionId) => {
  try {
    const stored = await AsyncStorage.getItem(`chat_${sessionId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

// Load all chat sessions (for the Drawer)
const getAllChatSessions = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter(k => k.startsWith('chat_'));
    const stores = await AsyncStorage.multiGet(chatKeys);
    return stores.map(([key, value]) => ({
      sessionId: key.replace('chat_', ''),
      messages: JSON.parse(value),
    }));
  } catch (error) {
    console.error('Error loading all sessions:', error);
    return [];
  }
};


  const sendApiRequest = useCallback(async (queryToSend) => {
  setThinking(true);
  setProgress(0);

  console.log(`Sending API Request with: Query='${queryToSend}' and Session_ID='${sessionId}'`);

  try {
    const response = await fetch(
      'https://remostart-farmlingua-ai-conversational.hf.space/ask',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryToSend,
          session_id: sessionId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.answer || 'Sorry, I couldn\'t find an answer.';
    console.log('API Response Data:', data);
    setAiResponse(data.answer || 'Sorry, I couldn\'t find an answer.');
    setMessages(prev => {
  const updated = [...prev, { type: 'ai', text: aiText }];
  saveChatHistory(sessionId, updated);
  return updated;
});

  } catch (error) {
    console.error('Error during API request:', error);
    setAiResponse('Error: Could not connect to the AI service. Please try again.');
    const errorText = 'Error: Could not connect to the AI service. Please try again.';
    setMessages(prev => [...prev, { type: 'ai', text: errorText }]);
  } finally {
    setThinking(false);
  }
}, []);
  // Focus the input when moving to 'typing' mode
  useEffect(() => {

    if (mode === 'typing') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mode]);

  // Simulate AI response generation
useEffect(() => {
  let interval;
  const lastUserMessage = messages.length > 0 && messages[messages.length - 1].type === 'user'
        ? messages[messages.length - 1].text
        : null;

  if (thinking && lastUserMessage) {
    setProgress(0);
    const startTime = Date.now();
    const maxDuration = 10000; // max wait time 8 seconds (adjust as needed)

    interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Calculate progress percent based on elapsed time capped to maxDuration
      const percent = Math.min(100, (elapsed / maxDuration) * 100);
      setProgress(Math.floor(percent));  
    }, 100);

    // Fire API request once at beginning of thinking
    sendApiRequest(lastUserMessage).then(() => {
      clearInterval(interval);
      setProgress(100);
      setThinking(false);
      setMode('response');
    }).catch(() => {
      clearInterval(interval);
      setProgress(100);
      setThinking(false);
      setAiResponse('Error: Could not connect to the AI service. Please try again.');
      setMode('response');
    });

  } else {
    // Clear interval anytime thinking ends
    clearInterval(interval);
  }

  return () => clearInterval(interval);
}, [thinking, userQuery, sendApiRequest]);



  // Scroll to bottom when response is ready
  useEffect(() => {
    if (mode === 'response') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [mode, aiResponse]);

  const handleLogout = async () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  const handleInputFocus = () => {
    // Only switch to typing if not already in response or typing mode
    if (mode !== 'response' && mode !== 'typing') {
        setMode('typing');
    }
  };

  const handleQuickAction = (actionTitle) => { 
  setAiResponse(''); 
  setUserQuery(actionTitle);
  setMessage(actionTitle);
  setMode('typing');
  setTimeout(() => inputRef.current?.focus(), 100);
  // Immediately send the message as if user pressed send
  setTimeout(() => {
    if (actionTitle.trim()) {
      // setUserQuery(actionTitle.trim());
      const queryToSend = actionTitle;
      setMessages(prev => {
  const updated = [...prev, { type: 'user', text: queryToSend }];
  saveChatHistory(sessionId, updated);
  return updated;
});

      setMessage('');
      setThinking(true);
      setMode('response');
    }
  }, 200);
};


  const handleSend = () => {
    if (message.trim()) { 
      // setUserQuery(message.trim());
      const queryToSend = message;
      setMessages(prev => {
  const updated = [...prev, { type: 'user', text: queryToSend }];
  saveChatHistory(sessionId, updated);
  return updated;
});

      setMessage(''); 
      setThinking(true); 
      setMode('response');  
    }
  };

  const handleBack = () => { 
    if (mode === 'voice') {    
      setIsListening(false);
      setMode('home');
      return;
    }
    if (mode === 'home') {
      navigation.toggleDrawer();
    }
    if (mode === 'response' || userQuery) {
      setMode('home');
      setMessages([]);
      setUserQuery('');
      setAiResponse('');
      setThinking(false);
      setProgress(0); 
      setSessionId(generateSessionId()); 
      
    } else {
      setMode('home');
      
    }
    setMessage('');
  };
  
  const renderHeader = () => (
  <View style={styles.header}>
    <Tooltip
      isVisible={showTutorial && tutorialStep === 0}
      content={
        <View>
           <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
           <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Menu</Text>
           <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={handleTutorialComplete} />
           </View>
          <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
            This is the menu. You can access settings and other features here.
          </Text>
          <View style={{ flexDirection: 'row', gap: scaleWidth(20),  }}>
            <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={nextStep}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={handleTutorialComplete}>
            <Text style={{ color: '#1870f2', fontWeight: 'bold',alignSelf:'center' }}>Skip {'>>'}</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      }
      placement="bottom"
      contentStyle={{backgroundColor:'#141c24', padding:scaleHeight(15), borderRadius:scaleHeight(10)}}
      tooltipStyle={{width:scaleWidth(250)}}
      arrowSize={{ width: scaleWidth(12), height: scaleHeight(8) }}
      backgroundColor='transparent'
      showChildInTooltip={false}
      useInteractionManager
    >
      <TouchableOpacity style={styles.menuButton} onPress={handleBack} ref={menuRef}>
        {mode === 'home' ? (
          <Ionicons name='menu-sharp' size={scaleHeight(20)} color={colors.text} />
        ) : (
          <Ionicons name='arrow-back' size={scaleHeight(20)} color={colors.text} />
        )}
      </TouchableOpacity>
    </Tooltip>

    <Text style={[styles.headerTitle, { fontSize: scaleHeight(18) }]}>Farmlingua</Text>

    <Tooltip
      isVisible={showTutorial && tutorialStep === 1}
      content={
        <View>
           <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
           <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Profile</Text>
           <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={handleTutorialComplete} />
           </View>
          <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
            This is your profile. Tap here to view or edit your personal information, check your activity, or log out from the app.
          </Text>
          <View style={{ flexDirection: 'row', gap: scaleWidth(20),  }}>
            <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={nextStep}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={handleTutorialComplete}>
            <Text style={{ color: '#1870f2', fontWeight: 'bold',alignSelf:'center' }}>Skip {'>>'}</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      }
      placement="bottom"
      contentStyle={{backgroundColor:'#141c24', padding:scaleHeight(15), borderRadius:scaleHeight(10)}}
      tooltipStyle={{width:scaleWidth(250)}}
      arrowSize={{ width: scaleWidth(12), height: scaleHeight(8) }}
      backgroundColor='transparent'
      showChildInTooltip={false}
      useInteractionManager
    >
    <TouchableOpacity style={styles.profileButton} onPress={handleLogout} ref={profileRef}>
      <View style={styles.profileImage}>
        <Text style={styles.profileText}>U</Text>
      </View>
    </TouchableOpacity>
    </Tooltip>
  </View>
);


  const renderHomeContent = () => (
    <ScrollView style={styles.scrollContentHome} contentContainerStyle={styles.scrollContentHomeContainer}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>
      <View style={{ flexDirection: 'row', alignSelf: 'center', gap: spacing.md, marginTop: spacing.xl }}>
        <Image source={require('../assets/images/wave.png')} style={{ width: scaleWidth(20), height: scaleWidth(20) }} /> 
        <Text style={styles.voiceModeText}>Tap a mode to activate Voice</Text>
      </View>
{renderInputArea()}
      <Tooltip
      isVisible={showTutorial && tutorialStep === 5}
      content={
        <View>
           <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
           <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Search Quick Start</Text>
           <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={handleTutorialComplete} />
           </View>
          <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
          This enables quick queries or task execution, from crop advice to weather insights, using natural language.
          </Text>
          <View style={{ flexDirection: 'row', gap: scaleWidth(20),  }}>
            <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={handleTutorialComplete}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Got it</Text>
          </TouchableOpacity>
         
          </View>
          
        </View>
      }
      placement="top"
      contentStyle={{backgroundColor:'#141c24', padding:scaleHeight(15), borderRadius:scaleHeight(10)}}
      tooltipStyle={{width:scaleWidth(250)}}
      arrowSize={{ width: scaleWidth(12), height: scaleHeight(8) }}
      backgroundColor='transparent'
      showChildInTooltip={false}
      useInteractionManager
    >
      <View ref={suggestionRef} style={[styles.quickActionsContainer, mode === 'home' ? { justifyContent: 'flex-start' } : { justifyContent: 'center' }]}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionButton}
            activeOpacity={0.8}
            onPress={() => handleQuickAction(action.title)}
          >
            <Ionicons name={action.icon} size={scaleHeight(20)} color={colors.text} />
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </Tooltip>
    </ScrollView>
  );
const renderMessageBubble = (msg, index) => {
    if (msg.type === 'user') {
        return (
            <View key={index} style={styles.userMessageContainer}>
                <View>
                    <Text style={styles.messageText}>{msg.text}</Text>
                    {/* ... (User Action Bar logic can be reused here) ... */}
                    <View style={{ marginRight: spacing.md, flexDirection: 'row', gap: spacing.md, alignSelf: 'flex-end', marginTop: spacing.sm }}>
                        <TouchableOpacity><Ionicons name='copy-outline' size={scaleHeight(25)} color={colors.textLight} /></TouchableOpacity>
                        <TouchableOpacity><Ionicons name='share-outline' size={scaleHeight(25)} color={colors.textLight} /></TouchableOpacity>
                        <TouchableOpacity><Lucide name='thumbs-up' size={scaleHeight(25)} color={colors.textLight} /></TouchableOpacity>
                    </View>
                </View>
                <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>U</Text>
                </View>
            </View>
        );
    } else if (msg.type === 'ai') {
        return (
            <View key={index} style={styles.aiMessageContainer}>
                <View style={styles.aiAvatar}>
                    <Lucide name="bot" size={scaleWidth(20)} color={colors.white} />
                </View>
                <View>
                    <View style={styles.aiMessageBubble}>
                        {/* <Text style={styles.aiMessageText}>{msg.text}</Text> */}
                        <Markdown  markdownit={
                MarkdownIt({typographer: true}).disable([ 'link', 'image' ])
              } style={{
    body: { color: colors.text, ...typography.body },
    strong: { fontWeight: 'bold' },
    list_item: { marginVertical: spacing.xs },
  }}>{msg.text}</Markdown>
                        {/* ... (Suggestions block can be included here if needed) ... */}
                    </View>
                    {/* ... (AI Action Bar logic can be reused here) ... */}
                    <View style={styles.actionBar}>
                        <TouchableOpacity><Lucide name='refresh-ccw' size={scaleHeight(25)} color={colors.textLight} /></TouchableOpacity>
                        <TouchableOpacity><Ionicons name='copy-outline' size={scaleHeight(25)} color={colors.textLight} /></TouchableOpacity>
                        <TouchableOpacity><Ionicons name='share-outline' size={scaleHeight(25)} color={colors.textLight} /></TouchableOpacity>
                        <TouchableOpacity><Lucide name='thumbs-up' size={scaleHeight(25)} color={colors.textLight} /></TouchableOpacity>
                        <TouchableOpacity><Lucide name='thumbs-down' size={scaleHeight(25)} color={colors.textLight} /></TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    return null;
};
  const renderChatHistory = () => (
    <>
     <ScrollView 
        style={styles.chatContainer} 
        contentContainerStyle={[styles.chatContent,{paddingBottom: bottomAreaHeight}]}
        ref={scrollViewRef}
    >
      
        {/* User Message */}
        {messages.map(renderMessageBubble)}

        {/* AI Response (Thinking or Complete) */}
        {thinking && (
                    <View style={styles.thinkingContainer}>
                       <View style={{flexDirection: 'row',justifyContent:'space-between'}}>
                        <Text style={styles.thinkingText}>Thinking</Text>
                        <Text style={styles.thinkingText}>{progress}%</Text>
                       </View>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progress}%` }]} />
                        </View>
                        
                    </View>
                )}
            
       
      
    </ScrollView>
   
       {renderInputArea()}
   
    
    </>
   
  );

  const renderVoiceMode = () => (
  <View style={styles.voiceModeContainer}>
    {/* Fallback visual indicator */}
    <RippleEffect isListening={isListening} />
    
    <Text style={styles.voiceText}>
      {isListening ? 'Listening...' : 'Tap to start speaking'}
    </Text>
    
    {isListening && (
      <TouchableOpacity 
        style={styles.stopListeningButton}
        onPress={() => {
          setIsListening(false);
          setMode('home');  
        }}
      >
        <Text style={styles.stopListeningText}>Stop Listening</Text>
      </TouchableOpacity>
    )}
  </View>
);

  const renderInputArea = () => {
    // Render the simpler input for 'home' mode, and the chat-style input for 'typing'/'response' mode.

    const isChatMode = mode === 'typing' || mode === 'response';
    
    return (
      <Tooltip
      isVisible={showTutorial && tutorialStep === 2}
      content={
        <View>
           <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
           <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Search Bar</Text>
           <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={handleTutorialComplete} />
           </View>
          <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
          This central input field invites users to "Ask anything about farming...", serving as the main interaction area.
          </Text>
          <View style={{ flexDirection: 'row', gap: scaleWidth(20),  }}>
            <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={nextStep}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={handleTutorialComplete}>
            <Text style={{ color: '#1870f2', fontWeight: 'bold',alignSelf:'center' }}>Skip {'>>'}</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      }
      placement="top"
      contentStyle={{backgroundColor:'#141c24', padding:scaleHeight(15), borderRadius:scaleHeight(10)}}
      tooltipStyle={{width:scaleWidth(250)}}
      arrowSize={{ width: scaleWidth(12), height: scaleHeight(8) }}
      backgroundColor='transparent'
      showChildInTooltip={false}
      useInteractionManager
    >
        <View onLayout={e => setBottomAreaHeight(e.nativeEvent.layout.height)} style={[styles.bottomContainer,{paddingBottom: isChatMode && Platform.OS === 'ios' ? spacing.lg : spacing.md,zIndex:10,position: isChatMode ? 'absolute' : 'relative',bottom: isChatMode && 0,alignSelf: isChatMode? 'center':'auto',paddingHorizontal: isChatMode&&scaleWidth(16)}]}>
            <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, isChatMode && styles.inputContainerChatMode]}>
                                        
                    <TextInput
                        style={[styles.input, isChatMode && styles.inputChatMode]}
                        placeholder="Ask anything about farming..."
                        placeholderTextColor={colors.textLight}
                        onFocus={() => setMode('typing')}
                        ref={inputRef}
                        value={message}
                        onChangeText={setMessage}
                        multiline={isChatMode}  
                        minHeight={isChatMode ? scaleHeight(40) : undefined}
                        
                    />
                   
                    <View style={{ flexDirection: 'row', justifyContent:'space-between' }}>
                       
                            <Tooltip
      isVisible={showTutorial && tutorialStep === 3}
      content={
        <View>
           <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
           <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Attachment(s)</Text>
           <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={handleTutorialComplete} />
           </View>
          <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
          This icon allows users to attach images, soil reports, or documents for the AI to analyze; enabling visual or data-based responses.
          </Text>
          <View style={{ flexDirection: 'row', gap: scaleWidth(20),  }}>
            <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={nextStep}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={handleTutorialComplete}>
            <Text style={{ color: '#1870f2', fontWeight: 'bold',alignSelf:'center' }}>Skip {'>>'}</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      }
      placement="top"
      contentStyle={{backgroundColor:'#141c24', padding:scaleHeight(15), borderRadius:scaleHeight(10)}}
      tooltipStyle={{width:scaleWidth(250)}}
      arrowSize={{ width: scaleWidth(12), height: scaleHeight(8) }}
      backgroundColor='transparent'
      showChildInTooltip={false}
      useInteractionManager
    >
                            <TouchableOpacity style={styles.attachButton} activeOpacity={0.8} ref={attachRef}>
                                <Ionicons name='attach' size={scaleHeight(25)} color={colors.text} />
                            </TouchableOpacity>
                             
                      </Tooltip>
                        
                        
                        
                        <View style={{flexDirection:'row'}}>
                          <Tooltip
      isVisible={showTutorial && tutorialStep === 4}
      content={
        <View>
           <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
           <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Record Mode</Text>
           <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={handleTutorialComplete} />
           </View>
          <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
          The microphone icon activates voice input, allowing users to speak their queries hands-free. Ideal for farmers on the field, it converts speech into text and provides quick, conversational answers.
          </Text>
          <View style={{ flexDirection: 'row', gap: scaleWidth(20),  }}>
            <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={nextStep}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={handleTutorialComplete}>
            <Text style={{ color: '#1870f2', fontWeight: 'bold',alignSelf:'center' }}>Skip {'>>'}</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      }
      placement="top"
      contentStyle={{backgroundColor:'#141c24', padding:scaleHeight(15), borderRadius:scaleHeight(10)}}
      tooltipStyle={{width:scaleWidth(250)}}
      arrowSize={{ width: scaleWidth(12), height: scaleHeight(8) }}
      backgroundColor='transparent'
      showChildInTooltip={false}
      useInteractionManager
    >
                          <TouchableOpacity
                            style={styles.micButton}
                            activeOpacity={0.8}
                            onPress={() => {
                                setMode('voice');
                                setIsListening(true);  
                            }}  
                        >
                            <Ionicons name='mic-outline' size={scaleHeight(25)} color={colors.text} />
                        </TouchableOpacity>
                        </Tooltip>
                        {isChatMode && (
                            <TouchableOpacity
                                style={[styles.sendButton, message.trim() && !thinking && styles.sendButtonActive]}
                                activeOpacity={0.8}
                                disabled={!message.trim() || thinking}
                                onPress={handleSend}
                            >
                                <Ionicons name='arrow-up' size={scaleHeight(25)} color={'white'} />
                            </TouchableOpacity>
                        ) }
                          </View>                
                        
                    </View>
                </View>

                {isChatMode && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={[styles.shortcutsContainer,{marginTop:isChatMode && scaleHeight(20),marginBottom:isChatMode && scaleHeight(20)}]}
                        contentContainerStyle={styles.shortcutsContent}
                    >
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.shortcutPill}
                                activeOpacity={0.8}
                                onPress={() => {
                                    setMessage(action.title);
                                    setTimeout(() => inputRef.current?.focus(), 100);
                                }}
                            >
                                <Ionicons name={action.icon} size={scaleHeight(16)} color={colors.text} />
                                <Text style={styles.shortcutText}>{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
        </Tooltip>
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {renderHeader()}
        
        {/* Main Content Area */}
        <View style={styles.mainContent}>
            {mode === 'home' && renderHomeContent()}
            {(mode === 'typing' || mode === 'response') && renderChatHistory()}
            {mode === 'voice' && renderVoiceMode()}
        </View>

       
      </KeyboardAvoidingView>
   

    </SafeAreaView>
  );
};



export default ChatHomeSelectorScreen;