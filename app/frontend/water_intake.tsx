import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../header';

const Water_Intake = () => {
    const dailyGoal = 2000; // 目標摂取水分
    const [amount, setAmount] = useState(0); // Lượng nước đã uống
    const [remaining, setRemaining] = useState(dailyGoal); // Lượng nước còn lại
    const [waterLevel, setWaterLevel] = useState(new Animated.Value(0)); // Animated value cho mức nước

    const addWater = (amountToAdd: number) => {
        const newAmount = amount + amountToAdd;
        const newRemaining = dailyGoal - newAmount;

        // Cập nhật mức nước
        setAmount(newAmount);
        setRemaining(newRemaining);

        Animated.timing(waterLevel, {
            toValue: (newAmount / dailyGoal) * 100, // Cập nhật tỷ lệ phần trăm cho mức nước
            duration: 500, // Thời gian animation
            useNativeDriver: false, // Không sử dụng native driver vì ta thay đổi chiều cao
        }).start();
    };

    // Hàm reset
    const reset = () => {
        setAmount(0);
        setRemaining(dailyGoal);
        setWaterLevel(new Animated.Value(0)); // Đặt lại mức nước
    };

    const [currentDate, setCurrentDate] = useState<string>('');
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const updateDateTime = () => {
            const date = new Date();
            const dayOfMonth = date.getDate();
            const timeString = date.toTimeString().split(' ')[0].substring(0, 5);
            setCurrentDate(dayOfMonth.toString() + "日");
            setCurrentTime(timeString);
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 60000);

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(intervalId);
    }, []);

    const bluetooth = () => {
        console.log("Bluetooth button clicked");
    };

    return (
        <ScrollView style={styles.background}>
            <Header title="水分摂取" back='' />
            <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeLeft}>
                    {/* <Image
                        source={require('@/assets/images/calender.png')}
                        style={styles.imageCalender}
                    /> */}
                    <Text style={styles.date}>{currentDate}</Text>
                    <Text style={styles.time}>{currentTime}</Text>
                </View>
                <View style={styles.buttonsRight}>
                    <TouchableOpacity onPress={() => addWater(100)}>
                        <Image
                            source={require('@/assets/images/plus.png')}  // Đặt đúng đường dẫn tới hình ảnh
                            style={styles.image}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => bluetooth()}>
                        <Image
                            source={require('@/assets/images/bluetooth.png')}  // Đặt đúng đường dẫn tới hình ảnh
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.container}>
                <Text style={styles.goalText}>一日の目標水分摂取 {dailyGoal}ml</Text>

                <View style={styles.bottleContainer}>
                    {/* Chai nước */}
                    <Image
                        source={require('@/assets/images/bottle.png')}
                        style={styles.bottle}
                    />
                    <Animated.View
                        style={[
                            styles.water,
                            {
                                height: waterLevel.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'], // Đặt chiều cao của mức nước
                                }),
                            },
                        ]}
                    />
                </View>

                <Text style={styles.amountText}>容量 : {amount}ml</Text>
                <TouchableOpacity onPress={() => addWater(100)} style={styles.addButton}>
                    <Text style={styles.buttonText}>Add 100ml</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={reset} style={styles.resetButton}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>

                <Text style={styles.goalText}>ここに通知が流れる </Text>


                <Text style={styles.progressText}>
                    {amount}ml | {((amount / dailyGoal) * 100).toFixed(0)}% 残り: {remaining}ml
                </Text>
                <View style={styles.progressContainer}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: waterLevel.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'],
                                }),
                            },
                        ]}
                    />
                </View>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#E6F2F9',
        flex: 1,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6F2F9',
        padding: 20,
    },
    // imageCalender: {
    //     width: 150,
    //     height: 40,

    // },
    goalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    dateTimeLeft: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    date: {
        paddingLeft: 5,
        fontSize: 24,
        fontWeight: 'bold',
    },
    time: {
        paddingLeft: 8,
        fontSize: 15,
        color: 'gray',
    },
    buttonsRight: {
        paddingRight: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    image: {
        width: 40,
        height: 40,
        marginTop: 5,
    },
    bottle: {
        width: 100,
        height: 200,
        marginTop: 5,
    },
    bottleContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 100,
        height: 200,
        marginTop: 20,
    },
    water: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#ADD8E6',
    },
    amountText: {
        fontSize: 18,
        marginBottom: 10,
    },
    progressText: {
        marginTop: 20,
        fontSize: 18
    },
    buttonText: {
        fontSize: 18,
        color: 'blue',
        marginVertical: 5,
    },
    addButton: {
        backgroundColor: '#ADD8E6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    resetButton: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
    },
    progressContainer: {
        width: '80%',
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 10,
        marginVertical: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#1B94DA',
        borderRadius: 10
    },
});

export default Water_Intake;
