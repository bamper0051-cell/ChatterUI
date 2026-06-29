// app/(main)/admin/index.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAdminStore } from '../../../lib/state/admin-store';
import { useAuthStore } from '../../../lib/state/auth-store';
import { UserList } from '../../../components/admin/UserList';
import { SystemStats } from '../../../components/admin/SystemStats';
import { ApiKeysManager } from '../../../components/admin/ApiKeysManager';

export default function AdminScreen() {
  const { user } = useAuthStore();
  const { users, stats, loadUsers, loadStats, isLoading } = useAdminStore();

  useEffect(() => {
    if (user?.role === 'admin') {
      loadUsers();
      loadStats();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <View style={styles.denied}>
        <Text style={styles.deniedText}>
          Доступ запрещён. Требуются права администратора.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <>
          <SystemStats stats={stats} />
          <UserList users={users} />
          <ApiKeysManager />
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
  denied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deniedText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
});