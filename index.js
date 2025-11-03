/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
 

AppRegistry.registerComponent(appName, () => App);
GoogleSignin.configure({
  webClientId: '289922726253-q12k8ea9meb7jguh2s8jl9seb31rn9jl.apps.googleusercontent.com', // Your client ID
});
 
