import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from './types';

let globalSignOut: (() => void) | null = null;

export const triggerGlobalSignOut = () => {
  if (globalSignOut) {
    globalSignOut();
  }
};

interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (token: string, user: UserProfile) => void;
  signOut: () => void;
  updateUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial data from storage
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedUser = await AsyncStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load storage data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const signIn = async (newToken: string, newUser: UserProfile) => {
    if (!newToken || !newUser) return;
    try {
      await AsyncStorage.setItem('auth_token', newToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Failed to remove from storage:', e);
    }
  };

  useEffect(() => {
    globalSignOut = signOut;
  }, []);

  const updateUser = async (newUser: UserProfile) => {
    if (!newUser) return;
    try {
      await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (e) {
      console.error('Failed to update user in storage:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
