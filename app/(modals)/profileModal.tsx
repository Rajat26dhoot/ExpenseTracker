import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageServices";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { UserDataType } from "@/types";
import Button from "@/components/Button";
import { updateUser } from "@/services/userService";
import { useAuth } from "../../contexts/authContext";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

const AVATAR_SIZE = verticalScale(135);
const AVATAR_BORDER = 4;
const PENCIL_SIZE = verticalScale(36); // Gradient border size for pencil icon
const PENCIL_INNER = verticalScale(28); // Inner black circle size for pencil icon
const GRADIENT_COLORS = ['#C96DF0', '#97A2FB'];

const ProfileModal = () => {
  const { user, updateUserData } = useAuth();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: "",
  });
  const router = useRouter();

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || "",
    });
  }, [user]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    let { name } = userData;
    if (!name.trim()) {
      Alert.alert("User", "Please fill all the fields");
      return;
    }
    setLoading(true);
    const res = await updateUser(user?.uid!, userData);
    setLoading(false);
    if (res.success) {
      updateUserData(user?.uid!);
      router.back();
    }
  };

  const pickUserImageHandler = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need media library permissions to make this work!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setUserData((prev) => ({ ...prev, image: result.assets[0] }));
    }
  };

  // Show first letter of name if no avatar image
  const firstLetter = userData?.name ? userData.name[0].toUpperCase() : "U";

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={pickUserImageHandler}
            activeOpacity={0.8}
          >
            {/* Avatar gradient border */}
            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <View style={styles.avatarInner}>
                {userData?.image ? (
                  <Image
                    style={styles.avatarImage}
                    source={getProfileImage(userData.image)}
                    contentFit="cover"
                    transition={100}
                  />
                ) : (
                  <Typo style={styles.avatarLetter}>{firstLetter}</Typo>
                )}
              </View>

              {/* Pencil icon with gradient border and black background at bottom-right */}
              <LinearGradient
                colors={GRADIENT_COLORS}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.pencilGradient}
              >
                <View style={styles.pencilInner}>
                  <Icons.Camera
                    size={verticalScale(20)}
                    color={colors.white}
                  />
                </View>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
            <Input
              placeholder="Name"
              value={userData.name}
              onChangeText={(value) => {
                setUserData((prev) => ({ ...prev, name: value }));
              }}
            />
          </View>
        </ScrollView>

        <Button
          onPress={onSubmit}
          loading={loading}
          disabled={loading}
          style={styles.updateButton}
        >
          <Typo color={colors.black} fontWeight={"700"}>
            Update
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._30,
    backgroundColor: colors.neutral900,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
    paddingBottom: 30,
  },
  avatarContainer: {
    alignSelf: "center",
    position: "relative",
  },
  avatarGradient: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
    textAlign: "center",
  },
  pencilGradient: {
    position: "absolute",
    bottom: 8, // position at bottom-right corner
    right: 8,
    width: PENCIL_SIZE,
    height: PENCIL_SIZE,
    borderRadius: PENCIL_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  pencilInner: {
    width: PENCIL_INNER,
    height: PENCIL_INNER,
    borderRadius: PENCIL_INNER / 2,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    gap: spacingY._10,
  },
  updateButton: {
    marginTop: spacingY._15,
  },
});
