import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, Zap, ZapOff } from 'lucide-react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { theme } from '../theme';
import { MainDrawerParamList } from '../navigation/types';
import { useAuth } from '../api/authContext';
import { markAttendance } from '../api/attendance';
import { Alert, ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

type NavigationProp = DrawerNavigationProp<MainDrawerParamList, 'QRScan'>;

export const QRScanScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const isFocused = useIsFocused();
  const isScanningRef = useRef(false);

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      isScanningRef.current = false;
    }
  }, [isFocused]);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading || isScanningRef.current) return;

    isScanningRef.current = true;
    setLoading(true);
    setScanned(true);

    const isValidPattern = /^(EMP|LAB)\d+$/.test(data);
    if (!isValidPattern) {
      Alert.alert(
        'Invalid QR Code',
        'Please scan a valid Employee or Lab QR code (e.g., EMP123 or LAB123).'
      );
      setScanned(false);
      isScanningRef.current = false;
      setLoading(false);
      return;
    }

    console.log('Scanned data:', data);

    try {
      const response = await markAttendance(data, token || undefined);

      navigation.navigate('EmployeeDetails', {
        employeeId: data,
        attendanceData: response
      });
    } catch (error: any) {
      console.error('Attendance Error:', error);
      Alert.alert(
        'Error',
        error?.message || 'An unexpected error occurred. Please try again.'
      );
      setScanned(false); // Allow re-scanning on failure
      isScanningRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={torch}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
      )}

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTorch(!torch)}
            style={styles.iconBtn}
          >
            {torch ? <ZapOff size={24} color="#fff" /> : <Zap size={24} color="#fff" />}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.scanWrapper}>
            <View style={styles.scanFrame} />
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Marking attendance...</Text>
              </View>
            )}
          </View>

          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>Scan QR Code to mark Attendance</Text>
            <Text style={styles.subInstructionText}>Position the QR code within the frame</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6b6b6b', // Muted brown/grey from Screenshot
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },
  permissionBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  iconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanWrapper: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    position: 'relative',
    backgroundColor: '#ffffff00', // White square from Screenshot
    borderRadius: 12,
  },
  scanFrame: {
    flex: 1,
    borderWidth: 0,
  },
  corner: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderColor: '#fff',
    borderWidth: 1.5,
  },
  topLeft: {
    top: -40,
    left: -40,
    borderTopLeftRadius: 60,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: -40,
    right: -40,
    borderTopRightRadius: 60,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: -40,
    left: -40,
    borderBottomLeftRadius: 60,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: -40,
    right: -40,
    borderBottomRightRadius: 60,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  instructionContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginTop: 80,
  },
  instructionText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 32,
  },
  subInstructionText: {
    display: 'none',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
