import { EditEcoAction } from '@/components/EditEcoAction';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function AdminEditEcoAction() {
  const { typeOfAction } = useLocalSearchParams<{ typeOfAction: string }>();
  const { id } = useLocalSearchParams();

  return <EditEcoAction typeOfAction={typeOfAction} id={id as string} />;
}
