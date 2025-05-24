import { useEffect, useState } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Set ready state immediately
    setIsReady(true);
    
    // Signal framework readiness if the function exists
    if (typeof window !== 'undefined' && window.frameworkReady) {
      try {
        window.frameworkReady();
      } catch (error) {
        console.error('Error calling frameworkReady:', error);
      }
    }
  }, []);

  return isReady;
}