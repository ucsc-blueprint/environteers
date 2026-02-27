import { Text, TextInput, FlatList, Pressable, View, StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";
import { NewsUpdate } from "@/components/NewsUpdate";
import { DeleteNewsConfirmationModal } from "@/components/DeleteNewsConfirmationModal";
import { WebView } from "react-native-webview";
import DropDownPicker from 'react-native-dropdown-picker'
import {supabase} from "@/constants/supabase";
import { Ionicons } from "@expo/vector-icons"; //"filter-outline" dropdown and "menu-outline" menu icon
import Toast from 'react-native-toast-message';
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const includesText = (str: string, search: string) =>

  str.toLowerCase().includes(search.toLowerCase());

const parseDate = (dateStr: string) => new Date(dateStr);

const includesDate = (dateStr: string, filter: 'week' | '2weeks' | 'month' | 'all') => {
  if (filter === 'all') return true;
  const date = parseDate(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (filter === 'week') return diffDays <= 7;
  if (filter === '2weeks') return diffDays <= 14;
  if (filter === 'month') return diffDays <= 30;
  return false;
}

export interface newsLetterItem{
  newsletter_id: string;
  edition_number: string;
  date: string;
  preview_image: string;
  link: string;
}

export const NewsView = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const router = useRouter();
  const [newsLetters, setNewsLetters] = useState<newsLetterItem[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDateLength, setFilterDateLength] = useState< 'week' | '2weeks' | 'month' | 'all' >('all');
  const [refreshing, setRefreshing] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<newsLetterItem | null>(null);

  const fetchNewsletters = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*');

      if (error) {
        console.error(error);
        return;
      }

      setNewsLetters(data ?? []);
  };

  const handleOpenDeleteModal = (newsletter: newsLetterItem) => {
    setSelectedNewsletter(newsletter);
    setDeleteModalVisible(true);
  }

  const handleDelete = async () => {
    if (!selectedNewsletter) return;

    const success = await deleteNewsletter(selectedNewsletter.newsletter_id);
    setDeleteModalVisible(false);
    setSelectedNewsletter(null);

    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Newsletter deleted',
        text2: 'Users can no longer see this newsletter on their feed.'
      })
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete newsletter',
        text2: 'Please try again later.'
      })
    }
  }

  const deleteNewsletter = async (newsletter_id: string) => {
    try {
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("newsletter_id", newsletter_id)

        if (error) {
            console.error("Error deleting newsletter:", error);
            return false;
        }

        setNewsLetters((prev) => prev.filter((n) => n.newsletter_id !== newsletter_id));

        return true;
    } catch (error) {
        console.error("Unexpected error:", error);
        return false;
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchNewsletters();
    }, [])
  );

  const filteredNewsletters = newsLetters.filter((n) =>
    (includesText(`Environteers Weekly Update: ${n.edition_number}th Edition`, searchText))&& (includesDate(n.date, filterDateLength))
  );
  //displaying webview of a newsletter
  if (activeUrl) {
    return (
      <View style={{ flex: 1 }}>
        <Pressable
          onPress={() => setActiveUrl(null)}
          style={{ padding: 12, backgroundColor: "#eee" }}
        >
          <Text>← Back</Text>
        </Pressable>

        <WebView
          source={{ uri: activeUrl }}
          style={{ flex: 1 }}
          startInLoadingState = {true}
        />
      </View>
    );
  }
  //displaying list of newsletters
  return (
    <View style={{ flex: 1 }}>

      <Ionicons name = "menu-outline" size = {30} style = {{marginTop: 8, marginLeft: 8}} />
      {isAdmin ? (
        <>
          <Text style = {{marginTop: 8, marginBottom: 4, marginLeft: 12, fontWeight: "bold", fontSize: 30}}>Manage Newsletters</Text>
          <Text style = {{marginBottom: 12, marginLeft: 12, fontSize: 16, color: "#79B128"}}>Add, edit, and delete</Text>
        </>
      ) : (
        <Text style = {{marginTop: 8, marginBottom :12, marginLeft : 12, fontWeight: "bold", fontSize: 30}}> Weekly Updates</Text>
      )}
      
        <TextInput
          placeholder="Search newsletters"
          placeholderTextColor="#999"
          style={styles.search}
          value={searchText}
          onChangeText={setSearchText}
        />

      <View style = {{flexDirection: 'row', marginLeft: 12}}>
        <Ionicons style = {{marginTop: 14, marginRight: 4, marginLeft: 4}}name = "filter-outline" size = {24}/>
        <DropDownPicker
          open={filterOpen}
          setOpen = {setFilterOpen}
          value={filterDateLength}
          setValue={setFilterDateLength}
  
          items={[
            { label: 'Past Week', value: 'week' },
            { label: 'Past 2 Weeks', value: '2weeks' },
            { label: 'Past Month', value: 'month' },
            { label: 'Any', value: 'all' },

          ]}
          style={styles.filter}
          dropDownContainerStyle= {styles.dropDownContainerStyle}
          
          >

          </DropDownPicker>
      </View>
      
      <FlatList
        style={{ marginVertical: 10 }}
        data={filteredNewsletters}
        keyExtractor={(item) => item.newsletter_id}
        contentContainerStyle={{ padding: 16 }}
        onRefresh={fetchNewsletters}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <NewsUpdate
            title={`Environteers Weekly Update: ${item.edition_number}th Edition`}
            date={item.date}
            previewImage={item.preview_image}
            adminView={isAdmin}
            onPress={() => setActiveUrl(item.link)}
            onDelete={() => handleOpenDeleteModal(item)}
            onEdit={() => console.log("Edit button pressed")}
          />
        )}
      />

      {isAdmin  && (
        <>
          <Pressable 
            style={styles.addNewsletterButton} 
            onPress={() => router.push({
              pathname: '/(tabs)/AdminNewsUpdateFormView'
            })}>
            <Text style={styles.addNewsletterButtonText}>+ Add</Text>
          </Pressable>
    
          <DeleteNewsConfirmationModal 
            visible={deleteModalVisible} 
            onCancel={() => {
              setDeleteModalVisible(false);
              setSelectedNewsletter(null);
            }} 
            onConfirm={handleDelete} 
            newsletterTitle={
              selectedNewsletter
              ? `Environteers Weekly Update: ${selectedNewsletter.edition_number}th Edition`
              : "Selected newsletter"
            } 
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    width: "90%",
    alignSelf: "center",
    borderColor: "#151414",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  dropDownContainerStyle: {
    width: "50%",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#151414",
  },
  filter: {
    width: "50%",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#151414",
    backgroundColor: "transparent",
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
  }
});
