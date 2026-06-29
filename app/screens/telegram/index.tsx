// app/(main)/telegram/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTelegramStore } from '../../../lib/state/telegram-store';
import { BotStatus } from '../../../components/telegram/BotStatus';
import { BotCommands } from '../../../components/telegram/BotCommands';
import { BotWebhooks } from '../../../components/telegram/BotWebhooks';

export default function TelegramScreen() {
  const { botInfo, webhookInfo, loadBotInfo, updateWebhook, isLoading } = useTelegramStore();
  const [webhookUrl, setWebhookUrl] = useState('https://your-domain.com/api/webhooks/telegram');
  const [secretToken, setSecretToken] = useState('');

  useEffect(() => {
    loadBotInfo();
  }, []);

  const handleSetWebhook = async () => {
    try {
      await updateWebhook(webhookUrl, secretToken);
      Alert.alert('Успех', 'Webhook установлен');
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <>
          <BotStatus botInfo={botInfo} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Настройка Webhook</Text>

            <Text style={styles.label}>Webhook URL</Text>
            <TextInput
              style={styles.input}
              value={webhookUrl}
              onChangeText={setWebhookUrl}
              placeholder="https://your-app.com/api/webhooks/telegram"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Secret Token (опционально)</Text>
            <TextInput
              style={styles.input}
              value={secretToken}
              onChangeText={setSecretToken}
              placeholder="Секретный токен для верификации"
            />

            <Button title="Установить Webhook" onPress={handleSetWebhook} />
          </View>

          <BotCommands />
          <BotWebhooks />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
});