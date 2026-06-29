// lib/types/agent.ts
export interface Agent {
  id: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  avatar?: string;
  tools: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  agentId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, string>;
}

export interface BotCommand {
  command: string;
  description: string;
}

export interface TelegramWebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections: number;
  allowed_updates?: string[];
}