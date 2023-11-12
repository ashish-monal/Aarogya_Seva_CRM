import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../component/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Table, Row} from 'react-native-table-component';
import Axios from 'axios';
import {API_ROUTES, getApiUrl} from '../api/Base';

const TimeSheet = ({navigation, userData}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tableHead] = useState([
    'Date',
    'Sign-In',
    'Sign-Out',
    'Active Hours',
    'New Leads',
    'Follow-Ups',
    'Closed-VE',
    'Closed+VE',
    'Revenue',
  ]);
  const [widthArr] = useState([100, 100, 100, 100, 100, 100, 100, 100, 100]);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchEmployeeStatistics = async () => {
      try {
        const userId = userData.id;
        const startDateString = startDate.toISOString().slice(0, 10);
        const endDateString = endDate.toISOString().slice(0, 10);

        const response = await Axios.post(getApiUrl(API_ROUTES.STATISTICS+userId+"/"+startDateString+"/"+endDateString));
        console.log(response.data, 'line 34');
        if (response.status === 200) {
          setData(response.data);
        } else {
          console.log('Error fetching Data Line 38:', response.status);
        }
      } catch (error) {
        Alert.alert('Error', error.message);
        console.log('An error occured while fetching data: Line 41', error);
      }
    };
    fetchEmployeeStatistics();
  }, [startDate, endDate]);

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  return (
    <>
      <View style={styles.container}>
        <Header navigation={navigation} userData={userData.id} />
        <Text style={styles.title}>Time Sheet Details</Text>
        {/* <View style={styles.view1}>
          <Text style={styles.date}>Select Start Date</Text>
          <View style={{flexDirection: 'row', gap: 15}}>
            <TouchableOpacity
              style={{marginTop: 20}}
              onPress={() => setShowStartDatePicker(true)}>
              <AntDesign name="calendar" size={45} color="black" />
            </TouchableOpacity>
            <View style={styles.inputView}>
              <TextInput
                style={styles.input}
                value={startDate.toISOString().slice(0, 10)}
                editable={false}
                placeholder="Start Date"
                placeholderTextColor="black"
              />
            </View>
            {console.log(startDate.toISOString().slice(0, 10), 'Line 67')}
          </View>
          <Text style={styles.date}>Select End Date</Text>
          <View style={{flexDirection: 'row', gap: 15}}>
            <TouchableOpacity
              style={{marginTop: 20}}
              onPress={() => setShowEndDatePicker(true)}>
              <AntDesign name="calendar" size={45} color="black" />
            </TouchableOpacity>
            <View style={styles.inputView}>
              <TextInput
                value={endDate.toISOString().slice(0, 10)}
                editable={false}
                style={styles.input}
                placeholder="End Date"
                placeholderTextColor="black"
              />
            </View>
          </View>
        </View> */}
<View style={{flexDirection:'row',justifyContent:'space-around',alignContent:'center',alignItems:'center'}} >
        <TouchableOpacity style={styles.inputView}  onPress={() => setShowStartDatePicker(true)}>
        <AntDesign name="calendar" size={45} color="black" />
          <TextInput  placeholder='Choose Start Date' placeholderTextColor="black" value={startDate.toISOString().slice(0,10)} editable={false}/>
        </TouchableOpacity>
        <Text style={{color:'black',fontSize:18}}>
          To
        </Text>
        <TouchableOpacity style={styles.inputView}  onPress={() => setShowEndDatePicker(true)}>
        <AntDesign name="calendar" size={45} color="black" />
          <TextInput  placeholder='Choose End Date' placeholderTextColor="black" value={endDate.toISOString().slice(0,10)} editable={false}/>
        </TouchableOpacity>
      </View>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            maximumDate={new Date()}
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
      </View>
      <View style={styles.container2}>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 2, borderColor: '#2e509d'}}>
              <Row
                data={tableHead}
                widthArr={widthArr}
                style={styles.header}
                textStyle={styles.text}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 2, borderColor: '#2e509d'}}>
                {Object.keys(data).map((date, index) => (
                  <Row
                    key={date}
                    data={[
                      date,
                      formatTime(data[date].firstLoginTime), // Format login time
                      formatTime(data[date].lastLogoutTime), // Format logout time
                      data[date].totalActiveHours,
                      data[date].joblistCount,
                      data[date].followupCount,
                      data[date].negativeFollowupCount,
                      data[date].positiveFollowupCount,
                      data[date].positivePurposeAmountSum,
                    ]}
                    widthArr={widthArr}
                    style={[
                      styles.row,
                      index % 2 && {backgroundColor: 'orange'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default TimeSheet;

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: 'white',
  },
  title: {
    color: '#2e509d',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  inputView: {
    flexDirection: 'row',
    width: '45%',
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'gray',
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '80%',
    color: 'gray',
  },
  date: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  view1: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    borderBottomWidth: 2,
    // marginVertical:25,
  },
  container2: {flex: 0.9, padding: 10},
  header: {height: 50, backgroundColor: '#00bc4c'},
  text: {textAlign: 'center', fontWeight: 'bold', color: 'black'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
});
