// import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, ScrollView } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import Header from '../header';

// const Water_Intake = () => {
//     const dailyGoal = 2000; // 目標摂取水分
//     const [amount, setAmount] = useState(0); // Lượng nước đã uống
//     const [remaining, setRemaining] = useState(dailyGoal); // Lượng nước còn lại
//     const [waterLevel, setWaterLevel] = useState(new Animated.Value(0)); // Animated value cho mức nước

//     const addWater = (amountToAdd: number) => {
//         const newAmount = amount + amountToAdd;
//         const newRemaining = dailyGoal - newAmount;

//         // Cập nhật mức nước
//         setAmount(newAmount);
//         setRemaining(newRemaining);

//         Animated.timing(waterLevel, {
//             toValue: (newAmount / dailyGoal) * 100, // Cập nhật tỷ lệ phần trăm cho mức nước
//             duration: 500, // Thời gian animation
//             useNativeDriver: false, // Không sử dụng native driver vì ta thay đổi chiều cao
//         }).start();
//     };

//     // Hàm reset
//     const reset = () => {
//         setAmount(0);
//         setRemaining(dailyGoal);
//         setWaterLevel(new Animated.Value(0)); // Đặt lại mức nước
//     };

//     const [currentDate, setCurrentDate] = useState<string>('');
//     const [currentTime, setCurrentTime] = useState<string>('');

//     useEffect(() => {
//         const updateDateTime = () => {
//             const date = new Date();
//             const dayOfMonth = date.getDate();
//             const timeString = date.toTimeString().split(' ')[0].substring(0, 5);
//             setCurrentDate(dayOfMonth.toString() + "日");
//             setCurrentTime(timeString);
//         };

//         updateDateTime();
//         const intervalId = setInterval(updateDateTime, 60000);

//         // Dọn dẹp interval khi component unmount
//         return () => clearInterval(intervalId);
//     }, []);

//     const bluetooth = () => {
//         console.log("Bluetooth button clicked");
//     };

//     return (
//         <ScrollView style={styles.background}>
//             <Header title="水分摂取" back='' />
//             <View style={styles.dateTimeContainer}>
//                 <View style={styles.dateTimeLeft}>
//                     {/* <Image
//                         source={require('@/assets/images/calender.png')}
//                         style={styles.imageCalender}
//                     /> */}
//                     <Text style={styles.date}>{currentDate}</Text>
//                     <Text style={styles.time}>{currentTime}</Text>
//                 </View>
//                 <View style={styles.buttonsRight}>
//                     <TouchableOpacity onPress={() => addWater(100)}>
//                         <Image
//                             source={require('@/assets/images/plus.png')}  // Đặt đúng đường dẫn tới hình ảnh
//                             style={styles.image}
//                         />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => bluetooth()}>
//                         <Image
//                             source={require('@/assets/images/bluetooth.png')}  // Đặt đúng đường dẫn tới hình ảnh
//                             style={styles.image}
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <View style={styles.container}>
//                 <Text style={styles.goalText}>一日の目標水分摂取 {dailyGoal}ml</Text>

//                 <View style={styles.bottleContainer}>
//                     {/* Chai nước */}
//                     <Image
//                         source={require('@/assets/images/bottle.png')}
//                         style={styles.bottle}
//                     />
//                     <Animated.View
//                         style={[
//                             styles.water,
//                             {
//                                 height: waterLevel.interpolate({
//                                     inputRange: [0, 100],
//                                     outputRange: ['0%', '100%'], // Đặt chiều cao của mức nước
//                                 }),
//                             },
//                         ]}
//                     />
//                 </View>

//                 <Text style={styles.amountText}>容量 : {amount}ml</Text>
//                 <TouchableOpacity onPress={() => addWater(100)} style={styles.addButton}>
//                     <Text style={styles.buttonText}>ボトル登録</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={reset} style={styles.resetButton}>
//                     <Text style={styles.buttonText}>ボトル削除</Text>
//                 </TouchableOpacity>

//                 {/* <Text style={styles.goalText}>ここに通知が流れる </Text> */}


//                 <Text style={styles.progressText}>
//                     {amount}ml | {((amount / dailyGoal) * 100).toFixed(0)}% 残り: {remaining}ml
//                 </Text>
//                 <View style={styles.progressContainer}>
//                     <Animated.View
//                         style={[
//                             styles.progressBar,
//                             {
//                                 width: waterLevel.interpolate({
//                                     inputRange: [0, 100],
//                                     outputRange: ['0%', '100%'],
//                                 }),
//                             },
//                         ]}
//                     />
//                 </View>

//             </View>
//         </ScrollView>
//     );
// };


import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SERVICE_UUID = '7A0247E7-8E88-409B-A959-AB5092DDB03E';
const CHARACTERISTIC_UUID = '82258BAA-DF72-47E8-99BC-B73D7ECD08A5';

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any | null>(null);
  const [sensorData, setSensorData] = useState<number[]>([]);

  useEffect(() => {
    // BLE Managerの初期化
    BleManager.start({ showAlert: false })
      .then(() => console.log('BleManager Initialized'))
      .catch((error) => console.error('BleManager Initialization Error:', error));

    requestPermissions();

    // イベントリスナー登録
    const handleDiscoverPeripheral = (device: any) => {
      console.log('Discovered Device:', device);
      setDevices((prevDevices) => {
        if (!prevDevices.find((d) => d.id === device.id)) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    };

    const handleStopScan = () => {
      console.log('Scan stopped');
      setIsScanning(false);
    };

    const handleUpdateValue = ({ value }: { value: number[] }) => {
      console.log('Received Data:', value);
      setSensorData(value);
    };

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValue);

    return () => {
      // クリーンアップ：イベントリスナーの解除
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      bleManagerEmitter.removeAllListeners('BleManagerStopScan');
      bleManagerEmitter.removeAllListeners('BleManagerDidUpdateValueForCharacteristic');
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]).catch((err) => console.error('Permission Request Error:', err));
      } else {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).catch((err) =>
          console.error('Permission Request Error:', err)
        );
      }
    }
  };

  const startScan = () => {
    setDevices([]);
    setIsScanning(true);

    BleManager.scan([SERVICE_UUID], 10, true)
      .then(() => {
        console.log('Scanning...');
      })
      .catch((error) => {
        console.error('Scan Error:', error);
        Alert.alert('Error', 'Failed to start scanning.');
        setIsScanning(false);
      });
  };

  const connectToDevice = (deviceId: string) => {
    BleManager.connect(deviceId)
      .then(() => {
        console.log('Connected to:', deviceId);
        setConnectedDevice(deviceId);

        BleManager.retrieveServices(deviceId).then((peripheralInfo) => {
          console.log('Peripheral Info:', peripheralInfo);

          BleManager.startNotification(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID)
            .then(() => {
              console.log('Notification started');
            })
            .catch((error) => console.error('Notification Error:', error));
        });
      })
      .catch((error) => {
        console.error('Connection Error:', error);
        Alert.alert('Error', 'Failed to connect to the device.');
      });
  };

  const renderDevice = ({ item }: { item: any }) => (
    <View style={styles.device}>
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Button title="Connect" onPress={() => connectToDevice(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Communication</Text>
      <Button title={isScanning ? 'Scanning...' : 'Start Scan'} onPress={startScan} disabled={isScanning} />
      {connectedDevice && (
        <View style={styles.sensorData}>
          <Text style={styles.title}>Connected to: {connectedDevice}</Text>
          <Text>Sensor Data: {sensorData.join(', ')}</Text>
        </View>
      )}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDevice}
        style={styles.deviceList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  deviceList: {
    marginTop: 20,
  },
  device: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  deviceName: {
    fontSize: 18,
  },
  sensorData: {
    marginTop: 20,
  },
});

export default App;



// const styles = StyleSheet.create({
//     background: {
//         backgroundColor: '#E6F2F9',
//         flex: 1,
//     },
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#E6F2F9',
//         padding: 20,
//     },
//     // imageCalender: {
//     //     width: 150,
//     //     height: 40,

//     // },
//     goalText: {
//         fontSize: 18,
//         marginBottom: 10,
//     },
//     dateTimeContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//     },
//     dateTimeLeft: {
//         justifyContent: 'flex-start',
//         alignItems: 'flex-start',
//     },
//     date: {
//         paddingLeft: 5,
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     time: {
//         paddingLeft: 8,
//         fontSize: 15,
//         color: 'gray',
//     },
//     buttonsRight: {
//         paddingRight: 10,
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         alignItems: 'flex-end',
//     },
//     image: {
//         width: 40,
//         height: 40,
//         marginTop: 5,
//     },
//     bottle: {
//         width: 100,
//         height: 200,
//         marginTop: 5,
//     },
//     bottleContainer: {
//         position: 'relative',
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//         width: 100,
//         height: 200,
//         marginTop: 20,
//     },
//     water: {
//         position: 'absolute',
//         bottom: 0,
//         width: '100%',
//         backgroundColor: '#ADD8E6',
//     },
//     amountText: {
//         fontSize: 18,
//         marginBottom: 10,
//     },
//     progressText: {
//         marginTop: 20,
//         fontSize: 18
//     },
//     buttonText: {
//         fontSize: 18,
//         color: 'blue',
//         marginVertical: 5,
//     },
//     addButton: {
//         backgroundColor: '#ADD8E6',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 8,
//     },
//     resetButton: {
//         backgroundColor: '#f44336',
//         paddingVertical: 8,
//         paddingHorizontal: 15,
//         borderRadius: 8,
//         marginTop: 10,
//     },
//     progressContainer: {
//         width: '80%',
//         height: 20,
//         backgroundColor: '#ccc',
//         borderRadius: 10,
//         marginVertical: 10,
//     },
//     progressBar: {
//         height: '100%',
//         backgroundColor: '#1B94DA',
//         borderRadius: 10
//     },
// });

// export default Water_Intake;

