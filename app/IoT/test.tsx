import React, { useEffect, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { View, Text, Button } from 'react-native';
import { Buffer } from 'buffer';  // 必要に応じて追加（データのエンコーディング用）


const BluetoothExample = () => {
    const [manager] = useState(new BleManager());
    const [device, setDevice] = useState<Device | null>(null);
    const [receivedNumber, setReceivedNumber] = useState<number | null>(null);

    // デバイスのスキャン＆接続
    const scanAndConnect = () => {
        manager.startDeviceScan(null, null, (error, scannedDevice) => {
            if (error) {
                console.error(error);
                return;
            }
            // scannedDevice が存在し、その name プロパティが 'ESP32Test' かどうかをチェック
            if (scannedDevice?.name === 'ESP32Test') {  // Optional chaining を使用してnullチェック
                manager.stopDeviceScan();
                scannedDevice.connect()
                    .then((connectedDevice) => {
                        setDevice(connectedDevice);
                        return connectedDevice.discoverAllServicesAndCharacteristics();
                    })
                    .catch(error => {
                        console.error("Connection error", error);
                    });
            }
        });
    };

    // 数字の送信
    const sendNumber = async (number: number) => {
        if (!device) {
            console.error('Device not found');
            return;
        }

        // ESP32のサービスUUIDとキャラクタリスティックUUID
        const serviceUUID = 'your-service-uuid';  // ESP32のサービスUUIDに置き換え
        const characteristicUUID = 'your-characteristic-uuid';  // ESP32のキャラクタリスティックUUIDに置き換え

        try {
            // 送信するデータ（数字）をバッファに変換
            const data = Buffer.from([number]);  // 数値をバッファに変換
            await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, data.toString('base64'));

            // 数値を受信（サンプルとして簡略化）
            const characteristic = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
            const receivedValue = characteristic.value; // 受信データを取得
            if (receivedValue) {
                const parsedValue = Buffer.from(receivedValue, 'base64').readUInt8(0); // 受信データを数値に変換
                setReceivedNumber(parsedValue);
            } else {
                console.warn("Received value is null");
            }
        } catch (error) {
            console.error('Error during communication', error);
        }
    };

    return (
        <View>
            <Button title="Connect to ESP32" onPress={scanAndConnect} />
            <Button title="Send Number 42" onPress={() => sendNumber(42)} />
            <Text>Received Number: {receivedNumber}</Text>
        </View>
    );
};

export default BluetoothExample;
