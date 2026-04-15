import React from 'react';
import {AdminNewsAddForm} from '@/components/AdminNewsAddForm';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';

export default function AdminNewsAddFormView(){
    const { profile, loading } = useAuth();
    if (loading) {
        return <ActivityIndicator size="large" color="#000000" />
    }
    if (!profile) {
        return <Redirect href="/" />
    }
    if (!profile.is_admin) {
        return <Redirect href="/(tabs)/volunteer" />
    }
    return(
        <AdminNewsAddForm />
    )
}
