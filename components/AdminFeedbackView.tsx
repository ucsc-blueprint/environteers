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

      if (error || !data || data.length === 0) {
        if (error) console.log('Error fetching feedback:', error);
        setFeedback([]);
        setLoadingFeedback(false);
        return;
      }

      // Collect unique IDs to batch-fetch
      const userIds = [...new Set(data.filter((i) => i.user_id).map((i) => i.user_id))];
      const eventIds = [...new Set(data.filter((i) => i.event_id).map((i) => i.event_id))];
      const inPersonIds = [
        ...new Set(data.filter((i) => i.inperson_ecoaction_id).map((i) => i.inperson_ecoaction_id)),
      ];
      const onlineIds = [
        ...new Set(data.filter((i) => i.online_ecoaction_id).map((i) => i.online_ecoaction_id)),
      ];

      const [usersRes, eventsRes, inPersonRes, onlineRes] = await Promise.all([
        userIds.length > 0
          ? supabase
              .from('users')
              .select('user_id, first_name, last_name, created_at')
              .in('user_id', userIds)
          : Promise.resolve({ data: [] }),
        eventIds.length > 0
          ? supabase.from('events').select('id, title').in('id', eventIds)
          : Promise.resolve({ data: [] }),
        inPersonIds.length > 0
          ? supabase.from('inperson_ecoactions').select('id, title').in('id', inPersonIds)
          : Promise.resolve({ data: [] }),
        onlineIds.length > 0
          ? supabase.from('online_ecoactions').select('id, title').in('id', onlineIds)
          : Promise.resolve({ data: [] }),
      ]);

      const userMap = Object.fromEntries(
        (usersRes.data ?? []).map((u: any) => [
          u.user_id,
          { name: `${u.first_name} ${u.last_name}`, membership: formatMembership(u.created_at) },
        ]),
      );
      const eventMap = Object.fromEntries((eventsRes.data ?? []).map((r: any) => [r.id, r.title]));
      const inPersonMap = Object.fromEntries(
        (inPersonRes.data ?? []).map((r: any) => [r.id, r.title]),
      );
      const onlineMap = Object.fromEntries((onlineRes.data ?? []).map((r: any) => [r.id, r.title]));

      const formatted = data.map((item) => {
        let eventName = '';
        if (item.event_id) eventName = eventMap[item.event_id] ?? '';
        else if (item.inperson_ecoaction_id)
          eventName = inPersonMap[item.inperson_ecoaction_id] ?? '';
        else if (item.online_ecoaction_id) eventName = onlineMap[item.online_ecoaction_id] ?? '';

        const user = userMap[item.user_id];

        return {
          event_name: eventName,
          user_name: user?.name || 'Unknown User',
          feedback_content: item.content,
          date: new Date(item.created_at),
          is_specific: false,
          membership: user?.membership || '',
          user_id: item.user_id,
        };
      });

      setFeedback(formatted);
      setLoadingFeedback(false);
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return <ActivityIndicator size='large' color='#000000' />;
  }

  if (!profile) {
    return <Redirect href='/' />;
  }

  if (!profile.is_admin) {
    return <Redirect href='/(tabs)/volunteer' />;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={styles.sortText}>Sorted by most recent</Text>

      {loadingFeedback ? (
        <ActivityIndicator size='large' color='#000000' />
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
