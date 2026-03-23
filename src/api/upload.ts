import { apiClient } from './apiClient';
import { UploadPhotoResponse } from './types';

export const uploadApi = {
  uploadPhoto: (formData: FormData, token?: string) => 
    apiClient<UploadPhotoResponse>('/upload/photo', {
      method: 'POST',
      body: formData,
      token,
    }),
};
