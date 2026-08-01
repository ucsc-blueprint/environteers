import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type FilterTypeOption = {
  label: string;
  value: string;
};

type EcoFeedFilterDropdownProps = {
  typeOptions: FilterTypeOption[];
  selectedTypes: string[];
  selectedDistance: number | null;
  onApply: (types: string[], distance: number | null) => void;
};

export const EcoFeedFilterDropdown = ({
  typeOptions,
  selectedTypes,
  selectedDistance,
  onApply,
}: EcoFeedFilterDropdownProps) => {
  const [localTypes, setLocalTypes] = useState<string[]>(selectedTypes);
  const [localDistance, setLocalDistance] = useState<number | null>(selectedDistance);
  const [distanceOpen, setDistanceOpen] = useState(selectedDistance !== null);

  const toggleType = (value: string) => {
    setLocalTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const toggleDistance = () => {
    if (distanceOpen) setLocalDistance(null);
    setDistanceOpen((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by</Text>

      {typeOptions.map((option) => {
        const checked = localTypes.includes(option.value);
        return (
          <Pressable key={option.value} style={styles.row} onPress={() => toggleType(option.value)}>
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
              {checked && <MaterialIcons name='check' size={14} color='white' />}
            </View>

            <Text style={styles.rowLabel}>{option.label}</Text>
          </Pressable>
        );
      })}

      <Pressable style={[styles.row, distanceOpen && styles.rowActive]} onPress={toggleDistance}>
        <View style={[styles.checkbox, distanceOpen && styles.checkboxChecked]}>
          {distanceOpen && <MaterialIcons name='check' size={14} color='white' />}
        </View>

        <Text style={[styles.rowLabel, distanceOpen && styles.rowActive]}>Distance</Text>
        <MaterialIcons
          name={'expand-more'}
          size={20}
          color='black'
          style={{ marginLeft: 'auto' }}
        />
      </Pressable>

      {distanceOpen &&
        [5, 10, 15, 20].map((d) => {
          const selected = localDistance === d;
          return (
            <Pressable
              key={d}
              style={styles.radioRow}
              onPress={() => setLocalDistance(selected ? null : d)}
            >
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioDot} />}
              </View>

              <Text style={styles.rowLabel}>{d === 20 ? '20+ miles' : `${d} miles`}</Text>
            </Pressable>
          );
        })}

      <Pressable style={styles.applyButton} onPress={() => onApply(localTypes, localDistance)}>
        <Text style={styles.applyText}>Apply</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    color: '#868E8B',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  rowActive: {
    backgroundColor: '#E6F0ED',
  },
  rowLabel: {
    fontSize: 14,
    color: '#525856',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#525856',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#458C7E',
    borderColor: '#458C7E',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 12,
    gap: 14,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#525856',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#458C7E',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#458C7E',
  },
  applyButton: {
    backgroundColor: '#618e1f',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    alignSelf: 'center',
  },
  applyText: {
    color: '#F2F7F5',
    fontSize: 14,
    fontWeight: 400,
  },
});
