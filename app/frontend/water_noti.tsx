import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../header';
import React from 'react';

const Water_noti: React.FC = () => {
    const route = useRoute();
    const { onGoBack } = route.params as { onGoBack: () => void };

    // Các thông báo về "飲みすぎ"
    let notifications = [
        { id: '1', text: '飲みすぎです！水分摂取量を調整してください。', checked: false },
        { id: '2', text: '今日は水を過剰に摂取しています。', checked: false },
        { id: '3', text: '水分を多く摂取しすぎている可能性があります。', checked: false },
        { id: '4', text: '飲みすぎです！一時的に水を控えてください。', checked: false },
        { id: '5', text: '飲みすぎ注意！バランスよく水分を摂りましょう。', checked: false },
    ];

    // Hàm thay đổi trạng thái checkbox
    const handleCheck = (id: string) => {
        const updatedNotifications = notifications.map(notification =>
            notification.id === id ? { ...notification, checked: !notification.checked } : notification
        );
        // Cập nhật lại danh sách thông báo
        notifications = updatedNotifications;
    };

    const renderItem = ({ item }: { item: { text: string; id: string; checked: boolean } }) => (
        <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>{item.text}</Text>
            {/* <CheckBox
                value={item.checked}
                onValueChange={() => handleCheck(item.id)}
            /> */}
        </View>
    );

    return (
        <View >
            <Header title="飲みすぎの通知" back="Back" onBackPress={onGoBack} />
            <View style={styles.container}>
                <Text style={styles.header}>アクティブなメッセージ</Text>
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.buttonText}>カスタムメッセージを追加</Text>
                </TouchableOpacity>
                <View />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    notificationItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    addButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Water_noti;