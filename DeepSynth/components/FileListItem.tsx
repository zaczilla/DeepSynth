import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, FilePdf, FileCheck, FileWarning } from 'lucide-react-native';
import { FileUpload } from '@/types/files';
import Colors from '@/constants/Colors';

interface FileListItemProps {
  file: FileUpload;
  onPress?: () => void;
}

export default function FileListItem({ file, onPress }: FileListItemProps) {
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Determine icon based on file type
  const getFileIcon = () => {
    if (file.status === 'failed') {
      return <FileWarning size={24} color={Colors.error} />;
    }
    
    const lowercaseName = file.name.toLowerCase();
    if (lowercaseName.endsWith('.pdf')) {
      return <FilePdf size={24} color={Colors.primary} />;
    } else if (lowercaseName.endsWith('.docx')) {
      return <FileText size={24} color={Colors.primary} />;
    } else {
      return <FileCheck size={24} color={Colors.primary} />;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        {getFileIcon()}
      </View>
      
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
          {file.name}
        </Text>
        
        <View style={styles.fileDetails}>
          <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
          <Text style={styles.fileDot}>•</Text>
          <Text style={styles.fileDate}>{formatDate(file.uploadedAt)}</Text>
        </View>
      </View>
      
      <View style={[
        styles.statusIndicator, 
        file.status === 'success' ? styles.statusSuccess : 
        file.status === 'failed' ? styles.statusFailed : 
        styles.statusPending
      ]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fileInfo: {
    flex: 1,
    marginRight: 8,
  },
  fileName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 4,
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  fileDot: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginHorizontal: 4,
  },
  fileDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusSuccess: {
    backgroundColor: Colors.success,
  },
  statusFailed: {
    backgroundColor: Colors.error,
  },
  statusPending: {
    backgroundColor: Colors.warning,
  },
});