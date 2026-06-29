// lib/state/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/agent';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true });
          } else {
            get().logout();
          }
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: async (name) => {
          // Используем AsyncStorage в React Native
          const { getItem } = require('@react-native-async-storage/async-storage').default;
          const value = await getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          const { setItem } = require('@react-native-async-storage/async-storage').default;
          return setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          const { removeItem } = require('@react-native-async-storage/async-storage').default;
          return removeItem(name);
        },
      },
    }
  )
);