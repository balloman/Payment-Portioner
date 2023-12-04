import { Link, Stack } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

import { Account, useMainStore } from "@/stores/main";

import { useDisclosure } from "../hooks/utilHooks";

type AccountWithBalance = Account & { balance: number };

/**
 * Calculates the payments needed to distribute the payment to the accounts.
 * @param accounts The accounts to distribute the payment to.
 * @param payment The payment to distribute
 * @returns A map of the accounts to the amount needed to pay them
 */
function distributePayment(accounts: AccountWithBalance[], payment: number) {
  const paymentDistribution = new Map<Account, number>();
  const idealUtil = 0.4;
  const reverseSortedByUtil = accounts.sort((a, b) => {
    const aUtil = a.balance / a.limit;
    const bUtil = b.balance / b.limit;
    return bUtil - aUtil;
  });
  const sortedByRate = accounts.sort((a, b) => b.rate - a.rate);
  let remainingPayment = payment;
  for (const account of reverseSortedByUtil) {
    if (remainingPayment <= 0) {
      break;
    }
    const util = account.balance / account.limit;
    if (util > idealUtil) {
      const idealBalance = account.limit * idealUtil;
      const amountToPay = Math.min(
        account.balance - idealBalance,
        remainingPayment,
      );
      remainingPayment -= amountToPay;
      paymentDistribution.set(account, amountToPay);
    }
  }
  for (const account of sortedByRate) {
    if (remainingPayment <= 0) {
      break;
    }
    const amountToPay = Math.min(remainingPayment, account.balance);
    remainingPayment -= amountToPay;
    paymentDistribution.set(account, amountToPay);
  }
  return paymentDistribution;
}

function AccountCalculate({
  account,
  onValueChange,
}: {
  account: Account;
  onValueChange: (value: number) => void;
}) {
  const [value, setValue] = useState("0");
  const onSet = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setValue(value);
      return;
    }
    if (num < 0) {
      setValue("0");
      onValueChange(0);
      return;
    }
    if (num > account.limit) {
      setValue(account.limit.toString());
      onValueChange(account.limit);
      return;
    }
    setValue(value);
    onValueChange(num);
  };

  return (
    <Card mode="elevated" style={{ padding: 10, width: "100%" }}>
      <Card.Content
        style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
      >
        <Text>{account.name}</Text>
        <TextInput
          mode="outlined"
          style={{ flex: 1 }}
          keyboardType="numeric"
          label={"Balance"}
          onChangeText={onSet}
          value={value}
        />
      </Card.Content>
    </Card>
  );
}

export default function Home() {
  const accounts = useMainStore(state => state.accounts);
  const [balances, setBalances] = useState<Map<Account, number>>(new Map());
  const [amountToPay, setAmountToPay] = useState(0);
  const dialogDis = useDisclosure();
  const payments = useMemo(() => {
    const accountsWithBalances = accounts.map(account => ({
      ...account,
      balance: balances.get(account) ?? 0,
    }));
    return distributePayment(accountsWithBalances, amountToPay);
  }, [balances, accounts, amountToPay]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        gap: 20,
        padding: "10%",
      }}
    >
      <Stack.Screen options={{ title: "Home" }} />
      {accounts.map(account => (
        <AccountCalculate
          key={account.name}
          account={account}
          onValueChange={value => {
            setBalances(balances => new Map(balances.set(account, value)));
          }}
        />
      ))}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Link href="/accounts/" asChild>
          <Button mode="outlined" style={{ flex: 1 }}>
            Go to Accounts
          </Button>
        </Link>
        <Button
          mode="elevated"
          disabled={accounts.length < 2}
          style={{ flex: 1 }}
          onPress={dialogDis.onOpen}
        >
          Calculate
        </Button>
      </View>
      <Portal>
        <Dialog visible={dialogDis.isOpen} onDismiss={dialogDis.onClose}>
          <Dialog.Title>Calculate</Dialog.Title>
          <Dialog.Content
            style={{
              gap: 10,
              borderTopWidth: 1,
              paddingTop: 20,
              borderColor: "grey",
            }}
          >
            {Array.from(payments.entries()).map(([account, payment]) => (
              <View
                key={account.name}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text variant="titleLarge">{account.name}</Text>
                <Text variant="bodyLarge">${payment.toFixed(2)}</Text>
              </View>
            ))}
            <TextInput
              mode="outlined"
              label="Amount to pay"
              inputMode="numeric"
              onChangeText={value => {
                const num = parseFloat(value);
                if (isNaN(num)) {
                  return;
                }
                setAmountToPay(num);
              }}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}
