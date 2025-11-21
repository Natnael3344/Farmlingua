// import React, { useContext, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
// import { Ionicons } from '@react-native-vector-icons/ionicons';
// import { ThemeContext } from '../utils/ThemeContext';
// import RippleEffect from '../components/RippleEffect';
// import Logo from '../components/Logo';
// import ChatInputVoice from './ChatInputVoice';
// import { scaleWidth } from '../utils/theme';
// import Sound from 'react-native-nitro-sound';
// import RNFS from 'react-native-fs';
// import ApiService from '../config/apiService';

// const ChatVoiceMode = ({
//   styles,
//   colors,
//   mode,
//   message,
//   thinking,
//   inputRef,
//   attachRef,
//   showTutorial,
//   tutorialStep,
//   onMessageChange,
//   onInputFocus,
//   onSend,
//   onSwitchToText,
//   onLayout,
//   onTutorialNext,
//   onTutorialComplete,
//   onQuickActionPress,
// }) => {
//   const { colors: themeColors } = useContext(ThemeContext);
//   const [isListening, setIsListening] = useState(false);
//   const [recordedPath, setRecordedPath] = useState(null);
//   const recorderRef = useRef(null);

//   // 🌍 Language state
//   const [language, setLanguage] = useState('en');
//   const languages = ['en', 'ig', 'yo', 'ha'];

//   const cycleLanguage = () => {
//     const currentIndex = languages.indexOf(language);
//     const nextIndex = (currentIndex + 1) % languages.length;
//     setLanguage(languages[nextIndex]);
//   };

//   // ✅ Request microphone permissions
//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       const result = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//       );
//       return result === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   // 🎙️ Start recording
//   const startRecording = async () => {
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//       console.warn('Microphone permission not granted');
//       return;
//     }

//     try {
//       setIsListening(true);
//       const fileName = `voice_${Date.now()}.wav`;
//       const recordPath = Platform.select({
//         android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
//         ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
//       });

//       const result = await Sound.startRecorder(recordPath);
//       console.log('🎙️ Recording started:', result);
//       recorderRef.current = recordPath;
//     } catch (error) {
//       console.error('Error starting recording:', error);
//       setIsListening(false);
//     }
//   };

//   // 🛑 Stop recording
//   const stopRecording = async () => {
//     try {
//       const result = await Sound.stopRecorder();
//       console.log('🛑 Recording stopped. File:', result);

//       setRecordedPath(result);
//       setIsListening(false);

//       // ✅ Automatically send to API
//       if (result) {
//         console.log('📤 Sending voice message:', result);
//         onSend(result, language); // send along the selected language
//         setRecordedPath(null);
//       }
//     } catch (error) {
//       console.error('Error stopping recording:', error);
//       setIsListening(false);
//     }
//   };

//   const handleSend = async () => {
//     if (isListening) {
//       setIsListening(false);
//     }
//     setRecordedPath(`${RNFS.DownloadDirectoryPath}/tts.wav`);

//     if (recordedPath) {
//       console.log('📤 Sending voice message:', recordedPath);
//       onSend(recordedPath, language);
//       setRecordedPath(null);
//     }
//   };

//   const inputVoiceProps = {
//     styles,
//     colors: colors || themeColors,
//     mode: 'voice',
//     message,
//     thinking,
//     inputRef,
//     attachRef,
//     showTutorial,
//     tutorialStep,
//     onMessageChange,
//     onInputFocus,
//     onSend: handleSend,
//     onSwitchToText,
//     onLayout,
//     onTutorialNext,
//     onTutorialComplete,
//   };

//   return (
//     <View style={styles.voiceModeContainer}>
//       {/* 🌍 Language Selector Button */}
//       <View style={{ position: 'absolute', top: 15, right: 20, zIndex: 10 }}>
//         <TouchableOpacity
//           onPress={cycleLanguage}
//           style={{
//             backgroundColor: '#EFEFEF',
//             paddingHorizontal: 14,
//             paddingVertical: 6,
//             borderRadius: 20,
//             flexDirection: 'row',
//             alignItems: 'center',
//           }}
//         >
//           <Ionicons name="language" size={18} color="#333" style={{ marginRight: 6 }} />
//           <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>
//             {language.toUpperCase()}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* 🎤 Central Mic Button */}
//       <View style={styles.voiceModeCentralContent}>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={isListening ? stopRecording : startRecording}
//         >
//           <View
//             style={{
//               alignItems: 'center',
//               justifyContent: 'center',
//               width: scaleWidth(271),
//               height: scaleWidth(271),
//               borderRadius: scaleWidth(271),
//               backgroundColor: 'white',
//               elevation: 5,
//             }}
//           >
//             <View
//               style={{
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: scaleWidth(195),
//                 height: scaleWidth(195),
//                 borderRadius: scaleWidth(195),
//                 backgroundColor: 'white',
//                 elevation: 6,
//               }}
//             >
//               <View
//                 style={{
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   width: scaleWidth(125),
//                   height: scaleWidth(125),
//                   borderRadius: scaleWidth(125),
//                   backgroundColor: 'white',
//                   elevation: 8,
//                 }}
//               >
//                 <View style={styles.voiceLogoContainer}>
//                   <Logo size={80} />
//                   <View style={styles.voiceMicIconBadge}>
//                     <Ionicons
//                       name={isListening ? 'mic' : 'mic-outline'}
//                       size={24}
//                       color={isListening ? '#FF3B30' : '#A3A3A3'}
//                     />
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </TouchableOpacity>

//         <Text style={styles.voiceModePromptText}>
//           {isListening ? 'Listening...' : 'Start Speaking'}
//         </Text>
//       </View>

//       {/* 💬 Bottom Chat Input */}
//       <View style={styles.voiceModeBottomArea}>
//         <ChatInputVoice {...inputVoiceProps} />
//       </View>
//     </View>
//   );
// };

// export default React.memo(ChatVoiceMode);
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform, BackHandler } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { ThemeContext } from '../utils/ThemeContext';
import RippleEffect from '../components/RippleEffect';
import Logo from '../components/Logo';
import ChatInputVoice from './ChatInputVoice';
import { scaleWidth } from '../utils/theme';
import Sound from 'react-native-nitro-sound';
import RNFS from 'react-native-fs';
import ApiService from '../config/apiService';
import { useNavigation } from '@react-navigation/native';

const ChatVoiceMode = ({
  styles,
  colors,
  mode,
  message,
  thinking,
  inputRef,
  attachRef,
  showTutorial,
  tutorialStep,
  onMessageChange,
  onInputFocus,
  onSend,
  onSwitchToText,
  onLayout,
  onTutorialNext,
  onTutorialComplete,
  onQuickActionPress,
}) => {
  const { colors: themeColors } = useContext(ThemeContext);
  const [isListening, setIsListening] = useState(false);
  const [recordedPath, setRecordedPath] = useState(null);
  const recorderRef = useRef(null);
  const navigation = useNavigation();
  
    useEffect(() => {
      const handleBackPress = () => {
        // Navigate back
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true; // prevent default behavior (exit app)
        }
        return false; // allow default behavior if cannot go back
      };
  
      // Add event listener
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
      // Cleanup when component unmounts
      return () => backHandler.remove();
    }, [navigation]);

  // 🌍 Language list with names
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ig', name: 'Igbo' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'ha', name: 'Hausa' },
  ];

  const [languageIndex, setLanguageIndex] = useState(0);
  const language = languages[languageIndex];

  const cycleLanguage = () => {
    setLanguageIndex((prev) => (prev + 1) % languages.length);
  };

  // ✅ Request microphone permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // 🎙️ Start recording
  const startRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('Microphone permission not granted');
      return;
    }

    try {
      setIsListening(true);
      const fileName = `voice_${Date.now()}.wav`;
      const recordPath = Platform.select({
        android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
        ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
      });

      const result = await Sound.startRecorder(recordPath);
      console.log('🎙️ Recording started:', result);
      recorderRef.current = recordPath;
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsListening(false);
    }
  };

  // 🛑 Stop recording
  const stopRecording = async () => {
    try {
      const result = await Sound.stopRecorder();
      console.log('🛑 Recording stopped. File:', result);

      setRecordedPath(result);
      setIsListening(false);

      // ✅ Automatically send to API
      if (result) {
        console.log('📤 Sending voice message:', result,language.code);
        onSend(result, language.code); // send along selected language code
        setRecordedPath(null);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsListening(false);
    }
  };

  const handleSend = async () => {
    if (isListening) {
      setIsListening(false);
    }
    setRecordedPath(`${RNFS.DownloadDirectoryPath}/tts.wav`);

    if (recordedPath) {
      console.log('📤 Sending voice message:', recordedPath,language.code);
      onSend(recordedPath, language.code);
      setRecordedPath(null);
    }
  };

  const inputVoiceProps = {
    styles,
    colors: colors || themeColors,
    mode: 'voice',
    message,
    thinking,
    inputRef,
    attachRef,
    showTutorial,
    tutorialStep,
    onMessageChange,
    onInputFocus,
    onSend: handleSend,
    onSwitchToText,
    onLayout,
    onTutorialNext,
    onTutorialComplete,
  };

  return (
    <View style={styles.voiceModeContainer}>
      {/* 🌍 Language Selector Button */}
      <View style={{ position: 'absolute', top: 15, right: 20, zIndex: 10 }}>
        <TouchableOpacity
          onPress={cycleLanguage}
          style={{
            backgroundColor: '#EFEFEF',
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="language" size={18} color="#333" style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>
            {language.name}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🎤 Central Mic Button */}
      <View style={styles.voiceModeCentralContent}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={isListening ? stopRecording : startRecording}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: scaleWidth(271),
              height: scaleWidth(271),
              borderRadius: scaleWidth(271),
              backgroundColor: 'white',
              elevation: 5,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: scaleWidth(195),
                height: scaleWidth(195),
                borderRadius: scaleWidth(195),
                backgroundColor: 'white',
                elevation: 6,
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: scaleWidth(125),
                  height: scaleWidth(125),
                  borderRadius: scaleWidth(125),
                  backgroundColor: 'white',
                  elevation: 8,
                }}
              >
                <View style={styles.voiceLogoContainer}>
                  <Logo size={80} />
                  <View style={styles.voiceMicIconBadge}>
                    <Ionicons
                      name={isListening ? 'mic' : 'mic-outline'}
                      size={24}
                      color={isListening ? '#FF3B30' : '#A3A3A3'}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.voiceModePromptText}>
          {isListening ? 'Listening...' : 'Start Speaking'}
        </Text>
      </View>

      {/* 💬 Bottom Chat Input */}
      <View style={styles.voiceModeBottomArea}>
        <ChatInputVoice {...inputVoiceProps} />
      </View>
    </View>
  );
};

export default React.memo(ChatVoiceMode);
