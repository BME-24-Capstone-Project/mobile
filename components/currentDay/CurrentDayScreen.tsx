import React = require("react");
import { SafeAreaView, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";

export const CurrentDayScreen = ({navigation, route}) => {

  const exercises = [
    {
      name: "One legged stair climb",
      description: "Description here",
      repetitions: 10,
      sets: 3,
    },
    {
      name: "Sit to stand",
      description: "Description here",
      repetitions: 10,
      sets: 3,
    },
    {
      name: "Walking",
      description: "Description here",
      repetitions: 10,
      sets: 3,
    },
  ]

  return (
    <SafeAreaView>
      <Text>Let's Exercise</Text>
      <Button style={{width: '75%', margin: 10}}  mode="contained" buttonColor="green"  onPress={() => console.log("Start Exercies")}> Start Session </Button>
    </SafeAreaView>
  );
};
