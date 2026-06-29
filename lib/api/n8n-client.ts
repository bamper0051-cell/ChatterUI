// lib/api/n8n-client.ts
import { ApiClient } from '../utils/api-client';
import { Workflow, WorkflowNode } from '../types/agent';

export class N8nClient extends ApiClient {
  constructor(baseURL: string, apiKey?: string) {
    super(`${baseURL}/api/v1`, {
      headers: {
        ...(apiKey && { 'X-N8N-API-KEY': apiKey }),
      },
    });
  }

  // Workflow
  async listWorkflows(): Promise<Workflow[]> {
    return this.get<Workflow[]>('/workflows');
  }

  async getWorkflow(id: string): Promise<Workflow> {
    return this.get<Workflow>(`/workflows/${id}`);
  }

  async createWorkflow(data: {
    name: string;
    nodes: WorkflowNode[];
    connections: Record<string, any>;
  }): Promise<Workflow> {
    return this.post<Workflow>('/workflows', data);
  }

  async updateWorkflow(id: string, data: Partial<Workflow>): Promise<Workflow> {
    return this.patch<Workflow>(`/workflows/${id}`, data);
  }

  async deleteWorkflow(id: string): Promise<void> {
    return this.delete(`/workflows/${id}`);
  }

  // Выполнение
  async executeWorkflow(workflowId: string, input?: any): Promise<{ executionId: string }> {
    return this.post<{ executionId: string }>(`/workflows/${workflowId}/execute`, { input });
  }

  async getExecutions(): Promise<any[]> {
    return this.get<any[]>('/executions');
  }

  // Credentials
  async listCredentials(): Promise<any[]> {
    return this.get<any[]>('/credentials');
  }

  async createCredential(data: {
    name: string;
    type: string;
    data: Record<string, any>;
  }): Promise<any> {
    return this.post('/credentials', data);
  }
}