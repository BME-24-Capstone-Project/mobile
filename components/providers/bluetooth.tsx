import React, {useState, useContext, createContext, useEffect} from 'react'
import { BleManager, Device } from 'react-native-ble-plx'



const bluetoothContext = createContext<{
    connectedDevice: Device | null,
    scanAndConnect: Function
}>({
    connectedDevice: null,
    scanAndConnect: () => {},
})

export const BluetoothProvider = ({children}) => {
    const bluetooth = useProvideBluetooth()
    return <bluetoothContext.Provider value={bluetooth}>{children}</bluetoothContext.Provider>
}

export const useBluetooth = () => {
    return useContext(bluetoothContext)
}

const useProvideBluetooth = () => {
    
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)

    useEffect(() => {
        if (!connectedDevice) {
            scanAndConnect()
        }
    }, [connectedDevice])

    const scanAndConnect = () => {
        console.log("Scan Started")
        manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.log('Error while scanning devices');
            console.log(error);
            return;
          }
          if (device?.name !== null) {
            console.log(device?.name)
          }
          
          if (device && (device.name === "ArthroSync Device 1" || device.localName === "ArthroSync Device 1" )) {
            device.connect().then(device => {
              console.log("Connected to: " + device.name)
              console.log(device.id)
              device.onDisconnected((error, device) => {
                console.log("Device Disconnected")
                setConnectedDevice(null)
              })
              setConnectedDevice(device)
            }).catch(error => {
              console.log("Error connecting to device: ")
              console.log(error)
              manager.stopDeviceScan()
            })
            manager.stopDeviceScan()
          }
        });
      }

    return {
        connectedDevice,
        scanAndConnect,
    }
}