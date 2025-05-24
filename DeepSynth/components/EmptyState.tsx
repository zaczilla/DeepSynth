import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  actionHref,
  isLoading = false,
  refreshing = false,
  onRefresh,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          <View style={styles.iconContainer}>{icon}</View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.actionsContainer}>
            {actionLabel && actionHref && (
              <Link href={actionHref} asChild>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>{actionLabel}</Text>
                </TouchableOpacity>
              </Link>
            )}
            
            {onRefresh && (
              <TouchableOpacity 
                style={styles.refreshButton} 
                onPress={onRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <>
                    <RefreshCw size={16} color={Colors.primary} />
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionsContainer: {
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
  },
});