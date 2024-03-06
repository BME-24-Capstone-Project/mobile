import React = require("react");
import { Alert, SafeAreaView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import axios from 'axios';
// import {decode as atob, encode as btoa} from "base-64"


export const LoginScreen = ({navigation}) => {

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");


  const login = () => {
    axios.post(`http://localhost:8080/auth/login`,{}, {  
      auth: {
        username,
        password
      }
    }).then((response) => {
      console.log(response)
      console.log(response.data);
      navigation.navigate('CurrentDayScreen')
    }).catch((error) => {
      console.log(error);
      Alert.alert(
        'Login Error',
        "Incorrect username or password.",
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
        },
      );
    })
  };
  const devLogin = () => {
    navigation.navigate('CurrentDayScreen')
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput style={{width: '75%', margin: 10}} mode='outlined' autoCapitalize='none' label="Username" autoCorrect={false} placeholder="Username" onChangeText={(t) => setUsername(t.toLowerCase())} />
      <TextInput style={{width: '75%', margin: 10}} mode='outlined' secureTextEntry={true} autoCapitalize='none' label="Password" autoCorrect={false} placeholder="Password" onChangeText={(t) => setPassword(t)}/>
      <Button style={{width: '75%', margin: 10}}  mode="contained" onPress={login}> Login </Button>
      <Button style={{width: '75%', margin: 10}}  mode="outlined" onPress={devLogin}> Dev login </Button>
    </SafeAreaView>
  );
};
