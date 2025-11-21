import AsyncStorage from '@react-native-async-storage/async-storage';

export const useChatSession = () => {
  const saveChatHistory = async (sessionId, messages) => {
    try {
      await AsyncStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const loadChatHistory = async (sessionId) => {
    try {
      const stored = await AsyncStorage.getItem(`chat_${sessionId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  };

  return { saveChatHistory, loadChatHistory };
};
