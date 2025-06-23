import { StyleSheet } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";
import { colors } from "@/constants/theme";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const StackLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(modals)/profileModal" options={{ presentation: "modal" }} />
    <Stack.Screen name="(modals)/walletModal" options={{ presentation: "modal" }} />
    <Stack.Screen name="(modals)/transactionModal" options={{ presentation: "modal" }} />
    <Stack.Screen name="(modals)/searchModal" options={{ presentation: "modal" }} />
  </Stack>
);

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          <StackLayout />
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
});
