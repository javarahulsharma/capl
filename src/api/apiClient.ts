import { BASE_URL } from './config';
import { triggerGlobalSignOut } from './authContext';

export async function apiClient<T>(
  endpoint: string,
  { body, token, ...customConfig }: Omit<RequestInit, 'body'> & { body?: any; token?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...(customConfig.headers as Record<string, string>),
    },
  };

  if (body) {
    if (body instanceof FormData) {
        delete (config.headers as Record<string, string>)['Content-Type'];
        config.body = body;
    } else {
        config.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (response.status === 401) {
        triggerGlobalSignOut();
        return Promise.reject(data); // data might contain the error message
    }

    if (response.ok) {
        return data;
    }

    return Promise.reject(data);
  } catch (error) {
    return Promise.reject(error);
  }
}
