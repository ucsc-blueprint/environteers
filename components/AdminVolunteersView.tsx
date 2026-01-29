import React, { useState } from 'react';
import {View, Text, TextInput, FlatList, Pressable, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Volunteer = {
  id: string;
  name: string;
  years: number;
  status: 'approved' | 'pending';
};

const MOCK_VOLUNTEERS: Volunteer[] = [
  { id: '1', name: 'A Name', years: 3, status: 'approved' },
  { id: '2', name: 'B Name', years: 2, status: 'approved' },
  { id: '3', name: 'C Name', years: 1, status: 'pending' },
  { id: '4', name: 'D Name', years: 4, status: 'pending' },
  { id: '5', name: 'E Name', years: 2, status: 'approved' },
  { id: '6', name: 'F Name', years: 2, status: 'approved' },
  { id: '7', name: 'G Name', years: 2, status: 'approved' },
  { id: '8', name: 'H Name', years: 2, status: 'approved' },
  { id: '9', name: 'I Name', years: 2, status: 'approved' },
  { id: '10', name: 'J Name', years: 2, status: 'approved' },
  { id: '11', name: 'K Name', years: 2, status: 'approved' },
  { id: '12', name: 'L Name', years: 2, status: 'approved' },
  { id: '13', name: 'M Name', years: 2, status: 'approved' },
];

const includesText = (str: string, search: string) => 
    {
        if (str.toLowerCase().includes(search.toLowerCase()))
        {
          return true;
        }
        else
          return false;

    }

export const AdminVolunteersView = () => {
  const [tab, setTab] = useState<'approved' | 'pending'>('approved');
  const [searchText, setSearchText] = useState('');

  // Filter volunteers by tab and search text
  const filteredVolunteers = MOCK_VOLUNTEERS.filter(
    (v) =>
      v.status === tab &&
      (includesText(v.name, searchText))
  );

  return (
    <View style = {styles.container}>
      <Pressable onPress = {() => {console.log("Icon pressed")}}>
        <Ionicons name="menu-outline" marginTop = {16} marginLeft = {8} size={36} color="black" />
      </Pressable>
      <View style={styles.container}>

        <TextInput
          placeholderTextColor='#999'
          
          placeholder="Search for a name (or email??)"
          

          style={styles.search}
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable onPress={() => setTab('approved')}>
            <Text style={[styles.tabText, tab === 'approved' && styles.activeTab]}>
              Approved
            </Text>
          </Pressable>

          <Pressable onPress={() => setTab('pending')}>
            <Text style={[styles.tabText, tab === 'pending' && styles.activeTab]}>
              Pending Approval
            </Text>
          </Pressable>
        </View>

        {/* volunteer list */}
        <FlatList
          data={filteredVolunteers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24, paddingInline: 24}}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatar} />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.subtext}>Member for {item.years} years</Text>
              </View>

              {item.status === 'pending' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Pending</Text>
                </View>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width : '100%'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  search: {
    borderWidth: 1,
    width : '85%',
    alignSelf: 'center',
    borderColor: '#151414',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
    marginTop: 24,
  },
  tabs: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    marginHorizontal: '20%',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTab: {
    color: '#000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtext: {
    fontSize: 13,
    color: '#777',
  },
  badge: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
  },
});

