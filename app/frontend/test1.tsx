import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, ScrollView, Modal, TextInput, Button, NativeSyntheticEvent, TextInputChangeEventData, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../header';
import CalendarPicker from './calender_picker';
// import Icon from 'react-native-vector-icons/FontAwesome';
import BluetoothModal from './bluetooth';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import { getAuth } from 'firebase/auth';

const Water_Intake = () => {
  const [userId, setUserId] = useState(""); // State for user ID
  const [waterGoal, setWaterGoal] = useState(0); // 目標摂取水分
  const dailyGoal = 3000;
  const [remaining, setRemaining] = useState(0); //目標の残り水量

  const [amount, setAmount] = useState(1000); //水の飲んだ量
  const [Total_amount, setTotalAmount] = useState(0); //水の飲んだ総合量
  const [bottle, setBottle] = useState(0); //ボトルの初期化 //容量 blue から
  const [botle_rest, setBottle_rest] = useState(0)//ボトルの残り水
  const [bottleRemaining, setBottleRemaining] = useState(bottle);
  const [waterLevel, setWaterLevel] = useState(new Animated.Value(0));
  const [sensorData, setSensorData] = useState<number[]>([]);
  const [blueBoolean, setBlueBoolean] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); //登録したしてないかの状態
  const [waterLevel2, setWaterLevel2] = useState(new Animated.Value(0));

  let total = 0;
  const [totalDay, setTotalDay] = useState(0);
  const [blue_data, setBlueData] = useState(0);  //the tich ban dau
  const [blue_data2, setBlueData2] = useState(0);  //luong nuoc da uong 
  const [blue_data3, setBlueData3] = useState(0);  //the tich con lai


  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        console.log(user.uid);
        const currentTimestamp = new Date();
        console.log(currentTimestamp)
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
        console.log(DayLog);
        try {
          // ユーザーのドキュメント内に「oneDayAmount」サブコレクションを作成
          const oneDayAmountRef = collection(userRef, "oneDayAmount");
          const docRef = doc(oneDayAmountRef, DayLog);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const existingData = docSnapshot.data();
            setTotalDay(docSnapshot.data().AmountWaterDrunk)
            console.log("ドキュメントは既に存在しています:", docSnapshot.data().AmountWaterDrunk);
          } else {
            await setDoc(docRef, {
              AmountWaterDrunk: totalDay,
              day: DayLog
            });
            console.log("AmountWaterDrunk documentFirestoreに追加されました");
          }
        } catch (error) {
          console.error("ドキュメントの追加エラー: ", error);
        }

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
  }, [userId]);
  const handleDataUpdate = (data: number) => {
    if (data > blue_data3) {
      // Nếu lượng nước còn lại tăng lên, báo lỗi và bỏ qua xử lý
      console.log("error data:", data);
      Alert.alert(
        "データエラー",
        "残りの水量が無効です。ボトルを再登録してください。",
        [{ text: "OK", onPress: () => console.log("アラートを閉じました") }]
      );
      return;
    }
    // if (!blueBoolean) return; // Không làm gì nếu `blueBoolean` là false
    if (data >= 0 && data <= blue_data) {
      // Tính toán lượng nước đã uống
      const drankAmount = blue_data3 - data;

      // Cập nhật trạng thái
      setBlueData2(drankAmount); // Lượng nước đã uống
      setBlueData3(data); // Lượng nước còn lại trong chai
      update_water(drankAmount);
      // Cập nhật animation mức nước
      Animated.timing(waterLevel, {
        toValue: (drankAmount / blue_data) * 100, // Tính tỷ lệ phần trăm
        duration: 1500, // Thời gian animation
        useNativeDriver: false, // Không sử dụng native driver
      }).start();
    } else {
      console.log("Dữ liệu không hợp lệ:", data);
    }
    // if (data > 0) {
    //   setBlueData3(data)
    //   setBlueData2(blue_data3 - data);
    //   subWater(blue_data - data, data);

    //   // const updatedBottleRest = bottle - data; // Lượng nước còn lại trong chai
    //   // const updatedAmount = amount + data; // Tổng lượng nước đã uống
    //   // const updatedRemaining = waterGoal - updatedAmount; // Lượng nước còn thiếu so với mục tiêu

    //   // // setBottle_rest(updatedBottleRest); // Cập nhật chai
    //   // setAmount(updatedAmount); // Cập nhật tổng lượng nước đã uống
    //   // setRemaining(updatedRemaining); // Cập nhật lượng nước cần uống

    //   // Animated.timing(waterLevel, {
    //   //     toValue: (updatedAmount / waterGoal) * 100,
    //   //     duration: 1500,
    //   //     useNativeDriver: false,
    //   // }).start();3

    //   // console.log("飲んだ水の量:", blue_data - data, "残りの水:",);
    // } else {
    //   console.log("Bluetoothデータが無効:", data);
    // }
  };
  console.log("飲んだ水の量:", blue_data2, "残りの水:", blue_data3);
  //test
  const handleBluetoothConnection = (initialVolume: number) => {
    if (initialVolume > 0) {
      // Đặt giá trị ban đầu cho chai
      setBlueData(initialVolume);
      setBlueData2(0); // Chưa uống nước nào
      setBlueData3(initialVolume); // Lượng nước còn nguyên
      setWaterLevel(new Animated.Value(0)); // Mức nước bắt đầu từ 0

      console.log("Kết nối Bluetooth thành công! Thể tích ban đầu:", initialVolume);
    } else {
      console.log("Dữ liệu không hợp lệ từ Bluetooth:", initialVolume);
    }
  };
  console.log("飲んだ量:", blue_data2);
  //引く処理
  // const subWater = (amountSub: number, data: number) => {
  //   // const newCount = count - amountSub; // Tính lượng nước đã uống sau khi trừ đi amountSub
  //   const newAmount = amount + amountSub;
  //   const newRemaining = dailyGoal - newAmount; // Tính lượng nước còn lại cần uống

  //   // Cập nhật trạng thái
  //   setAmount(newAmount);
  //   setRemaining(newRemaining);

  //   // Cập nhật mức nước với animation
  //   Animated.timing(waterLevel, {
  //     toValue: (blue_data2 / blue_data) * 100, // Tính tỷ lệ phần trăm mức nước
  //     duration: 1500, // Thời gian animation
  //     useNativeDriver: false, // Không sử dụng native driver vì chúng ta đang thay đổi chiều cao
  //   }).start();
  // };
  Animated.timing(waterLevel2, {
    toValue: (totalDay / dailyGoal) * 100, // Tính tỷ lệ phần trăm
    duration: 1500, // Thời gian animation
    useNativeDriver: false, // Không sử dụng native driver
  }).start();
  // console.log(amount);
  // reset
  const reset = () => {

    setBlueData(0); // Đặt lại dung tích chai
    setBlueData2(0); // Đặt lại lượng nước đã uống
    setBlueData3(0); // Đặt lại lượng nước còn lại
    setWaterLevel(new Animated.Value(0)); // Đặt lại mức nước
    // setWaterLevel2(new Animated.Value(0));
    console.log("Reset thành công!");

    // // setAmount(0);
    // setRemaining(dailyGoal);
    // setWaterLevel(new Animated.Value(0)); // Đặt lại mức nước
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

  const today = new Date();
  // console.log(today.getMinutes())
  // console.log(`${today.getFullYear()}年${String(today.getMonth() + 1).padStart(2, '0')}月${String(today.getDate()).padStart(2, '0')}日`)
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
  const [modalBlue, setModalBlue] = useState(false);
  const bluetooth = () => {
    setModalBlue(!modalBlue);
  }
  const handleConnect = () => {
    console.log("Connecting to Bluetooth device...");
    bluetooth(); // Đóng modal sau khi kết nối
  };
  //Calendar 関数
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (date: string) => {
    setSelectedDate(date); // Cập nhật ngày khi người dùng chọn
  };


  const update_water = async (data: number) => {
    try {

      setTotalDay(totalDay + data)
      console.log("data", data);
      const today = new Date();
      const day = `${today.getFullYear()}年${String(today.getMonth() + 1).padStart(2, "0")}月${String(today.getDate()).padStart(2, "0")}日`;
      const userRef = doc(firestore, "users", "LvZSXkPb2IbW2Cq82oRbCOdnYnt1");
      const oneDayLogRef = collection(userRef, "oneDayLog");
      const docRef = doc(oneDayLogRef, today.toISOString());
      await setDoc(docRef, {
        waterDrunk: data,
        drunkTime: today,
        day: day,
        hour: today.getHours(),
        minute: today.getMinutes(),
        Genre: waterType,
      });

      //update 総合量
      const day1 = new Date().getDate();
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const DayLog = `${year}年${month}月${day1}日`;
      const oneDayAmount = collection(userRef, "oneDayAmount");
      const docRef_A = doc(oneDayAmount, DayLog);
      await setDoc(docRef_A, {
        AmountWaterDrunk: totalDay + data,
        day: DayLog
      });
      // if (docSnapshot.exists()) {
      //   const existingData = docSnapshot.data().AmountWaterDrunk;
      //   await setDoc(docRef, {
      //     AmountWaterDrunk: totalDay,

      //   });
      //   // setTotalDay(docSnapshot.data().AmountWaterDrunk)
      //   console.log(".AmountWaterDrunk update:", existingData);
      // } else {
      //   return;
      // }

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
            {/* <BluetoothModal visible={modalBlue} onClose={bluetooth} onConnect={handleConnect} /> */}
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.goalText}>一日の目標水分摂取 {dailyGoal}ml</Text>

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

                    outputRange: blue_data > 0
                      ? ['100%', '0%'] // Nếu `bluedata` có giá trị và lớn hơn 0
                      : ['0%', '100%'], // Nếu `bluedata` không có giá trị hoặc bằng 0
                  }),
                },
              ]}
            />
          </View>

          <Text style={styles.amountText}>容量 : {blue_data3}ml</Text>
          <TouchableOpacity onPress={() => handleBluetoothConnection(1010)} style={styles.addButton}>
            <Text style={styles.buttonText}>ボトル 登録</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDataUpdate(850)} style={styles.addButton}>
            <Text style={styles.buttonText}>飲んだ水の量</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={reset} style={styles.resetButton}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>

          {/* <Text style={styles.goalText}>ここに通知が流れる </Text> */}
          <Text style={styles.progressText}>
            {totalDay}ml | {((totalDay / dailyGoal) * 100).toFixed(0)}% 残り: {remaining - totalDay}ml
          </Text>
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {

                  width: waterLevel2.interpolate({
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
