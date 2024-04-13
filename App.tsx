/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./components/login/LoginScreen";
import { CurrentDayScreen } from "./components/currentDay/CurrentDayScreen";
import { MD3LightTheme as DefaultTheme, Icon, PaperProvider } from "react-native-paper";
import { ExerciseInProgressScreen } from "./components/exerciseInProgressScreen/ExerciseInProgressScreen";
import { GlobalStyles, Colors } from "./common/data-types/styles";
import { BluetoothTest } from "./components/BluetoothTest";
import { BluetoothConnectionIndicator } from "./components/BluetoothConnectionIndicator";
import { Device, Subscription } from "react-native-ble-plx";
import { Manager } from "./common/common";
import base64 from "base-64";

const Stack = createNativeStackNavigator();


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors
  },
};

function App(): JSX.Element {

  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null)

    useEffect(() => {
      let disconnectMonitor: Subscription | null = null;
        if (!connectedDevice) {
          disconnectMonitor = scanAndConnect()
        }
        return () => disconnectMonitor?.remove()
        
    }, [connectedDevice])

    const scanAndConnect = () => { 
      let disconnectMonitor: Subscription | null = null;
      console.log("Scan Started")
      Manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('Error while scanning devices');
          console.log(error);
          return scanAndConnect()
        }
        if (device?.name !== null) {
          console.log(device?.name)
        }
        
        if (device && (device.name === "ArthroSync Device 1" || device.localName === "ArthroSync Device 1" )) {
          device.connect().then(device => {
            console.log("Connected to: " + device.name)
            console.log(device.id)
            disconnectMonitor = device.onDisconnected((error, device) => {
              console.log("Device Disconnected")
              setConnectedDevice(null)
            })
            Manager.discoverAllServicesAndCharacteristicsForDevice(device.id).then((device) => {}).catch((err) => {
              console.log(err)
            })
            setConnectedDevice(device)
          }).catch(error => {
            console.log("Error connecting to device: ")
            console.log(error)
            Manager.stopDeviceScan()
          })
          Manager.stopDeviceScan()
        }
      });
      return disconnectMonitor
    }


  return (
   
    <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              options={{headerShown: false}}
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              name="CurrentDayScreen"
              component={CurrentDayScreen}
              options={{
                headerTitle: "Your Treatment Plan",
                headerStyle: {
                  backgroundColor: theme.colors.primary
                },
                headerTitleStyle: {
                  ...GlobalStyles.appHeadingText,
                  color: theme.colors.secondary
                },
                headerTintColor: 'white',
                headerBackTitleStyle: {
                  ...GlobalStyles.appHeadingText
                },
                headerBackTitle: "Back",
                headerRight: () => (BluetoothConnectionIndicator({connectedDevice: connectedDevice})),
                headerLargeTitle: true,
              }}
            />
            <Stack.Screen
              name="ExerciseInProgressScreen"
                children={(props) => <ExerciseInProgressScreen {...props} connectedDevice={connectedDevice}/>}
                options={{
                  headerTitle: "Current Set",
                  headerStyle: {
                    backgroundColor: theme.colors.primary
                  },
                  headerTitleStyle: {
                    ...GlobalStyles.appHeadingText,
                    color: theme.colors.secondary
                  },
                  headerTintColor: 'white',
                  headerBackTitleStyle: {
                    ...GlobalStyles.appHeadingText
                  },
                  headerBackTitle: "Back",
                  headerRight: () => (BluetoothConnectionIndicator({connectedDevice: connectedDevice})),
                  headerLargeTitle: true,
                }}
            />
          </Stack.Navigator>
        </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
