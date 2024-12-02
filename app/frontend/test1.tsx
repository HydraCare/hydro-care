import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const App: React.FC = () => {
  const [manager] = useState(new BleManager());

  useEffect(() => {
    manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        console.log('Bluetooth is powered on');
        scanForDevices();
        return;
      }
    }, true);

    return () => {
      manager.destroy();
    };
  }, [manager]);

  const scanForDevices = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if (device) {
        console.log('Discovered device:', device);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      console.log('Scan stopped');
    }, 5000); // Dừng quét sau 5 giây
  };

  return (
    <View>
      <Text>Bluetooth BLE Example</Text>
      <Button title="Scan for devices" onPress={scanForDevices} />
    </View>
  );
};

export default App;
