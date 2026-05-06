import React from 'react';
import { ScrollView, Text, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { AdminFeedbackList } from '@/components/AdminFeedbackList';
import { formatMembership } from './AdminVolunteersView';
import { supabase } from '@/constants/supabase';

export default function AdminFeedbackView() {
  const { profile, loading } = useAuth();

  const [feedback, setFeedback] = React.useState<any[]>([]);
  const [loadingFeedback, setLoadingFeedback] = React.useState(true);

  React.useEffect(() => {
    const fetchFeedback = async () => {
      setLoadingFeedback(true);

      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching feedback:', error);
        setFeedback([]);
        setLoadingFeedback(false);
        return;
      }

      if (!data || data.length === 0) {
        setFeedback([]);
        setLoadingFeedback(false);
        return;
      }

      const formatted: any[] = [];

      for (const item of data) {
        let eventName = '';
        let userName = '';
        let membership = '';

        if (item.user_id) {
          const { data: user } = await supabase
            .from('users')
            .select('first_name, last_name, created_at')
            .eq('user_id', item.user_id)
            .single();

          if (user) {
            userName = `${user.first_name} ${user.last_name}`;
            membership = formatMembership(user.created_at);
          }
        }

        if (item.event_id) {
          const { data: event } = await supabase
            .from('events')
            .select('title')
            .eq('id', item.event_id)
            .single();

          if (event) {
            eventName = event.title;
          }
        }
        else if (item.inperson_ecoaction_id) {
          const { data: inperson } = await supabase
            .from('inperson_ecoactions')
            .select('title')
            .eq('id', item.inperson_ecoaction_id)
            .single();

          if (inperson) {
            eventName = inperson.title;
          }
        }
        else if (item.online_ecoaction_id) {
          const { data: online } = await supabase
            .from('online_ecoactions')
            .select('title')
            .eq('id', item.online_ecoaction_id)
            .single();

          if (online) {
            eventName = online.title;
          }
        }

        formatted.push({
          event_name: eventName,
          user_name: userName || 'Unknown User',
          feedback_content: item.content,
          date: new Date(item.created_at),
          is_specific: false,
          membership: membership,
          user_id: item.user_id,
        });
      }

      setFeedback(formatted);
      setLoadingFeedback(false);
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000000" />;
  }

  if (!profile) {
    return <Redirect href="/" />;
  }

  if (!profile.is_admin) {
    return <Redirect href="/(tabs)/volunteer" />;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>

      <Text style={styles.sortText}>
        Sorted by most recent
      </Text>

      {loadingFeedback ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : feedback.length > 0 ? (
        <AdminFeedbackList data={feedback} />
      ) : (
        <Text>No feedback yet</Text>
      )}

    </ScrollView>
  );
}

const styles = {
  sortText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#777',
  },
} as const;