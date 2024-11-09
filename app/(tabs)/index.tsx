import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  useColorScheme,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FAB } from "react-native-paper";
import { useCart } from "../context";
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
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import MenuImage from "@/components/MenuImage";
import Loading from "@/components/Loading";

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
  const { data: merchants = [] } = useQuery<
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

  const {
    data: menus = [],
    isLoading: loadingMenu,
    isError: isErrorMenu,
    error: errorMenu,
    refetch,
  } = useQuery<ApiResponse<PagingResponse<Menu[]>>, string, Menu[]>({
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

  const { cartItems } = useCart();

  const scheme = useColorScheme();
  const primaryColor = Colors[scheme ?? "light"].primary;

  const getItemQuantityInCart = (menuId: number) => {
    const itemInCart = cartItems.find((item) => item.menuId === menuId);
    return itemInCart ? itemInCart.qty : 0;
  };

  if (isErrorMenu) {
    Alert.alert("Error", errorMenu ?? "Error while fetching menu.");
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.picker}>
        <Picker
          selectedValue={selectedMerchant}
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
      </ThemedView>

      {loadingMenu ? (
        <Loading
          styles={{
            height: "75%",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      ) : (
        <ScrollView
          style={styles.menuList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loadingMenu}
              onRefresh={() => {
                refetch();
              }}
            />
          }
        >
          {menus.map((item) => {
            const itemQuantity = getItemQuantityInCart(item.id);
            return (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: "/menu/detail",
                    params: {
                      menuId: item.id,
                    },
                  })
                }
              >
                <ThemedView style={styles.menuItem}>
                  <MenuImage
                    code={item.code}
                    size={100}
                    styles={styles.menuImage}
                  />
                  <ThemedView style={styles.menuInfo}>
                    <ThemedText style={styles.menuName}>{item.name}</ThemedText>
                    <ThemedText style={styles.menuDescription}>
                      {item.merchantName}
                    </ThemedText>
                    <ThemedText style={styles.menuPrice}>
                      {StringHelper.currencyFormat(item.price)}
                    </ThemedText>
                  </ThemedView>
                  {itemQuantity > 0 && (
                    <View
                      style={[
                        styles.quantityIndicator,
                        { backgroundColor: primaryColor },
                      ]}
                    >
                      <ThemedText style={styles.qtyText}>
                        {itemQuantity}
                      </ThemedText>
                    </View>
                  )}
                </ThemedView>
              </TouchableWithoutFeedback>
            );
          })}
        </ScrollView>
      )}

      {cartItems.length <= 0 ? (
        <FAB
          color={primaryColor}
          style={[styles.fab, { backgroundColor: "#F0925F" }]}
          icon="cart-outline"
          onPress={() => router.push("/cart/cart")}
        />
      ) : (
        <FAB
          color={primaryColor}
          label={cartItems.length.toString()}
          style={[styles.fab, { backgroundColor: "#F0925F" }]}
          icon="cart-outline"
          onPress={() => router.push("/cart/cart")}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    marginBottom: 15,
    position: "relative",
  },
  menuInfo: {
    marginLeft: 10,
    justifyContent: "center",
    flex: 1,
  },
  menuName: {
    fontSize: 18,
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
  menuImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  quantityIndicator: {
    position: "absolute",
    right: 8,
    width: 28,
    height: 28,
    top: "40%",
    transform: [{ translateY: -8 }],
    borderRadius: 32,
    padding: 4,
  },
  qtyText: {
    left: 6,
    bottom: 2,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    fontSize: 16,
  },
  picker: {
    width: "100%",
    marginBottom: 12,
    borderColor: "#E6E6E6",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 16,
  },
});

export default HomeScreen;
