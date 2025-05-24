import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { FileText } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { uploadFile } from '@/utils/fileUploader';
import { createTextFile } from '@/utils/fileConverter';

function ShareScreen() {
  const router = useRouter();
  const isMounted = useRef(true);
  const [isProcessing, setIsProcessing] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSharedContent = async () => {
      try {
        const sharedText = await Clipboard.getStringAsync();
        
        if (!isMounted.current) return;
        
        if (sharedText) {
          const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
          const fileName = `shared_text_${timestamp}.docx`;
          
          if (isMounted.current) {
            setFileName(fileName);
          }
          
          const fileUri = await createTextFile(sharedText, fileName);
          
          if (!isMounted.current) return;

          await uploadFile(fileUri, fileName, (progress) => {
            if (isMounted.current) {
              setUploadProgress(progress);
            }
          });
          
          if (isMounted.current) {
            setTimeout(() => {
              if (isMounted.current) {
                router.replace('/history');
              }
            }, 1000);
          }
        } else {
          if (isMounted.current) {
            setError('No content was shared');
            setTimeout(() => {
              if (isMounted.current) {
                router.replace('/');
              }
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error handling shared content:', error);
        if (isMounted.current) {
          setError('Failed to process shared content');
          setTimeout(() => {
            if (isMounted.current) {
              router.replace('/');
            }
          }, 2000);
        }
      } finally {
        if (isMounted.current) {
          setIsProcessing(false);
        }
      }
    };

    // Start processing after a brief delay to ensure proper mounting
    const initTimeout = setTimeout(() => {
      handleSharedContent();
    }, 100);

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearTimeout(initTimeout);
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.iconContainer}>
              <FileText size={40} color={Colors.primary} />
            </View>
            
            <Text style={styles.title}>
              {isProcessing ? 'Processing shared content...' : 'Uploading file...'}
            </Text>
            
            {fileName && (
              <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                {fileName}
              </Text>
            )}
            
            {isProcessing ? (
              <ActivityIndicator size="large" color={Colors.primary} style={styles.progress} />
            ) : (
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${uploadProgress * 100}%` }
                  ]} 
                />
              </View>
            )}
            
            <Text style={styles.progressText}>
              {isProcessing 
                ? 'Please wait while we process your content' 
                : `Uploading ${Math.round(uploadProgress * 100)}%`}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  fileName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    maxWidth: '90%',
  },
  progress: {
    marginVertical: 24,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.progressBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 24,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.progressFill,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
});

export default ShareScreen;