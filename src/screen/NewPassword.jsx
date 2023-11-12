import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

const NewPassword = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordConfirm = () => {
    Alert.alert('Password Update Sucessfully');
    navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>
        Update Password
      </Text>
      <View style={{marginVertical: 25}}>
        <View style={styles.inputView}>
          <MaterialIcons
            style={{marginTop: 10}}
            name="lock-outline"
            size={24}
            color="black"
          />
          <TextInput
            style={[styles.input, {width: '90%'}]}
            placeholder="Enter New Password"
            keyboardType="default"
            secureTextEntry={showPassword === false ? true : false}
            value={password}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={styles.inputView}>
          <MaterialIcons
            style={{marginTop: 10}}
            name="lock-outline"
            size={24}
            color="black"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            keyboardType="default"
            secureTextEntry={showPassword === false ? true : false}
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
          />
          <Octicons
            style={{marginTop: 10}}
            name={showPassword == false ? 'eye-closed' : 'eye'}
            size={24}
            color="black"
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={passwordConfirm}
          style={styles.touchableOpacitySignIn}>
          <Text style={styles.SignIn}>Update Password </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    flexDirection: 'row',
    width: '80%',
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'gray',
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '80%',
  },
  touchableOpacitySignIn: {
    marginVertical: 25,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '80%',
    height: 50,
    paddingHorizontal: 90,
    borderRadius: 25,
    backgroundColor: 'green',
  },
  SignIn: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
