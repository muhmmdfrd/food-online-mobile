import React from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AuthRequest } from "@/models/requests/AuthRequest";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { AuthResponse } from "@/models/responses/AuthResponse";
import { auth } from "@/services";
import { useAuth } from "../context";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

const Login: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthRequest>();

  const { login } = useAuth();

  const mutation = useMutation<ApiResponse<AuthResponse>, string, AuthRequest>({
    mutationFn: auth,
    onSuccess: (response) => {
      const { code, token, user } = response.data;
      login(user, token, code);
    },
    onError: (err: string) => {
      Alert.alert("Failed", err ?? "Login Failed!");
    },
  });

  const scheme = useColorScheme();
  const primaryColor = Colors[scheme ?? "light"].primary;
  const greyColor = Colors[scheme ?? "light"].grey;
  const textColor = Colors[scheme ?? "light"].text;

  const onSubmit: SubmitHandler<AuthRequest> = (data) => {
    mutation.mutate(data);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.header, { color: primaryColor }]} type="title">
        DapoerGo.
      </ThemedText>
      <ThemedText
        style={[styles.subHeader, { color: greyColor }]}
        type="subtitle"
      >
        Easily your lunch
      </ThemedText>

      <Controller
        control={control}
        name="username"
        defaultValue=""
        rules={{ required: "Username is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[
              styles.input,
              { borderColor: primaryColor, color: textColor },
            ]}
            cursorColor={primaryColor}
            placeholder="Username"
            placeholderTextColor={greyColor}
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
          />
        )}
      />
      {errors.username && (
        <ThemedText style={styles.errorText}>
          {errors.username.message}
        </ThemedText>
      )}

      <Controller
        control={control}
        name="password"
        defaultValue=""
        rules={{ required: "Password is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[
              styles.input,
              { borderColor: primaryColor, color: textColor },
            ]}
            cursorColor={primaryColor}
            placeholder="Password"
            placeholderTextColor={greyColor}
            value={value}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <ThemedText style={styles.errorText}>
          {errors.password.message}
        </ThemedText>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: primaryColor }]}
        onPress={handleSubmit(onSubmit)}
      >
        <ThemedText style={styles.buttonText}>
          {mutation.isPending ? "Logging in..." : "Login"}
        </ThemedText>
      </TouchableOpacity>

      <ThemedText style={[styles.footer, { color: greyColor }]}>
        DapoerGo - v1.0.0
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "Crimson-Text",
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default Login;
