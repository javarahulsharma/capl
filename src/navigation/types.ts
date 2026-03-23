export type AuthStackParamList = {
  SignIn: undefined;
  ForgotPassword: { email?: string };
  OTP: { email: string; flow: 'forgot_password' | 'verify_email' };
  NewPassword: { email: string; code: string };
  Main: undefined; // To transition to the drawer
};

export type MainDrawerParamList = {
  Home: undefined;
  EmployeeDetails: { employeeId: string; attendanceData?: any };
  QRScan: undefined;
  Attendance: { scanData?: string; success?: boolean; attendanceData?: any };
  AddEmployee: undefined;
  EmployeeList: undefined;
  Success: { message: string };
  Profile: { userId?: number };
  ChangePassword: undefined;
  Logout: undefined;
};
