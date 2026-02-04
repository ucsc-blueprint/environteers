import { Text, TextInput, FlatList, Pressable, View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { NewsUpdate } from "../../components/NewsUpdate";
import { WebView } from "react-native-webview";

const NEWSLETTERS = [
  {
    id: "5",
    title: "Environteers Weekly Update",
    editionNumber: 5,
    date: "01/12/2026",
    link: "https://mailchi.mp/f61e915c4e8e/environteers-weekly-update?e=298d639b33",
    previewImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "6",
    title: "Environteers Weekly Update",
    editionNumber: 6,
    date: "01/13/2026",
    link: "https://mailchi.mp/f61e915c4e8e/environteers-weekly-update?e=298d639b33",
    previewImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60",
  },
];

const includesText = (str: string, search: string) =>
  str.toLowerCase().includes(search.toLowerCase());

export default function Newsletter() {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

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
    <View style={{ flex: 1 }}>
      <Text style = {{marginBottom :8, fontWeight: "bold"}}> Weekly Updates</Text>
      <TextInput
        placeholder="Search newsletters"
        placeholderTextColor="#999"
        style={styles.search}
        value={searchText}
        onChangeText={setSearchText}
      />

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
    width: "85%",
    alignSelf: "center",
    borderColor: "#151414",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
    marginTop: 24,
  },
});
