import { apiClient } from './apiClient';
import { Department } from './types';

export const departmentsApi = {
  getDepartments: (token?: string) => 
    apiClient<Department[]>('/departments', { token }),
};
