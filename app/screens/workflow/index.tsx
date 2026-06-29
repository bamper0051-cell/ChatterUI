// app/(main)/workflow/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useWorkflowStore } from '../../../lib/state/workflow-store';
import { WorkflowToolbar } from '../../../components/workflow/WorkflowToolbar';
import { WorkflowCanvas } from '../../../components/workflow/WorkflowCanvas';

export default function WorkflowScreen() {
  const { workflows, loadWorkflows, isLoading } = useWorkflowStore();

  useEffect(() => {
    loadWorkflows();
  }, []);

  return (
    <View style={styles.container}>
      <WorkflowToolbar />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Workflows ({workflows.length})</Text>
          {workflows.length === 0 ? (
            <Text style={styles.empty}>Нет workflow. Создайте первый!</Text>
          ) : (
            workflows.map((wf) => (
              <TouchableOpacity 
                key={wf.id} 
                style={styles.workflowItem}
              >
                <Text style={styles.workflowName}>{wf.name}</Text>
                <Text style={styles.workflowDesc}>{wf.description}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
  },
  workflowItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  workflowName: {
    fontSize: 16,
    fontWeight: '600',
  },
  workflowDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});