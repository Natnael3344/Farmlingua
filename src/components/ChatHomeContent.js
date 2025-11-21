// components/ChatHomeContent.js

import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import Tooltip from 'react-native-walkthrough-tooltip';
import Logo from '../components/Logo';
import ChatInputArea from './ChatInputArea'; // Import the input area
import { quickActions } from '../constants/chatConstants'; // Import constants
import { scaleHeight, scaleWidth, spacing } from '../utils/theme';

const ChatHomeContent = (props) => {
  const {
    styles,
    colors,
    mode,
    onQuickActionPress,
    showTutorial,
    tutorialStep,
    suggestionRef,
    onTutorialComplete,
  } = props;

  return (
    <ScrollView style={styles.scrollContentHome} contentContainerStyle={styles.scrollContentHomeContainer}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>
      <View style={{ flexDirection: 'row', alignSelf: 'center', gap: spacing.md, marginTop: spacing.xl }}>
        <Ionicons name='mic-outline' color={'#A3A3A3'} size={scaleHeight(20)} />
        <Text style={styles.voiceModeText}>Tap a mode to activate Voice</Text>
      </View>
      
      {/* Render ChatInputArea directly, passing all relevant props */}
      <ChatInputArea {...props} onInputFocus={props.onInputFocus} />

      <Tooltip
        isVisible={showTutorial && tutorialStep === 5}
        content={
           <View>
             <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
             <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Search Quick Start</Text>
             <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={onTutorialComplete} />
             </View>
            <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
            This enables quick queries or task execution, from crop advice to weather insights, using natural language.
            </Text>
            <View style={{ flexDirection: 'row', gap: scaleWidth(20),  }}>
              <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={onTutorialComplete}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Got it</Text>
            </TouchableOpacity>
            </View>
          </View>
        }
        placement="top"
        contentStyle={{backgroundColor:'#141c24', padding:scaleHeight(15), borderRadius:scaleHeight(10)}}
        tooltipStyle={{width:scaleWidth(250)}}
        arrowSize={{ width: scaleWidth(12), height: scaleHeight(8) }}
        backgroundColor='transparent'
        showChildInTooltip={false}
        useInteractionManager={false}
        accessible={false}
        topAdjustment={Platform.OS === 'android' ? 0 : 0}
      >
        <View ref={suggestionRef} style={[styles.quickActionsContainer, mode === 'home' ? { justifyContent: 'flex-start' } : { justifyContent: 'center' }]}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              activeOpacity={0.8}
              onPress={() => onQuickActionPress(action.title)}
            >
              <Ionicons name={action.icon} size={scaleHeight(20)} color={colors.text} />
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Tooltip>
    </ScrollView>
  );
};

export default React.memo(ChatHomeContent);