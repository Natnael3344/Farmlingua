// components/ChatHeader.js

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import Tooltip from 'react-native-walkthrough-tooltip';
import { scaleHeight, scaleWidth } from '../utils/theme';
import { ProfileContext } from '../utils/ProfileContext';

const ChatHeader = ({
  styles,
  colors,
  mode,
  showTutorial,
  tutorialStep,
  menuRef,
  profileRef,
  onBackPress,
  onProfilePress,
  onTutorialNext,
  onTutorialComplete,
}) => {
  const { profile, updateProfile, fetchProfile } = useContext(ProfileContext);

  console.log("tutorial",showTutorial)
  return (
    <View style={styles.header}>
      <Tooltip
        isVisible={showTutorial && tutorialStep === 0}
        content={
          <View>
             <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
             <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Menu</Text>
             <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={onTutorialComplete} />
             </View>
            <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
              This is the menu. You can access settings and other features here.
            </Text>
            <View style={{ flexDirection: 'row', gap: scaleWidth(20),  }}>
              <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={onTutorialNext}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={onTutorialComplete}>
              <Text style={{ color: '#1870f2', fontWeight: 'bold',alignSelf:'center' }}>Skip {'>>'}</Text>
            </TouchableOpacity>
            </View>
            
          </View>
        }
        placement="bottom"
        contentStyle={{backgroundColor:'#141c24', padding:scaleHeight(15), borderRadius:scaleHeight(10)}}
        tooltipStyle={{width:scaleWidth(250)}}
        arrowSize={{ width: scaleWidth(12), height: scaleHeight(8) }}
        backgroundColor='transparent'
        showChildInTooltip={false}
        useInteractionManager={false}
        accessible={false}
        topAdjustment={Platform.OS === 'android' ? 0 : 0}
      >
        <TouchableOpacity style={styles.menuButton} onPress={onBackPress} ref={menuRef}>
          {mode === 'home' ? (
            <Ionicons name='menu-sharp' size={scaleHeight(20)} color={colors.text} />
          ) : (
            <Ionicons name='arrow-back' size={scaleHeight(20)} color={colors.text} />
          )}
        </TouchableOpacity>
      </Tooltip>

      <Text style={[styles.headerTitle, { fontSize: scaleHeight(18) }]}>Farmlingua</Text>

      <Tooltip
        isVisible={showTutorial && tutorialStep === 1}
        content={
          <View>
             <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
             <Text style={{ color: 'white', fontSize: scaleHeight(16),fontWeight:'bold', marginBottom: scaleHeight(8) }}>Profile</Text>
             <Ionicons name='close' size={scaleHeight(20)} color='white' onPress={onTutorialComplete} />
             </View>
            <Text style={{ color: 'white', fontSize: 14, marginBottom: 8 }}>
              This is your profile. Tap here to view or edit your personal information, check your activity, or log out from the app.
            </Text>
            <View style={{ flexDirection: 'row', gap: scaleWidth(20),  }}>
              <TouchableOpacity style={{paddingHorizontal: scaleWidth(15), paddingVertical: scaleHeight(5),borderRadius:scaleHeight(5),backgroundColor:'#1975ff'}} onPress={onTutorialNext}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Next ({tutorialStep + 1}/6)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingVertical: scaleHeight(5), }} onPress={onTutorialComplete}>
              <Text style={{ color: '#1870f2', fontWeight: 'bold',alignSelf:'center' }}>Skip {'>>'}</Text>
            </TouchableOpacity>
            </View>
            
          </View>
        }
        placement="bottom"
        contentStyle={{backgroundColor:'#141c24', padding:scaleHeight(15), borderRadius:scaleHeight(10)}}
        tooltipStyle={{width:scaleWidth(250)}}
        arrowSize={{ width: scaleWidth(12), height: scaleHeight(8) }}
        backgroundColor='transparent'
        showChildInTooltip={false}
        useInteractionManager
      >
      <TouchableOpacity style={styles.profileButton} onPress={onProfilePress} ref={profileRef}>
        <Image source={{uri:profile?.profile_picture}} style={styles.profileImage}/>
        
      </TouchableOpacity>
      </Tooltip>
    </View>
  );
};

export default React.memo(ChatHeader);