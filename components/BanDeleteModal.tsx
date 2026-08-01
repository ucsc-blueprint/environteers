import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

export type ModalType = 'ban' | 'delete';

type BanDeleteModalProps = {
  visible: boolean;
  type: ModalType | null;
  onCancel: () => void;
  onConfirm: (type: ModalType) => void;
  volunteerName: string;
};

export const BanDeleteModal = ({
  visible,
  type,
  onCancel,
  onConfirm,
  volunteerName,
}: BanDeleteModalProps) => {
  if (!type) return null;

  const action = type === 'ban' ? 'ban' : 'delete';

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Are you sure?</Text>

          <View>
            <Text style={styles.modalText}>
              {action === 'ban' ? (
                <>
                  {'Are you sure you want to temporarily ban '}
                  <Text style={{ fontWeight: 'bold' }}>{volunteerName}</Text>
                  {"? They won't be able to use this app and track their activities for the next "}
                  <Text style={{ fontWeight: 'bold' }}>14 days</Text>
                </>
              ) : (
                <>
                  {'Are you sure you want to delete '}
                  <Text style={{ fontWeight: 'bold' }}>{volunteerName}</Text>
                  {'? This action would permanently erase their information from the app.'}
                </>
              )}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={() => onConfirm(type)} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>
                {action === 'ban' ? 'Ban Temporarily' : 'Delete User'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 25,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 25,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E00000',
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E00000',
    height: 45,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginLeft: 16,
  },
  confirmButtonText: {
    color: '#F2F7F5',
  },
});
