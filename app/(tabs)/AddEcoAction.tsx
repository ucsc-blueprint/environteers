import { AdminAddEcoAction } from '@/components/AdminAddEcoAction';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function AddEcoAction() {
  const { typeOfAction } = useLocalSearchParams<{ typeOfAction: string }>();

  return <AdminAddEcoAction typeOfAction={typeOfAction} />;
}
