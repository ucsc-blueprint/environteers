import { Text, TextInput, FlatList, Pressable, View, StyleSheet } from "react-native";
import React, { useState, useEffect} from "react";
import { NewsUpdate } from "../../components/NewsUpdate";
import { WebView } from "react-native-webview";
import DropDownPicker from 'react-native-dropdown-picker'
import {supabase} from "@/constants/supabase";
import { Ionicons } from "@expo/vector-icons"; //"filter-outline" dropdown and "menu-outline" menu icon


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
  title: string;
  date: string;
  preview_image: string;
  link: string;
}


export default function Newsletter() {
  const [newsLetters, setNewsLetters] = useState<newsLetterItem[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDateLength, setFilterDateLength] = useState< 'week' | '2weeks' | 'month' | 'all' >('all');


  useEffect(() => {
    const fetchNewsletters = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*');

      if (error) {
        console.error(error);
        return;
      }

      setNewsLetters(data ?? []);
      console.log("Fetched newsletters:", data);
    };

    fetchNewsletters();
    }, []);

  const filteredNewsletters = newsLetters.filter((n) =>
    (includesText(n.title, searchText))&& (includesDate(n.date, filterDateLength))
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
      <Text style = {{marginTop: 8, marginBottom :12, marginLeft : 12, fontWeight: "bold", fontSize: 30}}> Weekly Updates</Text>
      
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
        data={filteredNewsletters}
        keyExtractor={(item) => item.newsletter_id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <NewsUpdate
            title={item.title}
            date={item.date}
            previewImage={item.preview_image}
            onPress={() => setActiveUrl(item.link)}
          />
        )}
      />
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
    }}
);
