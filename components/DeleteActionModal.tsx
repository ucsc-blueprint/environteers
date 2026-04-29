import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons'

type Props = {
  visible: boolean;
  onClose: () => void;
  onFullDelete: () => void;
  onHide: () => void;
  cardTitle?: string;
  cardType?: string;

};

export const DeleteActionModal = ({ visible, onClose, onFullDelete, onHide, cardTitle, cardType }: Props) => {

    const label = cardType === 'event' ? 'event' : 'eco-action';
    
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.popup} onPress={() => {}}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="error-outline" size={22} color="#EA4335" />
              <Text style={styles.title}>Deleting an {label}!</Text>
            </View>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#333" />
            </Pressable>
          </View>

          <Text style={styles.body}>
            You're about to delete{' '}
            <Text style={styles.eventName}>{cardTitle}</Text>
            {'. '}
            Would you like to: take down for those who have not yet signed up, or fully delete it?
          </Text>

          <View style={styles.buttonRow}>
            <Pressable onPress={onFullDelete} style={styles.deleteTextButton}>
              <Text style={styles.deleteTextLabel}>Fully delete</Text>
            </Pressable>
            <Pressable onPress={onHide} style={styles.hideButton}>
              <Text style={styles.hideLabel}>Hide from users</Text>
            </Pressable>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );

}

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
    fontWeight: '700',
    color: '#EA4335',
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
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  deleteTextLabel: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 15,
  },
  hideButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  hideLabel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});