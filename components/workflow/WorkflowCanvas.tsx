// components/workflow/WorkflowCanvas.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useWorkflowStore } from '../../lib/state/workflow-store';
import { WorkflowNode as WorkflowNodeType } from '../../lib/types/agent';
import { WorkflowNode } from './WorkflowNode';

export function WorkflowCanvas() {
  const { nodes, connections, activeNode, onNodeSelect } = useWorkflowStore();

  // Render SVG connections between nodes
  const renderConnections = () => {
    return Object.entries(connections).map(([sourceId, targets]) => {
      const source = nodes.find(n => n.id === sourceId);
      if (!source) return null;
      
      return (targets as string[]).map(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (!target) return null;
        
        return (
          <Line
            key={`${sourceId}-${targetId}`}
            x1={source.position[0] + 60}
            y1={source.position[1] + 30}
            x2={target.position[0]}
            y2={target.position[1] + 30}
            stroke="#007AFF"
            strokeWidth={2}
            strokeDasharray="5,5"
          />
        );
      });
    });
  };

  if (nodes.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Добавьте узлы workflow через тулбар
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Svg style={styles.canvas}>
        {renderConnections()}
        {nodes.map((node) => (
          <WorkflowNode
            key={node.id}
            node={node}
            isSelected={activeNode?.id === node.id}
            onPress={() => onNodeSelect?.(node)}
            style={{
              position: 'absolute',
              left: node.position[0],
              top: node.position[1],
            }}
          />
        ))}
      </Svg>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    minHeight: 600,
    backgroundColor: '#fafafa',
    position: 'relative',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
  },
});