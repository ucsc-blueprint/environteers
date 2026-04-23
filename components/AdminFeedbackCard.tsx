import React from 'react';
import { StyleSheet, Text, View, Pressable} from 'react-native';
import { useRouter } from 'expo-router';
import {ChevronRight} from 'lucide-react-native'

export interface AdminFeedbackCardProps {
  event_name: string,
  feedback_content: string,
  user_name: string | string[],
  date: Date,
  is_specific: boolean,
  // is_specific differentiates between general feedback list and feedback from one user
  membership: string | string[],
  user_id: string | string[]
}

export const AdminFeedbackCard = ({
  event_name,
  feedback_content,
  user_name,
  date,
  is_specific,
  membership,
  user_id
}: AdminFeedbackCardProps) => {
  const router = useRouter();
  const dateString = new Date(date).toLocaleDateString('en-US',
    {year: 'numeric', month: 'numeric', day: 'numeric'})
  
  return (
    <View style={styles.card}>
      <View style={{flexDirection: 'column', flex: 1}}>
        <View style={styles.title}>
          <Text style={styles.label}>
            For <Text style={styles.eventName}>{event_name}</Text>
            {!is_specific &&
             `, from ${user_name} on ${dateString}`}
          </Text>
        </View>
        <Text style={styles.feedback}>{feedback_content}</Text>
      </View>
      {!is_specific && <Pressable
        style={styles.profileButton}
        onPress={() => {
          router.push({
          pathname: '/(tabs)/admin-analytics',
          params: { volunteerName: user_name, membershipStatus: membership, volunteerID: user_id }
        })} }>
          <Text style={{color: '#0282d3'}}>See profile</Text>
          <ChevronRight color={'#0282d3'} />
      </Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    width: '100%',
    flexDirection: 'row',
  },
  title: {
    justifyContent: 'flex-start'
  },
  label: {
    color: '#000000',
    fontWeight: 500,
    fontSize: 14,
  },
  eventName: {
    color: '#84bd00',
    fontWeight: 500,
    fontSize: 14,
  },
  feedback: {
    flexShrink: 1,
    fontWeight: 300,
    marginTop: 4
  },
  profileButton: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  }
});