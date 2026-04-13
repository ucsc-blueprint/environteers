import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { supabase } from '@/constants/supabase';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';



export default function AdminDashboard() {
  const router = useRouter();

  const [activeUsers, setActiveUsers] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
    setLoading(true); 

    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setActiveUsers(count ?? 0);
    }

    setLoading(false); 
  };

  fetchUsers();
}, []);

return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={{ flexGrow: 1 }}
  >
    <View style={styles.dashboardContainer}>
      <View style={styles.gridContainer}>

        {/* Active Users */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Active users</Text>
          </View>

          <View style={styles.numberContainer}>
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.numberText}>{activeUsers}</Text>
            )}

            <View style={{ marginLeft: 8, alignItems: 'center' }}>
              <TrendingUp size={16} color="#22c55e" />
              <Text style={{ fontSize: 10, color: '#22c55e' }}>+20%</Text>
            </View>
          </View>

          <Pressable
            style={styles.subtitleContainer}
            onPress={() => router.push('/(tabs)/VolunteerView')}
          >
            <Text style={styles.subtitleText}>See all users</Text>
          </Pressable>
        </View>

        {/* Events */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Events this month</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>64</Text>

            <View style={{ marginLeft: 8, alignItems: 'center' }}>
              <TrendingUp size={16} color="#22c55e" />
              <Text style={{ fontSize: 10, color: '#22c55e' }}>+20%</Text>
            </View>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>See all events</Text>
          </View>
        </View>

        {/* Monthly Online Eco-Actions */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Monthly online eco-actions</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>64</Text>

            <View style={{ marginLeft: 8, alignItems: 'center' }}>
              <TrendingDown size={16} color="#ef4444" />
              <Text style={{ fontSize: 10, color: '#ef4444' }}>-10%</Text>
            </View>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>See all eco-actions</Text>
          </View>
        </View>

        {/* Monthly In-Person Eco-Actions */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Monthly in-person eco-actions</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>64</Text>

            <View style={{ marginLeft: 8, alignItems: 'center' }}>
              <TrendingUp size={16} color="#22c55e" />
              <Text style={{ fontSize: 10, color: '#22c55e' }}>+20%</Text>
            </View>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>See all eco-actions</Text>
          </View>
        </View>

        {/* Newsletter Subscriptions */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Newsletter subscriptions</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>64</Text>

            <View style={{ marginLeft: 8, alignItems: 'center' }}>
              <TrendingUp size={16} color="#22c55e" />
              <Text style={{ fontSize: 10, color: '#22c55e' }}>+20%</Text>
            </View>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>See newsletters</Text>
          </View>
        </View>

        {/* Newsletter Reads */}
        <View style={styles.gridBox}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Newsletter reads</Text>
          </View>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>64</Text>

            <View style={{ marginLeft: 8, alignItems: 'center' }}>
              <TrendingUp size={16} color="#22c55e" />
              <Text style={{ fontSize: 10, color: '#22c55e' }}>+20%</Text>
            </View>
          </View>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>See newsletters</Text>
          </View>
        </View>

      </View>
    </View>
  </ScrollView>
);
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

dashboardContainer: {
  flex: 1,
  marginTop: 20,
  marginHorizontal: 16,
  marginBottom: 20,
  backgroundColor: '#f5f5f5',
  borderRadius: 16,
  padding: 20,

  

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

  gridContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between' as const,
  },

gridBox: {
  width: '48%',
  height: 112,
  backgroundColor: '#ffffff',
  borderRadius: 8,
  padding: 12,
  justifyContent: 'center',
  alignItems: 'center', 
  marginBottom: 16,

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},

titleContainer: {
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center', 
},

titleText: {
  fontFamily: 'Mulish',
  fontWeight: '400',
  fontSize: 12,
  textAlign: 'center', 
  color: '#666',
},

numberContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', 
  marginTop: 4,
},

  numberText: {
    fontFamily: 'Mulish',
    fontWeight: '700' as const,
    fontSize: 24,
    color: '#172A36',
  },

subtitleContainer: {
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center', 
  marginTop: 4,
},

subtitleText: {
  fontFamily: 'Mulish',
  fontWeight: '400',
  fontSize: 10,
  textAlign: 'center', 
  color: '#999',
},
} as const;