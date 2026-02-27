import React from 'react';
import {AdminNewsUpdateForm} from '@/components/AdminNewsUpdateForm';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function AdminNewsUpdateFormView(){
    const { profile, loading } = useAuth();
    if (loading) {
        return <ActivityIndicator size="large" color="#000000" />
    }
    if (!profile || !profile?.is_admin) {
        return <Redirect href="/(tabs)/home" />
    }
    return(
        <AdminNewsUpdateForm />
    )
}