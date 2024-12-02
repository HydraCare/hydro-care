import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WaterIntake from "./frontend/water_intake"; // water Tab Component
import Setting from "./frontend/setting";
import History from "./frontend/history";
import Friend from "./frontend/friend";
import Challenge from "./frontend/challenge";
import Login from "./frontend/login";

const Tab = createBottomTabNavigator();

const TabIcon = ({
  focused,
  source,
  sourceFocused,
}: {
  focused: boolean;
  source: any;
  sourceFocused: any;
}) => (
  <Image
    source={focused ? sourceFocused : source}
    style={styles.icon} // Sử dụng style icon để căn giữa
  />
);

export default function Index() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar, // Cập nhật tabBarStyle
      }}
    >
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
