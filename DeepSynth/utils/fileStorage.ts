import * as FileSystem from 'expo-file-system';
import { FileUpload } from '@/types/files';

const HISTORY_FILE = FileSystem.documentDirectory + 'uploadHistory.json';

// Initialize history file if it doesn't exist
export const initializeStorage = async (): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(HISTORY_FILE);
    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    // Create an empty history file if there's an error
    await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify([]));
  }
};

// Get upload history
export const getUploadHistory = async (): Promise<FileUpload[]> => {
  try {
    await initializeStorage();
    const historyData = await FileSystem.readAsStringAsync(HISTORY_FILE);
    return JSON.parse(historyData);
  } catch (error) {
    console.error('Error retrieving upload history:', error);
    return [];
  }
};

// Add upload to history
export const addToUploadHistory = async (upload: Omit<FileUpload, 'id'>): Promise<FileUpload> => {
  try {
    const history = await getUploadHistory();
    
    const newUpload: FileUpload = {
      id: Date.now().toString(),
      ...upload,
    };
    
    const updatedHistory = [newUpload, ...history];
    await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(updatedHistory));
    
    return newUpload;
  } catch (error) {
    console.error('Error adding upload to history:', error);
    throw error;
  }
};

// Update upload status
export const updateUploadStatus = async (id: string, status: 'success' | 'failed' | 'pending'): Promise<void> => {
  try {
    const history = await getUploadHistory();
    
    const updatedHistory = history.map(item => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    
    await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error updating upload status:', error);
    throw error;
  }
};

// Clear upload history
export const clearUploadHistory = async (): Promise<void> => {
  try {
    await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing upload history:', error);
    throw error;
  }
};