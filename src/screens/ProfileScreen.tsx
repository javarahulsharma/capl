import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Platform, ActivityIndicator } from 'react-native';
import { Menu, Bell, LogIn, LogOut, ChevronRight } from 'lucide-react-native';
import { useNavigation, useIsFocused, useRoute, RouteProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../theme';
import { MainDrawerParamList } from '../navigation/types';
import { Logo } from '../components/Logo';
import { SvgDayIn } from '../components/SvgDayIn';
import { SvgDayOut } from '../components/SvgDayOut';
import { useAuth } from '../api/authContext';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';
import { UserProfile } from '../api/types';
import { UserResponse } from '../api/users';

type NavigationProp = DrawerNavigationProp<MainDrawerParamList, 'Profile'>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<MainDrawerParamList, 'Profile'>>();
  const { userId } = route.params || {};
  const isFocused = useIsFocused();
  const { token, user: currentUser, updateUser } = useAuth();
  const [displayedUser, setDisplayedUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (token && isFocused) {
        setIsLoading(true);
        try {
          if (userId) {
            const data = await usersApi.getUserById(userId, token);
            setDisplayedUser(data);
          } else {
            const response = await authApi.getProfile(token);
            setDisplayedUser(response.user);
            updateUser(response.user);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [isFocused, token, userId]);

  const handleScanPress = () => {
    navigation.navigate('QRScan');
  };

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading && !displayedUser ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarFrame}>
                {displayedUser?.photo ? (
                  <Image source={{ uri: displayedUser.photo }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.placeholderAvatar]}>
                    <Text style={styles.placeholderText}>
                      {displayedUser?.name?.charAt(0) || 'U'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Employee Code</Text>
                <Text style={styles.infoValue}>{displayedUser?.employeeId || '---'}</Text>
              </View>

              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Employee Name</Text>
                <Text style={styles.infoValue}>{displayedUser?.name || '---'}</Text>
              </View>

              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{displayedUser?.department?.name || '---'}</Text>
              </View>
            </View>

            <View style={styles.gridContainer}>
              <View style={styles.row}>
                <View style={styles.infoCard}>
                  <View style={styles.cardHeader}>
                    <SvgDayIn />
                    <Text style={styles.cardLabel}>Day In</Text>
                  </View>
                  <Text style={styles.cardValue}>10:10 AM</Text>
                </View>
                <View style={styles.infoCard}>
                  <View style={styles.cardHeader}>
                    <SvgDayOut />
                    <Text style={styles.cardLabel}>Day Out</Text>
                  </View>
                  <Text style={styles.cardValue}>--:--</Text>
                </View>
              </View>

              {/* <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => {
                  if (displayedUser?.employeeId) {
                    navigation.navigate('EmployeeDetails', { employeeId: displayedUser.employeeId });
                  }
                }}
              >
                <Text style={styles.detailsButtonText}>View Detailed Profile</Text>
                <ChevronRight size={20} color={theme.colors.primary} />
              </TouchableOpacity> */}
            </View>
          </>
        )}
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
    backgroundColor: '#f59e0b',
    borderWidth: 1,
    borderColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  avatarFrame: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  placeholderAvatar: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 60,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  infoSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  infoGroup: {
    alignItems: 'center',
    marginBottom: 25,
  },
  infoLabel: {
    fontSize: 16,
    color: '#3B4352',
    fontWeight: '400',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 22,
    color: '#181818',
    fontWeight: '500',
    textAlign: 'center',
  },
  gridContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  infoCard: {
    flex: 1,
    height: 100,
    backgroundColor: '#FAFBFD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  actionCard: {
    backgroundColor: '#EDF0F8',
    borderColor: '#B5BCC5',
  },
  actionLabel: {
    fontSize: 16,
    color: '#657084',
    marginTop: 8,
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#274494',
    fontWeight: '500',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: 12,
    marginTop: 20,
    gap: 8,
  },
  detailsButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
