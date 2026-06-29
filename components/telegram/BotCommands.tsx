// components/telegram/BotCommands.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTelegramStore } from '../../lib/state/telegram-store';

export function BotCommands() {
  const { commands } = useTelegramStore();
  const [newCommand, setNewCommand] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddCommand = () => {
    if (!newCommand || !newDesc) return;
    // TODO: Implement add command logic
    setNewCommand('');
    setNewDesc('');
  };

  const renderCommand = ({ item }: { item: { command: string; description: string } }) => (
    <View style={styles.commandItem}>
      <Text style={styles.commandName}>/{item.command}</Text>
      <Text style={styles.commandDesc}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Команды бота</Text>

      <View style={styles.addForm}>
        <TextInput
          style={styles.input}
          placeholder="Команда (без /)"
          value={newCommand}
          onChangeText={setNewCommand}
        />
        <TextInput
          style={styles.input}
          placeholder="Описание"
          value={newDesc}
          onChangeText={setNewDesc}
        />
        <Button title="Добавить команду" onPress={handleAddCommand} />
      </View>

      <FlatList
        data={commands}
        keyExtractor={(item) => item.command}
        renderItem={renderCommand}
        style={styles.list}
      />
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
    marginBottom: 16,
  },
  addForm: {
    gap: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  list: {
    maxHeight: 200,
  },
  commandItem: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  commandName: {
    fontWeight: '600',
    fontSize: 14,
  },
  commandDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});