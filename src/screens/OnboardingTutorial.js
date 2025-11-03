// components/OnboardingTutorial.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingTutorial = ({ children, tooltips = [], onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        const viewed = await AsyncStorage.getItem('hasViewedTutorial');
        if (!viewed) {
          setShowTutorial(true);
          fadeIn();
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
      }
    };
    checkTutorialStatus();
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (callback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (callback) callback();
    });
  };

  const handleNext = async () => {
    fadeOut(() => {
      if (currentStep < tooltips.length - 1) {
        setCurrentStep(currentStep + 1);
        fadeIn();
      } else {
        AsyncStorage.setItem('hasViewedTutorial', 'true');
        setShowTutorial(false);
        onFinish?.();
      }
    });
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasViewedTutorial', 'true');
    fadeOut(() => {
      setShowTutorial(false);
      onFinish?.();
    });
  };

  if (!showTutorial || !tooltips.length) return children;

  const tooltip = tooltips[currentStep];

  return (
    <Tooltip
      isVisible={showTutorial}
      content={
        <Animated.View style={[styles.tooltipContent, { opacity: fadeAnim }]}>
          <Text style={styles.tooltipText}>{tooltip.text}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>
                {currentStep === tooltips.length - 1 ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      }
    //   placement={tooltip.placement || 'bottom'}
      showChildInTooltip={false}
      onClose={() => setShowTutorial(false)}
      backgroundColor="rgba(0,0,0,0.45)"
      tooltipStyle={styles.tooltipBox}
      arrowSize={{ width: 12, height: 8 }}
      useInteractionManager
      
    >
      {children}

    </Tooltip>
  );
};

const styles = StyleSheet.create({
  tooltipBox: {
    backgroundColor: '#0A3A67', // deep blue
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    width: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  skipText: {
    color: '#FFFFFFB3',
    fontSize: 13,
    fontWeight: '400',
  },
  nextButton: {
    backgroundColor: '#1E7CF2',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  nextText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default OnboardingTutorial;
