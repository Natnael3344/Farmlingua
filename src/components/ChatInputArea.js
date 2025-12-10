
import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Platform, FlatList } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import Tooltip from 'react-native-walkthrough-tooltip';
import { quickActions } from '../constants/chatConstants'; 
import { scaleHeight, scaleWidth, spacing } from '../utils/theme';

const ChatInputArea = ({
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
  onMicPress,
  onLayout,
  onTutorialNext,
  onTutorialComplete,
}) => {
  const isChatMode = mode === 'typing' || mode === 'response';

  // Component holding the TextInput and buttons (without absolute positioning)
  const inputFieldAndButtons = (
    <View 
      onLayout={onLayout} 
      style={[
        styles.bottomContainer,
        {
          paddingBottom: isChatMode && Platform.OS === 'ios' ? spacing.lg : spacing.md,
          // Removed absolute positioning and zIndex from here
          width:'100%',
          paddingHorizontal: isChatMode && scaleWidth(16),
        }
      ]}
    >
      <View style={styles.inputWrapper}>
        <View style={[styles.inputContainer, isChatMode && styles.inputContainerChatMode]}>
          <TextInput
            style={[styles.input, isChatMode && styles.inputChatMode]}
            placeholder="Ask anything about farming..."
            placeholderTextColor={colors.textLight}
            onFocus={onInputFocus}
            ref={inputRef}
            value={message}
            onChangeText={onMessageChange}
            multiline={isChatMode}
            minHeight={isChatMode ? scaleHeight(40) : undefined}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* Attachment Tooltip Logic */}
            <Tooltip
              isVisible={showTutorial && tutorialStep === 3}
              content={
                <View>
                  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                   <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Attachment(s)</Text>
                   <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={onTutorialComplete} />
                  </View>
                  <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
                  This icon allows users to attach images, soil reports, or documents for the AI to analyze; enabling visual or data-based responses.
                  </Text>
                  <View style={{ flexDirection: 'row', gap: scaleWidth(20) }}>
                    <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={onTutorialNext}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={onTutorialComplete}>
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

            <View style={{ flexDirection: 'row' }}>
              {/* Mic Tooltip Logic */}
              <Tooltip
                isVisible={showTutorial && tutorialStep === 4}
                content={
                  <View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Record Mode</Text>
                    <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={onTutorialComplete} />
                    </View>
                   <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
                   The microphone icon activates voice input, allowing users to speak their queries hands-free. Ideal for farmers on the field, it converts speech into text and provides quick, conversational answers.
                   </Text>
                   <View style={{ flexDirection: 'row', gap: scaleWidth(20) }}>
                     <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={onTutorialNext}>
                     <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={onTutorialComplete}>
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
                  onPress={onMicPress}
                >
                  <Ionicons name='mic-outline' size={scaleHeight(25)} color={'white'} />
                </TouchableOpacity>
              </Tooltip>
              {isChatMode && (
                <TouchableOpacity
                  style={[styles.sendButton, message.trim() && !thinking && styles.sendButtonActive]}
                  activeOpacity={0.8}
                  disabled={!message.trim() || thinking}
                  onPress={onSend}
                >
                  <Ionicons name='arrow-up' size={scaleHeight(25)} color={colors.white} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Component holding the Quick Actions
  const quickActionsComponent = isChatMode && (
    <View style={{paddingHorizontal: scaleWidth(20), paddingBottom: scaleHeight(30),backgroundColor:colors.white}}>
      <FlatList
        data={quickActions}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        style={styles.shortcutsContainer}
        contentContainerStyle={styles.shortcutsContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.shortcutPill}
            activeOpacity={0.8}
            onPress={() => {
              onMessageChange(item.title);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            <Ionicons
              name={item.icon}
              size={scaleHeight(16)}
              color={colors.text}
            />
            <Text style={styles.shortcutText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // Wrapper that combines actions and input, and handles absolute positioning
  const combinedInputArea = (
    <View 
      style={{
        width: '100%',
        // Only apply absolute positioning to the wrapper containing both elements
        position: isChatMode ? 'absolute' : 'relative',
        bottom: isChatMode ? 0 : undefined,
        zIndex: 10,
        // Added padding to ensure spacing above the input when content is present
        // paddingBottom: isChatMode ? scaleHeight(5) : 0, 
      }}
    >
      
      
      {/* 2. The main input field */}
      {inputFieldAndButtons}

      {/* 1. Quick actions appear above the input field */}
      {quickActionsComponent}
    </View>
  );

  return (
    <>
      {/* Conditional Rendering Fix for Cursor Issue (Step 2 Tooltip) */}
      {showTutorial && tutorialStep === 2 ? (
        <Tooltip
          isVisible={true}
          content={
            <View>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
               <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Search Bar</Text>
               <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={onTutorialComplete} />
              </View>
              <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
              This central input field invites users to "Ask anything about farming...", serving as the main interaction area.
              </Text>
              <View style={{ flexDirection: 'row', gap: scaleWidth(20) }}>
                <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={onTutorialNext}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={onTutorialComplete}>
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
          {combinedInputArea}
        </Tooltip>
      ) : (
        // Render the combined structure directly when not in this tutorial step
        combinedInputArea
      )}
    </>
  );
};

export default React.memo(ChatInputArea);