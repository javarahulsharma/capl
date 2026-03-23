import { apiClient } from './apiClient';
import { Role } from './types';

export const rolesApi = {
  getRoles: (token?: string) => 
    apiClient<Role[]>('/roles', { token }),
};
