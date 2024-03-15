import { Alert, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import axios from 'axios';
import { login } from "../../queries/login";
import { useState } from "react";
import { GlobalStyles } from "../../common/data-types/styles";
// import {decode as atob, encode as btoa} from "base-64"


export const LoginScreen = ({navigation}: {navigation: any}) => {

  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    axios.post(`http://localhost:8080/auth/login`,{}, {  
      auth: {
        username,
        password
      }
    }).then((response) => {
      axios.defaults.headers.common = {
        "x-access-token": response.data.access_token,
      };
      navigation.navigate('CurrentDayScreen', {
        access_token: response.data.access_token
      })
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

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.secondary}}>
      <Image style={styles.image} source={require('../../assets/arthrosync-logo.png')}/>
      <View style={styles.loginContainer}>
        <TextInput style={styles.textInput} mode='outlined' autoCapitalize='none' label="Username" autoCorrect={false} placeholder="Username" onChangeText={(t) => setUsername(t.toLowerCase())} />
        <TextInput style={styles.textInput} mode='outlined' secureTextEntry={true} autoCapitalize='none' label="Password" autoCorrect={false} placeholder="Password" onChangeText={(t) => setPassword(t)}/>
        <Button style={{width: '75%', margin: 10}}  mode="contained" onPress={login}> 
          <Text style={GlobalStyles.buttonText}>
            Login 
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  image: {
    height: '25%',
    width: '100%',
    alignSelf: 'center',
  },
  loginContainer: {
    width: "100%",
    alignItems: 'center', 
    justifyContent: 'center'
  },
  textInput: {
    width: '75%', 
    margin: 10, 
    backgroundColor: 'white',
  },
  loginButton: {
    fontSize: 20,
    fontWeight: 'bold'
  },
});
