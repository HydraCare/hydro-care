import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, PermissionsAndroid, Platform, Alert, Modal, TouchableOpacity } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';

interface BluetoothModalProps {
    visible: boolean;
    onClose: () => void;
    onConnect: () => void;
}
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const SERVICE_UUID = '7A0247E7-8E88-409B-A959-AB5092DDB03E';
const CHARACTERISTIC_UUID = '82258BAA-DF72-47E8-99BC-B73D7ECD08A5';

const BluetoothModal: React.FC<BluetoothModalProps> = ({ visible, onClose, onConnect }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [devices, setDevices] = useState<any[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<any | null>(null);
    const [sensorData, setSensorData] = useState<number[]>([]);

    useEffect(() => {
        // BLE Manager initialization
        BleManager.start({ showAlert: false })
            .then(() => console.log('BleManager Initialized'))
            .catch((error) => console.error('BleManager Initialization Error:', error));

        requestPermissions();

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
            // Cleanup: remove listeners
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

        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
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
                    {/* Button to connect */}
                    <TouchableOpacity onPress={onConnect} style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>

                    {/* Close Button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

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
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },

    connectButton: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
    },
    connectButtonText: {
        color: "white",
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#333",
        fontSize: 16,
    },
});

export default BluetoothModal;
