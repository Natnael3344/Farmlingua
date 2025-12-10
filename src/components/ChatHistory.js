
import React, { useEffect } from 'react';
import { ScrollView, View, Text, BackHandler } from 'react-native';
import MessageBubble from './MessageBubble';
import ChatInputArea from './ChatInputArea';
import { useNavigation } from '@react-navigation/native';
import { scaleHeight } from '../utils/theme';
const ChatHistory = (props) => {
  const {
    styles,
    colors,
    messages,
    thinking,
    progress,
    bottomAreaHeight,
    scrollViewRef,
    markdownItInstance,
    // Extract only input-related props for ChatInputArea
    onInputFocus,
    onSend,
    onMicPress,
    mode,
    message,
    inputRef,
    attachRef,
    showTutorial,
    tutorialStep,
    onMessageChange,
    onTutorialNext,
    onTutorialComplete,
    sessionId
  } = props;

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
    onMessageChange,
    onInputFocus,
    onSend,
    onMicPress,
    onTutorialNext,
    onTutorialComplete,
  };

  return (
    <>
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={[styles.chatContent, { paddingBottom: bottomAreaHeight + scaleHeight(100) }]}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
  <MessageBubble
    key={`${sessionId}-${index}-${msg.timestamp || msg.text}`}
    msg={msg}
    index={index}
    styles={styles}
    colors={colors}
    markdownItInstance={markdownItInstance}
  />
))}

        {thinking && (
          <View style={styles.thinkingContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.thinkingText}>Thinking</Text>
              <Text style={styles.thinkingText}>{progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        )}
      </ScrollView>

      <ChatInputArea {...inputAreaProps} />
    </>
  );
};

export default React.memo(ChatHistory);