import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, ArrowDownToLine } from 'lucide-react-native';

import HeaderBar from '@/components/HeaderBar';
import FileListItem from '@/components/FileListItem';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/Colors';
import { getUploadHistory } from '@/utils/fileStorage';
import { FileUpload } from '@/types/files';

export default function HistoryScreen() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const history = await getUploadHistory();
      setFiles(history);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="Upload History" />
      
      <View style={styles.content}>
        {files.length > 0 ? (
          <FlatList
            data={files}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FileListItem file={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
            }
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
              <Text style={styles.sectionTitle}>Recently Uploaded</Text>
            }
          />
        ) : (
          <EmptyState 
            icon={<Calendar size={48} color={Colors.textSecondary} />}
            title="No upload history"
            message="Files you upload will appear here"
            actionLabel="Upload a file"
            actionHref="/"
            isLoading={isLoading}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 16,
    color: Colors.text,
    marginLeft: 8,
  },
});