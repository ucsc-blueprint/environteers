import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { send } from '@emailjs/react-native';
import { supabase } from "@/constants/supabase";
import { ChevronRight } from "lucide-react-native";
import { AdminApprove } from "@/components/AdminApprove";
import Toast from 'react-native-toast-message';


type Admin = {
  id: string;
  name: string;
  email: string;
};

export const AdminPendingView = () => {
  const [allAdmins, setAllAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [approveVisible, setApproveVisible] = useState(false);

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

  const handleApproval = async () => {
    if (selectedAdmin) {
      try {
        // Set is_admin to true for selected admin
        const { error } = await supabase
          .from("users")
          .update({ is_admin: true })
          .eq("user_id", selectedAdmin?.id);

        if (error) {
          Toast.show({
            type: 'error',
            text1: 'Failed to assign admin',
          });
        }
        // Send email to user confirming admin approval
        await send(
          process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID_APPROVED!,
          {
            from_email: selectedAdmin.email, // sender
            to_email: process.env.EXPO_PUBLIC_EMAIL, // receiver
          },
          {
            publicKey: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY!,
          }
        );
      } catch (err) {
        console.error('EmailJS Error:', err);
      }
    } else {
      console.log('Select an admin before proceeding.');
      return;
    }
    setApproveVisible(false)
  }

  const handleDelete = () => {
    setApproveVisible(false)
  }

  const handleCancel = () => {
    setApproveVisible(false)
  }

  return (
    <View style = {styles.container}>
      {/* pending list */}
      <FlatList
        data={allAdmins}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 28, gap: 24}}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View style={styles.title}>
                <Text style={styles.header}>Admin account request</Text>
                <Text>
                  For <Text style={styles.name}>{item.name}</Text>
                </Text>
              </View>
            </View>
            
            <Pressable
              style={styles.profileButton}
              onPress={() => {
                setSelectedAdmin(item);
                setApproveVisible(true)
              }}
            >
                <Text style={{color: '#0282d3'}}>See more</Text>
                <ChevronRight color={'#0282d3'} />
            </Pressable>
          </View>
        )}
      />

      <AdminApprove 
        visible={approveVisible}
        name={selectedAdmin?.name}
        onApprove={handleApproval}
        onDelete={handleDelete}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    width: '100%',
    flexDirection: 'row',
  },
  title: {
    justifyContent: 'flex-start'
  },
  name: {
    color: '#000000',
    fontWeight: 700,
    fontSize: 14,
  },
  header: {
    color: '#84bd00',
    fontWeight: 500,
    fontSize: 14,
  },
  profileButton: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  }
});

