import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { getMimeType } from './fileConverter';
import { addToUploadHistory, updateUploadStatus } from './fileStorage';

interface UploadProgressCallback {
  (progress: number): void;
}

// Helper function to get the API key
const getApiKey = async (): Promise<string> => {
  try {
    // Try to get the key from secure storage first
    const storedKey = await SecureStore.getItemAsync('filescom_api_key');
    
    if (storedKey) {
      return storedKey;
    }
    
    // Fall back to environment variable
    const envKey = process.env.EXPO_PUBLIC_FILES_COM_API_KEY;
    
    if (envKey) {
      // Store the key for future use
      await SecureStore.setItemAsync('filescom_api_key', envKey);
      return envKey;
    }
    
    throw new Error('API key not found');
  } catch (error) {
    console.error('Error retrieving API key:', error);
    throw error;
  }
};

// Upload file to Files.com
export const uploadFile = async (
  fileUri: string,
  fileName: string,
  progressCallback?: UploadProgressCallback
): Promise<string> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }
    
    // Add to history as pending
    const uploadRecord = await addToUploadHistory({
      name: fileName,
      size: fileInfo.size || 0,
      type: getMimeType(fileName),
      uploadedAt: new Date().toISOString(),
      url: '',
      status: 'pending',
    });
    
    const apiKey = await getApiKey();
    const uploadUrl = process.env.EXPO_PUBLIC_FILES_COM_UPLOAD_URL || 'https://pisteyo.files.com/files/uploads';
    
    // Check if Expo FileSystem upload is available (iOS/Android)
    if (Platform.OS !== 'web' && FileSystem.createUploadTask) {
      const uploadTask = FileSystem.createUploadTask(
        uploadUrl,
        fileUri,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': getMimeType(fileName),
          },
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          fieldName: 'file',
          parameters: {
            path: `/uploads/${fileName}`,
          },
        },
        (progress) => {
          if (progressCallback) {
            progressCallback(progress.totalByteSent / progress.totalBytesExpectedToSend);
          }
        }
      );
      
      const response = await uploadTask.uploadAsync();
      
      if (response && response.status >= 200 && response.status < 300) {
        // Update history with success status
        await updateUploadStatus(uploadRecord.id, 'success');
        
        // Parse response to get the file URL
        const responseData = JSON.parse(response.body);
        return responseData.url || '';
      } else {
        throw new Error(`Upload failed with status ${response?.status}`);
      }
    } else {
      // Web fallback using fetch API
      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Create a form data object
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: getMimeType(fileName),
      } as any);
      formData.append('path', `/uploads/${fileName}`);
      
      // Upload the file
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        // Update history with success status
        await updateUploadStatus(uploadRecord.id, 'success');
        
        const responseData = await response.json();
        return responseData.url || '';
      } else {
        throw new Error(`Upload failed with status ${response.status}`);
      }
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};