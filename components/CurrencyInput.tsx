import { Colors } from "@/constants/Colors";
import React, { useState, useEffect, FC } from "react";
import { useColorScheme } from "react-native";
import { TextInput } from "react-native-paper";

type CurrencyInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  separator?: "," | ".";
  symbols?: string;
  placeholder: string;
};

const CurrencyInput: FC<CurrencyInputProps> = ({
  value,
  onChangeText,
  placeholder,
  separator = ",",
  symbols = "Rp ",
}) => {
  const [formattedValue, setFormattedValue] = useState(value);

  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  useEffect(() => {
    setFormattedValue(formatCurrency(value));
  }, [value]);

  const handleTextChange = (text: string) => {
    const formatted = formatCurrency(text);
    setFormattedValue(formatted);
    onChangeText(formatted);
  };

  const formatCurrency = (value: string) => {
    if (!value || value === "") {
      return "";
    }

    const parts = value.split(".");
    const integerPart = parts[0].replace(/\D/g, "");
    const decimalPart = parts.length > 1 ? "." + parts[1] : "";

    const formattedInteger = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      separator
    );

    return symbols + formattedInteger + decimalPart;
  };

  return (
    <TextInput
      autoFocus={true}
      value={formattedValue}
      cursorColor={colors.primary}
      mode="outlined"
      outlineColor={colors.primary}
      activeOutlineColor={colors.primary}
      onChangeText={handleTextChange}
      keyboardType="numeric"
      placeholder={placeholder}
    />
  );
};

export default CurrencyInput;
