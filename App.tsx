/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./components/login/LoginScreen";
import { CurrentDayScreen } from "./components/currentDay/CurrentDayScreen";
import { MD3LightTheme as DefaultTheme, Modal, PaperProvider, Text } from "react-native-paper";
import { ExerciseInProgressScreen } from "./components/exerciseInProgressScreen/ExerciseInProgressScreen";
import { GlobalStyles, Colors } from "./common/data-types/styles";

const Stack = createNativeStackNavigator();


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors
  },
};

function App(): JSX.Element {
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
              headerLeft: () => <></>
           }}
          />
          <Stack.Screen
            name="ExerciseInProgressScreen"
            component={ExerciseInProgressScreen}
            // options={{ title: "today" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
