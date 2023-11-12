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
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Axios } from 'axios';
import {API_ROUTES, getApiUrl} from '../api/Base';

const SelfJobAssignedDetails = ({navigation, route}) => {
  const {item, userData} = route.params;
  console.log(route,"Line 20");
  const [date, setDate] = useState(new Date());
  const [finalDate,setFinalDate] = useState()
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [achievement, setAchievement] = useState('');
  
  
  console.log('Line 6', item);
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

  //   console.log('Line 7', userData.id);

  // const logoutAPI = async () => {
  //   const postData = {
  //     employee_id: userData.id.toString(),
  //   };
  //   console.log(postData, 'Line 24');

  //   const logoutStatus = await fetch(
  //     getApiUrl(API_ROUTES.LOGOUT),
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(postData),
  //     },
  //   );

  //   if (logoutStatus.status === 200) {
  //     const responseJSON = await logoutStatus.json();
  //     console.log(responseJSON.message);
  //   } else {
  //     console.log('Failed to change the status', error);
  //   }
  // };

  // const handleLogout = async () => {
  //   try {
  //     Geolocation.getCurrentPosition(
  //       async position => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
         

  //         const postData = {
  //           employeeid: userData.id,
  //           latitude: latitude.toString(),
  //           longitude: longitude.toString(),
  //         };
  //         // console.log(postData,"Line 22")
  //         const logoutTimeResponse = await fetch(
  //           getApiUrl(API_ROUTES.USER_LOGOUT_TIME),
  //           {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify(postData),
  //           },
  //         );
  //         // console.log(logoutTimeResponse,"Line 32")
  //         if (logoutTimeResponse.status === 200) {
  //           const responseJson = await logoutTimeResponse.json();
  //          logoutAPI()
  //           console.log(responseJson.message);
  //         } else {
  //           console.log('Failed to save logout time');
  //         }
  //         AsyncStorage.removeItem('userData');
  //         navigation.replace('Login');
  //       },
  //       error => {
  //         console.log('Error getting location:', error);
  //       },
  //     );
  //   } catch (error) {
  //     console.log('Error while logging out:', error);
  //   }
  // };

  // const autologout = async () => {
  //   try {
  //     Geolocation.getCurrentPosition(
  //       async position => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  //         console.log('latitude:', latitude, 'longitude:', longitude);

  //         const postData = {
  //           employeeid: userData.id.toString(),
  //           latitude: latitude.toString(),
  //           longitude: longitude.toString(),
  //         };
  //         console.log(postData, 'Line 78');
  //         const logoutTimeResponse = await fetch(
  //           getApiUrl(API_ROUTES.USER_LOGOUT_TIME),
  //           {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify(postData),
  //           },
  //         );

  //         if (logoutTimeResponse.status === 200) {
  //           const responseJson = await logoutTimeResponse.json();
  //          logoutAPI()
  //           console.log(responseJson.message, 'Line 89');
  //         } else {
  //           console.log('Failed to save logout Time Line 91');
  //         }
  //         AsyncStorage.removeItem('userData');
  //         navigation.replace('Login');
  //       },
  //       error => {
  //         console.log('Error getting location:Line 97', error);
  //       },
  //     );
  //   } catch (error) {
  //     console.log(error, 'Line 101 error while logging out');
  //   }
  //   logoutAPI();
  // };

  // const midnightLogout = async () => {
  //   const currentTime = new Date();
  //   // Calculate the time remaining untill midnight (00:00:00)
  //   const midnight = new Date(currentTime);
  //   midnight.setHours(24, 0, 0, 0); // Set the time to midnight

  //   const timeUnilMidnight = midnight - currentTime;

  //   setTimeout(() => {
  //     autologout();
  //     Alert.alert('Your are going to logout ');
  //   }, timeUnilMidnight);
  // };

  // useEffect(() => {
  //   const timerId = setTimeout(() => {
  //     autologout();
  //   }, 10800000);
  //   return () => {
  //     clearTimeout(timerId);
  //   };
  // });

  // midnightLogout();

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

  const handleSubmit = async (JobId, userId) => {
    console.log(JobId, 'Line 151');
    // console.log(userId,"Line 152")
    if (achievement.trim() === '') {
      Alert.alert('Error', 'Please Enter the achievement');
      return;
    }
    const postData = {
      achievement: achievement,
      closuredate: item.closuredate === null ? formateDate(date): item.closuredate,
    
    };
    console.log(postData, 'Line 159');
    try {
      const response = await axios.put(
        getApiUrl(
          API_ROUTES.TOUR_PLANNING + '/' + JobId.id + API_ROUTES.PLAN + userId,
        ),
        postData,
      );
      console.log(response.data, 'Line 160');
      if (response.status === 200) {
        console.log('Sent Sucessfully Line 167', date);
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error submitting Clouser Date Line 170', error);
    }
  };

  return (
    <View style={{backgroundColor:'white',flex:1}}>
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
      <Text style={styles.heading}>Self Job Assigned Details</Text>
      <View>
        <TouchableOpacity
          style={styles.inputView}
          onPress={() => {
            if (item.closuredate == null) {
              setShowDatePicker(true);
            } else {
              Alert.alert(
                'Already Submitted Clouser Date. You can submit only one time.',
              );
            }
          }}>
          <Entypo
            style={{marginTop: 10}}
            name="calendar"
            size={24}
            color="gray"
          />
          <TextInput
          value={item.closuredate === null ? formateDate(date): item.closuredate}
            onChangeText={text => {setDate(text)
           setFinalDate(text)
            }}
            style={styles.input}
            placeholder={item.closuredate
              ? finalDate // If closuredate is available, show it as a placeholder
              : 'Enter closure date' }
            placeholderTextColor="black"
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {/* achievement */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            value={achievement}
            onChangeText={text => setAchievement(text)}
            placeholderTextColor="gray"
            placeholder="Enter achievement Details"
          />
        </View>



        <TouchableOpacity
          style={styles.touchableOpacityContainer}
          onPress={() => handleSubmit(item, userData.id)}>
          <Text style={styles.LoginText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelfJobAssignedDetails;

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
