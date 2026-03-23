import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { AuthStackParamList } from '../navigation/types';
import { Logo } from '../components/Logo';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'OTP'>;
type OTPRouteProp = RouteProp<AuthStackParamList, 'OTP'>;

export const OTPScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OTPRouteProp>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const onSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 4) return;
    
    setLoading(true);
    // Mock verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    navigation.navigate('NewPassword', { email: route.params.email, code: otpValue });
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Logo variant="auth" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>Check your Email and enter OTP code, please?</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View key={index} style={styles.otpBox}>
                  <TextInput
                    ref={inputRefs[index]}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    placeholder={(index === 0 ? '0' : index === 1 ? '2' : index === 2 ? '5' : '8')}
                    placeholderTextColor="#1e293b"
                  />
                </View>
              ))}
            </View>

            <Button
              title="Submit"
              onPress={onSubmit}
              loading={loading}
              style={styles.submitBtn}
              disabled={otp.join('').length < 4}
            />

            <TouchableOpacity 
              onPress={() => navigation.navigate('SignIn')}
              style={styles.backBtn}
            >
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 50,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  otpBox: {
    width: (Platform.OS === 'ios' ? 70 : 65),
    height: 70,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    width: '100%',
  },
  submitBtn: {
    marginTop: 10,
  },
  backBtn: {
    alignItems: 'center',
    marginTop: 40,
  },
  backText: {
    color: '#274494',
    fontSize: 18,
    fontWeight: '500',
  },
});
