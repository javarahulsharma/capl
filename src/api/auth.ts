import { apiClient } from './apiClient';
import { LoginRequest, LoginResponse, ProfileResponse } from './types';

export const authApi = {
  login: (data: LoginRequest) => {
    return apiClient<LoginResponse>('/auth/login', {
      body: data,
    });
  },
  getProfile: (token: string) => {
    return apiClient<ProfileResponse>('/auth/me', {
      token,
    });
  },
  logout: (token: string) => {
    return apiClient<{ message: string }>('/auth/logout', {
      method: 'POST',
      token,
    });
  },
  forgotPassword: (email: string) => {
    return apiClient<{ message: string }>('/auth/forgotPassword', {
      body: { email },
    });
  },
};
