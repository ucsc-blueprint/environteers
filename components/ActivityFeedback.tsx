import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { supabase } from '@/constants/supabase';

interface ActivityFeedbackProps {
  visible: boolean;
  onSubmit: (feedback: string) => void;
  onCancel: () => void;
}

export const ActivityFeedback = ({
  visible,
  onSubmit,
  onCancel,
}: ActivityFeedbackProps) => {
  const [feedback, setFeedback] = useState("");

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Share your Feedback!</Text>

          <View style={styles.feedbackContainer}>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Please let us know how the event/eco-action went for you or suggest any improvements for the future!"
              onChangeText={setFeedback}
              placeholderTextColor="#868E8B"
              value={feedback}
              multiline
              textAlignVertical="top"
            />
          </View>

          <Pressable style={styles.submitButton} onPress={() => { onSubmit(feedback); setFeedback(""); }}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => onCancel()}>
            <X size={18} color="black" />
          </Pressable>
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
    paddingVertical: 50,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: 'black',
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  feedbackContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CAE1F0',
    borderRadius: 8,
  },
  feedbackInput: {
    height: 184,
    padding: 10,
  },
  submitButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: "#3A5513",
    borderRadius: 12,
    width: 86,
    height: 40,
  },
  cancelButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  buttonText: {
    color: '#F2F7F5',
    fontWeight: '400',
    fontSize: 14
  }
})