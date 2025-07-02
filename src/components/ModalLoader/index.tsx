import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

interface ModalLoaderProps {
  loading: boolean;
}

const ModalLoader: React.FC<ModalLoaderProps> = ({ loading }) => (
  <Modal
    transparent
    animationType="fade"
    visible={loading}
    onRequestClose={() => {}}
  >
    <View style={styles.container}>
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ModalLoader;
