import {React, useEffect} from 'react';
import {Button, Text, View} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

const manager = new BleManager();

export const BluetoothTest = () => {
  // useEffect(() => {
  //   const subscription = manager.onStateChange(state => {
  //     if (state === 'PoweredOn') {
  //       scanAndConnect();
  //       subscription.remove();
  //     }
  //   }, true);
  //   return () => subscription.remove();
  // });

  return (
    <View>
      <Text>Bluetooth Test Component</Text>
      <Button title="Click for devices" onPress={scanAndConnect} />
    </View>
  );
};

function scanAndConnect() {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      // Handle error (scanning will be stopped automatically)
      console.log('Error while scanning devices');
      console.log(error);
      return;
    }
    if (device) {
      console.log(device);
    }

    // manager.stopDeviceScan()

    // Proceed with connection.
  });
}
