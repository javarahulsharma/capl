import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { Menu, Bell, MapPin, Clock, ArrowLeft } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useNavigation, useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { ScreenContainer } from '../components/ScreenContainer';
import { theme } from '../theme';
import { MainDrawerParamList } from '../navigation/types';
import { HandTapIcon } from '../components/HandTapIcon';
import { Logo } from '../components/Logo';
import { QrCode, LogIn, LogOut } from 'lucide-react-native';
import { SvgDayIn } from '../components/SvgDayIn';
import { SvgDayOut } from '../components/SvgDayOut';
import { SvgHand } from '../components/SvgHand';

type NavigationProp = DrawerNavigationProp<MainDrawerParamList, 'Attendance'>;

export const AttendanceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<MainDrawerParamList, 'Attendance'>>();
  const isFocused = useIsFocused();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('--:--');
  const [checkOutTime, setCheckOutTime] = useState('--:--');
  const [location, setLocation] = useState('Fetching location...');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lastUser, setLastUser] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocation('Permission denied');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        let reverse = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (reverse.length > 0) {
          const item = reverse[0];
          const city = item.city || item.district || '';
          const region = item.region || '';
          setLocation(`${city}${city && region ? ', ' : ''}${region}` || 'Location found');
        } else {
          setLocation('Unknown location');
        }
      } catch (error) {
        console.error('Location error:', error);
        setLocation('Error fetching location');
      }
    })();
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && route.params?.success && route.params?.attendanceData) {
      const data = route.params.attendanceData;

      const formatTime = (isoString: string | null) => {
        if (!isoString) return '--:--';
        return new Date(isoString).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      };

      if (data.checkIn) {
        setCheckInTime(formatTime(data.checkIn));
        setIsCheckedIn(true);
      }

      if (data.checkOut) {
        setCheckOutTime(formatTime(data.checkOut));
        setIsCheckedIn(false); // If checkOut is present, they just checked out
      }

      if (data.user?.name) {
        setLastUser(data.user.name);
      }

      if (data.message) {
        setLastMessage(data.message);
        // We can still show the alert for immediate feedback, or rely on the UI
        // Alert.alert('Success', data.message);
      }

      // Clear the params so it doesn't process again on re-focus
      navigation.setParams({ success: undefined, attendanceData: undefined });
    }
  }, [isFocused, route.params?.success, route.params?.attendanceData, navigation]);

  const handleScanPress = () => {
    navigation.navigate('QRScan');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Menu size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Logo variant="header" />
        <TouchableOpacity>
          <Bell size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.dateTimeSection}>
          <Text style={styles.timeText}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </Text>
          <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.circularButton,
              { backgroundColor: isCheckedIn ? '#ff6b6b' : '#2ecc71' } // Red for Day Out, Green for Day In
            ]}
            onPress={handleScanPress}
          >
            <SvgHand />
            <Text style={styles.buttonLabel}>{isCheckedIn ? 'Day Out' : 'Day In'}</Text>
          </TouchableOpacity>
        </View>

        {/* {lastUser && (
          <View style={styles.lastActivitySection}>
            <Text style={styles.lastUserText}>{lastUser}</Text>
            {lastMessage && <Text style={styles.lastMessageText}>{lastMessage}</Text>}
          </View>
        )} */}

        <View style={styles.locationBadge}>
          <MapPin size={24} color={theme.colors.textMuted} />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.row}>
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <SvgDayIn />
                <Text style={styles.cardLabel}>Day In</Text>
              </View>
              <Text style={styles.cardValue}>{checkInTime}</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <SvgDayOut />
                <Text style={styles.cardLabel}>Day Out</Text>
              </View>
              <Text style={styles.cardValue}>{checkOutTime}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.infoCard, styles.actionCard]}
              onPress={handleScanPress}
            >
              <LogIn size={28} color="#657084" />
              <Text style={styles.actionLabel}>Check In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.infoCard, styles.actionCard]}
              onPress={handleScanPress}
            >
              <LogOut size={28} color="#657084" />
              <Text style={styles.actionLabel}>Check Out</Text>
            </TouchableOpacity>
          </View>
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
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  dateTimeSection: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  timeText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#000',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#94a3b8',
    marginTop: 4,
  },
  actionContainer: {
    marginVertical: 30,
  },
  circularButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  locationText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '400',
    marginLeft: 8,
  },
  gridContainer: {
    width: '100%',
    gap: 16,
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
    fontWeight: '400',
    color: '#94a3b8',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#657084',
    marginTop: 8,
  },
  actionCard: {
    backgroundColor: '#EDF0F8', // Very light orange/yellow background
    borderColor: '#B5BCC5',
  },
  lastActivitySection: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  lastUserText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  lastMessageText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
});
