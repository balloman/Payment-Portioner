import { Link, Stack, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import { Account, useMainStore } from "@/stores/main";

/**
 * A component for displaying an account.
 */
function AccountItem({ account }: { account: Account }) {
  const router = useRouter();

  return (
    <Card
      mode="elevated"
      style={{ marginBottom: 20, padding: 10 }}
      onPress={() => router.push(`/accounts/${account.id}`)}
    >
      <Card.Title title={account.name} />
      <Card.Content>
        <Text>Credit Limit: {account.limit}</Text>
      </Card.Content>
    </Card>
  );
}

export default function Accounts() {
  const accounts = useMainStore(state => state.accounts);

  return (
    <ScrollView style={{ padding: "5%" }}>
      <Stack.Screen options={{ title: "Accounts" }} />
      {accounts.map(account => (
        <AccountItem key={account.name} account={account} />
      ))}
      <Link href="/accounts/add" asChild>
        <Button mode="contained">Add Account...</Button>
      </Link>
    </ScrollView>
  );
}
