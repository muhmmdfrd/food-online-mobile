import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaThemedView } from "@/components/SafeAreaThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@/models/user";
import { ApiResponse } from "@/models/responses/ApiResponse";
import { getById, updateUser } from "@/services/UserService";
import { useAuth } from "../context";
import Loading from "@/components/Loading";
import { router } from "expo-router";
import { Response } from "@/constants/Response";
import { UserUpdateRequest } from "@/models/requests/UserUpdateRequest";
import { launchImageLibrary } from "react-native-image-picker";
import ProfileImage from "@/components/ProfileImage";

const UpdateProfileScreen = () => {
  const [base64, setBase64] = useState<string>("");
  const [isEditPhoto, setEditPhoto] = useState<boolean>(false);

  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const { user } = useAuth();

  const { data, isLoading } = useQuery<ApiResponse<User>, string, User>({
    queryKey: ["get-user-by-id", user?.id],
    queryFn: async () => await getById(user?.id ?? 0),
    select: (response) => {
      return response.data;
    },
  });

  const mutation = useMutation<ApiResponse<any>, string, UserUpdateRequest>({
    mutationFn: updateUser,
    onSuccess: (response) => {
      if (response.code === Response.successCode) {
        Alert.alert("Sucess", response.message);
        router.back();
        return;
      }

      Alert.alert("Error", response.message);
    },
    onError: (err: string) => {
      Alert.alert("Failed", err ?? "Something went wrong!");
    },
  });

  const onSubmit: SubmitHandler<UserUpdateRequest> = (data) => {
    data.id = user!.id;
    data.positionId = user!.positionId;
    data.file = base64;
    data.code = user?.code;

    mutation.mutate(data);
    setEditPhoto(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserUpdateRequest>({
    defaultValues: {
      name: data?.name,
      roleId: data?.roleId,
      roleName: data?.roleName,
      phoneNumber: data?.phoneNumber,
      email: data?.email,
      password: "",
      username: data?.username,
    },
  });

  if (isLoading) {
    return (
      <Loading
        styles={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  return (
    <SafeAreaThemedView style={styles.container}>
      <ScrollView>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          {isEditPhoto && base64 && (
            <Image source={{ uri: base64 }} style={styles.avatar} />
          )}
          {isEditPhoto === false && (
            <ProfileImage code={user?.code} styles={styles.avatar} />
          )}
          <TouchableOpacity
            style={styles.editIcon}
            onPress={async () => {
              const response = await launchImageLibrary({
                quality: 0.4,
                includeBase64: true,
                mediaType: "photo",
              });

              if (response.errorCode === "permission") {
                Alert.alert("Error", "Please granting your permission gallery");
              }

              setBase64(
                `data:image/png;base64,${
                  response.assets?.shift()?.base64 ?? ""
                }`
              );
              setEditPhoto(true);
            }}
          >
            <MaterialCommunityIcons
              name="pen"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Name</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.primary, color: colors.text },
                  errors.name && styles.errorBorder,
                ]}
                cursorColor={colors.primary}
                placeholder="Name"
                placeholderTextColor={colors.grey}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}

          <Text style={[styles.label, { color: colors.text }]}>Username</Text>
          <Controller
            control={control}
            name="username"
            rules={{ required: "Username is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.primary, color: colors.text },
                  errors.username && styles.errorBorder,
                ]}
                cursorColor={colors.primary}
                placeholder="Username"
                placeholderTextColor={colors.grey}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username.message}</Text>
          )}

          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.primary, color: colors.text },
                  errors.password && styles.errorBorder,
                ]}
                cursorColor={colors.primary}
                placeholder="Fill to change password"
                secureTextEntry
                placeholderTextColor={colors.grey}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          <Text style={[styles.label, { color: colors.text }]}>
            Phone Number
          </Text>
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Enter a valid phone number",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.primary, color: colors.text },
                  errors.phoneNumber && styles.errorBorder,
                ]}
                inputMode="tel"
                cursorColor={colors.primary}
                placeholder="Phone Number"
                placeholderTextColor={colors.grey}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
          )}

          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.primary, color: colors.text },
                  errors.email && styles.errorBorder,
                ]}
                inputMode="email"
                placeholder="Email"
                keyboardType="email-address"
                cursorColor={colors.primary}
                placeholderTextColor={colors.grey}
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
          >
            <Text style={[styles.updateButtonText, { color: "white" }]}>
              {mutation.isPending ? "Loading..." : "Update Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  editIconText: {
    fontSize: 14,
    color: "#555",
  },
  formContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 12,
    borderColor: "#E6E6E6",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 16,
  },
  updateButton: {
    marginTop: 12,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter",
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  errorBorder: {
    borderColor: "red",
  },
});

export default UpdateProfileScreen;
