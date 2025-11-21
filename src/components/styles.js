// styles/ChatHomeSelectorScreen.styles.js

import { StyleSheet, Platform } from 'react-native';
import { spacing, typography, borderRadius, shadows, scaleHeight, scaleWidth } from '../utils/theme';

export const createStyles = (colors) => StyleSheet.create({
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
    marginTop: scaleHeight(50),
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
    backgroundColor:'black',
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
  },
  voiceModeContainer: {
  flex: 1,
  backgroundColor: colors.background,
  justifyContent: 'space-between', // Pushes content to top and bottom
},
voiceModeCentralContent: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: scaleHeight(100), // Push up from the center a bit
},
voiceLogoContainer: {
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  // You might need to adjust this if your Logo component has a different size
  width: scaleHeight(100), 
  height: scaleHeight(100),
},
voiceMicIconBadge: {
  position: 'absolute',
  top: '55%', // Adjust as needed
  right: '15%', // Adjust as needed
  backgroundColor: colors.background, // Badge background
  borderRadius: scaleHeight(20),
  padding: scaleHeight(4),
  // Add shadow or border if needed
},
voiceModePromptText: {
  marginTop: spacing.lg,
  fontSize: typography.h5,
  fontWeight: '600',
  color: colors.text,
},
voiceModeBottomArea: {
  paddingHorizontal: spacing.md,
  paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
  width: '100%',
},

// --- Voice Input Bar Styles ---
voiceModePlaceholder: {
  flex: 1,
  fontSize: typography.body.fontSize,
  color: colors.textLight,
  paddingHorizontal: spacing.sm,
},
switchButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.card,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs + 2,
  borderRadius: borderRadius.md,
  marginHorizontal: spacing.sm,
},
switchButtonText: {
  color: colors.text,
  fontSize: typography.small,
  fontWeight: '500',
  marginLeft: spacing.xs,
},

// --- Voice Quick Action Styles ---
voiceQuickActionsContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-start', // Align items to the start
  alignItems: 'center',
  paddingHorizontal: spacing.sm,
  marginTop: spacing.md,
  width: '100%',
},
voiceQuickActionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.card,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderRadius: borderRadius.lg,
  marginRight: spacing.sm,
},
voiceQuickActionText: {
  color: colors.text,
  fontSize: typography.body.fontSize,
  fontWeight: '500',
  marginLeft: spacing.xs,
},
voiceSettingsButton: {
  position: 'absolute',
  right: 0,
  marginRight: 0,
  paddingHorizontal: spacing.sm, // Make it more of a circle/square
},

audioContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.chatBubbleUser,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderRadius: borderRadius.md,
  borderWidth: 1,
  borderColor: colors.border,
  maxWidth: '80%',
},
audioButton: {
  
},
audioInfo: {
  flex: 1,
},
audioDuration: {
  ...typography.bodySmall,
  color: colors.text,
  fontWeight: '500',
},
audioTime: {
  ...typography.caption,
  color: colors.textLight,
  marginTop: 2,
},
stopButton: {
  marginLeft: spacing.sm,
  padding: spacing.xs,
},
});