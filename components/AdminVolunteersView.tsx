import React, { useState, useEffect, useMemo } from 'react';
import {View, Text, TextInput, FlatList, Pressable, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from "@/constants/supabase";

type Volunteer = {
  id: string;
  username: string;
  years: number;
};

const includesText = (str: string, search: string) => 
  str.toLowerCase().includes(search.toLowerCase());

export const AdminVolunteersView = () => {
  const [allVolunteers, setAllVolunteers] = useState<Volunteer[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('user_id, username, created_at')
          .eq("is_admin", false);
        
        if (error) {
          console.error("Error fetching users:", error);
          return;
        }

        const users: Volunteer[] = (data ?? []).map(user => {
          const created = new Date(user.created_at);
          const now = new Date();

          const years = Math.floor(
            (now.getTime() - created.getTime()) /
            (1000 * 60 * 60 * 24 * 365)
          );

          return {
            id: user.user_id,
            username: user.username,
            years
          };
        });

        setAllVolunteers(users);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchUsers();
  }, [])

  const volunteers = useMemo(() => {
    if (!searchText.trim()) return allVolunteers;

    return allVolunteers.filter(user => 
      includesText(user.username, searchText)
    );
  }, [allVolunteers, searchText]);

  return (
    <View style = {styles.container}>
      <Pressable onPress = {() => {console.log("Icon pressed")}}>
        <Ionicons name="menu-outline" marginTop = {16} marginLeft = {8} size={36} color="black" />
      </Pressable>
      <View style={styles.container}>

        <TextInput
          placeholderTextColor='#999'
          
          placeholder="Search for a username"
          

          style={styles.search}
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* volunteer list */}
        <FlatList
          data={volunteers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24, paddingInline: 24}}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.avatar} />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.username}</Text>
                <Text style={styles.subtext}>Member for {item.years} years</Text>
              </View>
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

