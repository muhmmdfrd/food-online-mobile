import React, { useState } from "react";
import { Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FAB } from "react-native-paper";
import { useAuth } from "../context";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const merchants = ["Merchant 1", "Merchant 2", "Merchant 3"];
const menuItems = [
  {
    id: 1,
    name: "Menu 1",
    description: "Delicious food",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "Menu 2",
    description: "Yummy drink",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    name: "Menu 3",
    description: "Tasty snack",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    name: "Menu 1",
    description: "Delicious food",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 5,
    name: "Menu 2",
    description: "Yummy drink",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 6,
    name: "Menu 3",
    description: "Tasty snack",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 7,
    name: "Menu 1",
    description: "Delicious food",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 8,
    name: "Menu 2",
    description: "Yummy drink",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 9,
    name: "Menu 3",
    description: "Tasty snack",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 10,
    name: "Menu 1",
    description: "Delicious food",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 11,
    name: "Menu 2",
    description: "Yummy drink",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 12,
    name: "Menu 3",
    description: "Tasty snack",
    image: "https://via.placeholder.com/100",
  },
];

const HomeScreen = () => {
  const [selectedMerchant, setSelectedMerchant] = useState(merchants[0]);

  const { user } = useAuth();

  return (
    <SafeAreaThemedView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedView style={styles.profile}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.profileImage}
            />
            <ThemedText style={styles.profileName}>{user?.name}</ThemedText>
          </ThemedView>
          <TouchableOpacity style={styles.notificationButton}>
            <ThemedText style={styles.notificationText}>🔔</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.divider} />

        <Picker
          selectedValue={selectedMerchant}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMerchant(itemValue)}
        >
          {merchants.map((merchant) => (
            <Picker.Item label={merchant} value={merchant} key={merchant} />
          ))}
        </Picker>

        <ScrollView style={styles.menuList}>
          {menuItems.map((item) => (
            <ThemedView key={item.id} style={styles.menuItem}>
              <Image source={{ uri: item.image }} style={styles.menuImage} />
              <ThemedView style={styles.menuInfo}>
                <ThemedText style={styles.menuName}>{item.name}</ThemedText>
                <ThemedText style={styles.menuDescription}>
                  {item.description}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ScrollView>

        <FAB
          color="black"
          style={styles.fab}
          icon="cart"
          onPress={() => console.log("Floating action button pressed")}
        />
      </ThemedView>
    </SafeAreaThemedView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationButton: {
    padding: 8,
  },
  notificationText: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
    color: "red",
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  menuImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  menuInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  menuName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "green",
  },
});

export default HomeScreen;
