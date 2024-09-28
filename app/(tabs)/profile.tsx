import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, Alert, StyleSheet, Text } from "react-native";
import { useAuth } from "../context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";

const ProfileScreen = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          await logout();
          console.log("User logged out");
        },
      },
    ]);
  };

  const [bio, setBio] = useState<string>("test");

  const { user } = useAuth();

  useEffect(() => {
    const arr: string[] = [];
    // if (user?.positionName) {
    arr.push("CEO");
    // }

    // if (user?.roleName) {
    arr.push("Sysadmin");
    // }

    const result = arr.join(" | ");
    setBio(result);
  }, []);

  return (
    <SafeAreaThemedView style={styles.container}>
      <ThemedView style={styles.profileContainer}>
        {/* Foto Profil */}
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.profileImage}
        />

        {/* Informasi Singkat User */}
        <ThemedText style={styles.userName}>{user?.name}</ThemedText>
        <ThemedText style={styles.userBio}>{bio}</ThemedText>

        {/* Tombol Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 75,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 10,
  },
  userBio: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: "#ff5c5c",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  logoutButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
