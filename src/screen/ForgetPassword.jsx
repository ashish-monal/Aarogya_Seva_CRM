import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
const ForgetPassword = ({navigation}) => {
  const [mobileNumber, setMobileNumber] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forget Password</Text>

      <View style={styles.inputView}>
        <Feather style={{marginTop: 10}} name="phone" size={24} color="gray" />
        <TextInput
          style={styles.input}
          placeholder="Registerd Mobile Number"
          keyboardType="number-pad"
          maxLength={10}
          value={mobileNumber}
          onChangeText={text => setMobileNumber(text)}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgetPasswordOTP')}
        style={styles.touchableOpacityButton}>
        <Text style={styles.ButtonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
  },
  inputView: {
    flexDirection: 'row',
    width: '80%',
    marginVertical: 25,
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
  touchableOpacityButton: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    width: '80%',
    height: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  ButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
