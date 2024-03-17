import {useEffect, useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {BleManager, Characteristic, Device} from 'react-native-ble-plx';
import base64 from 'base-64';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const manager = new BleManager();


export const BluetoothConnectionIndicator = () => {

    const [connectedDevice, setConnectedDevice] = useState<Device>();
    // const [data, setData] = useState();

    useEffect(() => {
        
        manager.isDeviceConnected
      }, [])

    function scanAndConnect() {
      console.log("Scan Started")
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          // Handle error (scanning will be stopped automatically)
          console.log('Error while scanning devices');
          console.log(error);
          return;
        }
        if (device && (device.id == "08A17802-5E6A-8BB9-FA8F-2B9B3F4D3765" || device.name === "ESP32_BLE" || device.localName === "ESP32_BLE" )) {
          device.connect().then(device => {
            console.log("Connected to: " + device.name)
            setConnectedDevice(device)
            device.discoverAllServicesAndCharacteristics()
          }).catch(error => {
            console.log("Error connecting to device: ")
            console.log(error)
            manager.stopDeviceScan()
          })
          manager.stopDeviceScan()
        }
      });
    }

    function stopAndDisconnect() {
      manager.stopDeviceScan()
      connectedDevice?.cancelConnection().then((device) => {
        console.log(device.name + " disconnected")
      }).catch(error => {
        console.log("Error disconnecting the device: ")
        console.log(error)
      })
    }

    function readDevicesServices() {
      if (connectedDevice) {
        manager.servicesForDevice(connectedDevice?.id).then((services) => {
          console.log(services[0].characteristics().then((characteristic) => {
            characteristic[0].monitor((_, updatedChar) => {
              if (updatedChar !== null && updatedChar.value !== null) {
                console.log(base64.decode(updatedChar.value))
              }

            })
          }))
        }).catch((error) => {
          console.log("Error getting services:")
          console.log(error)
        })
      }

      // connectedDevice?.services().then((services) => {
      //   console.log("Services: ")
      //   console.log(services)
      // }).catch((error) => {
      //   console.log("Error getting services:")
      //   console.log(error)
      // })
    }

    return (
      <View>
          <TouchableOpacity>
              <FontAwesomeIcon size={20} style={{color: "#1FD655"}}icon={ faCircleExclamation } />
          </TouchableOpacity>
      </View>
    );
};