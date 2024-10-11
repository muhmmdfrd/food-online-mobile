import React, { FC, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface PasswordInputProps extends TextInputProps {}

const PasswordInput: FC<PasswordInputProps> = (props) => {
  const [secureText, setSecureText] = useState<boolean>(true);

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} secureTextEntry={secureText} {...props} />
      <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
        <MaterialCommunityIcons
          name={secureText ? "eye-off" : "eye"}
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  icon: {
    padding: 10,
  },
});

export default PasswordInput;
