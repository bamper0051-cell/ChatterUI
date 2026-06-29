// lib/db/schema/agents.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const agents = sqliteTable('agents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  systemPrompt: text('system_prompt'),
  model: text('model').default('gpt-4'),
  temperature: real('temperature').default(0.7),
  maxTokens: integer('max_tokens').default(2000),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  avatar: text('avatar'),
  tools: text('tools', { mode: 'json' }).$type<string[]>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  agentId: text('agent_id')
    .notNull()
    .references(() => agents.id),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  content: text('content').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  metadata: text('metadata', { mode: 'json' }),
});

export type Agent = typeof agents.$inferSelect;
export type Message = typeof messages.$inferSelect;