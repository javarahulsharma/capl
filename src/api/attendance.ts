import { apiClient } from './apiClient';

export interface AttendanceResponse {
  message: string;
  user: {
    id: number;
    employeeId: string;
    name: string;
    email: string;
    phoneNo: string;
    photo: string | null;
    roleId: number;
    departmentId: number | null;
    role: {
      id: number;
      name: string;
    };
    department: any;
  };
  checkIn: string | null;
  checkOut: string | null;
  success?: boolean; // Keep for compatibility if used elsewhere
}

export const markAttendance = async (employeeId: string, token?: string): Promise<AttendanceResponse> => {
  return apiClient<AttendanceResponse>('/attendance/mark', {
    method: 'POST',
    body: { employeeId },
    token,
  });
};
