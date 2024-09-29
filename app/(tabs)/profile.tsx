import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, Alert, StyleSheet, Text } from "react-native";
import { useAuth } from "../context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { StorageHelper } from "@/helpers";
import { Storage } from "@/constants/Storage";
import { logout } from "@/services";

const ProfileScreen = () => {
  const { logout: removeData, code } = useAuth();
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          if (code) {
            await logout(code);
            removeData();
          }
        },
      },
    ]);
  };
  const { user } = useAuth();

  return (
    <SafeAreaThemedView style={styles.container}>
      <ThemedView style={styles.profileContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.profileImage}
        />

        <ThemedText style={styles.userName}>{user?.name}</ThemedText>
        <ThemedText style={styles.userBio}>{""}</ThemedText>

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
