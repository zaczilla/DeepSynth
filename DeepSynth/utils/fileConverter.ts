import * as FileSystem from 'expo-file-system';

// Function to create a text file from clipboard content
export const createTextFile = async (text: string, fileName: string): Promise<string> => {
  try {
    // For simplicity in this demo, we're creating a TXT file
    // In a real app, you would need to use a library to create a proper DOCX file
    const fileUri = `${FileSystem.cacheDirectory}${fileName.replace('.docx', '.txt')}`;
    
    // Write the text content to the file
    await FileSystem.writeAsStringAsync(fileUri, text);
    
    return fileUri;
  } catch (error) {
    console.error('Error creating text file:', error);
    throw error;
  }
};

// Get MIME type based on file extension
export const getMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
};