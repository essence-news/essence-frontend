import theme from "@/constants/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

export type CheckBoxProps = {
  checked?: boolean;
  onPress?: () => void;
};

export function CheckBox({
  checked = false,
  onPress = () => {},
}: CheckBoxProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      {checked ? (
        <AntDesign name="checksquare" color={theme.colors.primary} size={16} />
      ) : (
        <Ionicons size={16} name="square-outline" />
      )}
    </TouchableOpacity>
  );
}
