import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {API_ROUTES, getApiUrl} from '../api/Base';
import { Axios } from 'axios';
const ClosedDetailsScreen = ({navigation, route}) => {
  const {jobData, userId, followups} = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const fetchAccountStatus = async () => {
    const response = await Axios.get(
      getApiUrl(API_ROUTES.ACCOUNT_STATUS + userData),
    );
    console.log(response.data, 'Line 26');
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
        console.log('Logout Status Change Sucessfully', 'Line 62');
        try {
          Geolocation.getCurrentPosition(async position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const postData = {
              employeeid: userId.toString(),
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
              console.log(' logout time Save Sucessfully Line 89');
            } else {
              console.log('Falied to save logout time Line 90');
            }
          });
        } catch (error) {
          console.log(error, 'Line 94');
        }
      } else {
        console.log('Failed to change the status', error);
      }
    } catch (error) {
      console.log('You are not logging today Line 100', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      // Simulating a delay for demonstration purposes
      setRefreshing(false);
    }, 2000);
  };

  const renderFollowupItem = ({item}) => (
    <View style={styles.followupItem}>
      <Text style={styles.followupText}>Date: {item.visitdate}</Text>
      <Text style={styles.followupText}>
        Follow Up Methood: {item.followupmethods}
      </Text>
      <Text style={styles.followupText}>Discussion Notes: {item.notes}</Text>
      <Text style={styles.followupText}>Status: {item.outcome}</Text>

      {/* Render other followup data here */}
    </View>
  );

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
      <Text style={styles.heading}>Candidate Details</Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            width: '100%',
            flexDirection: 'column',
            marginVertical: 25,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            gap: 15,
            backgroundColor: 'white',
          }}>
          <Image source={require('../../assests/user-image.png')} />
          <View style={{flexDirection: 'row', gap: 5}}>
            <View style={styles.design}>
              <Text style={styles.text}>Name</Text>
              <Text style={styles.text}>
                {jobData.title} {jobData.firstname} {jobData.middlename}{' '}
                {jobData.lastname}
              </Text>
            </View>
            <View style={styles.design}>
              <Text style={styles.text}>Address</Text>
              <Text style={styles.text}>{jobData.address}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.design}>
              <Text style={styles.text}>Background</Text>
              <Text style={styles.text}>{jobData.background}</Text>
            </View>
            <View style={styles.design}>
              <Text style={styles.text}>Background Sector</Text>
              <Text style={styles.text}>{jobData.backgroundsector}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.design}>
              <Text style={styles.text}>Email</Text>
              <Text style={styles.text}>{jobData.email}</Text>
            </View>
            <View style={styles.design}>
              <Text style={styles.text}>Mobile Number</Text>
              <Text style={styles.text}>{jobData.mobile}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.design}>
              <Text style={styles.text}>Discussion</Text>
              <Text style={styles.text}>{jobData.discussion}</Text>
            </View>
            <View style={styles.design}>
              <Text style={styles.text}>Date For Follow Up</Text>
              <Text style={styles.text}>{jobData.dateforfollowup}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.design}>
              <Text style={styles.text}>Time For Follow Up</Text>
              <Text style={styles.text}>{jobData.timeforfollowup}</Text>
            </View>
            <View style={styles.design}>
              <Text style={styles.text}>Follow Method</Text>
              <Text style={styles.text}>{jobData.followup}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.design}>
              <Text style={styles.text}>Status</Text>
              <Text style={styles.text}>{jobData.outcome}</Text>
            </View>
            <View style={styles.design}>
              <Text style={styles.text}>Landmark</Text>
              <Text style={styles.text}>{jobData.landmark}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.design}>
              <Text style={styles.text}>Business Amount</Text>
              <Text style={styles.text}>{jobData.purposeamount}</Text>
            </View>
            <View style={styles.design}>
              <Text style={styles.text}>Source</Text>
              <Text style={styles.text}>{jobData.source}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: 10}}>
            <View style={styles.design}>
              <Text style={styles.text}>Prospect</Text>
              <Text style={styles.text}>{jobData.prospect}</Text>
            </View>
          </View>
        </View>

        <View style={styles.followupsContainer}>
          <Text style={styles.heading}>Follow Ups</Text>

          <FlatList
            data={followups}
            renderItem={renderFollowupItem}
            keyExtractor={item => item.id.toString()}
            style={{flex: 1}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ClosedDetailsScreen;

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
  text: {
    fontWeight: '700',
    fontSize: 16,
    color: 'black',
  },
  followupsContainer: {
    marginVertical: 25,
    marginHorizontal: 50,
  },
  followupItem: {
    borderWidth: 2,
    borderColor: '#f08518',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    elevation: 5,
  },
  followupText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  design: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    borderColor: '#2e509d',
    flexDirection: 'column',
    justifyContent: 'center',
    shadowColor: 'black',
    elevation: 15,
    backgroundColor: 'white',
    gap: 5,
    alignItems: 'center',
  },
});
