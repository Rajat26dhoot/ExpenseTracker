import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Typo from "../../components/Typo";
import { colors, spacingX, spacingY } from "../../constants/theme";
import { verticalScale } from "../../utils/styling";
import Button from "../../components/Button";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
const Welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* login button and images */}
        <View>
          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require("@/assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Typo size={30} fontWeight={"800"}>
              Always take control
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              of your finances
            </Typo>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(12)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Typo size={17} color={colors.textLight}>
              Finances must be arranged to set a better
            </Typo>
            <Typo size={17} color={colors.textLight}>
              lifestyle in future
            </Typo>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.duration(1000)
            .delay(200)
            .springify()
            .damping(12)}
          style={styles.buttonContainer}
        >
          <Button onPress={() => router.push('/(auth)/register')}>
            <Typo size={22} color={colors.black} fontWeight={"600"}>
              Get started
            </Typo>
          </Button>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(375),
    alignSelf: "center",
    marginTop: verticalScale(25),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingBottom: verticalScale(30),
    gap: spacingY._20,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
    marginVertical: verticalScale(40),
    paddingBottom: verticalScale(20),
  },
});