import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { useAuth } from "../../contexts/authContext";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageServices";
import { accountOptionType } from "@/types";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import LogoutModal from "@/components/LogoutModal";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

const gradientColors = ['#C96DF0', '#97A2FB'];

const GradientIconMask = ({ children }) => (
  <MaskedView maskElement={<>{children}</>}>
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: 20, height: 20 }}
    />
  </MaskedView>
);

const Profile = () => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const accountOptions = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: <Icons.GearSix size={26} color={colors.white} weight="fill" />,
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.LockKey size={26} color={colors.white} weight="fill" />, // Changed icon
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <Icons.SignOut size={26} color={colors.white} weight="fill" />, // Changed icon
      bgColor: "#e11d48",
    },
  ];

  const handlePress = (item) => {
    if (item.title == "Logout") setLogoutModalVisible(true);
    if (item.routeName) router.push(item.routeName);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Helper: Get first letter of name, fallback to "U"
  const firstLetter = user?.name ? user.name[0].toUpperCase() : "U";

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title={"Profile"} style={{ marginVertical: spacingY._10 }} />

        {/* user Info */}
        <View style={styles.userInfo}>
          {/* Avatar with gradient border */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <View style={styles.avatarInner}>
                {user?.image ? (
                  <Image
                    style={styles.avatarImage}
                    source={getProfileImage(user?.image)}
                    contentFit="cover"
                    transition={100}
                  />
                ) : (
                  <Text style={styles.avatarLetter}>{firstLetter}</Text>
                )}
              </View>
            </LinearGradient>
          </View>
          {/* Name & email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* account options */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <Animated.View
              key={index.toString()}
              entering={FadeInDown.delay(index * 50).springify().damping(14)}
              style={styles.listItem}
            >
              <TouchableOpacity
                style={styles.flexRow}
                onPress={() => handlePress(item)}
              >
                {/* icon */}
                <View
                  style={[
                    styles.listIcon,
                    { backgroundColor: item?.bgColor },
                  ]}
                >
                  {item.icon}
                </View>
                <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                  {item.title}
                </Typo>
                {/* Gradient CaretRight */}
                <GradientIconMask>
                  <Icons.CaretRight
                    size={verticalScale(20)}
                    weight="bold"
                    color="#fff"
                  />
                </GradientIconMask>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
      <LogoutModal
        setModalVisible={setLogoutModalVisible}
        modalVisible={logoutModalVisible}
        handleLogout={handleLogout}
      />
    </ScreenWrapper>
  );
};

export default Profile;

const AVATAR_SIZE = verticalScale(135);
const AVATAR_BORDER = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatarContainer: {
    alignSelf: "center",
  },
  avatarGradient: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: AVATAR_SIZE - AVATAR_BORDER * 2,
    height: AVATAR_SIZE - AVATAR_BORDER * 2,
    borderRadius: (AVATAR_SIZE - AVATAR_BORDER * 2) / 2,
    backgroundColor: colors.neutral800,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: (AVATAR_SIZE - AVATAR_BORDER * 2) / 2,
  },
  avatarLetter: {
    fontSize: 48,
    color: colors.white,
    fontWeight: "700",
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
