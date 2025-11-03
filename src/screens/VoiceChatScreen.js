import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';

const VoiceChatScreen = ({ navigation }) => {
  const [isListening, setIsListening] = useState(false);

  const handleSwitchToText = () => {
    navigation.navigate('ChatTyping');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const shortcuts = ['Plan an Harvest', 'Fertilizers', 'Tools'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

        <View style={styles.content}>
          <View style={styles.voiceContainer}>
            <TouchableOpacity
              style={styles.voiceCircle}
              onPress={toggleListening}
              activeOpacity={0.8}
            >
              <View style={[styles.innerCircle, isListening && styles.innerCircleActive]}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>F</Text>
                </View>
                <Text style={styles.micIcon}>🎤</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.voiceStatusText}>
              {isListening ? 'Listening...' : 'Start Speaking'}
            </Text>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.attachButton} activeOpacity={0.8}>
                <Text style={styles.attachIcon}>📎</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Ask anything about farming..."
                placeholderTextColor={colors.textLight}
                editable={false}
              />

              <TouchableOpacity style={styles.micButton} activeOpacity={0.8}>
                <Text style={styles.micIconSmall}>🎤</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={handleSwitchToText}
              activeOpacity={0.8}
            >
              <Text style={styles.switchButtonText}>Switch to Text</Text>
            </TouchableOpacity>

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
        </View>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  voiceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  voiceCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  innerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  innerCircleActive: {
    backgroundColor: colors.primaryLight,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
  },
  micIcon: {
    fontSize: 32,
  },
  voiceStatusText: {
    ...typography.h3,
    color: colors.text,
  },
  bottomSection: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  attachButton: {
    marginRight: spacing.sm,
  },
  attachIcon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textLight,
    paddingVertical: spacing.sm,
  },
  micButton: {
    marginLeft: spacing.sm,
  },
  micIconSmall: {
    fontSize: 20,
  },
  switchButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  switchButtonText: {
    ...typography.button,
    color: colors.text,
  },
  shortcutsContainer: {
    marginBottom: spacing.sm,
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

export default VoiceChatScreen;
