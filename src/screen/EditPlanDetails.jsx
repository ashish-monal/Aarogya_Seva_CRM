import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Axios } from 'axios';
import {getApiUrl, API_ROUTES} from '../api/Base';
const EditPlanDetails = ({navigation, route}) => {
  const [area, setArea] = useState('');
  const [targetCall, setTargetCall] = useState('');

  const {item, userData} = route.params;
  console.log('Line10', item);
  console.log('Line 11', userData);
  
  const fetchAccountStatus = async () => {
    const response = await Axios.get(
      getApiUrl(API_ROUTES.ACCOUNT_STATUS + userData),
    );
    console.log(response.data, 'Line 22');
    if (response.data.accountstatus === 1) {
    } else {
      // autologout();
      AsyncStorage.removeItem('userData');
      navigation.replace('Login');
    }
  };
  useEffect(() => {
    fetchAccountStatus();

    const interval = setInterval(fetchAccountStatus, 10 * 1000); // Check every 10 second

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);



  const autologout = async () => {
    try {
      const postData = {
        employee_id: userData.id.toString(),
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
              employeeid: userData.id.toString(),
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


  const handleSubmit = async (JobId, userId) => {
    console.log('Line 126', JobId);
    console.log('Line 127', userId);
    if(area.trim() ===''){
      Alert.alert("Error","Enter the Area Details");
      return;
    }
    if(targetCall.trim() ===''){
      Alert.alert("Error","Enter the target call");
      return;
    }

    const postData = {
      area: area,
      targetcall: targetCall
    };
    console.log("Line 140", postData);

    try{
        const response = await axios.put(getApiUrl(API_ROUTES.TOUR_PLANNING+"/"+JobId.id+API_ROUTES.AREA+userId),postData);
        console.log(response.data,"Line 145");
        if(response.status ===200) {
          console.log(response.data,"lINE 147");
            console.log('Sent Successfully Line 147');
            navigation.goBack();
        }
    }catch (error) {
        console.log('Error submitting Data Line 151', error);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container2}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={50} color="#00bc4c" />
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
      <Text style={styles.title}>Edit Plan Details</Text>
      {/* Area Details */}
      <View style={styles.inputView}>
        <TextInput
          value={area}
          style={styles.input}
          placeholderTextColor="gray"
          placeholder="Enter new Area Details"
          onChangeText={text => setArea(text)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={targetCall}
          style={styles.input}
          placeholderTextColor="gray"
          placeholder="Enter new Target Call"
          onChangeText={text => setTargetCall(text)}
        />
      </View>
      <TouchableOpacity
        style={styles.touchableOpacityContainer}
        onPress={() => handleSubmit(item, userData.id)}>
        <Text style={styles.LoginText}>Submit</Text>
      </TouchableOpacity>

      
    </View>
  );
};

export default EditPlanDetails;

const styles = StyleSheet.create({
  container2: {
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2e509d',
  },
  title: {
    color: '#2e509d',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  inputView: {
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    width: '65%',
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#f08518',
    width: '50%',
    height: 50,
    borderRadius: 25,
    marginVertical: 15,
  },
  LoginText: {
    color: '#2e509d',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
