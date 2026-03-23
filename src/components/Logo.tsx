import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface LogoProps {
  variant?: 'auth' | 'header';
  style?: StyleProp<ImageStyle>;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'auth', style }) => {
  const defaultStyles: ImageStyle = variant === 'auth'
    ? { width: 220, height: 120 }
    : { width: 100, height: 30 };

  return (
    <Image
      source={require('../assets/images/logo.png')}
      style={[defaultStyles, style]}
      resizeMode="contain"
    />
  );
};
