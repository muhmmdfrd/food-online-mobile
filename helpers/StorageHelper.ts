import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

const getData = async (key: string): Promise<string | null> => {
  const value = await AsyncStorage.getItem(key);
  return value;
};

const removeAllData = async () => {
  await AsyncStorage.clear();
};

const StorageHelper = {
  storeData,
  getData,
  removeAllData,
};

export default StorageHelper;
