// lib/state/admin-store.ts
import { create } from 'zustand';
import { User } from '../types/agent';
import { HermesClient } from '../api/hermes-client';

interface SystemStats {
  totalUsers: number;
  totalAgents: number;
  totalWorkflows: number;
  activeWorkflows: number;
  uptime: string;
}

interface AdminState {
  users: User[];
  stats: SystemStats | null;
  isLoading: boolean;
  loadUsers: () => Promise<void>;
  loadStats: () => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
}

const API_URL = process.env.HERMES_API_URL || 'http://localhost:8080';
const API_KEY = process.env.HERMES_API_KEY || '';

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  stats: null,
  isLoading: false,

  loadUsers: async () => {
    set({ isLoading: true });
    try {
      const client = new HermesClient(API_URL, API_KEY);
      const users = await client.get('/admin/users');
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
    }
  },

  loadStats: async () => {
    set({ isLoading: true });
    try {
      const client = new HermesClient(API_URL, API_KEY);
      const stats = await client.get('/admin/stats');
      set({ stats, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
    }
  },

  updateUserRole: async (userId, role) => {
    const client = new HermesClient(API_URL, API_KEY);
    await client.patch(`/admin/users/${userId}`, { role });
    get().loadUsers();
  },
}));