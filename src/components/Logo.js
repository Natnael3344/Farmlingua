import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { scaleWidth } from '../utils/theme';

const Logo = ({ style, size = scaleWidth(69), resizeMode = 'contain', ...rest }) => {
  return (
    <Image
      source={require('../assets/images/logo.png')}
      style={[styles.logo, { width: size, height: size }, style]}
      resizeMode={resizeMode}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    // base styles (image doesn't need justifyContent/alignItems)
  },
});

export default Logo;