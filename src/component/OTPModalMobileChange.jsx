import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';

const OTPModalMobileChange = ({navigation, onClose}) => {
  const [verify, setVerify] = useState(false);
  const handleOtp = () => {
    setVerify(true);
    //Verification code
  };

  const handleUpdate = () => {
    onClose();
  };
  return (
    <View style={styles.container}>
      {verify === false && (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextInput
            maxLength={4}
            keyboardType="number-pad"
            style={styles.inputView}
            placeholder="Enter Otp "
          />

          <TouchableOpacity
            onPress={handleOtp}
            style={styles.touchableOpacitySignIn}>
            <Text style={styles.SignIn}>Verify</Text>
          </TouchableOpacity>
        </View>
      )}
      {verify === true && (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextInput
            keyboardType="number-pad"
            style={[styles.inputView]}
            placeholder="Enter New Contact Number"
          />
          <TouchableOpacity
            onPress={handleUpdate}
            style={[styles.touchableOpacitySignIn, {width: 150}]}>
            <Text style={styles.SignIn}>Update</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OTPModalMobileChange;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // justifyContent: 'center',
    // alignItems: 'center',
  },
  inputView: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'gray',
  },
  touchableOpacitySignIn: {
    backgroundColor: 'green',
    width: 100,
    height: 50,
    borderRadius: 25,
    marginTop: 15,
    marginLeft: 15,
    PaddingBottom: 50,
  },
  SignIn: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
});
