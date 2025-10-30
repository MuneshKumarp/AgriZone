import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import type { AuthState, LoginPayload, SignupPayload, AuthUser, UserType } from '../types';

type AuthContextValue = AuthState & {
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  isLoading: true,
  isAuthenticated: false,
  token: null,
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

const TOKEN_KEY = 'agrizone_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    token: null,
    user: null,
  });

  const login = useCallback(async ({ email, password, userType }: LoginPayload) => {
    try {
      const response = await api.post('/auth/signin', {
        email,
        password,
        userType,
      });
      
      const { token, user } = response.data;
      await AsyncStorage.setItem(TOKEN_KEY, token);
      setState({ isLoading: false, isAuthenticated: true, token, user });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }, []);

  const signup = useCallback(async ({ firstName, middleName, lastName, fatherName, phoneNumber, email, password, dateOfBirth, cnic, userType }: SignupPayload) => {
    try {
      const response = await api.post('/auth/signup', {
        firstName,
        middleName,
        lastName,
        fatherName,
        phoneNumber,
        email,
        password,
        dateOfBirth,
        cnic,
        userType,
      });
      
      const { token, user } = response.data;
      await AsyncStorage.setItem(TOKEN_KEY, token);
      setState({ isLoading: false, isAuthenticated: true, token, user });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      throw new Error(errorMessage);
    }
  }, []);

  const restore = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        setState({
          isLoading: false,
          isAuthenticated: true,
          token,
          user: state.user, // keep previous until refreshed from API if needed
        });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    restore();
  }, [restore]);


  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setState({ isLoading: false, isAuthenticated: false, token: null, user: null });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    login,
    signup,
    logout,
  }), [state, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


