import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { FileUp } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface UploadCardProps {
  fileName: string;
  fileSize: number;
  progress: number;
}

export default function UploadCard({ fileName, fileSize, progress }: UploadCardProps) {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Animated progress bar
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress * 100}%`,
      opacity: withTiming(1, { duration: 300 }),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FileUp size={32} color={Colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
          {fileName}
        </Text>
        
        <Text style={styles.fileSize}>
          {formatFileSize(fileSize)}
        </Text>
        
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        
        <Text style={styles.progressText}>
          Uploading {Math.round(progress * 100)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  fileName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  fileSize: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.progressBackground,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.progressFill,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.primary,
  },
});