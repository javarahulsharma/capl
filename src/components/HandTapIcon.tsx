import React from 'react';
import { View } from 'react-native';
import { Hand } from 'lucide-react-native';

export const HandTapIcon = ({ size = 48, color = '#fff' }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Hand size={size} color={color} />
    </View>
  );
};
