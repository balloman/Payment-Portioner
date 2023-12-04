import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{ title: "Home" }} />
      <Text style={{ color: "red", fontSize: 50 }}>Hi Keiondra</Text>
      <Link href="/accounts/" asChild>
        <Button mode="contained">Go to Accounts</Button>
      </Link>
    </View>
  );
}
