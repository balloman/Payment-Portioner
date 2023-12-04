import { View } from "react-native";
import { TextInput } from "react-native-paper";

interface AccountFormProps {
  name: string;
  creditLimitText: string;
  rateText: string;
  onNameChange: (name: string) => void;
  onCreditLimitChange: (creditLimit: string) => void;
  onRateChange: (rate: string) => void;
}

export default function AccountForm(props: AccountFormProps) {
  return (
    <View style={{ gap: 20 }}>
      <TextInput
        label="Name"
        mode="outlined"
        value={props.name}
        onChangeText={props.onNameChange}
      />
      <TextInput
        label="Credit Limit"
        mode="outlined"
        value={props.creditLimitText}
        inputMode="numeric"
        onChangeText={props.onCreditLimitChange}
      />
      <TextInput
        label="Interest Rate"
        mode="outlined"
        inputMode="numeric"
        value={props.rateText}
        onChangeText={props.onRateChange}
      />
    </View>
  );
}
