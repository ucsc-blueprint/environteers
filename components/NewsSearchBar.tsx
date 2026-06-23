import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { NewsDateFilter, NewsDateFilterDropdown } from '@/components/NewsDateFilterDropdown';

type NewsSearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
  filterDateLength: NewsDateFilter;
  setFilterDateLength: (filter: NewsDateFilter) => void;
  adminStyle?: boolean;
};

export const NewsSearchBar = ({
  search,
  setSearch,
  filterDateLength,
  setFilterDateLength,
  adminStyle = false,
}: NewsSearchBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.searchRow, adminStyle && styles.searchRowAdmin]}>
        <TextInput
          placeholder='Search...'
          placeholderTextColor='#868E8B'
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, adminStyle && styles.searchInputAdmin]}
        />

        <Pressable
          onPress={() => setShowFilters((prev) => !prev)}
          style={[styles.filterButton, adminStyle && styles.filterButtonAdmin]}
        >
          <SlidersHorizontal size={18} color='black' />
        </Pressable>
      </View>

      {showFilters && (
        <View style={{ marginTop: 16 }}>
          <NewsDateFilterDropdown
            selectedDateFilter={filterDateLength}
            onApply={(filter) => {
              setFilterDateLength(filter);
              setShowFilters(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2F6',
    borderRadius: 8,
  },
  searchRowAdmin: {
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  searchInputAdmin: {
    backgroundColor: '#fff',
  },
  filterButton: {
    width: 35,
    height: 28,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  filterButtonAdmin: {
    backgroundColor: '#EAF2F6',
  },
});
