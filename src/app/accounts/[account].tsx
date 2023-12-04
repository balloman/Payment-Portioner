import { Stack, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";

import { useMainStore } from "@/stores/main";

import AccountForm from "./_components/account-form";

export default function AccountView() {
  const { account: id } = useLocalSearchParams();
  const getAccount = useMainStore(state => state.getAccount);
  const updateAccount = useMainStore(state => state.updateAccount);
  const acc = useMemo(() => {
    const account = getAccount(id.toString());
    if (!account) {
      alert("Account not found.");
      router.back();
      return { name: "", limit: 0, id: "" };
    }
    return account;
  }, [id, getAccount]);
  const [name, setName] = useState(acc.name);
  const [creditLimitText, setCreditLimitText] = useState(acc.limit.toString());

  const update = () => {
    if (name.length === 0) {
      alert("Please enter a name.");
      return;
    }
    const creditLimit = parseFloat(creditLimitText);
    if (isNaN(creditLimit)) {
      alert("Please enter a valid credit limit.");
      return;
    }
    acc.name = name;
    acc.limit = creditLimit;
    updateAccount(acc.id, acc);
    router.back();
  };

  return (
    <View style={{ padding: "10%", gap: 20 }}>
      <Stack.Screen options={{ title: acc.name }} />
      <AccountForm
        creditLimitText={creditLimitText}
        name={name}
        onCreditLimitChange={setCreditLimitText}
        onNameChange={setName}
      />
      <Button mode="contained" onPress={update}>
        Save
      </Button>
    </View>
  );
}
