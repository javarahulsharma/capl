import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Check } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { MainDrawerParamList } from '../navigation/types';

type SuccessRouteProp = RouteProp<MainDrawerParamList, 'Success'>;
type NavigationProp = DrawerNavigationProp<MainDrawerParamList, 'Success'>;

export const SuccessScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SuccessRouteProp>();
  const { message } = route.params;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.checkmarkWrapper}>
             <View style={styles.checkmarkCircle}>
                <Check size={60} color="#fff" />
             </View>
             {/* Decorative confetti elements could go here as absolute positioned views */}
          </View>

          <Text style={styles.title}>Successfully!</Text>
          <Text style={styles.subtitle}>{message}</Text>
        </View>

        <View style={styles.footer}>
          <Button 
            title="Ok" 
            onPress={() => navigation.navigate('Home')}
            style={styles.okBtn}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  checkmarkWrapper: {
    marginBottom: 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#274494',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#274494',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  footer: {
    marginBottom: 40,
  },
  okBtn: {
    width: '100%',
  },
});
