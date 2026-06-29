// lib/api/telegram-client.ts
import { ApiClient } from '../utils/api-client';
import { BotCommand, TelegramWebhookInfo } from '../types/agent';

export class TelegramClient extends ApiClient {
  private botToken: string;

  constructor(botToken: string) {
    super(`https://api.telegram.org/bot${botToken}`);
    this.botToken = botToken;
  }

  async getBotInfo(): Promise<{
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
  }> {
    return this.get('/getMe');
  }

  async setWebhook(
    url: string,
    secretToken?: string
  ): Promise<{ ok: boolean; result: boolean; description: string }> {
    return this.post('/setWebhook', {
      url,
      secret_token: secretToken,
    });
  }

  async getWebhookInfo(): Promise<TelegramWebhookInfo> {
    const result = await this.get<{ ok: boolean; result: TelegramWebhookInfo }>('/getWebhookInfo');
    return result.result;
  }

  async sendMessage(
    chatId: string | number,
    text: string,
    options?: {
      parse_mode?: 'HTML' | 'MarkdownV2';
      reply_markup?: any;
    }
  ): Promise<any> {
    return this.post('/sendMessage', {
      chat_id: chatId,
      text,
      ...options,
    });
  }

  async setMyCommands(commands: BotCommand[]): Promise<{ ok: boolean }> {
    return this.post('/setMyCommands', { commands });
  }

  async getUpdates(
    offset?: number,
    timeout: number = 30
  ): Promise<{ ok: boolean; result: any[] }> {
    return this.get('/getUpdates', { params: { offset, timeout } });
  }

  async deleteWebhook(): Promise<{ ok: boolean }> {
    return this.post('/deleteWebhook', {});
  }
}