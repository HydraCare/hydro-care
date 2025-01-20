import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Notifications from "expo-notifications";
import WaterIntake from "./frontend/water_intake"; // water Tab Component
import Setting from "./frontend/setting";
import History from "./frontend/history";
import Friend from "./frontend/friend";
import Challenge from "./frontend/challenge";
import Login from "./frontend/login";
import Register from "./frontend/sign_up";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Sign_up_info from "./frontend/sign_up_info";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, source, sourceFocused }: { focused: boolean; source: any; sourceFocused: any }) => (
  <Image source={focused ? sourceFocused : source} style={styles.icon} />
);

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ tabBarStyle: styles.tabBar }}>
    <Tab.Screen
      name="水分摂取"
      component={WaterIntake}
      options={{
        title: "",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("@/assets/images/water.png")}
            sourceFocused={require("@/assets/images/water2.png")}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Details"
      component={History}
      options={{
        title: "",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("@/assets/images/history.png")}
            sourceFocused={require("@/assets/images/history_color.png")}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Share"
      component={Friend}
      options={{
        title: "",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("@/assets/images/friend.png")}
            sourceFocused={require("@/assets/images/friend_color.png")}
          />
        ),
      }}
    />
    <Tab.Screen
      name="チャレンジ"
      component={Challenge}
      options={{
        title: "",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("@/assets/images/challenge.png")}
            sourceFocused={require("@/assets/images/challenge_color.png")}
          />
        ),
      }}
    />
    <Tab.Screen
      name="設定"
      component={Setting}
      options={{
        title: "",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("@/assets/images/setting.png")}
            sourceFocused={require("@/assets/images/setting_color.png")}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ログインの状態確認

  // 通知設定
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  // ログイン成功時の処理
  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);

    // 通知をスケジュール
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "ログイン成功",
        body: "アプリの利用を開始しましょう！",
      },
      trigger: null, // 即時通知
    });
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login">
          {(props) => <Login {...props} onLoginSuccess={handleLoginSuccess} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Home" component={TabNavigator} />
      )}
      <Stack.Screen name="Register">
        {(props) => <Register {...props} onLoginSuccess={handleLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="Sign_up_info" component={Sign_up_info} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 75,
    paddingTop: 15,

  },
  icon: {
    width: 30,
    height: 30,
  },
});