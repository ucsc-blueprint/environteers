import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onFullDelete: () => void;
  cardTitle?: string;
  cardType?: string;
};

export const DeleteActionModal = ({
  visible,
  onClose,
  onFullDelete,
  cardTitle,
  cardType,
}: Props) => {
  const label = cardType === 'event' ? 'event' : 'eco-action';

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.popup} onPress={() => {}}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons name='error-outline' size={22} color='#EA4335' />
              <Text style={styles.title}>Deleting an {label}</Text>
            </View>
            <Pressable onPress={onClose}>
              <MaterialIcons name='close' size={22} color='#333' />
            </Pressable>
          </View>

          <Text style={styles.body}>
            {"You're about to delete "}
            <Text style={styles.eventName}>{cardTitle}</Text>
            {'. This action cannot be undone.'}
          </Text>

          <View style={styles.buttonRow}>
            <Pressable onPress={onClose}>
              <Text style={styles.cancelTextLabel}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onFullDelete} style={styles.deleteTextButton}>
              <Text style={styles.deleteTextLabel}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  popup: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF4163',
  },
  body: {
    fontSize: 14,
    color: '#333',
    lineHeight: 21,
  },
  eventName: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  deleteTextButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#E00000',
    borderRadius: 12,
  },
  deleteTextLabel: {
    color: '#FFFFFF',
    fontWeight: '300',
    fontSize: 15,
  },
  cancelTextLabel: {
    color: '#E00000',
    fontWeight: '300',
  },
});
