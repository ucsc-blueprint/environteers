import React from 'react';
import { FlatList, View } from 'react-native';
import { AdminFeedbackCard, AdminFeedbackCardProps } from './AdminFeedbackCard';

interface AdminFeedbackListProps {
  data: AdminFeedbackCardProps[];
}

export const AdminFeedbackList = ({ data }: AdminFeedbackListProps) => {
  return (
    <FlatList
      style={{width: '100%', marginTop: 10}}
      data={data}
      scrollEnabled={false}
      keyExtractor={(item, index) => `${item.user_id}-${index}`}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 12 }}>
          <AdminFeedbackCard {...item} />
        </View>
      )}
    />
  );
};