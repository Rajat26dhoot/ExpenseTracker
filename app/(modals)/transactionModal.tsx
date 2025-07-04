import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "../../contexts/authContext";
import useFetchData from "../../hooks/useFetchData";
import { deleteWallet } from "../../services/walletService";
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Input from "../../components/Input";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "../../services/transactionService";


const SCREEN_WIDTH = Dimensions.get("window").width;
const horizontalPadding = spacingX._20 * 2; // left + right
const availableWidth = SCREEN_WIDTH - horizontalPadding;
const trashButtonWidth = availableWidth * 0.15;
const updateButtonWidth = availableWidth * 0.85 - scale(12);
const TransactionModal = () => {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    category: "",
    date: new Date(),
    description: "",
    image: null,
    walletId: "",
  });

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const oldTransaction: {
    id: string;
    type: string;
    amount: string;
    category?: string;
    date: string;
    description: string;
    image?: any;
    uid?: string;
    walletId: string;
  } = useLocalSearchParams();

const walletDropdownList = [
  ...wallets.map((wallet) => ({
    label: `${wallet?.name} ($${wallet?.amount})`,
    value: wallet?.id,
  })),
  {
    label: "Add Wallet",
    value: "add_wallet",
    icon: <Icons.PlusCircle color={colors.white} size={20} />, 
  },
];



  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction.type,
        amount: +oldTransaction.amount,
        category: oldTransaction.category,
        date: new Date(oldTransaction.date),
        description: oldTransaction.description,
        image: oldTransaction.image,
        uid: oldTransaction.uid,
        walletId: oldTransaction.walletId,
      });
    }
  }, []);

  const onSubmit = async () => {
    const { type, amount, description, date, category, walletId, image } =
      transaction;

    if (!walletId || !date || (type === "expense" && !category)) {
      Alert.alert("Transaction", "Please fill all the fields");
      return;
    }

    let transactionData: TransactionType = {
      ...transaction,
      uid: user?.uid,
      category: type === "income" ? "" : category,
    };

    if (oldTransaction?.id) {
      transactionData.id = oldTransaction.id;
    }

    setLoading(true);

    const res = await createOrUpdateTransaction(transactionData);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res?.message);
    }
  };

  const onDateChange = (selectedDate: Date) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction((prev) => ({ ...prev, date: currentDate }));

    setShowDatePicker(false);
  };

  const onDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(
      oldTransaction?.id,
      oldTransaction.walletId
    );
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transcation ", res.message);
    }
  };

  //todo  refactor to a modal
  const showDelteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this Transaction?",
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
          title={oldTransaction?.id ? "Update Transaction" : "Add Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* transaction type */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Transaction Type
            </Typo>

            <Dropdown
              style={styles.dropdownContainer}
              activeColor={colors.neutral700}
              //   placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              searchPlaceholder="Search..."
              value={transaction.type}
              onChange={(item) => {
                setTransaction((prev) => ({ ...prev, type: item.value }));
              }}
              //   placeholder={!isFocus ? "Select item" : "..."}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
            />
          </View>

          {/* wallet */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Wallet
            </Typo>

            <Dropdown
  style={styles.dropdownContainer}
  activeColor={colors.neutral700}
  placeholderStyle={styles.dropdownPlaceholder}
  selectedTextStyle={styles.dropdownSelectedText}
  iconStyle={styles.dropdownIcon}
  data={walletDropdownList}
  maxHeight={300}
  labelField="label"
  valueField="value"
  value={transaction.walletId}
  onChange={(item) => {
    if (item.value === "add_wallet") {
      router.push("/(modals)/walletModal");
      return;
    }
    setTransaction((prev) => ({ ...prev, walletId: item.value }));
  }}
  placeholder={"Select wallet"}
  itemTextStyle={styles.dropdownItemText}
  itemContainerStyle={styles.dropdownItemContainer}
  containerStyle={styles.dropdownListContainer}
/>

          </View>

          {/* expense category */}
          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Expense Category
              </Typo>

              <Dropdown
                style={styles.dropdownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                labelField="label"
                valueField="value"
                searchPlaceholder="Search..."
                value={transaction.category}
                onChange={(item) => {
                  setTransaction((prev) => ({ ...prev, category: item.value }));
                }}
                placeholder={"Select category"}
                itemTextStyle={styles.dropdownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
              />
            </View>
          )}

          {/* date picker  */}

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Date
            </Typo>
            {/* date input */}
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View style={Platform.OS === "ios" && styles.iosDatePicker}>
                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="date"
                  maximumDate={new Date()}
                  date={transaction.date as Date}
                  onConfirm={(date) => {
                    onDateChange(date);
                    setShowDatePicker(false);
                  }}
                  onCancel={() => setShowDatePicker(false)}
                />
              </View>
            )}

            {/* amount */}
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Amount
              </Typo>
              <Input
                keyboardType="numeric"
                value={transaction.amount?.toString()}
                onChangeText={(value) => {
                  setTransaction((prev) => ({
                    ...prev,
                    amount: Number(value.replace(/[^0-9]/g, "")),
                  }));
                }}
              />
            </View>

            {/* description */}
            <View style={styles.inputContainer}>
              <View style={styles.flexRow}>
                <Typo color={colors.neutral200} size={16}>
                  Description
                </Typo>
                <Typo color={colors.neutral200} size={14}>
                  (optional)
                </Typo>
              </View>

              <Input
                multiline
                value={transaction.description}
                onChangeText={(value) => {
                  setTransaction((prev) => ({
                    ...prev,
                    description: value,
                  }));
                }}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Receipt
            </Typo>
            {/* image input */}
            <ImageUpload
              placeholder="Upload Image"
              onClear={() =>
                setTransaction((prev) => ({ ...prev, image: null }))
              }
              file={transaction.image}
              onSelect={(file) =>
                setTransaction((prev) => ({ ...prev, image: file }))
              }
            />
          </View>
        </ScrollView>
      </View>


            <View style={styles.footer}>
  {oldTransaction?.id ? (
       <View style={{ flexDirection: "row", gap: scale(12), alignItems: "center" }}>
  <Button
    onPress={showDelteAlert}
    style={{
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
      Update Transaction
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
        Add Transaction
      </Typo>
    </Button>
  )}
</View>
      
      
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropDown: {
    // flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    // paddingHorizontal: spacingX._15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {
    // backgroundColor: "red",
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  updateButton: {
      marginTop: spacingY._15,
    },
});