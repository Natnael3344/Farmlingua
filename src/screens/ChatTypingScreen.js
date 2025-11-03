import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons';
import { colors, spacing, typography, borderRadius, shadows, scaleWidth, scaleHeight } from '../utils/theme';
import { quickActions } from './ChatHomeSelectorScreen';

const ChatTypingScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    });

  const handleSend = () => {
    if (message.trim()) {
      navigation.navigate('ChatResponse', { userMessage: message });
    }
  };

  const shortcuts = ['Plan an Harvest', 'Fertilizers', 'Technical Help', 'Pest Control', 'Weather', 'Loans & Finances', 'Farm Security', 'Get Farm Workers'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
                  <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back' size={scaleHeight(20)}/>
                  </TouchableOpacity>
                  <Text style={[styles.headerTitle,{fontSize:scaleHeight(18)}]}>Farmlingua</Text>
                  <TouchableOpacity style={styles.profileButton} >
                    <View style={styles.profileImage}>
                      <Text style={styles.profileText}>U</Text>
                    </View>
                  </TouchableOpacity>
                </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.placeholder} />
        </ScrollView>

        <View style={styles.bottomContainer}>
          <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
              <TextInput
              style={styles.input}
              placeholder="Ask anything about farming..."
              placeholderTextColor={colors.textLight}
              ref={inputRef}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
<TouchableOpacity
              style={styles.attachButton}
              activeOpacity={0.8}
            >
             <Ionicons name='attach' size={scaleHeight(25)} color={colors.text}/>
            </TouchableOpacity>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity
              style={styles.attachButton}
              activeOpacity={0.8}
            >
              <Ionicons name='mic-outline' size={scaleHeight(25)} color={colors.text}/>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.attachButton,{backgroundColor: message ? colors.text : colors.textLight}]}
              activeOpacity={0.8}
              disabled={!message}
              onPress={handleSend}
            >
              <Ionicons name='arrow-up' size={scaleHeight(25)} color={'white'}/>
            </TouchableOpacity>
            </View>
            

            </View>
            

            

            
          </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.shortcutsContainer}
              contentContainerStyle={styles.shortcutsContent}
            >
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.shortcutPill}
                  activeOpacity={0.8}
                > 
                  <Ionicons name={action.icon} size={scaleHeight(20)} color={colors.text} />
                  <Text style={styles.shortcutText}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: colors.text,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  placeholder: {
    flex: 1,
  },
  bottomContainer: {
    backgroundColor: colors.white,
  },
  inputWrapper: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  attachButton: {
    marginRight: spacing.sm,
    borderRadius: 100,
    borderWidth:1,
    borderColor:colors.textLight,
    padding:scaleHeight(5)
  },
  
  input: {
    
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.sm,
    minHeight: scaleHeight(40),
    marginBottom: spacing.md
  },
  micButton: {
    marginLeft: spacing.sm,
  },
  micIcon: {
    fontSize: 20,
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
    color:'white'
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
  },
  shortcutsContent: {
    paddingRight: spacing.md,
  },
  shortcutPill: {
    flexDirection: 'row',
    gap:scaleWidth(5),
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

export default ChatTypingScreen;
