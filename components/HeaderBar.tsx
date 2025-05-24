import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import Colors from '@/constants/Colors';

interface HeaderBarProps {
  title: string;
  showBackButton?: boolean;
}

export default function HeaderBar({ title, showBackButton }: HeaderBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Only show back button if explicitly requested or if not on a tab route
  const shouldShowBackButton = showBackButton || 
    (!pathname.match(/^\/(index|history|settings)$/));

  return (
    <View style={styles.header}>
      {shouldShowBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  rightPlaceholder: {
    width: 40,
  },
});