import React from 'react';
import { useRouter } from 'expo-router';
import { View, Pressable, Text, ScrollView } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export default function ContentEdit() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Manage content
        </Text>
        <Text style={styles.headerSubtitle}>
          Add, edit, and delete
        </Text>
      </View>

      <View style={styles.contentContainer}>
        
        <Pressable
          onPress={() => router.push('/(tabs)/volunteer')}
          style={styles.card}
        >
          <Text style={styles.cardText}>
            Manage events and eco-actions
          </Text>
          <ChevronRight color="#757575" />
        </Pressable>

        <Pressable
          onPress={() => router.push('/(tabs)/newsletter')}
          style={styles.card}
        >
          <Text style={styles.cardText}>
            Manage newsletters
          </Text>
          <ChevronRight color="#757575" />
        </Pressable>

      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerContainer: {
    backgroundColor: '#fff',
    marginTop: '15%',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10
  },

  headerTitle: {
    fontFamily: 'Mulish',
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#000',
  },

  headerSubtitle: {
    fontFamily: 'Mulish',
    fontSize: 18,
    color: '#79B128',
    marginTop: 4,
  },

  contentContainer: {
    marginTop: 20,
    backgroundColor: '#EAF2F6',
    padding: 20,
    flex: 1,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderColor: '#d5d5d5',
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },

  cardText: {
    fontFamily: 'Mulish',
    fontSize: 14,
    color: '#79B128',
  },

} as const;