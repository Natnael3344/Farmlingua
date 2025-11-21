import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, Platform, StyleSheet } from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import { quickActions } from '../constants/chatConstants';
import { scaleHeight, scaleWidth, spacing } from '../utils/theme';

const ChatInputVoice = ({
  colors = { text: '#FFFFFF' },
  mode,
  message,
  thinking,
  inputRef,
  attachRef,
  onMessageChange,
  onInputFocus,
  onSend,
  onSwitchToText,
  onLayout,
}) => {
  const isChatMode = mode === 'typing' || mode === 'response';

  return (
    <View
      onLayout={onLayout}
      style={[
        localStyles.bottomContainer,
        {
          paddingBottom: isChatMode && Platform.OS === 'ios' ? spacing.lg : spacing.md,
          position: isChatMode ? 'absolute' : 'relative',
          bottom: isChatMode ? 0 : undefined,
          alignSelf: isChatMode ? 'center' : 'auto',
        },
      ]}
    >
      <View style={localStyles.inputWrapper}>
        <View style={localStyles.inputContainerChatMode}>
          

          <TextInput
            style={localStyles.inputChatMode}
            placeholder="Ask anything about farming..."
            placeholderTextColor={'#A3A3A3'}
            editable={false}
            onFocus={onInputFocus}
            ref={inputRef}
            value={message}
            onChangeText={onMessageChange}
            multiline={isChatMode}
          />

          
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity style={localStyles.attachButton} activeOpacity={0.8} ref={attachRef}>
            <Ionicons name='attach' size={scaleHeight(22)} color={'black'} />
          </TouchableOpacity>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity
            style={localStyles.switchToTextButton}
            activeOpacity={0.8}
            onPress={onSwitchToText}
          >
            <Ionicons name="create-outline" size={scaleHeight(18)} color={'#A3A3A3'} />
            <Text style={localStyles.switchToTextButtonText}>Switch to Text</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              localStyles.sendButton,
              message?.trim() && !thinking && localStyles.sendButtonActive,
            ]}
            activeOpacity={0.8}
            disabled={!message?.trim() || thinking}
            onPress={onSend}
          >
            <Ionicons name="arrow-up" size={scaleHeight(22)} color={'#fff'} />
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  bottomContainer: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaleHeight(17),
    elevation:8,
    borderRadius:scaleHeight(20)
  },

  inputWrapper: {
    width: '100%',
    alignSelf: 'center',
  },

  inputContainerChatMode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: scaleHeight(50),
  },

  inputChatMode: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: scaleHeight(15),
  },

  attachButton: {
    width: scaleHeight(38),
    height: scaleHeight(38),
    borderRadius: scaleHeight(19),
    backgroundColor: 'white',
    borderWidth:1,
    borderColor:'#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  switchToTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth:1,
    borderColor:'#E5E5E5',
    borderRadius: scaleHeight(25),
    paddingHorizontal: scaleWidth(14),
    paddingVertical: scaleHeight(6),
    marginRight: scaleWidth(10),
  },

  switchToTextButtonText: {
    color: '#A3A3A3',
    fontSize: scaleHeight(14),
    marginLeft: scaleWidth(6),
  },

  sendButton: {
    width: scaleHeight(40),
    height: scaleHeight(40),
    borderRadius: scaleHeight(20),
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendButtonActive: {
    backgroundColor: '#3D7BF7',
  },

  shortcutsContainer: {
    width: '100%',
    marginTop: scaleHeight(15),
  },

  shortcutsContent: {
    paddingHorizontal: scaleWidth(10),
  },

  shortcutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: scaleHeight(20),
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(6),
    marginRight: scaleWidth(10),
  },

  shortcutText: {
    color: '#FFFFFF',
    fontSize: scaleHeight(13),
    marginLeft: scaleWidth(6),
  },
});

export default React.memo(ChatInputVoice);
