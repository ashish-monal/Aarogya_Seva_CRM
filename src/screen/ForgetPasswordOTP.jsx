import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useRef} from 'react';

const ForgetPasswordOTP = ({navigation}) => {
  const [otpDigits, setOtp] = useState(['', '', '', '']);
  const [isResendEnabled, setResendEnabled] = useState(true);
  const otpInputRefs = useRef([]);

  const handleOTPChange = (index, text) => {
    if (text.length > 1) {
      text = text.charAt(text.length - 1);
    }

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = text;
    setOtp(newOtpDigits);

    if (text !== '') {
      if (index < otpDigits.length - 1) {
        otpInputRefs.current[index + 1].focus();
      } else {
        otpInputRefs.current[index].blur();
      }
    }
  };

  const handleResendOTP = () => {
    Alert.alert(
      'Resend OTP',
      'OTP Resend Sucessfully.please enter the otp again.',
    );
    //Logic to resend OTP, you can implement your logic here
    setResendEnabled(false);
    setTimeout(() => {
      setResendEnabled(true);
    }, 30000);
  };

  const handleVerifyOTP = () => {
    const enteredOTP = otpDigits.join('');
    if (enteredOTP.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4- digit OTP.');
    } else {
      // Logic to verify OTP, you can implement your own logic here
      Alert.alert('Success', 'OTP Verified Sucessfully.');
      navigation.navigate('PasswordChange');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>
        Please enter OTP to change password
      </Text>
      <View style={styles.otpContainer}>
        {otpDigits.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            placeholder="*"
            onChangeText={text => handleOTPChange(index, text)}
            value={digit}
            ref={ref => (otpInputRefs.current[index] = ref)}
          />
        ))}
      </View>
      <TouchableOpacity
        style={
          {
            justifyContent: 'center',
            alignSelf: 'center',
            width: '80%',
            height: 50,
            paddingHorizontal: 90,
            borderRadius: 25,
            backgroundColor: 'white',
          }[!isResendEnabled && styles.disabledButton]
        }
        onPress={handleResendOTP}>
        <Text style={[styles.SignIn, {color: 'red'}]}>Resend</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchableOpacitySignIn}
        onPress={handleVerifyOTP}>
        <Text style={styles.SignIn}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgetPasswordOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderBottomWidth: 1,
    fontSize: 18,
    textAlign: 'center',
  },
  touchableOpacitySignIn: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    width: '80%',
    height: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  SignIn: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
