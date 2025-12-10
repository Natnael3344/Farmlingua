// src/utils/ProfileContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://farmlingua-backend-g220.onrender.com';
  const normalizeImage = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const fetchProfile = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("profile does not exist")
      if (!token) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("profile exist",res)
      const user = res.data;
      // user.profile_picture = normalizeImage(user.profile_picture);
      user.profile_picture_version = Date.now();
      console.log("user profile",user.profile_picture)
      setProfile(user);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching profile:', err.message);
      setLoading(false);
    }
  }, []);

  const updateProfile = (updates) => {
    const updated = { ...profile, ...updates };
    if (updated.profile_picture)
      // updated.profile_picture = normalizeImage(updated.profile_picture);
      updated.profile_picture_version = Date.now();
       console.log("updated",updated.profile_picture)
    setProfile(updated);
  };

  const clearProfile = async () => {
    await AsyncStorage.removeItem('userToken');
    setProfile(null);
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{ profile, loading, fetchProfile, updateProfile, clearProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
