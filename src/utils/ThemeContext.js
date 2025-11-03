// src/utils/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, darkColors } from './theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved theme from AsyncStorage
  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem('themeMode');
      if (storedTheme === 'dark') setIsDarkMode(true);
    })();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('themeMode', newMode ? 'dark' : 'light');
  };

  const themeColors = isDarkMode ? darkColors : colors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors: themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
