// lib/state/agent-store.ts
import { create } from 'zustand';
import { Agent, Message } from '../types/agent';
import { HermesClient } from '../api/hermes-client';

interface AgentState {
  agents: Agent[];
  activeAgent: Agent | null;
  messages: Record<string, Message[]>; // agentId -> messages
  isLoading: boolean;
  error: string | null;

  // Actions
  loadAgents: () => Promise<void>;
  selectAgent: (agent: Agent | null) => void;
  loadMessages: (agentId: string) => Promise<void>;
  sendMessage: (agentId: string, content: string) => Promise<Message>;
  createAgent: (data: Partial<Agent>) => Promise<Agent>;
  updateAgent: (id: string, data: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
}

const API_URL = process.env.HERMES_API_URL || 'http://localhost:8080';
const API_KEY = process.env.HERMES_API_KEY || '';

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  activeAgent: null,
  messages: {},
  isLoading: false,
  error: null,

  loadAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const client = new HermesClient(API_URL, API_KEY);
      const agents = await client.listAgents();
      set({ agents, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectAgent: (agent) => {
    set({ activeAgent: agent });
    if (agent) {
      get().loadMessages(agent.id);
    }
  },

  loadMessages: async (agentId) => {
    const client = new HermesClient(API_URL, API_KEY);
    const messages = await client.getMessages(agentId);
    set((state) => ({
      messages: { ...state.messages, [agentId]: messages },
    }));
  },

  sendMessage: async (agentId, content) => {
    const client = new HermesClient(API_URL, API_KEY);
    const message = await client.sendMessage(agentId, content);
    set((state) => ({
      messages: {
        ...state.messages,
        [agentId]: [...(state.messages[agentId] || []), message],
      },
    }));
    return message;
  },

  createAgent: async (data) => {
    const client = new HermesClient(API_URL, API_KEY);
    const agent = await client.createAgent(data);
    set((state) => ({
      agents: [...state.agents, agent],
    }));
    return agent;
  },

  updateAgent: async (id, data) => {
    const client = new HermesClient(API_URL, API_KEY);
    const agent = await client.updateAgent(id, data);
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? agent : a)),
      activeAgent: state.activeAgent?.id === id ? agent : state.activeAgent,
    }));
  },

  deleteAgent: async (id) => {
    const client = new HermesClient(API_URL, API_KEY);
    await client.deleteAgent(id);
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
      activeAgent: state.activeAgent?.id === id ? null : state.activeAgent,
    }));
  },
}));