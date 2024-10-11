import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { useAuth } from "../context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarActiveTintColor: colors.tabIconSelected,
        header: () => {
          return (
            <SafeAreaThemedView style={styles.safearea}>
              <ThemedView style={styles.header}>
                <ThemedView style={styles.profile}>
                  <Image
                    source={{ uri: "https://via.placeholder.com/50" }}
                    style={styles.profileImage}
                  />
                  <ThemedText style={styles.profileName}>
                    {user?.name}
                  </ThemedText>
                </ThemedView>
                <TouchableOpacity style={styles.notificationButton}>
                  <ThemedText style={styles.notificationText}>
                    <MaterialCommunityIcons
                      name="bell"
                      size={24}
                      color={"black"}
                    />
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </SafeAreaThemedView>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "storefront" : "storefront-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "My Orders",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "restaurant" : "restaurant-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="list-order"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bag-handle" : "bag-handle-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safearea: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    elevation: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});
