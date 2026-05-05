import React, { useState, useEffect } from 'react';
import {View, Text, Image, FlatList, StyleSheet,
} from 'react-native';
import { supabase } from "@/constants/supabase";

type Admin = {
  id: string;
  name: string;
  email: string;
};

export const AdminProfileView = () => {
  const [allAdmins, setAllAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('user_id, first_name, last_name, email')
          .eq("is_admin", true);
        
        if (error) {
          console.error("Error fetching admins:", error);
          return;
        }

        const admins: Admin[] = (data ?? []).map(admin => {
          return {
            id: admin.user_id,
            name: `${admin.first_name} ${admin.last_name}`,
            email: admin.email,
          };
        });

        setAllAdmins(admins);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchAdmins();
  }, [])

  return (
    <View style = {styles.container}>
      {/* admin list */}
      <FlatList
        data={allAdmins}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 28, gap: 24}}
        renderItem={({ item }) => (
          <View style={styles.profileContainer}>
            <View style={styles.avatarSection}>
              <Image style={styles.avatar} source={require('../assets/images/PFP.png')} />
              <View style={styles.names}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.role}>Administrator</Text>
              </View>
            </View>
    
            <View style={styles.emailContainer}>
              <Text style={styles.emailHeader}>Email</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 45, 
    backgroundColor: '#ccc',
  },
  names: {
    flexDirection: 'column',
    margin: 10,
  },
  name: {
    fontWeight: 700,
    fontSize: 20,
  },
  role: {
    fontWeight: 500,
    fontSize: 12,
    color: "#929292",
  },
  emailContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  emailHeader: {
    fontWeight: 700,
    fontSize: 14,
    paddingBottom: 4,
  },
  email: {
    fontWeight: 700,
    fontSize: 14,
  },
});

