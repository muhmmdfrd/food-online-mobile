import React, { FC, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  useColorScheme,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface PasswordInputProps extends TextInputProps {}

const PasswordInput: FC<PasswordInputProps> = (props) => {
  const [secureText, setSecureText] = useState<boolean>(true);
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "dark"];

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  return (
    <View style={[styles.container, { borderColor: colors.primary }]}>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        secureTextEntry={secureText}
        {...props}
      />
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
        <MaterialCommunityIcons
          name={secureText ? "eye" : "eye-off"}
          size={24}
          color="gray"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  icon: {
    padding: 10,
  },
});

export default PasswordInput;
