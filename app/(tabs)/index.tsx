import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileUp, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as Clipboard from 'expo-clipboard';

import HeaderBar from '@/components/HeaderBar';
import Colors from '@/constants/Colors';
import { uploadFile } from '@/utils/fileUploader';
import { createTextFile } from '@/utils/fileConverter';
import UploadCard from '@/components/UploadCard';

function UploadScreen() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUpload, setCurrentUpload] = useState<{name: string, size: number} | null>(null);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) return;
      
      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name;
      const fileSize = result.assets[0].size || 0;
      
      setCurrentUpload({
        name: fileName,
        size: fileSize,
      });
      
      setIsUploading(true);
      setUploadProgress(0);
      
      await uploadFile(fileUri, fileName, (progress) => {
        setUploadProgress(progress);
      });
      
      setIsUploading(false);
      router.push('/history');
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  const handleTextUpload = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      
      if (!text) {
        alert('No text found in clipboard');
        return;
      }
      
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
      const fileName = `shared_text_${timestamp}.docx`;
      
      setCurrentUpload({
        name: fileName,
        size: text.length,
      });
      
      setIsUploading(true);
      setUploadProgress(0);
      
      const fileUri = await createTextFile(text, fileName);
      
      await uploadFile(fileUri, fileName, (progress) => {
        setUploadProgress(progress);
      });
      
      setIsUploading(false);
      router.push('/history');
    } catch (error) {
      console.error('Error uploading text:', error);
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="Upload to Files.com" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Share your content</Text>
        <Text style={styles.subtitle}>Upload files or text directly to your Files.com account</Text>
        
        {isUploading ? (
          <UploadCard 
            fileName={currentUpload?.name || 'Unknown file'} 
            fileSize={currentUpload?.size || 0}
            progress={uploadProgress} 
          />
        ) : (
          <View style={styles.uploadOptions}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
              <FileUp color={Colors.primary} size={32} />
              <Text style={styles.uploadButtonText}>Upload Document</Text>
              <Text style={styles.uploadButtonSubtext}>PDF, DOCX</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadButton} onPress={handleTextUpload}>
              <FileText color={Colors.primary} size={32} />
              <Text style={styles.uploadButtonText}>Upload Text</Text>
              <Text style={styles.uploadButtonSubtext}>From Clipboard</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Share directly from other apps</Text>
          <Text style={styles.instructionsText}>
            Use your device's share menu in any app to send content directly to Files.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 8,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 32,
    color: Colors.textSecondary,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  uploadButton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginTop: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  uploadButtonSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginTop: 4,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  instructionsTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
  },
  instructionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
});

export default UploadScreen;