import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, scaleHeight, scaleWidth, spacing, typography } from '../utils/theme';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('CreateAccount');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={{width:scaleWidth(416),height:scaleWidth(416),borderWidth:0.5,borderRadius:scaleWidth(500),borderColor:'#EAECF0',alignItems:'center',justifyContent:'center'}}>
        <View style={{width:scaleWidth(352),height:scaleWidth(352),borderWidth:0.5,borderRadius:scaleWidth(400),borderColor:'#EAECF0',alignItems:'center',justifyContent:'center'}}>
          <View style={{width:scaleWidth(288),height:scaleWidth(288),borderWidth:0.6,borderRadius:scaleWidth(300),borderColor:'#EAECF0',alignItems:'center',justifyContent:'center'}}>
            <View style={{width:scaleWidth(224),height:scaleWidth(224),borderWidth:1,borderRadius:scaleWidth(300),borderColor:'#EAECF0',alignItems:'center',justifyContent:'center'}}>
              <View style={{width:scaleWidth(160),height:scaleWidth(160),borderWidth:1,borderRadius:scaleWidth(200),borderColor:'#EAECF0',alignItems:'center',justifyContent:'center'}}>
                <View style={{width:scaleWidth(96),height:scaleWidth(96),borderWidth:1,borderRadius:scaleWidth(100),borderColor:'#EAECF0',alignItems:'center',justifyContent:'center'}}>
                  <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
                </View>
              </View>
            </View>
          </View>
        </View>
        </View>
      </View>
      <View style={{ alignItems: 'center', position: 'absolute', bottom: scaleHeight(200) }}>
        <Text style={styles.title}>Welcome to Farmlingua</Text>
      <Text style={styles.subtitle}>Your Foremost Farming Chatbot</Text>    
      </View>
      </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: scaleHeight(150),
  },
  logo: {
    width: scaleWidth(58),
    height: scaleWidth(58),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
 
export default WelcomeScreen;
