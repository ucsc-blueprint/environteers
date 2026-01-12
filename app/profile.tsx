import { Text, View, StyleSheet, Image } from "react-native";
import { Button } from "@/components/Button";

export default function Profile() {

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello
        <Text style={{ fontWeight: "bold" }}> Name</Text>
      </Text>

      <View style={styles.profilePicContainer}>
        <Image
          style={styles.profilePic}
        />
      </View>

      <Text style={styles.infoText}>
        Great work, you&apos;ve participated in 
        <Text style={{ fontWeight: "bold" }}> 12 </Text> 
        eco-actions so far!
      </Text>

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <Button label="Eco Action History" style={styles.button} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button label="Achievements" style={styles.button} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button label="Upcoming" style={styles.button} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: "left",
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#ccc",
  },
  infoText: {
    fontSize: 20,
    marginBottom: 30,
    paddingHorizontal: 35,
  },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    width: "100%",
  },
  buttonWrapper: {
    width: "100%"
  },
  button: {
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    minHeight: 115
  }
});
