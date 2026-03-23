import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  useSafeArea?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, useSafeArea = true }) => {
  const Content = useSafeArea ? SafeAreaView : View;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Content style={styles.innerContainer}>
        {children}
      </Content>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  innerContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
