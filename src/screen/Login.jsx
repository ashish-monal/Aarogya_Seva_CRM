import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {getApiUrl, API_ROUTES} from '../api/Base'; //Import API
// Import Icons
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
// Import Async Storage for Saving the data into local storage
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import Geolocation for using location services
import Geolocation from '@react-native-community/geolocation';
// import axios for fetching API
import Axios from 'axios';

// Main Function
const Login = ({navigation}) => {
  // Varibale declaration
  const [username, setUserName] = useState(''); // Storing user Name
  const [password, setPassword] = useState(''); // Storing user password
  const [showPassword, setShowPassword] = useState(false); // variable for user password shown or hidden
  const [locationEnabled, setLocationEnabled] = useState(false); //Storing Location Details
  const [latitude, setlatitude] = useState(); // storing latitude value
  const [longitude, setLogitude] = useState(); // Storing longitude value
  const [clickCount, setClickCount] = useState(0); // Setting Button Active and inactive after sucessfull login

  // Check if the location is enabled
  const location = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocationEnabled(true);
        // console.log(position, 'Line 40');
        setlatitude(position.coords.latitude);
        setLogitude(position.coords.longitude);
      },
      error => {
        console.log(
          error,
          'Error while Setting up location coordinates Line 46',
        );
        setLocationEnabled(false);
      },
    );
  };
  //Fetch data from the database of login Status: -
  const loginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        //console.log(parsedUserData.username, 'Line 58');
        const userStatus = await Axios.get(
          getApiUrl(API_ROUTES.STATUS + parsedUserData.username),
        );
        // console.log(userStatus.data.loginstatus, 'login Status');

        const loginValue = userStatus.data.loginstatus;
        if (loginValue === 1) {
          navigation.replace('DrawerNavigation', {
            userData: parsedUserData,
          });
          // try {
          //   Geolocation.getCurrentPosition(async position => {
          //     setLocationEnabled(true);
          //     // console.log(position, 'Line 40');
          //     // console.log(position.coords.latitude, 'Line 69');
          //     // console.log(position.coords.longitude, 'Line 70');
          //     // console.log(parsedUserData.id, 'Line 71');
          //     try {
          //       const loginTimeResponse = await Axios.post(
          //         getApiUrl(API_ROUTES.USER_LOGIN_TIME),
          //         {
          //           employeeid: parsedUserData.id,
          //           latitude: position.coords.latitude,
          //           longitude: position.coords.longitude,
          //         },
          //       );
          //       console.log(loginTimeResponse.data, 'Line 82');
          //       // Checking Login Status

          //       navigation.replace('DrawerNavigation', {
          //         userData: parsedUserData,
          //       });
          //     } catch (error) {
          //       console.log(error.message, 'Error while Saving Log In time');
          //     }
          //   });
          // } catch (error) {
          //   console.log('Error Line 68', error);
          //   setLocationEnabled(false);
          // }
        } else {
          // console.log('Your login status is:', loginValue);
        }
      }
    } catch (error) {
      console.log("Error Line 101",error)
    }
  };

  // UseEffect for Checking for loging and userData
  useEffect(() => {
    location();
    loginStatus();
  }, []);

  // Handle Login Function
  const handleLogin = async () => {
    // Checking Location is enabled or not
    if (!locationEnabled) {
      Alert.alert('Location Alert', 'Please enable location services.');
      return;
    }
    // Checking UserName is empty or not
    if (username.trim() === '') {
      Alert.alert('Error', 'Please enter your User Name');
      return;
    }
    // checking Password field is empty or not
    if (password.trim() === '') {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    try {
      const response = await Axios.post(getApiUrl(API_ROUTES.AUTHORIZE_LOGIN), {
        username,
        password,
      });
      console.log(response.data, 'Line 107');
      if (response.data.status === 200) {
        const userData = response.data.data.employee;
        console.log(userData, 'Line 110');
        if (typeof userData === 'string') {
          try {
            userData = JSON.parse(userData);
          } catch (error) {
            console.log('Error parsing UserData Line 124:', error);
          }
        }
        setClickCount(clickCount + 1);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        navigation.replace('DrawerNavigation', {userData});
        try {
          console.log('Line 113', latitude, longitude);
          const loginTimeResponse = await Axios.post(
            getApiUrl(API_ROUTES.USER_LOGIN_TIME),
            {
              employeeid: userData.id,
              latitude: latitude,
              longitude: longitude,
            },
          );
          console.log(loginTimeResponse.data, 'Line 121');
        } catch (error) {
          console.log(error.message, 'Error while Saving Log In time');
        }
      } else {
        Alert.alert('Login Failed', response.data.message);
        try {
          const errorLogResponse = await Axios.post(
            getApiUrl(API_ROUTES.ERROR_LOG),
            {
              userid: username,
              action: 'Login',
              errorid: response.data.message,
            },
          );
          if (errorLogResponse.data.status === 200) {
            console.log('Line 135 Error Log Data Saved', errorLogResponse.data);
          }
        } catch (error) {
          console.log(
            'Line 139 Error while saving Error log Data',
            error.message,
          );
        }
      }
    } catch (error) {
      Alert.alert(error, 'Something Went Wrong');
      try {
        const errorLogResponse = await Axios.post(
          getApiUrl(API_ROUTES.ERROR_LOG),
          {
            userid: username,
            action: 'Login',
            errorid: error.message,
          },
        );
        if (errorLogResponse.data.status === 200) {
          console.log('Line 135 Error Log Data Saved', errorLogResponse.data);
        }
      } catch (error) {
        console.log(
          'Line 139 Error while saving Error log Data',
          error.message,
        );
      }
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title of the Application */}
      <Text style={[styles.title]}>Aarogya Seva CRM</Text>
      {/* Lgog image of the Application  */}
      <Image
        source={require('../../assests/aarogyasevalogo.png')}
        resizeMode="contain"
        style={styles.image}
      />
      {/* User Name input Box */}
      <View style={styles.inputView}>
        <Feather style={styles.icon} name="phone" size={24} color="gray" />
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={username}
          placeholderTextColor={'gray'}
          onChangeText={text => setUserName(text)}
        />
      </View>
      {/* Password Input Filed */}
      <View style={styles.inputView}>
        <MaterialIcons
          style={styles.icon}
          name="lock-outline"
          size={24}
          color="gray"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          keyboardType="default"
          secureTextEntry={showPassword === false ? true : false}
          value={password}
          placeholderTextColor={'gray'}
          onChangeText={text => setPassword(text)}
        />
        <Octicons
          style={styles.icon}
          name={showPassword == false ? 'eye-closed' : 'eye'}
          size={24}
          color="gray"
          onPress={() => {
            setShowPassword(!showPassword);
          }}
        />
      </View>
      {/* Forget Password Text */}
      <Text
        // onPress={() => navigation.navigate('ForgetPassword')}
        style={styles.fpassword}>
        Forget Password ?
      </Text>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={!locationEnabled || clickCount != 0}
        style={[
          styles.touchableOpacityContainer,
          !locationEnabled && {backgroundColor: 'gray'},
          clickCount && {backgroundColor: 'gray'},
        ]}>
        <Text style={styles.LoginText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f08518',
  },
  image: {
    width: '75%',
    height: 150,
  },
  icon: {
    marginTop: 10,
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
    color: 'gray',
  },
  touchableOpacityContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'green',
    width: '80%',
    height: 50,
    borderRadius: 25,
    marginTop: 15,
  },
  LoginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fpassword: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: 'red',
    marginVertical: 15,
  },
});
