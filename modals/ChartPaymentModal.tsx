import { FC, useState } from "react";
import { Button, Modal, Portal } from "react-native-paper";
import { StyleSheet, useColorScheme } from "react-native";
import CurrencyInput from "@/components/CurrencyInput";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";

type ChartPaymentModalProps = {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setCash: (value: number) => void;
};

const ChartPaymentModal: FC<ChartPaymentModalProps> = ({
  visible,
  setVisible,
  setCash,
}) => {
  const [value, setValue] = useState<string>("");

  const scheme = useColorScheme();

  const symbols = "Rp ";
  const separator = ",";

  const hideModal = () => setVisible(false);
  const isButtonDisabled = () => value.length === 0;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: Colors[scheme ?? "light"].background },
        ]}
      >
        <CurrencyInput
          value={value}
          onChangeText={setValue}
          separator={separator}
          symbols={symbols}
          placeholder="Enter amount"
        />
        <Button
          disabled={isButtonDisabled()}
          style={[
            styles.button,
            {
              backgroundColor: isButtonDisabled()
                ? "gray"
                : Colors[scheme ?? "light"].primary,
            },
          ]}
          onPress={() => {
            setVisible(false);
            setCash(
              +value.replace(new RegExp(`[${separator}${symbols}]`, "g"), "")
            );
          }}
        >
          <ThemedText style={styles.buttonText}>Pay</ThemedText>
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginHorizontal: 16 },
  button: {
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});

export default ChartPaymentModal;
