import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';

const ChatResponseScreen = ({ route, navigation }) => {
  const { userMessage = 'The process of making an irrigation channel?' } = route.params || {};
  const [message, setMessage] = useState('');
  const [thinking, setThinking] = useState(true);
  const [progress, setProgress] = useState(0);
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setThinking(false);
          setAiResponse(
            'Planting maize involves several key steps:\n\n1. Soil Preparation: Prepare well-drained soil with a pH of 5.8-7.0. Till the land to a depth of 6-8 inches.\n\n2. Timing: Plant when soil temperature reaches 60°F (15°C) or higher, typically in late spring.\n\n3. Spacing: Space seeds 8-12 inches apart in rows 30-36 inches apart.\n\n4. Depth: Plant seeds 1-2 inches deep.\n\n5. Water & Care: Keep soil moist but not waterlogged. Apply fertilizer as needed.'
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const shortcuts = ['Plan an Harvest', 'Fertilizers', 'Tools'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Farmlingua</Text>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileImage}>
              <Text style={styles.profileText}>U</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
          <View style={styles.userMessageContainer}>
            <Text style={styles.messageText}>{userMessage}</Text>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>U</Text>
            </View>
          </View>

          {thinking ? (
            <View style={styles.aiMessageContainer}>
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarText}>F</Text>
              </View>
              <View style={styles.thinkingContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.thinkingText}>Thinking {progress}%</Text>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.aiMessageContainer}>
                <View style={styles.aiAvatar}>
                  <Text style={styles.aiAvatarText}>F</Text>
                </View>
                <View style={styles.aiMessageBubble}>
                  <Text style={styles.aiMessageText}>{aiResponse}</Text>

                  <View style={styles.suggestionContainer}>
                    <TouchableOpacity style={styles.suggestionPillPrimary} activeOpacity={0.8}>
                      <Text style={styles.suggestionTextPrimary}>
                        Suggested Late Mar – Early Apr
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.suggestionPillSecondary} activeOpacity={0.8}>
                      <Text style={styles.suggestionTextSecondary}>
                        Weather check Wait for 2–3 wet days
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.actionBar}>
                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                      <Text style={styles.actionIcon}>↶</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                      <Text style={styles.actionIcon}>👍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                      <Text style={styles.actionIcon}>👎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                      <Text style={styles.actionIcon}>📋</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                      <Text style={styles.actionIcon}>🔊</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton} activeOpacity={0.8}>
                <Text style={styles.attachIcon}>📎</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Ask anything about farming..."
                placeholderTextColor={colors.textLight}
                value={message}
                onChangeText={setMessage}
                multiline
              />

              <TouchableOpacity style={styles.micButton} activeOpacity={0.8}>
                <Text style={styles.micIcon}>🎤</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  message.trim() && styles.sendButtonActive,
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.sendIcon}>↑</Text>
              </TouchableOpacity>
            </View>

            
          </View>
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.shortcutsContainer}
              contentContainerStyle={styles.shortcutsContent}
            >
              {shortcuts.map((shortcut, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.shortcutPill}
                  activeOpacity={0.8}
                >
                  <Text style={styles.shortcutText}>{shortcut}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.text,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  messageText: {
    ...typography.body,
    backgroundColor: colors.chatBubbleUser,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    maxWidth: '80%',
    marginRight: spacing.sm,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
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
    width: 32,
    height: 32,
    borderRadius: 16,
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
    width: 200,
    height: 8,
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
    color: colors.textSecondary,
  },
  aiMessageBubble: {
    backgroundColor: colors.chatBubbleAI,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    maxWidth: '80%',
  },
  aiMessageText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  suggestionContainer: {
    marginBottom: spacing.md,
  },
  suggestionPillPrimary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  suggestionTextPrimary: {
    ...typography.bodySmall,
    color: colors.white,
  },
  suggestionPillSecondary: {
    backgroundColor: colors.secondaryLight,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  suggestionTextSecondary: {
    ...typography.bodySmall,
    color: colors.secondary,
  },
  actionBar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 14,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrapper: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  attachButton: {
    marginRight: spacing.sm,
    paddingBottom: spacing.sm,
  },
  attachIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.sm,
    maxHeight: 100,
  },
  micButton: {
    marginLeft: spacing.sm,
    paddingBottom: spacing.sm,
  },
  micIcon: {
    fontSize: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonActive: {
    backgroundColor: colors.black,
  },
  sendIcon: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  shortcutsContainer: {
    marginBottom: spacing.sm,
    flexGrow:0
  },
  shortcutsContent: {
    paddingRight: spacing.md,
  },
  shortcutPill: {
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
});

export default ChatResponseScreen;
