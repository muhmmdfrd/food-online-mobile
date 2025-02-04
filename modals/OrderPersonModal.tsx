import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { StringHelper } from "@/helpers";
import { OrderTodayResponse } from "@/models/responses/OrderTodayResponse";
import { FC, Fragment } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Divider, Modal, Portal, Text } from "react-native-paper";

type OrderPersonModalProps = {
  visible: boolean;
  setVisible: (value: boolean) => void;
  item?: OrderTodayResponse;
};

const OrderPersonModal: FC<OrderPersonModalProps> = ({
  visible,
  item,
  setVisible,
}) => {
  const hideModal = () => setVisible(false);

  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <ThemedText style={{ marginBottom: 8 }}>{item?.name}</ThemedText>
        <Divider style={{ marginBottom: 8 }} />
        {item?.details.map((v, i) => {
          return (
            <Fragment key={i}>
              <ThemedText>{v.menuName}</ThemedText>
              <ThemedText>{v.qty} pcs</ThemedText>
              <ThemedText>{StringHelper.currencyFormat(v.price)}</ThemedText>
              <Divider style={{ marginTop: 8 }} />
            </Fragment>
          );
        })}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginHorizontal: 16 },
});

export default OrderPersonModal;
