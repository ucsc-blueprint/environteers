import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  message: string;
  description: string;
  onClose: () => void;
};

export const DeleteToast = ({ visible, message, description, onClose }: Props) => {
  useEffect(() => 
    {
        if (visible) {
        const timer = setTimeout(onClose, 5000); //up for 5 seconds 
        return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

  if (!visible) return null;

  return (
    <View style={styles.toast}>
      <MaterialIcons name="error-outline" size={22} color="#EA4335" style={{ marginTop: 2 }} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>{message}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Pressable onPress={onClose}>
        <MaterialIcons name="close" size={20} color="#333" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fef2f2',
    borderColor: '#EA4335',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  textBlock: { flex: 1 },
  title: { fontWeight: '700', fontSize: 15, marginBottom: 2 },
  description: { fontSize: 13, color: '#444' },
});