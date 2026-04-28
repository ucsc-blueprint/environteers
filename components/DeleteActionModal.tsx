import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onFullDelete: () => void;
  onHide: () => void;
};

export const DeleteActionModal = ({ visible, onClose, onFullDelete, onHide }: Props) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.backdrop} onPress={onClose}>
      <Pressable style={styles.popup} >
        <Text style={styles.title}>Remove this eco-action?</Text>

        <Pressable style={styles.deleteButton} onPress={onFullDelete}>
          <Text style={styles.deleteText}>Fully delete</Text>
          <Text style={styles.subtitleWhite}>Permanently removes all data</Text>
        </Pressable>

        <Pressable style={styles.hideButton} onPress={onHide}>
          <Text style={styles.hideText}>Hide from users</Text>
          <Text style={styles.subtitle}>Keeps history for people who interacted with it</Text>
        </Pressable>

        <Pressable onPress={onClose}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create(
{
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24 
    },
  popup: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    gap: 12 
    },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4 
    },
  hideButton: {
    backgroundColor: '#66b8e8',
    borderRadius: 12,
    padding: 14 
    },
  hideText: {
    fontWeight: '600',
    fontSize: 15 
    },
  deleteButton: {
    backgroundColor: '#EA4335',
    borderRadius: 12,
    padding: 14 
    },
  deleteText: {
    fontWeight: '600',
    fontSize: 15,
    color: 'white' 
    },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2 
    },
  subtitleWhite: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2 
    },
  cancel: {
    textAlign: 'center', 
    color: '#666',
    paddingVertical: 4 
    },
});