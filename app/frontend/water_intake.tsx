import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, ScrollView, Modal, TextInput, Button, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../header';
import bluetooth from './bluetooth';
import CalendarPicker from './calender_picker';

const Water_Intake = () => {
    const dailyGoal = 2000; // 目標摂取水分
    const [count, setCount] = useState(1500); //ボトルの初期化
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
            duration: 1500, // Thời gian animation
            useNativeDriver: false, // Không sử dụng native driver vì ta thay đổi chiều cao
        }).start();
    };
    //引く処理
    const subWater = (amountSub: number) => {
        const newCount = count - amountSub; // Tính lượng nước đã uống sau khi trừ đi amountSub
        const newAmount = amount + amountSub;
        const newRemaining = dailyGoal - newAmount; // Tính lượng nước còn lại cần uống

        // Cập nhật trạng thái
        setAmount(newAmount);
        setRemaining(newRemaining);

        // Cập nhật mức nước với animation
        Animated.timing(waterLevel, {
            toValue: (newAmount / dailyGoal) * 100, // Tính tỷ lệ phần trăm mức nước
            duration: 1500, // Thời gian animation
            useNativeDriver: false, // Không sử dụng native driver vì chúng ta đang thay đổi chiều cao
        }).start();
    };
    // reset
    const reset = () => {
        setAmount(0);
        setRemaining(dailyGoal);
        setWaterLevel(new Animated.Value(0)); // Đặt lại mức nước
    };
    // カレンダー関数
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
        return () => clearInterval(intervalId);
    }, []);

    // modal　関数
    const [modalVisible, setModalVisible] = useState(false);
    const [mount, setMount] = useState(200); // Initial amount is 200ml
    const [waterType, setWaterType] = useState<string>('水'); // Default type of water is 水
    const [date, setDate] = useState<string>(''); // Date and time for water intake
    const [isEditing, setIsEditing] = useState(false); // Kiểm tra xem đang chỉnh sửa hay không

    const handleSubmit = () => {
        // Handle submission logic here (e.g., store the data or update state)
        console.log(`Water Type: ${waterType}, Amount: ${mount}ml, Date: ${date}`);
        setModalVisible(false); // Close modal after submission
    };
    const handleAmountChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const newAmount = e.nativeEvent.text; // Sử dụng `nativeEvent.text` để lấy giá trị chuỗi
        if (!isNaN(parseFloat(newAmount))) {
            setMount(parseFloat(newAmount)); // Chuyển đổi chuỗi thành số nếu hợp lệ
        }
    };
    const bluetooth = () => {
        console.log("click blue")
    }
    //Calendar 関数
    const [selectedDate, setSelectedDate] = useState<string>('');

    const handleDateChange = (date: string) => {
        setSelectedDate(date); // Cập nhật ngày khi người dùng chọn
    };

    return (
        <View style={styles.background}>
            <Header title="水分摂取" back='' />
            <ScrollView>
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
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Image
                                source={require('@/assets/images/plus.png')}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => bluetooth()}>
                            <Image
                                source={require('@/assets/images/bluetooth.png')}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.container}>
                    <Text style={styles.goalText}>一日の目標水分摂取 {dailyGoal}ml</Text>

                    <View style={styles.bottleContainer}>
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
                                        outputRange: ['100%', '0%'], // Đặt chiều cao của mức nước
                                    }),
                                },
                            ]}
                        />
                    </View>

                    <Text style={styles.amountText}>容量 : {count - amount}ml</Text>
                    {/* <TouchableOpacity onPress={() => addWater(100)} style={styles.addButton}>
                        <Text style={styles.buttonText}>Add 100ml</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => subWater(100)} style={styles.addButton}>
                        <Text style={styles.buttonText}>飲んだ水の量 100ml</Text>
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

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric" // Hiển thị bàn phím số
                                    value={mount.toString()}
                                    onChange={handleAmountChange}
                                    onBlur={() => setIsEditing(false)} // Khi rời khỏi TextInput, chuyển về trạng thái xem
                                />
                            ) : (
                                <TouchableOpacity onPress={() => setIsEditing(true)}>
                                    <Text style={styles.input}>{mount}ml</Text>
                                </TouchableOpacity>
                            )}
                        </Text>
                        <Text style={styles.subtitle}>ジャンル</Text>

                        {/* Water Type Buttons */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => setWaterType('水')}
                                style={[styles.button, waterType === '水' && styles.selectedButton]}
                            >
                                <Text style={[styles.buttonText3, waterType === '水' && styles.buttonText2]}>水</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setWaterType('炭酸水')}
                                style={[styles.button, waterType === '炭酸水' && styles.selectedButton]}
                            >
                                <Text style={[styles.buttonText3, waterType === '炭酸水' && styles.buttonText2]}>炭酸水</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setWaterType('お茶')}
                                style={[styles.button, waterType === 'お茶' && styles.selectedButton]}
                            >
                                <Text style={[styles.buttonText3, waterType === 'お茶' && styles.buttonText2]}>お茶</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => setWaterType('スムージー')} style={styles.button}>
                                <Text style={styles.buttonText}>スムージー</Text>
                            </TouchableOpacity> */}
                        </View>

                        {/* Date and Time Input */}
                        <Text style={styles.selectedDateText}>
                            {selectedDate ? `selected: ${selectedDate}` : 'not select'}
                        </Text>
                        <CalendarPicker onDateChange={handleDateChange} />
                        {/* Submit Button */}
                        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>登録</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >
            {/* <BotTab></BotTab> */}
        </View >
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
        zIndex: 1,
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
        backgroundColor: '#4CAEE8',
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
        paddingVertical: 5,
        paddingHorizontal: 13,
        borderRadius: 8,
        marginTop: 5,
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
    //modal styles
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeText: {
        fontSize: 24,
        paddingRight: 8,
        color: '#000',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        marginBottom: 20,
        color: '#4CAEE8',
    },
    button: {
        backgroundColor: '#E6E6E6',
        color: '#4CAEE8',
        width: 80,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 5,
        borderRadius: 7,
    },
    buttonText2: {
        fontSize: 16,
        color: 'black',
        marginVertical: 5,
    },
    buttonText3: {
        fontSize: 17,
        color: '#71A5FF',
        marginVertical: 5,
    },
    selectedButton: {
        backgroundColor: '#ADD8E6',

    },
    input: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        borderBottomWidth: 1,
        width: 100,
        padding: 5,
    },
    icon: {
        width: 30,
        height: 30,
        marginBottom: 5,
    },
    dateInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    submitButtonText: {
        fontSize: 18,
        color: '#fff',
    },
    selectedDateText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 20,
    },
});

export default Water_Intake;
