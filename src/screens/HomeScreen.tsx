import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { Bell, Menu, QrCode, UserPlus, ArrowRight } from 'lucide-react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../theme';
import { MainDrawerParamList } from '../navigation/types';

import { Logo } from '../components/Logo';

type NavigationProp = DrawerNavigationProp<MainDrawerParamList, 'Home'>;

import { authApi } from '../api/auth';
import { useAuth } from '../api/authContext';
import { SvgQR } from '../components/SvgQR';
import { SvgAddEmp } from '../components/SvgAddEmp';

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { token, user, updateUser } = useAuth();

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await authApi.getProfile(token);
          updateUser(response.user);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Menu size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <Logo variant="header" />

        <TouchableOpacity style={styles.notificationBtn}>
          <Bell size={24} color={theme.colors.text} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.heading}>Welcome, {user?.name || 'User'}</Text>
          <Text style={styles.description}>
            Attendance and add Employee
          </Text>
        </View>

        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={[styles.card, styles.cardAdd]}
            onPress={() => navigation.navigate('QRScan')}
          >
            <View style={styles.iconWrapper}>
              <SvgQR size={40} color={theme.colors.text} />
            </View>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Mark Attendance</Text>
          </TouchableOpacity>

          {user?.role?.name === 'Admin' && (
            <TouchableOpacity
              style={[styles.card, styles.cardAdd]}
              onPress={() => navigation.navigate('AddEmployee')}
            >
              <View style={styles.iconWrapper}>
                <SvgAddEmp size={40} color={theme.colors.textMuted} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.colors.textMuted }]}>Add Employee</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  notificationBtn: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b', // Yellow/Orange dot
    borderWidth: 1,
    borderColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
  },
  welcomeSection: {
    marginBottom: theme.spacing.xxl,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    flex: 1,
    height: 160,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMark: {
    backgroundColor: '#c3cfe2', // Light blue-gray from Screenshot
  },
  cardAdd: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconWrapper: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
