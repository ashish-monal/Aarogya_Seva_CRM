import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../component/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {API_ROUTES, getApiUrl} from '../api/Base';
const MonthPlan = ({navigation, userData}) => {
  // console.log(userData,"Line 21");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [area, setArea] = useState('');
  const [targetCall, setTargetCall] = useState('');
  const [location, setLocation] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        getApiUrl(
          API_ROUTES.TOUR_PLANNING +
            '/' +
            userData.id +
            API_ROUTES.BY_EMPLOYEE_ID,
        ),
      );
      const data = await response.json();
      if (response.ok) {
       console.log(data, 'Line 43');
        const sortedData = data.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        setJobData(sortedData);
      } else {
        console.log('Error fetching Data Line 49', data.message);
      }
    } catch (error) {
      console.log('Error fetching Data Line 52', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredJobData = jobData.filter(
    item => item.approval === 1 && item.tourstatus != 1,
  );

  const locationName = [
    'Head Quater (HQ)',
    'Ex Station (EX)',
    'Out Station',
    'Area',
  ];

  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);

  const formatDate = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' : ''}${month}-${day< 10 ? '0': ''}${day}`;
  };

  const fetchUnavailableDates = async () => {
    try {
      const response = await fetch(getApiUrl(API_ROUTES.TOUR_PLANNING));
      if (response.ok) {
        const json = await response.json();
        const dates = json.data.map(item => item.date);
        setUnavailableDates(dates);
        console.log(unavailableDates, 'Line 95');
      } else {
        console.log('API request failed with status Line 97:', response.status);
      }
    } catch (error) {
      console.log('API request failed with error Line 100:', error);
    }
  };
  useEffect(() => {
    fetchUnavailableDates();
  }, [selectedDate]);

  useEffect(() => {
    fetchUnavailableDates();
  }, []);


  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };
  
  const handleSubmit = async () => {
     console.log(unavailableDates,"Line 115")
    if (unavailableDates.includes(selectedDate.toISOString().slice(0, 10))) {
      Alert.alert(
        'Date is not Accepted',
        'Please Choose another date.',
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedDate(new Date());
              setShowStartDatePicker(true);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      if (area.trim() === '') {
        Alert.alert("Error",'Please Enter Area');
        return;
      }
      if (targetCall.trim() === '') {
        Alert.alert("Error",'Please Enter Target Call');
        return;
      }
      if (location.trim() === '') {
        Alert.alert("Error",'Please Select location');
        return;
      }

      const postData = {
        reportto: userData.reportto,
        createdby: userData.id.toString(),
        location: location,
        date: formatDate(selectedDate),
        area: area,
        targetcall: targetCall,
      };
      console.log(postData, 'Line 144');
      try {
        const response = await fetch(getApiUrl(API_ROUTES.TOUR_PLANNING), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
        if (response.ok) {
          const responseData = await response.json();
          console.log('API RESPONSE LINE 164', responseData);
          Alert.alert('Monthly Plan Sheet Submitted Sucessfully');
          // setSelectedDate(new Date());
          setArea('');
          setTargetCall('');
          setLocation('');
          navigation.navigate('Lead List');
        } else {
          console.log(
            'API Request failed with status Line 173',
            response.status,
          );
        }
      } catch (error) {
        console.log('API Request Failed with Error Line 178', error);
      }
    }
    //console.log('Error Line 181');
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} userData={userData.id} />
      <Text style={styles.heading}>Submit Monthly Plan Details</Text>
      <ScrollView>
        <View style={styles.form}>
           <TouchableOpacity 
            onPress={() => setShowStartDatePicker(true)}
            style={styles.inputView}>
            <AntDesign name="calendar" size={22} color="gray" />
            <TextInput
              editable={false}
              style={styles.input}
              placeholder="Choose Date"
              onChangeText={text => setSelectedDate(text)}
              value={selectedDate.toISOString().slice(0, 10)}
            />
          </TouchableOpacity> 
          {/* Area */}
          <View style={styles.inputView}>
            <AntDesign name="areachart" size={22} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Area"
              value={area}
              onChangeText={text => setArea(text)}
            />
          </View>

          {/* Enter Target Call */}
          <View style={styles.inputView}>
            <Foundation name="target-two" size={22} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Target Call"
              value={targetCall}
              placeholderTextColor="gray"
              onChangeText={text => setTargetCall(text)}
            />
          </View>

          {/* HQ/EX/Out Station */}
          <View style={styles.inputView}>
            <FontAwesome name="location-arrow" size={24} color="gray" />
            <Picker
              style={styles.input}
              selectedValue={location}
              onValueChange={itemValue => setLocation(itemValue)}>
              <Picker.Item
                label="Select Location"
                value=""
                placeholderTextColor="gray"
              />
              {locationName.map((locationNames, index) => (
                <Picker.Item
                  key={index}
                  label={locationNames}
                  value={locationNames}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.TouchableOpacityStyle}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.TouchableOpacityStyle}
            onPress={handleRefresh}>
            <Text style={styles.buttonText}>Referesh</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredJobData}
          keyExtractor={item => item.id.toString()}
          refreshing={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          renderItem={({item}) => (
            <View style={styles.inputView2}>
              <Text style={styles.text}>ID: {item.id}</Text>
              <Text style={styles.text}>Date: {item.date}</Text>
              <Text style={styles.text}>Area: {item.area}</Text>
              <Text style={styles.text}>Target Call: {item.targetcall}</Text>
              <Text style={styles.text}>Location: {item.location}</Text>
              <Text style={styles.text}>Approval: {item.approval}</Text>
              <Text style={styles.text}>Closure Date: {item.closuredate}</Text> 
              <TouchableOpacity
                style={styles.touch}
                onPress={() =>
                  navigation.navigate('EditPlanDetails', {
                    item: item,
                    userData: userData,
                  })
                }>
                 <Text style={styles.button}>Edit Details</Text> 
              </TouchableOpacity>
            </View> 
          )}
        />  
      </ScrollView>
      {showStartDatePicker && (
        <DateTimePicker
          minimumDate={nextMonth}
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          disabled={unavailableDates.map(date => new Date(date))}
        />
      )}
    </View>
  );
};

export default MonthPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    color: '#2e509d',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    flexDirection: 'row',
    width: '80%',
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
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '80%',
    color: 'black',
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
  text: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
  },
  inputView2: {
    padding: 10,
    gap: 4,
    marginVertical: 10,
    width: '85%',
    flexDirection: 'column',
    borderWidth: 2,
    borderRadius: 15,
    alignSelf: 'center',
    borderColor: '#2e509d',
  },
  button: {
    color: '#2e509d',
    fontSize: 18,
    fontWeight: '700',
  },
  touch: {
    backgroundColor: '#f08518',
    width: '75%',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
});
