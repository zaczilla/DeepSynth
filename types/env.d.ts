declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_FILES_COM_API_KEY: string;
      EXPO_PUBLIC_FILES_COM_UPLOAD_URL: string;
      // Add other environment variables here
    }
  }
}

// Ensure this file is treated as a module
export {};