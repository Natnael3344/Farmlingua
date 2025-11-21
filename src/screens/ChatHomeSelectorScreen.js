import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  BackHandler,
} from 'react-native';
import { spacing, typography, borderRadius, shadows, scaleHeight, scaleWidth } from '../utils/theme';  
import { MarkdownIt } from 'react-native-markdown-display';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../utils/ThemeContext';
import RNFS from 'react-native-fs';
import Header from '../components/Header';
import ChatHomeContent from '../components/ChatHomeContent';
import ChatHistory from '../components/ChatHistory';
import ChatVoiceMode from '../components/ChatVoiceMode';
import { generateSessionId, saveChatHistory, loadChatHistory } from '../utils/chatUtils';
import { createStyles } from '../components/styles';
import ApiService from '../config/apiService';

const ChatHomeSelectorScreen = ({ navigation, route }) => {
  const { sessionCacheId, categoryPrompt, categoryDetails } = route.params || {};
  const [mode, setMode] = useState('home');
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
  const markdownItInstance = MarkdownIt({ typographer: true }).disable(['link', 'image']);
  const { colors } = useContext(ThemeContext);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const menuRef = useRef();
  const attachRef = useRef();
  const profileRef = useRef();
  const suggestionRef = useRef();
  const isNavigatingBackRef=useRef(false);
  
  // Single abort controller ref
  const abortControllerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (categoryPrompt && !isNavigatingBackRef.current) {
      console.log('🎯 Category prompt received:', categoryPrompt);
      
      // Use the category as a prompt
      handleCategoryPrompt(categoryPrompt, categoryDetails);
      
      // Clear the params to prevent re-triggering
      navigation.setParams({ 
        categoryPrompt: undefined, 
        categoryDetails: undefined 
      });
    }
  }, [categoryPrompt, categoryDetails]);

  // NEW FUNCTION: Handle category prompts
  const handleCategoryPrompt = (prompt, details = '') => {
    if (isNavigatingBackRef.current) {
      console.log('🛡️ Blocking category prompt during back navigation');
      return;
    }
    
    Keyboard.dismiss();
    
    // Create a more detailed prompt if details are available
    const fullPrompt = details ? `${prompt}: ${details}` : prompt;
    
    setAiResponse('');
    setUserQuery(fullPrompt);
    setMessage(fullPrompt);
    setMode('typing');
    
    setTimeout(() => {
      if (fullPrompt.trim() && !isNavigatingBackRef.current) {
        const queryToSend = fullPrompt.trim();
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

  const startProgress = (duration = 10000) => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(0);
    const startTime = Date.now();

    progressIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      
      const elapsed = Date.now() - startTime;
      const percent = Math.min(100, (elapsed / duration) * 100);
      setProgress(Math.floor(percent));

      if (percent >= 100) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }, 100);
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (isMountedRef.current) {
      setProgress(100);
    }
  };

  const abortAllRequests = () => {
    console.log('🛑 Aborting all pending requests...');
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopProgress();
    if (isMountedRef.current) {
      setThinking(false);
    }
  };

  // Create styles dynamically
  const styles = createStyles(colors);

  const nextStep = () => {
    if (tutorialStep < 5) {
      setTutorialStep(tutorialStep + 1);
    } else {
      handleTutorialComplete();
    }
  };

  // --- Tutorial Logic ---
  useFocusEffect(
    useCallback(() => {
      const checkTutorialStatus = async () => {
        try {
          const hasCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
          console.log("completed",hasCompleted)
          if (hasCompleted != 'true') {
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

  const handleTutorialComplete = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setShowTutorial(false);
    } catch (e) {
      console.error("Failed to save onboarding status", e);
    }
  };

  // Component mount/unmount lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      console.log('🔴 Component unmounting, cleaning up...');
      isMountedRef.current = false;
      abortAllRequests();
    };
  }, []);

  // Cleanup on focus change
  useFocusEffect(
    useCallback(() => {
      console.log('🟢 Chat screen focused');
      
      return () => {
        console.log('🔴 Chat screen unfocused');
        abortAllRequests();
      };
    }, [])
  );

  // --- Chat History Logic ---
  // Replace your current sessionCacheId effect with this:
useEffect(() => {
  if (sessionCacheId && sessionCacheId !== sessionId) {
    console.log('🔄 Loading chat history from sessionCacheId:', sessionCacheId);
    loadChatHistory(sessionCacheId).then(history => {
      if (isMountedRef.current && sessionCacheId === route.params?.sessionCacheId) {
        setMessages(history);
        setSessionId(sessionCacheId);
        setMode(history.length ? 'response' : 'home');
      }
    });
  }
}, [sessionCacheId, sessionId]); // Add sessionId to dependencies

  // --- API Request Logic ---
  const sendApiRequest = useCallback(async (queryToSend) => {
    if (!isMountedRef.current) return;
    
    setThinking(true);
    setProgress(0);

    // Abort any existing request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

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
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.answer || 'Sorry, I couldn\'t find an answer.';
      
      if (!isMountedRef.current) return;
      
      setAiResponse(aiText);
      setMessages(prev => {
        const updated = [...prev, { type: 'ai', text: aiText }];
        saveChatHistory(sessionId, updated);
        return updated;
      });

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('🛑 API request aborted.');
        return;
      }

      console.error('Error during API request:', error);
      
      if (!isMountedRef.current) return;
      
      const errorText = 'Error: Could not connect to the AI service. Please try again.';
      setAiResponse(errorText);
      setMessages(prev => {
        const updated = [...prev, { type: 'ai', text: errorText }];
        saveChatHistory(sessionId, updated);
        return updated;
      });
    } finally {
      if (isMountedRef.current) {
        setThinking(false);
      }
      abortControllerRef.current = null;
    }
  }, [sessionId,isMountedRef]);

  const sendTTS = useCallback(async (filePath, language) => {
    if (!isMountedRef.current) return;
    
    // Abort any existing request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      console.log('📤 Sending file to TTS API:', filePath);
      startProgress(8000);

      const fileStat = await RNFS.stat(filePath);
      const audioFile = {
        uri: Platform.OS === 'android' ? `file://${fileStat.path}` : fileStat.path,
        type: 'audio/wav',
        name: 'speech.wav',
      };

      const response = await ApiService.speakAI(audioFile, language, controller.signal);
      
      if (!isMountedRef.current) return;
      
      stopProgress();
      setThinking(false);

      if (response?.audioUrl) {
        setMessages(prev => {
          const updated = [...prev, { type: 'ai', audio: response.audioUrl }];
          saveChatHistory(sessionId, updated);
          return updated;
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('🛑 TTS request aborted.');
        return;
      }

      console.error('❌ TTS API failed:', error);
      
      if (!isMountedRef.current) return;
      
      stopProgress();
      setThinking(false);
      setMessages(prev => [
        ...prev,
        { type: 'ai', text: 'Error generating speech. Please try again.' },
      ]);
    } finally {
      abortControllerRef.current = null;
    }
  }, [sessionId]);

  // --- Effects ---
  useEffect(() => {
    if (mode === 'typing') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mode]);

useEffect(() => {
  // Don't process anything if we're in home mode or navigating back
  if (mode === 'home' || isNavigatingBackRef.current) {
    console.log('🛑 Blocking API effect in home mode or during back navigation');
    return;
  }
  
  const lastUserMessage =
    messages.length > 0 && messages[messages.length - 1].type === 'user'
      ? messages[messages.length - 1].text
      : null;

  if (thinking && lastUserMessage && isMountedRef.current) {
    console.log('🚀 Starting API request for:', lastUserMessage);
    startProgress(10000);

    sendApiRequest(lastUserMessage)
      .then(() => {
        if (isMountedRef.current && mode !== 'home' && !isNavigatingBackRef.current) {
          stopProgress();
          setThinking(false);
          setMode('response');
        }
      })
      .catch(() => {
        if (isMountedRef.current && mode !== 'home' && !isNavigatingBackRef.current) {
          stopProgress();
          setThinking(false);
          setAiResponse('Error: Could not connect to the AI service.');
          setMode('response');
        }
      });
  }

  return () => {
    if (!isMountedRef.current) {
      stopProgress();
    }
  };
}, [thinking, messages, sendApiRequest, mode]);
  useEffect(() => {
    if (mode === 'response') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [mode, aiResponse]);

  // --- Handlers ---
  const handleLogout = async () => {
    console.log('Logging out...');
  };

  const handleInputFocus = () => {
    if (mode !== 'response' && mode !== 'typing') {
      setMode('typing');
    }
  };

  const handleQuickAction = (actionTitle) => { 
  if (isNavigatingBackRef.current) {
    console.log('🛡️ Blocking quick action during back navigation');
    return;
  }
  
  Keyboard.dismiss();
  setAiResponse(''); 
  setUserQuery(actionTitle);
  setMessage(actionTitle);
  setMode('typing');
  setTimeout(() => inputRef.current?.focus(), 100);
  
  setTimeout(() => {
    if (actionTitle.trim() && !isNavigatingBackRef.current) {
      const queryToSend = actionTitle.trim();
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
useEffect(() => {
  console.log('🔍 Mode change debug:');
  console.log('   - thinking:', thinking);
  console.log('   - messages length:', messages.length);
  console.log('   - isNavigatingBack:', isNavigatingBackRef.current);
}, [mode, thinking, messages.length]);
// Add this guard to prevent messages from triggering mode changes
useEffect(() => {
  if (isNavigatingBackRef.current) {
    console.log('🛡️ Blocking mode change due to back navigation');
    return;
  }
  
  // If we have messages and we're not in response mode, check if we should switch
  if (messages.length > 0 && mode !== 'response' && !thinking) {
    console.log('📨 Messages detected, switching to response mode');
    setMode('response');
  }
}, [messages, mode, thinking]);
// Add this to debug storage operations
useEffect(() => {
  const debugStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const chatKeys = keys.filter(key => key.startsWith('chat_history_'));
      console.log('📦 Current chat history keys in storage:', chatKeys);
      
      for (const key of chatKeys) {
        const value = await AsyncStorage.getItem(key);
        console.log(`📦 ${key}:`, value ? JSON.parse(value).length + ' messages' : 'empty');
      }
    } catch (error) {
      console.error('Storage debug failed:', error);
    }
  };
  
  debugStorage();
}, [mode, messages.length]);
  const handleSend = () => {
    if (message.trim()) { 
      Keyboard.dismiss();
      const queryToSend = message.trim();
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
  console.log(`🔙 handleBack called - current mode: ${mode}`);
  
  // Set a flag to prevent any state-triggered navigation
  isNavigatingBackRef.current = true;
  
  Keyboard.dismiss();
  abortAllRequests();
  
  if (mode === 'voice') {    
    console.log('🎤 Switching from voice to home');
    setIsListening(false);
    setMode('home');
    setTimeout(() => { isNavigatingBackRef.current = false; }, 100);
    return;
  }
  
  if (mode === 'home') {
    console.log('🏠 Home mode - navigating back');
    navigation.setParams({ sessionCacheId: undefined });
    
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.toggleDrawer();
    }
    isNavigatingBackRef.current = false;
    return;
  }
  
  console.log(`🔄 Resetting from ${mode} to home`);
  
  // CRITICAL: Clear the persisted chat history from storage
  const clearPersistedHistory = async () => {
    try {
      await AsyncStorage.removeItem(`chat_history_${sessionId}`);
      console.log('🗑️ Cleared persisted chat history for session:', sessionId);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };
  clearPersistedHistory();
  
  // Reset ALL chat state consistently
  setMessages([]);
  setUserQuery('');
  setAiResponse('');
  setThinking(false);
  setProgress(0);
  setMessage('');
  
  // Generate new session ID to prevent any cached data restoration
  const newSessionId = generateSessionId();
  setSessionId(newSessionId);
  
  setMode('home');
  
  // Clear navigation params
  navigation.setParams({ sessionCacheId: undefined });
  
  // Reset the flag after state updates complete
  setTimeout(() => { isNavigatingBackRef.current = false; }, 100);
};
useEffect(() => {
  if (isNavigatingBackRef.current && mode !== 'home') {
    console.log('🛡️ Blocking mode change during back navigation');
    setMode('home');
  }
}, [mode]);
useEffect(() => {
  console.log('📍 Navigation params changed:', route.params);
  console.log('📍 Current sessionCacheId:', sessionCacheId);
}, [route.params, sessionCacheId]);

// Also add this to track mode changes
useEffect(() => {
  console.log('🔄 Mode changed to:', mode);
}, [mode]);
  // REPLACE the useFocusEffect block at line 420 in ChatHomeSelectorScreen.js

useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      console.log('📱 Hardware back button pressed');
      if (mode !== 'home') {
        handleBack();
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior in home mode
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      console.log('🧹 Cleaning up back handler');
      subscription.remove();
    };
  }, [mode, handleBack]) // Include handleBack in dependencies
);


  const handleSwitchToText = () => {
    setIsListening(false);
    setMode('typing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleStopListening = () => {
    setIsListening(false);
    setMode('home');
  };

  const handleMicPress = () => {
    Keyboard.dismiss();
    setMode('voice');
    setIsListening(true);
  };

  const handleSendAudio = (audioPath,language) => {
    if (audioPath) {
      const audioMessage = {
        type: 'user',
        text: '',
        audio: audioPath,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => {
        const updated = [...prev, audioMessage];
        saveChatHistory(sessionId, updated);
        return updated;
      });
      setThinking(true);
      setMode('response');

      sendTTS(audioPath,language);
    }
  };

  // --- Props for children ---
  const headerProps = {
    styles,
    colors,
    mode,
    showTutorial,
    tutorialStep,
    menuRef,
    profileRef,
    onBackPress: handleBack,
    onProfilePress: handleLogout,
    onTutorialNext: nextStep,
    onTutorialComplete: handleTutorialComplete,
  };

  const inputAreaProps = {
    styles,
    colors,
    mode,
    message,
    thinking,
    inputRef,
    attachRef,
    showTutorial,
    tutorialStep,
    onMessageChange: setMessage,
    onInputFocus: handleInputFocus,
    onSend: handleSend,
    onMicPress: handleMicPress,
    onLayout: e => setBottomAreaHeight(e.nativeEvent.layout.height),
    onTutorialNext: nextStep,
    onTutorialComplete: handleTutorialComplete,
  };

  const homeContentProps = {
    ...inputAreaProps,
    onQuickActionPress: handleQuickAction,
    suggestionRef: suggestionRef,
  };

  const chatHistoryProps = {
    ...inputAreaProps,
    messages,
    thinking,
    progress,
    bottomAreaHeight,
    scrollViewRef,
    markdownItInstance,
    sessionId
  };

  const voiceModeProps = {
    styles,
    colors,
    mode,
    message,
    thinking,
    inputRef,
    attachRef,
    showTutorial,
    tutorialStep,
    isListening,
    onMessageChange: setMessage,
    onInputFocus: handleInputFocus,
    onSend: handleSend,
    onSwitchToText: handleSwitchToText,
    onLayout: e => setBottomAreaHeight(e.nativeEvent.layout.height),
    onTutorialNext: nextStep,
    onTutorialComplete: handleTutorialComplete,
    onQuickActionPress: handleQuickAction,
    onSend: handleSendAudio,
  };

  // --- Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Header {...headerProps} />
        
        <View style={styles.mainContent}>
            {mode === 'home' && <ChatHomeContent {...homeContentProps} />}
            {(mode === 'typing' || mode === 'response') && <ChatHistory {...chatHistoryProps} />}
            {mode === 'voice' && <ChatVoiceMode {...voiceModeProps} />}
        </View>
       
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatHomeSelectorScreen;


// import {
//   View,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
//   BackHandler,
// } from 'react-native';
// import { spacing, typography, borderRadius, shadows, scaleHeight, scaleWidth } from '../utils/theme';  
// import { MarkdownIt } from 'react-native-markdown-display';
// import { useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ThemeContext } from '../utils/ThemeContext';
// // import OnboardingTutorial from './OnboardingTutorial'; // This seems unused, but keeping if needed
// import RNFS from 'react-native-fs';
// // Import new components
// import Header from '../components/Header';
// import ChatHomeContent from '../components/ChatHomeContent';
// import ChatHistory from '../components/ChatHistory';
// import ChatVoiceMode from '../components/ChatVoiceMode';

// // Import new utils and styles
// import { generateSessionId, saveChatHistory, loadChatHistory } from '../utils/chatUtils';
// import { createStyles } from '../components/styles';
// import ApiService from '../config/apiService';

// // --- Main Component ---
// const ChatHomeSelectorScreen = ({ navigation, route }) => {
   
//   // States to manage the chat flow
//   const { sessionCacheId } = route.params || {};
//   const [mode, setMode] = useState('home'); // 'home', 'typing', 'response', 'voice'
//   const [message, setMessage] = useState('');
//   const [userQuery, setUserQuery] = useState(''); // This seems unused, but keeping
//   const [aiResponse, setAiResponse] = useState('');
//   const [thinking, setThinking] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [bottomAreaHeight, setBottomAreaHeight] = useState(0);
//   const [isListening, setIsListening] = useState(false);
//   const [sessionId, setSessionId] = useState(generateSessionId()); 
//   const inputRef = useRef(null);
//   const scrollViewRef = useRef(null);
//   const [messages, setMessages] = useState([]);
//   const markdownItInstance = MarkdownIt({ typographer: true }).disable(['link', 'image']);
//   const { colors } = useContext(ThemeContext);
//   const [showTutorial, setShowTutorial] = useState(false);
//   const [tutorialStep, setTutorialStep] = useState(0);
//   const menuRef = useRef();
//   const attachRef = useRef();
//   const profileRef = useRef();
//   const suggestionRef = useRef();
//   const abortControllerRef = useRef(null);
//   // const doneRef = useRef(); // This ref was declared but not used

//   // Keep a single global ref for the interval
// const progressIntervalRef = useRef(null);

// const startProgress = (duration = 10000) => {
//   if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
//   setProgress(0);
//   const startTime = Date.now();

//   progressIntervalRef.current = setInterval(() => {
//     const elapsed = Date.now() - startTime;
//     const percent = Math.min(100, (elapsed / duration) * 100);
//     setProgress(Math.floor(percent));

//     if (percent >= 100) {
//       clearInterval(progressIntervalRef.current);
//       progressIntervalRef.current = null;
//     }
//   }, 100);
// };

// const stopProgress = () => {
//   if (progressIntervalRef.current) {
//     clearInterval(progressIntervalRef.current);
//     progressIntervalRef.current = null;
//   }
//   setProgress(100);
// };


//   // Create styles dynamically
//   const styles = createStyles(colors);

//   const nextStep = () => {
//     if (tutorialStep < 5) {
//       setTutorialStep(tutorialStep + 1);
//     } else {
//       handleTutorialComplete();
//     }
//   };

//   // --- Tutorial Logic ---
//   useFocusEffect(
//     useCallback(() => {
//       const checkTutorialStatus = async () => {
//         try {
//           const hasCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
//           if (hasCompleted === 'false') { // Check for 'false' string
//             setShowTutorial(true);
//           }
//         } catch (e) {
//           console.error("Failed to load onboarding status", e);
//         }
//       };
//       checkTutorialStatus();
//       return () => {};
//     }, [])
//   );

//   const handleTutorialComplete = async () => {
//     try {
//       await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
//       setShowTutorial(false);
//     } catch (e) {
//       console.error("Failed to save onboarding status", e);
//     }
//   };

//   // --- Chat History Logic ---
//   useEffect(() => {
//     if (sessionCacheId) {
//       loadChatHistory(sessionCacheId).then(history => {
//         setMessages(history);
//         setSessionId(sessionCacheId);
//         setMode(history.length ? 'response' : 'home');
//       });
//     }
//   }, [sessionCacheId]);
//   useFocusEffect(
//   useCallback(() => {
//     // When ChatHomeSelectorScreen is focused
//     console.log('🟢 Chat screen focused');

//     return () => {
//       // When navigating away
//       console.log('🔴 Chat screen unfocused, aborting any pending requests...');
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//         abortControllerRef.current = null;
//       }
//       stopProgress(); // stop progress bar
//       setThinking(false);
//     };
//   }, [])
// );
// useEffect(() => {
//   return () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//   };
// }, []);


//   // --- API Request Logic ---
//   const sendApiRequest = useCallback(async (queryToSend) => {
//   setThinking(true);
//   setProgress(0);

//   // Abort any existing request before starting a new one
//   if (abortControllerRef.current) {
//     abortControllerRef.current.abort();
//   }

//   const controller = new AbortController();
//   abortControllerRef.current = controller;

//   console.log(`Sending API Request with: Query='${queryToSend}' and Session_ID='${sessionId}'`);

//   try {
//     const response = await fetch(
//       'https://remostart-farmlingua-ai-conversational.hf.space/ask',
//       {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           query: queryToSend,
//           session_id: sessionId,
//         }),
//         signal: controller.signal, // <-- This enables cancellation
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     const aiText = data.answer || 'Sorry, I couldn\'t find an answer.';
//     setAiResponse(aiText);

//     setMessages(prev => {
//       const updated = [...prev, { type: 'ai', text: aiText }];
//       saveChatHistory(sessionId, updated);
//       return updated;
//     });

//   } catch (error) {
//     if (error.name === 'AbortError') {
//       console.log('🛑 API request aborted.');
//       return; // exit quietly
//     }

//     console.error('Error during API request:', error);
//     const errorText = 'Error: Could not connect to the AI service. Please try again.';
//     setAiResponse(errorText);
//     setMessages(prev => {
//       const updated = [...prev, { type: 'ai', text: errorText }];
//       saveChatHistory(sessionId, updated);
//       return updated;
//     });
//   } finally {
//     setThinking(false);
//     abortControllerRef.current = null;
//   }
// }, [sessionId]);
// const sendTTS = useCallback(async (filePath, language) => {
//   // Abort any existing request before starting a new one
//   if (abortControllerRef.current) {
//     abortControllerRef.current.abort();
//   }

//   const controller = new AbortController();
//   abortControllerRef.current = controller;
//   try {
//     console.log('📤 Sending file to TTS API:', filePath);
//     startProgress(8000); // smooth progress for ~8s

//     const fileStat = await RNFS.stat(filePath);
//     const audioFile = {
//       uri: Platform.OS === 'android' ? `file://${fileStat.path}` : fileStat.path,
//       type: 'audio/wav',
//       name: 'speech.wav',
//     };

//     const response = await ApiService.speakAI(audioFile, language,controller.signal);
//     stopProgress();
//     setThinking(false);

//     if (response?.audioUrl) {
//       setMessages(prev => {
//         const updated = [...prev, { type: 'ai', audio: response.audioUrl }];
//         saveChatHistory(sessionId, updated);
//         return updated;
//       });
//     }
//   } catch (error) {
//     console.error('❌ TTS API failed:', error);
//     stopProgress();
//     setThinking(false);
//     setMessages(prev => [
//       ...prev,
//       { type: 'ai', text: 'Error generating speech. Please try again.' },
//     ]);
//   }finally{
//     abortControllerRef.current = null;
//   }
// }, [sessionId]);

//   // --- Effects ---
//   useEffect(() => {
//     if (mode === 'typing') {
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   }, [mode]);

//   useEffect(() => {
//   const lastUserMessage =
//     messages.length > 0 && messages[messages.length - 1].type === 'user'
//       ? messages[messages.length - 1].text
//       : null;

//   if (thinking && lastUserMessage) {
//     startProgress(10000); // e.g. 10s for API progress

//     sendApiRequest(lastUserMessage)
//       .then(() => {
//         stopProgress();
//         setThinking(false);
//         setMode('response');
//       })
//       .catch(() => {
//         stopProgress();
//         setThinking(false);
//         setAiResponse('Error: Could not connect to the AI service.');
//         setMode('response');
//       });
//   }

//   return () => stopProgress();
// }, [thinking, messages, sendApiRequest]);

//   useEffect(() => {
//     if (mode === 'response') {
//       setTimeout(() => {
//         scrollViewRef.current?.scrollToEnd({ animated: true });
//       }, 50);
//     }
//   }, [mode, aiResponse]); // aiResponse triggers this when content changes

//   // --- Handlers ---
//   const handleLogout = async () => {
//     console.log('Logging out...');
//   };

//   const handleInputFocus = () => {
//     if (mode !== 'response' && mode !== 'typing') {
//       setMode('typing');
//     }
//   };

//   const handleQuickAction = (actionTitle) => { 
//     Keyboard.dismiss();
//     setAiResponse(''); 
//     setUserQuery(actionTitle);
//     setMessage(actionTitle);
//     setMode('typing');
//     setTimeout(() => inputRef.current?.focus(), 100);
    
//     setTimeout(() => {
//       if (actionTitle.trim()) {
//         const queryToSend = actionTitle.trim();
//         setMessages(prev => {
//           const updated = [...prev, { type: 'user', text: queryToSend }];
//           saveChatHistory(sessionId, updated);
//           return updated;
//         });
//         setMessage('');
//         setThinking(true);
//         setMode('response');
//       }
//     }, 200);
//   };

//   const handleSend = () => {
//     if (message.trim()) { 
//       Keyboard.dismiss();
//       const queryToSend = message.trim();
//       setMessages(prev => {
//         const updated = [...prev, { type: 'user', text: queryToSend }];
//         saveChatHistory(sessionId, updated);
//         return updated;
//       });
//       setMessage(''); 
//       setThinking(true); 
//       setMode('response');  
//     }
//   };

//   const handleBack = () => { 
//     Keyboard.dismiss();
//     if (mode === 'voice') {    
//       setIsListening(false);
//       setMode('home');
//       return;
//     }
//     if (mode === 'home') {
//       navigation.toggleDrawer();
//     }
//     if (mode === 'response' || userQuery) {
//       setMode('home');
//       setMessages([]);
//       setUserQuery('');
//       setAiResponse('');
//       setThinking(false);
//       setProgress(0); 
//       setSessionId(generateSessionId()); 
//     } else {
//       setMode('home');
//     }
//     setMessage('');
//   };

//   useFocusEffect(
//   useCallback(() => {
//     const onBackPress = () => {
//       if (mode !== 'home') {
//         // Go back to home mode instead of leaving the app
//         handleBack();
//         return true; // prevent app exit
//       }

//       // If already in home mode, allow default Android behavior (exit app)
//       return false;
//     };

//     const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

//     return () => subscription.remove();
//   }, [mode, handleBack])
// );


// const handleSwitchToText = () => {
//     setIsListening(false);
//     setMode('typing'); // Switch to typing mode
//     setTimeout(() => inputRef.current?.focus(), 100); // Focus the input
//   };
//   const handleStopListening = () => {
//     setIsListening(false);
//     setMode('home');
//   };

//   const handleMicPress = () => {
//     Keyboard.dismiss();
//     setMode('voice');
//     setIsListening(true);
//   };

//   const handleSendAudio = (audioPath,language) => {
    
//   if (audioPath) {
   
//     const audioMessage = {
//       type: 'user',
//       text: '',
//       audio: audioPath,
//       timestamp: new Date().toISOString(),
//     };

//     setMessages(prev => {
//       const updated = [...prev, audioMessage];
//       saveChatHistory(sessionId, updated);
//       return updated;
//     });
//     setThinking(true);
//     setMode('response');

//     sendTTS(audioPath,language);
//   }
// };




//   // --- Props for children ---
//   const headerProps = {
//     styles,
//     colors,
//     mode,
//     showTutorial,
//     tutorialStep,
//     menuRef,
//     profileRef,
//     onBackPress: handleBack,
//     onProfilePress: handleLogout,
//     onTutorialNext: nextStep,
//     onTutorialComplete: handleTutorialComplete,
//   };

//   const inputAreaProps = {
//     styles,
//     colors,
//     mode,
//     message,
//     thinking,
//     inputRef,
//     attachRef,
//     showTutorial,
//     tutorialStep,
//     onMessageChange: setMessage,
//     onInputFocus: handleInputFocus,
//     onSend: handleSend,
//     onMicPress: handleMicPress,
//     onLayout: e => setBottomAreaHeight(e.nativeEvent.layout.height),
//     onTutorialNext: nextStep,
//     onTutorialComplete: handleTutorialComplete,
//   };

//   const homeContentProps = {
//     ...inputAreaProps, // Includes all input props
//     onQuickActionPress: handleQuickAction,
//     suggestionRef: suggestionRef,
//   };

//   const chatHistoryProps = {
//     ...inputAreaProps, // Includes all input props
//     messages,
//     thinking,
//     progress,
//     bottomAreaHeight,
//     scrollViewRef,
//     markdownItInstance,
//   };

//   const voiceModeProps = {
//   styles,
//   colors,
//   mode,
//   message,
//   thinking,
//   inputRef,
//   attachRef,
//   showTutorial,
//   tutorialStep,
//   isListening,
//   onMessageChange: setMessage,
//   onInputFocus: handleInputFocus,
//   onSend: handleSend,
//   onSwitchToText: handleSwitchToText, // This will navigate back to text mode
//   onLayout: e => setBottomAreaHeight(e.nativeEvent.layout.height),
//   onTutorialNext: nextStep,
//   onTutorialComplete: handleTutorialComplete,
//   onQuickActionPress: handleQuickAction,
//   onSend: handleSendAudio,
// };

//   // --- Render ---
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={0}
//       >
//         <Header {...headerProps} />
        
//         <View style={styles.mainContent}>
//             {mode === 'home' && <ChatHomeContent {...homeContentProps} />}
//             {(mode === 'typing' || mode === 'response') && <ChatHistory {...chatHistoryProps} />}
//             {mode === 'voice' && <ChatVoiceMode {...voiceModeProps} />}
//         </View>
       
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default ChatHomeSelectorScreen;