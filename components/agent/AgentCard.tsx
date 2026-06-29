// components/agent/AgentCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Agent } from '../../lib/types/agent';

interface AgentCardProps {
  agent: Agent;
  onPress: () => void;
}

export function AgentCard({ agent, onPress }: AgentCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {agent.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{agent.name}</Text>
        {agent.description && (
          <Text style={styles.description} numberOfLines={2}>
            {agent.description}
          </Text>
        )}
        <View style={styles.meta}>
          <Text style={styles.model}>{agent.model}</Text>
          <View
            style={[
              styles.status,
              { backgroundColor: agent.isActive ? '#33D69D' : '#999' },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  model: {
    fontSize: 12,
    color: '#999',
  },
  status: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});