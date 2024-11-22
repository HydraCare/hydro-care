import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Water_intake from './frontend/water_intake'; // water Tab Component
import Setting from './frontend/setting';
import History from './frontend/history';
import Friend from './frontend/friend';
import Challenge from './frontend/challenge';
import Blue from './frontend/bluetooth';
import Header from './header';
import test from './frontend/test'
import setting from './frontend/setting';

const Tab = createBottomTabNavigator();

export default function index() {
  return (

    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 70, // Tăng chiều cao của tab bar
        },
      }}
    >
      <Tab.Screen
        name="水分摂取"
        component={Water_intake}
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('@/assets/images/water2.png') : require('@/assets/images/water.png')}
              style={{ width: 40, height: 40 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Details"
        component={History}
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('@/assets/images/history_color.png') : require('@/assets/images/history.png')}
              style={{ width: 40, height: 40 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Share"
        component={Friend}
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('@/assets/images/friend_color.png') : require('@/assets/images/friend.png')}
              style={{ width: 40, height: 40 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="チャレンジ"
        component={Challenge}
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('@/assets/images/challenge_color.png') : require('@/assets/images/challenge.png')}
              style={{ width: 40, height: 40 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="設定"
        component={setting}
        options={{
          title: '',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('@/assets/images/setting_color.png') : require('@/assets/images/setting.png')}
              style={{ width: 40, height: 40 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}