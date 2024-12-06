import React, { useState } from 'react';
import { View, Text, Image, Switch, TouchableOpacity, StyleSheet, ScrollView, Button } from 'react-native';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../header';
import Profile from './profile';
import Notification from './notification';
import { useNavigation } from '@react-navigation/native';
import Water_noti from './water_noti';

// Định nghĩa danh sách các tham số của Stack
type RootStackParamList = {
    Setting: undefined;
    Profile: { onGoBack: () => void };
    Notification: { onGoBack: () => void };
    Water_noti: { onGoBack: () => void };
};

function Setting() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const [isWaterAlertEnabled, setIsWaterAlertEnabled] = useState(false);
    const [isDrinkingAlertEnabled, setIsDrinkingAlertEnabled] = useState(false);

    const toggleNotification = () => setIsNotificationEnabled(!isNotificationEnabled);
    const toggleWaterAlert = () => setIsWaterAlertEnabled(!isWaterAlertEnabled);
    const toggleDrinkingAlert = () => setIsDrinkingAlertEnabled(!isDrinkingAlertEnabled);
    // Điều hướng đến màn hình Profile
    const goToProfile = () => {
        navigation.navigate('Profile', { onGoBack: () => navigation.goBack() });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header title='設定' />
            <ScrollView>
                {/* Profile Section */}

                <Text style={styles.sectionTitle}>プロフィール</Text>
                <View style={styles.profileSection}>

                    <Image source={require('@/assets/images/dittrau.png')} style={styles.icon} />
                    <TouchableOpacity onPress={goToProfile} style={styles.settingSection}>
                        <View style={styles.profileDetails}>
                            <Text style={styles.profileText}>Name</Text>
                            <Text style={styles.profileText}>ID: ABT12345</Text>
                            <Text style={styles.profileText}>毎日の目標: 2000ml</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                {/* Notification Settings Section */}
                <View style={styles.settingSection}>
                    <View style={styles.settingItem}>
                        <Text style={styles.sectionTitle}>通知</Text>
                        <Switch
                            value={isNotificationEnabled}
                            onValueChange={toggleNotification}
                            trackColor={{ false: "#ccc", true: "#4CAF50" }}
                        />
                    </View>
                    {isNotificationEnabled && (
                        <>
                            <TouchableOpacity onPress={() => navigation.navigate('Notification', { onGoBack: () => navigation.goBack() })} style={styles.settingSection}>
                                <View style={styles.settingItem}>
                                    <Text style={styles.settingLabel}>水分不足の場合</Text>
                                    <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('Water_noti', { onGoBack: () => navigation.goBack() })} style={styles.settingSection}>
                                <View style={styles.settingItem}>
                                    <Text style={styles.settingLabel}>飲み過ぎの場合</Text>
                                    <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* User Info Section */}
                <View style={styles.settingSection}>
                    <Text style={styles.sectionTitle}>ユーザー情報</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>メルアドレス</Text>
                        <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>パスワード</Text>
                        <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
                    </View>
                    {/* <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                        <Text style={styles.logoutButtonText}>ログアウト</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </View>
    );
};

const Stack = createNativeStackNavigator();
const handleGoBack = () => {
    console.log('Going back to the previous screen');
};
const SettingApp: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen name="Profile" component={Profile} initialParams={{ onGoBack: handleGoBack }} />
            <Stack.Screen name="Notification" component={Notification} initialParams={{ onGoBack: handleGoBack }} />
            <Stack.Screen name="Water_noti" component={Water_noti} initialParams={{ onGoBack: handleGoBack }} />
        </Stack.Navigator>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        margin: 5
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 25,
        marginLeft: 6,
    },
    angle_right: {
        width: 20,
        height: 20,
    },
    profileDetails: {
        flexDirection: 'column',
    },
    profileText: {
        fontSize: 18,
        color: 'black',
    },
    settingSection: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        margin: 5,
        // marginTop: 5,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    settingLabel: {
        fontSize: 18,
        color: '#333',
        marginTop: 5,
    },
    logoutButton: {
        backgroundColor: "#FF4C4C",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 15,

        alignItems: "center",
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 18,
    },
});

export default SettingApp;
