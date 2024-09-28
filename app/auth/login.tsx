import React from "react";
import { TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AuthRequest } from "@/models/requests/AuthRequest";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { AuthResponse } from "@/models/responses/AuthResponse";
import { auth } from "@/services";
import { useAuth } from "../context";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

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

  const onSubmit: SubmitHandler<AuthRequest> = (data) => {
    mutation.mutate(data);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header} type="title">
        Food Online
      </ThemedText>
      <ThemedText style={styles.subHeader} type="subtitle">
        Easily your lunch{" "}
      </ThemedText>

      <Controller
        control={control}
        name="username"
        defaultValue=""
        rules={{ required: "Username is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Username"
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
            style={styles.input}
            placeholder="Password"
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <ThemedText style={styles.buttonText}>
          {mutation.isPending ? "Logging in..." : "Login"}
        </ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.footer}>Food Online App - v1.0.0</ThemedText>
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
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default Login;
