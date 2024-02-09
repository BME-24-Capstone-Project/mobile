import React = require("react")
import { Button, SafeAreaView, TextInput, View } from "react-native";

export const LoginScreen = () => {

    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const login = () => {
        console.log(username, password)
    }
  
    return (
      <SafeAreaView>
        <TextInput autoCorrect={false}>
            Username
        </TextInput>
        <TextInput autoCorrect={false}>
            Password
        </TextInput>
        <TextInput>Bluetooth Test Component</TextInput>
        <Button title="Login" onPress={login} />
      </SafeAreaView>
    );
  };