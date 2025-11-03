import axios from "axios";

const API_BASE_URL = 'https://farmlingua-backend.onrender.com'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
   },
  timeout: 10000, // 10 seconds timeout
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
  (error) => {
    return Promise.reject(error);
  }
);
 
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Example: If (error.response.status === 401) { handleLogout(); }
    return Promise.reject(error);
  }
);

// --------------------------------------------------
// 3. API Functions
// --------------------------------------------------

const ApiService = {
  /**
   * @param {object} userData - { email, password, name }
   */
  register: (userData) => {
    return api.post('/api/auth/register', userData);
  },

  /**
   * Logs in a user.
   * @param {object} credentials - { email, password }
   */
  login: (credentials) => {
    return api.post('/api/auth/login', credentials);
  },

  /**
   * Logs in a user using Google social sign-in.
   * @param {object} tokenData - { accessToken }
   */
  socialGoogleLogin: (tokenData) => {
  return api.post('/api/auth/social/google', { idToken: tokenData.idToken });
},

socialFacebookLogin: (tokenData) => {
    return api.post('/api/auth/social/facebook', tokenData);
  },


  /**
   * Requests a password reset link/email.
   * @param {object} emailData - { email }
   */
  forgotPassword: (emailData) => {
    return api.post('/api/auth/forgot-password', emailData);
  },


  getMe: () => {
    return api.get('/api/users/me');
  },
};

export default ApiService;