import React = require("react");
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";

export const SettingsScreen = ({navigation, route}) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <SafeAreaView>
      <Text>Settings!</Text>
    </SafeAreaView>
  );
};
