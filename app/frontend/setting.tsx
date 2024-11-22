import React, { useState } from 'react';
import { View, Text, Image, Switch, TouchableOpacity, StyleSheet, TouchableNativeFeedback, TouchableHighlight } from 'react-native';
import Header from '../header';
import Profile from './profile';
import { useNavigation } from 'expo-router';


const Setting: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const [isWaterAlertEnabled, setIsWaterAlertEnabled] = useState(false);
    const [isDrinkingAlertEnabled, setIsDrinkingAlertEnabled] = useState(false);

    const toggleNotification = () => setIsNotificationEnabled(!isNotificationEnabled);
    const toggleWaterAlert = () => setIsWaterAlertEnabled(!isWaterAlertEnabled);
    const toggleDrinkingAlert = () => setIsDrinkingAlertEnabled(!isDrinkingAlertEnabled);
    const navigation = useNavigation(); // Hook navigation
    const goToNotificationPage = () => {
        // navigation.navigate('Notification');
    };
    return (
        <View style={styles.container}>
            {/* Header */}
            <Header title='設定' />
            {/* Profile Section */}
            <TouchableOpacity onPress={onNavigate} style={styles.settingSection}  >
                <Text style={styles.sectionTitle}>プロフィール</Text>
                {/* <TouchableOpacity onPress={onNavigate}>
                    <Text style={styles.buttonText}>IDで追加する</Text>
                </TouchableOpacity> */}
                <View style={styles.profileSection}>
                    <Image source={require('@/assets/images/dittrau.png')} style={styles.icon} />
                    <View style={styles.profileDetails}>
                        <Text style={styles.profileText}>Name</Text>
                        <Text style={styles.profileText}>ID: ABT12345</Text>
                        <Text style={styles.profileText}>毎日の目標: 2000ml</Text>
                    </View>
                </View>
            </TouchableOpacity>
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
                        <TouchableOpacity onPress={goToNotificationPage} style={styles.settingSection}>
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>水分不足の場合</Text>
                                <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onNavigate} style={styles.settingSection}  >
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>飲み過ぎの場合</Text>
                                <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
                            </View>
                        </TouchableOpacity>
                    </>
                )}
            </View>
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

            </View>


            {/* Password and Email Settings Section */}
            {/* <View style={styles.changeSettings}>
                <TouchableOpacity style={styles.changeButton}>
                    <Text style={styles.buttonText}>パスワード、メルアドレス変更</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
};
const SettingApp: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState('Setting');
    const navigateToProfile = () => {
        console.log("go to Profile page")
        setCurrentScreen('Profile');
    };
    const navigateNotification = () => {
        console.log("通知画面")
        setCurrentScreen('Notification');
    }
    const goBackToBackSetting = () => {
        setCurrentScreen('Setting');
    };

    return (
        <View style={styles.container}>

            {currentScreen === 'Setting' ? (
                <Setting onNavigate={navigateToProfile} />
            ) : (
                <Profile onGoBack={goBackToBackSetting} />
            )}
            {/* 
            {currentScreen === 'Setting' ? (
                <Setting onNavigate={navigateNotification} />
            ) : (
                <Profile onGoBack={goBackToBackSetting} />
            )} */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',
    },
    backButton: {
        position: 'absolute',
        left: 0,
    },
    backText: {
        fontSize: 20,
        color: '#007BFF',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 5,

    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 30,
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
        margin: 10,
        marginTop: 20
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    settingLabel: {
        fontSize: 18,
        color: '#333',
        marginTop: 5,
    },
    changeSettings: {
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
    },
    changeButton: {
        backgroundColor: '#ADD8E6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: 'black',
    },
});

export default SettingApp;
