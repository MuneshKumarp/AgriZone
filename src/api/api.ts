import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';
import { HARDCODED_API_BASE } from '../config/env';

function getDevHost(): string | null {
  try {
    // @ts-ignore RN provides this in dev
    const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
    if (!scriptURL) return null;
    const match = scriptURL.match(/^(https?:)\/\/([\d.]+|localhost)(?::\d+)?\//);
    if (!match) return null;
    return match[2] || null; // host part
  } catch {
    return null;
  }
}

function resolveBaseURL(): string {
  // 1) If a hardcoded base is provided, prefer it. This makes the setup stable across re-installs.
  if (HARDCODED_API_BASE) {
    return HARDCODED_API_BASE;
  }
  const host = getDevHost();
  if (host && host !== 'localhost') {
    // Use Metro host IP (your PC IP) with backend port 3000
    return `http://${host}:3000/api`;
  }
  // On Android physical devices or when Metro host is unavailable, use LAN IP
  if (Platform.OS === 'android') {
    return 'http://192.168.18.34:3000/api';
  }
  // iOS simulator or fallback
  return 'http://localhost:3000/api';
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('agrizone_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


