import { Link, Stack, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { Avatar, Button, Card, Icon } from "react-native-paper";

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
      <Card.Title
        title={account.name}
        titleVariant="titleLarge"
        subtitle={`$${account.limit.toFixed(2)}`}
        subtitleVariant="titleMedium"
        left={props => <Avatar.Icon {...props} icon="bank" />}
        right={props => <Icon {...props} source="chevron-right" />}
      />
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
