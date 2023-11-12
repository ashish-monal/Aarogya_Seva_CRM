import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from '@react-native-community/geolocation';
import {API_ROUTES, getApiUrl} from '../api/Base';
import { Axios } from 'axios';
const ClouserDate = ({navigation, route}) => {
  const {item, userId, dateClose,achivement} = route.params;
  const [date, setDate] = useState(new Date());
  const [previousAchivement, setPreviousAchivement] = useState(achivement)
  const [achievement, setAchievement] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  
  console.log(achivement,"Line 11")
  console.log(dateClose, 'Line 22');
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formateDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const fetchAccountStatus = async () => {
    const response = await Axios.get(
      getApiUrl(API_ROUTES.ACCOUNT_STATUS + userData),
    );
    console.log(response.data, 'Line 47');
    if (response.data.accountstatus === 1) {
    } else {
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
        employee_id: userId.toString(),
      };
      console.log(postData, 'Line 68');
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
        console.log('Logout Status Change Sucessfully', 'Line 80');
        try {
          Geolocation.getCurrentPosition(async position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const postData = {
              employeeid: userId.toString(),
              latitude: latitude.toString(),
              longitude: longitude.toString(),
            };
            console.log(postData, 'Line 91');
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
              console.log(' logout time Save Sucessfully Line 106');
            } else {
              console.log('Falied to save logout time Line 108');
            }
          });
        } catch (error) {
          console.log(error, 'Line 112');
        }
      } else {
        console.log('Failed to change the status', error);
      }
    } catch (error) {
      console.log('You are not logging today Line 118', error);
    }
  };

  const handleSubmit = async jobId => {
    if(achievement.trim() === ''){
      Alert.alert("Error", "Please Enter the Achivement Data to Submit or Update the Details.");
      return;
    }
    console.log(jobId, 'Line 23');
    console.log('Selected Date Line 41', formateDate(date));
    try {
      const response = await axios.put(
        getApiUrl(API_ROUTES.JOB + jobId + API_ROUTES.ACTUAL_CLOSURE),
        {actualclosure: formateDate(date), achievement: `${previousAchivement}\n${achievement}`},
      );
      if (response.status == 200) {
        console.log('Sent Sucessfully', 'Line 47', date);
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error submitting Clousure Date:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
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
      <Text style={styles.heading}>Closure Details Section</Text>

      <TouchableOpacity
        style={styles.inputView}
        onPress={() => setShowDatePicker(true)}>
        <TextInput
          value={formateDate(date)}
          onChangeText={text => setDate(text)}
          style={styles.input}
          placeholder="Enter Closure Date"
          placeholderTextColor="black"
          editable={false}
        />
      </TouchableOpacity>
      <View style={styles.inputView}>
        <TextInput
          style={[styles.input]}
          value={achievement}
          onChangeText={text => setAchievement(text)}
          placeholder="Enter Achivement Details"
        />
      </View>
      {showDatePicker && (
        <DateTimePicker
          maximumDate={new Date()}
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TouchableOpacity
        style={styles.touchableOpacityContainer}
        onPress={() => handleSubmit(item)}>
        <Text style={styles.LoginText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ClouserDate;

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2e509d',
    backgroundColor: 'white',
  },
  heading: {
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
    height:'auto',
  },
  touchableOpacityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'green',
    width: '80%',
    height: 50,
    borderRadius: 25,
    marginVertical: 15,
  },
  LoginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
