import { apiClient } from './apiClient';
import { Designation } from './types';

export const designationsApi = {
  getDesignations: (token?: string) => 
    apiClient<Designation[]>('/designations', { token }),
};
