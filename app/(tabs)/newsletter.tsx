import { Text, TextInput, FlatList, Pressable, View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { NewsUpdate } from "../../components/NewsUpdate";
import { WebView } from "react-native-webview";
import DropDownPicker from 'react-native-dropdown-picker'
import { Ionicons } from "@expo/vector-icons"; // for "filter-outline" on dropdown

const NEWSLETTERS = [
  {
    id: "5",
    title: "Environteers Weekly Update",
    editionNumber: 5,
    date: "01/12/2026",
    link: "https://mailchi.mp/f61e915c4e8e/environteers-weekly-update?e=298d639b33",
    previewImage:
      "https://mcusercontent.com/37708d1720fdc287c7e9795e8/images/26f6c4d7-a555-2c70-cc48-17dbcf267087.jpeg",
  },
  {
    id: "6",
    title: "Environteers Weekly Update",
    editionNumber: 6,
    date: "01/13/2026",
    link: "https://mailchi.mp/f61e915c4e8e/environteers-weekly-update?e=298d639b33",
    previewImage:
      "https://mcusercontent.com/37708d1720fdc287c7e9795e8/images/544c89e1-15ec-67ef-b4fb-940556e00cbf.jpg",
  },
];

const includesText = (str: string, search: string) =>
  str.toLowerCase().includes(search.toLowerCase());

export default function Newsletter() {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDateLength, setFilterDateLength] = useState< 'week' | '2weeks' | 'month' | 'all' >('all');


  const filteredNewsletters = NEWSLETTERS.filter((n) =>
    includesText(n.title, searchText)
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
    <View>
      <Text style = {{marginTop: 20, marginBottom :14, marginLeft : 12, fontWeight: "bold", fontSize: 30}}> Weekly Updates</Text>
      
        <TextInput
          placeholder="Search newsletters"
          placeholderTextColor="#999"
          style={styles.search}
          value={searchText}
          onChangeText={setSearchText}
        />

      {/* dropdown filter */}
      <View style = {{flexDirection: 'row'}}>
        <Ionicons style = {{marginTop: 14, marginRight: 4}}name = "filter-outline" size = {24}/>
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <NewsUpdate
            title={item.title}
            editionNumber={item.editionNumber}
            date={item.date}
            previewImage={item.previewImage}
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
    width: "95%",
    alignSelf: "center",
    borderColor: "#151414",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
  },
  dropDownContainerStyle: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#151414",
    backgroundColor: "transparent",
    maxHeight: 160,
  },
   filter: {
      width: "50%",
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "#151414",
      backgroundColor: "transparent",
      paddingHorizontal: 16,
      paddingVertical: 10,
    }}
);
