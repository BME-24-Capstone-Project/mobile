/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import type { PropsWithChildren } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./components/login/LoginScreen";
import { CurrentDayScreen } from "./components/currentDay/CurrentDayScreen";
import { MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";

const Stack = createNativeStackNavigator();


// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '',
//     secondary: '',
//     tertiary: '',
//   },
// };

function App(): JSX.Element {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="Login"
            component={LoginScreen}
            // options={{ title: "Welcome" }}
          />
          <Stack.Screen
            name="CurrentDayScreen"
            component={CurrentDayScreen}
            // options={{ title: "today" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
