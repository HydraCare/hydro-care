// import React, { useState } from 'react';
// import { Image, TouchableOpacity, StyleSheet } from 'react-native';
// import { Link } from 'expo-router';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import Dashboard from './frontend/dashboard'; // Import Dashboard
// // import WaterIntakeScreen from './frontend/water_intake';

// import { Redirect } from "expo-router";
// import { View } from 'react-native';
// // const Stack = createNativeStackNavigator();
// export default function Index() {
//   const [activeIndex, setActiveIndex] = useState<number>(0);

//   const handlePress = (index: number, route: string) => {
//     setActiveIndex(index);
//     navigation.navigate(route);
//   };
//   return (
//     <View style={styles.toolbar}>
//       {/* <View style={styles.toolbar}>
//       <TouchableOpacity
//         style={[
//           styles.iconContainer,
//           activeIndex === 0 && styles.activeContainer,
//         ]}
//         onPress={() => handlePress(0, 'water_intake')}
//       >
//         <Image
//           source={activeIndex === 0 ? require('@/assets/images/water2.png') : require('@/assets/images/water.png')}
//           style={[styles.icon]}
//         />
//       </TouchableOpacity> */}
//       <Link href="./frontend/water_intake" style={[
//         styles.iconContainer,
//         activeIndex === 0 && styles.activeContainer,
//       ]}>
//         <Image
//           source={activeIndex === 0 ? require('@/assets/images/water2.png') : require('@/assets/images/water.png')}
//           style={[styles.icon]}
//         />
//       </Link>

//       <Link href="./frontend/history" style={[
//         styles.iconContainer,
//         activeIndex === 1 && styles.activeContainer,
//       ]}>
//         <Image
//           source={activeIndex === 1 ? require('@/assets/images/history_color.png') : require('@/assets/images/history.png')}
//           style={[styles.icon]}
//         />
//       </Link>
//       <Link href="./frontend/friend" style={[
//         styles.iconContainer,
//         activeIndex === 2 && styles.activeContainer,
//       ]}>
//         <Image
//           source={activeIndex === 2 ? require('@/assets/images/friend_color.png') : require('@/assets/images/friend.png')}
//           style={[styles.icon]}
//         />
//       </Link>
//       <Link href="./frontend/test" style={[
//         styles.iconContainer,
//         activeIndex === 3 && styles.activeContainer,
//       ]}> <Image
//           source={activeIndex === 3 ? require('@/assets/images/challenge_color.png') : require('@/assets/images/challenge.png')}
//           style={[styles.icon]}
//         />
//       </Link>
//       <Link href="./frontend/test" style={[
//         styles.iconContainer,
//         activeIndex === 4 && styles.activeContainer,
//       ]}>
//         <Image
//           source={activeIndex === 4 ? require('@/assets/images/setting_color.png') : require('@/assets/images/setting.png')}
//           style={[styles.icon]}
//         />
//       </Link>
//     </View>
//   );

//   // return <Redirect href={"../frontend/test"} />;
//   // return <Redirect href={"../frontend/dashboard"} />;
//   // return <Redirect href={"../frontend/water_intake"} />;

// }
// const styles = StyleSheet.create({
//   toolbar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     padding: 0,
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   iconContainer: {
//     alignItems: 'center',
//     padding: 10,
//   },
//   activeContainer: {
//     borderTopWidth: 3,
//     borderTopColor: '#ADD8E6',
//   },
//   icon: {
//     width: 50,
//     height: 50,
//   },
// });
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, View, Text, StyleSheet } from 'react-native';
import HomeTab from './frontend/test';
import DetailsTab from './frontend/setting';
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeTab} />
        <Tab.Screen name="Details" component={DetailsTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}