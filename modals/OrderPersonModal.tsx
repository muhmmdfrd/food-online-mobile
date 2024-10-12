import { FC } from "react";
import { StyleSheet } from "react-native";
import { Modal, Portal, Text } from "react-native-paper";

type OrderPersonModalProps = {
  visible: boolean;
  setVisible: (value: boolean) => void;
};

const OrderPersonModal: FC<OrderPersonModalProps> = ({
  visible,
  setVisible,
}) => {
  const hideModal = () => setVisible(false);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.container}
      >
        <Text>Example Modal. Click outside this area to dismiss.</Text>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white", padding: 20, marginHorizontal: 16 },
});

export default OrderPersonModal;
