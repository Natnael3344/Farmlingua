// utils/chatUtils.js

import AsyncStorage from '@react-native-async-storage/async-storage';

export const generateSessionId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Save messages for this session
export const saveChatHistory = async (sessionId, messages) => {
  try {
    if (messages && messages.length > 0) {
      await AsyncStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(messages));
    } else {
      // If messages are empty, remove the item entirely
      await AsyncStorage.removeItem(`chat_history_${sessionId}`);
    }
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

// Load messages for a session
export const loadChatHistory = async (sessionId) => {
  try {
    const stored = await AsyncStorage.getItem(`chat_${sessionId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

// Load all chat sessions (for the Drawer)
export const getAllChatSessions = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter(k => k.startsWith('chat_'));
    const stores = await AsyncStorage.multiGet(chatKeys);
    return stores.map(([key, value]) => ({
      sessionId: key.replace('chat_', ''),
      messages: JSON.parse(value),
    }));
  } catch (error) {
    console.error('Error loading all sessions:', error);
    return [];
  }
};