import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type AdminCardActionSelectionProps = {
  visible: boolean;
  onClose: () => void;
  hidden: boolean;
  onToggleHide: () => void;
  onDelete: () => void;
};

export const AdminCardActionSelection = ({
  visible,
  onClose,
  hidden,
  onToggleHide,
  onDelete,
}: AdminCardActionSelectionProps) => {
  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressedMenuItem]}
            onPress={() => {
              onClose();
              onToggleHide();
            }}
          >
            {({ pressed }) => (
              <>
                <Text style={[styles.menuText, pressed && styles.pressedMenuText]}>
                  {hidden ? 'Unhide Eco Module' : 'Hide Eco Module'}
                </Text>

                {pressed && <MaterialCommunityIcons name='check' size={18} color='#0B5345' />}
              </>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressedMenuItem]}
            onPress={() => {
              onClose();
              onDelete();
            }}
          >
            {({ pressed }) => (
              <>
                <Text style={[styles.menuText, pressed && styles.pressedMenuText]}>
                  Delete Eco Module
                </Text>

                {pressed && <MaterialCommunityIcons name='check' size={18} color='#0B5345' />}
              </>
            )}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuContainer: {
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 30,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 26,
  },

  pressedMenuItem: {
    backgroundColor: '#DDE8CE',
  },

  menuText: {
    fontSize: 13,
    color: 'black',
  },

  pressedMenuText: {
    color: '#0B5345',
  },
});
