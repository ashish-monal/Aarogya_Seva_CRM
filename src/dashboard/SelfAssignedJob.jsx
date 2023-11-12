import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {API_ROUTES, getApiUrl} from '../api/Base';

const SelfAssignedJob = ({navigation, userData}) => {
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
        // Sort the data by date
        const sortedData = data.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
        setJobData(sortedData);
      } else {
        console.log('Error fetching Data Line 17', data.message);
      }
    } catch (error) {
      console.log('Error fetching Data Line 20', error);
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
    item => item.approval === 1 && item.tourstatus !== 1,
  );
  console.log(filteredJobData,"Line 53");

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Self Assigned Job</Text>

      <FlatList
        data={filteredJobData}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({item}) => (
          <View style={styles.inputView}>
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={styles.text}>Area: {item.area}</Text>
            <Text style={styles.text}>Target Call: {item.targetcall}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>
            <Text style={styles.text}>Achievement: {item.achievement}</Text>
            <Text style={styles.text}>Closure Date: {item.closuredate}</Text>
            <TouchableOpacity
              style={styles.touch}
              onPress={() =>
                navigation.navigate('SelfJobAssigned', {
                  item: item,
                  userData: userData,
                })
              }>
              <Text style={styles.button}>Add Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default SelfAssignedJob;

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
    flexDirection: 'column',
    width: '80%',
    alignSelf: 'center',
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
  touch: {
    backgroundColor: 'green',
    width: '75%',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  button: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  text: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
  },
});
