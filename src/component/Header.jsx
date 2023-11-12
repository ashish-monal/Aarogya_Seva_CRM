import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  AppState,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {API_ROUTES, getApiUrl} from '../api/Base';
import Axios from 'axios';

const Header = ({navigation, userData}) => {
  console.log(userData, 'Line 20');

  const fetchAccountStatus = async () => {
    const response = await Axios.get(
      getApiUrl(API_ROUTES.ACCOUNT_STATUS + userData),
    );
    // console.log(response.data, 'Line 22');
    if (response.data.accountstatus === 1) {
    } else {
      // autologout();
      AsyncStorage.removeItem('userData');
      navigation.replace('Login');
    }
  };
  useEffect(() => {
    fetchAccountStatus();

    const interval = setInterval(fetchAccountStatus, 60 * 1000); // Check every 10 second

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const Drawer = () => {
    navigation.openDrawer();
  };

  const autologout = async () => {
    try {
      const postData = {
        employee_id: userData.toString(),
      };
      console.log(postData, 'Line 190');
      const logoutStatus = await fetch(getApiUrl(API_ROUTES.LOGOUT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      // console.log(logoutStatus,"Line 157");
      if (logoutStatus.status === 200) {
        const responseJSON = await logoutStatus.json();
        console.log(responseJSON.message);
        console.log('Logout Status Change Sucessfully', 'Line 161');
        try {
          Geolocation.getCurrentPosition(async position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const postData = {
              employeeid: userData.toString(),
              latitude: latitude.toString(),
              longitude: longitude.toString(),
            };
            console.log(postData, 'Line 188');
            const logoutTimeResponse = await fetch(
              getApiUrl(API_ROUTES.USER_LOGOUT_TIME),
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
              },
            );
            if (logoutTimeResponse.status === 200) {
              // const responseJson = await logoutTimeResponse.json();
              AsyncStorage.removeItem('userData');
              navigation.replace('Login');
              console.log(' logout time Save Sucessfully Line 189');
            } else {
              console.log('Falied to save logout time Line 228');
            }
          });
        } catch (error) {
          console.log(error, 'Line 224');
        }
      } else {
        console.log('Failed to change the status', error);
      }
    } catch (error) {
      console.log('You are not logging today Line 203', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={Drawer}>
        <FontAwesome name="bars" size={50} color="#00bc4c" />
      </TouchableOpacity>

      <Image
        source={require('../../assests/aarogyasevalogo.png')}
        resizeMode="contain"
        style={{width: '50%', height: 100}}
      />
      <TouchableOpacity onPress={autologout}>
        <Entypo name="log-out" size={50} color="#f08518" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
