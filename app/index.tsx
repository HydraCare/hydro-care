// import { Text, View, Button } from "react-native";
// import { useRouter } from "expo-router";

// export default function Index() {
//   const router = useRouter();

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>hello world my name is tomo tin desu!</Text>
//       <Text>Edit app/index.tsx to edit this screen.</Text>

//       {/* ボタンを追加して遷移 */}
//       <Button title="Go to Test Screen" onPress={() => router.push("../frontend/test")} />
//     </View>
//   );
// }

import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href={"../frontend/test"} />;
  return <Redirect href={"../frontend/login"} />;
  return <Redirect href={"../frontend/water_intake"} />;
}
