// components/telegram/BotStatus.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BotStatusProps {
  botInfo: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
  } | null;
}

export function BotStatus({ botInfo }: BotStatusProps) {
  if (!botInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Загрузка информации о боте...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Информация о боте</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Имя:</Text>
        <Text style={styles.value}>{botInfo.first_name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>@{botInfo.username}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{botInfo.id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Статус:</Text>
        <View style={styles.statusDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#33D69D',
  },
});