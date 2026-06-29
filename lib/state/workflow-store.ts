// lib/state/workflow-store.ts
import { create } from 'zustand';
import { Workflow, WorkflowNode } from '../types/agent';
import { N8nClient } from '../api/n8n-client';

interface WorkflowState {
  workflows: Workflow[];
  activeWorkflow: Workflow | null;
  nodes: WorkflowNode[];
  connections: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadWorkflows: () => Promise<void>;
  selectWorkflow: (workflow: Workflow | null) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  removeNode: (nodeId: string) => void;
  addConnection: (sourceId: string, targetId: string) => void;
  removeConnection: (sourceId: string, targetId: string) => void;
  onNodeSelect?: (node: WorkflowNode) => void;
  saveWorkflow: () => Promise<void>;
  executeWorkflow: (workflowId: string, input?: any) => Promise<string>;
}

const N8N_URL = process.env.N8N_WEBHOOK_URL?.replace('/api/v1', '') || 'https://n8n.blackbugs.ai';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  activeWorkflow: null,
  nodes: [],
  connections: {},
  isLoading: false,
  error: null,

  loadWorkflows: async () => {
    set({ isLoading: true, error: null });
    try {
      const client = new N8nClient(N8N_URL, N8N_API_KEY);
      const workflows = await client.listWorkflows();
      set({ workflows, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  selectWorkflow: (workflow) => {
    set({ activeWorkflow: workflow });
    // TODO: Load nodes from workflow data
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNode: (nodeId, updates) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
    }));
  },

  removeNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
    }));
  },

  addConnection: (sourceId, targetId) => {
    set((state) => ({
      connections: {
        ...state.connections,
        [sourceId]: [...(state.connections[sourceId] || []), targetId],
      },
    }));
  },

  removeConnection: (sourceId, targetId) => {
    set((state) => ({
      connections: {
        ...state.connections,
        [sourceId]: (state.connections[sourceId] || []).filter(id => id !== targetId),
      },
    }));
  },

  onNodeSelect: undefined,

  saveWorkflow: async () => {
    const { activeWorkflow, nodes } = get();
    if (!activeWorkflow) return;

    const client = new N8nClient(N8N_URL, N8N_API_KEY);
    await client.updateWorkflow(activeWorkflow.id, {
      ...activeWorkflow,
      // TODO: Serialize nodes to workflow format
    });
  },

  executeWorkflow: async (workflowId, input) => {
    const client = new N8nClient(N8N_URL, N8N_API_KEY);
    const result = await client.executeWorkflow(workflowId, input);
    return result.executionId;
  },
}));