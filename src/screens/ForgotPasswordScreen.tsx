import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail } from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AuthStackParamList } from '../navigation/types';
import { Logo } from '../components/Logo';
import { authApi } from '../api/auth';
import { Alert } from 'react-native';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email or Username is required'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type NavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
type ForgotPasswordRouteProp = RouteProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ForgotPasswordRouteProp>();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: route.params?.email || '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      console.log('Sending reset instructions to:', data.email);
      const response = await authApi.forgotPassword(data.email);
      console.log('Forgot password response:', response);

      Alert.alert('Success', response.message || 'Verification code sent to your email.');
      navigation.navigate('SignIn');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', error?.message || 'Failed to send reset instructions. Please try again.');
    }
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Please enter your Email or your user name, then we will send your verification code to reset password
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email or Username"
                  placeholder="Enter your Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.email?.message}
                  autoCapitalize="none"
                  rightIcon={<Mail size={20} color="#94a3b8" />}
                />
              )}
            />

            <Button
              title="Send"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              style={styles.submitBtn}
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
    marginBottom: 40,
    lineHeight: 26,
  },
  submitBtn: {
    marginTop: 20,
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
