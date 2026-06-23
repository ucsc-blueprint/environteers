import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { supabase } from '@/constants/supabase';

import { UserAvatar } from '@/components/UserAvatar';

type Volunteer = {
  id: string;
  name: string;
  membership: string;
  profilePicture: string | null;
};

const includesText = (str: string, search: string) =>
  str.toLowerCase().includes(search.toLowerCase());

export const formatMembership = (created_at: string) => {
  const created = new Date(created_at);
  const now = new Date();

  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Joined today';
  if (diffDays < 30) return `Member for ${diffDays} day${diffDays === 1 ? '' : 's'}`;

  const months = Math.floor(diffDays / 30);
  if (months < 12) return `Member for ${months} month${months === 1 ? '' : 's'}`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) return `Member for ${years} year${years === 1 ? '' : 's'}`;

  return (
    `Member for ${years} year${years === 1 ? '' : 's'} and ` +
    `${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`
  );
};

export const AdminVolunteersView = () => {
  const router = useRouter();
  const [allVolunteers, setAllVolunteers] = useState<Volunteer[]>([]);
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchUsers = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('user_id, first_name, last_name, created_at, profile_picture')
            .eq('is_admin', false);

          if (error) {
            console.error('Error fetching users:', error);
            return;
          }

          const users: Volunteer[] = (data ?? []).map((user) => {
            return {
              id: user.user_id,
              name: `${user.first_name} ${user.last_name}`,
              membership: formatMembership(user.created_at),
              profilePicture: user.profile_picture ?? null,
            };
          });

          setAllVolunteers(users);
        } catch (error) {
          console.error('Unexpected error:', error);
        }
      };

      fetchUsers();
    }, []),
  );

  const volunteers = useMemo(() => {
    if (!searchText.trim()) return allVolunteers;

    return allVolunteers.filter((user) => includesText(user.name, searchText));
  }, [allVolunteers, searchText]);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          placeholder='Search...'
          placeholderTextColor='#868E8B'
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {/* volunteer list */}
      <FlatList
        data={volunteers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24, paddingInline: 24 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/admin-analytics',
                params: {
                  volunteerName: item.name,
                  membershipStatus: item.membership,
                  volunteerID: item.id,
                },
              })
            }
          >
            <View style={{ marginRight: 12 }}>
              <UserAvatar
                firstName={item.name.split(' ')[0]}
                lastName={item.name.split(' ')[1] ?? ''}
                photoUrl={item.profilePicture}
                size={40}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtext}>{item.membership}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    padding: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2F6',
    borderRadius: 8,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtext: {
    fontSize: 13,
    color: '#777',
  },
});
