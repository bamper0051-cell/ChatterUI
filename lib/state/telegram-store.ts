// lib/state/telegram-store.ts
import { create } from 'zustand';
import { TelegramClient } from '../api/telegram-client';

interface TelegramState {
  botInfo: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
  } | null;
  webhookInfo: any;
  commands: { command: string; description: string }[];
  isLoading: boolean;

  loadBotInfo: () => Promise<void>;
  updateWebhook: (url: string, secretToken?: string) => Promise<void>;
  setCommands: (commands: { command: string; description: string }[]) => Promise<void>;
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

export const useTelegramStore = create<TelegramState>((set, get) => ({
  botInfo: null,
  webhookInfo: null,
  commands: [],
  isLoading: false,

  loadBotInfo: async () => {
    set({ isLoading: true });
    try {
      const client = new TelegramClient(BOT_TOKEN);
      const botInfo = await client.getBotInfo();
      const webhookInfo = await client.getWebhookInfo();
      set({ botInfo, webhookInfo, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
    }
  },

  updateWebhook: async (url, secretToken) => {
    const client = new TelegramClient(BOT_TOKEN);
    await client.setWebhook(url, secretToken);
    const webhookInfo = await client.getWebhookInfo();
    set({ webhookInfo });
  },

  setCommands: async (commands) => {
    const client = new TelegramClient(BOT_TOKEN);
    await client.setMyCommands(commands);
    set({ commands });
  },
}));