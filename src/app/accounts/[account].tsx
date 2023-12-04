import { Stack, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { Button } from "react-native-paper";

import { useMainStore } from "@/stores/main";

import AccountForm from "./_components/account-form";

export default function AccountView() {
  const { account: id } = useLocalSearchParams();
  const getAccount = useMainStore(state => state.getAccount);
  const updateAccount = useMainStore(state => state.updateAccount);
  const deleteAccount = useMainStore(state => state.removeAccount);
  const acc = useMemo(() => {
    const account = getAccount(id.toString());
    if (!account) {
      alert("Account not found.");
      router.back();
      return { name: "", limit: 0, id: "", rate: 0 };
    }
    return account;
  }, [id, getAccount]);
  const [name, setName] = useState(acc.name);
  const [creditLimitText, setCreditLimitText] = useState(acc.limit.toString());
  const [rateText, setRateText] = useState(acc.rate.toString());

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

  const remove = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            router.back();
            deleteAccount(acc.id);
          },
        },
      ],
    );
  };

  return (
    <View style={{ padding: "10%", gap: 20 }}>
      <Stack.Screen options={{ title: acc.name }} />
      <AccountForm
        creditLimitText={creditLimitText}
        name={name}
        rateText={rateText}
        onCreditLimitChange={setCreditLimitText}
        onNameChange={setName}
        onRateChange={setRateText}
      />
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          width: "100%",
        }}
      >
        <Button style={{ flex: 1 }} mode="contained" onPress={update}>
          Save
        </Button>
        <Button
          style={{ flex: 1 }}
          mode="outlined"
          onPress={remove}
          labelStyle={{ color: "red" }}
        >
          Delete
        </Button>
      </View>
    </View>
  );
}
