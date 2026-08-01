import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export type NewsDateFilter = 'week' | '2weeks' | 'month' | 'all';

const DATE_OPTIONS: { label: string; value: NewsDateFilter }[] = [
  { label: 'Past Week', value: 'week' },
  { label: 'Past 2 Weeks', value: '2weeks' },
  { label: 'Past Month', value: 'month' },
  { label: 'Any', value: 'all' },
];

type NewsDateFilterDropdownProps = {
  selectedDateFilter: NewsDateFilter;
  onApply: (filter: NewsDateFilter) => void;
};

export const NewsDateFilterDropdown = ({
  selectedDateFilter,
  onApply,
}: NewsDateFilterDropdownProps) => {
  const [localFilter, setLocalFilter] = useState<NewsDateFilter>(selectedDateFilter);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by</Text>

      {DATE_OPTIONS.map((option) => {
        const selected = localFilter === option.value;
        return (
          <Pressable
            key={option.value}
            style={styles.radioRow}
            onPress={() => setLocalFilter(option.value)}
          >
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.rowLabel}>{option.label}</Text>
          </Pressable>
        );
      })}

      <Pressable style={styles.applyButton} onPress={() => onApply(localFilter)}>
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
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  rowLabel: {
    fontSize: 14,
    color: '#525856',
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
