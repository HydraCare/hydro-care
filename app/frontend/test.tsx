import { Text, View } from "react-native";
import Dashboard from "./dashboard";
export default function Test() {
    return (
        <View
            style={{

                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>
                テストフロンエンド
            </Text>
            <Dashboard />
        </View>

    )

}