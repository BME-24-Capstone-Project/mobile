import React = require("react");
import { Alert, SafeAreaView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import axios from 'axios';
// import {decode as atob, encode as btoa} from "base-64"


export const LoginScreen = ({navigation}) => {

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState("");


  const login = () => {
    // if (username === "acourche" && password === "test") {
    //   console.log(username, password);
    //   navigation.navigate('CurrentDayScreen', {username: username})
    // } else {
    //   setLoginError("Incorrect username or password.")
    //   Alert.alert(
    //     'Login Error',
    //     loginError,
    //     [
    //       {
    //         text: 'Ok',
    //         style: 'cancel',
    //       },
    //     ],
    //     {
    //       cancelable: true,
    //     },
    //   );
    // }
    axios.post(`http://localhost:8080/auth/login`,{}, {  
      auth: {
        username,
        password
      }
    }).then((response) => {
      console.log(response)
      console.log(response.data);
      navigation.navigate('CurrentDayScreen', {username: username})
    }).catch((error) => {
      console.log(error);
      setLoginError("Incorrect username or password.")
      Alert.alert(
        'Login Error',
        loginError,
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

    // axios.get(`http://localhost:8080/auth/test`).then((response) => {
    //   console.log(response.data);
    // }).catch((error) => {
    //   console.log(error);
    // })
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput style={{width: '75%', margin: 10}} autoCapitalize='none' label="Username" autoCorrect={false} placeholder="Username" onChangeText={(t) => setUsername(t.toLowerCase())} />
      <TextInput style={{width: '75%', margin: 10}} secureTextEntry={true} autoCapitalize='none' label="Password" autoCorrect={false} placeholder="Password" onChangeText={(t) => setPassword(t)}/>
      <Button style={{width: '75%', margin: 10}}  mode="contained" onPress={login}> Login </Button>
    </SafeAreaView>
  );
};
