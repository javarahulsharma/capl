import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Home,
  User,
  LogOut,
  Plus,
  Users,
  Lock,
  Key,
  ChevronRight
} from 'lucide-react-native';
import { theme } from '../theme';
import { useAuth } from '../api/authContext';
import { authApi } from '../api/auth';
import { Logo } from '../components/Logo';

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { signOut, token } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              if (token) {
                await authApi.logout(token);
              }
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              signOut(); // Always sign out locally even if API fails
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo variant="header" style={styles.logo} />
        </View>
      </SafeAreaView>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('EmployeeList')}
        >
          <Users size={24} color="#fff" />
          <Text style={styles.drawerLabel}>Employee List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('ChangePassword')}
        >
          <Lock size={24} color="#fff" />
          <Text style={styles.drawerLabel}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Profile')}
        >
          <User size={24} color="#fff" />
          <Text style={styles.drawerLabel}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={handleLogout}
        >
          <LogOut size={24} color="#fff" />
          <Text style={styles.drawerLabel}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.drawerBackground,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 50,
  },
  scrollContent: {
    paddingTop: 0,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  drawerLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
