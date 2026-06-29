// components/workflow/WorkflowToolbar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Plus, Save, Play, Pause, Settings, Trash2 } from 'lucide-react-native';

interface WorkflowToolbarProps {
  onAddNode?: (type: string) => void;
  onSave?: () => void;
  onExecute?: () => void;
  onDelete?: () => void;
}

const NODE_TYPES = [
  { type: 'telegram', label: 'Telegram', icon: '📱' },
  { type: 'openai', label: 'OpenAI', icon: '🤖' },
  { type: 'http', label: 'HTTP', icon: '🌐' },
  { type: 'webhook', label: 'Webhook', icon: '🔗' },
  { type: 'function', label: 'Function', icon: '⚡' },
];

export function WorkflowToolbar({ onAddNode, onSave, onExecute, onDelete }: WorkflowToolbarProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Добавить узел:</Text>
          {NODE_TYPES.map((node) => (
            <TouchableOpacity
              key={node.type}
              style={styles.nodeButton}
              onPress={() => onAddNode?.(node.type)}
            >
              <Text style={styles.nodeIcon}>{node.icon}</Text>
              <Text style={styles.nodeLabel}>{node.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={onSave}>
            <Save size={20} color="#fff" />
            <Text style={styles.actionText}>Сохранить</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onExecute}>
            <Play size={20} color="#fff" />
            <Text style={styles.actionText}>Запустить</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={onDelete}>
            <Trash2 size={20} color="#fff" />
            <Text style={styles.actionText}>Удалить</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Settings size={20} color="#fff" />
            <Text style={styles.actionText}>Настройки</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionLabel: {
    color: '#fff',
    fontSize: 12,
    marginRight: 8,
  },
  nodeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nodeIcon: {
    fontSize: 16,
  },
  nodeLabel: {
    color: '#fff',
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  actionText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
});