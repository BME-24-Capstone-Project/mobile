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
import { MD3LightTheme as DefaultTheme, Icon, PaperProvider } from "react-native-paper";
import { ExerciseInProgressScreen } from "./components/exerciseInProgressScreen/ExerciseInProgressScreen";
import { GlobalStyles, Colors } from "./common/data-types/styles";
import { Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCircle } from "@fortawesome/free-solid-svg-icons";

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
              // headerLeft: () => (
              //   <TouchableOpacity onPress>
              //     <FontAwesomeIcon size={30} icon={ faArrowLeft } />
              //   </TouchableOpacity>
              // )
              headerBackTitle: "Back"
           }}
          />
          <Stack.Screen
            name="ExerciseInProgressScreen"
            component={ExerciseInProgressScreen}
            options={{
              headerTitle: "Current Set",
              headerBackTitle: "Back",
              headerStyle: {
                backgroundColor: theme.colors.primary
              },
              headerTitleStyle: {
                ...GlobalStyles.appHeadingText,
                color: theme.colors.secondary
              },
            }}
            // options={{ title: "today" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
