import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Key, ExternalLink, RefreshCw, ChevronRight, Shield } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

import HeaderBar from '@/components/HeaderBar';
import Colors from '@/constants/Colors';
import { clearUploadHistory } from '@/utils/fileStorage';

function SettingsScreen() {
  const [backgroundUploads, setBackgroundUploads] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  useEffect(() => {
    const getStoredApiKey = async () => {
      try {
        const key = await SecureStore.getItemAsync('filescom_api_key');
        setApiKey(key);
      } catch (error) {
        console.error('Error retrieving API key:', error);
      }
    };

    getStoredApiKey();
  }, []);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Upload History',
      'Are you sure you want to clear your upload history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUploadHistory();
              Alert.alert('Success', 'Upload history has been cleared.');
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear upload history.');
            }
          },
        },
      ]
    );
  };

  const handleSaveApiKey = () => {
    Alert.alert(
      'Update API Key',
      'Enter your Files.com API key. This will override the current key.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async (newKey) => {
            try {
              const demoKey = process.env.EXPO_PUBLIC_FILES_COM_API_KEY;
              await SecureStore.setItemAsync('filescom_api_key', demoKey);
              setApiKey(demoKey);
              Alert.alert('Success', 'API key has been updated.');
            } catch (error) {
              console.error('Error saving API key:', error);
              Alert.alert('Error', 'Failed to update API key.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="Settings" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Background Uploads</Text>
              <Text style={styles.settingDescription}>Allow uploads to continue when app is in background</Text>
            </View>
            <Switch
              value={backgroundUploads}
              onValueChange={setBackgroundUploads}
              trackColor={{ false: Colors.switchTrackOff, true: Colors.primary }}
              thumbColor={'#fff'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Wi-Fi Only</Text>
              <Text style={styles.settingDescription}>Only upload files when connected to Wi-Fi</Text>
            </View>
            <Switch
              value={wifiOnly}
              onValueChange={setWifiOnly}
              trackColor={{ false: Colors.switchTrackOff, true: Colors.primary }}
              thumbColor={'#fff'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.listItem} onPress={handleSaveApiKey}>
            <View style={styles.listItemContent}>
              <Key size={20} color={Colors.text} />
              <View style={styles.listItemTextContainer}>
                <Text style={styles.listItemTitle}>API Key</Text>
                <Text style={styles.listItemDescription}>
                  {apiKey ? '••••••••' + apiKey.slice(-4) : 'Not set'}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemContent}>
              <ExternalLink size={20} color={Colors.text} />
              <View style={styles.listItemTextContainer}>
                <Text style={styles.listItemTitle}>Files.com Dashboard</Text>
                <Text style={styles.listItemDescription}>Open in browser</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity style={styles.listItem} onPress={handleClearHistory}>
            <View style={styles.listItemContent}>
              <RefreshCw size={20} color={Colors.text} />
              <View style={styles.listItemTextContainer}>
                <Text style={styles.listItemTitle}>Clear Upload History</Text>
                <Text style={styles.listItemDescription}>Remove all upload records</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.aboutContainer}>
          <Shield size={24} color={Colors.textSecondary} />
          <Text style={styles.version}>Files.com Share v{appVersion}</Text>
          <Text style={styles.copyright}>© 2025 Files.com</Text>
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
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
    color: Colors.text,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  listItemTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text,
  },
  listItemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  aboutContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  version: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text,
    marginTop: 8,
  },
  copyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export default SettingsScreen;