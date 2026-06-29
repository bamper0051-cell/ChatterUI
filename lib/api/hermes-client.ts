// lib/api/hermes-client.ts
import { ApiClient } from '../utils/api-client';
import { Agent, Message, Workflow, WorkflowNode } from '../types/agent';

export class HermesClient extends ApiClient {
  constructor(baseURL: string, apiKey: string) {
    super(baseURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Агенты
  async listAgents(): Promise<Agent[]> {
    return this.get<Agent[]>('/api/agents');
  }

  async getAgent(id: string): Promise<Agent> {
    return this.get<Agent>(`/api/agents/${id}`);
  }

  async createAgent(data: Partial<Agent>): Promise<Agent> {
    return this.post<Agent>('/api/agents', data);
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
    return this.patch<Agent>(`/api/agents/${id}`, data);
  }

  async deleteAgent(id: string): Promise<void> {
    return this.delete(`/api/agents/${id}`);
  }

  // Сообщения
  async sendMessage(agentId: string, content: string): Promise<Message> {
    return this.post<Message>(`/api/agents/${agentId}/messages`, { content });
  }

  async getMessages(
    agentId: string,
    params?: { limit?: number; before?: string }
  ): Promise<Message[]> {
    return this.get<Message[]>(`/api/agents/${agentId}/messages`, { params });
  }

  // Workflow
  async listWorkflows(): Promise<Workflow[]> {
    return this.get<Workflow[]>('/api/workflows');
  }

  async getWorkflow(id: string): Promise<Workflow> {
    return this.get<Workflow>(`/api/workflows/${id}`);
  }

  async createWorkflow(data: Partial<Workflow>): Promise<Workflow> {
    return this.post<Workflow>('/api/workflows', data);
  }

  // Выполнение workflow
  async executeWorkflow(workflowId: string, input?: any): Promise<{ executionId: string }> {
    return this.post<{ executionId: string }>(`/api/workflows/${workflowId}/execute`, { input });
  }

  async getExecution(executionId: string): Promise<any> {
    return this.get(`/api/executions/${executionId}`);
  }
}