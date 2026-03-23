import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainDrawerParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { EmployeeDetailsScreen } from '../screens/EmployeeDetailsScreen';
import { QRScanScreen } from '../screens/QRScanScreen';
import { AttendanceScreen } from '../screens/AttendanceScreen';
import { AddEmployeeScreen } from '../screens/AddEmployeeScreen';
import { SuccessScreen } from '../screens/SuccessScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { EmployeeListScreen } from '../screens/EmployeeListScreen';
import { CustomDrawerContent } from './CustomDrawerContent';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export const MainNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '70%',
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="EmployeeDetails" component={EmployeeDetailsScreen} />
      <Drawer.Screen name="QRScan" component={QRScanScreen} />
      <Drawer.Screen name="Attendance" component={AttendanceScreen} />
      <Drawer.Screen name="AddEmployee" component={AddEmployeeScreen} />
      <Drawer.Screen name="EmployeeList" component={EmployeeListScreen} />
      <Drawer.Screen name="Success" component={SuccessScreen} />
      {/* Skeletons for other screens */}
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="ChangePassword" component={HomeScreen} />
    </Drawer.Navigator>
  );
};
