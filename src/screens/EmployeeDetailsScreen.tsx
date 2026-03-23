import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Platform, ActivityIndicator } from 'react-native';
import { ArrowLeft, Clock, MapPin, Briefcase, User } from 'lucide-react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { ScreenContainer } from '../components/ScreenContainer';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { MainDrawerParamList } from '../navigation/types';
import { SvgDayIn } from '../components/SvgDayIn';
import { SvgDayOut } from '../components/SvgDayOut';

type NavigationProp = DrawerNavigationProp<MainDrawerParamList, 'EmployeeDetails'>;
type ScreenRouteProp = RouteProp<MainDrawerParamList, 'EmployeeDetails'>;

export const EmployeeDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { attendanceData } = route.params;
  const user = attendanceData?.user;
  const isLoading = false;

  const getPhotoUrl = (photoPath: string | null) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    const cleanPath = photoPath.startsWith('/') ? photoPath.substring(1) : photoPath;
    return `https://erp.caplindia.co.in/${cleanPath}`;
  };

  const photoUrl = getPhotoUrl(user?.photo);

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return '--:--';
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return dateString; // Return original if not a valid date string
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return '--:--';
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading && !user ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarFrame}>
                {photoUrl ? (
                  <Image source={{ uri: photoUrl }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.placeholderAvatar]}>
                    <Text style={styles.placeholderText}>
                      {user?.name?.charAt(0) || 'U'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Employee Code</Text>
                <Text style={styles.infoValue}>{user?.employeeId || '---'}</Text>
              </View>

              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Employee Name</Text>
                <Text style={styles.infoValue}>{user?.name || '---'}</Text>
              </View>

              <View style={styles.infoGroup}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{user?.department?.name || '---'}</Text>
              </View>
            </View>

            <View style={styles.gridContainer}>
              <View style={styles.row}>
                <View style={styles.infoCard}>
                  <View style={styles.cardHeader}>
                    <SvgDayIn />
                    <Text style={styles.cardLabel}>Day In</Text>
                  </View>
                  <Text style={styles.cardValue}>{formatTime(attendanceData?.checkIn)}</Text>
                </View>
                <View style={styles.infoCard}>
                  <View style={styles.cardHeader}>
                    <SvgDayOut />
                    <Text style={styles.cardLabel}>Day Out</Text>
                  </View>
                  <Text style={styles.cardValue}>{formatTime(attendanceData?.checkOut)}</Text>
                </View>
              </View>



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
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
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
  backToScanText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});
