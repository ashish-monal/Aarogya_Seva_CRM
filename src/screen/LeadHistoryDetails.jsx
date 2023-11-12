import {StyleSheet, Text, View, TouchableOpacity, Image,FlatList} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import React,{useEffect} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {API_ROUTES, getApiUrl} from '../api/Base';
import { Axios } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LeadHistoryDetails = ({navigation, route}) => {
  const { userId,userData,followupDetails} = route.params;
  console.log(userData,"Line 12");

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
      <Text style={{textAlign:'center',fontSize:24, color: '#2e509d',fontWeight:'bold'}}>Lead History Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.subtitle}>Follow-up Details List</Text>
        {followupDetails.length > 0 ? (
          <FlatList
            data={followupDetails}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.followupItem}>
                <Text style={styles.text2}>Date: {item.Date}</Text>
                <Text style={styles.text2}>Action: {item.Action}</Text>
                <Text style={styles.text2}>Discussion: {item.Discussion}</Text>
                <Text style={styles.text2}>Status: {item.Status}</Text>
                <Text style={styles.text2}>Revenue: {item.Revenue}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.text2}>No follow-up details available.</Text>
        )}
      </View>
    </View>
  );
};

export default LeadHistoryDetails;

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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  detailsContainer: {
    margin: 15,
   paddingBottom:50,
  },
  subtitle: {
    color: '#2e509d',
    textAlign:'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  followupItem: {
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 2,
    padding: 10,
    borderColor:'orange',
    backgroundColor:'white',
    gap:5
  },
  text2:{color:'gray',fontSize:18}
});
