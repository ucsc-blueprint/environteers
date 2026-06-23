import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';

interface DeleteNewsConfirmationModalProps {
  newsletterTitle: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteNewsConfirmationModal = ({
  newsletterTitle,
  visible,
  onCancel,
  onConfirm,
}: DeleteNewsConfirmationModalProps) => {
  return (
    <Modal transparent visible={visible} animationType='fade'>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Are you sure you want to delete this newsletter:
              <Text style={styles.newsletterTitle}>
                {' '}
                {newsletterTitle}
                <Text style={styles.modalTitle}>?</Text>
              </Text>
            </Text>
          </View>
          <Text style={styles.modalText}>
            Note: this only deletes the newsletter from the app. This is a permanent and
            irreversible action.
          </Text>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>

            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Delete</Text>
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
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 25,
    alignItems: 'center',
  },

  modalHeader: {
    marginBottom: 25,
  },

  modalTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: 'black',
  },

  newsletterTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#79B128',
  },

  modalText: {
    fontWeight: '400',
    fontSize: 14,
    marginBottom: 40,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  cancelButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 12,
    marginRight: 50,
    width: 80,
    height: 50,
  },

  confirmButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA4335',
    borderRadius: 12,
    width: 80,
    height: 50,
  },

  buttonText: {
    color: '#F2F7F5',
    fontWeight: '400',
    fontSize: 14,
  },
});
