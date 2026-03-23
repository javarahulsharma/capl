import { apiClient } from './apiClient';

export interface UserPayload {
  name: string;
  email?: string;
  phoneNo: string;
  address: string;
  password?: string;
  photo?: string; // base64 or URL
  roleId?: number;
  type: string;
  status?: number;
  departmentId?: number;
  designationId?: number;
  aadhaarNo?: string;
}

export interface UserResponse {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phoneNo: string;
  address: string;
  photo: string | null;
  status: number;
  deleted: string;
  roleId: number;
  departmentId: number;
  designationId: number;
  type: string;
  aadharNo: string | null;
  createdAt: string;
  updatedAt: string;
  qrCode: string;
}

export const usersApi = {
  addUser: async (payload: UserPayload, token?: string): Promise<UserResponse> => {
    return apiClient<UserResponse>('/users', {
      method: 'POST',
      body: payload,
      token,
    });
  },
  getContractors: async (token?: string): Promise<UserResponse[]> => {
    return apiClient<UserResponse[]>('/users?type=contractor&status=1', {
      token,
    });
  },
  getUsers: async (token?: string): Promise<UserResponse[]> => {
    return apiClient<UserResponse[]>('/users?status=1', {
      token,
    });
  },
  getUserById: async (userId: number, token?: string): Promise<UserResponse> => {
    return apiClient<UserResponse>(`/users/${userId}`, {
      token,
    });
  },
};
