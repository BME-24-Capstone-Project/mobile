import {useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
import {BleManager, Characteristic, Device} from 'react-native-ble-plx';
import base64 from 'base-64';
import { AirbnbRating, Rating } from 'react-native-ratings';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../common/data-types/styles';
import { Manager } from '../common/common';


export const BluetoothTest = () => {

  const [connectedDevice, setConnectedDevice] = useState<Device>();
  // const [data, setData] = useState();

  function scanAndConnect() {
    console.log("Scan Started")
    Manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.log('Error while scanning devices');
        console.log(error);
        return;
      }
      if (device?.name !== null) {
        console.log(device?.name)
      }
      
      if (device && (device.id == "08A17802-5E6A-8BB9-FA8F-2B9B3F4D3765" || device.name === "ArthroSync Device 1" || device.localName === "ArthroSync Device 1" )) {
        device.connect().then(device => {
          console.log("Connected to: " + device.name)
          console.log(device.id)
          Manager.isDeviceConnected(device.id).then((response) => {
            console.log("Device connected?")
            console.log(response)
          }).catch((error) => {
            console.log(error)
          })
          setConnectedDevice(device)
          device.discoverAllServicesAndCharacteristics()
        }).catch(error => {
          console.log("Error connecting to device: ")
          console.log(error)
          Manager.stopDeviceScan()
        })
        Manager.stopDeviceScan()
      }
    });
  }

  function stopAndDisconnect() {
    Manager.stopDeviceScan()
    connectedDevice?.cancelConnection().then((device) => {
      console.log(device.name + " disconnected")
    }).catch(error => {
      console.log("Error disconnecting the device: ")
      console.log(error)
    })
  }

  function readDevicesServices() {
    if (connectedDevice) {
      Manager.servicesForDevice(connectedDevice?.id).then((services) => {
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
      <Text>Bluetooth Test Component</Text>
      <Button title="Click for devices" onPress={scanAndConnect} />
      <Button title="Click to stop scan and disconnect" onPress={stopAndDisconnect} />
      {connectedDevice && <Button title="Read device services" onPress={readDevicesServices} />
      }
      <Text>{}</Text>
      {/* <Rating
        type='custom'
        ratingImage={(<FontAwesomeIcon icon={faStar}/>)}
        ratingColor='#3498db'
        ratingBackgroundColor='#c8c7c8'
        ratingCount={10}
        imageSize={30}
        onFinishRating={(rating) => console.log(rating)}
        style={{ paddingVertical: 10 }}
      /> */}
    </View>
  );
};
