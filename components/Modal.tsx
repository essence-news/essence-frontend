import React from "react";
import {
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Title } from "./SharedComponents";
import theme from "@/constants/theme";

export type ModalInputProps = {
  onCancel: () => void;
  onOk: () => void;
  label: string;
};

type Props = {
  children: React.ReactChild | React.ReactChild[];
} & ModalInputProps;

export function OkCancelModal({ children, onCancel, onOk, label = "" }: Props) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => null}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              margin: 0,
              textAlign: "left",
              borderTopStartRadius: 5,
              borderTopEndRadius: 5,
              color: theme.colors.primary,
              fontFamily: theme.fonts.headingBold,
              backgroundColor: theme.colors.secondary,
            }}
          >
            {label}
          </Text>
          <ScrollView
            style={{ padding: 10 }}
            keyboardShouldPersistTaps="always"
          >
            {children}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={{ color: theme.colors.primary }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.okButton} onPress={onOk}>
                <Text style={{ color: theme.colors.secondary }}>OK</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0004",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  actionsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    gap: 5,
    borderColor: "#eee",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.secondaryDark,
    backgroundColor: theme.colors.secondary,
  },
  okButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.primaryDark,
    backgroundColor: theme.colors.primary,
  },
});
