// components/admin/UserList.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { User } from '../../lib/types/agent';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={[styles.roleBadge, item.role === 'admin' && styles.adminBadge]}>
        <Text style={styles.roleText}>{item.role === 'admin' ? 'Admin' : 'User'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Пользователи ({users.length})</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
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
  list: {
    maxHeight: 300,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#007AFF',
  },
  adminBadge: {
    backgroundColor: '#FFD700',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
});