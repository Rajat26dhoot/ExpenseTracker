import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View,Dimensions } from "react-native";
import * as Icons from "phosphor-react-native";


const SCREEN_WIDTH = Dimensions.get("window").width;
const horizontalPadding = spacingX._20 * 2; // left + right
const availableWidth = SCREEN_WIDTH - horizontalPadding;
const trashButtonWidth = availableWidth * 0.15;
const updateButtonWidth = availableWidth * 0.85 - scale(12);


const WalletModal = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: "",
  });
  const router = useRouter();
  const oldWallet: {
    name: string;
    image: string;
    id: string;
  } = useLocalSearchParams();

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({ ...oldWallet });
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    let { name, image } = wallet;

    if (!name.trim()) {
      Alert.alert("Wallet", "Please fill all the fields");
       return; 
    }

    const data: WalletType = { name, image, uid: user?.uid };

    if (oldWallet?.id) {
      data.id = oldWallet?.id;
    }
    // todo include wallet id if updating

    setLoading(true);
    const res = await createOrUpdateWallet(data);
    console.log("🚀 ~ onSubmit ~ res:", res);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet ", res.message);
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldWallet?.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet ", res.message);
    }
  };

  //todo  refactor to a modal
  const showDelteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this wallet?\nThis action will remove all the transactions realted to this wallet",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel de;lete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Update Wallet" : "Add Wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Salary"
              value={wallet.name}
              onChangeText={(value) => {
                setWallet((prev) => ({ ...prev, name: value }));
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            {/* image input */}
            <ImageUpload
              placeholder="Upload Image"
              onClear={() => setWallet((prev) => ({ ...prev, image: null }))}
              file={wallet.image}
              onSelect={(file) =>
                setWallet((prev) => ({ ...prev, image: file }))
              }
            />
          </View>
        </ScrollView>
      </View>


      <View style={styles.footer}>
  {oldWallet?.id ? (
    // When updating, show both buttons in a row with 20%/80% width
    <View style={{ flexDirection: "row", gap: scale(12), alignItems: "center" }}>
  <Button
    onPress={showDelteAlert}
    style={{
      backgroundColor: colors.rose,
      width: trashButtonWidth,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Icons.Trash
      color={colors.white}
      size={verticalScale(24)}
      weight="bold"
    />
  </Button>
  <Button
    loading={loading}
    onPress={onSubmit}
    style={{
      width: updateButtonWidth,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Typo color={colors.black} fontWeight={"700"}>
      Update Wallet
    </Typo>
  </Button>
</View>

  ) : (
    // When adding, show only the add button full width
    <Button
      loading={loading}
      onPress={onSubmit}
      style={styles.updateButton}
    >
      <Typo color={colors.black} fontWeight={"700"}>
        Add Wallet
      </Typo>
    </Button>
  )}
</View>


    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._30,
  },
  footer: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
    // overflow: "hidden",
    // position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._5,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
   updateButton: {
      marginTop: spacingY._15,
  },
});