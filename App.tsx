import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold 
} from '@expo-google-fonts/poppins';

SplashScreen.preventAutoHideAsync();

import { AuthProvider, useAuth } from './src/api/authContext';

const AppContent = ({ fontsLoaded }: { fontsLoaded: boolean }) => {
  const { isLoading } = useAuth();

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded && !isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  return (
    <AuthProvider>
      <AppContent fontsLoaded={fontsLoaded} />
    </AuthProvider>
  );
}
