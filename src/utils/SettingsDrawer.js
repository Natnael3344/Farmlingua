import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import SettingsScreen from '../screens/SettingsScreen';

const { width, height } = Dimensions.get('window');

const SettingsDrawer = ({ visible, onClose, navigation, setSession }) => {
  const slideAnim = useRef(new Animated.Value(width)).current;
const handleBackdropPress = () => {
    onClose(); 
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : width,  
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Transparent backdrop to close when tapped outside */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleBackdropPress} />

      {/* The actual drawer */}
      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <SettingsScreen navigation={navigation} onClose={onClose} setSession={setSession} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width:width,
    height,
    top: 0,
    right: 0,
    
    backgroundColor: 'transparent',
    zIndex: 99,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 0.2, // 20% transparent area for closing
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawer: {
    width: width ,
    height,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 6,
    elevation: 10,
  },
});

export default SettingsDrawer;
