import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform, Image } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { scaleHeight, scaleWidth } from '../utils/theme';

const CIRCLE_SIZE = 120;  
const MAX_RIPPLE_SIZE = 350;  
const RIPPLE_COUNT = 3;  

const RippleEffect = ({ isListening }) => {
  const animatedValues = useRef(
    Array.from({ length: RIPPLE_COUNT }, () => new Animated.Value(0))
  ).current;
 
  const runAnimation = (animatedValue, delay) => {
    animatedValue.setValue(0);
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000, 
        delay: delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    if (isListening) { 
      animatedValues.forEach((val, index) => {
        runAnimation(val, index * 500); 
      });
    } else { 
      animatedValues.forEach((val) => val.stopAnimation());
    }
  }, [isListening]);

  const renderRings = () => {
    return animatedValues.map((animatedValue, index) => {
      const scale = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, MAX_RIPPLE_SIZE / CIRCLE_SIZE],  
      });

      const opacity = animatedValue.interpolate({
        inputRange: [0, 0.4, 0.8, 1],
        outputRange: [0.3, 0.2, 0.05, 0],  
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.ripple,
            {
              transform: [{ scale }],
              opacity,
              borderColor: 'rgba(0, 180, 0, 0.6)',  
              borderWidth: 2,
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.rippleContainer}>
      {isListening && renderRings()}
       
      <View style={styles.logoCenter}>
        
             <Image source={require('../assets/images/logo.png')} style={{ width: scaleWidth(50), height: scaleWidth(50) }} />
            <Ionicons name="mic" size={18} color="red" style={styles.micIcon} />
         
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rippleContainer: {
    width: MAX_RIPPLE_SIZE,
    height: MAX_RIPPLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  logoCenter: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, 
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  logoF: {
    transform: [{ rotate: '5deg' }],
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 50,
    fontWeight: '900',
    color: '#1a1a1a',
    lineHeight: 50,
  },
  micIcon: {
    position: 'absolute',
    top: scaleHeight(45),
    left:scaleWidth(35),
  },
});

export default RippleEffect;