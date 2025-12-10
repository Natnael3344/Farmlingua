
// import React, { useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
// import { Ionicons } from '@react-native-vector-icons/ionicons';
// import { Lucide } from '@react-native-vector-icons/lucide';
// import Markdown from 'react-native-markdown-display';
// import { scaleHeight, scaleWidth, spacing, typography } from '../utils/theme';
// import Sound from 'react-native-nitro-sound';

// import ApiService from '../config/apiService';
// const MessageBubble = ({ msg, index, styles, colors, markdownItInstance }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [audioAnswer,setAudioAnswer]=useState();
//   const soundRef = useRef(null);
//   console.log("message response",msg)
//   async function requestStoragePermission() {
//   if (Platform.OS === 'android') {
//     try {
//       const permissions = [
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO, // For Android 13+
//       ];

//       const granted = await PermissionsAndroid.requestMultiple(permissions);

//       const allGranted = permissions.every(
//         permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED
//       );

//       if (!allGranted) {
//         console.log('Storage permissions denied', granted);
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.warn(error);
//       return false;
//     }
//   }
//   return true; // iOS or other platforms
// }
//   const playAudio = async (audioPath) => {
//     // const hasPermission = await requestStoragePermission();
//     // if (!hasPermission) {
//     //   console.log('Storage permission denied');
//     //   return;
//     // }
//   try {
//     await Sound.startPlayer(audioPath);
//     Sound.addPlaybackEndListener(() => {
//       setIsPlaying(false);
//       Sound.stopPlayer();
//     });
//     setIsPlaying(true);
//   } catch (error) {
//     console.error('Error playing audio:', error);
//   }
// };
//   const stopAudio = async () => {
//     try {
//       await Sound.stop();
//       setIsPlaying(false);
//     } catch (error) {
//       console.error('Error stopping audio:', error);
//     }
//   };

//   // Audio Message Component
//   const renderAudioMessage = () => (
//     <View style={[styles.aiMessageBubble, {marginLeft:scaleWidth(35),alignItems:'center',justifyContent:'center'}]}>
//       <TouchableOpacity 
//         style={styles.audioButton}
//         onPress={() => playAudio(msg.audio)}
//       >
//         <Ionicons 
//           name={isPlaying ? 'pause-circle' : 'play-circle'} 
//           size={scaleHeight(45)} 
//           color={colors.primary} 
//         />
//       </TouchableOpacity>
      
//       {/* <View style={styles.audioInfo}>
//         <Text style={styles.audioDuration}>Voice message</Text>
//         <Text style={styles.audioTime}>
//           {new Date(msg.timestamp).toLocaleTimeString([], { 
//             hour: '2-digit', 
//             minute: '2-digit' 
//           })}
//         </Text>
//       </View> */}

//       {isPlaying && (
//         <TouchableOpacity 
//           style={styles.stopButton}
//           onPress={stopAudio}
//         >
//           <Ionicons name='square' size={scaleHeight(20)} color={colors.textLight} />
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   if (msg.type === 'user') {
//     return (
//       <View key={index} style={styles.userMessageContainer}>
//         <View>
//           {/* Show audio player for audio messages, text for regular messages */}
//           {msg.audio ? (
//             renderAudioMessage()
//           ) : (
//             <Text style={styles.messageText}>{msg.text}</Text>
//           )}
          
//           <View style={{ marginRight: spacing.md, flexDirection: 'row', gap: spacing.md, alignSelf: 'flex-end', marginTop: spacing.sm }}>
//             <TouchableOpacity>
//               <Ionicons name='copy-outline' size={scaleHeight(25)} color={colors.textLight} />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Ionicons name='share-outline' size={scaleHeight(25)} color={colors.textLight} />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Lucide name='thumbs-up' size={scaleHeight(25)} color={colors.textLight} />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View style={styles.userAvatar}>
//           <Text style={styles.userAvatarText}>U</Text>
//         </View>
//       </View>
//     );
//   } else if (msg.type === 'ai') {
//     return (
//       <View key={index} style={styles.aiMessageContainer}>
//         <View style={styles.aiAvatar}>
//           <Lucide name="bot" size={scaleWidth(20)} color={colors.white} />
//         </View>
//         {/* <View>
//           <View style={styles.aiMessageBubble}>
//             <Markdown
//               markdownit={markdownItInstance}
//               style={{
//                 body: { color: colors.text, ...typography.body },
//                 strong: { fontWeight: 'bold' },
//                 list_item: { marginVertical: spacing.xs },
//               }}
//             >
//               {msg.text}
//             </Markdown>
//           </View>
//           <View style={styles.actionBar}>
//             <TouchableOpacity>
//               <Lucide name='refresh-ccw' size={scaleHeight(25)} color={colors.textLight} />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Ionicons name='copy-outline' size={scaleHeight(25)} color={colors.textLight} />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Ionicons name='share-outline' size={scaleHeight(25)} color={colors.textLight} />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Lucide name='thumbs-up' size={scaleHeight(25)} color={colors.textLight} />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <Lucide name='thumbs-down' size={scaleHeight(25)} color={colors.textLight} />
//             </TouchableOpacity>
//           </View>
//         </View> */}
//         <View>
//         <View style={styles.aiMessageBubble}>
//           {/* ✅ Show audio if AI sent audio, else show text */}
//           {msg.audio ? (
//             <View style={{alignItems: 'flex-start'}}>
//               <TouchableOpacity 
//                 style={styles.audioButton}
//                 onPress={() => playAudio(msg.audio)}
//               >
//                 <Ionicons 
//                   name={isPlaying ? 'pause-circle' : 'play-circle'} 
//                   size={scaleHeight(45)} 
//                   color={colors.primary} 
//                 />
//               </TouchableOpacity>

//               {isPlaying && (
//                 <TouchableOpacity 
//                   style={styles.stopButton}
//                   onPress={stopAudio}
//                 >
//                   <Ionicons name='square' size={scaleHeight(20)} color={colors.textLight} />
//                 </TouchableOpacity>
//               )}
//             </View>
//           ) : (
//             <Markdown
//               markdownit={markdownItInstance}
//               style={{
//                 body: { color: colors.text, ...typography.body },
//                 strong: { fontWeight: 'bold' },
//                 list_item: { marginVertical: spacing.xs },
//               }}
//             >
//               {msg.text}
//             </Markdown>
//           )}
//         </View>
//         <View style={styles.actionBar}>
//           <TouchableOpacity>
//             <Lucide name='refresh-ccw' size={scaleHeight(25)} color={colors.textLight} />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Ionicons name='copy-outline' size={scaleHeight(25)} color={colors.textLight} />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Ionicons name='share-outline' size={scaleHeight(25)} color={colors.textLight} />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Lucide name='thumbs-up' size={scaleHeight(25)} color={colors.textLight} />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Lucide name='thumbs-down' size={scaleHeight(25)} color={colors.textLight} />
//           </TouchableOpacity>
//         </View>
//         </View>
//       </View>
//     );
//   }
//   return null;
// };

// export default React.memo(MessageBubble);


import React, { useRef, useState, useCallback, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Platform, PermissionsAndroid, Image, Clipboard, Share } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import Toast from 'react-native-toast-message';
import { Lucide } from '@react-native-vector-icons/lucide';
import Markdown from 'react-native-markdown-display';
import { scaleHeight, scaleWidth, spacing, typography } from '../utils/theme';
import Sound from 'react-native-nitro-sound';
import ApiService from '../config/apiService';
import { ProfileContext } from '../utils/ProfileContext';

const MessageBubble = ({ msg, index, styles, colors, markdownItInstance }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAnswer, setAudioAnswer] = useState();
  const soundRef = useRef(null);
  const { profile} = useContext(ProfileContext);

  console.log("message response", msg);

  const handleCopy = useCallback(() => {
  const textToCopy = msg?.text || '';

  if (!textToCopy) return;

  Clipboard.setString(textToCopy);
  Toast.show({
    type: 'success',
    text1: 'Copied to clipboard',
  });
}, [msg]);

const handleShare = useCallback(async () => {
  try {
    if (!msg?.text) return;

    await Share.share({
      message: msg.text,
    });
  } catch (error) {
    console.log('Share error:', error);
  }
}, [msg]);



  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        Sound.stopPlayer();
      }
    };
  }, []);

  const requestStoragePermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO, // For Android 13+
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        const allGranted = permissions.every(
          permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          console.log('Storage permissions denied', granted);
          return false;
        }
        return true;
      } catch (error) {
        console.warn(error);
        return false;
      }
    }
    return true; // iOS or other platforms
  }, []);

  const playAudio = useCallback(async (audioPath) => {
    try {
      // Stop any currently playing audio
      if (isPlaying) {
        await Sound.stopPlayer();
        setIsPlaying(false);
      }

      await Sound.startPlayer(audioPath);
      Sound.addPlaybackEndListener(() => {
        setIsPlaying(false);
        Sound.stopPlayer();
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const stopAudio = useCallback(async () => {
    try {
      await Sound.stopPlayer();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (msg.audio) {
      if (isPlaying) {
        stopAudio();
      } else {
        playAudio(msg.audio);
      }
    }
  }, [msg.audio, isPlaying, playAudio, stopAudio]);

  // Audio Message Component - memoized
  const renderAudioMessage = useCallback(() => (
    <View style={[styles.aiMessageBubble, { marginLeft: scaleWidth(35),marginRight:scaleWidth(10), alignItems: 'center', justifyContent: 'center' }]}>
      <TouchableOpacity 
        style={styles.audioButton}
        onPress={handlePlayPause}
      >
        <Ionicons 
          name={isPlaying ? 'pause-circle' : 'play-circle'} 
          size={scaleHeight(45)} 
          color={colors.primary} 
        />
      </TouchableOpacity>
      
      {isPlaying && (
        <TouchableOpacity 
          style={styles.stopButton}
          onPress={stopAudio}
        >
          <Ionicons name='square' size={scaleHeight(20)} color={colors.textLight} />
        </TouchableOpacity>
      )}
    </View>
  ), [isPlaying, colors.primary, colors.textLight, styles, handlePlayPause, stopAudio]);

  // Action buttons component - memoized
  const renderActionButtons = useCallback((isUser = false) => (
    <View style={{ 
      marginRight: spacing.md, 
      flexDirection: 'row', 
      gap: spacing.md, 
      alignSelf: isUser ? 'flex-end' : 'flex-start', 
      marginTop: spacing.sm 
    }}>
      {/* {!isUser && (
        <TouchableOpacity>
          <Lucide name='refresh-ccw' size={scaleHeight(25)} color={colors.textLight} />
        </TouchableOpacity>
      )} */}
      <TouchableOpacity>
        <Ionicons name='copy-outline' size={scaleHeight(25)} color={colors.textLight} onPress={handleCopy}/>
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name='share-outline' size={scaleHeight(25)} color={colors.textLight} onPress={handleShare}/>
      </TouchableOpacity>
      {/* <TouchableOpacity>
        <Lucide name='thumbs-up' size={scaleHeight(25)} color={colors.textLight} />
      </TouchableOpacity> */}
      {/* {!isUser && (
        <TouchableOpacity>
          <Lucide name='thumbs-down' size={scaleHeight(25)} color={colors.textLight} />
        </TouchableOpacity>
      )} */}
    </View>
  ), [colors.textLight, spacing, handleCopy, handleShare]);

  // User message component
  const renderUserMessage = useCallback(() => (
    <View style={styles.userMessageContainer}>
      <View>
        {/* Show audio player for audio messages, text for regular messages */}
        {msg.audio ? (
          renderAudioMessage()
        ) : (
          <Text style={styles.messageText}>{msg.text}</Text>
        )}
        
        {renderActionButtons(true)}
      </View>
      {!profile?.profile_picture? (<View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>U</Text>
      </View>):(
        <Image style={styles.userAvatar} source={{uri:profile?.profile_picture}}/>
      )}
    </View>
  ), [msg, styles, renderAudioMessage, renderActionButtons]);

  // AI message component
  const renderAIMessage = useCallback(() => (
    <View style={styles.aiMessageContainer}>
      <View style={styles.aiAvatar}>
        <Lucide name="bot" size={scaleWidth(20)} color={colors.white} />
      </View>
      <View>
        <View style={styles.aiMessageBubble}>
          {/* Show audio if AI sent audio, else show text */}
          {msg.audio ? (
            <View style={{ alignItems: 'flex-start' }}>
              <TouchableOpacity 
                style={styles.audioButton}
                onPress={handlePlayPause}
              >
                <Ionicons 
                  name={isPlaying ? 'pause-circle' : 'play-circle'} 
                  size={scaleHeight(45)} 
                  color={colors.primary} 
                />
              </TouchableOpacity>

              {isPlaying && (
                <TouchableOpacity 
                  style={styles.stopButton}
                  onPress={stopAudio}
                >
                  <Ionicons name='square' size={scaleHeight(20)} color={colors.textLight} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Markdown
              markdownit={markdownItInstance}
              style={{
                body: { color: colors.text, ...typography.body },
                strong: { fontWeight: 'bold' },
                list_item: { marginVertical: spacing.xs },
              }}
            >
              {msg.text}
            </Markdown>
          )}
        </View>
        {renderActionButtons(false)}
      </View>
    </View>
  ), [msg, styles, colors, markdownItInstance, isPlaying, handlePlayPause, stopAudio, renderActionButtons]);

  // Main render logic
  if (msg.type === 'user') {
    return renderUserMessage();
  } else if (msg.type === 'ai') {
    return renderAIMessage();
  }

  return null;
};

// Custom comparison function for React.memo
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.msg.text === nextProps.msg.text &&
    prevProps.msg.audio === nextProps.msg.audio &&
    prevProps.msg.type === nextProps.msg.type &&
    prevProps.msg.timestamp === nextProps.msg.timestamp &&
    prevProps.colors.primary === nextProps.colors.primary &&
    prevProps.colors.text === nextProps.colors.text &&
    prevProps.colors.textLight === nextProps.colors.textLight &&
    prevProps.colors.white === nextProps.colors.white
  );
};

export default React.memo(MessageBubble, areEqual);