import React from 'react';
import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';

interface AdminApproveProps {
  visible: boolean;
	name: string | undefined;
  onApprove: () => void;
	onDelete: () => void;
  onCancel: () => void;
}

export const AdminApprove = ({
  visible,
	name,
  onApprove,
	onDelete,
  onCancel,
}: AdminApproveProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Approve Admin Request</Text>

						<Pressable onPress={() => onCancel()}>
            	<X size={18} color="black" />
						</Pressable>
					</View>

          <View>
            <Text style={styles.message}>
							You&apos;re about to approve <Text style={styles.name}>{name}</Text>&apos;s request for
							admin access to the entire application. Ensure
							that this is the correct individual you want to
							give access to, as admins can edit content freely.
						</Text>
          </View>

					<View style={styles.buttonRow}>
						<Pressable onPress={() => onDelete()}>
							<Text style={styles.deleteButton}>Delete Request</Text>
						</Pressable>

						<Pressable style={styles.approveButton} onPress={() => onApprove()}>
							<Text style={styles.buttonText}>Approve</Text>
						</Pressable>
					</View>
        </View>
      </View>
    </Modal>
  )
}

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
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
		marginBottom: 30,
	},
  modalTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: 'black',
    justifyContent: 'flex-start',
  },
	message: {
	},
	name: {
		fontWeight: '400',
		fontSize: 14,
		color: '#304710',
	},
	buttonRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
  	gap: 16,
		marginTop: 30,
		alignSelf: 'stretch',
	},
	deleteButton: {
		color: '#57811D',
		fontWeight: '400',
		fontSize: 14,
	},
  approveButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#57811D",
    borderRadius: 12,
    width: 86,
    height: 40,
  },
  buttonText: {
    color: '#F2F7F5',
    fontWeight: '400',
    fontSize: 14
  }
})