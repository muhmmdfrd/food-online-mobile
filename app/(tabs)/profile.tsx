import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useAuth, useCart } from "../context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { Colors } from "@/constants/Colors";
import ProfileImage from "@/components/ProfileImage";
import { router } from "expo-router";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { User } from "@/models/user";
import { useQuery } from "@tanstack/react-query";
import { getById } from "@/services/UserService";

const ProfileScreen = () => {
  const { user: current, logout } = useAuth();
  const { clearCart } = useCart();

  const { data: user } = useQuery<ApiResponse<User>, string, User>({
    queryKey: ["get-user-by-id", current?.id],
    queryFn: async () => await getById(current?.id ?? 0),
    select: (response) => {
      return response.data;
    },
    refetchOnMount: true,
  });

  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <SafeAreaThemedView
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.editIcon}>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/profile/update",
              });
            }}
          >
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={32}
              color={"white"}
            />
          </TouchableOpacity>
        </View>
        <ProfileImage code={user?.code} styles={styles.profileImage} />
        <ThemedText style={styles.profileName}>{user?.name}</ThemedText>
        <View
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 16,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            paddingVertical: 8,
            marginTop: 12,
          }}
        >
          <ThemedText style={styles.badgeText}>
            {user?.roleName ?? "-"}
          </ThemedText>
        </View>
      </View>

      <View style={{ backgroundColor: colors.background, height: "100%" }}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="email"
              size={24}
              style={styles.icon}
            />
            <View style={styles.infoText}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <ThemedText style={styles.value}>{user?.email ?? "-"}</ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="phone"
              size={24}
              style={styles.icon}
            />
            <View style={styles.infoText}>
              <ThemedText style={styles.label}>Phone</ThemedText>
              <ThemedText style={styles.value}>
                {user?.phoneNumber ?? "-"}
              </ThemedText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            Alert.alert("Confirmation", "Are you sure want to logout?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  logout();
                  clearCart();
                },
              },
            ]);
          }}
        >
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 20,
    height: "30%",
  },
  editIcon: {
    position: "absolute",
    right: 22,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  profileName: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  badgeText: {
    color: "#EC7332",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 16,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginBottom: 20,
    marginTop: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 1,
    backgroundColor: "white",
    elevation: 12,
  },
  icon: {
    alignContent: "center",
    marginRight: 12,
    color: "#A8C2E0",
  },
  infoText: {
    flexDirection: "column",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "black",
  },
  logoutButton: {
    paddingVertical: 15,
    borderRadius: 30,
    marginHorizontal: 24,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
