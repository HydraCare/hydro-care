import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import AddFriend from './addfriend';
import Header from '../header';
import Setting from './setting';
import Profile from './profile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublicProfile from './public_profile';
// const Friend : React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
const Friend = ({ navigation }: any) => {
    const [follow] = useState([
        { Name: 'tomo-tin', id: '1001', water: '2500 ', image: require('@/assets/images/image.jpg') },
        { Name: 'Trang', id: '1002', water: '2600 ', image: require('@/assets/images/dittrau.png') },
        { Name: 'Fukuda-tin', id: '1003', water: '2700 ', image: require('@/assets/images/dittrau.png') },
    ]);

    return (
        <View style={styles.container}>
            <Header title="共有中" />

            <View style={styles.homeContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddFriend')}>
                    <Text style={styles.buttonText}>IDで追加する</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.textContainer}>フォロー中</Text>
            </View>
            <ScrollView style={styles.logsContainer}>
                {follow.map((log, index) => (
                    <TouchableOpacity key={index} style={styles.logItem} onPress={() => navigation.navigate('PublicProfile')}>
                        <View>
                            <Image source={log.image} style={styles.icon} />
                        </View>
                        <View>
                            <View>
                                <Text>Name : {log.Name} </Text>
                            </View>
                            <View>
                                <Text>毎日の目標 : {log.water} ㎖</Text>
                            </View>
                        </View>

                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const Stack = createNativeStackNavigator();
const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState('Friend'); // Trạng thái màn hình hiện tại

    const navigateToAddFriend = () => {
        console.log("aa")
        setCurrentScreen('AddFriend'); // Chuyển sang màn hình AddFriend
    };

    const goBackToFriend = () => {
        setCurrentScreen('Friend');
    };

    return (
        <Stack.Navigator initialRouteName="Friend" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Friend" component={Friend} />
            <Stack.Screen name="AddFriend" component={AddFriend} />
            <Stack.Screen name="PublicProfile" component={PublicProfile} />
        </Stack.Navigator>
        // <View style={styles.container}>

        //     {/* Điều hướng hiển thị màn hình Friend và AddFriend */}
        //     {currentScreen === 'Friend' ? (
        //         <Friend onNavigate={navigateToAddFriend} />
        //     ) : (
        //         <AddFriend onGoBack={goBackToFriend} />
        //     )}


        // </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 20,
        backgroundColor: '#E6F2F9',
    },
    homeContainer: {
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: '#ADD8E6',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        color: 'black',
    },
    textContainer: {
        fontSize: 30,
        fontWeight: 'bold',
        padding: 15,
    },
    logsContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#E6F2F9',
        borderRadius: 10,
    },
    logItem: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        flexDirection: 'row',
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    addFriendContainer: {
        alignItems: 'center',
        backgroundColor: '#E6F2F9',
        padding: 20,
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default App;
