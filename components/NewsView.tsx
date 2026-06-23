import {
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { DeleteNewsConfirmationModal } from '@/components/DeleteNewsConfirmationModal';
import { WebView } from 'react-native-webview';
import { supabase } from '@/constants/supabase';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsSearchBar } from '@/components/NewsSearchBar';
import { NewsDateFilter } from '@/components/NewsDateFilterDropdown';
import { formatNewsletterDate, formatNewsletterTitle } from '@/utils/newsletter';

const includesText = (str: string, search: string) =>
  str.toLowerCase().includes(search.toLowerCase());

const parseDate = (dateStr: string) => new Date(dateStr);

const includesDate = (dateStr: string, filter: NewsDateFilter) => {
  if (filter === 'all') return true;
  const date = parseDate(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (filter === 'week') return diffDays <= 7;
  if (filter === '2weeks') return diffDays <= 14;
  if (filter === 'month') return diffDays <= 30;
  return false;
};

export interface newsLetterItem {
  newsletter_id: string;
  edition_number: string;
  date: string;
  preview_image: string;
  link: string;
  read_count?: number;
}

const logSubscriptionClick = async (userId: string) => {
  const { error } = await supabase
    .from('newsletter_subscription_clicks')
    .upsert(
      { user_id: userId, opened_at: new Date().toISOString() },
      { onConflict: 'user_id', ignoreDuplicates: true },
    );
  if (error) console.warn('[Supabase] subscription log failed:', error.message);
};

export const NewsView = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const router = useRouter();
  const [newsLetters, setNewsLetters] = useState<newsLetterItem[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterDateLength, setFilterDateLength] = useState<NewsDateFilter>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<newsLetterItem | null>(null);
  // newsletter subscription stuff below
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const [signupLoading, setSignupLoading] = useState(true);
  const { user } = useAuth();

  const SIGNUP_URL = 'https://mailchi.mp/114704938e0e/weekly-email-update-signup';

  const fetchNewsletters = useCallback(async (userRefresh = false) => {
    if (userRefresh) setRefreshing(true);

    const { data, error } = await supabase
      .from('news')
      .select('*, read_count:interaction_news(count)');

    if (error) {
      console.error(error);
      if (userRefresh) setRefreshing(false);
      return;
    }

    const mapped = (data ?? []).map((item: any) => ({
      ...item,
      read_count: item.read_count?.[0]?.count ?? 0,
    }));

    setNewsLetters(mapped);
    if (userRefresh) setRefreshing(false);
  }, []);

  const handleOpenDeleteModal = (newsletter: newsLetterItem) => {
    setSelectedNewsletter(newsletter);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedNewsletter) return;

    const success = await deleteNewsletter(selectedNewsletter.newsletter_id);
    setDeleteModalVisible(false);
    setSelectedNewsletter(null);

    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Newsletter deleted',
        text2: 'Users can no longer see this newsletter on their feed.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete newsletter',
        text2: 'Please try again later.',
      });
    }
  };

  const deleteNewsletter = async (newsletter_id: string) => {
    try {
      const newsletter = newsLetters.find((n) => n.newsletter_id === newsletter_id);

      const { error } = await supabase.from('news').delete().eq('newsletter_id', newsletter_id);

      if (error) {
        console.error('Error deleting newsletter:', error);
        return false;
      }

      if (newsletter?.preview_image) {
        const url = newsletter.preview_image;
        const filePath = decodeURIComponent(url.split('/news-images/')[1]);
        const { error: storageError } = await supabase.storage
          .from('news-images')
          .remove([filePath]);

        if (storageError) {
          console.error('Failed to delete preview image:', storageError);
        }
      }

      setNewsLetters((prev) => prev.filter((n) => n.newsletter_id !== newsletter_id));
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  const handleCancel = () => {
    setDeleteModalVisible(false);
    setSelectedNewsletter(null);
  };

  useFocusEffect(
    useCallback(() => {
      fetchNewsletters();
    }, [fetchNewsletters]),
  );

  const filteredNewsletters = newsLetters
    .filter(
      (n) =>
        includesText(formatNewsletterTitle(n.edition_number), searchText) &&
        includesDate(n.date, filterDateLength),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderNewsCard = (item: newsLetterItem) => (
    <NewsCard
      key={item.newsletter_id}
      newsId={item.newsletter_id}
      title={formatNewsletterTitle(item.edition_number)}
      date={formatNewsletterDate(item.date)}
      previewImage={item.preview_image}
      adminView={isAdmin}
      readCount={isAdmin ? item.read_count : undefined}
      onPress={() => setActiveUrl(item.link)}
      onDelete={() => handleOpenDeleteModal(item)}
      onEdit={() => {
        router.push({
          pathname: '/(tabs)/AdminNewsEditFormView',
          params: { id: item.newsletter_id },
        });
      }}
    />
  );

  if (activeUrl) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Pressable
          onPress={() => setActiveUrl(null)}
          style={{ padding: 12, backgroundColor: '#eee' }}
        >
          <Text>← Back</Text>
        </Pressable>
        <WebView source={{ uri: activeUrl }} style={{ flex: 1 }} startInLoadingState={true} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      {isAdmin ? (
        <View style={styles.adminContainer}>
          <View style={styles.adminHeaderContainer}>
            <Text style={styles.adminHeaderTitle}>Manage Newsletters</Text>
            <Text style={styles.adminHeaderSubtitle}>Add, edit, and delete</Text>
          </View>

          <View style={styles.adminContentContainer}>
            <ScrollView
              style={styles.listScroll}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => fetchNewsletters(true)} />
              }
            >
              <NewsSearchBar
                search={searchText}
                setSearch={setSearchText}
                filterDateLength={filterDateLength}
                setFilterDateLength={setFilterDateLength}
                adminStyle
              />
              {filteredNewsletters.map(renderNewsCard)}
            </ScrollView>

            <Pressable
              style={styles.addNewsletterButton}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/AdminNewsAddFormView',
                })
              }
            >
              <Text style={styles.addNewsletterButtonText}>+ Add</Text>
            </Pressable>

            <DeleteNewsConfirmationModal
              visible={deleteModalVisible}
              onCancel={handleCancel}
              onConfirm={handleDelete}
              newsletterTitle={
                selectedNewsletter
                  ? formatNewsletterTitle(selectedNewsletter.edition_number)
                  : 'Selected newsletter'
              }
            />
          </View>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => fetchNewsletters(true)} />
            }
          >
            <Text style={styles.title}>Weekly Updates</Text>
            <NewsSearchBar
              search={searchText}
              setSearch={setSearchText}
              filterDateLength={filterDateLength}
              setFilterDateLength={setFilterDateLength}
            />
            {filteredNewsletters.map(renderNewsCard)}
          </ScrollView>

          <Pressable
            style={styles.subscribeFab}
            onPress={() => {
              if (!user) return;
              logSubscriptionClick(user.id);
              setSignupLoading(true);
              setSignupModalVisible(true);
            }}
          >
            <Ionicons name='mail' size={24} color='#fff' />
          </Pressable>
        </View>
      )}

      <Modal
        visible={signupModalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={() => setSignupModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Subscribe to Newsletter</Text>
            <Pressable onPress={() => setSignupModalVisible(false)} style={styles.modalCloseBtn}>
              <Ionicons name='close' size={20} color='#555' />
            </Pressable>
          </View>
          {signupLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size='large' color='#57801d' />
            </View>
          )}
          <WebView
            source={{ uri: SIGNUP_URL }}
            style={{ flex: 1 }}
            onLoadStart={() => setSignupLoading(true)}
            onLoadEnd={() => setSignupLoading(false)}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  adminContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  adminHeaderContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  adminHeaderTitle: {
    fontFamily: 'Mulish',
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  adminHeaderSubtitle: {
    fontFamily: 'Mulish',
    fontSize: 18,
    color: '#79B128',
    marginTop: 4,
  },
  adminContentContainer: {
    flex: 1,
    backgroundColor: '#EAF2F6',
    paddingTop: 8,
  },
  listContainer: {
    flex: 1,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  title: {
    color: 'black',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  addNewsletterButton: {
    position: 'absolute',
    bottom: 15,
    right: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#94C153',
    height: 35,
    width: 80,
  },
  addNewsletterButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  subscribeFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#57801d',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: 57,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
