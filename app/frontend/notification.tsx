import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../header';
const Notification: React.FC = () => {
    const route = useRoute();
    const { onGoBack } = route.params as { onGoBack: () => void };
    const notifications = [
        '水分が足りていません。もう少し水を飲んでください。',
        '今日はまだ200mlの水を飲んでいません。',
        '水分摂取が不足しています。こまめに水を飲みましょう。',
        '水分不足の警告！今すぐ水を飲んでください。',
        '健康のために、1時間ごとに水分を補給しましょう。',
    ];
    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>{item}</Text>
        </View>
    );

    return (
        <View>
            <Header title="通知メッセージ" back='Back' onBackPress={onGoBack} />
            <View style={styles.container}>


                <Text style={styles.header}>水分不足のアクティブなメッセージ</Text>
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.buttonText}>カスタムメッセージを追加</Text>
                </TouchableOpacity>
            </View>
        </View>
    )


};

//css in js

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
        padding: 10,
    },
    notificationItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        paddingVertical: 5,
    },
    notificationText: {
        fontSize: 16,
        color: '#333',
    },
    addButton: {
        marginTop: 20,
        backgroundColor: '#4CAEE8',
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
export default Notification;