import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Image, Pattern, Rect, Use, Path } from 'react-native-svg';

interface SvgQRProps {
  size?: number;
  color?: string;
}

export const SvgQR: React.FC<SvgQRProps> = ({
  size = 54,
}) => {
  return (
    <View style={styles.container}>
      <Svg
        width={34}
        height={34}
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"

      >
        <Path
          d="M0 15V0h15v15H0zm3-3h9V3H3v9zM0 34V19h15v15H0zm3-3h9v-9H3v9zm16-16V0h15v15H19zm3-3h9V3h-9v9zm8.25 22v-3.75H34V34h-3.75zM19 22.75V19h3.75v3.75H19zm3.75 3.75v-3.75h3.75v3.75h-3.75zM19 30.25V26.5h3.75v3.75H19zM22.75 34v-3.75h3.75V34h-3.75zm3.75-3.75V26.5h3.75v3.75H26.5zm0-7.5V19h3.75v3.75H26.5zm3.75 3.75v-3.75H34v3.75h-3.75z"
          fill="#5F6368"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});