import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Image,
  Alert
} from 'react-native';
import React, {useState,useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROUTES, getApiUrl } from '../api/Base';
import { Axios } from 'axios';
const Outcome = ({navigation, route}) => {
  const [outcome, setOutcome] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [note, setNotes] = useState('');
  const [positiveClosed, setPositiveClosed] = useState(false);
  const [negativeClosed, setNegativeClosed] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [amount, setAmount] = useState('0');
  const [employeeList,setEmployeeList] = useState([]);
  const [selectedEmployee,setSelectedEmployee] = useState(null);

  Geolocation.getCurrentPosition(position => {
    const data = position;
    setLatitude(`${data.coords.latitude}`);
    setLongitude(`${data.coords.longitude}`);
  });
  const {joblistId, userId,jobDataDate} = route.params;
  console.log('Line 37', userId);
  const outComeName = [
    'Positive',
    'Negative',
    'Neutral',
    'Positive Closed',
    'Negative Closed',
  ];
  useEffect (() => {
    fetch(getApiUrl(API_ROUTES.GET_EMPLOYEE_ID))
    .then((response) => response.json())
    .then((responseData) => {
      
      setEmployeeList(responseData.data);
      console.log(responseData.data,"Line 403");
    })
    .catch((error) => {
      console.log("Error fetching Data:Line 406",error.message)
    })
 },[]);

  const followUpName = ['Call', 'Mail', 'Visit','None'];

  
  const handleSubmit = async () => {

    if(outcome.trim() === ''){
      Alert.alert("Error", "Please Select the status ");
      return;
    }
    if(note.trim() === ''){
      Alert.alert("Error", "Please enter notes or Description ");
      return;
    }
    if(followUp.trim() === ''){
      Alert.alert("Error", "Please select Follow up method list ");
      return;
    }

    const postData = {
      employeeId: userId.toString(),
      joblistId: joblistId.toString(),
      outcome: outcome,
      notes: note,
      followupmethods: followUp,
      visitdate: date.toISOString().split('T')[0],
      visittime: date.toLocaleTimeString('en-US', {hour12: false}),
      latitude: latitude,
      longitude: longitude,
      purposeamount: amount,
      workwith:selectedEmployee,
    };
    console.log(postData, 'Line 58');

    const response = await fetch(getApiUrl(API_ROUTES.FOLLOW_UP), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const responseData = await response.json();
    console.log(responseData, 'Line 72');
    if (responseData.status === 200) {
      console.log('Data Added Sucessfully:', responseData.message);
      navigation.goBack();
    } 
  };

  const fetchAccountStatus = async () => {
    const response = await Axios.get(
      getApiUrl(API_ROUTES.ACCOUNT_STATUS + userData),
    );
    console.log(response.data, 'Line 22');
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
        console.log('Logout Status Change Sucessfully', 'Line 161');
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
    <View style={{flex: 1}}>
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
      <Text style={styles.title}>Lead Follow Up</Text>

      <ScrollView>
        <View style={styles.objectHolder}>
          {/* Select Outcome Like Positive, Negative,Neutral,Closed */}
          <View style={styles.inputView}>
            <Octicons name="workflow" size={24} color="gray" />
            <Picker
              style={styles.input}
              selectedValue={outcome}
              onValueChange={itemValue => setOutcome(itemValue)}>
              <Picker.Item label="Select Status" value="" />
              {outComeName.map((outComeName, index) => (
                <Picker.Item
                  key={index}
                  label={outComeName}
                  value={outComeName}
                />
              ))}
            </Picker>
          </View>
          {/* Description or notes */}
          <View style={styles.inputView}>
            <TextInput
              value={note}
              onChangeText={text => setNotes(text)}
              style={styles.input}
              multiline={true}
              placeholderTextColor={'black'}
              placeholder="Enter Notes"
            />
          </View>

          {/* Work With */}
          <View style={styles.inputView}>
            <FontAwesome5 name="network-wired" size={24} color="gray" />
            <Picker
                style={styles.input}
                selectedValue={selectedEmployee}
                onValueChange={item => setSelectedEmployee(item)}
                >
                <Picker.Item label="Select Work With" value="" 
                />
                {employeeList.map((name) => (
                  <Picker.Item
                    key={name.id}
                    label={name.name}
                    value={name.id}
                    
                  />
                ))}

              </Picker>
          </View>

          {/* Follow Up Picker */}
          {positiveClosed === false && (
            <View style={styles.inputView}>
              <Octicons name="workflow" size={24} color="gray" />
              <Picker
                style={styles.input}
                selectedValue={followUp}
                onValueChange={itemValue => setFollowUp(itemValue)}>
                <Picker.Item label="Next Follow Up Method" value="" />
                {followUpName.map((outComeName, index) => (
                  <Picker.Item
                    key={index}
                    label={outComeName}
                    value={outComeName}
                  />
                ))}
              </Picker>
            </View>
          )}

          {/* Date Picker */}
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.inputView}>
            <AntDesign name="calendar" size={24} color="gray" />
            <TextInput
              editable={false}
              value={date.toDateString()}
              style={styles.input}
              placeholder={`Please choose the Date `}
            />
          </TouchableOpacity>
          {/* Time Picker */}
          <TouchableOpacity
            style={styles.inputView}
            // onPress={() => setTimeOpen(true)}
          >
            <Entypo name="back-in-time" size={24} color="gray" />
            <TextInput
              editable={false}
              value={date.toTimeString()}
              style={styles.input}
              placeholder="choose time for fallow up"
            />
          </TouchableOpacity>
          {/* Pupose Amount */}
          <View style={styles.inputView}>
            <FontAwesome name="rupee" size={24} color="gray" />
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={text => setAmount(text)}
              placeholder="Purpose Amount"
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.TouchableOpacityStyle}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {open === true && (
        <DatePicker
          modal
          open={open}
          date={date}
          minimumDate={new Date()}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      )}
    </View>
  );
};

export default Outcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: '#2e509d',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  objectHolder: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  inputView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '80%',
    color:'black'
  },
  TouchableOpacityStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 15,
    width: '80%',
    borderRadius: 25,
    height: 65,
    marginBottom: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  container2: {
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2e509d',
  },
});
