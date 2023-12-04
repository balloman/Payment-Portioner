import { Stack, router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import "react-native-get-random-values";
import { Button } from "react-native-paper";
import { v4 } from "uuid";

import { useMainStore } from "@/stores/main";

import AccountForm from "./_components/account-form";

export default function AddAccount() {
  const [name, setName] = useState("");
  const [creditLimitText, setCreditLimitText] = useState("0");
  const [rateText, setRateText] = useState("0");
  const addAccount = useMainStore(state => state.addAccount);
  const getAccount = useMainStore(state => state.getAccount);

  const validate = () => {
    if (name.length === 0) {
      alert("Please enter a name.");
      return;
    }
    const creditLimit = parseFloat(creditLimitText);
    if (isNaN(creditLimit)) {
      alert("Please enter a valid credit limit.");
      return;
    }
    const rate = parseFloat(rateText);
    if (isNaN(rate)) {
      alert("Please enter a valid interest rate.");
      return;
    }
    const account = getAccount(name);
    if (account) {
      alert("An account with that name already exists.");
      return;
    }
    addAccount({
      id: v4().replaceAll("-", ""),
      name,
      limit: creditLimit,
      rate,
    });

    router.back();
  };

  return (
    <View style={{ padding: "10%", gap: 20 }}>
      <Stack.Screen options={{ title: "Add Account" }} />
      <AccountForm
        creditLimitText={creditLimitText}
        name={name}
        rateText={rateText}
        onCreditLimitChange={setCreditLimitText}
        onNameChange={setName}
        onRateChange={setRateText}
      />
      <Button mode="contained" onPress={validate}>
        Add Account
      </Button>
    </View>
  );
}
