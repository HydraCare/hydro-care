import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, ScrollView, Modal, TextInput, Button, NativeSyntheticEvent, TextInputChangeEventData, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../header';
import bluetooth from './bluetooth';
import CalendarPicker from './calender_picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import BluetoothModal from './bluetooth';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { firestore } from './firebase';
import { getMonth } from 'date-fns';

const Water_Intake = ({ navigation }: { navigation: any }) => {
    const [userId, setUserId] = useState(""); // State for user ID
    const [waterGoal, setWaterGoal] = useState(0); // 目標摂取水分
    const [bottle, setBottle] = useState(1000); //ボトルの初期化 //容量 blue から
    const [count, setCount] = useState(100)   //水の飲んだ量
    const dailyGoal = 2000;
    const [amount, setAmount] = useState(0); // Lượng nước đã uống
    const [remaining, setRemaining] = useState(0); //目標の残り水量
    const [waterLevel, setWaterLevel] = useState(new Animated.Value(0));

    //firebase関連コード

    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                setUserId(user.uid);
                console.log(user.uid);
            } else {
                Alert.alert("Error", "User is not logged in.");
                console.log("not user");
                // navigation.navigate("Login");// ここにエラー出てる
            }
            if (userId) {
                const db = getFirestore();
                const userRef = doc(db, "users", userId);

                //一日水分摂取量の処理
                const day = new Date().getDate();
                const month = new Date().getMonth() + 1;
                const year = new Date().getFullYear();
                const DayLog = `${year}年${month}月${day}日`;
                try {
                    // ユーザーのドキュメント内に「oneDayAmount」サブコレクションを作成
                    const oneDayAmountRef = collection(userRef, "oneDayAmount");
                    const docRef = doc(oneDayAmountRef, DayLog);
                    await setDoc(docRef, {
                        AmountWaterDrunk: mount,
                    });
                    console.log("1日水分摂取量のデータが正常にFirestoreに追加されました");
                } catch (error) {
                    console.error("ドキュメントの追加エラー: ", error);
                }
                Amount_One_Day();
                //login count 合算処理
                try {
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const createdAt = userDoc.data().createdAt.toDate();
                        const timeDiff = new Date().getTime() - createdAt.getTime();
                        const loginCount = Math.floor(timeDiff / (1000 * 3600 * 24));
                        await setDoc(userRef, {
                            loginCount: loginCount,
                        }, { merge: true });
                        console.log("Login count updated successfully.");
                        // console.log(userDoc.data());
                        setWaterGoal((userDoc.data().waterGoal));
                        setRemaining((userDoc.data().waterGoal))
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                }
            }
        };
        fetchData(); // fetchData 呼び出し
    }, [navigation]);
    const Amount_One_Day = async () => {
        try {
            const userRef = doc(getFirestore(), "users", userId);
            const oneDayAmountRef = collection(userRef, "oneDayLog");
            const docRef = doc(oneDayAmountRef, "DayLog");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("error ", error);
        }
    };


    const addWater = (amountToAdd: number) => {
        const newAmount = amount + amountToAdd;
        const newRemaining = waterGoal - newAmount;

        // Cập nhật mức nước
        setAmount(newAmount);
        setRemaining(newRemaining);

        Animated.timing(waterLevel, {
            toValue: (newAmount / waterGoal) * 100, // Cập nhật tỷ lệ phần trăm cho mức nước
            duration: 1500, // Thời gian animation
            useNativeDriver: false, // Không sử dụng native driver vì ta thay đổi chiều cao
        }).start();
    };
    //引く処理
    const subWater = (amountSub: number) => {
        const newCount = bottle - amountSub; // Tính lượng nước đã uống sau khi trừ đi amountSub
        const newAmount = amount + amountSub;
        const newRemaining = waterGoal - newAmount; // Tính lượng nước còn lại cần uống

        // Cập nhật trạng thái
        setAmount(newAmount);
        setRemaining(newRemaining);

        Animated.timing(waterLevel, {
            toValue: (newAmount / waterGoal) * 100, // Tính tỷ lệ phần trăm mức nước
            duration: 1500,
            useNativeDriver: false,
        }).start();
    };
    // reset
    const reset = () => {
        setAmount(0);
        setRemaining(waterGoal);
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
    const [isEditing, setIsEditing] = useState(false);
    //水分自分で追加する関数
    const handleAmountChange = (value: string) => {
        if (value === "") {
            setMount(0);
        } else {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue)) {
                setMount(parsedValue);
            }
        }
    };
    const [modalBlue, setModalBlue] = useState(false);
    //bottle 登録関数
    const blue_bottle = () => {
        console.log("blue から受け取る");//blueのデータ受け取れたら、ここに表示
        setBottle(1500);
    }
    const bluetooth = () => {
        setModalBlue(!modalBlue);
    }
    const handleConnect = () => {
        console.log("Connecting to Bluetooth device...");
        bluetooth();
    };
    //Calendar 関数
    const [selectedDate, setSelectedDate] = useState<string>('');

    const handleDateChange = (date: string) => {
        setSelectedDate(date); //updated selected time and day
    };
    //飲んだ水量の処理
    const drunkTime = Timestamp.fromDate(new Date());
    const Genre = "水";
    const [amount_water, setAmount_water] = useState(0);
    const AmountChange = (value: string) => {
        if (value === "") {
            setAmount_water(0);
        } else {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue)) {
                setAmount_water(parsedValue);
            }
        }
    };
    const handleSubmit = async () => {

        try {
            const day = new Date().getDate();
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const DayLog = `${year}年${month}月${day}日`;
            const currentTimestamp = new Date().toISOString();
            // 送信ロジック（データを保存する、または状態を更新する）
            console.log(`Water Type: ${waterType}, Amount: ${mount}ml, Date: ${date}`);
            // ユーザーのドキュメントへの参照を作成
            const userRef = doc(firestore, "users", userId); // ユーザードキュメントへの参照
            // ユーザーのドキュメント内に「onedaylog」サブコレクションを作成
            const oneDayLogRef = collection(userRef, "oneDayLog");
            const docRef = doc(oneDayLogRef, currentTimestamp);  // currentTimestamp=> date
            // 「onedaylog」コレクションに新しいドキュメントを作成し、データを追加
            await setDoc(docRef, {
                waterDrunk: mount,
                drunkTime: new Date().getTime(),
                Genre: waterType
            });
            console.log("データが正常にFirestoreに追加されました！");
            setModalVisible(false); // 送信後、モーダルを閉じる
        } catch (error) {
            console.error("ドキュメントの追加エラー: ", error);
        }
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
                        <BluetoothModal visible={modalBlue} onClose={bluetooth} onConnect={handleConnect} />
                    </View>
                </View>

                <View style={styles.container}>
                    <Text style={styles.goalText}>一日の目標水分摂取 {waterGoal}ml</Text>

                    <View style={styles.bottleContainer}>
                        {/* <Image
                            source={require('@/assets/images/bottle.png')}
                            style={styles.bottle}
                        /> */}

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

                    <Text style={styles.amountText}>容量 : {bottle - amount}ml</Text>
                    {/* <TouchableOpacity onPress={() => addWater(100)} style={styles.addButton}>
                        <Text style={styles.buttonText}>Add 100ml</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={blue_bottle} style={styles.addButton}>
                        <Text style={styles.buttonText}>ボトル 登録</Text>
                    </TouchableOpacity>
                    <View style={styles.test} >
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={amount_water.toString()}
                            onChangeText={AmountChange}
                        />
                        <TouchableOpacity onPress={() => subWater(amount_water)} style={styles.addButton}>
                            <Text style={styles.buttonText}>引く</Text>
                        </TouchableOpacity>
                    </View>

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
            </ScrollView >

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
                                    keyboardType="numeric"
                                    value={mount.toString()}
                                    onChangeText={handleAmountChange}
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
    test: {
        flexDirection: 'row',
    },

    background: {
        backgroundColor: '#E6F2F9',
        flex: 1,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6F2F9',
        padding: 10,
    },
    // imageCalender: {
    //     width: 150,
    //     height: 40,

    // },
    goalText: {
        fontSize: 20,
        marginBottom: 15,
        fontWeight: 'bold'
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
    // bottleContainer: {
    //     position: 'relative',
    //     alignItems: 'center',
    //     justifyContent: 'flex-end',
    //     width: 100,
    //     height: 200,
    //     marginTop: 20,
    // },
    bottleContainer: {
        width: 120,
        height: 300, // Chiều cao chai nước
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden',
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
        marginTop: 10,
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
        margin: 8,
    },
    progressContainer: {
        width: '80%',
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 10,
        marginVertical: 20,
        paddingBottom: 10,
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
