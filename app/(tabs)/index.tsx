import Button from "@/components/Button";
import HomeCard from "@/components/HomeCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "../../contexts/authContext";
import useFetchData from "../../hooks/useFetchData";
import { TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ];

  const {
    data: recentTransactions,
    loading: transactionLoading,
    error,
  } = useFetchData<TransactionType>("transactions", constraints);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Typo size={20} color={colors.neutral400}>
              Hello
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name} 👋
            </Typo>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(modals)/searchModal")}
            style={styles.searchIcon}
          >
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.neutral100}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewStyle}
        >
          {/* cards */}
          <View>
            <HomeCard />
          </View>

          <TransactionList
            title={"Recent Transactions"}
            data={recentTransactions}
            loading={transactionLoading}
            emptyListMessage={"No Recent Transactions"}
          />
        </ScrollView>

        {/* <Button
          style={styles.floatingButton}
          onPress={() => router.push("/(modals)/transactionModal")}
        >
          <Icons.Plus
            color={colors.black}
            weight="bold"
            size={verticalScale(24)}
          />
        </Button> */}
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
});