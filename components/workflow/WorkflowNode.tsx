// components/workflow/WorkflowNode.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { WorkflowNode as WorkflowNodeType } from '../../lib/types/agent';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  onPress: (event: GestureResponderEvent) => void;
  isSelected?: boolean;
}

export function WorkflowNode({ node, onPress, isSelected }: WorkflowNodeProps) {
  const getNodeColor = () => {
    const colors: Record<string, string> = {
      telegram: '#0088CC',
      openai: '#41299F',
      http: '#FF6B35',
      webhook: '#33D69D',
      function: '#663399',
      default: '#666666',
    };
    return colors[node.type] || colors.default;
  };

  return (
    <TouchableOpacity
      style={[
        styles.node,
        { backgroundColor: getNodeColor() },
        isSelected && styles.selected,
      ]}
      onPress={onPress}
    >
      <Text style={styles.nodeTitle}>{node.type}</Text>
      <Text style={styles.nodeId}>{node.id.substring(0, 8)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  node: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  nodeTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  nodeId: {
    color: '#fff',
    fontSize: 10,
    opacity: 0.8,
  },
});