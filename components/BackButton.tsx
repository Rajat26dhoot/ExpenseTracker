import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { BackButtonProps } from "@/types";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius } from "../constants/theme";
import { verticalScale } from "../utils/styling";

const BORDER_WIDTH = 2;

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
  const router = useRouter();
  return (
    <LinearGradient
      colors={['#C96DF0', '#97A2FB']}
      style={[styles.gradientBorder, style]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <CaretLeft
          size={verticalScale(iconSize)}
          color={colors.white}
          weight="bold"
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  gradientBorder: {
    padding: BORDER_WIDTH,
    borderRadius: radius._12 + BORDER_WIDTH,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
