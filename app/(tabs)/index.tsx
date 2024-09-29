import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StyleProp,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FAB } from "react-native-paper";
import { useAuth } from "../context";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useQuery } from "@tanstack/react-query";
import { getMenu, getMerchant } from "@/services";
import { PagingRequest } from "@/models/requests/PagingRequest";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { Merchant } from "@/models/merchant";
import { PagingResponse } from "@/models/responses/PagingResponse";
import { Menu } from "@/models/menu";
import { StringHelper } from "@/helpers";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "expo-router";

const page: PagingRequest = {
  current: 1,
  size: 100,
  sortName: "id",
  sortDir: "asc",
};

const menuPage: PagingRequest & { merchantId?: number } = {
  current: 1,
  size: 100,
  sortName: "id",
  sortDir: "asc",
};

const HomeScreen = () => {
  const { data: merchants = [], error } = useQuery<
    ApiResponse<PagingResponse<Merchant[]>>,
    string,
    Merchant[]
  >({
    queryKey: ["merchant"],
    queryFn: async () => await getMerchant(page),
    select: (response) => {
      return response.data.data;
    },
  });

  const { data: menus = [] } = useQuery<
    ApiResponse<PagingResponse<Menu[]>>,
    string,
    Menu[]
  >({
    queryKey: ["menu", menuPage],
    queryFn: async () => await getMenu(menuPage),
    select: (response) => {
      return response.data.data;
    },
  });

  const [selectedMerchant, setSelectedMerchant] = useState<Merchant>();
  const [defaultMerchant] = useState<Merchant>({
    id: 0,
    name: "Select merchant",
  });

  const { user } = useAuth();
  const navigation = useNavigation();

  const color = useThemeColor({ light: "black", dark: "white" }, "text");

  const getPickerStyles = (color: string): StyleProp<any> => {
    return {
      height: 50,
      width: "100%",
      marginBottom: 20,
      color: color,
    };
  };

  return (
    <SafeAreaThemedView style={styles.safeArea}>
      <ThemedView style={styles.container}>
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
          style={getPickerStyles(color)}
          onValueChange={(itemValue) => {
            setSelectedMerchant(itemValue);

            if (itemValue !== defaultMerchant) {
              menuPage.merchantId = itemValue.id;
            } else {
              menuPage.merchantId = undefined;
            }
          }}
        >
          <Picker.Item label={defaultMerchant.name} value={defaultMerchant} />
          {merchants?.map((merchant) => (
            <Picker.Item
              label={merchant.name}
              value={merchant}
              key={merchant.id}
            />
          ))}
        </Picker>

        <ScrollView style={styles.menuList}>
          {menus.map((item) => (
            <ThemedView key={item.id} style={styles.menuItem}>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.menuImage}
              />
              <ThemedView style={styles.menuInfo}>
                <ThemedText style={styles.menuName}>{item.name}</ThemedText>
                <ThemedText style={styles.menuPrice}>
                  {StringHelper.currencyFormat(item.price)}
                </ThemedText>
                <ThemedText style={styles.menuDescription}>
                  {item.merchantName}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ScrollView>

        <FAB
          color="black"
          style={styles.fab}
          icon="cart"
          // @ts-ignore
          onPress={() => navigation.navigate("cart/cart")}
        />
      </ThemedView>
    </SafeAreaThemedView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  menuPrice: {
    fontSize: 16,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  qtyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
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
