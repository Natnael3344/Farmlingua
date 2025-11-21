import axios from "axios";
import RNFS from 'react-native-fs';
import { encode } from 'base64-arraybuffer';
const API_BASE_URL = 'https://farmlingua-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    // Example: Retrieve a token from AsyncStorage
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// 3. API Functions
// --------------------------------------------------

const ApiService = {
  /**
   * @param {object} userData - { email, password, name }
   */
  register: (userData) => api.post('/api/auth/register', userData),

  /**
   * Logs in a user.
   * @param {object} credentials - { email, password }
   */
  login: (credentials) => api.post('/api/auth/login', credentials),

  /**
   * Logs in a user using Google social sign-in.
   * @param {object} tokenData - { accessToken }
   */
  socialGoogleLogin: (tokenData) =>
    api.post('/api/auth/social/google', { idToken: tokenData.idToken }),

  socialFacebookLogin: (tokenData) =>
    api.post('/api/auth/social/facebook', tokenData),

  /**
   * Requests a password reset link/email.
   * @param {object} emailData - { email }
   */
  forgotPassword: (emailData) => api.post('/api/auth/forgot-password', emailData),

  getMe: () => api.get('/api/users/me'),

  /**
   * 🔊 Uploads an audio file and performs text-to-speech processing.
   * @param {File | Blob} audioFile - WAV audio file to send.
   * @param {string} language - Language code (e.g., 'en')
   */
  speakAI: async (audioFile, language = 'en',signal) => {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioFile, 'speech.wav');
      formData.append('language', language);

      console.log('📤 Sending to Speak AI API...');

      const response = await fetch(
        'https://remostart-farmlingua-voice-system.hf.space/speak-ai',
        {
          method: 'POST',
          body: formData,
          signal,
        }
      );

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const contentType = response.headers.get('content-type');

      // 🎧 If response is audio (binary)
      if (contentType?.startsWith('audio/')) {
        const arrayBuffer = await response.arrayBuffer();

        // ✅ Convert ArrayBuffer → Base64
        const base64Audio = encode(arrayBuffer);

        // ✅ Save to Downloads folder
        const fileExt = contentType.includes('wav') ? 'wav' : 'mp3';
        const downloadsPath =
          Platform.OS === 'android'
            ? RNFS.DownloadDirectoryPath
            : `${RNFS.DocumentDirectoryPath}/Downloads`;

        const filePath = `${downloadsPath}/tts_response_${Date.now()}.${fileExt}`;

        // 📝 Write file to Downloads folder
        await RNFS.writeFile(filePath, base64Audio, 'base64');
        console.log('💾 Audio saved to Downloads:', filePath);

        return { text: '', audioUrl: `file://${filePath}`, audioPath: filePath };
      }

      // 🧩 Otherwise, try to parse JSON (fallback)
      try {
        const result = await response.json();
        const responseText =
          typeof result === 'string' ? result : JSON.stringify(result);

        let audioUrl;
        if (responseText.startsWith('http://') || responseText.startsWith('https://')) {
          audioUrl = responseText;
        } else if (typeof result === 'object' && result !== null) {
          audioUrl = result.audio_url || result.url || result.audioUrl;
        }

        return { text: responseText, audioUrl };
      } catch {
        return { text: '' };
      }
    } catch (error) {
      console.error('❌ Speak AI API error:', error.message);
      throw error;
    }
  },

};

export default ApiService;

// --------------------------------------------------
// 4. AI Query Function (existing)
// --------------------------------------------------

export const sendApiRequest = async (query, sessionId, setProgress) => {
  try {
    const response = await fetch(
      'https://remostart-farmlingua-ai-conversational.hf.space/ask',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, session_id: sessionId }),
      }
    );

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    setProgress(100);
    return data.answer || 'Sorry, I could not find an answer.';
  } catch (err) {
    console.error('API error:', err);
    return 'Error: Could not connect to AI service.';
  }
};
